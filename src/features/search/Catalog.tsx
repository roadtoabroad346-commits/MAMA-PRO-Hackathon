import { Link } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import { CATEGORIES } from '../../domain/contracts';
import { isFresh } from '../../domain/SearchService';
import { categoryKeys } from '../../i18n/messages';
import { DemoNotice, PageTitle } from '../../ui/controls';

// Minimal destination for both S01 paths. S05/profile/compare are separate phases.
export function Catalog() {
  const { input, update, service, catalog, locale, t } = useApp();
  const result = service.search(input);
  return <>
    <PageTitle intro={t('resultsHelp')}>{t('results')}</PageTitle>
    <DemoNotice />
    <div className="catalog-toolbar">
      <div className="field"><label htmlFor="query">{t('nameSearch')}</label><p className="help" id="query-help">{t('searchHelp')}</p>
        <input type="search" id="query" maxLength={80} value={input.query} aria-describedby="query-help" autoComplete="off" onChange={e => update({ query: e.target.value })} />
      </div>
      <div className="field"><label htmlFor="catalog-category">{t('category')}</label><p className="help" id="catalog-category-help">{t('categoryHelp')}</p>
        <select id="catalog-category" value={input.categoryIds.length === 1 ? input.categoryIds[0] : ''} aria-describedby="catalog-category-help" onChange={e => {
          const id = CATEGORIES.find(id => id === e.target.value);
          update({ categoryIds: id ? [id] : [] });
        }}>
          <option value="">{input.categoryIds.length > 1 ? input.categoryIds.map(id => t(categoryKeys[id])).join(', ') : t('allCategories')}</option>
          {CATEGORIES.map(id => <option key={id} value={id}>{t(categoryKeys[id])}</option>)}
        </select>
      </div>
    </div>
    <div className="catalog-actions"><Link className="button secondary" to="/route/review">{t('reviewTitle')}</Link>
      {input.query && <button type="button" className="button text-button" onClick={() => update({ query: '' })}>{t('clearSearch')}</button>}
    </div>
    <p role="status" aria-atomic="true" data-testid="search-count">{t('count', { specialists: result.specialistCount, offers: result.eligibleOfferCount })}</p>
    {result.items.every(item => item.score === null) && result.items.length > 0 && <p className="help">{t('neutral')}</p>}
    {result.incompleteSpecialistCount > 0 && <p className="help">{t('incomplete', { count: result.incompleteSpecialistCount })}</p>}
    {result.specialistCount === 0 && <section className="count-panel"><h2>{t('empty')}</h2><p>{t('emptyHelp')}</p><Link to="/route/review">{t('editAnswers')}</Link></section>}
    <div className="catalog-grid">
      {result.items.map(item => {
        const specialist = catalog.specialists.find(s => s.id === item.specialistId)!;
        const offer = catalog.offers.find(o => o.id === item.selectedOfferId)!;
        const price = offer.priceKind === 'unknown' ? t('priceUnknown') : offer.priceKind === 'free' ? t('priceFree')
          : t(offer.priceKind === 'from' ? 'priceFrom' : 'priceExact', { amount: new Intl.NumberFormat(locale).format(offer.priceAmountKzt!) });
        return <article className="specialist-card" key={item.specialistId} data-testid="specialist-card">
          <span className="badge">{t('demo')}</span>
          <h2>{specialist.displayName[locale]}</h2><p>{offer.title[locale]}</p>
          <p>{t(categoryKeys[offer.categoryId])} · {t(offer.format === 'unknown' ? 'unknown' : offer.format)}</p>
          <p>{offer.languages?.map(lang => t(lang === 'ru' ? 'russian' : 'kazakh')).join(', ') || t('unknown')}</p>
          <p className="price">{price}</p>
          {offer.priceKind !== 'unknown' && !isFresh(offer.priceConfirmedAt, new Date(catalog.demoClock), 30) && <p className="help">{t('stalePrice')}</p>}
        </article>;
      })}
    </div>
  </>;
}
