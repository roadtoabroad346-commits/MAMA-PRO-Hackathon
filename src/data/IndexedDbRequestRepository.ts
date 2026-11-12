import { demoRequestSchema, isExpiredRequest, REQUEST_TTL, StorageFailure, UncertainStorageResult, type DemoRequest, type RequestRepository } from '../domain/demoRequest';

export const REQUEST_DB = 'qoldau-demo-v1';
export const REQUEST_STORE = 'requests';

export class IndexedDbRequestRepository implements RequestRepository {
  constructor(private readonly factory: () => IDBFactory = () => indexedDB,
    private readonly now: () => number = Date.now, private readonly timeoutMs = 8000) {}

  private open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      let settled = false;
      const fail = () => { if (!settled) { settled = true; clearTimeout(timer); reject(new StorageFailure('IndexedDB unavailable')); } };
      const timer = setTimeout(fail, this.timeoutMs);
      try {
        const request = this.factory().open(REQUEST_DB, 1);
        request.onupgradeneeded = () => {
          const store = request.result.createObjectStore(REQUEST_STORE, { keyPath: 'id' });
          store.createIndex('idempotencyKey', 'idempotencyKey', { unique: true });
        };
        request.onerror = fail;
        request.onblocked = fail;
        request.onsuccess = () => {
          const db = request.result;
          if (settled) { db.close(); return; }
          try {
            const store = db.transaction(REQUEST_STORE).objectStore(REQUEST_STORE);
            if (store.keyPath !== 'id' || !store.index('idempotencyKey').unique || store.index('idempotencyKey').keyPath !== 'idempotencyKey') throw new Error('Schema mismatch');
          } catch { db.close(); fail(); return; }
          settled = true; clearTimeout(timer);
          db.onversionchange = () => db.close();
          resolve(db);
        };
      } catch { fail(); }
    });
  }

  private async transaction<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore, result: (value: T) => void) => void): Promise<T> {
    const db = await this.open();
    return new Promise<T>((resolve, reject) => {
      let tx: IDBTransaction;
      let value: T;
      let settled = false;
      const finish = (error?: unknown) => {
        db.close(); clearTimeout(timer);
        if (settled) return;
        settled = true;
        if (error) reject(error); else resolve(value);
      };
      // Do not turn a deadline into an abort claim. A write may still commit.
      const timer = setTimeout(() => finish(new UncertainStorageResult('Transaction outcome unknown')), this.timeoutMs);
      try {
        tx = db.transaction(REQUEST_STORE, mode);
        tx.oncomplete = () => finish();
        tx.onabort = () => finish(tx.error ?? new StorageFailure('Transaction aborted'));
        tx.onerror = () => { /* The transaction abort determines the outcome. */ };
        operation(tx.objectStore(REQUEST_STORE), result => { value = result; });
      } catch (error) {
        // Synchronous failures after a queued write must also roll back.
        try { tx!.abort(); } catch { /* No active transaction. */ }
        finish(error);
      }
    });
  }

  private parse(value: unknown): DemoRequest | null {
    if (value === undefined) return null;
    const record = demoRequestSchema.parse(value);
    return isExpiredRequest(record, this.now()) ? null : record;
  }

  async add(input: DemoRequest): Promise<DemoRequest> {
    const record = demoRequestSchema.parse(input);
    try {
      return await this.transaction('readwrite', (store, result) => {
        store.add(record).onsuccess = () => result(record);
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'ConstraintError') {
        const existing = await this.getByIdempotencyKey(record.idempotencyKey);
        if (existing) return existing;
      }
      throw error;
    }
  }

  async getById(id: string) {
    const value = await this.transaction<unknown>('readonly', (store, result) => {
      store.get(id).onsuccess = event => result((event.target as IDBRequest).result);
    });
    return this.parse(value);
  }

  async getByIdempotencyKey(key: string) {
    const value = await this.transaction<unknown>('readonly', (store, result) => {
      store.index('idempotencyKey').get(key).onsuccess = event => result((event.target as IDBRequest).result);
    });
    return this.parse(value);
  }

  async cancel(id: string) {
    return this.transaction<DemoRequest | null>('readwrite', (store, result) => {
      const read = store.get(id);
      read.onsuccess = () => {
        try {
          const record = this.parse(read.result);
          if (!record || record.status === 'cancelled_demo') { result(record); return; }
          const cancelled: DemoRequest = { ...record, status: 'cancelled_demo', updatedAt: new Date(this.now()).toISOString() };
          store.put(cancelled).onsuccess = () => result(cancelled);
        } catch { store.transaction.abort(); }
      };
    });
  }

  async deleteExpired() {
    await this.transaction<void>('readwrite', (store, result) => {
      const cursor = store.openCursor();
      cursor.onsuccess = () => {
        const entry = cursor.result;
        if (!entry) { result(); return; }
        const createdAt = Date.parse(entry.value?.createdAt);
        if (Number.isFinite(createdAt) && this.now() - createdAt > REQUEST_TTL) entry.delete();
        entry.continue();
      };
    });
  }

  async clear() {
    await this.transaction<void>('readwrite', (store, result) => { store.clear().onsuccess = () => result(); });
  }
}
