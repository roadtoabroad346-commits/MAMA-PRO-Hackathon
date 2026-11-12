import { describe, expect, it } from 'vitest';
import { DemoRequestService } from '../src/domain/DemoRequestService';
import type { AttemptStorage, RequestRepository } from '../src/domain/demoRequest';
import type { Catalog } from '../src/domain/catalog';
import catalogRaw from '../src/data/catalog.json';

const catalog = catalogRaw as unknown as Catalog;

// In-memory repository standing in for IndexedDB (success path only).
function makeRepo(): RequestRepository {
  const rows = new Map<string, any>();
  return {
    async add(r) { if ([...rows.values()].some(x => x.idempotencyKey === r.idempotencyKey)) throw new Error('dup'); rows.set(r.id, r); return r; },
    async getById(id) { return rows.get(id) ?? null; },
    async getByIdempotencyKey(k) { return [...rows.values()].find(x => x.idempotencyKey === k) ?? null; },
    async cancel(id) { const r = rows.get(id); if (r) { r.status = 'cancelled_demo'; } return r ?? null; },
    async deleteExpired() {},
    async clear() { rows.clear(); },
  };
}

describe('AUDIT F-01 reproduction: corrupted intent storage', () => {
  it('a permanently corrupting intent storage keeps submit unusable (no auto-recovery)', async () => {
    const corrupt: AttemptStorage = {
      read() { throw new Error('malformed'); },
      save() { throw new Error('malformed'); },
      clear() {},
    };
    const service = new DemoRequestService(makeRepo(), corrupt, () => 1_000_000, () => 'uuid-1');
    const offer = catalog.offers[0];
    await service.submit(offer, catalog, true);
    expect(service.getSnapshot().phase).toBe('error');
    expect(service.getSnapshot().error).toBe('requestIntentError');
    // Second click (a new explicit user action) — still blocked, same error.
    await service.submit(offer, catalog, true);
    expect(service.getSnapshot().phase).toBe('error');
    expect(service.getSnapshot().error).toBe('requestIntentError');
    // No record was written anywhere (no false success), but the user is stuck until storage is cleared externally.
    expect(service.getSnapshot().request).toBeNull();
  });
});
