import type { Catalog, VerificationFact } from './catalog';
import { fieldFreshness, fixedClock, FRESHNESS_POLICY } from './freshness';

// Explicit invalid/hidden selections never fall back to a different offer.
export function resolveProfile(catalog: Catalog, specialistId: string | undefined, offerId: string | null) {
  const specialist = catalog.specialists.find(s => s.id === specialistId && s.publicationStatus === 'published');
  if (!specialist) return { kind: 'specialist-not-found' } as const;
  const offers = catalog.offers.filter(o => o.specialistId === specialist.id && o.publicationStatus === 'published')
    .sort((a, b) => a.id.localeCompare(b.id));
  const offer = offerId === null ? offers[0] : offers.find(o => o.id === offerId);
  if (!offer) return { kind: 'offer-not-found' } as const;
  return { kind: 'found', specialist, offers, offer } as const;
}

// Historical evidence stays visible, but never confers a current verification.
export function verificationStatus(fact: VerificationFact, demoClock: string): VerificationFact['status'] {
  if (fact.status === 'REVOKED' || fact.status === 'UNVERIFIED') return fact.status;
  if (fact.status === 'STALE') return 'STALE';
  if (!fact.sourceLabel) return 'UNVERIFIED';
  const freshness = fieldFreshness(fact.checkedAt, fixedClock(demoClock), fact.scope === 'contact' ? FRESHNESS_POLICY.days.contact : FRESHNESS_POLICY.days.verification);
  if (freshness.status === 'unknown') return 'UNVERIFIED';
  if (freshness.status === 'stale' || fact.reviewDueAt && Date.parse(fact.reviewDueAt) <= Date.parse(demoClock)) return 'STALE';
  return fact.status;
}
