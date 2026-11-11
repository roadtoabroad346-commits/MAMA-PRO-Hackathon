import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Command } from '../../../server/contracts.ts';
import { PageTitle } from '../../ui/controls';
import { pilotApi, type PilotState, type Run } from './api';
import { errorKey, type PilotKey } from './messages';
import { Action, Choice, Form, useWords } from './Forms';
import { Inbox } from './Inbox';
import { NextAction } from './NextAction';
import { Onboarding } from './Onboarding';
import { PilotCatalog, Tracker } from './Contacts';
import { Calendar } from './Calendar';
import { PrivateRecords, Summary, Tasks } from './PrivateRecords';
const actors=['PARENT_A','PARENT_B','SPECIALIST_A','SPECIALIST_B','MODERATOR','ADMIN'] as const;
const tabs=['catalog','work','tracker','calendar','diary','tasks','summary','inbox'] as const;
export function Pilot(){
 const {s,status}=useWords();const [state,setState]=useState<PilotState|null>(null),[actor,setActor]=useState('PARENT_A'),[tab,setTab]=useState<typeof tabs[number]>('catalog'),[error,setError]=useState<PilotKey|null>(null),[notice,setNotice]=useState<PilotKey|null>(null),[pending,setPending]=useState<Command|null>(null);
 const csrf=useRef(''),mounted=useRef(true),generation=useRef(0);
 const [loading,setLoading]=useState(true),[logoutPending,setLogoutPending]=useState(false);
 async function logout(){generation.current++;setState(null);setPending(null);setNotice(null);setTab('catalog');try{await pilotApi('logout',{},csrf.current);csrf.current='';setLogoutPending(false);setError(null);}catch{setLogoutPending(true);setError('logoutUnconfirmed');}}
 async function refresh(){const g=generation.current;try{const result=await pilotApi<PilotState&{csrf:string}>('state');if(mounted.current&&g===generation.current){csrf.current=result.csrf;setState(result);setError(null);}}catch(e){if(mounted.current&&g===generation.current){const key=errorKey((e as Error).message);setError(key);if(key==='auth'){setState(null);csrf.current='';}}}finally{if(mounted.current)setLoading(false);}}
 useEffect(()=>{mounted.current=true;void refresh();return()=>{mounted.current=false;generation.current++;};},[]);
 const run:Run=async c=>{
  setError(null);setNotice(null);const g=generation.current;
  try{const result=await pilotApi<unknown>('commands',c,csrf.current);if(g!==generation.current)throw new Error('AUTH_REQUIRED');setPending(null);if(c.op!=='summary.preview')setNotice('saved');await refresh();return result;}
  catch(e){const key=errorKey((e as Error).message);setError(key);if(key==='auth'||(e as Error).message==='CSRF_DENIED'){generation.current++;csrf.current='';setState(null);setPending(null);}else if(key==='unavailable')setPending(c);throw e;}
 };
 async function login(){setLogoutPending(false);generation.current++;setState(null);setPending(null);csrf.current='';try{const result=await pilotApi<{csrf:string}>('test-login',{actor});csrf.current=result.csrf;await refresh();setNotice(null);}catch(e){setError(errorKey((e as Error).message));}}
 const allowed=(t:typeof tabs[number])=>state&&(t==='catalog'||t==='inbox'||(t==='work'&&['specialist','moderator'].includes(state.actor.role))||(t==='tracker'&&['specialist','parent'].includes(state.actor.role))||(['calendar','diary','summary'].includes(t)&&state.actor.role==='parent')||(t==='tasks'&&['specialist','parent'].includes(state.actor.role)));
 return <div className="pilot-page"><PageTitle intro={s('intro')}>{s('pilot')}</PageTitle><p className="notice">{s('blocked')}</p><Link to="/specialists">← {s('catalog')} · DEMO</Link>
 {error&&<p role="alert" className="request-error">{s(error)}</p>}{notice&&<p role="status">{s(notice)}</p>}{logoutPending&&<Action onClick={logout}>{s('retryLogout')}</Action>}{pending&&<Action onClick={()=>run(pending)}>{s('retry')}</Action>}
 {!state?<>{loading?<p role="status">{s('refresh')}</p>:<Form label="login" onSubmit={login}><Choice label={s('actor')} value={actor} options={actors} onChange={setActor}/></Form>}</>:<>
 <div className="pilot-session"><p>{s('actor')}: {status(state.actor.id)}</p><div className="actions"><Action onClick={refresh}>{s('refresh')}</Action><Action onClick={logout}>{s('logout')}</Action></div></div>
 {state.next&&state.actor.role==='parent'&&['catalog','tracker','calendar'].includes(tab)&&<NextAction key={state.next.source} next={state.next} run={run}/>}
 <nav className="pilot-tabs" aria-label={s('pilot')}>{tabs.filter(allowed).map(t=><button className="button secondary" key={t} aria-current={tab===t?'page':undefined} onClick={()=>{setTab(t);setNotice(null);}}>{s(t)}</button>)}</nav>
 {tab==='catalog'&&<PilotCatalog key={state.actor.id} state={state} run={run}/>}{tab==='work'&&allowed(tab)&&<Onboarding key={state.actor.id} state={state} run={run}/>}{tab==='tracker'&&allowed(tab)&&<Tracker key={state.actor.id} state={state} run={run}/>}{tab==='calendar'&&allowed(tab)&&<Calendar key={state.actor.id} state={state} run={run}/>}{tab==='diary'&&allowed(tab)&&<PrivateRecords key={state.actor.id} state={state} run={run}/>}{tab==='tasks'&&allowed(tab)&&<Tasks key={state.actor.id} state={state} run={run}/>}{tab==='summary'&&allowed(tab)&&<Summary key={state.actor.id} state={state} run={run}/>}
 {tab==='inbox'&&<Inbox state={state} run={run}/>}
 </>}
 </div>;
}
