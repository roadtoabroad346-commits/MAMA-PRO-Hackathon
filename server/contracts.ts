import { z } from 'zod';
const text=z.string().trim().min(1).max(1000);
const id=z.string().min(1).max(100);
const key=z.string().min(8).max(100);
const version=z.number().int().positive();
const date=z.iso.date();
const moment=z.iso.datetime({offset:true});
const timezone=z.string().max(80).refine(v=>{try{new Intl.DateTimeFormat('en',{timeZone:v});return true;}catch{return false;}},'TIMEZONE');
export const offer=z.object({
 name:z.object({ru:text,kk:text}).strict(), title:z.object({ru:text,kk:text}).strict(),
 category:z.enum(['LOGOPED','DEFECTOLOG','PSYCHOLOG']), languages:z.array(z.enum(['ru','kk'])).min(1).max(2),
 format:z.enum(['online','offline']), ageMin:z.number().int().min(0).max(215),ageMax:z.number().int().min(0).max(215),
 priceKind:z.enum(['exact','from','free','unknown']),price:z.number().int().min(0).max(1000000).nullable(),
 unit:z.enum(['individual_session','group_session','consultation']),duration:z.number().int().min(1).max(480),
 address:z.string().max(300), source:text,checkedAt:moment,accepting:z.boolean().nullable(),
 contact:z.literal('sandbox:inbox'), publicationConsent:z.literal(true), consentVersion:z.literal('test-publication-v1'),
}).strict().superRefine((o,c)=>{
 if(o.ageMin>o.ageMax || (o.priceKind==='unknown' && o.price!==null) || (o.priceKind==='free' && o.price!==0) || (['exact','from'].includes(o.priceKind) && (o.price===null||o.price<=0)))c.addIssue({code:'custom',message:'OFFER_CONDITIONS'});
});
export type ApplicationData=z.infer<typeof offer> & {moderator?:string;facts?:{scope:string;status:string;source:string;checkedAt:string;reviewDueAt:string;limitation:string}[];decision?:string;previousPublic?:Record<string,unknown>};
export const timing=z.object({start:moment,end:moment,timezone}).strict().refine(t=>Date.parse(t.end)>Date.parse(t.start)&&Date.parse(t.end)-Date.parse(t.start)<=86400000,'TIME_RANGE');
const identity={id,version};
export const command=z.discriminatedUnion('op',[
 z.object({op:z.literal('application.create'),key,offer}).strict(),
 z.object({op:z.literal('application.edit'),...identity,offer}).strict(),
 z.object({op:z.literal('application.submit'),...identity}).strict(),
 z.object({op:z.literal('application.withdraw'),...identity}).strict(),
 z.object({op:z.literal('moderation.assign'),...identity,moderator:z.enum(['MODERATOR'])}).strict(),
 z.object({op:z.literal('moderation.decide'),...identity,decision:z.enum(['needs_changes','rejected','published','suspended']),scope:z.enum(['identity','education','contact','offer_data']),evidence:text,source:text,limitation:text,reviewDueAt:moment}).strict(),
 z.object({op:z.literal('complaint.create'),key,applicationId:id,reason:text}).strict(),
 z.object({op:z.literal('contact.create'),key,offerId:id,purpose:z.enum(['conditions','availability']),consent:z.literal(true),consentVersion:z.literal('test-contact-v1')}).strict(),
 z.object({op:z.literal('contact.transition'),...identity,status:z.enum(['responded','parent_reported','cancelled','closed'])}).strict(),
 z.object({op:z.literal('contact.confirm'),...identity,timing}).strict(),
 z.object({op:z.literal('contact.delete'),...identity}).strict(),
 z.object({op:z.literal('contact.revoke'),...identity}).strict(),
 z.object({op:z.literal('calendar.create'),key,title:text,timing,place:z.string().max(300)}).strict(),
 z.object({op:z.literal('calendar.edit'),...identity,title:text,timing,place:z.string().max(300)}).strict(),
 z.object({op:z.literal('calendar.cancel'),...identity}).strict(),
 z.object({op:z.literal('reminder.set'),...identity,enabled:z.boolean(),minutes:z.number().int().min(0).max(10080)}).strict(),
 z.object({op:z.literal('subscription.set'),offerId:id,enabled:z.boolean()}).strict(),
 z.object({op:z.literal('next.set'),source:id,state:z.enum(['completed','deferred','hidden','active']),text:z.string().max(300)}).strict(),
 z.object({op:z.literal('goal.create'),key,text,discussedOn:date.nullable()}).strict(),
 z.object({op:z.literal('goal.edit'),...identity,text,discussedOn:date.nullable()}).strict(),
 z.object({op:z.literal('goal.delete'),...identity}).strict(),
 z.object({op:z.literal('diary.create'),key,date,goalId:id.nullable(),observation:text,context:z.string().max(300)}).strict(),
 z.object({op:z.literal('diary.edit'),...identity,date,goalId:id.nullable(),observation:text,context:z.string().max(300)}).strict(),
 z.object({op:z.literal('diary.delete'),...identity}).strict(),
 z.object({op:z.literal('assignment.create'),key,parentId:z.enum(['PARENT_A','PARENT_B']),instruction:text,conditions:text,goalId:id.nullable(),due:date.nullable(),reviewOn:date.nullable()}).strict(),
 z.object({op:z.literal('assignment.edit'),...identity,instruction:text,conditions:text,due:date.nullable(),reviewOn:date.nullable()}).strict(),
 z.object({op:z.literal('assignment.withdraw'),...identity}).strict(),
 z.object({op:z.literal('assignment.respond'),...identity,status:z.enum(['not_started','attempted','done','unable','question']),observation:z.string().max(1000)}).strict(),
 z.object({op:z.literal('summary.preview'),selected:z.array(id).max(40),questions:z.string().max(2000),recipient:z.string().trim().min(1).max(200)}).strict(),
 z.object({op:z.literal('scope.revoke'),specialistId:z.enum(['SPECIALIST_A','SPECIALIST_B']),parentId:z.enum(['PARENT_A','PARENT_B'])}).strict(),
]);
export type Command=z.infer<typeof command>;
export interface ContactData {offerId:string; snapshot:{name:{ru:string;kk:string};title:{ru:string;kk:string};price:number|null;priceKind:string;version:number};purpose:string;consentVersion:string;revoked?:boolean;history:{status:string;actor:string;source:string;at:string}[]}
export interface CalendarData {title:string;timing:z.infer<typeof timing>;place:string;source:'manual'|'confirmed_request';reminder?:{enabled:boolean;minutes:number}}
export interface GoalData {text:string;discussedOn:string|null}
export interface DiaryData {date:string;goalId:string|null;observation:string;context:string}
export interface AssignmentData {instruction:string;conditions:string;goalId:string|null;due:string|null;reviewOn:string|null;instructionVersion:number;revisions:{version:number;instruction:string;conditions:string;due:string|null;reviewOn:string|null}[];responses:{version:number;status:string;observation:string;author:string;at:string}[]}
