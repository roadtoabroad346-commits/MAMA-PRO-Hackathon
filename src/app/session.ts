import { z } from 'zod';
import { emptySearchInput, searchInputSchema, type SearchInput } from '../domain/contracts';

export const SESSION_KEY = 'qoldau.demo-search';
export const LOCALE_KEY = 'qoldau.locale';
export const SESSION_TTL = 2 * 60 * 60 * 1000;
const snapshotSchema = z.strictObject({
  schemaVersion: z.literal(1), catalogVersion: z.string(), expiresAt: z.number().int(),
  input: searchInputSchema, step: z.number().int().min(1).max(4),
});
export type Step = 1 | 2 | 3 | 4;
export type StorageNotice = 'storageUnavailable' | 'storageReset' | null;
export interface Session {
  input: SearchInput; step: Step; expiresAt: number; notice: StorageNotice;
}

export function restoreSession(storage: Pick<Storage, 'getItem' | 'removeItem'>, catalogVersion: string, now: number): Session {
  const fresh: Session = { input: emptySearchInput(), step: 1, expiresAt: now + SESSION_TTL, notice: null };
  let raw: string | null;
  try { raw = storage.getItem(SESSION_KEY); }
  catch { return { ...fresh, notice: 'storageUnavailable' }; }
  try {
    if (raw === null) return fresh;
    const result = snapshotSchema.safeParse(JSON.parse(raw));
    if (!result.success || result.data.catalogVersion !== catalogVersion || result.data.expiresAt <= now || result.data.expiresAt > now + SESSION_TTL) {
      storage.removeItem(SESSION_KEY);
      return { ...fresh, notice: 'storageReset' };
    }
    return { input: result.data.input, step: result.data.step as Step, expiresAt: result.data.expiresAt, notice: null };
  } catch {
    // Invalid JSON and storage denial have distinct recovery messages.
    try {
      storage.removeItem(SESSION_KEY);
      return { ...fresh, notice: 'storageReset' };
    } catch { return { ...fresh, notice: 'storageUnavailable' }; }
  }
}

export function saveSession(storage: Pick<Storage, 'setItem'>, session: Session, catalogVersion: string): boolean {
  try {
    storage.setItem(SESSION_KEY, JSON.stringify({
      schemaVersion: 1, catalogVersion, expiresAt: session.expiresAt,
      input: searchInputSchema.parse(session.input), step: session.step,
    }));
    return true;
  } catch { return false; }
}
