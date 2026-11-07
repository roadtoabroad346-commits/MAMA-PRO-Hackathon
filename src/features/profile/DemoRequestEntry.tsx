import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import { emptySearchInput } from '../../domain/contracts';
import { resolveProfile } from '../../domain/profile';
import { PageTitle } from '../../ui/controls';
import { Explanations, OfferFacts } from '../search/OfferCard';

// S06 handoff boundary: review the exact public offer. Persistence belongs to S08.
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
    <p>{t('demoRequestBoundary')}</p>
    {location.state?.fromProfile ? <button className="button secondary" type="button" onClick={() => navigate(-1)}>{t('backToProfile')}</button>
      : <Link className="button secondary" to={`/specialists/${encodeURIComponent(specialist.id)}?offer=${encodeURIComponent(offer.id)}`}>{t('backToProfile')}</Link>}
  </div>;
}
