import { afterEach, describe, expect, it, vi } from 'vitest';
import { SessionAttemptStorage, ATTEMPT_KEY } from '../src/app/requestAttempt';
import { DemoRequestService } from '../src/domain/DemoRequestService';
import type { RequestRepository } from '../src/domain/demoRequest';
import catalogRaw from '../src/data/catalog.json';
import type { Catalog } from '../src/domain/catalog';

const catalog = catalogRaw as unknown as Catalog;
const attempt = {
  idempotencyKey: 'key-1', offerId: 'O01', specialistId: 'S01',
  catalogVersion: catalog.catalogVersion, startedAt: 1,
};

function stubSession(initial: Record<string, string>) {
  const data = new Map(Object.entries(initial));
  let getItemWorks = true;
  const storage = {
    getItem: (k: string) => { if (!getItemWorks) throw new Error('denied'); return data.has(k) ? data.get(k)! : null; },
    setItem: (k: string, v: string) => { data.set(k, v); },
    removeItem: (k: string) => { data.delete(k); },
    deny: () => { getItemWorks = false; },
  };
  vi.stubGlobal('sessionStorage', storage);
  return { storage, data };
}

function memoryRepo(): RequestRepository {
  const rows = new Map<string, any>();
  return {
    async add(record) { if ([...rows.values()].some(r => r.idempotencyKey === record.idempotencyKey)) throw new Error('duplicate'); rows.set(record.id, record); return record; },
    async getById(id) { return rows.get(id) ?? null; },
    async getByIdempotencyKey(key) { return [...rows.values()].find(r => r.idempotencyKey === key) ?? null; },
    async cancel(id) { const r = rows.get(id); if (r && r.status !== 'cancelled_demo') { r.status = 'cancelled_demo'; } return r ?? null; },
    async deleteExpired() {},
    async clear() { rows.clear(); },
  };
}

describe('F-01 recovery: malformed attempt data is dropped, storage denial stays honest', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('corrupt JSON is cleared and read returns null', () => {
    const { data } = stubSession({ [ATTEMPT_KEY]: '{not json' });
    const storage = new SessionAttemptStorage();
    expect(storage.read()).toBeNull();
    expect(data.has(ATTEMPT_KEY)).toBe(false);
  });

  it('schema-invalid JSON is cleared and read returns null', () => {
    const { data } = stubSession({ [ATTEMPT_KEY]: JSON.stringify({ schemaVersion: 1, idempotencyKey: 'k', extra: 'personal' }) });
    const storage = new SessionAttemptStorage();
    expect(storage.read()).toBeNull();
    expect(data.has(ATTEMPT_KEY)).toBe(false);
  });

  it('a valid attempt survives unchanged', () => {
    stubSession({ [ATTEMPT_KEY]: JSON.stringify({ schemaVersion: 1, ...attempt }) });
    const storage = new SessionAttemptStorage();
    expect(storage.read()).toEqual(attempt);
  });

  it('after corruption a new explicit submit starts a fresh attempt and records it (no false success)', async () => {
    stubSession({ [ATTEMPT_KEY]: '{"schemaVersion":1,broken' });
    const service = new DemoRequestService(memoryRepo(), new SessionAttemptStorage(), () => 5_000_000, () => 'uuid-fixed');
    const offer = catalog.offers.find(o => o.id === 'O01')!;
    await service.submit(offer, catalog, true);
    expect(service.getSnapshot().phase).toBe('recorded_demo');
    expect(service.getSnapshot().request?.idempotencyKey).toBe('uuid-fixed');
  });

  it('genuine storage denial still reports requestIntentError (unchanged honesty)', async () => {
    const { storage } = stubSession({});
    storage.deny();
    const service = new DemoRequestService(memoryRepo(), new SessionAttemptStorage(), () => 5_000_000, () => 'uuid-2');
    const offer = catalog.offers.find(o => o.id === 'O01')!;
    await service.submit(offer, catalog, true);
    expect(service.getSnapshot().phase).toBe('error');
    expect(service.getSnapshot().error).toBe('requestIntentError');
    expect(service.getSnapshot().request).toBeNull();
  });
});
