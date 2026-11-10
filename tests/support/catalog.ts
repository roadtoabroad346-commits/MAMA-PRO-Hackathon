import { catalogSchema, type Catalog, type Offer } from '../../src/domain/catalog';

// Keep isolated fixtures structurally valid, including category aggregates/FKs.
export function catalogWithOffers(catalog: Catalog, offers: Offer[]): Catalog {
  const specialists = catalog.specialists.filter(s => offers.some(o => o.specialistId === s.id)).map(s => ({
    ...s, categoryIds: [...new Set(offers.filter(o => o.specialistId === s.id && o.publicationStatus === 'published').map(o => o.categoryId))],
    verificationFacts: s.verificationFacts.filter(f => f.offerId === null || offers.some(o => o.id === f.offerId)),
  }));
  return catalogSchema.parse({ ...catalog, offers, specialists });
}
