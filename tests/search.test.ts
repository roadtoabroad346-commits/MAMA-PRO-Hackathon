import { describe, expect, it } from 'vitest';
import raw from '../src/data/catalog.json';
import { catalogSchema } from '../src/domain/catalog';
import { emptySearchInput, normalizeSearchText, searchInputSchema } from '../src/domain/contracts';
import type { SearchInput } from '../src/domain/contracts';
import type { Offer } from '../src/domain/catalog';
import { evaluateOffer } from '../src/domain/matching';
import { SearchService } from '../src/domain/SearchService';

const catalog = catalogSchema.parse(raw);
const service = new SearchService(catalog);
const base = emptySearchInput();

describe('phase 7 search contract', () => {
  it('uses NFKC, case, spacing and ё/е consistently without merging Kazakh letters', () => {
    expect(normalizeSearchText('　 ДЕМО-СПЕЦИАЛИСТ   01　')).toBe('демо-специалист 01');
    expect(service.search({ ...base, query: '  ДЕМО-СПЕЦИАЛИСТ   01 ' }).items.map(i => i.specialistId)).toEqual(['S01']);
    expect(normalizeSearchText('Ё')).toBe(normalizeSearchText('е'));
    for (const [a, b] of [['і', 'и'], ['қ', 'к'], ['ң', 'н'], ['ә', 'а'], ['ө', 'о'], ['ұ', 'ү']]) {
      expect(normalizeSearchText(a)).not.toBe(normalizeSearchText(b));
    }
    const fixture = structuredClone(catalog);
    fixture.specialists[0].displayName.kk = 'Қанат Іңкәр';
    const localized = new SearchService(fixture);
    expect(localized.search({ ...base, query: 'Қанат' }).specialistCount).toBe(1);
    expect(localized.search({ ...base, query: 'Канат' }).specialistCount).toBe(0);
  });
  it('supports only explicit category aliases; unsupported terms give honest zero', () => {
    expect(service.search({ ...base, query: 'сөйлеу терапевті' }).items).toEqual(service.search({ ...base, query: 'Логопед' }).items);
    expect(service.search({ ...base, query: 'арнайы педагог' }).items).toEqual(service.search({ ...base, query: 'Дефектолог' }).items);
    expect(service.search({ ...base, query: 'несуществующая категория' }).specialistCount).toBe(0);
    expect(service.search({ ...base, query: 'аутизм' }).specialistCount).toBe(0);
    expect(searchInputSchema.safeParse({ ...base, query: 'я'.repeat(81) }).success).toBe(false);
  });
  it('OR within categories and AND across groups operate on a single offer', () => {
    const result = service.search({ ...base, categoryIds: ['LOGOPED', 'PSYCHOLOG'], serviceLanguage: 'kk', format: 'offline' });
    expect(result.items.map(i => i.specialistId).sort()).toEqual(['S01', 'S02', 'S03', 'S06', 'S07', 'S10', 'S11']);
    const impossible = service.search({ ...base, query: 'Демо-специалист 12', serviceLanguage: 'kk', format: 'offline' });
    expect([impossible.specialistCount, impossible.incompleteSpecialistCount]).toEqual([0, 0]);
    // O23 is offline/RU; O24 is online/KK. They must never become offline/KK.
  });
  it('incomplete is separate, explained and never includes a hard failure', () => {
    const result = service.search({ ...base, categoryIds: ['LOGOPED'], serviceLanguage: 'kk', format: 'offline', budgetKzt: 6000, budgetHard: true });
    expect(result.incompleteSpecialistCount).toBe(3);
    expect(result.incompleteItems).toHaveLength(3);
    expect(result.incompleteOfferCount).toBe(result.incompleteItems.reduce((sum, i) => sum + i.matchingOfferIds.length, 0));
    for (const item of result.incompleteItems) {
      expect(item.status).toBe('incomplete');
      expect(item.unknowns.length).toBeGreaterThan(0);
      expect(result.items.some(exact => exact.specialistId === item.specialistId)).toBe(false);
      expect(['O02', 'O23', 'O24']).not.toContain(item.selectedOfferId);
    }
    expect(result.items.every(item => item.status === 'exact')).toBe(true);
  });
  it('price chooses a concrete offer, places from/stale after exact and uses stable IDs for ties', () => {
    const result = service.search({ ...base, sort: 'price' });
    expect(result.items[0].selectedOfferId).toBe('O06');
    expect(result.items.find(i => i.specialistId === 'S12')!.selectedOfferId).toBe('O23');
    expect(result.items.at(-1)!.selectedOfferId).toBe('O11');
    expect(result.items.at(-2)!.selectedOfferId).toBe('O10');
    const fixture = structuredClone(catalog);
    for (const id of ['O01', 'O03']) {
      const offer = fixture.offers.find(o => o.id === id)!;
      offer.priceAmountKzt = 5000;
    }
    const tied = new SearchService(fixture).search({ ...base, serviceLanguage: 'kk', sort: 'price' });
    expect(tied.items.findIndex(i => i.specialistId === 'S01')).toBeLessThan(tied.items.findIndex(i => i.specialistId === 'S03'));
  });
  it('district ranks known mismatch before unknown and does not invent distances', () => {
    const result = service.search({ ...base, format: 'offline', districtId: 'BOSTANDYK', sort: 'district' });
    expect(result.items.at(-1)!.selectedOfferId).toBe('O03');
    const inactive = service.search({ ...base, format: 'online', districtId: 'BOSTANDYK', sort: 'district' });
    expect(inactive.items).toEqual(service.search({ ...base, format: 'online' }).items);
  });
  it('district sort keys are precomputed without changing the previous order (F-02)', () => {
    const input = { ...base, format: 'offline', districtId: 'BOSTANDYK', sort: 'district' } satisfies SearchInput;
    const result = service.search(input);
    // Reference: the pre-F-02 comparator, re-evaluating offers inside every
    // comparison. The precomputed-key path must produce the same order.
    const clock = { now: () => new Date(catalog.demoClock) };
    const key = (offer: Offer) => {
      const evaluation = evaluateOffer(input, offer, { clock, rulesVersion: catalog.rulesVersion, catalogVersion: catalog.catalogVersion });
      return !evaluation.ranking.known.district ? 2 : offer.districtId === input.districtId ? 0 : 1;
    };
    const reference = [...result.items].sort((a, b) => {
      const ao = catalog.offers.find(o => o.id === a.selectedOfferId)!;
      const bo = catalog.offers.find(o => o.id === b.selectedOfferId)!;
      const diff = key(ao) - key(bo);
      if (diff) return diff;
      return (b.score ?? 0) - (a.score ?? 0) || (b.coverage ?? 0) - (a.coverage ?? 0)
        || a.specialistId.localeCompare(b.specialistId) || a.selectedOfferId.localeCompare(b.selectedOfferId);
    });
    expect(result.items.map(i => i.selectedOfferId)).toEqual(reference.map(i => i.selectedOfferId));
  });
  it('fixed compare/profile selections are re-evaluated by the same classifier', () => {
    const exact = service.inspectOffer({ ...base, serviceLanguage: 'kk', format: 'offline' }, 'O01');
    expect(exact?.selectedOfferId).toBe('O01');
    expect(exact?.reasons.map(r => r.code)).toEqual(['LANGUAGE_MATCH', 'FORMAT_MATCH']);
    expect(service.inspectOffer({ ...base, format: 'online' }, 'O01')).toBeNull();
    expect(service.inspectOffer(base, 'missing')).toBeNull();
    expect(service.inspectOffer({ ...base, serviceLanguage: 'kk' }, 'O08')?.status).toBe('incomplete');
  });
  it('preserves verification scope and exposes general unknown facts in neutral results', () => {
    expect(catalog.specialists[0].verificationFacts[0].scope).toBe('education');
    expect(catalog.specialists[0].verificationFacts[0].status).toBe('DOCUMENT_SEEN');
    expect(service.inspectOffer(base, 'O08')?.unknowns.map(r => r.code)).toContain('LANGUAGE_UNKNOWN');
    expect(service.inspectOffer(base, 'O10')?.unknowns.map(r => r.code)).toContain('BUDGET_FROM_REQUIRES_CONFIRMATION');
  });
});
