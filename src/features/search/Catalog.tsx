import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import { CATEGORIES, QUERY_MAX, districtApplies, emptySearchInput } from '../../domain/contracts';
import { categoryKeys } from '../../i18n/messages';
import { DemoNotice, PageTitle } from '../../ui/controls';
import { CompareTray } from './CompareTray';
import { conditions } from './conditions';
import { Filters } from './Filters';
import { OfferCard } from './OfferCard';

export function Catalog() {
  const { input, update, setBudgetDraft, service, locale, catalogView, setCatalogView, t } = useApp();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [, retry] = useState(0);
  // Local synchronous filtering has no request race or artificial loading delay.
  // Counts, cards and explanations all come from this single result snapshot.
  let result = null;
  try { result = service.search(input); } catch { /* Never fall back to unfiltered cards. */ }
  const chips = result ? conditions(result.appliedInputSummary, t, locale) : [];
  function reset() {
    update(emptySearchInput());
    setBudgetDraft('');
    setCatalogView(old => ({ ...old, showIncomplete: false }));
  }
  return <div className="catalog-page">
    <PageTitle intro={t('resultsHelp')}>{t('results')}</PageTitle>
    <DemoNotice />
    <div className="catalog-toolbar">
      <div className="field"><label htmlFor="query">{t('nameSearch')}</label><p className="help" id="query-help">{t('searchHelp')}</p>
        <input type="search" id="query" maxLength={QUERY_MAX} value={input.query} aria-describedby="query-help" autoComplete="off"
          onChange={event => update({ query: event.target.value.normalize('NFKC').slice(0, QUERY_MAX) })} />
      </div>
      <div className="field"><label htmlFor="catalog-category">{t('category')}</label><p className="help" id="catalog-category-help">{t('categoryHelp')}</p>
        <select id="catalog-category" value={input.categoryIds.length === 1 ? input.categoryIds[0] : ''} aria-describedby="catalog-category-help" onChange={event => {
          const id = CATEGORIES.find(id => id === event.target.value);
          update({ categoryIds: id ? [id] : [] });
        }}>
          <option value="">{input.categoryIds.length > 1 ? input.categoryIds.map(id => t(categoryKeys[id])).join(', ') : t('allCategories')}</option>
          {CATEGORIES.map(id => <option key={id} value={id}>{t(categoryKeys[id])}</option>)}
        </select>
      </div>
    </div>
    <div className="catalog-actions"><button type="button" id="filters-open" className="button primary" aria-haspopup="dialog" onClick={() => setFiltersOpen(true)}>{t('filters')}</button>
      <Link className="button secondary" to="/route/review">{t('reviewTitle')}</Link>
      <button type="button" className="button text-button" onClick={reset}>{t('resetAll')}</button>
    </div>
    {chips.length > 0 && <section className="active-conditions" aria-labelledby="active-title"><h2 id="active-title">{t('activeConditions')}</h2><ul className="condition-chips">
      {chips.map(chip => <li key={chip.id}><button type="button" className="condition-chip" data-condition={chip.id} aria-label={t('removeCondition', { condition: chip.label })} onClick={() => {
        update(chip.patch);
        if ('budgetKzt' in chip.patch) setBudgetDraft('');
        document.getElementById('filters-open')?.focus();
      }}>{chip.label}<span aria-hidden="true"> ×</span></button></li>)}
    </ul></section>}
    <div className="result-heading">
      {result && <p role="status" aria-atomic="true" data-testid="search-count">{t('count', { specialists: result.specialistCount, offers: result.eligibleOfferCount })}</p>}
      <div className="field sort-field"><label htmlFor="sort">{t('sort')}</label><select id="sort" value={input.sort}
        onChange={event => { const sort = ['relevant', 'price', 'district'].find(value => value === event.target.value) as typeof input.sort | undefined; if (sort) update({ sort }); }}>
        <option value="relevant">{t('sortRelevant')}</option><option value="price">{t('sortPrice')}</option><option value="district">{t('sortDistrict')}</option>
      </select></div>
    </div>
    {input.sort === 'price' && <p className="help info">{t('priceSortHelp')}</p>}
    {input.sort === 'district' && <p className="help info">{t(districtApplies(input) && input.districtId ? 'districtSortHelp' : 'districtSortInactive')}</p>}
    {!result && <section className="count-panel" role="alert"><p>{t('searchFailed')}</p><button type="button" className="button primary" onClick={() => retry(value => value + 1)}>{t('retry')}</button></section>}
    {result && <>
      {result.items.length > 0 && result.items.every(item => item.score === null) && <p className="help">{t('neutral')}</p>}
      {result.specialistCount === 0 && <section className="count-panel" aria-labelledby="empty-title"><h2 id="empty-title">{t('emptyExact')}</h2>
        <p>{t('emptyExactHelp')}</p>
        {input.query && <><p>{t('noTextMatch')}</p><button type="button" className="button secondary" onClick={() => update({ query: '' })}>{t('clearSearch')}</button></>}
        <p>{t('emptyPreferences')}</p>
        <button type="button" className="button primary" onClick={() => setFiltersOpen(true)}>{t('editPreferences')}</button>
        <button type="button" className="button text-button" onClick={reset}>{t('resetAll')}</button>
      </section>}
      <div className="catalog-grid">{result.items.map(item => <OfferCard key={item.specialistId} item={item} />)}</div>
      {result.incompleteSpecialistCount > 0 && <section className="incomplete-section" aria-labelledby="incomplete-title">
        <h2 id="incomplete-title">{t('incompleteTitle')}</h2><p>{t('incomplete', { count: result.incompleteSpecialistCount })}</p>
        <button className="button secondary" type="button" aria-expanded={catalogView.showIncomplete} aria-controls="incomplete-results"
          onClick={() => setCatalogView(old => ({ ...old, showIncomplete: !old.showIncomplete }))}>{t(catalogView.showIncomplete ? 'hideIncomplete' : 'showIncomplete', { count: result.incompleteSpecialistCount })}</button>
        {catalogView.showIncomplete && <div id="incomplete-results"><p className="help">{t('incompleteHelp')}</p>
          <p data-testid="incomplete-count">{t('incompleteCount', { specialists: result.incompleteSpecialistCount, offers: result.incompleteOfferCount })}</p>
          <div className="catalog-grid">{result.incompleteItems.map(item => <OfferCard key={item.specialistId} item={item} />)}</div>
        </div>}
      </section>}
    </>}
    <CompareTray />
    {filtersOpen && <Filters onClose={() => setFiltersOpen(false)} />}
  </div>;
}
