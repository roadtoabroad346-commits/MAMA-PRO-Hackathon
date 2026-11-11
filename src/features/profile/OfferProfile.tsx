import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import { emptySearchInput } from '../../domain/contracts';
import { resolveProfile } from '../../domain/profile';
import { isFresh } from '../../domain/SearchService';
import { categoryKeys } from '../../i18n/messages';
import { DemoNotice, PageTitle } from '../../ui/controls';
import { CompareButton, Explanations, OfferFacts } from '../search/OfferCard';
import { SaveDemo } from '../pilot/SavedDemo';
import { TrustPassport } from './TrustPassport';
import { RequestAction } from './RequestAction';

export function OfferProfile() {
  const { specialistId } = useParams();
  const [params] = useSearchParams();
  const { catalog, input, service, locale, comparison, comparisonNotice, t } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const profile = resolveProfile(catalog, specialistId, params.get('offer'));
  if (profile.kind !== 'found') return <><PageTitle>{t(profile.kind === 'specialist-not-found' ? 'profileNotFound' : 'offerNotFound')}</PageTitle><Link className="button primary" to="/specialists">{t('backToResults')}</Link></>;
  const { specialist, offers, offer } = profile;
  const hasContext = !!location.state?.fromCatalog || !!location.state?.fromComparison;
  const neutral = service.inspectOffer(emptySearchInput(), offer.id);
  const item = hasContext ? service.inspectOffer(input, offer.id) : neutral;
  const date = (value: string) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'Asia/Almaty' }).format(new Date(value));
  return <div className="profile-page">
    <button className="button secondary" type="button" onClick={() => hasContext ? navigate(-1) : navigate('/specialists')}>{t(location.state?.fromComparison ? 'backToComparison' : 'backToResults')}</button>
    <header className="profile-header">
      <div className="avatar-placeholder"><svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true"><circle cx="32" cy="22" r="11" fill="currentColor" /><path d="M10 58a22 22 0 0 1 44 0" fill="currentColor" /></svg><span>{t('noPhoto')}</span></div>
      <div><PageTitle>{specialist.displayName[locale]}</PageTitle><p className="badge">{t('syntheticProfile')}</p>
        <p>{t('categories')}: {specialist.categoryIds.map(id => t(categoryKeys[id])).join(', ')}</p></div>
    </header>
    <DemoNotice />
    <div className="profile-offer-layout">
      <section className="profile-panel" aria-labelledby="selected-offer-title">
        <h2 id="selected-offer-title">{t('selectedOffer')}</h2>
        <fieldset className="field offer-selector" aria-describedby="offer-selector-help">
          <legend>{t('selectOffer')}</legend><p className="help" id="offer-selector-help">{t('offerSelectorHelp')}</p>
          {offers.map(option => {
            const inspected = hasContext ? service.inspectOffer(input, option.id) : null;
            return <label className="offer-option" key={option.id}>
            <input type="radio" name="profile-offer" value={option.id} checked={offer.id === option.id}
              onChange={() => navigate(`/specialists/${encodeURIComponent(specialist.id)}?offer=${encodeURIComponent(option.id)}`, { replace: true, state: location.state })} />
            <span>{option.title[locale]} <small>{t(categoryKeys[option.categoryId])} · {option.id}</small>
              {hasContext && <small>{t(!inspected ? 'offerIncompatible' : inspected.status === 'incomplete' ? 'offerIncomplete' : 'offerCompatible')}</small>}</span>
          </label>;
          })}
        </fieldset>
        {!params.has('offer') && <p className="help">{t('defaultOffer')}</p>}
      </section>
      <article className="profile-panel selected-offer" data-testid="selected-offer" data-offer-id={offer.id}>
        <div aria-live="polite" aria-atomic="true" className="help">{t('offerSelected', { id: offer.id })}</div>
        <h2>{offer.title[locale]}</h2><p>{t(categoryKeys[offer.categoryId])} · {t('offerId', { id: offer.id })}</p>
        <OfferFacts offer={offer} />
        <p>{t('availabilityLabel')}: {t(offer.acceptingEnquiries === null ? 'unknown' : offer.acceptingEnquiries ? 'accepting' : 'notAccepting')}</p>
        <p className="help">{t('availabilityLimit')}</p>
        {!isFresh(offer.availabilityConfirmedAt, new Date(catalog.demoClock), 7) && <p className="warning-text">{t('staleAvailability')}</p>}
        <p className="help">{t('offerUpdated', { date: date(offer.updatedAt) })}</p>
        <Explanations item={item} fallbackUnknowns={neutral?.unknowns} />
        <RequestAction key={offer.id} offer={offer} incompatible={item === null} hasContext={hasContext} />
        <CompareButton offer={offer} />
        <SaveDemo key={`save-${offer.id}`} offerId={offer.id} />
        {comparison.length > 0 && <Link className="button text-button" to="/compare">{t('openComparison')} · {comparison.length}/3</Link>}
        {comparisonNotice && <p role="status">{t(comparisonNotice)}</p>}
      </article>
    </div>
    <section className="profile-panel"><h2>{t('approach')}</h2><p>{specialist.bio?.[locale] ?? t('approachUnknown')}</p>{specialist.bio && <p className="help">{t('approachSource')}</p>}</section>
    <TrustPassport specialist={specialist} offer={offer} />
  </div>;
}
