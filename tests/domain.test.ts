import { describe, expect, it } from 'vitest';
import rawCatalog from '../src/data/catalog.json';
import { catalogSchema } from '../src/domain/catalog';
import { emptySearchInput, parseBudget, searchInputSchema } from '../src/domain/contracts';
import { SearchService } from '../src/domain/SearchService';
import { messages } from '../src/i18n/messages';

const catalog = catalogSchema.parse(rawCatalog);
const service = new SearchService(catalog);
const base = emptySearchInput();

describe('budget contract: skip ≠ zero', () => {
  it.each([
    ['', null, null], ['   ', null, null], ['0', 0, null], ['6000', 6000, null], ['100000', 100000, null],
    ['100001', null, 'budgetLimit'], ['9007199254740992', null, 'budgetLimit'],
    ['-1', null, 'budgetNegative'], ['6.5', null, 'budgetInteger'], ['abc', null, 'budgetInteger'],
    ['1e3', null, 'budgetInteger'], ['6 000', null, 'budgetInteger'], ['0x10', null, 'budgetInteger'],
  ])('%j → value %j, error %j', (raw, value, error) => {
    expect(parseBudget(raw as string)).toEqual({ value, error });
  });
  it('rejects invalid enums and extra personal fields', () => {
    expect(searchInputSchema.safeParse({ ...base, ageGroup: 'AGE_2_4' }).success).toBe(false);
    expect(searchInputSchema.safeParse({ ...base, serviceLanguage: 'kz' }).success).toBe(false);
    expect(searchInputSchema.safeParse({ ...base, childName: 'demo' }).success).toBe(false);
    expect(searchInputSchema.safeParse({ ...base, budgetKzt: -1 }).success).toBe(false);
  });
});

describe('same SearchService for review and catalog; phase-0 oracle', () => {
  it('neutral is 12 specialists / 20 offers, with no invented preference', () => {
    const result = service.search(base);
    expect([result.specialistCount, result.eligibleOfferCount]).toEqual([12, 20]);
    expect(result.items.every(item => item.score === null && item.coverage === null)).toBe(true);
    expect(result.appliedInputSummary).toEqual(base);
  });
  it('A orders offers by declared conditions and never combines two offers', () => {
    const result = service.search({ ...base, needTag: 'speech', ageGroup: 'AGE_3_5', serviceLanguage: 'kk',
      format: 'offline', budgetKzt: 6000, districtId: 'BOSTANDYK', availabilityPreferred: true });
    expect(result.items.map(item => item.selectedOfferId)).toEqual(['O01', 'O03', 'O02', 'O11', 'O10']);
    expect(result.items.map(item => item.score)).toEqual([100, 85, 82.5, 80, 75]);
    expect(result.incompleteSpecialistCount).toBe(2);
  });
  it('B excludes unknown final prices from strict matches', () => {
    const result = service.search({ ...base, categoryIds: ['LOGOPED'], serviceLanguage: 'kk',
      format: 'offline', budgetKzt: 6000, budgetHard: true });
    expect(result.items.map(item => item.selectedOfferId)).toEqual(['O01', 'O03', 'O06', 'O07']);
    expect(result.incompleteSpecialistCount).toBe(3);
  });
  it('C stays empty until the user changes conditions', () => {
    const input = { ...base, serviceLanguage: 'kk' as const, format: 'offline' as const, budgetKzt: 1000, budgetHard: true };
    const result = service.search(input);
    expect(result.specialistCount).toBe(0);
    expect(result.incompleteSpecialistCount).toBe(1);
    expect(result.appliedInputSummary).toEqual(input);
  });
  it('0 is a real hard budget; no automatic clear or fallback', () => {
    expect(service.search({ ...base, budgetKzt: 0, budgetHard: true }).specialistCount).toBe(0);
    expect(service.search({ ...base, budgetKzt: null, budgetHard: true }).specialistCount).toBe(12);
  });
  it('keeps online-only district inactive but applies it to mixed requests (ADR-0012)', () => {
    const online = { ...base, format: 'online' as const };
    expect(service.search(online).items).toEqual(service.search({ ...online, districtId: 'BOSTANDYK', districtHard: true }).items);
    expect(service.search({ ...online, districtId: 'BOSTANDYK' }).appliedInputSummary.districtId).toBe('BOSTANDYK');
    expect(service.search({ ...base, districtId: 'MEDEU', districtHard: true }).items.map(i => i.selectedOfferId)).toEqual(['O17', 'O10']);
  });
  it('language and format preferences retain alternatives', () => {
    const hard = service.search({ ...base, serviceLanguage: 'kk', format: 'offline' });
    const soft = service.search({ ...base, serviceLanguage: 'kk', languageHard: false, format: 'offline', formatHard: false });
    expect(soft.specialistCount).toBeGreaterThan(hard.specialistCount);
  });
  it('validates catalog rather than silently counting broken records', () => {
    const broken = structuredClone(rawCatalog);
    broken.offers[0].specialistId = 'missing';
    expect(catalogSchema.safeParse(broken).success).toBe(false);
    broken.offers[0].specialistId = 'S01';
    broken.offers[0].fieldSources.price.checkedAt = null as unknown as string;
    expect(catalogSchema.safeParse(broken).success).toBe(false);
  });
});

it('RU/KK keys and named placeholders agree', () => {
  expect(Object.keys(messages.ru).sort()).toEqual(Object.keys(messages.kk).sort());
  for (const key of Object.keys(messages.ru) as (keyof typeof messages.ru)[]) {
    const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/gu)].map(m => m[1]).sort();
    expect(placeholders(messages.ru[key]), key).toEqual(placeholders(messages.kk[key]));
  }
});
