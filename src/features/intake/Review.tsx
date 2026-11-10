import { Link } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import { CATEGORIES, districtApplies, parseBudget } from '../../domain/contracts';
import { ageKeys, categoryKeys, districtKeys, needKeys, type MessageKey } from '../../i18n/messages';
import { Check, DemoNotice, PageTitle } from '../../ui/controls';

export function Review() {
  const { intakeDraft: input, updateDraft: update, applyIntake, budgetDraft, service, locale, t } = useApp();
  const budgetError = parseBudget(budgetDraft).error;
  const result = service.search(input);
  // Render exactly the normalized input used by the service; no parallel review DTO.
  const summary = result.appliedInputSummary;
  const rows: { key: string; label: MessageKey; value: string; mode: MessageKey; step: number }[] = [
    { key: 'needTag', label: 'stepTopic', value: summary.needTag ? t(needKeys[summary.needTag]) : t('unsure'), mode: summary.needTag ? 'preference' : 'unrestricted', step: 1 },
    { key: 'ageGroup', label: 'stepAge', value: summary.ageGroup ? t(ageKeys[summary.ageGroup]) : t('notSet'), mode: summary.ageGroup ? 'strict' : 'unrestricted', step: 2 },
    { key: 'serviceLanguage', label: 'serviceLanguage', value: summary.serviceLanguage ? t(summary.serviceLanguage === 'ru' ? 'russian' : 'kazakh') : t('any'), mode: summary.serviceLanguage ? summary.languageHard ? 'strict' : 'preference' : 'unrestricted', step: 3 },
    { key: 'format', label: 'format', value: summary.format ? t(summary.format) : t('any'), mode: summary.format ? summary.formatHard ? 'strict' : 'preference' : 'unrestricted', step: 3 },
    { key: 'districtId', label: 'district', value: summary.districtId ? t(districtKeys[summary.districtId]) : t('any'), mode: summary.districtId ? districtApplies(summary) ? summary.districtHard ? 'strict' : 'preference' : 'unused' : 'unrestricted', step: 4 },
    { key: 'budgetKzt', label: 'budget', value: summary.budgetKzt === null ? t('notSet') : `${new Intl.NumberFormat(locale).format(summary.budgetKzt)} ₸`, mode: summary.budgetKzt === null ? 'unrestricted' : summary.budgetHard ? 'strict' : 'preference', step: 4 },
    { key: 'availabilityPreferred', label: 'availability', value: summary.availabilityPreferred ? t('preference') : t('notSet'), mode: summary.availabilityPreferred ? 'preference' : 'unrestricted', step: 4 },
  ];
  return <div className="review-page">
    <p className="eyebrow">{t('tagline')}</p>
    <PageTitle intro={t('reviewHelp')}>{t('reviewTitle')}</PageTitle>
    <DemoNotice />
    <p className="notice">{t('reviewNotice')}</p>
    <dl className="summary">
      {rows.map(row => <div className="summary-row" key={row.key} data-field={row.key}>
        <dt>{t(row.label)}</dt>
        <dd><div className="summary-value"><strong>{row.value}</strong><span className={`condition ${row.mode === 'strict' ? 'strict' : ''}`}>{t(row.mode)}</span></div>
          <Link className="edit-link" to="/route" state={{ step: row.step, review: true }} aria-label={t('editField', { field: t(row.label) })}>{t('edit')}</Link>
        </dd>
      </div>)}
    </dl>
    {summary.query !== '' && <section className="notice" data-field="query">
      <p>{t('nameSearch')}: <strong>{summary.query}</strong> · {t('strict')}</p>
      <Link className="edit-link" to="/specialists" aria-label={t('editField', { field: t('nameSearch') })}>{t('edit')}</Link>
    </section>}
    {!districtApplies(summary) && summary.districtId !== null && <p className="help info">{t(summary.format === 'online' && summary.formatHard ? 'onlineDistrict' : 'districtInactive')}</p>}
    <p className="help">{t(summary.needTag === null ? 'unsureRule' : 'topicRule')}</p>
    <details className="category-section">
      <summary><h2>{t('category')} · {t('optional')}</h2>
        <span data-field="categoryIds" className="help">{summary.categoryIds.length ? summary.categoryIds.map(id => t(categoryKeys[id])).join(', ') : t('allCategories')} · {t(summary.categoryIds.length ? 'strict' : 'unrestricted')}</span>
      </summary>
      <fieldset aria-describedby="category-help">
        <legend>{t('optional')}</legend><p className="help" id="category-help">{t('categoryHelp')}</p>
        <button type="button" className="button secondary" aria-pressed={summary.categoryIds.length === 0} onClick={() => update({ categoryIds: [] })}>{t('allCategories')}</button>
        {CATEGORIES.map(category => <Check key={category} label={t(categoryKeys[category])} help={t('categoryChosen')}
          checked={summary.categoryIds.includes(category)} onChange={checked => update({ categoryIds: checked ? [...summary.categoryIds, category] : summary.categoryIds.filter(id => id !== category) })} />)}
      </fieldset>
    </details>
    {budgetError && <p role="alert" className="field-error">{t(budgetError)} <Link to="/route" state={{ step: 4, review: true }}>{t('editAnswers')}</Link></p>}
    {!budgetError && <section className="count-panel" aria-labelledby="count-title">
      <h2 id="count-title">{t('countTitle')}</h2>
      <p role="status" aria-atomic="true" data-testid="search-count">{t('count', { specialists: result.specialistCount, offers: result.eligibleOfferCount })}</p>
      {result.specialistCount === 0 && <><p><strong>{t('empty')}</strong></p><p>{t('emptyHelp')}</p></>}
      {result.incompleteSpecialistCount > 0 && <p className="help">{t('incomplete', { count: result.incompleteSpecialistCount })}</p>}
    </section>}
    <div className="review-actions">
      {budgetError ? <button className="button primary" disabled>{t('show')}</button>
        : <Link className="button primary" to="/specialists" onClick={applyIntake}>{t('show')}</Link>}
      <Link className="button secondary" to="/route" state={{ step: 1 }}>{t('editAnswers')}</Link>
    </div>
    <p className="help storage-policy">{t('sessionPolicy')}</p>
  </div>;
}
