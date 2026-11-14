import { Link } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import { categoryKeys } from '../../i18n/messages';
import { DemoNotice, PageTitle } from '../../ui/controls';
import { CompareButton, Explanations, OfferFacts, Verification } from './OfferCard';
import { RequestAction } from '../profile/RequestAction';
import { OfferEvidence } from '../profile/TrustPassport';

export function Comparison() {
  const { comparison, comparisonInput, comparisonNotice, catalog, service, input, locale, clearComparison, toggleCompare, t } = useApp();
  const changed = comparisonInput && JSON.stringify({ ...comparisonInput, sort: 'relevant' }) !== JSON.stringify({ ...input, sort: 'relevant' });
  const focusTitle = () => document.querySelector<HTMLElement>('[data-page-title]')?.focus();
  return <>
    <PageTitle>{t('compareTitle')}</PageTitle><DemoNotice /><Link className="button secondary" to="/specialists">{t('backToResults')}</Link>
    <p role="status">{t('compareCount', { count: comparison.length })}{comparisonNotice && ` · ${t(comparisonNotice)}`}</p>
    {changed && <p className="notice">{t('compareChanged')}</p>}
    {comparison.length < 2 && <p className="count-panel">{t(comparison.length ? 'compareMore' : 'compareEmpty')}</p>}
    <div className="catalog-grid comparison-grid" style={{ '--comparison-columns': Math.max(1, comparison.length) } as React.CSSProperties}>{comparison.map(selection => {
      const offer = catalog.offers.find(o => o.id === selection.offerId && o.specialistId === selection.specialistId && o.publicationStatus === 'published');
      const specialist = catalog.specialists.find(s => s.id === selection.specialistId && s.publicationStatus === 'published');
      if (!offer || !specialist) return <article key={selection.specialistId} className="specialist-card comparison-unavailable" data-testid="comparison-unavailable">
        <p className="notice">{t('comparisonUnavailable')}</p>
        <button className="button secondary" type="button" onClick={() => { toggleCompare(selection.specialistId, selection.offerId); focusTitle(); }}>{t('removeCompare')}</button>
      </article>;
      const item = service.inspectOffer(input, offer.id);
      return <article key={specialist.id} className="specialist-card" data-testid="comparison-card" data-offer-id={offer.id}>
        <div className="compare-head"><h2>{specialist.displayName[locale]}</h2><p className="offer-title">{offer.title[locale]} · {offer.id}</p><p>{t(categoryKeys[offer.categoryId])}</p></div>
        <div className="compare-block compare-facts"><OfferFacts offer={offer} detailed /></div>
        <div className="compare-block"><Explanations item={item} /></div>
        <div className="compare-block"><Verification specialistId={specialist.id} />
          <details><summary>{t('scopeOfferData')} · {offer.id}</summary><p className="help">{t('passportHelp')}</p><OfferEvidence specialist={specialist} offer={offer} /></details>
        </div>
        <div className="card-actions">
          <RequestAction key={`${offer.id}-${item === null}`} offer={offer} incompatible={item === null} hasContext fromComparison />
          <Link className="button secondary" to={`/specialists/${encodeURIComponent(specialist.id)}?offer=${encodeURIComponent(offer.id)}`} state={{ fromComparison: true }}>{t('profile')}</Link><CompareButton offer={offer} onRemoved={focusTitle} />
        </div>
      </article>;
    })}</div>
    {comparison.length > 0 && <button className="button text-button" type="button" onClick={() => { clearComparison(); focusTitle(); }}>{t('clearComparison')}</button>}
  </>;
}
