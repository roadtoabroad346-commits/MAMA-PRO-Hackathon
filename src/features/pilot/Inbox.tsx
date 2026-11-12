import type {PilotState,Run} from './api';
import {Action,useWords} from './Forms';
export function Inbox({state,run}:{state:PilotState;run:Run}){
 const {s,status,locale}=useWords();
 function value(v:unknown):string{
  if(v===null||v===undefined)return s('unknown');if(typeof v==='boolean')return s(v?'on':'off');if(typeof v==='number')return new Intl.NumberFormat(locale).format(v);
  if(Array.isArray(v))return v.map(value).join('; ');
  if(typeof v==='object'){const f=v as Record<string,unknown>;return ['scope','status','source','limitation'].filter(k=>f[k]!=null).map(k=>value(f[k])).join(' · ');}
  const raw=String(v),label=status(raw);return label===s('unknown')?raw:label;
 }
 return <section><h2>{s('inbox')}</h2><p>{s('reminderHelp')}</p>{!state.inbox.length&&<p>{s('empty')}</p>}<ul>{state.inbox.map(item=><li key={String(item.id)}>{String(item.kind)==='reminder'?s('reminderNotice'):status(String(item.kind))} · {new Intl.DateTimeFormat(locale,{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Almaty'}).format(new Date(String(item.created)))}</li>)}</ul>
 <h3>{s('changes')}</h3>{state.changes.map(r=><article key={r.id} className="pilot-card"><p>{s('offer_change')} · {s('version')} {String(r.data.version)}</p><ul>{(r.data.diff as {field:string;old:unknown;new:unknown}[]).map(d=><li key={d.field}>{status(d.field==='accepting'?'acceptingField':d.field)}: {s('old')} {value(d.old)} → {s('new')} {value(d.new)}</li>)}</ul></article>)}
 {state.subscriptions.filter(sub=>sub.status==='active').map(sub=><p key={sub.id}>{state.offers.find(o=>o.id===sub.data.offerId)?.title[locale]??s('withdrawn')} <Action onClick={()=>run({op:'subscription.set',offerId:sub.data.offerId,enabled:false})}>{s('unsubscribe')}</Action></p>)}
 </section>;
}
