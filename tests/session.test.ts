import { describe, expect, it } from 'vitest';
import { SESSION_KEY, SESSION_TTL, restoreSession, saveSession } from '../src/app/session';
import { emptySearchInput } from '../src/domain/contracts';

const now = Date.parse('2026-11-07T10:00:00Z');
function storage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); } };
}
describe('synthetic session reload policy', () => {
  it('round-trips null and zero distinctly, plus hard flags and step', () => {
    const store = storage();
    const session = { input: { ...emptySearchInput(), budgetKzt: 0, budgetHard: true, serviceLanguage: 'kk' as const }, step: 4 as const, expiresAt: now + SESSION_TTL, notice: null };
    expect(saveSession(store, session, 'catalog-v1')).toBe(true);
    expect(restoreSession(store, 'catalog-v1', now + 1000)).toEqual(session);
    expect(JSON.parse(store.getItem(SESSION_KEY)!).schemaVersion).toBe(1);
  });
  it.each(['expired', 'schema', 'catalog', 'enum', 'corrupt', 'personal'])('discards %s data with an explanation', reason => {
    const store = storage();
    const snapshot = { schemaVersion: reason === 'schema' ? 2 : 1, catalogVersion: reason === 'catalog' ? 'catalog-v0' : 'catalog-v1',
      expiresAt: reason === 'expired' ? now : now + SESSION_TTL, input: { ...emptySearchInput(), ...(reason === 'enum' ? { format: 'video' } : {}), ...(reason === 'personal' ? { childName: 'demo' } : {}) }, step: 3 };
    store.setItem(SESSION_KEY, reason === 'corrupt' ? '{broken' : JSON.stringify(snapshot));
    store.setItem('unrelated', 'keep');
    const result = restoreSession(store, 'catalog-v1', now);
    expect(result.notice).toBe('storageReset');
    expect(result.input).toEqual(emptySearchInput());
    expect(store.getItem(SESSION_KEY)).toBeNull();
    expect(store.getItem('unrelated')).toBe('keep');
  });
  it('honestly reports read/write denial, with usable memory defaults', () => {
    const denied = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); }, removeItem() { throw new Error('denied'); } };
    const session = restoreSession(denied, 'catalog-v1', now);
    expect(session.notice).toBe('storageUnavailable');
    expect(session.input).toEqual(emptySearchInput());
    expect(saveSession(denied, session, 'catalog-v1')).toBe(false);
  });
});
