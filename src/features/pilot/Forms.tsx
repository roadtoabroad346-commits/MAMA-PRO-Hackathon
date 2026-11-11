import { useId, useState, type ReactNode, type FormEvent } from 'react';
import { useApp } from '../../app/AppState';
import { pilotText, pilotStatus, type PilotKey } from './messages';
export function useWords(){const {locale}=useApp();return {locale,s:(key:PilotKey)=>pilotText(locale,key),status:(value:string)=>pilotStatus(locale,value)};}
export function Field({label,name,value,onChange,type='text',required=true,max=1000}:{label:string;name:string;value:string;onChange:(v:string)=>void;type?:string;required?:boolean;max?:number}){
 const id=useId(); return <div className="field"><label htmlFor={id}>{label}</label><input id={id} name={name} type={type} value={value} onChange={e=>onChange(e.target.value)} required={required} maxLength={type==='number'?undefined:max} /></div>;
}
export function Text({label,value,onChange,max=1000,required=true}:{label:string;value:string;onChange:(v:string)=>void;max?:number;required?:boolean}){
 const id=useId();return <div className="field"><label htmlFor={id}>{label}</label><textarea id={id} value={value} maxLength={max} required={required} onChange={e=>onChange(e.target.value)} rows={4}/></div>;
}
export function Choice({label,value,options,onChange}:{label:string;value:string;options:readonly string[];onChange:(v:string)=>void}){const {status}=useWords();const id=useId();return <div className="field"><label htmlFor={id}>{label}</label><select id={id} value={value} onChange={e=>onChange(e.target.value)}>{options.map(v=><option key={v} value={v}>{status(v)}</option>)}</select></div>;}
export function Form({children,onSubmit,label}:{children:ReactNode;onSubmit:()=>Promise<unknown>;label:PilotKey}){
 const {s}=useWords();const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();if(busy)return;setBusy(true);try{await onSubmit();}catch{/* Parent owns safe error presentation; keep all fields. */}finally{setBusy(false);}}
 return <form className="pilot-form" onSubmit={submit} aria-busy={busy}><fieldset disabled={busy}>{children}<button className="button primary" type="submit">{s(busy?'saving':label)}</button></fieldset></form>;
}
export function Action({children,onClick}:{children:ReactNode;onClick:()=>Promise<unknown>}){
 const [busy,setBusy]=useState(false);return <button type="button" className="button secondary" disabled={busy} onClick={async()=>{if(busy)return;setBusy(true);try{await onClick();}catch{/* Parent owns safe error. */}finally{setBusy(false);}}}>{children}</button>;
}
export function TimingFields({value,onChange}:{value:{start:string;end:string;timezone:string};onChange:(v:{start:string;end:string;timezone:string})=>void}){const {s}=useWords();return <><Field name="start" label={s('start')} value={value.start} onChange={start=>onChange({...value,start})}/><Field name="end" label={s('end')} value={value.end} onChange={end=>onChange({...value,end})}/><Field name="timezone" label={s('timezone')} value={value.timezone} onChange={timezone=>onChange({...value,timezone})}/></>;}
export function initialTiming(){const start=new Date(Date.now()+86400000);start.setUTCMinutes(0,0,0);return {start:start.toISOString(),end:new Date(start.getTime()+3600000).toISOString(),timezone:'Asia/Almaty'};}
