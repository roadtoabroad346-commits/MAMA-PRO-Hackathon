import { Link } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import { categoryKeys } from '../../i18n/messages';
import { DemoNotice, PageTitle } from '../../ui/controls';
import { CompareButton, Explanations, OfferFacts, Verification } from './OfferCard';

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
