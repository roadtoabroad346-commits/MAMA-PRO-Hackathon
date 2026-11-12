import { z } from 'zod';

export interface Clock { now(): Date }
export const fixedClock = (instant: string): Clock => ({ now: () => new Date(instant) });

// Project proposal, not a statutory or clinical standard.
export const FRESHNESS_POLICY = {
  version: 'freshness-v2', status: 'PROPOSAL',
  days: { price: 30, availability: 7, contact: 30, verification: 365 },
} as const;
export type FreshnessStatus = 'known_current' | 'unknown' | 'stale' | 'not_applicable';
export interface FieldFreshness {
  status: FreshnessStatus;
  timestamp: string | null;
  cause: 'current' | 'missing' | 'invalid' | 'future' | 'expired' | 'not_applicable';
  policyVersion: string;
}
const timestampSchema = z.iso.datetime({ offset: true });

export function fieldFreshness(timestamp: string | null, clock: Clock, days?: number, applies = true): FieldFreshness {
  const result = (status: FreshnessStatus, cause: FieldFreshness['cause']): FieldFreshness =>
    ({ status, cause, timestamp, policyVersion: FRESHNESS_POLICY.version });
  if (!applies) return result('not_applicable', 'not_applicable');
  if (timestamp === null) return result('unknown', 'missing');
  const confirmed = Date.parse(timestamp);
  const now = clock.now().getTime();
  if (!timestampSchema.safeParse(timestamp).success || !Number.isFinite(confirmed) || !Number.isFinite(now)) return result('unknown', 'invalid');
  if (confirmed > now) return result('unknown', 'future');
  if (days !== undefined && now - confirmed >= days * 86_400_000) return result('stale', 'expired');
  return result('known_current', 'current');
}

// Kept for existing profile/price views; all callers use the same boundary.
export function isFresh(timestamp: string | null, now: Date, days: number): boolean {
  return fieldFreshness(timestamp, { now: () => now }, days).status === 'known_current';
}
