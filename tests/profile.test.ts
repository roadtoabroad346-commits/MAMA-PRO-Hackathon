import { describe, expect, it } from 'vitest';
import raw from '../src/data/catalog.json';
import { catalogSchema } from '../src/domain/catalog';
import { resolveProfile, verificationStatus } from '../src/domain/profile';

const catalog = catalogSchema.parse(raw);
const original = catalog.specialists[0].verificationFacts[0];

describe('public profile selection', () => {
  it('defaults by stable ID, independent of fixture order', () => {
    const result = resolveProfile({ ...catalog, offers: [...catalog.offers].reverse() }, 'S12', null);
    expect(result.kind).toBe('found');
    if (result.kind === 'found') expect([result.offer.id, result.offers.map(o => o.id)]).toEqual(['O12', ['O12', 'O23', 'O24']]);
  });
  it('rejects unknown, wrong-owner, empty, hidden and withdrawn selections without fallback', () => {
    expect(resolveProfile(catalog, 'missing', null).kind).toBe('specialist-not-found');
    for (const id of ['', 'missing', 'O01']) expect(resolveProfile(catalog, 'S12', id).kind).toBe('offer-not-found');
    for (const publicationStatus of ['hidden', 'withdrawn'] as const) {
      const c = structuredClone(catalog);
      c.offers.find(o => o.id === 'O23')!.publicationStatus = publicationStatus;
      expect(resolveProfile(c, 'S12', 'O23').kind).toBe('offer-not-found');
      const result = resolveProfile(c, 'S12', null);
      if (result.kind === 'found') expect(result.offers.some(o => o.id === 'O23')).toBe(false);
      c.specialists.find(s => s.id === 'S12')!.publicationStatus = publicationStatus;
      expect(resolveProfile(c, 'S12', 'O12').kind).toBe('specialist-not-found');
    }
  });
});

describe('evidence cannot become a broader or current guarantee', () => {
  it('document seen stays document seen; source confirmation requires source and date', () => {
    expect(verificationStatus(original, catalog.demoClock)).toBe('DOCUMENT_SEEN');
    const confirmed = { ...original, status: 'SOURCE_CONFIRMED' as const };
    expect(verificationStatus(confirmed, catalog.demoClock)).toBe('SOURCE_CONFIRMED');
    expect(verificationStatus({ ...confirmed, sourceLabel: null }, catalog.demoClock)).toBe('UNVERIFIED');
    expect(verificationStatus({ ...confirmed, checkedAt: null }, catalog.demoClock)).toBe('UNVERIFIED');
  });
  it('expires reviews, refuses future evidence and preserves revocation', () => {
    expect(verificationStatus({ ...original, reviewDueAt: '2026-11-01T00:00:00Z' }, catalog.demoClock)).toBe('STALE');
    expect(verificationStatus({ ...original, checkedAt: '2026-11-15T00:00:00Z' }, catalog.demoClock)).toBe('UNVERIFIED');
    expect(verificationStatus({ ...original, status: 'REVOKED', reviewDueAt: '2020-01-01T00:00:00Z' }, catalog.demoClock)).toBe('REVOKED');
  });
  it('binds offer-data evidence to an existing offer owned by the specialist', () => {
    const c = structuredClone(catalog);
    c.specialists[0].verificationFacts.push({ ...original, scope: 'offer_data', offerId: 'O01' });
    expect(catalogSchema.safeParse(c).success).toBe(true);
    c.specialists[0].verificationFacts[1].offerId = 'O02';
    expect(catalogSchema.safeParse(c).success).toBe(false);
    c.specialists[0].verificationFacts[1].offerId = null;
    expect(catalogSchema.safeParse(c).success).toBe(false);
  });
});
