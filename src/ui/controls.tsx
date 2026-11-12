import { useId, type ReactNode } from 'react';
import { useApp } from '../app/AppState';

export function Choices<T extends string>({ name, label, help, value, options, onChange, error }: {
  name: string; label: string; help: string; value: T | null;
  options: { value: T | null; label: string }[]; onChange: (value: T | null) => void; error?: string;
}) {
  const id = useId();
  return <fieldset className="field" aria-describedby={`${id}-help${error ? ` ${id}-error` : ''}`}>
    <legend>{label}</legend>
    <p className="help" id={`${id}-help`}>{help}</p>
    <div className="choices">
      {options.map(option => <label className="choice" key={option.value ?? 'any'}>
        <input type="radio" name={name} value={option.value ?? ''} checked={value === option.value}
          onChange={() => onChange(option.value)} aria-invalid={!!error}
          aria-describedby={`${id}-help${error ? ` ${id}-error` : ''}`} />
        <span>{option.label}</span>
      </label>)}
    </div>
    {error && <p className="field-error" id={`${id}-error`} role="alert">{error}</p>}
  </fieldset>;
}

export function Check({ label, help, checked, onChange }: {
  label: string; help: string; checked: boolean; onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return <div className="check-field">
    <label className="check"><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} aria-describedby={id} /><span>{label}</span></label>
    <p className="help" id={id}>{help}</p>
  </div>;
}

export function DemoNotice() {
  const { t } = useApp();
  return <aside className="demo-notice"><span className="badge">{t('demo')}</span><p>{t('demoNotice')}</p></aside>;
}

export type BirdPose = 'welcome' | 'guide' | 'search';

/**
 * Қарлығаш — the swallow mascot. Three static, decorative compositions share
 * one hand-authored vector base (no external assets, §13.2); the swallow paths
 * below are the single provenance source (see docs/MASCOT_KARLYGASH.md).
 * Static by requirement (traceability §4/14 / W-10): no animation, no logic,
 * aria-hidden, never interfering with CTA semantics.
 */
export function Bird({ pose = 'welcome', small = false }: { pose?: BirdPose; small?: boolean }) {
  // The shared swallow: one raised wing, one lowered, forked tail, cream belly.
  const swallow = <>
    <path d="M40 50C78 48 103 65 123 99C143 53 187 29 233 34C205 49 190 70 180 96C164 130 139 145 111 138L58 173L79 136L45 141L91 116C63 104 48 82 40 50Z" fill="currentColor" />
    <path d="M99 110C125 104 147 112 154 124C141 141 124 145 108 136Z" fill="#FAF8F3" />
    <path d="M165 91L192 98L168 108Z" fill="#B64A35" />
    <circle cx="159" cy="93" r="4" fill="#FAF8F3" />
  </>;
  return <svg className={small ? `bird ${pose} small` : `bird ${pose}`} viewBox="0 0 260 200" fill="none" aria-hidden="true">
    {pose === 'welcome' && <>
      {/* Morning ring the swallow glides out of. */}
      <circle cx="46" cy="44" r="15" stroke="#B64A35" strokeWidth="2.5" opacity=".5" />
      <circle cx="46" cy="44" r="4.5" fill="#B64A35" opacity=".5" />
      {swallow}
      <path d="M20 183C78 160 151 183 228 148" stroke="#7A8984" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 8" />
      <path d="M12 66C30 58 44 60 56 70" stroke="#7A8984" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 8" opacity=".65" />
      <path d="M222 84c3-8 9-12 17-12M226 102c4-5 9-8 16-8" stroke="#7A8984" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 7" opacity=".5" />
    </>}
    {pose === 'guide' && <>
      {swallow}
      {/* Dotted route with a calm chevron: "the next step is this way". */}
      <circle cx="188" cy="152" r="3" fill="#7A8984" />
      <circle cx="204" cy="152" r="3" fill="#7A8984" opacity=".75" />
      <circle cx="220" cy="152" r="3" fill="#7A8984" opacity=".5" />
      <path d="M232 142l14 10-14 10" stroke="#B64A35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 46C64 40 88 44 108 58" stroke="#7A8984" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 8" opacity=".55" />
    </>}
    {pose === 'search' && <>
      {/* Dashed magnifier lens under the swallow's gaze. */}
      <circle cx="196" cy="138" r="27" stroke="#7A8984" strokeWidth="2.5" strokeDasharray="4 7" />
      <path d="M215 157l17 17" stroke="#7A8984" strokeWidth="3.5" strokeLinecap="round" />
      {swallow}
      <path d="M28 178C84 158 150 178 218 150" stroke="#7A8984" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 8" opacity=".7" />
    </>}
  </svg>;
}

export function PageTitle({ children, intro }: { children: ReactNode; intro?: string }) {
  return <div className="page-title"><h1 tabIndex={-1} data-page-title>{children}</h1>{intro && <p>{intro}</p>}</div>;
}

export type IconName = 'search' | 'sliders' | 'sort-relevant' | 'sort-price' | 'sort-district' | 'map' | 'pin' | 'any';

/**
 * Tiny inline icon set (§13.2: no external assets). Decorative only:
 * aria-hidden, inherits currentColor, sized via CSS (.icon).
 */
export function Icon({ name }: { name: IconName }) {
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'search' && <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.2-4.2" /></>}
    {name === 'sliders' && <><path d="M4 7h8M20 7h-4M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2.2" /><circle cx="10" cy="17" r="2.2" /></>}
    {name === 'sort-relevant' && <><path d="M12 3l2.1 5.3L19.5 10l-5.4 1.7L12 17l-2.1-5.3L4.5 10l5.4-1.7Z" /><path d="M18.6 15.8l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z" /></>}
    {name === 'sort-price' && <><path d="M12 3v13" /><path d="M7 11l5 5 5-5" /><path d="M5 20h14" /></>}
    {name === 'sort-district' && <><path d="M12 21s-6.8-5.4-6.8-11A6.8 6.8 0 0 1 18.8 10c0 5.6-6.8 11-6.8 11Z" /><circle cx="12" cy="10" r="2.4" /></>}
    {name === 'map' && <><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14M15 6v14" /></>}
    {name === 'pin' && <><path d="M12 21s-6.8-5.4-6.8-11A6.8 6.8 0 0 1 18.8 10c0 5.6-6.8 11-6.8 11Z" /><circle cx="12" cy="10" r="2.4" /></>}
    {name === 'any' && <><circle cx="5.5" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="18.5" cy="12" r="1.4" fill="currentColor" stroke="none" /></>}
  </svg>;
}

/** Quick budget presets under the numeric input; buttons never submit forms. */
export function BudgetChips({ amounts, onPick }: { amounts: number[]; onPick: (amount: number) => void }) {
  const { locale } = useApp();
  return <div className="amount-chips">
    {amounts.map(amount => <button type="button" className="amount-chip" key={amount} onClick={() => onPick(amount)}>
      {new Intl.NumberFormat(locale).format(amount)} ₸
    </button>)}
  </div>;
}
