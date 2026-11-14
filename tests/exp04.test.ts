import { describe, expect, it } from 'vitest';
import raw from '../src/data/catalog.json';
import { catalogSchema, type Catalog, type VerificationFact } from '../src/domain/catalog';
import { publicCatalog, SearchService } from '../src/domain/SearchService';
import { emptySearchInput } from '../src/domain/contracts';
import { fieldFreshness, fixedClock, FRESHNESS_POLICY } from '../src/domain/freshness';
import { resolveProfile, verificationStatus } from '../src/domain/profile';
import { messages } from '../src/i18n/messages';
import { priceText } from '../src/i18n/price';

const catalog = catalogSchema.parse(raw);
const now = catalog.demoClock;
const current: VerificationFact = { ...catalog.specialists[0].verificationFacts[0],
  status: 'SOURCE_CONFIRMED', checkedAt: now, reviewDueAt: null };
const daysAgo = (days: number) => new Date(Date.parse(now) - days * 86400000).toISOString();

describe('EXP04 exact public identity (P04-T01..07,T42,T45)', () => {
  it('explicit IDs are invariant under catalog permutations', () => {
    for (const c of [catalog, { ...catalog, specialists: [...catalog.specialists].reverse(), offers: [...catalog.offers].reverse() }]) {
      const resolved = resolveProfile(c, 'S06', 'O15');
      expect(resolved.kind).toBe('found');
      if (resolved.kind === 'found') expect([resolved.specialist.id, resolved.offer.id, resolved.offer.specialistId]).toEqual(['S06', 'O15', 'S06']);
    }
  });
  it.each(['', '%', '%E0%A4%A', '<script>', 'O01', 'O15/other'])('explicit invalid %s never defaults', id => {
    expect(resolveProfile(catalog, 'S12', id).kind).toBe('offer-not-found');
  });
  it.each(['hidden', 'withdrawn'] as const)('denies %s offers and providers', publicationStatus => {
    const c = structuredClone(catalog);
    c.offers.find(o => o.id === 'O15')!.publicationStatus = publicationStatus;
    expect(resolveProfile(c, 'S06', 'O15').kind).toBe('offer-not-found');
    c.specialists.find(s => s.id === 'S06')!.publicationStatus = publicationStatus;
    expect(resolveProfile(c, 'S06', 'O06').kind).toBe('specialist-not-found');
  });
  it('stable default uses opaque ordinal IDs independent of runtime locale', () => {
    const c = structuredClone(catalog);
    const sibling = structuredClone(c.offers.find(o => o.id === 'O15')!);
    sibling.id = 'Z'; c.offers.push(sibling);
    c.offers.find(o => o.id === 'O06')!.id = 'a';
    const p = resolveProfile(c, 'S06', null);
    expect(p.kind).toBe('found');
    if (p.kind === 'found') expect(p.offers.map(o => o.id)).toEqual(['O15', 'Z', 'a']);
  });
});

describe('EXP04 trust validity and historical status (P04-T18..24)', () => {
  it.each(['SELF_DECLARED', 'DOCUMENT_SEEN', 'SOURCE_CONFIRMED', 'UNVERIFIED', 'STALE', 'REVOKED'] as const)('never upgrades %s', status => {
    expect(verificationStatus({ ...current, status }, now)).toBe(status);
  });
  it.each([null, 'invalid', '2026-02-30T00:00:00Z', '2026-11-14', '2099-01-01T00:00:00Z'])('invalid/missing/future checkedAt %s is unverified', checkedAt => {
    expect(verificationStatus({ ...current, checkedAt }, now)).toBe('UNVERIFIED');
  });
  it.each(['invalid', '2026-02-30T00:00:00Z', '2026-11-14'])('malformed reviewDueAt %s cannot support current trust', reviewDueAt => {
    expect(verificationStatus({ ...current, reviewDueAt }, now)).toBe('UNVERIFIED');
  });
  it.each([null, { ru: ' ', kk: '\t' }, { ru: 'Source', kk: ' ' }])('missing localized source %j cannot confirm', sourceLabel => {
    expect(verificationStatus({ ...current, sourceLabel }, now)).toBe('UNVERIFIED');
  });
  it.each(['identity', 'contact'] as const)('TTL equality and one millisecond before for %s', scope => {
    const ttl = scope === 'contact' ? FRESHNESS_POLICY.days.contact : FRESHNESS_POLICY.days.verification;
    const checkedAt = daysAgo(ttl);
    expect(verificationStatus({ ...current, scope, checkedAt }, now)).toBe('STALE');
    expect(verificationStatus({ ...current, scope, checkedAt: new Date(Date.parse(checkedAt) + 1).toISOString() }, now)).toBe('SOURCE_CONFIRMED');
  });
  it('review due equality expires; future review stays current', () => {
    expect(verificationStatus({ ...current, reviewDueAt: now }, now)).toBe('STALE');
    expect(verificationStatus({ ...current, reviewDueAt: new Date(Date.parse(now) + 1).toISOString() }, now)).toBe('SOURCE_CONFIRMED');
  });
  it('invalid clock cannot confirm; revoked remains revoked even with malformed dates', () => {
    expect(verificationStatus(current, 'invalid')).toBe('UNVERIFIED');
    expect(verificationStatus({ ...current, status: 'REVOKED', checkedAt: 'invalid', reviewDueAt: 'invalid' }, 'invalid')).toBe('REVOKED');
  });
});

describe('EXP04 public provenance isolation (P04-T25,T26,T34,T46..48)', () => {
  it.each(['hidden', 'withdrawn'] as const)('public projection removes %s offer facts and checking roles', publicationStatus => {
    const c = structuredClone(catalog);
    c.offers.find(o => o.id === 'O15')!.publicationStatus = publicationStatus;
    const s = c.specialists.find(s => s.id === 'S06')!;
    s.verificationFacts.push({ ...current, scope: 'offer_data', offerId: 'O15', checkedByRole: 'PRIVATE-INSPECTOR' });
    s.verificationFacts.push({ ...current, scope: 'identity', checkedByRole: 'PRIVATE-INSPECTOR' });
    Object.assign(s, { internalNotes: 'PRIVATE-NOTE', scanUrl: 'PRIVATE-SCAN', documentNumber: 'PRIVATE-ID' });
    const published = publicCatalog(c);
    const provider = published.specialists.find(s => s.id === 'S06')!;
    expect(provider.verificationFacts.some(f => f.offerId === 'O15')).toBe(false);
    expect(JSON.stringify(published)).not.toMatch(/PRIVATE-/u);
    expect(c.specialists.find(s => s.id === 'S06')!.verificationFacts.at(-1)!.checkedByRole).toBe('PRIVATE-INSPECTOR');
  });
  it('adding sibling or changing provider facts never creates offer evidence', () => {
    const c = structuredClone(catalog);
    const s = c.specialists.find(s => s.id === 'S06')!;
    s.verificationFacts.push({ ...current, scope: 'offer_data', offerId: 'O06' });
    const before = new SearchService(c).inspectOffer(emptySearchInput(), 'O15');
    c.offers.push({ ...c.offers.find(o => o.id === 'O15')!, id: 'O-new' });
    s.verificationFacts.push({ ...current, scope: 'identity' });
    const after = new SearchService(c).inspectOffer(emptySearchInput(), 'O15');
    expect(after).toEqual(before);
    expect(publicCatalog(c).specialists.find(s => s.id === 'S06')!.verificationFacts.filter(f => f.offerId === 'O15')).toEqual([]);
  });
  it('schema rejects wrong-owner/missing scope and malformed dates; old optional fields remain compatible', () => {
    const c = structuredClone(catalog);
    c.specialists[0].verificationFacts.push({ ...current, scope: 'offer_data', offerId: 'O15' });
    expect(catalogSchema.safeParse(c).success).toBe(false);
    c.specialists[0].verificationFacts.pop();
    c.specialists[0].verificationFacts[0].checkedAt = 'invalid';
    expect(catalogSchema.safeParse(c).success).toBe(false);
    const legacy = structuredClone(raw) as unknown as Catalog;
    delete (legacy.specialists[0].verificationFacts[0] as Partial<VerificationFact>).sourceLabel;
    expect(catalogSchema.safeParse(legacy).success).toBe(true);
  });
});

describe('EXP04 terms and dates (P04-T11..17)', () => {
  it.each(['ru', 'kk'] as const)('%s keeps unknown/free/amount distinct and Almaty date rollover correct', locale => {
    const t = (key: keyof typeof messages.ru, values?: Record<string, string | number>) => Object.entries(values ?? {}).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), messages[locale][key] as string);
    expect(priceText('unknown', null, locale, t)).toBe(t('priceUnknown'));
    expect(priceText('free', 0, locale, t)).toBe(t('priceFree'));
    expect(priceText('exact', 9500, locale, t)).toBe(t('priceExact', { amount: new Intl.NumberFormat(locale).format(9500) }));
    const f = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'Asia/Almaty' });
    expect(f.format(new Date('2026-11-12T20:00:00Z'))).toBe(f.format(new Date('2026-11-13T00:00:00+05:00')));
  });
  it.each(['price', 'availability'] as const)('%s expires at its own threshold; future is unknown', field => {
    expect(fieldFreshness(daysAgo(FRESHNESS_POLICY.days[field]), fixedClock(now), FRESHNESS_POLICY.days[field]).status).toBe('stale');
    expect(fieldFreshness('2099-01-01T00:00:00Z', fixedClock(now)).status).toBe('unknown');
  });
});
