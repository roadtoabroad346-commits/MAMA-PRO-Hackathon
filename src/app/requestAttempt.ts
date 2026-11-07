import { z } from 'zod';
import type { AttemptStorage, RequestAttempt } from '../domain/demoRequest';

export const ATTEMPT_KEY = 'qoldau.demo-request-attempt';
const attemptSchema = z.strictObject({
  schemaVersion: z.literal(1), idempotencyKey: z.string().min(1), offerId: z.string().min(1),
  specialistId: z.string().min(1), catalogVersion: z.string().min(1), startedAt: z.number().int(),
});
export class SessionAttemptStorage implements AttemptStorage {
  read() {
    const raw = sessionStorage.getItem(ATTEMPT_KEY);
    if (raw === null) return null;
    const { schemaVersion: _version, ...attempt } = attemptSchema.parse(JSON.parse(raw));
    return attempt;
  }
  save(attempt: RequestAttempt) { sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify({ schemaVersion: 1, ...attempt })); }
  clear() { sessionStorage.removeItem(ATTEMPT_KEY); }
}
