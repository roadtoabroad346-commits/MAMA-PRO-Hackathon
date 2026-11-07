import { useRef, useState } from 'react';
import { useApp } from '../../app/AppState';
import { useDemoRequests } from '../../app/DemoRequests';
import { Modal } from '../../ui/Modal';

export function ClearDemoRequests({ onCleared, onRecheck }: { onCleared?: () => void; onRecheck?: () => void }) {
  const { t } = useApp();
  const service = useDemoRequests();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const busy = useRef(false);
  async function clear() {
    if (busy.current) return;
    busy.current = true; setState('busy');
    try { await service.clear(onCleared); setState('done'); setOpen(false); }
    catch { setState('error'); onRecheck?.(); }
    finally { busy.current = false; }
  }
  return <section className="request-cleanup">
    <p className="help">{t('requestRetention')}</p>
    <button type="button" className="button text-button" onClick={() => { setState('idle'); setOpen(true); }}>{t('requestClear')}</button>
    {state === 'done' && <p role="status">{t('requestCleared')}</p>}
    {open && <Modal titleId="clear-requests-title" onDismiss={() => { if (!busy.current) setOpen(false); }}>
      <h2 id="clear-requests-title">{t('requestClearTitle')}</h2><p>{t('requestClearHelp')}</p>
      {state === 'error' && <p role="alert" className="field-error">{t('requestClearError')}</p>}
      <div className="actions"><button className="button secondary" type="button" disabled={state === 'busy'} onClick={() => setOpen(false)} autoFocus>{t('requestClearKeep')}</button>
        <button className="button danger" type="button" disabled={state === 'busy'} onClick={() => void clear()}>{t(state === 'busy' ? 'requestClearing' : 'requestClearConfirm')}</button></div>
    </Modal>}
  </section>;
}
