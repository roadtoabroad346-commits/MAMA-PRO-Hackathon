import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import { useDemoRequests } from '../../app/DemoRequests';
import type { DemoRequest } from '../../domain/demoRequest';
import { PageTitle } from '../../ui/controls';
import { Modal } from '../../ui/Modal';
import { priceText } from '../../i18n/price';
import { ClearDemoRequests } from './ClearDemoRequests';

export function DemoRequestStatus() {
  const { requestId = '' } = useParams();
  // Reset state and in-flight callbacks if the route ID changes without unmounting.
  return <StatusContent key={requestId} requestId={requestId} />;
}
function StatusContent({ requestId }: { requestId: string }) {
  const { locale, t } = useApp();
  const service = useDemoRequests();
  const [state, setState] = useState<'loading' | 'found' | 'missing' | 'error'>('loading');
  const [record, setRecord] = useState<DemoRequest | null>(null);
  const [revision, setRevision] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [cancelState, setCancelState] = useState<'idle' | 'busy' | 'error'>('idle');
  const lock = useRef(false);
  useEffect(() => {
    let active = true;
    setState('loading');
    service.getById(requestId).then(value => {
      if (!active) return;
      setRecord(value); setState(value ? 'found' : 'missing');
    }, () => { if (active) setState('error'); });
    return () => { active = false; };
  }, [service, requestId, revision]);
  async function cancel() {
    if (lock.current) return;
    lock.current = true; setCancelState('busy');
    try {
      const value = await service.cancel(requestId);
      setRecord(value); setState(value ? 'found' : 'missing'); setConfirm(false); setCancelState('idle');
    } catch { setCancelState('error'); setConfirm(false); }
    finally { lock.current = false; }
  }
  const date = (value: string) => new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Qyzylorda',
  }).format(new Date(value));
  const title = state === 'found' && record ? record.status === 'cancelled_demo' ? 'requestCancelledTitle' : 'requestSavedTitle'
    : state === 'missing' ? 'requestMissing' : state === 'error' ? 'requestStatusReadError' : 'requestStatusTitle';
  return <div className="review-page request-status">
    <PageTitle>{t(title)}</PageTitle>
    <aside className="demo-notice"><span className="badge">{t('demo')}</span><div><p>{t('requestNotSent')}</p><p>{t('requestNoBooking')}</p></div></aside>
    {state === 'loading' && <p role="status">{t('requestLoading')}</p>}
    {state === 'error' && <div role="alert"><p>{t('requestStatusReadHelp')}</p><button type="button" className="button secondary" onClick={() => setRevision(n => n + 1)}>{t('retry')}</button></div>}
    {state === 'missing' && <p>{t('requestMissingHelp')}</p>}
    {state === 'found' && record && <>
      <dl className="summary request-metadata" data-testid="request-metadata" data-status={record.status}>
        <div><dt>{t('requestId')}</dt><dd data-testid="request-id">{record.id}</dd></div>
        <div><dt>{t('requestCreatedAt')}</dt><dd><time dateTime={record.createdAt}>{date(record.createdAt)}</time></dd></div>
        <div><dt>{t('requestUpdatedAt')}</dt><dd><time dateTime={record.updatedAt}>{date(record.updatedAt)}</time></dd></div>
        <div><dt>{t('requestLocalStatus')}</dt><dd>{t(record.status === 'recorded_demo' ? 'requestRecorded' : 'requestCancelled')}</dd></div>
      </dl>
      <section className="profile-panel">
        <h2>{t('requestSnapshot')}</h2><p>{record.nonPersonalOfferSnapshot.title[locale]}</p>
        <p>{t('offerId', { id: record.offerId })} · {record.specialistId}</p>
        <SnapshotFacts snapshot={record.nonPersonalOfferSnapshot} />
        <p className="help">{t('requestSnapshotHelp')}</p>
      </section>
      {cancelState === 'error' && <p className="field-error" role="alert">{t('requestCancelError')}</p>}
      {record.status === 'recorded_demo' && <button className="button secondary" type="button" disabled={cancelState === 'busy'} onClick={() => setConfirm(true)}>{t(cancelState === 'busy' ? 'requestCancelling' : 'requestCancel')}</button>}
      {cancelState === 'error' && <button className="button secondary" type="button" onClick={() => { setCancelState('idle'); setRevision(n => n + 1); }}>{t('requestCheckAgain')}</button>}
    </>}
    <div className="actions"><Link className="button primary" to="/specialists">{t('requestBack')}</Link></div>
    <ClearDemoRequests onCleared={() => { setRecord(null); setState('missing'); }} onRecheck={() => setRevision(n => n + 1)} />
    {confirm && <Modal titleId="cancel-request-title" onDismiss={() => { if (!lock.current) setConfirm(false); }}>
      <h2 id="cancel-request-title">{t('requestCancelConfirm')}</h2><p>{t('requestCancelHelp')}</p>
      <div className="actions"><button className="button secondary" type="button" disabled={cancelState === 'busy'} onClick={() => setConfirm(false)} autoFocus>{t('requestKeep')}</button>
        <button className="button danger" type="button" disabled={cancelState === 'busy'} onClick={() => void cancel()}>{t(cancelState === 'busy' ? 'requestCancelling' : 'requestCancel')}</button></div>
    </Modal>}
  </div>;
}
function SnapshotFacts({ snapshot }: { snapshot: DemoRequest['nonPersonalOfferSnapshot'] }) {
  const { locale, t } = useApp();
  const price = priceText(snapshot.priceKind, snapshot.priceAmountKzt, locale, t);
  return <>
    <p>{price} · {snapshot.durationMinutes === null ? t('durationUnknown') : t('duration', { minutes: snapshot.durationMinutes })} · {t(snapshot.unit)}</p>
    <dl className="offer-facts"><div><dt>{t('serviceLanguage')}</dt><dd>{snapshot.languages?.map(lang => t(lang === 'ru' ? 'russian' : 'kazakh')).join(', ') || t('unknown')}</dd></div>
      <div><dt>{t('format')}</dt><dd>{t(snapshot.format === 'unknown' ? 'unknown' : snapshot.format)}</dd></div></dl>
    <p className="help">{snapshot.priceConfirmedAt ? t('priceDate', { date: new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'Asia/Qyzylorda' }).format(new Date(snapshot.priceConfirmedAt)) }) : t('priceDateUnknown')}</p>
  </>;
}
