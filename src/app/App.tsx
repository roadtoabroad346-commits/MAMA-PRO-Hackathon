import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import type { Catalog as CatalogData } from '../domain/catalog';
import { loadCatalog } from '../data/catalogRepository';
import { Home } from '../features/Home';
import { Intake } from '../features/intake/Intake';
import { Review } from '../features/intake/Review';
import { Catalog } from '../features/search/Catalog';
import { PageTitle } from '../ui/controls';
import { translate } from '../i18n/messages';
import { AppStateProvider, useApp } from './AppState';
import { LOCALE_KEY } from './session';

function FocusOnNavigation() {
  const location = useLocation();
  useEffect(() => {
    document.querySelector<HTMLElement>('[data-page-title]')?.focus();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.key]);
  return null;
}

function Info({ privacy = false }: { privacy?: boolean }) {
  const { t } = useApp();
  return <div className="form-page"><PageTitle>{t(privacy ? 'privacyTitle' : 'aboutTitle')}</PageTitle><p>{t(privacy ? 'privacyBody' : 'aboutBody')}</p><Link className="button secondary" to="/">{t('home')}</Link></div>;
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
        <Route path="/route" element={<Intake />} />
        <Route path="/route/review" element={<Review />} />
        <Route path="/specialists" element={<Catalog />} />
        <Route path="/about-demo" element={<Info />} />
        <Route path="/privacy" element={<Info privacy />} />
        <Route path="*" element={<><PageTitle intro={t('notFoundHelp')}>{t('notFound')}</PageTitle><Link className="button primary" to="/">{t('home')}</Link></>} />
      </Routes>
    </main>
    <footer className="site-footer"><span>Қолдау.Жол · {t('demo')}</span><nav aria-label={t('about')}><Link to="/about-demo">{t('about')}</Link><Link to="/privacy">{t('privacy')}</Link></nav></footer>
    <FocusOnNavigation />
  </>;
}

export function App() {
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    loadCatalog().then(data => { if (active) setCatalog(data); }, () => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [attempt]);
  if (!catalog) {
    let locale: 'ru' | 'kk' = 'ru';
    try { locale = localStorage.getItem(LOCALE_KEY) === 'kk' ? 'kk' : 'ru'; } catch { /* defaults to RU */ }
    return <main><h1>Қолдау.Жол</h1><p role={failed ? 'alert' : 'status'}>{translate(locale, failed ? 'loadError' : 'loading')}</p>
      {failed && <button className="button primary" onClick={() => { setFailed(false); setAttempt(n => n + 1); }}>{translate(locale, 'retry')}</button>}</main>;
  }
  return <AppStateProvider catalog={catalog}><BrowserRouter><Layout /></BrowserRouter></AppStateProvider>;
}
