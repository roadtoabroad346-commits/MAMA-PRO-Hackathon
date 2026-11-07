import type { Catalog, Offer } from './catalog';
import { AGE_RANGES, districtApplies, normalizeSearchInput, normalizeSearchText, type Category, type SearchInput } from './contracts';

type Status = 'pass' | 'fail' | 'unknown';
type Factor = 'need' | 'age' | 'language' | 'format' | 'budget' | 'district' | 'availability';
export interface Reason {
  code: string; field: Factor; expected: unknown; actual: unknown;
  evidenceKind: string; checkedAt: string | null; rulesVersion: string; localeKey: string;
}
export interface RatedOffer {
  specialistId: string; selectedOfferId: string; score: number | null; coverage: number | null;
  reasons: Reason[]; unknowns: Reason[];
  status: 'exact' | 'incomplete';
}
export interface SearchResult {
  items: (RatedOffer & { matchingOfferIds: string[] })[];
  specialistCount: number; eligibleOfferCount: number; incompleteSpecialistCount: number;
  incompleteItems: (RatedOffer & { matchingOfferIds: string[] })[];
  incompleteOfferCount: number;
  appliedInputSummary: SearchInput; rulesVersion: string; catalogVersion: string;
}
const WEIGHTS: Record<Factor, number> = { need: 30, age: 15, language: 15, format: 10, budget: 15, district: 10, availability: 5 };
const sourceKeys: Record<Factor, string> = { need: 'focusTags', age: 'ageRange', language: 'languages', format: 'format', budget: 'price', district: 'districtId', availability: 'availability' };
const aliases: Record<Category, readonly string[]> = {
  LOGOPED: ['логопедия', 'сөйлеу терапевті', 'сөйлеу маманы'],
  DEFECTOLOG: ['дефектология', 'арнайы педагог'],
  PSYCHOLOG: ['психология'],
};
export function isFresh(date: string | null, clock: Date, days: number): boolean {
  const age = clock.getTime() - Date.parse(date ?? '');
  return Number.isFinite(age) && age >= 0 && age <= days * 86_400_000;
}

export class SearchService {
  constructor(readonly catalog: Catalog) {}

  // Reuse the classifier for a fixed selection, including an offer that is no
  // longer the best offer for its specialist under the current conditions.
  inspectOffer(input: SearchInput, offerId: string): RatedOffer | null {
    const result = new SearchService({ ...this.catalog, offers: this.catalog.offers.filter(o => o.id === offerId) }).search(input);
    return result.items[0] ?? result.incompleteItems[0] ?? null;
  }

  search(raw: SearchInput, clock = new Date(this.catalog.demoClock)): SearchResult {
    const input = normalizeSearchInput(raw);
    const districtActive = districtApplies(input) && input.districtId !== null;
    const active: Factor[] = [];
    if (input.needTag !== null || input.categoryIds.length) active.push('need');
    if (input.ageGroup !== null) active.push('age');
    if (input.serviceLanguage !== null) active.push('language');
    if (input.format !== null) active.push('format');
    if (input.budgetKzt !== null) active.push('budget');
    if (districtActive) active.push('district');
    if (input.availabilityPreferred) active.push('availability');
    const denominator = active.reduce((sum, factor) => sum + WEIGHTS[factor], 0);
    const eligible: RatedOffer[] = [];
    const incomplete: RatedOffer[] = [];
    const byId = new Map(this.catalog.offers.map(o => [o.id, o]));

    for (const offer of this.catalog.offers) {
      const specialist = this.catalog.specialists.find(s => s.id === offer.specialistId);
      if (!specialist || specialist.publicationStatus !== 'published' || offer.publicationStatus !== 'published') continue;
      const category = this.catalog.categories.find(c => c.id === offer.categoryId);
      if (input.query && ![specialist.displayName.ru, specialist.displayName.kk, category?.label.ru ?? '', category?.label.kk ?? '', ...aliases[offer.categoryId]]
        .some(text => normalizeSearchText(text).includes(normalizeSearchText(input.query)))) continue;
      if (input.categoryIds.length && !input.categoryIds.includes(offer.categoryId)) continue;
      const sourced = (factor: Factor) => {
        const source = offer.fieldSources[sourceKeys[factor]];
        return !!source?.sourceKind && !!source.checkedAt && Date.parse(source.checkedAt) <= clock.getTime();
      };
      const ageRange = input.ageGroup === null ? null : AGE_RANGES[input.ageGroup];
      let age: Status = 'unknown';
      if (sourced('age') && offer.ageMinMonths !== null && offer.ageMaxMonths !== null) {
        age = !ageRange || offer.ageMinMonths <= ageRange[0] && offer.ageMaxMonths >= ageRange[1] ? 'pass'
          : offer.ageMaxMonths < ageRange[0] || offer.ageMinMonths > ageRange[1] ? 'fail' : 'unknown';
      }
      const language: Status = !sourced('language') || !offer.languages?.length ? 'unknown'
        : input.serviceLanguage !== null && offer.languages.includes(input.serviceLanguage) ? 'pass' : 'fail';
      const format: Status = !sourced('format') || offer.format === 'unknown' ? 'unknown'
        : offer.format === input.format ? 'pass' : 'fail';
      const priceKnown = sourced('budget') && isFresh(offer.priceConfirmedAt, clock, 30) && offer.priceAmountKzt !== null;
      const finalPrice = priceKnown && (offer.priceKind === 'exact' || offer.priceKind === 'free');
      let budget: Status = 'unknown';
      if (priceKnown && input.budgetKzt !== null) {
        if (offer.priceAmountKzt! > input.budgetKzt) budget = 'fail';
        else if (finalPrice) budget = 'pass';
      }
      const district: Status = !sourced('district') || offer.districtId === null ? 'unknown'
        : offer.districtId === input.districtId ? 'pass' : 'fail';
      const hard: Status[] = [];
      if (input.ageGroup !== null) hard.push(age);
      if (input.serviceLanguage !== null && input.languageHard) hard.push(language);
      if (input.format !== null && input.formatHard) hard.push(format);
      if (input.budgetKzt !== null && input.budgetHard) hard.push(budget);
      if (districtActive && input.districtHard) hard.push(district);
      if (hard.includes('fail')) continue;
      const status = hard.includes('unknown') ? 'incomplete' : 'exact';

      const availabilityKnown = sourced('availability') && offer.acceptingEnquiries !== null && isFresh(offer.availabilityConfirmedAt, clock, 7);
      const needKnown = input.needTag !== null ? !!offer.focusTags?.length : true;
      const matches: Record<Factor, number> = {
        need: input.needTag !== null ? Number(offer.focusTags?.includes(input.needTag) ?? false) : 1,
        age: Number(age === 'pass'), language: Number(language === 'pass'), format: Number(format === 'pass'),
        budget: !finalPrice || input.budgetKzt === null ? 0 : budget === 'pass' ? 1
          : input.budgetKzt > 0 && offer.priceAmountKzt! <= input.budgetKzt * 1.25 ? 0.5 : 0,
        district: Number(district === 'pass'), availability: Number(availabilityKnown && offer.acceptingEnquiries === true),
      };
      const known: Record<Factor, boolean> = {
        need: needKnown, age: age !== 'unknown', language: language !== 'unknown', format: format !== 'unknown',
        budget: finalPrice, district: district !== 'unknown', availability: availabilityKnown,
      };
      const reasons: Reason[] = [];
      const unknowns: Reason[] = [];
      const expected: Record<Factor, unknown> = { need: input.needTag ?? input.categoryIds, age: input.ageGroup, language: input.serviceLanguage, format: input.format, budget: input.budgetKzt, district: input.districtId, availability: true };
      const actual: Record<Factor, unknown> = { need: input.needTag ? offer.focusTags : offer.categoryId, age: [offer.ageMinMonths, offer.ageMaxMonths], language: offer.languages, format: offer.format, budget: offer.priceAmountKzt, district: offer.districtId, availability: offer.acceptingEnquiries };
      const displayedFactors = [...new Set<Factor>([...active, 'age', 'language', 'format', 'budget', 'availability', ...(offer.format === 'offline' ? ['district' as const] : [])])];
      for (const factor of displayedFactors) {
        if (known[factor] && !active.includes(factor)) continue;
        if (known[factor] && matches[factor] !== 1) continue;
        const code = `${factor.toUpperCase()}_${known[factor] ? 'MATCH' : 'UNKNOWN'}`;
        const fact = offer.fieldSources[sourceKeys[factor]];
        const reason: Reason = { code, field: factor, expected: active.includes(factor) ? expected[factor] : null, actual: actual[factor], evidenceKind: fact?.sourceKind ?? 'synthetic_catalog', checkedAt: fact?.checkedAt ?? null, rulesVersion: this.catalog.rulesVersion, localeKey: `reason.${code}` };
        (known[factor] ? reasons : unknowns).push(reason);
      }
      (status === 'exact' ? eligible : incomplete).push({
        specialistId: specialist.id, selectedOfferId: offer.id,
        status,
        score: denominator ? 100 * active.reduce((sum, f) => sum + WEIGHTS[f] * matches[f], 0) / denominator : null,
        coverage: denominator ? active.reduce((sum, f) => sum + WEIGHTS[f] * Number(known[f]), 0) / denominator : null,
        reasons, unknowns,
      });
    }

    const compare = (a: RatedOffer, b: RatedOffer): number => {
      const ao = byId.get(a.selectedOfferId)!;
      const bo = byId.get(b.selectedOfferId)!;
      if (input.sort === 'price') {
        const priceKey = (o: Offer) => !isFresh(o.priceConfirmedAt, clock, 30) || o.priceKind === 'unknown' ? [2, 0]
          : [o.priceKind === 'from' ? 1 : 0, o.priceAmountKzt ?? 0];
        const [ag, ap] = priceKey(ao); const [bg, bp] = priceKey(bo);
        const diff = ag - bg || ap - bp;
        if (diff) return diff;
        return a.specialistId.localeCompare(b.specialistId) || a.selectedOfferId.localeCompare(b.selectedOfferId);
      } else if (input.sort === 'district' && districtActive) {
        const districtKey = (o: Offer) => !o.districtId || !o.fieldSources.districtId?.checkedAt || Date.parse(o.fieldSources.districtId.checkedAt) > clock.getTime()
          ? 2 : o.districtId === input.districtId ? 0 : 1;
        const diff = districtKey(ao) - districtKey(bo);
        if (diff) return diff;
      }
      return (b.score ?? 0) - (a.score ?? 0) || (b.coverage ?? 0) - (a.coverage ?? 0)
        || a.specialistId.localeCompare(b.specialistId) || a.selectedOfferId.localeCompare(b.selectedOfferId);
    };
    const group = (offers: RatedOffer[]) => {
      const groups = new Map<string, SearchResult['items'][number]>();
      for (const offer of offers.sort(compare)) {
        const existing = groups.get(offer.specialistId);
        if (existing) existing.matchingOfferIds.push(offer.selectedOfferId);
        else groups.set(offer.specialistId, { ...offer, matchingOfferIds: [offer.selectedOfferId] });
      }
      return [...groups.values()];
    };
    const items = group(eligible);
    const exactIds = new Set(items.map(item => item.specialistId));
    const incompleteOnly = incomplete.filter(item => !exactIds.has(item.specialistId));
    const incompleteItems = group(incompleteOnly);
    return {
      items, specialistCount: items.length, eligibleOfferCount: eligible.length,
      incompleteItems, incompleteSpecialistCount: incompleteItems.length, incompleteOfferCount: incompleteOnly.length,
      appliedInputSummary: input, rulesVersion: this.catalog.rulesVersion, catalogVersion: this.catalog.catalogVersion,
    };
  }
}
