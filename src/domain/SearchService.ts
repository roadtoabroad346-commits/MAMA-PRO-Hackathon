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

// Validate and strip unrecognized fields before any public candidate evaluation.
export function publicCatalog(raw: Catalog): Catalog {
  const catalog = catalogSchema.parse(raw);
  const specialists = catalog.specialists.filter(s => s.publicationStatus === 'published');
  const ids = new Set(specialists.map(s => s.id));
  return { ...catalog, specialists, offers: catalog.offers.filter(o => o.publicationStatus === 'published' && ids.has(o.specialistId)) };
}

export class SearchService {
  readonly catalog: Catalog;
  private readonly clock: Clock;
  constructor(catalog: Catalog, clock: Clock = fixedClock(catalog.demoClock)) {
    this.catalog = publicCatalog(catalog);
    this.clock = clock;
  }

  // Shared evaluation for profile/compare; no hybrid or fallback selection.
  inspectOffer(raw: SearchInput, offerId: string): RatedOffer | null {
    const input = normalizeSearchInput(raw);
    const now = this.clock.now();
    const offer = this.catalog.offers.find(o => o.id === offerId && this.textMatches(o, input));
    if (!offer) return null;
    const evaluation = this.evaluate(input, offer, { now: () => now });
    return evaluation.eligibility === 'excluded' ? null : this.toRated(evaluation);
  }

  private textMatches(offer: Offer, input: SearchInput): boolean {
    if (!input.query) return true;
    const specialist = this.catalog.specialists.find(s => s.id === offer.specialistId);
    const category = this.catalog.categories.find(c => c.id === offer.categoryId);
    return [specialist?.displayName.ru ?? '', specialist?.displayName.kk ?? '', category?.label.ru ?? '', category?.label.kk ?? '', ...aliases[offer.categoryId]]
      .some(text => normalizeSearchText(text).includes(normalizeSearchText(input.query)));
  }

  private evaluate(input: SearchInput, offer: Offer, clock: Clock): OfferEvaluation {
    return evaluateOffer(input, offer, { clock, rulesVersion: this.catalog.rulesVersion, catalogVersion: this.catalog.catalogVersion });
  }

  private toRated(e: OfferEvaluation): RatedOffer {
    return { specialistId: e.specialistId, selectedOfferId: e.offerId, score: e.score, coverage: e.coverage,
      reasons: e.reasons, unknowns: e.unknowns, mismatches: e.mismatches, status: e.eligibility === 'eligible' ? 'exact' : 'incomplete' };
  }

  search(raw: SearchInput, now = this.clock.now()): SearchResult {
    const input = normalizeSearchInput(raw);
    if (!Number.isFinite(now.getTime())) throw new Error('INVALID_CATALOG_CLOCK');
    const eligible: RatedOffer[] = [], incomplete: RatedOffer[] = [];
    const clock: Clock = { now: () => now };
    for (const offer of this.catalog.offers) {
      if (!this.textMatches(offer, input)) continue;
      const evaluation = this.evaluate(input, offer, clock);
      if (evaluation.eligibility === 'excluded') continue;
      (evaluation.eligibility === 'eligible' ? eligible : incomplete).push(this.toRated(evaluation));
    }
    const byId = new Map(this.catalog.offers.map(o => [o.id, o]));
    const compare = (a: RatedOffer, b: RatedOffer): number => {
      const ao = byId.get(a.selectedOfferId), bo = byId.get(b.selectedOfferId);
      if (!ao || !bo) throw new Error('INVALID_SEARCH_SELECTION');
      if (input.sort === 'price') {
        const priceKey = (o: Offer): [number, number] => !isFresh(o.priceConfirmedAt, now, FRESHNESS_POLICY.days.price) || o.priceKind === 'unknown'
          || !o.fieldSources.price?.sourceKind ? [2, 0] : [o.priceKind === 'from' ? 1 : 0, o.priceAmountKzt ?? 0];
        const [ag, ap] = priceKey(ao), [bg, bp] = priceKey(bo);
        const diff = ag - bg || ap - bp;
        if (diff) return diff;
        return a.specialistId.localeCompare(b.specialistId) || a.selectedOfferId.localeCompare(b.selectedOfferId);
      }
      if (input.sort === 'district' && districtApplies(input) && input.districtId !== null) {
        const districtKey = (o: Offer) => {
          const e = this.evaluate(input, o, clock);
          return !e.ranking.known.district ? 2 : o.districtId === input.districtId ? 0 : 1;
        };
        const diff = districtKey(ao) - districtKey(bo);
        if (diff) return diff;
      }
      return (b.score ?? 0) - (a.score ?? 0) || (b.coverage ?? 0) - (a.coverage ?? 0)
        || a.specialistId.localeCompare(b.specialistId) || a.selectedOfferId.localeCompare(b.selectedOfferId);
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
