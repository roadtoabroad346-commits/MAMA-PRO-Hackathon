import { catalogSchema, type Catalog, type Offer } from './catalog';
import { districtApplies, normalizeSearchInput, normalizeSearchText, type Category, type SearchInput } from './contracts';
import { fixedClock, FRESHNESS_POLICY, isFresh, type Clock } from './freshness';
import { applicableFactors, evaluateOffer, type OfferEvaluation, type MatchReason } from './matching';
export { isFresh } from './freshness';
export type { MatchReason as Reason } from './matching';

export interface RatedOffer {
  specialistId: string; selectedOfferId: string; score: number | null; coverage: number | null;
  reasons: MatchReason[]; unknowns: MatchReason[]; mismatches: MatchReason[];
  status: 'exact' | 'incomplete';
}
export type GroupedSearchItem = RatedOffer & { matchingOfferIds: string[] };
export interface SearchResult {
  items: GroupedSearchItem[]; incompleteItems: GroupedSearchItem[];
  specialistCount: number; eligibleOfferCount: number; incompleteSpecialistCount: number; incompleteOfferCount: number;
  mode: 'neutral' | 'personalized'; appliedInputSummary: SearchInput;
  rulesVersion: string; catalogVersion: string; policyVersion: string; evaluatedAt: string;
}
const aliases: Record<Category, readonly string[]> = {
  LOGOPED: ['логопедия', 'сөйлеу терапевті', 'сөйлеу маманы'],
  DEFECTOLOG: ['дефектология', 'арнайы педагог'],
  PSYCHOLOG: ['психология'],
};
// IDs are opaque tie-break keys: compare UTF-16 code units, never host collation.
const compareId = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;

// Validate and strip unrecognized fields before any public candidate evaluation.
export function publicCatalog(raw: Catalog): Catalog {
  const catalog = catalogSchema.parse(raw);
  const ids = new Set(catalog.specialists.filter(s => s.publicationStatus === 'published').map(s => s.id));
  const offers = catalog.offers.filter(o => o.publicationStatus === 'published' && ids.has(o.specialistId));
  const offerIds = new Set(offers.map(o => o.id));
  const specialists = catalog.specialists.filter(s => ids.has(s.id)).map(s => ({ ...s,
    verificationFacts: s.verificationFacts.filter(f => f.scope !== 'offer_data' || offerIds.has(f.offerId!))
      .map(f => ({ ...f, checkedByRole: null })),
  }));
  return { ...catalog, specialists, offers };
}

export class SearchService {
  readonly catalog: Catalog;
  private readonly clock: Clock;
  private readonly textIndex: Map<string, string[]>;
  constructor(catalog: Catalog, clock: Clock = fixedClock(catalog.demoClock)) {
    this.catalog = publicCatalog(catalog);
    this.clock = clock;
    // The service owns a parsed catalog snapshot. Index only each offer's own
    // title/category and its specialist's name; sibling offer facts never enter.
    const specialists = new Map(this.catalog.specialists.map(s => [s.id, s]));
    const categories = new Map(this.catalog.categories.map(c => [c.id, c]));
    this.textIndex = new Map(this.catalog.offers.map(offer => {
      const specialist = specialists.get(offer.specialistId)!;
      const category = categories.get(offer.categoryId)!;
      return [offer.id, [specialist.displayName.ru, specialist.displayName.kk,
        category.label.ru, category.label.kk, offer.title.ru, offer.title.kk,
        ...aliases[offer.categoryId]].map(normalizeSearchText)];
    }));
  }

  // Shared evaluation for profile/compare; no hybrid or fallback selection.
  inspectOffer(raw: SearchInput, offerId: string): RatedOffer | null {
    const input = normalizeSearchInput(raw);
    const now = this.clock.now();
    if (!Number.isFinite(now.getTime())) throw new Error('INVALID_CATALOG_CLOCK');
    const offer = this.catalog.offers.find(o => o.id === offerId && this.textMatches(o.id, normalizeSearchText(input.query)));
    if (!offer) return null;
    const evaluation = this.evaluate(input, offer, { now: () => now });
    return evaluation.eligibility === 'excluded' ? null : this.toRated(evaluation);
  }

  private textMatches(offerId: string, query: string): boolean {
    return !query || (this.textIndex.get(offerId)?.some(text => text.includes(query)) ?? false);
  }

  private evaluate(input: SearchInput, offer: Offer, clock: Clock): OfferEvaluation {
    return evaluateOffer(input, offer, { clock, rulesVersion: this.catalog.rulesVersion, catalogVersion: this.catalog.catalogVersion });
  }

  // Same three-bucket key the comparator used inline before F-02; known
  // matching district ranks first, known mismatch second, unknown last.
  private districtSortKey(input: SearchInput, offer: Offer, clock: Clock): number {
    const evaluation = this.evaluate(input, offer, clock);
    return !evaluation.ranking.known.district ? 2 : offer.districtId === input.districtId ? 0 : 1;
  }

  private toRated(e: OfferEvaluation): RatedOffer {
    return { specialistId: e.specialistId, selectedOfferId: e.offerId, score: e.score, coverage: e.coverage,
      reasons: e.reasons, unknowns: e.unknowns, mismatches: e.mismatches, status: e.eligibility === 'eligible' ? 'exact' : 'incomplete' };
  }

  search(raw: SearchInput, now = this.clock.now()): SearchResult {
    const input = normalizeSearchInput(raw);
    const query = normalizeSearchText(input.query);
    if (!Number.isFinite(now.getTime())) throw new Error('INVALID_CATALOG_CLOCK');
    const eligible: RatedOffer[] = [], incomplete: RatedOffer[] = [];
    const clock: Clock = { now: () => now };
    for (const offer of this.catalog.offers) {
      if (!this.textMatches(offer.id, query)) continue;
      const evaluation = this.evaluate(input, offer, clock);
      if (evaluation.eligibility === 'excluded') continue;
      (evaluation.eligibility === 'eligible' ? eligible : incomplete).push(this.toRated(evaluation));
    }
    const byId = new Map(this.catalog.offers.map(o => [o.id, o]));
    // District keys are evaluated once per offer, not inside the comparator
    // (audit finding F-02): O(n) evaluations instead of O(n log n).
    const districtKeys = input.sort === 'district' && districtApplies(input) && input.districtId !== null
      ? new Map(this.catalog.offers.map(o => [o.id, this.districtSortKey(input, o, clock)]))
      : null;
    const compare = (a: RatedOffer, b: RatedOffer): number => {
      const ao = byId.get(a.selectedOfferId), bo = byId.get(b.selectedOfferId);
      if (!ao || !bo) throw new Error('INVALID_SEARCH_SELECTION');
      if (input.sort === 'price') {
        const priceKey = (o: Offer): [number, number] => !isFresh(o.priceConfirmedAt, now, FRESHNESS_POLICY.days.price) || o.priceKind === 'unknown'
          || !o.fieldSources.price?.sourceKind ? [2, 0] : [o.priceKind === 'from' ? 1 : 0, o.priceAmountKzt ?? 0];
        const [ag, ap] = priceKey(ao), [bg, bp] = priceKey(bo);
        const diff = ag - bg || ap - bp;
        if (diff) return diff;
        return compareId(a.specialistId, b.specialistId) || compareId(a.selectedOfferId, b.selectedOfferId);
      }
      if (districtKeys) {
        const diff = districtKeys.get(ao.id)! - districtKeys.get(bo.id)!;
        if (diff) return diff;
      }
      return (b.score ?? 0) - (a.score ?? 0) || (b.coverage ?? 0) - (a.coverage ?? 0)
        || compareId(a.specialistId, b.specialistId) || compareId(a.selectedOfferId, b.selectedOfferId);
    };
    const group = (offers: RatedOffer[]): GroupedSearchItem[] => {
      const groups = new Map<string, GroupedSearchItem>();
      for (const offer of [...offers].sort(compare)) {
        const existing = groups.get(offer.specialistId);
        if (existing) existing.matchingOfferIds.push(offer.selectedOfferId);
        else groups.set(offer.specialistId, { ...offer, matchingOfferIds: [offer.selectedOfferId] });
      }
      return [...groups.values()];
    };
    const items = group(eligible);
    const exactIds = new Set(items.map(i => i.specialistId));
    const incompleteOnly = incomplete.filter(i => !exactIds.has(i.specialistId));
    const incompleteItems = group(incompleteOnly);
    return {
      items, incompleteItems, specialistCount: items.length, eligibleOfferCount: eligible.length,
      incompleteSpecialistCount: incompleteItems.length, incompleteOfferCount: incompleteOnly.length,
      mode: applicableFactors(input).length === 0 ? 'neutral' : 'personalized',
      appliedInputSummary: input, rulesVersion: this.catalog.rulesVersion, catalogVersion: this.catalog.catalogVersion,
      policyVersion: FRESHNESS_POLICY.version, evaluatedAt: now.toISOString(),
    };
  }
}
