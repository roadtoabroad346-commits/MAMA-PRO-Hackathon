import { z } from 'zod';
import type { Offer } from './catalog';

export const REQUEST_TTL = 7 * 24 * 60 * 60 * 1000;
const timestamp = z.iso.datetime({ offset: true });
export const demoRequestSchema = z.strictObject({
  id: z.string().min(1), idempotencyKey: z.string().min(1),
  offerId: z.string().min(1), specialistId: z.string().min(1),
  status: z.enum(['recorded_demo', 'cancelled_demo']),
  createdAt: timestamp, updatedAt: timestamp, catalogVersion: z.string().min(1),
  nonPersonalOfferSnapshot: z.strictObject({
    title: z.strictObject({ ru: z.string(), kk: z.string() }),
    priceKind: z.enum(['exact', 'from', 'free', 'unknown']), priceAmountKzt: z.number().int().nonnegative().nullable(),
    currency: z.literal('KZT'), unit: z.enum(['individual_session', 'group_session', 'consultation']),
    durationMinutes: z.number().int().positive().nullable(), languages: z.array(z.enum(['ru', 'kk'])).nullable(),
    format: z.enum(['offline', 'online', 'unknown']), priceConfirmedAt: timestamp.nullable(),
  }),
});
export type DemoRequest = z.infer<typeof demoRequestSchema>;
export type RequestPhase = 'draft' | 'submitting' | 'checking' | 'recorded_demo' | 'error' | 'cancelled_demo';
export interface RequestAttempt {
  idempotencyKey: string; offerId: string; specialistId: string; catalogVersion: string; startedAt: number;
}
export interface AttemptStorage {
  read(): RequestAttempt | null;
  save(attempt: RequestAttempt): void;
  clear(): void;
}
export const isExpiredAttempt = (attempt: RequestAttempt, now: number) => now - attempt.startedAt > 2 * 60 * 60 * 1000;
export function offerSnapshot(offer: Offer): DemoRequest['nonPersonalOfferSnapshot'] {
  // Explicit allowlist: never spread the offer, search input, or family context.
  return {
    title: { ru: offer.title.ru, kk: offer.title.kk }, priceKind: offer.priceKind,
    priceAmountKzt: offer.priceAmountKzt, currency: 'KZT', unit: offer.unit,
    durationMinutes: offer.durationMinutes, languages: offer.languages && [...offer.languages],
    format: offer.format, priceConfirmedAt: offer.priceConfirmedAt,
  };
}
export const isExpiredRequest = (record: DemoRequest, now: number) => now - Date.parse(record.createdAt) > REQUEST_TTL;

export class StorageFailure extends Error {}
export class UncertainStorageResult extends StorageFailure {}
export interface RequestRepository {
  add(record: DemoRequest): Promise<DemoRequest>;
  getById(id: string): Promise<DemoRequest | null>;
  getByIdempotencyKey(key: string): Promise<DemoRequest | null>;
  cancel(id: string): Promise<DemoRequest | null>;
  deleteExpired(): Promise<void>;
  clear(): Promise<void>;
}
