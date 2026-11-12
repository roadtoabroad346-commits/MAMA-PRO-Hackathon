import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import raw from '../src/data/catalog.json';
import { catalogSchema } from '../src/domain/catalog';
import { DemoRequestService } from '../src/domain/DemoRequestService';
import { demoRequestSchema, offerSnapshot, REQUEST_TTL, UncertainStorageResult, type AttemptStorage, type DemoRequest, type RequestAttempt } from '../src/domain/demoRequest';
import { IndexedDbRequestRepository, REQUEST_DB } from '../src/data/IndexedDbRequestRepository';

const catalog = catalogSchema.parse(raw);
const offer = catalog.offers[0];
const now = Date.parse('2026-11-07T12:00:00Z');
const makeRow = (id = 'request-1', key = 'key-1', age = 0): DemoRequest => ({
  id, idempotencyKey: key, offerId: offer.id, specialistId: offer.specialistId,
  createdAt: new Date(now - age).toISOString(), updatedAt: new Date(now - age).toISOString(),
  catalogVersion: catalog.catalogVersion, status: 'recorded_demo', nonPersonalOfferSnapshot: offerSnapshot(offer),
});
function intents(initial: RequestAttempt | null = null): AttemptStorage {
  let value = initial;
  return { read: () => value, save: next => { value = next; }, clear: () => { value = null; } };
}
let factory: IDBFactory;
let repo: IndexedDbRequestRepository;
beforeEach(() => { vi.restoreAllMocks(); factory = new IDBFactory(); repo = new IndexedDbRequestRepository(() => factory, () => now); });

describe('IndexedDB commit contract', () => {
  it('commits an allowlisted row, unique key and survives a new repository instance', async () => {
    const row = makeRow();
    await expect(repo.add(row)).resolves.toEqual(row);
    const reloaded = new IndexedDbRequestRepository(() => factory, () => now);
    await expect(reloaded.getById(row.id)).resolves.toEqual(row);
    await expect(reloaded.getByIdempotencyKey(row.idempotencyKey)).resolves.toEqual(row);
    expect(Object.keys(row).sort()).toEqual(['catalogVersion', 'createdAt', 'id', 'idempotencyKey', 'nonPersonalOfferSnapshot', 'offerId', 'specialistId', 'status', 'updatedAt']);
    expect(() => demoRequestSchema.parse({ ...row, phone: 'sensitive' })).toThrow();
  });
  it('add request success followed by transaction abort never resolves as saved', async () => {
    const original = IDBObjectStore.prototype.add;
    const spy = vi.spyOn(IDBObjectStore.prototype, 'add').mockImplementation(function (this: IDBObjectStore, ...args) {
      const request = original.apply(this, args);
      request.addEventListener('success', () => this.transaction.abort());
      return request;
    });
    await expect(repo.add(makeRow())).rejects.toBeDefined();
    spy.mockRestore();
    await expect(repo.getById('request-1')).resolves.toBeNull();
  });
  it('concurrent duplicate keys return the original result, including its cancellation', async () => {
    const [one, two] = await Promise.all([repo.add(makeRow()), new IndexedDbRequestRepository(() => factory, () => now).add(makeRow('request-2'))]);
    expect(one).toEqual(two);
    await expect(repo.getById('request-2')).resolves.toBeNull();
    const cancelled = await repo.cancel(one.id);
    await expect(repo.add(makeRow('request-3'))).resolves.toEqual(cancelled);
    await expect(repo.cancel(one.id)).resolves.toEqual(cancelled);
  });
  it('an ID collision with another key is an error, not another successful request', async () => {
    await repo.add(makeRow());
    await expect(repo.add(makeRow('request-1', 'another-key'))).rejects.toHaveProperty('name', 'ConstraintError');
  });
  it('cancel failure rolls back the status; successful cancellation survives reload', async () => {
    const row = await repo.add(makeRow());
    const original = IDBObjectStore.prototype.put;
    const spy = vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, ...args) {
      const request = original.apply(this, args);
      request.addEventListener('success', () => this.transaction.abort());
      return request;
    });
    await expect(repo.cancel(row.id)).rejects.toBeDefined();
    spy.mockRestore();
    expect((await repo.getById(row.id))?.status).toBe('recorded_demo');
    await repo.cancel(row.id);
    expect((await new IndexedDbRequestRepository(() => factory, () => now).getById(row.id))?.status).toBe('cancelled_demo');
  });
  it('unknown/expired IDs are absent; retention uses creation time, with a 7 day boundary', async () => {
    await repo.add(makeRow('expired', 'expired-key', REQUEST_TTL + 1));
    await repo.add(makeRow('boundary', 'boundary-key', REQUEST_TTL));
    await repo.deleteExpired();
    await expect(repo.getById('missing')).resolves.toBeNull();
    await expect(repo.getById('expired')).resolves.toBeNull();
    await expect(repo.cancel('missing')).resolves.toBeNull();
    await expect(repo.cancel('expired')).resolves.toBeNull();
    expect((await repo.getById('boundary'))?.id).toBe('boundary');
  });
  it('clear fails on abort; a committed clear affects only our store', async () => {
    await repo.add(makeRow());
    const foreign = await new Promise<IDBDatabase>((resolve) => {
      const open = factory.open('unrelated-app');
      open.onupgradeneeded = () => open.result.createObjectStore('notes');
      open.onsuccess = () => resolve(open.result);
    });
    const original = IDBObjectStore.prototype.clear;
    const spy = vi.spyOn(IDBObjectStore.prototype, 'clear').mockImplementation(function (this: IDBObjectStore) {
      const request = original.call(this);
      request.addEventListener('success', () => this.transaction.abort()); return request;
    });
    await expect(repo.clear()).rejects.toBeDefined();
    spy.mockRestore();
    expect(await repo.getById('request-1')).not.toBeNull();
    await repo.clear();
    expect(await repo.getById('request-1')).toBeNull();
    expect(foreign.objectStoreNames.contains('notes')).toBe(true); foreign.close();
    expect((await factory.databases()).map(db => db.name)).toContain(REQUEST_DB);
  });
  it('unavailable storage and schema mismatch reject rather than fall back to memory', async () => {
    await expect(new IndexedDbRequestRepository(() => { throw new Error('denied'); }).add(makeRow())).rejects.toBeDefined();
    await new Promise<void>(resolve => {
      const open = factory.open(REQUEST_DB, 1);
      open.onupgradeneeded = () => open.result.createObjectStore('wrong-store');
      open.onsuccess = () => { open.result.close(); resolve(); };
    });
    await expect(repo.getById('request-1')).rejects.toBeDefined();
  });
});

describe('request lifecycle', () => {
  it('requires acknowledgement; double click and replay return one committed result', async () => {
    const storage = intents(); const add = vi.spyOn(repo, 'add');
    const flow = new DemoRequestService(repo, storage, () => now);
    await flow.submit(offer, catalog, false); expect(add).not.toHaveBeenCalled();
    await Promise.all([flow.submit(offer, catalog, true), flow.submit(offer, catalog, true)]);
    const record = flow.getSnapshot().request;
    expect(flow.getSnapshot().phase).toBe('recorded_demo'); expect(add).toHaveBeenCalledTimes(1);
    await flow.submit(offer, catalog, true); expect(flow.getSnapshot().request).toEqual(record); expect(add).toHaveBeenCalledTimes(1);
    const reload = new DemoRequestService(repo, storage, () => now);
    await reload.recover(); expect(reload.getSnapshot().request).toEqual(record); expect(add).toHaveBeenCalledTimes(1);
  });
  it('stays submitting until commit; failure never produces recorded_demo', async () => {
    let reject!: (error: Error) => void;
    vi.spyOn(repo, 'add').mockImplementation(() => new Promise((_resolve, fail) => { reject = fail; }));
    const flow = new DemoRequestService(repo, intents(), () => now);
    const pending = flow.submit(offer, catalog, true);
    await vi.waitFor(() => expect(flow.getSnapshot().phase).toBe('submitting'));
    expect(flow.getSnapshot().request).toBeNull(); reject(new Error('abort')); await pending;
    expect(flow.getSnapshot().phase).toBe('error'); expect(flow.getSnapshot().request).toBeNull();
  });
  it('reconciles uncertain committed writes by the same key without inserting again', async () => {
    const add = repo.add.bind(repo);
    const spy = vi.spyOn(repo, 'add').mockImplementation(async record => { await add(record); throw new UncertainStorageResult(); });
    const reads = vi.spyOn(repo, 'getByIdempotencyKey');
    const flow = new DemoRequestService(repo, intents(), () => now);
    const phases: string[] = []; flow.subscribe(() => phases.push(flow.getSnapshot().phase));
    await flow.submit(offer, catalog, true);
    expect(phases).toContain('checking'); expect(flow.getSnapshot().phase).toBe('recorded_demo');
    expect(reads).toHaveBeenLastCalledWith(flow.getSnapshot().attempt?.idempotencyKey); expect(spy).toHaveBeenCalledTimes(1);
  });
  it('uncertain absent writes retry the same key, while failed checks never permit a blind write', async () => {
    const storage = intents();
    const add = vi.spyOn(repo, 'add').mockRejectedValueOnce(new UncertainStorageResult());
    const flow = new DemoRequestService(repo, storage, () => now);
    await flow.submit(offer, catalog, true); const key = flow.getSnapshot().attempt?.idempotencyKey;
    expect(flow.getSnapshot().phase).toBe('error');
    const read = vi.spyOn(repo, 'getByIdempotencyKey').mockRejectedValueOnce(new Error('read denied'));
    await flow.submit(offer, catalog, true); expect(add).toHaveBeenCalledTimes(1); expect(flow.getSnapshot().error).toBe('requestReadError');
    await flow.submit(offer, catalog, true); expect(add).toHaveBeenCalledTimes(2);
    expect(flow.getSnapshot().request?.idempotencyKey).toBe(key); expect(read).toHaveBeenLastCalledWith(key);
  });
  it('cannot switch offer after an unresolved attempt or write without a persisted recovery intent', async () => {
    const storage = intents(); vi.spyOn(repo, 'add').mockRejectedValue(new Error('abort'));
    const flow = new DemoRequestService(repo, storage, () => now);
    await flow.submit(offer, catalog, true); const first = flow.getSnapshot().attempt;
    vi.spyOn(repo, 'getByIdempotencyKey').mockRejectedValueOnce(new Error('unknown previous outcome'));
    await flow.submit(catalog.offers[1], catalog, true);
    expect(flow.getSnapshot().error).toBe('requestReadError'); expect(flow.getSnapshot().attempt).toEqual(first);
    vi.restoreAllMocks(); const add = vi.spyOn(repo, 'add');
    const blocked = new DemoRequestService(repo, { ...intents(), save: () => { throw new Error('session denied'); } }, () => now);
    await blocked.submit(offer, catalog, true); expect(blocked.getSnapshot().error).toBe('requestIntentError'); expect(add).not.toHaveBeenCalled();
  });
  it('cancellation is terminal on replay; uncertain cancellation is checked', async () => {
    const storage = intents(); const flow = new DemoRequestService(repo, storage, () => now);
    await flow.submit(offer, catalog, true); const row = flow.getSnapshot().request!;
    const cancel = repo.cancel.bind(repo);
    vi.spyOn(repo, 'cancel').mockImplementation(async id => { await cancel(id); throw new UncertainStorageResult(); });
    expect((await flow.cancel(row.id))?.status).toBe('cancelled_demo');
    await flow.submit(offer, catalog, true); expect(flow.getSnapshot().phase).toBe('cancelled_demo');
    expect(flow.getSnapshot().request?.id).toBe(row.id);
  });
  it('an expired attempt is checked first and requires a separate new action if absent', async () => {
    const storage = intents({ offerId: offer.id, specialistId: offer.specialistId, catalogVersion: catalog.catalogVersion, idempotencyKey: 'old-key', startedAt: now - REQUEST_TTL - 1 });
    const read = vi.spyOn(repo, 'getByIdempotencyKey'); const add = vi.spyOn(repo, 'add');
    const flow = new DemoRequestService(repo, storage, () => now);
    await flow.submit(offer, catalog, true);
    expect(read).toHaveBeenCalledWith('old-key'); expect(add).not.toHaveBeenCalled(); expect(flow.getSnapshot().error).toBe('requestExpiredAttempt');
    await flow.submit(offer, catalog, true); expect(flow.getSnapshot().phase).toBe('recorded_demo');
    expect(flow.getSnapshot().request?.idempotencyKey).not.toBe('old-key');
  });
});
