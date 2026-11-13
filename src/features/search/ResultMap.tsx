import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import type { SearchResult } from '../../domain/SearchService';
import { mapSearchResult } from '../../domain/map';
import type { MessageKey } from '../../i18n/messages';
export function ResultMap({result}:{result:SearchResult}){
 const {locale,catalog,t}=useApp(),[geo,setGeo]=useState<'idle'|'pending'|'denied'|'available'>('idle');const {points,missing}=mapSearchResult(result);
 const [selected,setSelected]=useState<string|null>(null);
 // All copy comes from the shared i18n catalog instead of inline RU/KK pairs (F-06).
 const geoStatus: MessageKey | null = geo==='idle'?null:geo==='pending'?'mapPending':geo==='denied'?'mapDenied':'mapAvailable';
 // KK-даты Intl: point dates are UTC catalog instants, shown in the UI locale.
 const date=(iso:string)=>new Intl.DateTimeFormat(locale,{dateStyle:'medium',timeZone:'UTC'}).format(new Date(iso));
 return <section className="result-map" aria-labelledby="map-title"><h2 id="map-title">{t('mapTitle')}</h2><p>{t('mapHelp')}</p><button className="button secondary" disabled={geo==='pending'} onClick={()=>{setGeo('pending');if(!navigator.geolocation){setGeo('denied');return;}navigator.geolocation.getCurrentPosition(()=>setGeo('available'),()=>setGeo('denied'),{enableHighAccuracy:false,timeout:10000,maximumAge:0});}}>{t('mapGeo')}</button>{geoStatus&&<p role="status">{t(geoStatus)}</p>}
 <div className="map-canvas" role="group" aria-label={t('mapTitle')}>{points.map((point,i)=><button key={point.offerId} type="button" className="map-point" style={{left:`${10+(point.lon-76.83)/.15*80}%`,top:`${85-(point.lat-43.20)/.07*70}%`}} aria-label={`${i+1} · ${point.offerId}`} aria-pressed={selected===point.offerId} onClick={()=>{setSelected(point.offerId);document.getElementById(`map-${point.offerId}`)?.focus();}}>{i+1}</button>)}</div>
 <p>{t('mapMissing')} {missing.length}</p><h3>{t('mapList')}</h3><ol>{points.map(point=>{const offer=catalog.offers.find(o=>o.id===point.offerId);return <li key={point.offerId} id={`map-${point.offerId}`} tabIndex={-1}><Link to={`/specialists/${offer?.specialistId}?offer=${point.offerId}`}>{offer?.title[locale]} · {point.offerId}</Link><p>{point.lat}, {point.lon} · {t('mapSource')}: {point.source} · {t('mapDate')}: {date(point.checkedAt)}</p><p>{t('mapAccess')}</p></li>;})}</ol>
 </section>;
}
