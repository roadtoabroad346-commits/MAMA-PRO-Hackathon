import raw from '../../src/data/catalog.json';
import { catalogSchema, type Catalog } from '../../src/domain/catalog';

// Reproducible synthetic load: two independent offers per specialist, with
// known, unknown, stale, free and lower-bound facts from the demo fixture.
export function syntheticCatalog(count: number): Catalog {
  if (!Number.isSafeInteger(count) || count < 1) throw new Error('INVALID_SYNTHETIC_COUNT');
  const base = catalogSchema.parse(raw);
  const offers = Array.from({ length: count }, (_, i) => ({
    ...structuredClone(base.offers[i % base.offers.length]),
    id: `BENCH-O${String(i).padStart(5, '0')}`,
    specialistId: `BENCH-S${String(Math.floor(i / 2)).padStart(5, '0')}`,
  }));
  const specialists = Array.from({ length: Math.ceil(count / 2) }, (_, i) => {
    const own = offers.slice(i * 2, i * 2 + 2);
    return { ...structuredClone(base.specialists[0]), id: own[0].specialistId,
      displayName: { ru: `Синтетический специалист ${i}`, kk: `Синтетикалық маман ${i}` },
      categoryIds: [...new Set(own.filter(o => o.publicationStatus === 'published').map(o => o.categoryId))],
      verificationFacts: [],
    };
  });
  return { ...base, offers, specialists };
}
