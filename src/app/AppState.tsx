import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Catalog } from '../domain/catalog';
import { SearchService } from '../domain/SearchService';
import { emptySearchInput, type Locale, type SearchInput } from '../domain/contracts';
import { translate, type MessageKey } from '../i18n/messages';
import { LOCALE_KEY, SESSION_TTL, restoreSession, saveSession, type Session, type Step } from './session';

function initialLocale(): { locale: Locale; failed: boolean } {
  try { return { locale: localStorage.getItem(LOCALE_KEY) === 'kk' ? 'kk' : 'ru', failed: false }; }
  catch { return { locale: 'ru', failed: true }; }
}
function initialSession(catalogVersion: string): Session {
  try { return restoreSession(sessionStorage, catalogVersion, Date.now()); }
  catch { return { input: emptySearchInput(), step: 1, expiresAt: Date.now() + SESSION_TTL, notice: 'storageUnavailable' }; }
}

interface AppState {
  catalog: Catalog; service: SearchService; input: SearchInput; step: Step;
  update: (patch: Partial<SearchInput>) => void; setStep: (step: Step) => void;
  budgetDraft: string; setBudgetDraft: (raw: string) => void;
  locale: Locale; setLocale: (locale: Locale) => void;
  t: (key: MessageKey, values?: Record<string, string | number>) => string;
  notice: Session['notice']; localeFailed: boolean;
}
const Context = createContext<AppState | null>(null);

export function AppStateProvider({ catalog, children }: { catalog: Catalog; children: ReactNode }) {
  const [session, setSession] = useState(() => initialSession(catalog.catalogVersion));
  const [language, setLanguage] = useState(initialLocale);
  // Invalid numeric draft stays in memory across Back/locale, never in persistent storage.
  const [budgetDraft, setBudgetDraft] = useState(() => session.input.budgetKzt?.toString() ?? '');
  const service = useMemo(() => new SearchService(catalog), [catalog]);
  const setStep = useCallback((step: Step) => setSession(old => old.step === step ? old : { ...old, step }), []);
  useEffect(() => {
    let saved = false;
    try { saved = saveSession(sessionStorage, session, catalog.catalogVersion); } catch { /* Storage getter can throw. */ }
    if (!saved && session.notice !== 'storageUnavailable') {
      setSession(old => ({ ...old, notice: 'storageUnavailable' }));
    }
  }, [session, catalog.catalogVersion]);
  useEffect(() => { document.documentElement.lang = language.locale; }, [language.locale]);
  const value: AppState = {
    catalog, service, input: session.input, step: session.step,
    update: patch => setSession(old => ({ ...old, input: { ...old.input, ...patch } })),
    setStep,
    budgetDraft, setBudgetDraft,
    locale: language.locale,
    setLocale: locale => {
      try { localStorage.setItem(LOCALE_KEY, locale); setLanguage({ locale, failed: false }); }
      catch { setLanguage({ locale, failed: true }); }
    },
    t: (key, values) => translate(language.locale, key, values),
    notice: session.notice, localeFailed: language.failed,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApp(): AppState {
  const state = useContext(Context);
  if (!state) throw new Error('AppStateProvider required');
  return state;
}
