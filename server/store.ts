import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
export interface Actor { id: string; role: 'parent'|'specialist'|'moderator'|'admin' }
export interface Resource<T = Record<string, unknown>> {
 id: string; kind: string; owner: string; author: string; recipient: string|null; ref: string|null;
 status: string; version: number; data: T; created: string; updated: string;
}
export class Fault extends Error {
 status: number;
 constructor(code: string, status = 400) { super(code); this.status = status; }
}
export function requireThat(value: unknown, code = 'NOT_FOUND', status = 404): asserts value {
 if (!value) throw new Fault(code, status);
}
export class Store {
 db: DatabaseSync;
 constructor(path: string) {
  this.db = new DatabaseSync(path);
  this.db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;');
  this.db.exec(readFileSync(new URL('./migrations/001_pilot.sql', import.meta.url), 'utf8'));
 }
 transaction<T>(fn:()=>T):T { this.db.exec('BEGIN IMMEDIATE'); try { const result=fn(); this.db.exec('COMMIT'); return result; } catch(e) { this.db.exec('ROLLBACK'); throw e; } }
 get<T>(id:string): Resource<T> {
  const row=this.db.prepare('SELECT * FROM resources WHERE id=?').get(id) as unknown as Resource<string>|undefined;
  requireThat(row); return {...row,data:JSON.parse(row.data) as T};
 }
 list<T>(kind:string): Resource<T>[] {
  return (this.db.prepare('SELECT * FROM resources WHERE kind=? ORDER BY created,id').all(kind) as unknown as Resource<string>[]).map(row=>({...row,data:JSON.parse(row.data) as T}));
 }
 create<T>(kind:string, actor:Actor, data:T, now:string, status='active', owner=actor.id, recipient:string|null=null, ref:string|null=null):Resource<T> {
  const row:Resource<T>={id:randomUUID(),kind,owner,author:actor.id,recipient,ref,status,version:1,data,created:now,updated:now};
  this.db.prepare('INSERT INTO resources VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(row.id,kind,owner,actor.id,recipient,ref,status,1,JSON.stringify(data),now,now);
  return row;
 }
 save<T>(row:Resource<T>, version:number, now:string):Resource<T> {
  const result=this.db.prepare('UPDATE resources SET status=?,data=?,version=version+1,updated=? WHERE id=? AND version=?').run(row.status,JSON.stringify(row.data),now,row.id,version);
  requireThat(result.changes===1,'VERSION_CONFLICT',409);
  return this.get<T>(row.id);
 }
 audit(actor:Actor,op:string,row?:Resource<unknown>,now=new Date().toISOString()) {
  this.db.prepare('INSERT INTO audit(actor,op,resource,version,at) VALUES(?,?,?,?,?)').run(actor.id,op,row?.id??null,row?.version??null,now);
 }
}
