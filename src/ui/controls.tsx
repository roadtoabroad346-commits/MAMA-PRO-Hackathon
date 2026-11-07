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

export function Bird({ small = false }: { small?: boolean }) {
  return <svg className={small ? 'bird small' : 'bird'} viewBox="0 0 260 200" fill="none" aria-hidden="true">
    <path d="M40 50C78 48 103 65 123 99C143 53 187 29 233 34C205 49 190 70 180 96C164 130 139 145 111 138L58 173L79 136L45 141L91 116C63 104 48 82 40 50Z" fill="currentColor" />
    <path d="M99 110C125 104 147 112 154 124C141 141 124 145 108 136Z" fill="#FAF8F3" />
    <path d="M165 91L192 98L168 108Z" fill="#B64A35" />
    <circle cx="159" cy="93" r="4" fill="#FAF8F3" />
    <path d="M20 183C78 160 151 183 228 148" stroke="#7A8984" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 8" />
  </svg>;
}

export function PageTitle({ children, intro }: { children: ReactNode; intro?: string }) {
  return <div className="page-title"><h1 tabIndex={-1} data-page-title>{children}</h1>{intro && <p>{intro}</p>}</div>;
}
