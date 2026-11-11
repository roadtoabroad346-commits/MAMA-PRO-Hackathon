import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PilotService } from '../server/service.ts';
import { createPilotServer, testOnly } from '../server/http.ts';
import type { Actor } from '../server/store.ts';
import type { ApplicationData, AssignmentData, CalendarData, ContactData } from '../server/contracts.ts';
import { SearchService } from '../src/domain/SearchService';
import rawCatalog from '../src/data/catalog.json';
import { catalogSchema } from '../src/domain/catalog';
import { emptySearchInput } from '../src/domain/contracts';
import { mapSearchResult, demoLocations } from '../src/domain/map';
let service:PilotService,at:Date,dir:string;
const A='PARENT_A',B='PARENT_B',S='SPECIALIST_A',T='SPECIALIST_B',M='MODERATOR';
let sequence=0;
const key=()=>`operation-${++sequence}`;
const offer=():ApplicationData=>({name:{ru:'Вымышленный А',kk:'Ойдан шығарылған А'},title:{ru:'Тестовая услуга',kk:'Сынақ қызметі'},category:'LOGOPED',languages:['ru','kk'],format:'online',ageMin:36,ageMax:120,priceKind:'exact',price:5000,unit:'consultation',duration:45,address:'',source:'synthetic',checkedAt:'2026-11-10T00:00:00Z',accepting:true,contact:'sandbox:inbox',publicationConsent:true,consentVersion:'test-publication-v1'});
const timing={start:'2026-12-31T23:30:00+05:00',end:'2027-01-01T00:30:00+05:00',timezone:'Asia/Almaty'};
const actor=(id:string)=>service.actor(id);
const run=(id:string,cmd:unknown)=>service.run(actor(id),cmd) as {id:string;version:number};
function application(specialist=S){return run(specialist,{op:'application.create',key:key(),offer:offer()});}
function publish(id=application().id){
 let r=service.store.get(id);run(r.owner,{op:'application.submit',id,version:r.version});r=service.store.get(id);
 run(M,{op:'moderation.assign',id,version:r.version,moderator:M});r=service.store.get(id);
 run(M,{op:'moderation.decide',id,version:r.version,decision:'published',scope:'offer_data',evidence:'PRIVATE_EVIDENCE',source:'synthetic-review',limitation:'not a guarantee',reviewDueAt:'2027-01-10T00:00:00Z'});return service.store.get<ApplicationData>(id);
}
function contact(){const app=publish();const r=run(A,{op:'contact.create',key:key(),offerId:app.id,purpose:'conditions',consent:true,consentVersion:'test-contact-v1'});return service.store.get<ContactData>(r.id);}
function event(){const r=run(A,{op:'calendar.create',key:key(),title:'Private event',timing,place:'Private place'});return service.store.get<CalendarData>(r.id);}
function assignment(){const r=run(S,{op:'assignment.create',key:key(),parentId:A,instruction:'Private instruction',conditions:'Agreed conditions',goalId:null,due:null,reviewOn:null});return service.store.get<AssignmentData>(r.id);}
beforeEach(()=>{dir=mkdtempSync(join(tmpdir(),'qoldau-pilot-'));at=new Date('2026-11-10T12:00:00Z');service=new PilotService(join(dir,'pilot.sqlite'),()=>at);});
afterEach(()=>{service.store.db.close();rmSync(dir,{recursive:true,force:true});});
describe('real SQLite authorization and application lifecycle',()=>{
 it('migrates twice without losing records, constraints remain active',()=>{
  const r=application();service.store.db.close();service=new PilotService(join(dir,'pilot.sqlite'),()=>at);
  expect(service.store.get(r.id).version).toBe(1);expect(service.store.db.prepare('SELECT count(*) AS n FROM schema_migrations').get()).toMatchObject({n:1});
  expect(()=>service.store.db.prepare("INSERT INTO resources VALUES('bad','diary','missing','missing',NULL,NULL,'active',1,'{}','now','now')").run()).toThrow();
 });
 it('blocks production/test bypass and live modes',()=>{
  expect(()=>testOnly('PILOT_TEST','production')).toThrow('LIVE_BLOCKED');expect(()=>createPilotServer(service,'PILOT_TEST','production')).toThrow('LIVE_BLOCKED');expect(()=>testOnly('PILOT_LIVE','development')).toThrow('LIVE_BLOCKED');expect(()=>testOnly(undefined,'test')).toThrow('LIVE_BLOCKED');
 });
 it('does not allow payload owner, role, verification or arbitrary operation',()=>{
  for(const injected of [{owner:B},{role:'admin'},{verificationStatus:'verified'}])expect(()=>run(S,{op:'application.create',key:key(),offer:offer(),...injected})).toThrow('INVALID_INPUT');
  expect(()=>run(S,{op:'moderation.decide',id:application().id,version:1,decision:'published',scope:'education',source:'x',evidence:'x',limitation:'x',reviewDueAt:'2027-01-01T00:00:00Z'})).toThrow('NOT_FOUND');
  expect(()=>run(A,{op:'provider.callback',delivered:true})).toThrow('INVALID_INPUT');
 });
 it('publishes only consented public fields, never evidence/consent/contact',()=>{
  const r=application();expect(service.publicOffers()).toHaveLength(0);publish(r.id);
  const dto=JSON.stringify(service.publicOffers());expect(dto).not.toContain('PRIVATE_EVIDENCE');expect(dto).not.toContain('publicationConsent');expect(dto).not.toContain('sandbox:inbox');
  expect(service.publicOffers()[0].facts[0].status).toBe('document_seen');
 });
 it('requires assignment and permits needs_changes, resubmission, withdraw',()=>{
  const r=application();run(S,{op:'application.submit',...r});let current=service.store.get(r.id);
  const decide={op:'moderation.decide',id:r.id,version:current.version,decision:'needs_changes',scope:'offer_data',evidence:'test',source:'test',limitation:'test',reviewDueAt:'2027-01-01T00:00:00Z'};
  expect(()=>run(M,decide)).toThrow('NOT_FOUND');run(M,{op:'moderation.assign',id:r.id,version:current.version,moderator:M});current=service.store.get(r.id);run(M,{...decide,version:current.version});current=service.store.get(r.id);
  run(S,{op:'application.edit',id:r.id,version:current.version,offer:offer()});current=service.store.get(r.id);run(S,{op:'application.submit',id:r.id,version:current.version});current=service.store.get(r.id);
  run(M,{...decide,version:current.version,decision:'published'});current=service.store.get(r.id);run(S,{op:'application.withdraw',id:r.id,version:current.version});expect(service.publicOffers()).toEqual([]);
 });
 it('expires trust facts without permanent verified badge',()=>{publish();at=new Date('2027-01-10T00:00:00Z');expect(service.publicOffers()[0].facts[0].status).toBe('stale');});
 it('rechecks account active status, does not trust stale actor role',()=>{
  const stale=actor(A);expect(()=>service.run({...stale,role:'specialist'} as Actor,{op:'application.create',key:key(),offer:offer()})).toThrow('NOT_FOUND');
  service.store.db.prepare('UPDATE accounts SET active=0 WHERE id=?').run(A);expect(()=>service.run(stale,{op:'goal.create',key:key(),text:'x',discussedOn:null})).toThrow('AUTH_REQUIRED');
 });
});
describe('contact, tracker and durable sandbox inbox',()=>{
 it('same key/payload persists across restart, different payload conflicts',()=>{
  const app=publish();const c={op:'contact.create',key:key(),offerId:app.id,purpose:'conditions',consent:true,consentVersion:'test-contact-v1'};
  const first=run(A,c);expect(run(A,c)).toEqual(first);expect(()=>run(A,{...c,purpose:'availability'})).toThrow('IDEMPOTENCY_CONFLICT');
  service.store.db.close();service=new PilotService(join(dir,'pilot.sqlite'),()=>at);expect(run(A,c)).toEqual(first);service.pump();service.pump();expect(service.state(actor(S)).inbox).toHaveLength(1);expect(service.store.get(first.id).status).toBe('sandbox_available');
 });
 it('parent B cannot read or change A request and moderator sees no requests',()=>{
  const r=contact();expect(service.state(actor(B)).contacts).toEqual([]);expect(service.state(actor(M)).contacts).toEqual([]);
  expect(()=>run(B,{op:'contact.transition',id:r.id,version:r.version,status:'cancelled'})).toThrow('NOT_FOUND');expect(()=>run(T,{op:'contact.transition',id:r.id,version:r.version,status:'responded'})).toThrow('NOT_FOUND');
 });
 it('separates server receipt, sandbox availability, parent report and confirmation',()=>{
  let r=contact();expect(r.status).toBe('server_received');expect(service.state(actor(A)).calendar).toEqual([]);
  expect(()=>run(A,{op:'contact.transition',id:r.id,version:r.version,status:'parent_reported'})).toThrow('INVALID_TRANSITION');service.pump();r=service.store.get(r.id);
  run(S,{op:'contact.transition',id:r.id,version:r.version,status:'responded'});r=service.store.get(r.id);run(A,{op:'contact.transition',id:r.id,version:r.version,status:'parent_reported'});
  expect(service.state(actor(A)).calendar).toEqual([]);r=service.store.get(r.id);const c={op:'contact.confirm',id:r.id,version:r.version,timing};run(S,c);expect(()=>run(S,c)).toThrow('INVALID_TRANSITION');
  const events=service.state(actor(A)).calendar;expect(events).toHaveLength(1);expect(events[0].data.source).toBe('confirmed_request');expect(events[0].status).toBe('confirmed');
 });
 it('late jobs cannot reopen cancellation; deletion is separate and scrubs text',()=>{
  const r=contact();run(A,{op:'contact.transition',id:r.id,version:r.version,status:'cancelled'});service.pump();expect(service.store.get(r.id).status).toBe('cancelled');expect(service.state(actor(S)).inbox).toHaveLength(0);
  const current=service.store.get(r.id);run(A,{op:'contact.delete',id:r.id,version:current.version});expect(service.store.get(r.id).data).toEqual({});expect(service.state(actor(A)).contacts).toEqual([]);
 });
 it('revocation cancels pending processing and confirmed event reminders',()=>{
  let r=contact();service.pump();r=service.store.get(r.id);run(S,{op:'contact.transition',id:r.id,version:r.version,status:'responded'});r=service.store.get(r.id);run(S,{op:'contact.confirm',id:r.id,version:r.version,timing});
  const e=service.state(actor(A)).calendar[0];run(A,{op:'reminder.set',id:e.id,version:e.version,enabled:true,minutes:60});r=service.store.get(r.id);run(A,{op:'contact.revoke',id:r.id,version:r.version});
  expect(service.state(actor(A)).calendar[0].status).toBe('cancelled');expect(service.state(actor(A)).jobs.filter(j=>j.channel==='in_app')[0].status).toBe('cancelled');
 });
 it('original offer snapshot survives price edit and withdraw',()=>{
  const r=contact();const app=service.store.get(r.ref!);run(S,{op:'application.edit',id:app.id,version:app.version,offer:{...offer(),price:9000}});expect(service.store.get<ContactData>(r.id).data.snapshot.price).toBe(5000);expect(service.publicOffers()).toHaveLength(0);
 });
 it('rate limit is per trusted owner and transaction does not enqueue rejected request',()=>{
  const app=publish();for(let i=0;i<30;i++)run(A,{op:'contact.create',key:key(),offerId:app.id,purpose:'conditions',consent:true,consentVersion:'test-contact-v1'});
  expect(()=>run(A,{op:'contact.create',key:key(),offerId:app.id,purpose:'conditions',consent:true,consentVersion:'test-contact-v1'})).toThrow('RATE_LIMITED');expect(service.state(actor(A)).contacts).toHaveLength(30);
 });
});
describe('calendar and reminders',()=>{
 it('retains exact instant and IANA zone across year boundary; rejects invalid zone/time',()=>{
  const r=event();expect(r.data.timing).toEqual(timing);expect(new Intl.DateTimeFormat('en-CA',{timeZone:timing.timezone,year:'numeric'}).format(new Date(timing.end))).toBe('2027');
  for(const t of [{...timing,end:timing.start},{...timing,timezone:'Bad/Zone'},{...timing,start:'2026-02-30T00:00:00Z'}])expect(()=>run(A,{op:'calendar.create',key:key(),title:'x',place:'',timing:t})).toThrow('INVALID_INPUT');
 });
 it('handles leap-day and DST offsets as instants without server-zone rewriting',()=>{
  for(const timing of [{start:'2028-02-29T23:30:00+05:00',end:'2028-03-01T00:30:00+05:00',timezone:'Asia/Almaty'},{start:'2027-03-14T01:30:00-05:00',end:'2027-03-14T03:30:00-04:00',timezone:'America/New_York'}]){
   const r=run(A,{op:'calendar.create',key:key(),title:'boundary',place:'',timing});expect(service.store.get<CalendarData>(r.id).data.timing).toEqual(timing);
  }
 });
 it('rejects foreign calendar changes and stale edits without overwrite',()=>{
  const r=event();expect(()=>run(B,{op:'calendar.cancel',id:r.id,version:r.version})).toThrow('NOT_FOUND');run(A,{op:'calendar.edit',id:r.id,version:r.version,title:'new',timing,place:''});
  expect(()=>run(A,{op:'calendar.edit',id:r.id,version:r.version,title:'stale',timing,place:''})).toThrow('VERSION_CONFLICT');expect(service.store.get<CalendarData>(r.id).data.title).toBe('new');
 });
 it('edit invalidates old reminder, job retry produces one in-app notice and not delivered',()=>{
  let r=event();run(A,{op:'reminder.set',id:r.id,version:r.version,enabled:true,minutes:60});r=service.store.get(r.id);
  const shifted={...timing,start:'2027-01-01T11:00:00+05:00',end:'2027-01-01T12:00:00+05:00'};run(A,{op:'calendar.edit',id:r.id,version:r.version,title:'new',place:'',timing:shifted});
  const jobs=service.state(actor(A)).jobs;expect(jobs.map(j=>j.status).sort()).toEqual(['cancelled','scheduled']);at=new Date('2027-01-01T05:00:00Z');service.pump();service.pump();expect(service.state(actor(A)).inbox).toHaveLength(1);expect(service.state(actor(A)).jobs.some(j=>j.status==='in_app_available')).toBe(true);
 });
 it('disabled/cancelled and overdue jobs never notify, scheduler survives restart',()=>{
  let r=event();run(A,{op:'reminder.set',id:r.id,version:r.version,enabled:true,minutes:60});r=service.store.get(r.id);run(A,{op:'reminder.set',id:r.id,version:r.version,enabled:false,minutes:60});
  r=service.store.get(r.id);run(A,{op:'reminder.set',id:r.id,version:r.version,enabled:true,minutes:60});service.store.db.close();service=new PilotService(join(dir,'pilot.sqlite'),()=>at);
  at=new Date('2027-01-03T00:00:00Z');service.pump();expect(service.state(actor(A)).inbox).toEqual([]);expect(service.state(actor(A)).jobs.some(j=>j.status==='expired')).toBe(true);
 });
});
describe('subscriptions and next action',()=>{
 it('opt-in dedup/unsubscribe, cosmetic moderation timestamp no spam, withdrawal is public-safe',()=>{
  const app=publish();run(A,{op:'subscription.set',offerId:app.id,enabled:true});
  const c={op:'moderation.decide',id:app.id,version:app.version,decision:'published',scope:'offer_data',evidence:'changed private note',source:'synthetic-review',limitation:'not a guarantee',reviewDueAt:'2027-02-01T00:00:00Z'};
  run(M,c);expect(service.state(actor(A)).changes).toHaveLength(0);const r=service.store.get(app.id);run(S,{op:'application.withdraw',id:r.id,version:r.version});expect(service.state(actor(A)).changes).toHaveLength(1);service.pump();expect(service.state(actor(A)).changes).toHaveLength(1);
  expect(JSON.stringify(service.state(actor(A)).changes)).not.toContain('PRIVATE_EVIDENCE');run(A,{op:'subscription.set',offerId:app.id,enabled:false});expect(service.state(actor(A)).subscriptions[0].status).toBe('disabled');
 });
 it('next action state cannot change request or create meeting; no duplicate action',()=>{
  const r=contact();run(A,{op:'next.set',source:r.id,state:'completed',text:'later'});run(A,{op:'next.set',source:r.id,state:'hidden',text:'later'});expect(service.store.list('next')).toHaveLength(1);expect(service.state(actor(A)).next?.state).toBe('hidden');expect(service.store.get(r.id).status).toBe('server_received');expect(service.state(actor(A)).calendar).toEqual([]);
 });
});
describe('private goals, diary, assignments and exact summary selection',()=>{
 it('denies parent B, moderator and specialist access to diary, rejects mass assignment and oversized text',()=>{
  const r=run(A,{op:'diary.create',key:key(),date:'2026-11-10',goalId:null,observation:'PRIVATE_DIARY',context:''});
  for(const id of [B,S,M]){expect(service.state(actor(id)).diary).toEqual([]);expect(()=>run(id,{op:'diary.delete',id:r.id,version:r.version})).toThrow('NOT_FOUND');}
  expect(()=>run(A,{op:'diary.create',key:key(),date:'2026-11-10',goalId:null,observation:'x'.repeat(1001),context:''})).toThrow('INVALID_INPUT');
  expect(()=>run(A,{op:'diary.create',key:key(),date:'2026-11-10',goalId:null,observation:'x',context:'',owner:B})).toThrow('INVALID_INPUT');
 });
 it('private edit conflict and delete scrub content including audit/idempotency copies',()=>{
  const r=run(A,{op:'diary.create',key:key(),date:'2026-11-10',goalId:null,observation:'SENSITIVE_TEXT',context:''});run(A,{op:'diary.edit',id:r.id,version:r.version,date:'2026-11-11',goalId:null,observation:'SENSITIVE_TEXT_NEW',context:''});
  expect(()=>run(A,{op:'diary.delete',id:r.id,version:r.version})).toThrow('VERSION_CONFLICT');run(A,{op:'diary.delete',id:r.id,version:2});expect(service.store.get(r.id).data).toEqual({});
  for(const table of ['audit','operations'])expect(JSON.stringify(service.store.db.prepare(`SELECT * FROM ${table}`).all())).not.toContain('SENSITIVE_TEXT');
 });
 it('accepts dangerous HTML as literal data, never as executable markup',()=>{
  const text='<img src=x onerror=alert(1)>';const r=run(A,{op:'diary.create',key:key(),date:'2026-11-10',goalId:null,observation:text,context:''});expect(service.state(actor(A)).diary[0].data.observation).toBe(text);expect(r.id).toBeTruthy();
 });
 it('denies foreign goal attachment and assignments to unscoped recipients',()=>{
  const g=run(B,{op:'goal.create',key:key(),text:'private goal',discussedOn:null});expect(()=>run(A,{op:'diary.create',key:key(),date:'2026-11-10',goalId:g.id,observation:'x',context:''})).toThrow('NOT_FOUND');
  expect(()=>run(S,{op:'assignment.create',key:key(),parentId:B,instruction:'x',conditions:'x',goalId:null,due:null,reviewOn:null})).toThrow('NOT_FOUND');
  expect(()=>run(S,{op:'assignment.create',key:key(),parentId:A,instruction:'x',conditions:'x',goalId:g.id,due:null,reviewOn:null})).toThrow('NOT_FOUND');
 });
 it('links responses to instruction version, permits unable/question and keeps old revisions',()=>{
  let r=assignment();expect(()=>run(T,{op:'assignment.withdraw',id:r.id,version:r.version})).toThrow('NOT_FOUND');
  run(A,{op:'assignment.respond',id:r.id,version:r.version,status:'unable',observation:'question'});r=service.store.get(r.id);run(S,{op:'assignment.edit',id:r.id,version:r.version,instruction:'revised',conditions:'new',due:null,reviewOn:null});r=service.store.get(r.id);
  expect(r.data.responses[0].version).toBe(1);expect(r.data.instructionVersion).toBe(2);expect(r.data.revisions[0].instruction).toBe('Private instruction');run(A,{op:'assignment.respond',id:r.id,version:r.version,status:'question',observation:'why?'});r=service.store.get(r.id);expect(r.data.responses[1].version).toBe(2);run(S,{op:'assignment.withdraw',id:r.id,version:r.version});r=service.store.get(r.id);
  expect(()=>run(A,{op:'assignment.respond',id:r.id,version:r.version,status:'done',observation:''})).toThrow('NOT_FOUND');
 });
 it('scope revoke applies immediately to old session, while recipient retains authored history',()=>{
  const r=assignment(),stale=actor(S);run('ADMIN',{op:'scope.revoke',specialistId:S,parentId:A});expect(service.state(actor(S)).assignments).toEqual([]);expect(service.state(actor(A)).assignments).toHaveLength(1);
  expect(()=>service.run(stale,{op:'assignment.edit',id:r.id,version:r.version,instruction:'x',conditions:'x',due:null,reviewOn:null})).toThrow('NOT_FOUND');expect(()=>run(A,{op:'assignment.respond',id:r.id,version:r.version,status:'done',observation:''})).toThrow('NOT_FOUND');
 });
 it('summary default selection empty and exact selection excludes all unselected data',()=>{
  const r=run(A,{op:'diary.create',key:key(),date:'2026-11-10',goalId:null,observation:'CHOSEN_ONLY',context:''});run(A,{op:'diary.create',key:key(),date:'2026-11-10',goalId:null,observation:'HIDDEN_DIARY',context:''});
  expect(service.run(actor(A),{op:'summary.preview',selected:[],questions:'',recipient:'S'})).toMatchObject({items:[]});
  const preview=JSON.stringify(service.run(actor(A),{op:'summary.preview',selected:[r.id],questions:'Q',recipient:'S'}));expect(preview).toContain('CHOSEN_ONLY');expect(preview).not.toContain('HIDDEN_DIARY');
  expect(()=>run(B,{op:'summary.preview',selected:[r.id],questions:'',recipient:'S'})).toThrow('NOT_FOUND');expect(service.store.list('summary')).toEqual([]);
 });
});
describe('HTTP boundary, sessions and real transport',()=>{
 it('auth/CSRF/origin enforced; guest sees public DTO only, no private HTML fallback',async()=>{
  const app=publish();const server=createPilotServer(service,'PILOT_TEST','test');await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));const address=server.address();if(!address||typeof address==='string')throw Error();const url=`http://127.0.0.1:${address.port}`;
  try{
   const guest=await fetch(url+'/api/pilot/state');expect(guest.status).toBe(401);expect(guest.headers.get('cache-control')).toContain('no-store');expect(await guest.json()).toEqual({error:'AUTH_REQUIRED'});
   const pub=await fetch(url+'/api/pilot/public').then(r=>r.text());expect(pub).toContain(app.id);expect(pub).not.toContain('PRIVATE_EVIDENCE');
   const login=await fetch(url+'/api/pilot/test-login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({actor:A})});const cookie=login.headers.get('set-cookie')!.split(';')[0];expect(login.headers.get('set-cookie')).toContain('HttpOnly');const session=await login.json() as {csrf:string};
   const c={op:'goal.create',key:key(),text:'HTTP_GOAL',discussedOn:null};const post=(headers:Record<string,string>,body=c)=>fetch(url+'/api/pilot/commands',{method:'POST',headers:{'content-type':'application/json',cookie,...headers},body:JSON.stringify(body)});
   expect((await post({})).status).toBe(403);expect((await post({'x-pilot-csrf':session.csrf,origin:'https://evil.example'})).status).toBe(403);expect((await post({'x-pilot-csrf':session.csrf})).status).toBe(200);
   const state=await fetch(url+'/api/pilot/state',{headers:{cookie}}).then(r=>r.json()) as {goals:unknown[]};expect(state.goals).toHaveLength(1);
   const logout=await fetch(url+'/api/pilot/logout',{method:'POST',headers:{'content-type':'application/json',cookie,'x-pilot-csrf':session.csrf},body:'{}'});expect(logout.status).toBe(200);expect((await fetch(url+'/api/pilot/state',{headers:{cookie}})).status).toBe(401);
  }finally{await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}
 });
});
describe('same SearchResult map contract',()=>{
 it('plots only eligible matching offer IDs; unknown/excluded never becomes map pass',async()=>{
  const catalog=catalogSchema.parse(rawCatalog),search=new SearchService(catalog);const result=search.search({...emptySearchInput(),serviceLanguage:'kk',languageHard:true,budgetKzt:4000,budgetHard:true});
  const mapped=mapSearchResult(result),eligible=new Set(result.items.flatMap(i=>i.matchingOfferIds));expect(mapped.points.every(p=>eligible.has(p.offerId))).toBe(true);expect(new Set([...mapped.points.map(p=>p.offerId),...mapped.missing])).toEqual(eligible);expect(demoLocations.every(p=>!!p.source&&!!p.checkedAt&&p.access.lift===null)).toBe(true);
 });
});
