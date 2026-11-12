import type { Catalog, Offer } from './catalog';
import { isExpiredAttempt, offerSnapshot, UncertainStorageResult, type AttemptStorage, type DemoRequest, type RequestAttempt, type RequestPhase, type RequestRepository } from './demoRequest';

export interface RequestFlowState {
  phase: RequestPhase; request: DemoRequest | null; attempt: RequestAttempt | null;
  error: 'requestStorageError' | 'requestReadError' | 'requestIntentError' | 'requestExpiredAttempt' | null;
}
const freshState = (): RequestFlowState => ({ phase: 'draft', request: null, attempt: null, error: null });

export class DemoRequestService {
  private state = freshState();
  private listeners = new Set<() => void>();
  private operation: Promise<void> | null = null;
  private initialization: Promise<void> | null = null;
  constructor(private readonly repository: RequestRepository, private readonly intents: AttemptStorage,
    private readonly now: () => number = Date.now, private readonly uuid: () => string = () => crypto.randomUUID()) {}
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  getSnapshot = () => this.state;
  private update(patch: Partial<RequestFlowState>) {
    this.state = { ...this.state, ...patch }; this.listeners.forEach(listener => listener());
  }
  initialize() {
    this.initialization ??= this.repository.deleteExpired().catch(error => { this.initialization = null; throw error; });
    return this.initialization;
  }
  private run(action: () => Promise<void>) {
    if (this.operation) return this.operation;
    // Defer action until the synchronous lock is installed (double-click guard).
    this.operation = Promise.resolve().then(action).finally(() => { this.operation = null; });
    return this.operation;
  }
  private accept(record: DemoRequest) { this.update({ phase: record.status, request: record, error: null }); }
  private async check(attempt: RequestAttempt) {
    this.update({ phase: 'checking', attempt, error: null });
    const record = await this.repository.getByIdempotencyKey(attempt.idempotencyKey);
    if (record) {
      if (record.offerId !== attempt.offerId || record.specialistId !== attempt.specialistId || record.catalogVersion !== attempt.catalogVersion) throw new Error('Key binding mismatch');
      this.accept(record);
    }
    return record;
  }
  recover() {
    return this.run(async () => {
      this.update({ phase: 'checking', error: null });
      let attempt: RequestAttempt | null;
      try { attempt = this.intents.read(); }
      catch { this.update({ phase: 'error', error: 'requestIntentError' }); return; }
      try {
        await this.initialize();
        if (attempt && await this.check(attempt)) return;
        this.update({ phase: 'draft', attempt, request: null, error: null });
      } catch { this.update({ phase: 'error', attempt, error: 'requestReadError' }); }
    });
  }
  submit(offer: Offer, catalog: Catalog, acknowledged: boolean) {
    if (!acknowledged) return Promise.resolve();
    return this.run(async () => {
      let attempt: RequestAttempt | null;
      try { attempt = this.intents.read(); }
      catch { this.update({ phase: 'error', error: 'requestIntentError' }); return; }
      try {
        await this.initialize();
        if (attempt) {
          // Every repeat, including reload/timeout, reads the SAME key first.
          const existing = await this.check(attempt);
          const sameSelection = attempt.offerId === offer.id && attempt.specialistId === offer.specialistId && attempt.catalogVersion === catalog.catalogVersion;
          if (sameSelection && existing) return;
          if (!existing && isExpiredAttempt(attempt, this.now())) {
            // The old operation is resolved as absent. Require a separate new click.
            this.intents.clear();
            this.update({ ...freshState(), phase: 'error', error: 'requestExpiredAttempt' }); return;
          }
          // A successful absent read resolves the old outcome too. Only then may
          // an explicit action for another selection start with a new key.
          if (!sameSelection) attempt = null;
        }
        if (!catalog.offers.some(o => o === offer && o.publicationStatus === 'published') ||
          !catalog.specialists.some(s => s.id === offer.specialistId && s.publicationStatus === 'published')) throw new Error('Unavailable offer');
        if (!attempt) {
          attempt = { idempotencyKey: this.uuid(), offerId: offer.id, specialistId: offer.specialistId, catalogVersion: catalog.catalogVersion, startedAt: this.now() };
        }
        // No durable intent => no write. There is no successful in-memory fallback.
        try { this.intents.save(attempt); }
        catch { this.update({ phase: 'error', attempt, error: 'requestIntentError' }); return; }
        this.update({ phase: 'submitting', attempt, request: null, error: null });
        const timestamp = new Date(this.now()).toISOString();
        const row: DemoRequest = {
          id: this.uuid(), idempotencyKey: attempt.idempotencyKey, offerId: attempt.offerId,
          specialistId: attempt.specialistId, catalogVersion: attempt.catalogVersion,
          status: 'recorded_demo', createdAt: timestamp, updatedAt: timestamp,
          nonPersonalOfferSnapshot: offerSnapshot(offer),
        };
        try {
          const saved = await this.repository.add(row);
          if (saved.idempotencyKey !== attempt.idempotencyKey || saved.offerId !== attempt.offerId ||
            saved.specialistId !== attempt.specialistId || saved.catalogVersion !== attempt.catalogVersion) throw new Error('Key binding mismatch');
          this.accept(saved);
        }
        catch (error) {
          if (!(error instanceof UncertainStorageResult)) throw error;
          if (!await this.check(attempt)) this.update({ phase: 'error', error: 'requestStorageError' });
        }
      } catch {
        this.update({ phase: 'error', error: this.state.phase === 'checking' ? 'requestReadError' : 'requestStorageError' });
      }
    });
  }
  async getById(id: string) { await this.initialize(); return this.repository.getById(id); }
  async cancel(id: string) {
    await this.initialize();
    // Reconcile before each cancellation too. Cancelled is terminal and repeatable.
    const previous = await this.repository.getById(id);
    if (!previous || previous.status === 'cancelled_demo') return previous;
    try { return await this.repository.cancel(id); }
    catch (error) {
      if (error instanceof UncertainStorageResult) {
        const checked = await this.repository.getById(id);
        if (checked?.status === 'cancelled_demo') return checked;
      }
      throw error;
    }
  }
  async clear(onCommitted?: () => void) {
    await this.operation;
    await this.initialize();
    await this.repository.clear();
    this.update(freshState());
    onCommitted?.();
    this.intents.clear();
  }
}
