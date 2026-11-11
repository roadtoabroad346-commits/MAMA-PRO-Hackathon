import { useState } from 'react';
import type { Resource } from '../../../server/store.ts';
import type { ContactData } from '../../../server/contracts.ts';
import type { PilotState, Run } from './api';
import { Action, Choice, Field, Form, initialTiming, TimingFields, useWords } from './Forms';
function ContactForm({offer,run}:{offer:PilotState['offers'][number];run:Run}){
 const {s,locale}=useWords();const [purpose,setPurpose]=useState('conditions'),[consent,setConsent]=useState(false),[key]=useState(()=>crypto.randomUUID());
 return <Form label="contactCreate" onSubmit={()=>run({op:'contact.create',key,offerId:offer.id,purpose:purpose as 'conditions',consent:true,consentVersion:'test-contact-v1'})}>
 <p>{s('recipient')}: {offer.name[locale]} · {offer.title[locale]}</p><p>{s('payload')}</p><Choice label={s('purpose')} value={purpose} onChange={setPurpose} options={['conditions','availability']}/>
 <label className="checkbox"><input required type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>{s('contactConsent')}</label></Form>;
}
function Complaint({offerId,run}:{offerId:string;run:Run}){const {s}=useWords();const [reason,setReason]=useState(''),[key]=useState(()=>crypto.randomUUID());return <Form label="report" onSubmit={()=>run({op:'complaint.create',key,applicationId:offerId,reason})}><Field name="reason" label={s('reason')} value={reason} onChange={setReason}/></Form>;}
export function PilotCatalog({state,run}:{state:PilotState;run:Run}){
 const {s,status,locale}=useWords();return <section><h2>{s('catalog')}</h2>{!state.offers.length&&<p>{s('empty')}</p>}{state.offers.map(offer=>{
  const subscribed=state.subscriptions.some(sub=>sub.data.offerId===offer.id&&sub.status==='active');
  return <article className="pilot-card" key={offer.id}><h3>{offer.name[locale]}</h3><p>{offer.title[locale]}</p><dl><div><dt>{s('price')}</dt><dd>{status(offer.priceKind)} {offer.price===null?'':new Intl.NumberFormat(locale).format(offer.price)} · {status(offer.unit)}</dd></div><div><dt>{s('languages')}</dt><dd>{offer.languages.map(v=>status(v)).join(', ')}</dd></div><div><dt>{s('format')}</dt><dd>{status(offer.format)}</dd></div><div><dt>{s('address')}</dt><dd>{offer.address||s('unknown')}</dd></div><div><dt>{s('source')}</dt><dd>{offer.source} · {new Intl.DateTimeFormat(locale,{dateStyle:'medium',timeZone:'Asia/Almaty'}).format(new Date(offer.checkedAt))}</dd></div></dl>
 <p>{s('trustLimit')}</p>{offer.facts.length===0?<p>{s('unverified')}</p>:offer.facts.map(f=><p key={f.scope}>{status(f.scope)}: {status(f.status)} · {f.source} · {f.checkedAt} · {s('reviewDue')}: {f.reviewDueAt} · {f.limitation}</p>)}
 {state.actor.role==='parent'&&<>{offer.accepting===true&&<details><summary>{s('contactCreate')}</summary><ContactForm offer={offer} run={run}/></details>}<Action onClick={()=>run({op:'subscription.set',offerId:offer.id,enabled:!subscribed})}>{s(subscribed?'unsubscribe':'subscribe')}</Action><details><summary>{s('complaint')}</summary><Complaint offerId={offer.id} run={run}/></details></>}
 </article>;})}</section>;
}
function Confirmation({row,run}:{row:Resource<ContactData>;run:Run}){const [timing,setTiming]=useState(initialTiming);return <Form label="confirmMeeting" onSubmit={()=>run({op:'contact.confirm',id:row.id,version:row.version,timing})}><TimingFields value={timing} onChange={setTiming}/></Form>;}
export function Tracker({state,run}:{state:PilotState;run:Run}){
 const {s,status,locale}=useWords();return <section><h2>{s('tracker')}</h2>{!state.contacts.length&&<p>{s('empty')}</p>}{state.contacts.map(row=><article className="pilot-card" key={row.id}><h3>{row.data.snapshot.title[locale]}</h3><p>{status(row.status)}</p><p>{s('recipient')}: {row.data.snapshot.name[locale]} · {s('version')} {row.version}</p><p>{status(row.data.snapshot.priceKind)} {row.data.snapshot.price??s('unknown')}</p>
 <details><summary>{s('history')}</summary><ol>{row.data.history.map((event,i)=><li key={i}>{status(event.status)} · {status(event.source)} · {status(event.actor)} · <time>{new Intl.DateTimeFormat(locale,{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Almaty'}).format(new Date(event.at))}</time></li>)}</ol></details>
 <div className="actions">{state.actor.role==='specialist'&&row.status==='sandbox_available'&&<Action onClick={()=>run({op:'contact.transition',id:row.id,version:row.version,status:'responded'})}>{s('reply')}</Action>}
 {state.actor.role==='parent'&&<>{row.status==='responded'&&<Action onClick={()=>run({op:'contact.transition',id:row.id,version:row.version,status:'parent_reported'})}>{s('agreed')}</Action>}{!['cancelled','closed'].includes(row.status)&&<><Action onClick={()=>run({op:'contact.transition',id:row.id,version:row.version,status:'cancelled'})}>{s('cancel')}</Action><Action onClick={()=>run({op:'contact.revoke',id:row.id,version:row.version})}>{s('revoke')}</Action></>}{['responded','parent_reported','appointment_confirmed'].includes(row.status)&&<Action onClick={()=>run({op:'contact.transition',id:row.id,version:row.version,status:'closed'})}>{s('close')}</Action>}{['cancelled','closed'].includes(row.status)&&<Action onClick={async()=>{if(window.confirm(s('deleteConfirm')))await run({op:'contact.delete',id:row.id,version:row.version});}}>{s('delete')}</Action>}</>}
 </div>{state.actor.role==='specialist'&&['responded','parent_reported'].includes(row.status)&&<details><summary>{s('confirmMeeting')}</summary><Confirmation row={row} run={run}/></details>}
 </article>)}</section>;
}
