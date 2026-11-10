import { describe, expect, it } from 'vitest';
import raw from '../src/data/catalog.json';
import manifest from '../docs/DEMO_SCENARIOS.json';
import { catalogSchema, type Offer } from '../src/domain/catalog';
import { emptySearchInput, normalizeSearchInput, type SearchInput } from '../src/domain/contracts';
import { fixedClock, fieldFreshness, FRESHNESS_POLICY } from '../src/domain/freshness';
import { applicableFactors, evaluateOffer } from '../src/domain/matching';
import { SearchService } from '../src/domain/SearchService';
import { verificationStatus } from '../src/domain/profile';
import { messages } from '../src/i18n/messages';
import { catalogWithOffers } from './support/catalog';

const catalog = catalogSchema.parse(raw);
const base = emptySearchInput();
const now = Date.parse(catalog.demoClock);
const clock = fixedClock(catalog.demoClock);
const context = { clock, rulesVersion: catalog.rulesVersion, catalogVersion: catalog.catalogVersion };
const offer = catalog.offers[0];
const evaluate = (patch: Partial<Offer>, input: Partial<SearchInput> = {}) => evaluateOffer({ ...base, ...input }, { ...structuredClone(offer), ...patch }, context);

describe('field-level freshness and independent clocks', () => {
  it.each(Object.entries(FRESHNESS_POLICY.days))('%s expires at its own exact TTL', (_field, days) => {
    const at = (offset: number) => new Date(now - days * 86400000 + offset).toISOString();
    expect(fieldFreshness(at(1), clock, days).status).toBe('known_current');
    expect(fieldFreshness(at(0), clock, days).status).toBe('stale');
    expect(fieldFreshness(at(-1), clock, days).status).toBe('stale');
  });
  it.each([null, 'invalid', '2026-02-30T00:00:00Z', '2026-11-15T00:00:00Z'])('%s cannot confirm current evidence', date => {
    expect(fieldFreshness(date, clock, 30).status).toBe('unknown');
  });
  it('not applicable differs from missing, stale and current', () => {
    expect(fieldFreshness(null, clock, 30, false).status).toBe('not_applicable');
    expect(fieldFreshness(null, clock, 30).status).toBe('unknown');
    expect(evaluate({ format: 'online', districtId: null }).freshness.district.status).toBe('not_applicable');
  });
  it('a recent copy/profile update never refreshes price or availability', () => {
    const e = evaluate({ updatedAt: catalog.demoClock,
      priceConfirmedAt: '2026-09-01T00:00:00Z', availabilityConfirmedAt: '2026-10-01T00:00:00Z',
      fieldSources: { ...offer.fieldSources, price: { sourceKind: 'fixture', checkedAt: '2026-09-01T00:00:00Z' }, availability: { sourceKind: 'fixture', checkedAt: '2026-10-01T00:00:00Z' } },
    }, { budgetKzt: 6000, budgetHard: true, availabilityPreferred: true });
    expect(e.eligibility).toBe('incomplete');
    expect(e.freshness.budget.status).toBe('stale');
    expect(e.freshness.availability.status).toBe('stale');
    expect(e.reasons).toEqual([]);
    expect(e.unknowns.map(r => r.code)).toEqual(expect.arrayContaining(['BUDGET_STALE', 'AVAILABILITY_STALE']));
  });
  it('Clock injection changes freshness without changing machine time', () => {
    const service = new SearchService(catalog, fixedClock('2027-01-01T00:00:00Z'));
    const result = service.search({ ...base, budgetKzt: 100000, budgetHard: true });
    expect(result.specialistCount).toBe(0);
    expect(result.incompleteSpecialistCount).toBe(12);
    expect(result.evaluatedAt).toBe('2027-01-01T00:00:00.000Z');
    expect(result.policyVersion).toBe(FRESHNESS_POLICY.version);
  });
  it('contact and document expiry are independent; early revocation wins', () => {
    const original = catalog.specialists[0].verificationFacts[0];
    const fact = { ...original, checkedAt: new Date(now - 31 * 86400000).toISOString(), reviewDueAt: null };
    expect(verificationStatus({ ...fact, scope: 'contact' }, catalog.demoClock)).toBe('STALE');
    expect(verificationStatus({ ...fact, scope: 'education' }, catalog.demoClock)).toBe('DOCUMENT_SEEN');
    expect(verificationStatus({ ...fact, status: 'REVOKED' }, catalog.demoClock)).toBe('REVOKED');
    expect(verificationStatus({ ...fact, reviewDueAt: catalog.demoClock }, catalog.demoClock)).toBe('STALE');
  });
});

describe('request-wide ranking, coverage and same-offer hard evaluation', () => {
  it('catalog boundary normalizes an empty language list to unknown (spec §17.2)', () => {
    const copy = structuredClone(catalog);
    copy.offers[0].languages = [];
    expect(catalogSchema.parse(copy).offers[0].languages).toBeNull();
    expect(new SearchService(copy).inspectOffer({ ...base, serviceLanguage: 'kk' }, 'O01')?.status).toBe('incomplete');
  });
  it.each([
    [['kk'], 'pass'], [['ru'], 'fail'], [[], 'unknown'], [null, 'unknown'],
  ] as const)('mandatory language %j gives %s', (languages, result) => {
    const e = evaluate({ languages: languages === null ? null : [...languages] }, { serviceLanguage: 'kk' });
    expect(e.hardChecks.find(c => c.field === 'language')?.result).toBe(result);
  });
  it.each([['offline', 'pass'], ['online', 'fail'], ['unknown', 'unknown']] as const)('mandatory format %s gives %s', (format, result) => {
    expect(evaluate({ format, districtId: null }, { format: 'offline' }).hardChecks.find(c => c.field === 'format')?.result).toBe(result);
  });
  it('category is hard OR; topic and category use a single need weight', () => {
    const e = evaluate({}, { needTag: 'learning', categoryIds: ['LOGOPED', 'PSYCHOLOG'] });
    expect(e.hardChecks.find(c => c.field === 'category')?.result).toBe('pass');
    expect(e.ranking.denominator).toBe(30);
    expect(e.score).toBe(0);
    expect(e.coverage).toBe(1);
    expect(e.reasons).toHaveLength(0);
    expect(e.mismatches[0].field).toBe('need');
  });
  it('known empty tags differ from unknown/missing-source tags', () => {
    expect(evaluate({ focusTags: [] }, { needTag: 'speech' }).coverage).toBe(1);
    expect(evaluate({ focusTags: null }, { needTag: 'speech' }).coverage).toBe(0);
    expect(evaluate({ fieldSources: {} }, { needTag: 'speech' }).score).toBe(0);
    expect(evaluate({ fieldSources: {} }, { needTag: 'speech' }).reasons).toEqual([]);
  });
  it('known false availability reduces score but preserves coverage', () => {
    const input = { availabilityPreferred: true };
    expect([evaluate({ acceptingEnquiries: false }, input).score, evaluate({ acceptingEnquiries: false }, input).coverage]).toEqual([0, 1]);
    expect([evaluate({ acceptingEnquiries: null }, input).score, evaluate({ acceptingEnquiries: null }, input).coverage]).toEqual([0, 0]);
  });
  it('mixed-format district retains the same denominator for an online offer', () => {
    const input = { ...base, districtId: 'BOSTANDYK' as const, availabilityPreferred: true };
    const offline = evaluateOffer(input, offer, context);
    const online = evaluate({ format: 'online', districtId: null }, input);
    expect(offline.ranking.denominator).toBe(15);
    expect(online.ranking.denominator).toBe(15);
    expect(online.ranking.coefficients.district).toBe(0);
    expect(online.coverage).toBeCloseTo(1 / 3);
    expect(evaluate({ format: 'online', districtId: null }, { ...input, districtHard: true }).eligibility).toBe('excluded');
    expect(applicableFactors({ ...input, format: 'online', formatHard: true })).toEqual(['format', 'availability']);
  });
  it('same specialist A ru/offline/4500 and B kk/online/9500 cannot form kk/offline/6000', () => {
    const offers: Offer[] = [
      { ...structuredClone(offer), id: 'A', languages: ['ru'], format: 'offline', priceAmountKzt: 4500 },
      { ...structuredClone(offer), id: 'B', languages: ['kk'], format: 'online', districtId: null, priceAmountKzt: 9500 },
    ];
    const result = new SearchService(catalogWithOffers(catalog, offers)).search({ ...base, serviceLanguage: 'kk', format: 'offline', budgetKzt: 6000, budgetHard: true });
    expect([result.specialistCount, result.incompleteSpecialistCount]).toEqual([0, 0]);
  });
  it.each([['from', 4500, 'unknown'], ['from', 7000, 'fail'], ['exact', 6000, 'pass'], ['free', 0, 'pass'], ['unknown', null, 'unknown']] as const)
  ('hard6000 price %s/%s → %s', (priceKind, priceAmountKzt, result) => {
    const e = evaluate({ priceKind, priceAmountKzt }, { budgetKzt: 6000, budgetHard: true });
    expect(e.hardChecks.find(c => c.field === 'budget')?.result).toBe(result);
    if (priceKind === 'from') expect(e.coverage).toBe(0);
  });
  it('all reasons carry same-offer evidence, typed RU/KK templates and correct kind', () => {
    const input = { ...base, needTag: 'speech' as const, serviceLanguage: 'kk' as const, format: 'offline' as const, budgetKzt: 6000, availabilityPreferred: true };
    const e = evaluate({}, input);
    expect(e.reasons.find(r => r.field === 'language')).toMatchObject({ kind: 'match', discriminating: false, offerId: 'O01', actual: ['ru', 'kk'] });
    expect(e.reasons.find(r => r.field === 'budget')).toMatchObject({ kind: 'preference', discriminating: true });
    for (const r of [...e.reasons, ...e.unknowns, ...e.mismatches]) {
      expect(r.offerId).toBe(offer.id);
      expect(messages.ru[r.localeKey]).toBeTruthy();
      expect(messages.kk[r.localeKey]).toBeTruthy();
      if (r.kind === 'match' || r.kind === 'preference') expect(r.source).toBeTruthy();
    }
    const changed = evaluate({ languages: null, focusTags: null }, { ...input, languageHard: false });
    expect(changed.reasons.some(r => r.field === 'language' || r.field === 'need')).toBe(false);
    expect(changed.unknowns.map(r => r.field)).toEqual(expect.arrayContaining(['need', 'language']));
  });
});

describe('whole catalog pipeline and stable grouping invariants', () => {
  const service = new SearchService(catalog);
  it.each(Object.entries(manifest.scenarios))('scenario %s preserves agreed IDs', (_name, scenario) => {
    const result = service.search(normalizeSearchInput(scenario.input as SearchInput));
    expect(result.items.map(i => i.selectedOfferId)).toEqual(scenario.expectedExact);
    expect(result.incompleteItems.map(i => i.selectedOfferId)).toEqual(scenario.expectedIncomplete);
  });
  it('ties are stable under reversal; grouping selects best and counts exact specialist once', () => {
    const a = { ...structuredClone(offer), id: 'A' };
    const b = { ...structuredClone(offer), id: 'B' };
    const incomplete = { ...structuredClone(offer), id: 'C', languages: null };
    const input = { ...base, serviceLanguage: 'kk' as const };
    const make = (offers: Offer[]) => new SearchService(catalogWithOffers(catalog, offers)).search(input);
    const result = make([b, incomplete, a]);
    expect(result).toEqual(make([a, incomplete, b]));
    expect(result.items[0].selectedOfferId).toBe('A');
    expect(result.items[0].matchingOfferIds).toEqual(['A', 'B']);
    expect([result.specialistCount, result.eligibleOfferCount, result.incompleteSpecialistCount, result.incompleteOfferCount]).toEqual([1, 2, 0, 0]);
    b.priceAmountKzt = 1000;
    expect(new SearchService(catalogWithOffers(catalog, [a, b])).search({ ...input, budgetKzt: 1000 }).items[0].selectedOfferId).toBe('B');
  });
  it('hidden/withdrawn specialists and offers never enter public candidates', () => {
    const copy = structuredClone(catalog);
    copy.offers[0].publicationStatus = 'hidden';
    copy.specialists[0].categoryIds = [];
    copy.specialists[1].publicationStatus = 'withdrawn';
    const result = new SearchService(copy).search(base);
    expect(result.items.some(i => ['S01', 'S02'].includes(i.specialistId))).toBe(false);
    expect(result.eligibleOfferCount).toBe(18);
  });
  it('invalid catalog is an operation error; private extra fields cannot escape projection', () => {
    const copy = structuredClone(catalog);
    copy.offers[0].priceAmountKzt = -1;
    expect(() => new SearchService(copy)).toThrow();
    const result = new SearchService({ ...catalog, privateDiagnosis: 'PRIVATE_SENTINEL' } as typeof catalog).search(base);
    expect(JSON.stringify(result)).not.toContain('PRIVATE_SENTINEL');
  });
  it('stronger hard input cannot enlarge exact set; permutations and repeated requests agree', () => {
    const inputs: SearchInput[] = [base, { ...base, serviceLanguage: 'kk' }, { ...base, serviceLanguage: 'kk', format: 'offline' }, { ...base, serviceLanguage: 'kk', format: 'offline', budgetKzt: 6000, budgetHard: true }];
    const reversed = new SearchService({ ...catalog, offers: [...catalog.offers].reverse(), specialists: [...catalog.specialists].reverse() });
    let previous = new Set(catalog.offers.map(o => o.id));
    for (const input of inputs) {
      const before = structuredClone(input), fixtureBefore = structuredClone(catalog);
      const result = service.search(input);
      const ids = result.items.flatMap(i => i.matchingOfferIds);
      expect(ids.every(id => previous.has(id))).toBe(true);
      previous = new Set(ids);
      expect(result).toEqual(reversed.search(input));
      expect(result).toEqual(service.search(input));
      expect(input).toEqual(before);
      expect(catalog).toEqual(fixtureBefore);
    }
  });
  it('removing a positive fact cannot improve score or shrink its denominator', () => {
    const input = { ...base, needTag: 'speech' as const, serviceLanguage: 'kk' as const, languageHard: false, availabilityPreferred: true };
    const full = evaluate({}, input);
    for (const patch of [{ languages: null }, { focusTags: null }, { acceptingEnquiries: null }]) {
      const missing = evaluate(patch, input);
      expect(missing.ranking.denominator).toBe(full.ranking.denominator);
      expect(missing.score).toBeLessThan(full.score ?? 0);
      expect(missing.coverage).toBeLessThan(full.coverage ?? 0);
    }
  });
});
