import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Catalog } from '../domain/catalog';
import { SearchService } from '../domain/SearchService';
import { emptySearchInput, normalizeSearchInput, searchInputSchema, type Locale, type SearchInput } from '../domain/contracts';
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
  intakeDraft: SearchInput; updateDraft: (patch: Partial<SearchInput>) => void; applyIntake: () => void;
  update: (patch: Partial<SearchInput>) => void; setStep: (step: Step) => void;
  budgetDraft: string; setBudgetDraft: (raw: string) => void;
  locale: Locale; setLocale: (locale: Locale) => void;
  t: (key: MessageKey, values?: Record<string, string | number>) => string;
  notice: Session['notice']; localeFailed: boolean;
  comparison: { specialistId: string; offerId: string }[];
  comparisonInput: SearchInput | null;
  toggleCompare: (specialistId: string, offerId: string) => void;
  comparisonNotice: 'compareLimit' | null;
  clearComparison: () => void;
  catalogView: { showIncomplete: boolean; scrollY: number; focusId: string | null };
  setCatalogView: React.Dispatch<React.SetStateAction<AppState['catalogView']>>;
}
const Context = createContext<AppState | null>(null);

export function AppStateProvider({ catalog, children }: { catalog: Catalog; children: ReactNode }) {
  const [session, setSession] = useState(() => initialSession(catalog.catalogVersion));
  const [language, setLanguage] = useState(initialLocale);
  // Invalid numeric draft stays in memory across Back/locale, never in persistent storage.
  const [budgetDraft, setBudgetDraft] = useState(() => (session.intakeDraft ?? session.input).budgetKzt?.toString() ?? '');
  const service = useMemo(() => new SearchService(catalog), [catalog]);
  const [comparisonState, setComparison] = useState<{ items: AppState['comparison']; input: SearchInput | null; notice: AppState['comparisonNotice'] }>({ items: [], input: null, notice: null });
  const [catalogView, setCatalogView] = useState<AppState['catalogView']>({ showIncomplete: false, scrollY: 0, focusId: null });
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
    update: patch => {
      setBudgetDraft(('budgetKzt' in patch ? patch.budgetKzt : session.input.budgetKzt)?.toString() ?? '');
      setSession(old => {
        const input = searchInputSchema.parse({ ...old.input, ...patch });
        return { ...old, input, intakeDraft: structuredClone(input) };
      });
    },
    intakeDraft: session.intakeDraft ?? session.input,
    updateDraft: patch => setSession(old => ({ ...old, intakeDraft: { ...(old.intakeDraft ?? old.input), ...patch } })),
    applyIntake: () => setSession(old => ({ ...old, input: normalizeSearchInput(old.intakeDraft ?? old.input) })),
    setStep,
    budgetDraft, setBudgetDraft,
    locale: language.locale,
    setLocale: locale => {
      try { localStorage.setItem(LOCALE_KEY, locale); setLanguage({ locale, failed: false }); }
      catch { setLanguage({ locale, failed: true }); }
    },
    t: (key, values) => translate(language.locale, key, values),
    notice: session.notice, localeFailed: language.failed,
    comparison: comparisonState.items, comparisonInput: comparisonState.input, comparisonNotice: comparisonState.notice,
    clearComparison: () => setComparison({ items: [], input: null, notice: null }),
    toggleCompare: (specialistId, offerId) => setComparison(old => {
      // An unavailable pinned pair must remain removable; never replace it.
      if (old.items.some(item => item.specialistId === specialistId && item.offerId === offerId)) {
        const items = old.items.filter(item => item.specialistId !== specialistId || item.offerId !== offerId);
        return { items, input: items.length ? old.input : null, notice: null };
      }
      const offer = catalog.offers.find(o => o.id === offerId && o.specialistId === specialistId && o.publicationStatus === 'published');
      if (!offer || !catalog.specialists.some(s => s.id === specialistId && s.publicationStatus === 'published')) return old;
      const existing = old.items.find(item => item.specialistId === specialistId);
      if (!existing && old.items.length === 3) return { ...old, notice: 'compareLimit' };
      const items = existing ? old.items.map(item => item.specialistId === specialistId ? { specialistId, offerId } : item)
          : [...old.items, { specialistId, offerId }];
      return { items, input: items.length ? old.input ?? structuredClone(session.input) : null, notice: null };
    }),
    catalogView, setCatalogView,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApp(): AppState {
  const state = useContext(Context);
  if (!state) throw new Error('AppStateProvider required');
  return state;
}
