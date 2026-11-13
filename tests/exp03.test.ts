import { describe, expect, it } from 'vitest';
import raw from '../src/data/catalog.json';
import { catalogSchema, type Offer } from '../src/domain/catalog';
import { AGE_RANGES, emptySearchInput, normalizeSearchInput, type SearchInput } from '../src/domain/contracts';
import { SearchService } from '../src/domain/SearchService';
import { fixedClock } from '../src/domain/freshness';
import { evaluateOffer } from '../src/domain/matching';
import { messages } from '../src/i18n/messages';
import { catalogWithOffers } from './support/catalog';
import { syntheticCatalog } from './support/syntheticCatalog';

const catalog = catalogSchema.parse(raw);
const base = emptySearchInput();
const context = { clock: fixedClock(catalog.demoClock), rulesVersion: catalog.rulesVersion, catalogVersion: catalog.catalogVersion };
function offer(patch: Partial<Offer> = {}): Offer {
  const value = { ...structuredClone(catalog.offers[0]), ageMinMonths: 0, ageMaxMonths: 215,
    languages: ['ru', 'kk'] as Offer['languages'], format: 'offline' as const, districtId: 'BOSTANDYK' as const,
    focusTags: ['speech'] as Offer['focusTags'], priceKind: 'exact' as const, priceAmountKzt: 6000, acceptingEnquiries: true,
    ...patch };
  return value;
}
const evaluate = (value: Offer, input: Partial<SearchInput>) => evaluateOffer({ ...base, ...input }, value, context);
const service = (offers: Offer[]) => new SearchService(catalogWithOffers(catalog, offers));

describe('EXP-03 candidate isolation and deterministic service contract', () => {
  it.each(['Редкая услуга', 'Ерекше қызмет'])('searches a concrete localized title: %s', query => {
    const a = offer({ id: 'A', title: { ru: 'Редкая услуга', kk: 'Ерекше қызмет' } });
    const b = offer({ id: 'B', title: { ru: 'Другая услуга', kk: 'Басқа қызмет' } });
    const s = service([a, b]);
    expect(s.search({ ...base, query }).items[0]?.matchingOfferIds).toEqual(['A']);
    expect(s.inspectOffer({ ...base, query }, 'B')).toBeNull();
  });
  it('a sibling title cannot lend its query match to an otherwise eligible offer', () => {
    const a = offer({ id: 'A', title: { ru: 'Уникальная услуга', kk: 'Бірегей қызмет' }, languages: ['ru'] });
    const b = offer({ id: 'B', title: { ru: 'Другая услуга', kk: 'Басқа қызмет' }, languages: ['kk'] });
    const result = service([a, b]).search({ ...base, query: 'Уникальная услуга', serviceLanguage: 'kk' });
    expect([result.specialistCount, result.incompleteSpecialistCount]).toEqual([0, 0]);
  });
  it.each(['relevant', 'price', 'district'] as const)('ID ties use ordinal order independent of host locale: %s', sort => {
    const values = ['a', '_', 'A'].map(id => offer({ id }));
    const input = { ...base, sort, districtId: 'BOSTANDYK' as const };
    const result = service(values).search(input);
    expect(result.items[0].matchingOfferIds).toEqual(['A', '_', 'a']);
    expect(result).toEqual(service([...values].reverse()).search(input));
  });
  it('inspect and search both reject an invalid evaluation clock', () => {
    const s = new SearchService(catalog, { now: () => new Date(NaN) });
    expect(() => s.search(base)).toThrow('INVALID_CATALOG_CLOCK');
    expect(() => s.inspectOffer(base, 'O01')).toThrow('INVALID_CATALOG_CLOCK');
  });
  it.each(['.*', "' OR 1=1 --", '<img src=x onerror=alert(1)>', '__proto__'])('treats query as literal text: %s', query => {
    const result = new SearchService(catalog).search({ ...base, query });
    expect([result.specialistCount, result.incompleteSpecialistCount]).toEqual([0, 0]);
    expect(result.appliedInputSummary.query).toBe(query);
  });
  it.each([-1, 0.5, 100001, NaN, Infinity])('rejects invalid budget %s at service boundary', budgetKzt => {
    expect(() => new SearchService(catalog).search({ ...base, budgetKzt })).toThrow();
  });
  it('rejects malformed dates and non-synthetic/publication violations rather than returning general results', () => {
    for (const patch of [{ priceConfirmedAt: '2026-02-30T12:00:00Z' }, { isSynthetic: false }, { publicationStatus: 'unmoderated' }]) {
      const copy = structuredClone(catalog);
      Object.assign(copy.offers[0], patch);
      expect(() => new SearchService(copy)).toThrow();
    }
    expect(() => new SearchService(catalog).search({ ...base, actor: 'admin' } as SearchInput)).toThrow();
  });
});

describe('EXP-03 hard, soft, coverage and boundaries', () => {
  it.each(Object.entries(AGE_RANGES))('requires full inclusive age coverage for %s', (ageGroup, [min, max]) => {
    const input = { ageGroup: ageGroup as SearchInput['ageGroup'] };
    expect(evaluate(offer({ ageMinMonths: min, ageMaxMonths: max }), input).eligibility).toBe('eligible');
    expect(evaluate(offer({ ageMinMonths: min + 1, ageMaxMonths: max }), input).eligibility).toBe('incomplete');
    expect(evaluate(offer({ ageMinMonths: min, ageMaxMonths: max - 1 }), input).eligibility).toBe('incomplete');
    const disjoint = min === 0 ? { ageMinMonths: max + 1, ageMaxMonths: 215 } : { ageMinMonths: 0, ageMaxMonths: min - 1 };
    expect(evaluate(offer(disjoint), input).eligibility).toBe('excluded');
  });
  it.each([
    ['free', 0, 0, 'eligible'], ['unknown', null, 0, 'incomplete'],
    ['exact', 6000, 6000, 'eligible'], ['exact', 6001, 6000, 'excluded'],
    ['from', 6000, 6000, 'incomplete'], ['from', 6001, 6000, 'excluded'],
    ['exact', 100000, 100000, 'eligible'], ['exact', 100001, 100000, 'excluded'],
  ] as const)('price %s/%s, hard budget %s gives %s', (priceKind, priceAmountKzt, budgetKzt, eligibility) => {
    const e = evaluate(offer({ priceKind, priceAmountKzt }), { budgetKzt, budgetHard: true });
    expect(e.eligibility).toBe(eligibility);
    if (priceKind === 'unknown' || priceKind === 'from') expect(e.coverage).toBe(0);
  });
  it('stale free is unknown for hard zero, even with a recent profile update', () => {
    const value = offer({ priceKind: 'free', priceAmountKzt: 0, priceConfirmedAt: '2026-10-01T00:00:00Z', updatedAt: catalog.demoClock });
    value.fieldSources.price.checkedAt = value.priceConfirmedAt;
    const e = evaluate(value, { budgetKzt: 0, budgetHard: true });
    expect(e.eligibility).toBe('incomplete');
    expect(e.unknowns.find(r => r.field === 'budget')?.code).toBe('BUDGET_STALE');
    expect(e.reasons.some(r => r.field === 'budget')).toBe(false);
  });
  it.each(['ageRange', 'languages', 'format', 'districtId', 'price', 'availability'])('missing provenance %s cannot assert a current match', key => {
    const value = offer(); delete value.fieldSources[key];
    const e = evaluate(value, { ageGroup: 'AGE_3_5', serviceLanguage: 'kk', format: 'offline',
      budgetKzt: 6000, budgetHard: true, districtId: 'BOSTANDYK', districtHard: true, availabilityPreferred: true });
    expect(e.coverage).toBeLessThan(1);
    if (key !== 'availability') expect(e.eligibility).toBe('incomplete');
    expect(e.unknowns.length).toBeGreaterThan(0);
  });
  it('future field evidence cannot confirm language or availability', () => {
    const value = offer();
    value.fieldSources.languages.checkedAt = '2027-01-01T00:00:00Z';
    value.availabilityConfirmedAt = '2027-01-01T00:00:00Z';
    value.fieldSources.availability.checkedAt = value.availabilityConfirmedAt;
    const e = evaluate(value, { serviceLanguage: 'kk', availabilityPreferred: true });
    expect(e.eligibility).toBe('incomplete');
    expect(e.reasons).toEqual([]);
    expect(e.unknowns.map(r => r.field)).toEqual(expect.arrayContaining(['language', 'availability']));
  });
  it('uses a common 100-point denominator; false is known and unknown loses both score and coverage', () => {
    const input: Partial<SearchInput> = { needTag: 'speech', ageGroup: 'AGE_3_5', serviceLanguage: 'kk', languageHard: false,
      format: 'offline', budgetKzt: 6000, districtId: 'BOSTANDYK', availabilityPreferred: true };
    const full = evaluate(offer(), input);
    expect([full.ranking.denominator, full.score, full.coverage]).toEqual([100, 100, 1]);
    const partial = evaluate(offer({ languages: null, acceptingEnquiries: false, priceAmountKzt: 7500 }), input);
    expect(partial.ranking.denominator).toBe(100);
    expect(partial.score).toBe(72.5); // language0, availability0, budget7.5 of15
    expect(partial.coverage).toBe(0.85);
    expect(partial.mismatches.map(r => r.field)).toEqual(expect.arrayContaining(['budget', 'availability']));
    expect(partial.unknowns.map(r => r.field)).toContain('language');
    expect(partial.eligibility).toBe('eligible');
    expect(evaluate(offer({ languages: ['ru'] }), { ...input, languageHard: true }).eligibility).toBe('excluded');
  });
  it('hard failure dominates unknown and any number of matching soft preferences', () => {
    const e = evaluate(offer({ languages: ['ru'], priceKind: 'unknown', priceAmountKzt: null }), {
      needTag: 'speech', ageGroup: 'AGE_3_5', serviceLanguage: 'kk', format: 'offline',
      budgetKzt: 6000, budgetHard: true, districtId: 'BOSTANDYK', availabilityPreferred: true });
    expect(e.hardChecks.map(c => c.result)).toEqual(expect.arrayContaining(['fail', 'unknown', 'pass']));
    expect(e.eligibility).toBe('excluded');
  });
});

describe('EXP-03 seeded properties (no new runtime dependency)', () => {
  it('200 adversarial sibling catalogs agree with independent hard-language/format/price oracle, regardless of permutation or soft preferences', () => {
    let seed = 0x03f03760;
    const random = (max: number) => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % max; };
    for (let run = 0; run < 200; run++) {
      const expectedExact: string[] = [], expectedIncomplete: string[] = [];
      const offers = Array.from({ length: 4 }, (_, i) => {
        const lang = random(3), fmt = random(3), price = random(4);
        const id = `P${i}`;
        const states = [lang === 0 ? 'pass' : lang === 1 ? 'fail' : 'unknown', fmt === 0 ? 'pass' : fmt === 1 ? 'fail' : 'unknown',
          price === 0 ? 'pass' : price === 1 ? 'fail' : 'unknown'];
        if (!states.includes('fail')) (states.includes('unknown') ? expectedIncomplete : expectedExact).push(id);
        return offer({ id, languages: lang === 0 ? ['kk'] : lang === 1 ? ['ru'] : null,
          format: fmt === 0 ? 'offline' : fmt === 1 ? 'online' : 'unknown', districtId: null,
          priceKind: price === 2 ? 'from' : price === 3 ? 'unknown' : 'exact', priceAmountKzt: price === 3 ? null : price === 1 ? 6001 : 6000 });
      });
      const input = { ...base, serviceLanguage: 'kk' as const, format: 'offline' as const, budgetKzt: 6000, budgetHard: true,
        needTag: 'speech' as const, availabilityPreferred: true, districtId: 'BOSTANDYK' as const };
      const before = structuredClone(input);
      const result = service(offers).search(input);
      expect(result).toEqual(service([...offers].reverse()).search(input));
      expect(input).toEqual(before);
      expect(result.items.flatMap(i => i.matchingOfferIds).sort()).toEqual(expectedExact);
      expect(result.incompleteItems.flatMap(i => i.matchingOfferIds).sort()).toEqual(expectedExact.length ? [] : expectedIncomplete);
      for (const item of [...result.items, ...result.incompleteItems]) {
        for (const reason of [...item.reasons, ...item.unknowns, ...item.mismatches]) {
          expect(reason.offerId).toBe(item.selectedOfferId);
          expect(messages.ru[reason.localeKey]).toBeTruthy(); expect(messages.kk[reason.localeKey]).toBeTruthy();
        }
      }
      const noSoft = service(offers).search({ ...input, needTag: null, availabilityPreferred: false, districtId: null });
      expect(noSoft.items.flatMap(i => i.matchingOfferIds).sort()).toEqual(expectedExact);
    }
  });
  it('20/100/1000 synthetic fixtures preserve offer counts and repeated stable searches', () => {
    for (const count of [20, 100, 1000]) {
      const s = new SearchService(syntheticCatalog(count));
      const result = s.search(base);
      expect(result.eligibleOfferCount).toBe(count);
      expect(result.specialistCount).toBe(Math.ceil(count / 2));
      expect(result).toEqual(s.search(normalizeSearchInput(base)));
    }
  });
});
