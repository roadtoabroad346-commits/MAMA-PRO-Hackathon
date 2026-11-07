import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../app/AppState';

export function CompareTray() {
  const { comparison, comparisonNotice, catalog, locale, toggleCompare, clearComparison, setCatalogView, t } = useApp();
  const [needsMore, setNeedsMore] = useState(false);
  const tray = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!tray.current) return;
    const observer = new ResizeObserver(([entry]) => document.documentElement.style.setProperty('--compare-tray-height', `${entry.target.getBoundingClientRect().height}px`));
    observer.observe(tray.current);
    return () => { observer.disconnect(); document.documentElement.style.removeProperty('--compare-tray-height'); };
  }, [comparison.length]);
  if (!comparison.length) return null;
  return <aside ref={tray} className="compare-tray" aria-label={t('compareTitle')}>
    <p role="status" aria-atomic="true">{t('compareCount', { count: comparison.length })}{comparisonNotice && ` · ${t(comparisonNotice)}`}</p>
    <ul className="compare-selected">{comparison.map(item => <li key={item.specialistId}>
      <button className="condition-chip" type="button" aria-label={`${t('removeCompare')}: ${catalog.specialists.find(s => s.id === item.specialistId)!.displayName[locale]}`}
        onClick={() => { toggleCompare(item.specialistId, item.offerId); document.getElementById('filters-open')?.focus(); }}>{catalog.specialists.find(s => s.id === item.specialistId)!.displayName[locale]} · {item.offerId}<span aria-hidden="true"> ×</span></button>
    </li>)}</ul>
    {needsMore && comparison.length < 2 && <p role="status">{t('compareMore')}</p>}
    <div className="tray-actions"><button className="button primary" id="comparison-open" type="button" onClick={() => {
      if (comparison.length < 2) { setNeedsMore(true); return; }
      setCatalogView(old => ({ ...old, scrollY: window.scrollY, focusId: 'comparison-open' }));
      navigate('/compare');
    }}>{t('openComparison')}</button><button className="button text-button" type="button" onClick={() => { clearComparison(); document.getElementById('filters-open')?.focus(); }}>{t('clearComparison')}</button></div>
  </aside>;
}
