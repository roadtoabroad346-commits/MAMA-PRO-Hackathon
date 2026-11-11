import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import type { Catalog as CatalogData } from '../domain/catalog';
import { catalogRepository } from '../data/catalogRepository';
import { SavedDemo } from '../features/pilot/SavedDemo';
const Pilot = lazy(() => import('../features/pilot/Pilot').then(module => ({ default: module.Pilot })));
import { Home } from '../features/Home';
import { Intake } from '../features/intake/Intake';
import { Review } from '../features/intake/Review';
import { Catalog } from '../features/search/Catalog';
import { Comparison } from '../features/search/SelectionViews';
import { OfferProfile } from '../features/profile/OfferProfile';
import { DemoRequestEntry } from '../features/profile/DemoRequestEntry';
import { DemoRequestStatus } from '../features/request/DemoRequestStatus';
import { ClearDemoRequests } from '../features/request/ClearDemoRequests';
import { PageTitle } from '../ui/controls';
import { translate } from '../i18n/messages';
import { AppStateProvider, useApp } from './AppState';
import { LOCALE_KEY } from './session';
import { DemoRequestsProvider } from './DemoRequests';

function FocusOnNavigation() {
  const location = useLocation();
  const { catalogView } = useApp();
  const previousPath = useRef<string | null>(null);
  useLayoutEffect(() => {
    const sameProfile = previousPath.current === location.pathname && location.pathname.startsWith('/specialists/');
    previousPath.current = location.pathname;
    // A radio selection updates the URL without stealing focus or jumping up.
    if (sameProfile) return;
    if (location.pathname === '/specialists' && catalogView.focusId) {
      document.getElementById(catalogView.focusId)?.focus({ preventScroll: true });
      window.scrollTo({ top: catalogView.scrollY, behavior: 'instant' });
      return;
    }
    document.querySelector<HTMLElement>('[data-page-title]')?.focus();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.key]);
  return null;
}

function Info({ privacy = false }: { privacy?: boolean }) {
  const { t } = useApp();
  return <div className="form-page"><PageTitle>{t(privacy ? 'privacyTitle' : 'aboutTitle')}</PageTitle><p>{t(privacy ? 'privacyBody' : 'aboutBody')}</p>{privacy && <ClearDemoRequests />}<Link className="button secondary" to="/">{t('home')}</Link></div>;
}

function Layout() {
  const { locale, setLocale, notice, localeFailed, t } = useApp();
  return <>
    <a className="skip-link" href="#main">{t('skipLink')}</a>
    <header className="site-header"><div className="header-inner">
      <Link className="brand" to="/" aria-label={`Қолдау.Жол — ${t('home')}`}>Қолдау<span>.Жол</span></Link>
      <span className="badge">{t('demo')}</span>
      <div className="locale-switch" role="group" aria-label={t('language')}>
        <button lang="ru" aria-pressed={locale === 'ru'} onClick={() => setLocale('ru')}>Рус</button>
        <button lang="kk" aria-pressed={locale === 'kk'} onClick={() => setLocale('kk')}>Қаз</button>
      </div>
    </div></header>
    <main id="main" tabIndex={-1}>
      {notice && <p className="storage-warning" role="status">{t(notice)}</p>}
      {localeFailed && <p className="storage-warning" role="status">{t('localeUnavailable')}</p>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pilot" element={<Suspense fallback={<p role="status">{t('loading')}</p>}><Pilot /></Suspense>} />
        <Route path="/saved" element={<SavedDemo />} />
        <Route path="/route" element={<Intake />} />
        <Route path="/route/review" element={<Review />} />
        <Route path="/specialists" element={<Catalog />} />
        <Route path="/specialists/:specialistId" element={<OfferProfile />} />
        <Route path="/compare" element={<Comparison />} />
        <Route path="/request/:offerId" element={<DemoRequestEntry />} />
        <Route path="/request-status/:requestId" element={<DemoRequestStatus />} />
        <Route path="/about-demo" element={<Info />} />
        <Route path="/privacy" element={<Info privacy />} />
        <Route path="*" element={<><PageTitle intro={t('notFoundHelp')}>{t('notFound')}</PageTitle><Link className="button primary" to="/">{t('home')}</Link></>} />
      </Routes>
    </main>
    <footer className="site-footer"><span>Қолдау.Жол · {t('demo')}</span><nav aria-label={t('about')}><Link to="/about-demo">{t('about')}</Link><Link to="/privacy">{t('privacy')}</Link><Link to="/pilot">{t('pilotNav')}</Link></nav></footer>
    <FocusOnNavigation />
  </>;
}

export function App() {
  const [startupLocale] = useState<'ru' | 'kk'>(() => {
    try { return localStorage.getItem(LOCALE_KEY) === 'kk' ? 'kk' : 'ru'; }
    catch { return 'ru'; }
  });
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // Loading/error screens precede AppStateProvider and need their own lang.
  useEffect(() => { document.documentElement.lang = startupLocale; }, [startupLocale]);
  useEffect(() => {
    let active = true;
    catalogRepository.load().then(data => { if (active) setCatalog(data); }, () => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [attempt]);
  if (!catalog) {
    return <main><h1>Қолдау.Жол</h1><p role={failed ? 'alert' : 'status'}>{translate(startupLocale, failed ? 'loadError' : 'loading')}</p>
      {failed ? <button className="button primary" onClick={() => { setFailed(false); setAttempt(n => n + 1); }}>{translate(startupLocale, 'retry')}</button>
        : <div className="catalog-grid loading-grid" aria-hidden="true">{[0, 1, 2].map(id => <div className="loading-card" key={id} />)}</div>}</main>;
  }
  // All routes use the already-loaded local catalog. Keep URL-backed controlled
  // radios synchronous, so selection and all offer-derived content commit together.
  return <AppStateProvider catalog={catalog}><DemoRequestsProvider><BrowserRouter useTransitions={false}><Layout /></BrowserRouter></DemoRequestsProvider></AppStateProvider>;
}
