import { useState } from 'react';
import type { ApplicationData } from '../../../server/contracts.ts';
import type { Resource } from '../../../server/store.ts';
import type { PilotState, Run } from './api';
import { Action, Choice, Field, Form, useWords } from './Forms';
export function ApplicationEditor({run,existing,onDone}:{run:Run;existing?:Resource<ApplicationData>;onDone?:()=>void}){
 const {s}=useWords();
 const [offer,setOffer]=useState(()=>existing?{
  name:existing.data.name,title:existing.data.title,category:existing.data.category,languages:existing.data.languages,format:existing.data.format,ageMin:existing.data.ageMin,ageMax:existing.data.ageMax,priceKind:existing.data.priceKind,price:existing.data.price,unit:existing.data.unit,duration:existing.data.duration,address:existing.data.address,source:existing.data.source,checkedAt:existing.data.checkedAt,accepting:existing.data.accepting,contact:'sandbox:inbox' as const,publicationConsent:true as const,consentVersion:'test-publication-v1' as const,
 }:{name:{ru:'Вымышленный специалист',kk:'Ойдан шығарылған маман'},title:{ru:'Тестовая консультация',kk:'Сынақ кеңесі'},category:'LOGOPED' as ApplicationData['category'],languages:['ru','kk'] as ('ru'|'kk')[],format:'online' as ApplicationData['format'],ageMin:36,ageMax:120,priceKind:'exact' as ApplicationData['priceKind'],price:5000 as number|null,unit:'consultation' as ApplicationData['unit'],duration:45,address:'',source:s('testSource'),checkedAt:new Date().toISOString(),accepting:true,contact:'sandbox:inbox' as const,publicationConsent:true as const,consentVersion:'test-publication-v1' as const});
 const [consent,setConsent]=useState(false),[key,setKey]=useState(()=>crypto.randomUUID());
 const patch=(part:Partial<typeof offer>)=>setOffer(old=>({...old,...part}));
 return <Form label={existing?'save':'createApplication'} onSubmit={async()=>{if(!consent)return;await run(existing?{op:'application.edit',id:existing.id,version:existing.version,offer}:{op:'application.create',key,offer});if(!existing)setKey(crypto.randomUUID());onDone?.();}}>
  <Field label={s('nameRu')} name="nameRu" value={offer.name.ru} onChange={ru=>patch({name:{...offer.name,ru}})}/>
  <Field label={s('nameKk')} name="nameKk" value={offer.name.kk} onChange={kk=>patch({name:{...offer.name,kk}})}/>
  <Field label={s('titleRu')} name="titleRu" value={offer.title.ru} onChange={ru=>patch({title:{...offer.title,ru}})}/>
  <Field label={s('titleKk')} name="titleKk" value={offer.title.kk} onChange={kk=>patch({title:{...offer.title,kk}})}/>
  <Choice label={s('category')} value={offer.category} options={['LOGOPED','DEFECTOLOG','PSYCHOLOG']} onChange={category=>patch({category:category as ApplicationData['category']})}/>
  <fieldset><legend>{s('languages')}</legend>{(['ru','kk'] as const).map(lang=><label className="checkbox" key={lang}><input type="checkbox" checked={offer.languages.includes(lang)} onChange={e=>patch({languages:e.target.checked?[...offer.languages,lang]:offer.languages.filter(v=>v!==lang)})}/>{s(lang)}</label>)}</fieldset>
  <Choice label={s('format')} value={offer.format} options={['online','offline']} onChange={format=>patch({format:format as ApplicationData['format']})}/>
  <div className="pilot-columns"><Field name="ageMin" label={s('ageMin')} type="number" value={String(offer.ageMin)} onChange={v=>patch({ageMin:Number(v)})}/><Field name="ageMax" label={s('ageMax')} type="number" value={String(offer.ageMax)} onChange={v=>patch({ageMax:Number(v)})}/></div>
  <Choice label={s('priceKind')} value={offer.priceKind} options={['exact','from','free','unknown']} onChange={v=>patch({priceKind:v as ApplicationData['priceKind'],price:v==='unknown'?null:v==='free'?0:5000})}/>
  {offer.priceKind!=='unknown'&&offer.priceKind!=='free'&&<Field name="price" label={s('price')} value={String(offer.price??'')} type="number" onChange={v=>patch({price:v===''?null:Number(v)})}/>}
  <Choice label={s('unit')} value={offer.unit} options={['individual_session','group_session','consultation']} onChange={unit=>patch({unit:unit as ApplicationData['unit']})}/>
  <Field name="duration" label={s('duration')} type="number" value={String(offer.duration)} onChange={v=>patch({duration:Number(v)})}/>
  <Field name="address" label={s('address')} required={offer.format==='offline'} value={offer.address} onChange={address=>patch({address})} max={300}/>
  <Field name="source" label={s('source')} value={offer.source} onChange={source=>patch({source})}/><Field name="checkedAt" label={s('checkedAt')} value={offer.checkedAt} onChange={checkedAt=>patch({checkedAt})}/>
  <label className="checkbox"><input type="checkbox" checked={offer.accepting===true} onChange={e=>patch({accepting:e.target.checked})}/>{s('accepting')}</label>
  <label className="checkbox"><input required type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>{s('consent')}</label>
 </Form>;
}
function Review({row,run}:{row:Resource<ApplicationData>;run:Run}){
 const {s}=useWords();const [decision,setDecision]=useState('published'),[scope,setScope]=useState('offer_data'),[evidence,setEvidence]=useState(s('testEvidence')),[source,setSource]=useState(s('testSource')),[limitation,setLimitation]=useState(s('testLimit')),[due,setDue]=useState(()=>new Date(Date.now()+30*86400000).toISOString());
 return <Form label="review" onSubmit={()=>run({op:'moderation.decide',id:row.id,version:row.version,decision:decision as 'published',scope:scope as 'offer_data',evidence,source,limitation,reviewDueAt:due})}>
  <Choice label={s('decision')} value={decision} options={['published','needs_changes','rejected','suspended']} onChange={setDecision}/><Choice label={s('scope')} value={scope} options={['identity','education','contact','offer_data']} onChange={setScope}/>
  <Field name="evidence" label={s('evidence')} value={evidence} onChange={setEvidence}/><Field name="source" label={s('source')} value={source} onChange={setSource}/><Field name="limitation" label={s('limitation')} value={limitation} onChange={setLimitation}/><Field name="reviewDue" label={s('reviewDue')} value={due} onChange={setDue}/>
 </Form>;
}
export function Onboarding({state,run}:{state:PilotState;run:Run}){
 const {s,status,locale}=useWords();const [editing,setEditing]=useState<string|null>(null);
 return <section><h2>{s('work')}</h2>{state.actor.role==='specialist'&&<details><summary>{s('createApplication')}</summary><ApplicationEditor run={run}/></details>}
 {state.applications.length===0&&<p>{s('empty')}</p>}
 {state.applications.map(row=><article className="pilot-card" key={row.id}><h3>{row.data.name[locale]} · {row.data.title[locale]}</h3><p>{status(row.status)} · {s('version')} {row.version}</p><p>{s('trustLimit')}</p>
 {state.actor.role==='specialist'&&<div className="actions">{['draft','needs_changes','published'].includes(row.status)&&<button className="button secondary" onClick={()=>setEditing(editing===row.id?null:row.id)}>{s(editing===row.id?'cancelEdit':'edit')}</button>}{['draft','needs_changes'].includes(row.status)&&<Action onClick={()=>run({op:'application.submit',id:row.id,version:row.version})}>{s('submit')}</Action>}{row.status!=='withdrawn'&&<Action onClick={()=>run({op:'application.withdraw',id:row.id,version:row.version})}>{s('withdraw')}</Action>}</div>}
 {editing===row.id&&<ApplicationEditor existing={row} run={run} onDone={()=>setEditing(null)}/>}
 {state.actor.role==='moderator'&&<>{row.status==='submitted'&&!row.data.moderator&&<Action onClick={()=>run({op:'moderation.assign',id:row.id,version:row.version,moderator:'MODERATOR'})}>{s('assignReview')}</Action>}{row.data.moderator===state.actor.id&&<details><summary>{s('review')}</summary><Review row={row} run={run}/></details>}</>}
 </article>)}
 {state.actor.role==='moderator'&&state.complaints.map(r=><p key={r.id}>{s('complaint')}: {String(r.data.reason)}</p>)}
 </section>;
}
