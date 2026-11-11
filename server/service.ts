import { randomUUID, createHash } from 'node:crypto';
import { command, type Command, type ApplicationData, type ContactData, type CalendarData, type GoalData, type DiaryData, type AssignmentData } from './contracts.ts';
import { Store, requireThat, type Actor, type Resource } from './store.ts';
const actors: Actor[]=[{id:'PARENT_A',role:'parent'},{id:'PARENT_B',role:'parent'},{id:'SPECIALIST_A',role:'specialist'},{id:'SPECIALIST_B',role:'specialist'},{id:'MODERATOR',role:'moderator'},{id:'ADMIN',role:'admin'}];
const canonical=(value:unknown):string=>{
 if(Array.isArray(value))return `[${value.map(canonical).join(',')}]`;
 if(value && typeof value==='object')return `{${Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
 return JSON.stringify(value);
};
export class PilotService {
 store:Store; clock:()=>Date;
 constructor(path:string,clock=()=>new Date()) {
  this.store=new Store(path);this.clock=clock;
  const insert=this.store.db.prepare('INSERT OR IGNORE INTO accounts(id,role) VALUES(?,?)');actors.forEach(a=>insert.run(a.id,a.role));
  this.store.db.prepare('INSERT OR IGNORE INTO scopes VALUES(?,?,1)').run('SPECIALIST_A','PARENT_A');
  this.store.db.prepare('INSERT OR IGNORE INTO scopes VALUES(?,?,1)').run('SPECIALIST_B','PARENT_B');
 }
 now(){return this.clock().toISOString();}
 actor(id:string):Actor {
  const actor=this.store.db.prepare('SELECT id,role FROM accounts WHERE id=? AND active=1').get(id) as unknown as Actor|undefined;
  requireThat(actor,'AUTH_REQUIRED',401);return actor;
 }
 role(a:Actor,role:Actor['role']) { requireThat(a.role===role,'NOT_FOUND'); }
 linked(specialist:string,parent:string){return !!this.store.db.prepare('SELECT 1 FROM scopes WHERE specialist=? AND parent=? AND active=1').get(specialist,parent);}
 own<T>(a:Actor,id:string,kind:string):Resource<T>{const r=this.store.get<T>(id);requireThat(r.kind===kind&&r.owner===a.id&&r.status!=='deleted');return r;}
 application(a:Actor,id:string){const r=this.store.get<ApplicationData>(id);requireThat(r.kind==='application'&&(r.owner===a.id||a.role==='moderator'));return r;}
 contact(a:Actor,id:string){const r=this.store.get<ContactData>(id);requireThat(r.kind==='contact'&&r.status!=='deleted'&&(r.owner===a.id||r.recipient===a.id));return r;}
 assignment(a:Actor,id:string){const r=this.store.get<AssignmentData>(id);requireThat(r.kind==='assignment'&&(r.owner===a.id||(r.author===a.id&&this.linked(a.id,r.owner))));return r;}
 publicOffers(){return this.store.list<ApplicationData>('application').filter(r=>r.status==='published'&&r.data.publicationConsent).map(r=>({
  id:r.id,specialistId:r.owner,name:r.data.name,title:r.data.title,category:r.data.category,languages:r.data.languages,format:r.data.format,
  ageMin:r.data.ageMin,ageMax:r.data.ageMax,priceKind:r.data.priceKind,price:r.data.price,unit:r.data.unit,duration:r.data.duration,address:r.data.address,
  accepting:r.data.accepting,source:r.data.source,checkedAt:r.data.checkedAt,version:r.version,
  facts:(r.data.facts??[]).map(f=>({...f,status:Date.parse(f.reviewDueAt)<=this.clock().getTime()?'stale':f.status})),isSynthetic:true,
 }));}
 state(a:Actor) {
  const list=<T>(kind:string)=>this.store.list<T>(kind);
  return {actor:a,mode:'PILOT_TEST' as const,live:'LIVE_BLOCKED' as const,offers:this.publicOffers(),
   applications:a.role==='specialist'?list<ApplicationData>('application').filter(r=>r.owner===a.id):a.role==='moderator'?list<ApplicationData>('application').filter(r=>['submitted','needs_changes','published','suspended'].includes(r.status)):[],
   complaints:a.role==='moderator'?list<Record<string,unknown>>('complaint'):[],
   contacts:['parent','specialist'].includes(a.role)?list<ContactData>('contact').filter(r=>r.status!=='deleted'&&(r.owner===a.id||r.recipient===a.id)):[],
   calendar:a.role==='parent'?list<CalendarData>('calendar').filter(r=>r.owner===a.id):[],
   goals:a.role==='parent'?list<GoalData>('goal').filter(r=>r.owner===a.id&&r.status!=='deleted'):[],
   diary:a.role==='parent'?list<DiaryData>('diary').filter(r=>r.owner===a.id&&r.status!=='deleted'):[],
   assignments:list<AssignmentData>('assignment').filter(r=>r.owner===a.id||(r.author===a.id&&this.linked(a.id,r.owner))),
   subscriptions:a.role==='parent'?list<{offerId:string}>('subscription').filter(r=>r.owner===a.id):[],
   changes:a.role==='parent'?list<Record<string,unknown>>('change_notice').filter(r=>r.owner===a.id):[],
   next:a.role==='parent'?this.next(a):null,
   inbox:this.store.db.prepare('SELECT id,kind,ref,created FROM inbox WHERE owner=? ORDER BY created DESC').all(a.id),
   jobs:this.store.db.prepare('SELECT id,ref,revision,channel,fire_at,status,attempts FROM jobs WHERE owner=?').all(a.id),
   audit:a.role==='admin'?this.store.db.prepare('SELECT * FROM audit ORDER BY id DESC LIMIT 100').all():[],
  };
 }
 next(a:Actor) {
  const contact=this.store.list<ContactData>('contact').find(r=>r.owner===a.id&&!['cancelled','closed','deleted'].includes(r.status));
  const event=this.store.list<CalendarData>('calendar').find(r=>r.owner===a.id&&r.status!=='cancelled'&&Date.parse(r.data.timing.start)>this.clock().getTime());
  const source=contact??event;if(!source)return null;
  const mark=this.store.list<{source:string;state:string;text:string}>('next').find(r=>r.owner===a.id&&r.data.source===source.id);
  return {source:source.id,reason:contact?`contact.${contact.status}`:'calendar.upcoming',state:mark?.data.state??'active',text:mark?.data.text??''};
 }
 run(a:Actor,raw:unknown):unknown {
  const parsed=command.safeParse(raw);requireThat(parsed.success,'INVALID_INPUT',400);const c=parsed.data;
  // Re-resolve trusted role/active flag on every operation, including stale sessions.
  a=this.actor(a.id);
  return this.store.transaction(()=>{
   if('key' in c){
    const old=this.store.db.prepare('SELECT payload,result FROM operations WHERE actor=? AND op=? AND key=?').get(a.id,c.op,c.key) as {payload:string;result:string}|undefined;
    const payload=createHash('sha256').update(canonical(c)).digest('hex');
    if(old){requireThat(old.payload===payload,'IDEMPOTENCY_CONFLICT',409);return JSON.parse(old.result);}
    const count=this.store.db.prepare('SELECT count(*) AS n FROM audit WHERE actor=? AND at>?').get(a.id,new Date(this.clock().getTime()-60000).toISOString()) as {n:number};
    requireThat(count.n<30,'RATE_LIMITED',429);
    const result=this.execute(a,c);
    // Store result reference only; no second copy of diary text in idempotency records.
    const receipt={id:(result as {id?:string}).id,version:(result as {version?:number}).version};
    this.store.db.prepare('INSERT INTO operations VALUES(?,?,?,?,?)').run(a.id,c.op,c.key,payload,JSON.stringify(receipt));
    return receipt;
   }
   return this.execute(a,c);
  });
 }
 private execute(a:Actor,c:Command):unknown {
  const now=this.now();const save=<T>(r:Resource<T>,v:number)=>{const result=this.store.save(r,v,now);this.store.audit(a,c.op,result,now);return {id:result.id,version:result.version};};
  const create=<T>(kind:string,data:T,status='active',owner=a.id,recipient:string|null=null,ref:string|null=null)=>{
   const r=this.store.create(kind,a,data,now,status,owner,recipient,ref);this.store.audit(a,c.op,r,now);return r;
  };
  const goal=(id:string|null,owner=a.id)=>{if(id){const g=this.store.get<GoalData>(id);requireThat(g.kind==='goal'&&g.owner===owner&&g.status!=='deleted');}};
  switch(c.op){
   case 'application.create':this.role(a,'specialist');requireThat(Date.parse(c.offer.checkedAt)<=this.clock().getTime(),'INVALID_INPUT',400);return create('application',{...c.offer,facts:[]},'draft');
   case 'application.edit':{
    this.role(a,'specialist');requireThat(Date.parse(c.offer.checkedAt)<=this.clock().getTime(),'INVALID_INPUT',400);const r=this.application(a,c.id);requireThat(['draft','needs_changes','published'].includes(r.status),'INVALID_TRANSITION',409);
    const old=r.status==='published'?this.publicOffers().find(o=>o.id===r.id):undefined;
    r.data={...c.offer,facts:[],moderator:r.data.moderator,previousPublic:old??r.data.previousPublic};r.status='draft';const result=save(r,c.version);
    // Changes withdraw public version until moderator reviews; notify withdrawal once.
    if(old)this.notifyChanges(r.id,old,null,r.version+1,a);return result;
   }
   case 'application.submit':{
    this.role(a,'specialist');const r=this.application(a,c.id);requireThat(['draft','needs_changes'].includes(r.status),'INVALID_TRANSITION',409);r.status='submitted';return save(r,c.version);
   }
   case 'application.withdraw':{
    this.role(a,'specialist');const r=this.application(a,c.id);requireThat(r.status!=='withdrawn','INVALID_TRANSITION',409);
    const old=this.publicOffers().find(o=>o.id===r.id);r.status='withdrawn';const out=save(r,c.version);if(old)this.notifyChanges(r.id,old,null,r.version+1,a);return out;
   }
   case 'moderation.assign':{
    this.role(a,'moderator');const r=this.application(a,c.id);requireThat(r.status==='submitted');r.data.moderator=c.moderator;return save(r,c.version);
   }
   case 'moderation.decide':{
    this.role(a,'moderator');const r=this.application(a,c.id);requireThat(r.data.moderator===a.id&&r.owner!==a.id);
    requireThat(['submitted','published','suspended'].includes(r.status),'INVALID_TRANSITION',409);
    requireThat(Date.parse(c.reviewDueAt)>this.clock().getTime(),'INVALID_INPUT',400);
    const old=this.publicOffers().find(o=>o.id===r.id);
    r.status=c.decision;r.data.decision=c.evidence;
    r.data.facts=[...(r.data.facts??[]).filter(f=>f.scope!==c.scope),{scope:c.scope,status:c.decision==='published'?'document_seen':'revoked',source:c.source,checkedAt:now,reviewDueAt:c.reviewDueAt,limitation:c.limitation}];
    const result=save(r,c.version);this.notifyChanges(r.id,old??r.data.previousPublic??null,this.publicOffers().find(o=>o.id===r.id)??null,r.version+1,a);return result;
   }
   case 'complaint.create':{
    this.role(a,'parent');requireThat(this.publicOffers().some(o=>o.id===c.applicationId));return create('complaint',{applicationId:c.applicationId,reason:c.reason},'submitted');
   }
   case 'contact.create':{
    this.role(a,'parent');const offer=this.publicOffers().find(o=>o.id===c.offerId);requireThat(offer);requireThat(offer.accepting===true,'NOT_ACCEPTING',409);
    const r=create<ContactData>('contact',{offerId:offer.id,snapshot:{name:offer.name,title:offer.title,price:offer.price,priceKind:offer.priceKind,version:offer.version},purpose:c.purpose,consentVersion:c.consentVersion,history:[{status:'server_received',actor:a.id,source:'server_commit',at:now}]},'server_received',a.id,offer.specialistId,offer.id);
    this.store.db.prepare('INSERT INTO jobs VALUES(?,?,?,?,?,?,?,0)').run(randomUUID(),a.id,r.id,r.version,'sandbox_contact',now,'scheduled');return r;
   }
   case 'contact.transition':{
    const r=this.contact(a,c.id);const allowed:Record<string,string[]>={responded:['sandbox_available'],parent_reported:['responded'],cancelled:['server_received','sandbox_available','responded','parent_reported','appointment_confirmed'],closed:['responded','parent_reported','appointment_confirmed']};
    requireThat(allowed[c.status].includes(r.status),'INVALID_TRANSITION',409);
    requireThat(c.status==='responded'?r.recipient===a.id:r.owner===a.id);r.status=c.status;r.data.history.push({status:c.status,actor:a.id,source:a.role==='parent'?'parent_report':'specialist_action',at:now});
    const result=save(r,c.version);
    if(c.status==='cancelled')this.cancelRelated(r.id,now);return result;
   }
   case 'contact.confirm':{
    this.role(a,'specialist');const r=this.contact(a,c.id);requireThat(r.recipient===a.id&&['responded','parent_reported'].includes(r.status),'INVALID_TRANSITION',409);
    r.status='appointment_confirmed';r.data.history.push({status:r.status,actor:a.id,source:'specialist_confirmation',at:now});const result=save(r,c.version);
    requireThat(!this.store.list('calendar').some(e=>e.ref===r.id),'SOURCE_CONFLICT',409);
    create<CalendarData>('calendar',{title:r.data.snapshot.title.ru,timing:c.timing,place:'',source:'confirmed_request'},'confirmed',r.owner,a.id,r.id);return result;
   }
   case 'contact.revoke':{
    const r=this.own<ContactData>(a,c.id,'contact');requireThat(r.status!=='cancelled'&&r.status!=='closed','INVALID_TRANSITION',409);
    r.data.revoked=true;r.status='cancelled';r.data.history.push({status:'cancelled',actor:a.id,source:'consent_revoked',at:now});const out=save(r,c.version);this.cancelRelated(r.id,now);return out;
   }
   case 'contact.delete':{
    const r=this.own<ContactData>(a,c.id,'contact');requireThat(['cancelled','closed'].includes(r.status),'INVALID_TRANSITION',409);
    r.status='deleted';r.data={} as ContactData;return save(r,c.version);
   }
   case 'calendar.create':this.role(a,'parent');return create<CalendarData>('calendar',{title:c.title,timing:c.timing,place:c.place,source:'manual'},'planned');
   case 'calendar.edit':{
    this.role(a,'parent');const r=this.own<CalendarData>(a,c.id,'calendar');requireThat(r.status!=='cancelled','INVALID_TRANSITION',409);
    // Editing a confirmed event is a personal revision, never continued independent confirmation.
    r.data={...r.data,title:c.title,timing:c.timing,place:c.place,source:'manual'};r.status='planned';const out=save(r,c.version);this.schedule(this.store.get<CalendarData>(r.id));return out;
   }
   case 'calendar.cancel':{
    const r=this.own<CalendarData>(a,c.id,'calendar');requireThat(r.status!=='cancelled','INVALID_TRANSITION',409);r.status='cancelled';const out=save(r,c.version);this.schedule(this.store.get<CalendarData>(r.id));return out;
   }
   case 'reminder.set':{
    const r=this.own<CalendarData>(a,c.id,'calendar');requireThat(r.status!=='cancelled','INVALID_TRANSITION',409);r.data.reminder={enabled:c.enabled,minutes:c.minutes};const out=save(r,c.version);this.schedule(this.store.get<CalendarData>(r.id));return out;
   }
   case 'subscription.set':{
    this.role(a,'parent');const old=this.store.list<{offerId:string}>('subscription').find(s=>s.owner===a.id&&s.data.offerId===c.offerId);
    if(old){old.status=c.enabled?'active':'disabled';return save(old,old.version);}
    requireThat(this.publicOffers().some(o=>o.id===c.offerId));return create('subscription',{offerId:c.offerId},c.enabled?'active':'disabled',a.id,null,c.offerId);
   }
   case 'next.set':{
    this.role(a,'parent');const source=this.store.get(c.source);requireThat(source.owner===a.id&&['contact','calendar'].includes(source.kind));
    const old=this.store.list<{source:string;state:string;text:string}>('next').find(r=>r.owner===a.id&&r.data.source===c.source);
    if(old){old.data={source:c.source,state:c.state,text:c.text};return save(old,old.version);}return create('next',{source:c.source,state:c.state,text:c.text});
   }
   case 'goal.create':this.role(a,'parent');return create<GoalData>('goal',{text:c.text,discussedOn:c.discussedOn});
   case 'goal.edit':{const r=this.own<GoalData>(a,c.id,'goal');r.data={text:c.text,discussedOn:c.discussedOn};return save(r,c.version);}
   case 'goal.delete':{const r=this.own<GoalData>(a,c.id,'goal');r.status='deleted';r.data={} as GoalData;return save(r,c.version);}
   case 'diary.create':this.role(a,'parent');goal(c.goalId);return create<DiaryData>('diary',{date:c.date,goalId:c.goalId,observation:c.observation,context:c.context});
   case 'diary.edit':{const r=this.own<DiaryData>(a,c.id,'diary');goal(c.goalId);r.data={date:c.date,goalId:c.goalId,observation:c.observation,context:c.context};return save(r,c.version);}
   case 'diary.delete':{const r=this.own<DiaryData>(a,c.id,'diary');r.status='deleted';r.data={} as DiaryData;return save(r,c.version);}
   case 'assignment.create':{
    this.role(a,'specialist');requireThat(this.linked(a.id,c.parentId));
    // A specialist cannot select a private goal they cannot read; explicit goal sharing is outside scope.
    requireThat(c.goalId===null,'NOT_FOUND');
    return create<AssignmentData>('assignment',{instruction:c.instruction,conditions:c.conditions,goalId:null,due:c.due,reviewOn:c.reviewOn,instructionVersion:1,revisions:[],responses:[]},'issued',c.parentId,a.id);
   }
   case 'assignment.edit':{
    this.role(a,'specialist');const r=this.assignment(a,c.id);requireThat(r.author===a.id&&r.status!=='withdrawn');r.data.revisions.push({version:r.data.instructionVersion,instruction:r.data.instruction,conditions:r.data.conditions,due:r.data.due,reviewOn:r.data.reviewOn});r.data={...r.data,instructionVersion:r.data.instructionVersion+1,instruction:c.instruction,conditions:c.conditions,due:c.due,reviewOn:c.reviewOn};r.status='revised';return save(r,c.version);
   }
   case 'assignment.withdraw':{
    this.role(a,'specialist');const r=this.assignment(a,c.id);requireThat(r.author===a.id&&r.status!=='withdrawn');r.status='withdrawn';return save(r,c.version);
   }
   case 'assignment.respond':{
    this.role(a,'parent');const r=this.assignment(a,c.id);requireThat(r.owner===a.id&&r.status!=='withdrawn'&&this.linked(r.author,r.owner));
    requireThat(r.version===c.version,'VERSION_CONFLICT',409);
    r.data.responses.push({version:r.data.instructionVersion,status:c.status,observation:c.observation,author:a.id,at:now});return save(r,c.version);
   }
   case 'summary.preview':{
    this.role(a,'parent');requireThat(new Set(c.selected).size===c.selected.length,'INVALID_INPUT',400);
    const items=c.selected.map(id=>{const r=this.store.get<GoalData|DiaryData|CalendarData|AssignmentData>(id);requireThat(r.owner===a.id&&r.status!=='deleted'&&['goal','diary','calendar','assignment'].includes(r.kind));
     const text=r.kind==='goal'?(r.data as GoalData).text:r.kind==='diary'?`${(r.data as DiaryData).date}: ${(r.data as DiaryData).observation}${(r.data as DiaryData).context?'\n'+(r.data as DiaryData).context:''}`:r.kind==='calendar'?`${(r.data as CalendarData).title}: ${(r.data as CalendarData).timing.start} (${(r.data as CalendarData).timing.timezone})`:(r.data as AssignmentData).instruction;
     return {id:r.id,kind:r.kind,text,author:r.author,version:r.version};});
    return {recipient:c.recipient,items,questions:c.questions};
   }
   case 'scope.revoke':this.role(a,'admin');this.store.db.prepare('UPDATE scopes SET active=0 WHERE specialist=? AND parent=?').run(c.specialistId,c.parentId);this.store.audit(a,c.op,undefined,now);return {ok:true};
  }
 }
 private cancelRelated(requestId:string,now:string){
  this.store.db.prepare("UPDATE jobs SET status='cancelled' WHERE ref=? AND status='scheduled'").run(requestId);
  for(const e of this.store.list<CalendarData>('calendar').filter(e=>e.ref===requestId&&e.status!=='cancelled')){e.status='cancelled';this.store.save(e,e.version,now);this.schedule(this.store.get<CalendarData>(e.id));}
 }
 private schedule(e:Resource<CalendarData>){
  this.store.db.prepare("UPDATE jobs SET status='cancelled' WHERE ref=? AND status='scheduled'").run(e.id);
  if(e.status==='cancelled'||!e.data.reminder?.enabled)return;
  const fireAt=new Date(Date.parse(e.data.timing.start)-e.data.reminder.minutes*60000).toISOString();
  this.store.db.prepare('INSERT OR IGNORE INTO jobs VALUES(?,?,?,?,?,?,?,0)').run(randomUUID(),e.owner,e.id,e.version,'in_app',fireAt,'scheduled');
 }
 private notifyChanges(offerId:string,old:unknown,next:unknown,version:number,a:Actor){
  // Public allowlist: technical timestamps/evidence/internal fields never enter diff or notice.
  const allowed=['price','priceKind','unit','address','format','languages','accepting','facts'];
  const normalized=(v:unknown)=>{const r={...(v??{}) as Record<string,unknown>};if(Array.isArray(r.facts))r.facts=r.facts.map((f:Record<string,unknown>)=>({scope:f.scope,status:f.status,source:f.source,limitation:f.limitation}));return r;};
  const before=normalized(old),after=normalized(next);
  const diff=allowed.filter(k=>canonical(before[k]??null)!==canonical(after[k]??null)).map(field=>({field,old:before[field]??null,new:after[field]??null}));
  if(!!old!==!!next)diff.push({field:'publication',old:!!old,new:!!next});
  if(!diff.length)return;
  for(const sub of this.store.list<{offerId:string}>('subscription').filter(s=>s.status==='active'&&s.data.offerId===offerId)){
   const source=`change:${sub.id}:${offerId}:${version}`;
   if(this.store.db.prepare('SELECT 1 FROM inbox WHERE source=?').get(source))continue;
   const notice=this.store.create('change_notice',a,{offerId,version,diff},this.now(),'available',sub.owner,null,offerId);
   this.store.db.prepare('INSERT INTO inbox VALUES(?,?,?,?,?,?)').run(randomUUID(),sub.owner,source,'offer_change',notice.id,this.now());
  }
 }
 pump(){
  // Single synchronous SQLite transaction rechecks revision, cancellation and opt-in at delivery.
  // In-app inbox insertion is the supported result, never an external delivery receipt.
  return this.store.transaction(()=>{
   const jobs=this.store.db.prepare("SELECT * FROM jobs WHERE status='scheduled' AND fire_at<=? ORDER BY fire_at LIMIT 100").all(this.now()) as unknown as {id:string;owner:string;ref:string;revision:number;channel:string;fire_at:string}[];
   for(const j of jobs){
    const r=this.store.get<CalendarData|ContactData>(j.ref);let status='cancelled';
    if(j.channel==='sandbox_contact'&&r.kind==='contact'&&r.status==='server_received'&&r.version===j.revision){
     const contact=r as Resource<ContactData>;contact.status='sandbox_available';contact.data.history.push({status:contact.status,actor:'system',source:'sandbox_inbox',at:this.now()});
     this.store.save(contact,r.version,this.now());
     this.store.db.prepare('INSERT OR IGNORE INTO inbox VALUES(?,?,?,?,?,?)').run(randomUUID(),r.recipient,`job:${j.id}`,'sandbox_contact',r.id,this.now());status='sandbox_available';
    }else if(j.channel==='in_app'&&r.kind==='calendar'&&r.version===j.revision&&r.status!=='cancelled'&&(r.data as CalendarData).reminder?.enabled){
     if(this.clock().getTime()-Date.parse(j.fire_at)>86400000)status='expired';
     else{this.store.db.prepare('INSERT OR IGNORE INTO inbox VALUES(?,?,?,?,?,?)').run(randomUUID(),j.owner,`job:${j.id}`,'reminder',r.id,this.now());status='in_app_available';}
    }
    this.store.db.prepare('UPDATE jobs SET status=?,attempts=attempts+1 WHERE id=?').run(status,j.id);
   }return {processed:jobs.length};
  });
 }
}
