import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import { useDemoRequests } from '../../app/DemoRequests';
import type { Offer } from '../../domain/catalog';
import { emptySearchInput } from '../../domain/contracts';
import { resolveProfile } from '../../domain/profile';
import { Check, PageTitle } from '../../ui/controls';
import { Explanations, OfferFacts } from '../search/OfferCard';

function RequestForm({ offer }: { offer: Offer }) {
  const { catalog, t } = useApp();
  const service = useDemoRequests();
  const state = useSyncExternalStore(service.subscribe, service.getSnapshot);
  const [acknowledged, setAcknowledged] = useState(false);
  const mounted = useRef(true);
  const navigate = useNavigate();
  useEffect(() => {
    mounted.current = true;
    void service.recover();
    return () => { mounted.current = false; };
  }, [service, offer.id]);
  const busy = state.phase === 'submitting' || state.phase === 'checking';
  const current = state.request?.offerId === offer.id && state.request.catalogVersion === catalog.catalogVersion ? state.request : null;
  async function submit() {
    await service.submit(offer, catalog, acknowledged);
    const result = service.getSnapshot().request;
    if (mounted.current && result && result.offerId === offer.id && service.getSnapshot().phase === result.status) {
      navigate(`/request-status/${encodeURIComponent(result.id)}`);
    }
  }
  return <section data-request-phase={state.phase} aria-busy={busy}>
    <p className="eyebrow">{t('requestFamily')}</p>
    {current && state.phase === current.status ? <>
      <p>{t('requestExisting')}</p><Link className="button primary" to={`/request-status/${encodeURIComponent(current.id)}`}>{t('requestOpenResult')}</Link>
    </> : <>
      <Check label={t('requestAcknowledge')} help={t('requestAcknowledgeHelp')} checked={acknowledged} onChange={setAcknowledged} />
      <button className="button primary" type="button" disabled={!acknowledged || busy} onClick={() => void submit()}>{t(state.phase === 'submitting' ? 'requestSaving' : state.phase === 'checking' ? 'requestChecking' : 'requestSave')}</button>
    </>}
    {busy && <p role="status">{t(state.phase === 'submitting' ? 'requestSaving' : 'requestChecking')}</p>}
    {state.phase === 'error' && state.error && <div className="request-error" role="alert"><p>{t(state.error)}</p>
      <button className="button secondary" type="button" onClick={() => void service.recover()}>{t('requestCheckAgain')}</button>
      {state.attempt && state.attempt.offerId !== offer.id && <Link className="button secondary" to={`/request/${encodeURIComponent(state.attempt.offerId)}`}>{t('requestPreviousLink')}</Link>}
    </div>}
    <p className="help">{t('requestRetention')}</p>
  </section>;
}

export function DemoRequestEntry() {
  const { offerId } = useParams();
  const { catalog, service, input, locale, t } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const candidate = catalog.offers.find(offer => offer.id === offerId);
  const profile = resolveProfile(catalog, candidate?.specialistId, offerId ?? '');
  if (profile.kind !== 'found') return <><PageTitle>{t('offerNotFound')}</PageTitle><Link className="button primary" to="/specialists">{t('backToResults')}</Link></>;
  const { offer, specialist } = profile;
  const neutral = service.inspectOffer(emptySearchInput(), offer.id);
  return <div className="review-page">
    <PageTitle>{t('demoRequestTitle')}</PageTitle><p className="notice">{t('demoRequestNotice')}</p>
    <article className="profile-panel" data-testid="request-offer" data-offer-id={offer.id} data-specialist-id={specialist.id}>
      <h2>{specialist.displayName[locale]}</h2><p>{offer.title[locale]} · {t('offerId', { id: offer.id })}</p>
      <OfferFacts offer={offer} /><Explanations item={location.state?.hasSearchContext ? service.inspectOffer(input, offer.id) : neutral} fallbackUnknowns={neutral?.unknowns} />
    </article>
    <RequestForm key={offer.id} offer={offer} />
    {location.state?.fromProfile ? <button className="button secondary" type="button" onClick={() => navigate(-1)}>{t('backToProfile')}</button>
      : <Link className="button secondary" to={`/specialists/${encodeURIComponent(specialist.id)}?offer=${encodeURIComponent(offer.id)}`}>{t('backToProfile')}</Link>}
  </div>;
}
