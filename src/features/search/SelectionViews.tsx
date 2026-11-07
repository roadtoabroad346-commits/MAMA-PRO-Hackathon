import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import { emptySearchInput } from '../../domain/contracts';
import { categoryKeys } from '../../i18n/messages';
import { DemoNotice, PageTitle } from '../../ui/controls';
import { CompareButton, Explanations, OfferFacts, Verification } from './OfferCard';

// Read-only destinations make the catalog actions usable. Booking and the full
// S06/S07 workflows remain outside the phase-7 slice.
export function OfferProfile() {
  const { specialistId } = useParams();
  const [params] = useSearchParams();
  const { catalog, input, service, locale, comparisonNotice, t } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const specialist = catalog.specialists.find(s => s.id === specialistId && s.publicationStatus === 'published');
  const offer = catalog.offers.find(o => o.id === params.get('offer') && o.specialistId === specialistId && o.publicationStatus === 'published');
  if (!specialist || !offer) return <><PageTitle>{t('offerNotFound')}</PageTitle><Link className="button primary" to="/specialists">{t('backToResults')}</Link></>;
  const hasContext = !!location.state?.fromCatalog || !!location.state?.fromComparison;
  const item = service.inspectOffer(hasContext ? input : emptySearchInput(), offer.id);
  return <div className="review-page">
    <button className="button secondary" type="button" onClick={() => hasContext ? navigate(-1) : navigate('/specialists')}>{t(location.state?.fromComparison ? 'backToComparison' : 'backToResults')}</button>
    <PageTitle>{specialist.displayName[locale]}</PageTitle><DemoNotice /><p>{specialist.bio[locale]}</p>
    <article className="specialist-card" data-offer-id={offer.id}>
      <h2>{offer.title[locale]}</h2><p>{t(categoryKeys[offer.categoryId])} · {t('offerId', { id: offer.id })}</p>
      <OfferFacts offer={offer} /><Explanations item={item} /><Verification specialistId={specialist.id} /><CompareButton offer={offer} />
      {comparisonNotice && <p role="status">{t(comparisonNotice)}</p>}
    </article>
  </div>;
}

export function Comparison() {
  const { comparison, comparisonInput, comparisonNotice, catalog, service, input, locale, clearComparison, t } = useApp();
  const changed = comparisonInput && JSON.stringify({ ...comparisonInput, sort: 'relevant' }) !== JSON.stringify({ ...input, sort: 'relevant' });
  return <>
    <PageTitle>{t('compareTitle')}</PageTitle><DemoNotice /><Link className="button secondary" to="/specialists">{t('backToResults')}</Link>
    <p role="status">{t('compareCount', { count: comparison.length })}{comparisonNotice && ` · ${t(comparisonNotice)}`}</p>
    {changed && <p className="notice">{t('compareChanged')}</p>}
    {comparison.length < 2 && <p className="count-panel">{t(comparison.length ? 'compareMore' : 'compareEmpty')}</p>}
    <div className="catalog-grid comparison-grid">{comparison.map(selection => {
      const offer = catalog.offers.find(o => o.id === selection.offerId && o.specialistId === selection.specialistId && o.publicationStatus === 'published');
      const specialist = catalog.specialists.find(s => s.id === selection.specialistId && s.publicationStatus === 'published');
      if (!offer || !specialist) return null;
      return <article key={specialist.id} className="specialist-card" data-testid="comparison-card" data-offer-id={offer.id}>
        <h2>{specialist.displayName[locale]}</h2><p className="offer-title">{offer.title[locale]} · {offer.id}</p><p>{t(categoryKeys[offer.categoryId])}</p>
        <OfferFacts offer={offer} /><Explanations item={service.inspectOffer(input, offer.id)} /><Verification specialistId={specialist.id} />
        <div className="card-actions"><Link className="button primary" to={`/specialists/${specialist.id}?offer=${offer.id}`} state={{ fromComparison: true }}>{t('profile')}</Link><CompareButton offer={offer} /></div>
      </article>;
    })}</div>
    {comparison.length > 0 && <button className="button text-button" type="button" onClick={clearComparison}>{t('clearComparison')}</button>}
  </>;
}
