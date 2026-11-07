import { Link } from 'react-router-dom';
import { useApp } from '../app/AppState';
import { Bird, PageTitle } from '../ui/controls';

export function Home() {
  const { step, t } = useApp();
  return <>
    <section className="hero">
      <div>
        <p className="eyebrow">{t('tagline')}</p>
        <PageTitle intro={t('homeSubtitle')}>{t('homeTitle')}</PageTitle>
        <div className="home-actions">
          <Link className="button primary" to="/route" state={{ step }}>{t('guide')}<span aria-hidden="true"> →</span></Link>
          <Link className="button secondary" to="/specialists">{t('catalog')}</Link>
        </div>
        <p className="help">{t('noRegistration')}</p>
      </div>
      <aside className="welcome-card"><Bird /><p>{t('welcome')}</p><span>Қарлығаш</span></aside>
    </section>
    <ol className="home-steps">
      {(['1', '2', '3'] as const).map((number, index) => <li key={number}>
        <span className="step-number">0{number}</span>
        <h2>{t((['homeStep1', 'homeStep2', 'homeStep3'] as const)[index])}</h2>
        <p>{t((['homeStep1Help', 'homeStep2Help', 'homeStep3Help'] as const)[index])}</p>
      </li>)}
    </ol>
    <section className="demo-explanation"><span className="badge">{t('demo')}</span><div><h2>{t('demoNotice')}</h2><p>{t('demoHelp')}</p></div></section>
  </>;
}
