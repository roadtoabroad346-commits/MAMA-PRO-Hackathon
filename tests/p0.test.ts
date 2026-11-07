import { describe, expect, it } from 'vitest';
import raw from '../src/data/catalog.json';
import { catalogSchema, type Offer } from '../src/domain/catalog';
import { AGE_RANGES, emptySearchInput, type SearchInput } from '../src/domain/contracts';
import { SearchService } from '../src/domain/SearchService';

const catalog = catalogSchema.parse(raw);
const base = emptySearchInput();
function classify(patch: Partial<Offer>, input: Partial<SearchInput>) {
  const offer = { ...structuredClone(catalog.offers[0]), ...patch };
  const service = new SearchService({ ...catalog, offers: [offer] });
  const result = service.search({ ...base, ...input });
  return { status: result.items.length ? 'exact' : result.incompleteItems.length ? 'incomplete' : 'excluded', result };
}

describe('P0 boundary proof independent of production classifier', () => {
  for (const [ageGroup, [min, max]] of Object.entries(AGE_RANGES)) {
    it(`${ageGroup}: inclusive endpoints, partial overlap and unknown are not exact`, () => {
      const input = { ageGroup: ageGroup as SearchInput['ageGroup'] };
      expect(classify({ ageMinMonths: min, ageMaxMonths: max }, input).status).toBe('exact');
      expect(classify({ ageMinMonths: min + 1, ageMaxMonths: max }, input).status).toBe('incomplete');
      expect(classify({ ageMinMonths: min, ageMaxMonths: max - 1 }, input).status).toBe('incomplete');
      expect(classify({ ageMinMonths: null, ageMaxMonths: max }, input).status).toBe('incomplete');
      if (min > 0) expect(classify({ ageMinMonths: 0, ageMaxMonths: min - 1 }, input).status).toBe('excluded');
      if (max < 215) expect(classify({ ageMinMonths: max + 1, ageMaxMonths: 215 }, input).status).toBe('excluded');
    });
  }
  it.each([
    ['exact', 6000, 'exact'], ['exact', 6001, 'excluded'],
    ['from', 6000, 'incomplete'], ['from', 6001, 'excluded'],
    ['unknown', null, 'incomplete'], ['free', 0, 'exact'],
  ] as const)('hard budget6000 with %s/%s → %s', (priceKind, priceAmountKzt, status) => {
    expect(classify({ priceKind, priceAmountKzt }, { budgetKzt: 6000, budgetHard: true }).status).toBe(status);
  });
  it('hard budget0 accepts only a known free price; empty budget applies no constraint', () => {
    expect(classify({ priceKind: 'free', priceAmountKzt: 0 }, { budgetKzt: 0, budgetHard: true }).status).toBe('exact');
    expect(classify({ priceKind: 'unknown', priceAmountKzt: null }, { budgetKzt: 0, budgetHard: true }).status).toBe('incomplete');
    expect(classify({ priceKind: 'exact', priceAmountKzt: 1 }, { budgetKzt: 0, budgetHard: true }).status).toBe('excluded');
    expect(classify({ priceKind: 'unknown', priceAmountKzt: null }, { budgetKzt: null, budgetHard: true }).status).toBe('exact');
  });
  it.each([[30 * 86400000, 'exact'], [30 * 86400000 + 1, 'incomplete'], [-1, 'incomplete']] as const)
  ('price freshness age %s ms → %s, source metadata is required', (age, status) => {
    const date = new Date(Date.parse(catalog.demoClock) - age).toISOString();
    const fieldSources = { ...catalog.offers[0].fieldSources, price: { sourceKind: 'synthetic_self_reported', checkedAt: date } };
    expect(classify({ priceConfirmedAt: date, fieldSources }, { budgetKzt: 6000, budgetHard: true }).status).toBe(status);
    expect(classify({ priceConfirmedAt: date, fieldSources: { ...fieldSources, price: { sourceKind: 'synthetic_self_reported', checkedAt: null } } }, { budgetKzt: 6000, budgetHard: true }).status).toBe('incomplete');
  });
  it('hard fail never enters incomplete even when another hard field is unknown', () => {
    expect(classify({ languages: ['ru'], priceKind: 'unknown', priceAmountKzt: null }, { serviceLanguage: 'kk', budgetKzt: 6000, budgetHard: true }).status).toBe('excluded');
    const { result } = classify({ languages: null }, { serviceLanguage: 'kk' });
    expect(result.incompleteItems[0].unknowns.map(r => r.code)).toContain('LANGUAGE_UNKNOWN');
    expect(result.incompleteItems[0].reasons.map(r => r.code)).not.toContain('LANGUAGE_MATCH');
  });
  it('isolated reference score/coverage is 100/1, 85/.85, 82.5/1', () => {
    const service = new SearchService({ ...catalog, offers: catalog.offers.filter(o => ['O01', 'O02', 'O03'].includes(o.id)) });
    const result = service.search({ ...base, needTag: 'speech', ageGroup: 'AGE_3_5', serviceLanguage: 'kk', format: 'offline', budgetKzt: 6000, districtId: 'BOSTANDYK', availabilityPreferred: true });
    expect(result.items.map(i => [i.selectedOfferId, i.score, i.coverage])).toEqual([['O01', 100, 1], ['O03', 85, .85], ['O02', 82.5, 1]]);
  });
});
