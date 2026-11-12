import {useState} from 'react';
import type {PilotState,Run} from './api';
import {Action,Field,useWords} from './Forms';
export function NextAction({next,run}:{next:NonNullable<PilotState['next']>;run:Run}){
 const {s,status}=useWords();const [text,setText]=useState(next.text);
 const step=<><p>{s(next.reason==='calendar.upcoming'||next.reason==='contact.appointment_confirmed'?'nextPrepare':next.reason==='contact.responded'||next.reason==='contact.parent_reported'?'nextConfirm':'nextWait')}</p><p>{status(next.state)}</p><details><summary>{s('manageStep')}</summary><p>{s('nextHelp')}</p><Field name="nextText" label={s('title')} required={false} max={300} value={text} onChange={setText}/><div className="actions">{(['completed','deferred','hidden','active'] as const).map(mark=><Action key={mark} onClick={()=>run({op:'next.set',source:next.source,state:mark,text})}>{s(mark==='hidden'?'hide':mark==='deferred'?'defer':mark==='active'?'restore':'completed')}</Action>)}</div></details></>;
 return <aside className="pilot-card"><h2>{s('next')}</h2>{next.state==='hidden'?<details><summary>{s('hidden')}</summary>{step}</details>:step}</aside>;
}
