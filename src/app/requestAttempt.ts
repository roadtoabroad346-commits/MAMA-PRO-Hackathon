import { z } from 'zod';
import type { AttemptStorage, RequestAttempt } from '../domain/demoRequest';

export const ATTEMPT_KEY = 'qoldau.demo-request-attempt';
const attemptSchema = z.strictObject({
  schemaVersion: z.literal(1), idempotencyKey: z.string().min(1), offerId: z.string().min(1),
  specialistId: z.string().min(1), catalogVersion: z.string().min(1), startedAt: z.number().int(),
});
export class SessionAttemptStorage implements AttemptStorage {
  read() {
    // Storage denial stays a thrown error (honest requestIntentError); malformed
    // DATA is not a permission problem and must not block every future attempt
    // in this tab (audit finding F-01).
    const raw = sessionStorage.getItem(ATTEMPT_KEY);
    if (raw === null) return null;
    try {
      const { schemaVersion: _version, ...attempt } = attemptSchema.parse(JSON.parse(raw));
      return attempt;
    } catch {
      try { sessionStorage.removeItem(ATTEMPT_KEY); } catch { /* Behave as absent; save denial surfaces separately. */ }
      return null;
    }
  }
  save(attempt: RequestAttempt) { sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify({ schemaVersion: 1, ...attempt })); }
  clear() { sessionStorage.removeItem(ATTEMPT_KEY); }
}
