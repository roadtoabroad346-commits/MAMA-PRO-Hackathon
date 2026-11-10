import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import type { Step } from '../../app/session';
import { AGE_GROUPS, DISTRICTS, NEED_TAGS, districtApplies, parseBudget, searchInputSchema, type SearchInput } from '../../domain/contracts';
import { ageKeys, districtKeys, needKeys, type MessageKey } from '../../i18n/messages';
import { Check, Choices, DemoNotice, PageTitle } from '../../ui/controls';

const stepLabels = ['stepTopic', 'stepAge', 'stepFormat', 'stepConditions'] as const;
const titles = ['topicTitle', 'ageTitle', 'formatTitle', 'conditionsTitle'] as const;
const stepFields: Record<Step, (keyof SearchInput)[]> = {
  1: ['needTag'], 2: ['ageGroup'], 3: ['serviceLanguage', 'languageHard', 'format', 'formatHard'],
  4: ['districtId', 'districtHard', 'budgetKzt', 'budgetHard', 'availabilityPreferred'],
};
const skipPatch: Record<Step, Partial<SearchInput>> = {
  1: { needTag: null }, 2: { ageGroup: null },
  3: { serviceLanguage: null, languageHard: true, format: null, formatHard: true },
  4: { districtId: null, districtHard: false, budgetKzt: null, budgetHard: false, availabilityPreferred: false },
};

export function Intake() {
  const { intakeDraft: input, updateDraft: update, step: savedStep, setStep, budgetDraft, setBudgetDraft, t } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = location.state as { step?: unknown; review?: boolean } | null;
  const step = (typeof routeState?.step === 'number' && [1, 2, 3, 4].includes(routeState.step) ? routeState.step : savedStep) as Step;
  const editing = routeState?.review === true;
  const [errors, setErrors] = useState<Partial<Record<keyof SearchInput, MessageKey>>>({});
  const budgetInput = useRef<HTMLInputElement>(null);
  useEffect(() => { setStep(step); setErrors({}); }, [step, setStep]);

  function advance() {
    if (step === 4 || editing) navigate('/route/review');
    else navigate('/route', { state: { step: step + 1 } });
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    const budget = parseBudget(budgetDraft);
    if (step === 4 && budget.error) {
      setErrors({ budgetKzt: budget.error });
      budgetInput.current?.focus();
      return;
    }
    const parsed = searchInputSchema.safeParse(input);
    if (!parsed.success) {
      const next: Partial<Record<keyof SearchInput, MessageKey>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof SearchInput;
        if (stepFields[step].includes(key)) next[key] = 'enumError';
      }
      if (Object.keys(next).length) { setErrors(next); return; }
    }
    advance();
  }
  function skip() {
    update(skipPatch[step]);
    if (step === 4) setBudgetDraft('');
    setErrors({});
    advance();
  }
  const fieldError = (key: keyof SearchInput) => errors[key] ? t(errors[key]!) : undefined;
  const errorPresent = Object.values(errors).some(Boolean);

  return <div className="form-page">
    <ol className="progress" aria-label={t('step', { step })}>
      {stepLabels.map((label, i) => <li key={label} aria-current={step === i + 1 ? 'step' : undefined} className={i + 1 <= step ? 'reached' : ''}>
        <span className="step-number">{i + 1}</span><span>{t(label)}</span>
      </li>)}
    </ol>
    <p className="eyebrow">{t('step', { step })} · {t('optional')}</p>
    <PageTitle>{t(titles[step - 1])}</PageTitle>
    <DemoNotice />
    <form onSubmit={submit} noValidate>
      {errorPresent && !errors.budgetKzt && <p className="field-error" role="alert">{t('formError')}</p>}
      {step === 1 && <Choices name="needTag" label={t('stepTopic')} help={t('topicHelp')}
        value={input.needTag} options={[...NEED_TAGS.map(value => ({ value, label: t(needKeys[value]) })), { value: null, label: t('unsure') }]}
        onChange={needTag => update({ needTag })} error={fieldError('needTag')} />}
      {step === 2 && <Choices name="ageGroup" label={t('stepAge')} help={t('ageHelp')}
        value={input.ageGroup} options={[...AGE_GROUPS.map(value => ({ value, label: t(ageKeys[value]) })), { value: null, label: t('notSet') }]}
        onChange={ageGroup => update({ ageGroup })} error={fieldError('ageGroup')} />}
      {step === 3 && <>
        <Choices name="serviceLanguage" label={t('serviceLanguage')} help={t('languageHelp')} value={input.serviceLanguage}
          options={[{ value: null, label: t('any') }, { value: 'ru', label: t('russian') }, { value: 'kk', label: t('kazakh') }]}
          onChange={serviceLanguage => update({ serviceLanguage, languageHard: true })} error={fieldError('serviceLanguage')} />
        {input.serviceLanguage !== null && <Check label={t('required')} help={t('languageRequiredHelp')}
          checked={input.languageHard} onChange={languageHard => update({ languageHard })} />}
        <Choices name="format" label={t('format')} help={t('formatHelp')} value={input.format}
          options={[{ value: null, label: t('any') }, { value: 'offline', label: t('offline') }, { value: 'online', label: t('online') }]}
          onChange={format => update({ format, formatHard: true })} error={fieldError('format')} />
        {input.format !== null && <Check label={t('required')} help={t('formatRequiredHelp')}
          checked={input.formatHard} onChange={formatHard => update({ formatHard })} />}
      </>}
      {step === 4 && <>
        <div className="field">
          <label htmlFor="district">{t('district')}</label>
          <p id="district-help" className="help">{t('districtHelp')}</p>
          <select id="district" value={input.districtId ?? ''} aria-describedby={`district-help${!districtApplies(input) ? ' district-inactive' : ''}${errors.districtId ? ' district-error' : ''}`}
            aria-invalid={!!errors.districtId} onChange={e => {
              const districtId = DISTRICTS.find(id => id === e.target.value) ?? null;
              update({ districtId });
            }}>
            <option value="">{t('any')}</option>
            {DISTRICTS.map(id => <option key={id} value={id}>{t(districtKeys[id])}</option>)}
          </select>
          {!districtApplies(input) && <p className="help info" id="district-inactive">{t(input.format === 'online' && input.formatHard ? 'onlineDistrict' : 'districtInactive')}</p>}
          {errors.districtId && <p id="district-error" className="field-error" role="alert">{fieldError('districtId')}</p>}
        </div>
        {districtApplies(input) && input.districtId !== null && <Check label={t('districtRequired')} help={t('districtRequiredHelp')}
          checked={input.districtHard} onChange={districtHard => update({ districtHard })} />}
        <div className="field">
          <label htmlFor="budget">{t('budget')}</label>
          <p id="budget-help" className="help">{t('budgetHelp')}</p>
          <input ref={budgetInput} id="budget" type="text" inputMode="numeric" autoComplete="off" spellCheck={false} maxLength={32}
            value={budgetDraft} aria-invalid={!!errors.budgetKzt} aria-describedby={`budget-help${errors.budgetKzt ? ' budget-error' : ''}`}
            onChange={e => {
              const raw = e.target.value;
              setBudgetDraft(raw);
              const parsed = parseBudget(raw);
              update({ budgetKzt: parsed.value });
              setErrors(old => ({ ...old, budgetKzt: parsed.error ?? undefined }));
            }}
            onBlur={() => setErrors(old => ({ ...old, budgetKzt: parseBudget(budgetDraft).error ?? undefined }))} />
          {errors.budgetKzt && <p className="field-error" role="alert" id="budget-error">{fieldError('budgetKzt')}</p>}
        </div>
        <Choices name="budgetMode" label={t('budgetMode')} help={t('budgetModeHelp')} value={input.budgetHard ? 'hard' : 'soft'}
          options={[{ value: 'soft', label: t('budgetSoft') }, { value: 'hard', label: t('budgetHard') }]}
          onChange={mode => update({ budgetHard: mode === 'hard' })} />
        <Check label={t('availability')} help={t('availabilityHelp')} checked={input.availabilityPreferred}
          onChange={availabilityPreferred => update({ availabilityPreferred })} />
      </>}
      <div className="form-actions">
        <button type="button" className="button secondary" onClick={() => {
          if (editing) navigate('/route/review');
          else if (step === 1) navigate('/');
          else navigate('/route', { state: { step: step - 1 } });
        }}>{t('back')}</button>
        <button type="submit" className="button primary">{t(step === 4 || editing ? 'reviewCta' : 'next')}</button>
      </div>
      <button type="button" className="button text-button skip" onClick={skip}>{t('skip')}</button>
    </form>
    <p className="help companion-line">{t('companion')}</p>
    <p className="help storage-policy">{t('sessionPolicy')}</p>
  </div>;
}
