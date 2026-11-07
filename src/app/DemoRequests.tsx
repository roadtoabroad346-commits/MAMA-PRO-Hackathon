import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { IndexedDbRequestRepository } from '../data/IndexedDbRequestRepository';
import { DemoRequestService } from '../domain/DemoRequestService';
import { SessionAttemptStorage } from './requestAttempt';
import { useApp } from './AppState';

const Context = createContext<DemoRequestService | null>(null);
export function DemoRequestsProvider({ children }: { children: ReactNode }) {
  const [service] = useState(() => new DemoRequestService(new IndexedDbRequestRepository(), new SessionAttemptStorage()));
  const [failed, setFailed] = useState(false);
  const { t } = useApp();
  const initialize = () => { void service.initialize().then(() => setFailed(false), () => setFailed(true)); };
  useEffect(initialize, [service]);
  return <Context.Provider value={service}>
    {failed && <aside className="storage-warning" role="status"><p>{t('requestMaintenanceError')}</p><button type="button" className="button secondary" onClick={initialize}>{t('retry')}</button></aside>}
    {children}
  </Context.Provider>;
}
export function useDemoRequests() {
  const service = useContext(Context);
  if (!service) throw new Error('DemoRequestsProvider required');
  return service;
}
