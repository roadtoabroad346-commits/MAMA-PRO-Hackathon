import { useState, type FormEvent } from 'react';
import { useApp } from '../../app/AppState';
import { AGE_GROUPS, CATEGORIES, DISTRICTS, NEED_TAGS, districtApplies, emptySearchInput, parseBudget, type SearchInput } from '../../domain/contracts';
import type { SearchResult } from '../../domain/SearchService';
import { ageKeys, categoryKeys, districtKeys, needKeys } from '../../i18n/messages';
import { Check } from '../../ui/controls';
import { Modal } from '../../ui/Modal';

function Select<T extends string>({ id, label, value, options, onChange, help }: {
  id: string; label: string; value: T | null; options: { value: T | null; label: string }[];
  onChange: (value: T | null) => void; help?: string;
}) {
  return <div className="field"><label htmlFor={id}>{label}</label>
    {help && <p className="help" id={`${id}-help`}>{help}</p>}
    <select id={id} value={value ?? ''} aria-describedby={help ? `${id}-help` : undefined}
      onChange={event => onChange(options.find(option => option.value === event.target.value)?.value ?? null)}>
      {options.map(option => <option key={option.value ?? ''} value={option.value ?? ''}>{option.label}</option>)}
    </select></div>;
}

export function Filters({ onClose }: { onClose: () => void }) {
  const { input, update, setBudgetDraft, service, t } = useApp();
  const [draft, setDraft] = useState(() => structuredClone(input));
  const [budget, setBudget] = useState(() => input.budgetKzt?.toString() ?? '');
  const parsedBudget = parseBudget(budget);
  const nextInput = { ...draft, budgetKzt: parsedBudget.value };
  let preview: SearchResult | null = null;
  let failed = false;
  if (!parsedBudget.error) {
    try { preview = service.search(nextInput); } catch { failed = true; }
  }
  const patch = (value: Partial<SearchInput>) => setDraft(old => ({ ...old, ...value }));
  function apply(event: FormEvent) {
    event.preventDefault();
    if (!preview) { document.getElementById('filter-budget')?.focus(); return; }
    update(preview.appliedInputSummary);
    setBudgetDraft(preview.appliedInputSummary.budgetKzt?.toString() ?? '');
    onClose();
  }
  return <Modal titleId="filters-title" onDismiss={onClose} className="filter-sheet" fallbackFocusId="filters-open">
    <form onSubmit={apply} noValidate>
      <header className="modal-header"><h2 id="filters-title">{t('filters')}</h2><button className="button secondary" type="button" onClick={onClose}>{t('close')}</button></header>
      <div className="modal-content">
        <p className="help">{t('filtersHelp')}</p>
        {draft.query && <p className="notice">{t('nameSearch')}: {draft.query}</p>}
        <fieldset className="field"><legend>{t('category')}</legend><p className="help">{t('categoryHelp')}</p>
          {CATEGORIES.map(category => <Check key={category} label={t(categoryKeys[category])} help={t('categoryChosen')}
            checked={draft.categoryIds.includes(category)} onChange={checked => patch({ categoryIds: checked ? [...draft.categoryIds, category] : draft.categoryIds.filter(id => id !== category) })} />)}
        </fieldset>
        <Select id="filter-topic" label={t('stepTopic')} help={t('topicRule')} value={draft.needTag}
          options={[{ value: null, label: t('notSet') }, ...NEED_TAGS.map(value => ({ value, label: t(needKeys[value]) }))]} onChange={needTag => patch({ needTag })} />
        <Select id="filter-age" label={t('stepAge')} help={t('ageHelp')} value={draft.ageGroup}
          options={[{ value: null, label: t('notSet') }, ...AGE_GROUPS.map(value => ({ value, label: t(ageKeys[value]) }))]} onChange={ageGroup => patch({ ageGroup })} />
        <Select id="filter-language" label={t('serviceLanguage')} value={draft.serviceLanguage} help={t('languageHelp')}
          options={[{ value: null, label: t('any') }, { value: 'ru', label: t('russian') }, { value: 'kk', label: t('kazakh') }]}
          onChange={serviceLanguage => patch({ serviceLanguage, languageHard: true })} />
        {draft.serviceLanguage && <Check label={t('required')} help={t('languageRequiredHelp')} checked={draft.languageHard} onChange={languageHard => patch({ languageHard })} />}
        <Select id="filter-format" label={t('format')} value={draft.format} help={t('formatHelp')}
          options={[{ value: null, label: t('any') }, { value: 'offline', label: t('offline') }, { value: 'online', label: t('online') }]}
          onChange={format => patch({ format, formatHard: true })} />
        {draft.format && <Check label={t('required')} help={t('formatRequiredHelp')} checked={draft.formatHard} onChange={formatHard => patch({ formatHard })} />}
        <Select id="filter-district" label={t('district')} value={draft.districtId} help={t('districtHelp')}
          options={[{ value: null, label: t('any') }, ...DISTRICTS.map(value => ({ value, label: t(districtKeys[value]) }))]} onChange={districtId => patch({ districtId })} />
        {draft.districtId && districtApplies(draft) && <Check label={t('districtRequired')} help={t('districtRequiredHelp')} checked={draft.districtHard} onChange={districtHard => patch({ districtHard })} />}
        {!districtApplies(draft) && draft.districtId && <p className="help info">{t('districtInactive')}</p>}
        <div className="field"><label htmlFor="filter-budget">{t('budget')}</label><p id="filter-budget-help" className="help">{t('budgetHelp')}</p>
          <input id="filter-budget" type="text" inputMode="numeric" autoComplete="off" maxLength={32} value={budget}
            aria-invalid={!!parsedBudget.error} aria-describedby={`filter-budget-help${parsedBudget.error ? ' filter-budget-error' : ''}`} onChange={event => setBudget(event.target.value)} />
          {parsedBudget.error && <p className="field-error" id="filter-budget-error" role="alert">{t(parsedBudget.error)}</p>}
        </div>
        <Select id="filter-budget-mode" label={t('budgetMode')} help={t('budgetModeHelp')} value={draft.budgetHard ? 'hard' : 'soft'}
          options={[{ value: 'soft', label: t('budgetSoft') }, { value: 'hard', label: t('budgetHard') }]} onChange={value => patch({ budgetHard: value === 'hard' })} />
        <Check label={t('availability')} help={t('availabilityHelp')} checked={draft.availabilityPreferred} onChange={availabilityPreferred => patch({ availabilityPreferred })} />
      </div>
      <footer className="modal-footer">
        <p role="status" aria-atomic="true" data-testid="filter-preview">{preview ? t('preview', { specialists: preview.specialistCount, offers: preview.eligibleOfferCount, incomplete: preview.incompleteSpecialistCount }) : t(failed ? 'searchFailed' : 'invalidPreview')}</p>
        <div className="filter-buttons"><button className="button text-button" type="button" onClick={() => { setDraft(emptySearchInput()); setBudget(''); }}>{t('resetDraft')}</button>
          <button className="button secondary" type="button" onClick={onClose}>{t('cancel')}</button>
          <button className="button primary" type="submit" disabled={!preview}>{t('applyFilters')}</button></div>
      </footer>
    </form>
  </Modal>;
}
