import { useState } from 'react';
import type { Resource } from '../../../server/store.ts';
import type { CalendarData } from '../../../server/contracts.ts';
import type { PilotState, Run } from './api';
import { Action, Field, Form, initialTiming, TimingFields, useWords } from './Forms';
function EventForm({run,row,onDone}:{run:Run;row?:Resource<CalendarData>;onDone?:()=>void}){
 const {s}=useWords();const [title,setTitle]=useState(row?.data.title??''),[place,setPlace]=useState(row?.data.place??''),[timing,setTiming]=useState(row?.data.timing??initialTiming),[key,setKey]=useState(()=>crypto.randomUUID());
 return <Form label="save" onSubmit={async()=>{await run(row?{op:'calendar.edit',id:row.id,version:row.version,title,place,timing}:{op:'calendar.create',key,title,place,timing});if(!row)setKey(crypto.randomUUID());onDone?.();}}><Field name="title" label={s('title')} value={title} onChange={setTitle}/><TimingFields value={timing} onChange={setTiming}/><Field name="place" label={s('address')} value={place} onChange={setPlace} required={false} max={300}/></Form>;
}
function Reminder({row,run}:{row:Resource<CalendarData>;run:Run}){const {s}=useWords();const [minutes,setMinutes]=useState(String(row.data.reminder?.minutes??60));return <Form label={row.data.reminder?.enabled?'disable':'enable'} onSubmit={()=>run({op:'reminder.set',id:row.id,version:row.version,enabled:!row.data.reminder?.enabled,minutes:Number(minutes)})}><Field name="minutes" type="number" label={s('minutes')} value={minutes} onChange={setMinutes}/></Form>;}
export function Calendar({state,run}:{state:PilotState;run:Run}){
 const {s,status,locale}=useWords();const [editing,setEditing]=useState<string|null>(null);
 return <section><h2>{s('calendar')}</h2><p>{s('offlineHelp')}</p><details><summary>{s('newEvent')}</summary><EventForm run={run}/></details><ul className="pilot-agenda">{[...state.calendar].sort((a,b)=>Date.parse(a.data.timing.start)-Date.parse(b.data.timing.start)).map(row=><li key={row.id} className="pilot-card"><h3>{row.data.title}</h3><p>{status(row.status)} · {status(row.data.source)}</p><p><time dateTime={row.data.timing.start}>{new Intl.DateTimeFormat(locale,{dateStyle:'full',timeStyle:'short',timeZone:row.data.timing.timezone}).format(new Date(row.data.timing.start))}</time> — <time dateTime={row.data.timing.end}>{new Intl.DateTimeFormat(locale,{timeStyle:'short',timeZone:row.data.timing.timezone}).format(new Date(row.data.timing.end))}</time> · {row.data.timing.timezone}</p><p>{row.data.place}</p>{row.status!=='cancelled'&&state.calendar.some(other=>other.id!==row.id&&other.status!=='cancelled'&&Date.parse(other.data.timing.start)<Date.parse(row.data.timing.end)&&Date.parse(other.data.timing.end)>Date.parse(row.data.timing.start))&&<p className="notice">{s('overlap')}</p>}
 {row.status!=='cancelled'&&<><div className="actions"><button className="button secondary" onClick={()=>setEditing(editing===row.id?null:row.id)}>{s(editing===row.id?'cancelEdit':'edit')}</button><Action onClick={()=>run({op:'calendar.cancel',id:row.id,version:row.version})}>{s('cancel')}</Action></div>{editing===row.id&&<EventForm row={row} run={run} onDone={()=>setEditing(null)}/>}
 <details><summary>{s('reminder')}</summary><p>{s('reminderHelp')}</p><Reminder row={row} run={run}/></details></>}
 <ul>{state.jobs.filter(j=>j.ref===row.id).map(j=><li key={String(j.id)}>{s('reminder')}: {status(String(j.status))} · {String(j.fire_at)}</li>)}</ul>
 </li>)}</ul>{!state.calendar.length&&<p>{s('empty')}</p>}</section>;
}
