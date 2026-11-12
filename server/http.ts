import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { Fault, requireThat } from './store.ts';
import { PilotService } from './service.ts';
export function testOnly(mode=process.env.PILOT_MODE,environment=process.env.NODE_ENV){
 requireThat(mode==='PILOT_TEST'&&environment!=='production','LIVE_BLOCKED',503);
}
export function createPilotServer(service:PilotService,mode=process.env.PILOT_MODE,environment=process.env.NODE_ENV){
 testOnly(mode,environment);
 // Login throttling per client address: 30 per minute (audit finding F-05).
 const loginHits=new Map<string,number[]>();
 return createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store, private');res.setHeader('Vary','Cookie');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  const json=(status:number,data:unknown)=>{res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(data));};
  try{
   const path=new URL(req.url??'/', 'http://localhost').pathname;
   requireThat(path.startsWith('/api/pilot/'),'NOT_FOUND',404);
   if(req.method==='GET'&&path==='/api/pilot/public'){json(200,{mode:'PILOT_TEST',offers:service.publicOffers()});return;}
   if(req.method==='POST'){
    const origin=req.headers.origin;requireThat(!origin||new URL(origin).host===req.headers.host,'ORIGIN_DENIED',403);
    requireThat(req.headers['sec-fetch-site']!=='cross-site','ORIGIN_DENIED',403);
    requireThat(req.headers['content-type']?.startsWith('application/json'),'INVALID_INPUT',400);
   }
   let body:unknown={};
   if(req.method==='POST'){
    let length=0;const chunks:Buffer[]=[];
    for await(const chunk of req){length+=chunk.length;requireThat(length<=16384,'PAYLOAD_TOO_LARGE',413);chunks.push(chunk);}
    try{body=JSON.parse(Buffer.concat(chunks).toString());}catch{throw new Fault('INVALID_INPUT');}
   }
   if(path==='/api/pilot/test-login'&&req.method==='POST'){
    const ip=req.socket.remoteAddress??'unknown';const stamp=Date.now();
    const hits=(loginHits.get(ip)??[]).filter(t=>stamp-t<60000);hits.push(stamp);loginHits.set(ip,hits);
    requireThat(hits.length<=30,'RATE_LIMITED',429);
    const data=body as Record<string,unknown>;requireThat(data&&typeof data.actor==='string'&&Object.keys(data).length===1,'INVALID_INPUT',400);
    const actor=service.actor(data.actor);const token=randomBytes(32).toString('hex'),csrf=randomBytes(24).toString('hex');
    const previous=req.headers.cookie?.match(/(?:^|;\s*)qz_pilot=([a-f0-9]{64})(?:;|$)/)?.[1];if(previous)service.store.db.prepare('DELETE FROM sessions WHERE token=?').run(previous);
    service.store.db.prepare('INSERT INTO sessions VALUES(?,?,?,?)').run(token,actor.id,csrf,new Date(service.clock().getTime()+3600000).toISOString());
    // Secure is valid on the loopback PILOT_TEST origin (browsers treat
    // 127.0.0.1/localhost as trustworthy); any external exposure stays blocked
    // by the LIVE gate and would additionally require TLS (audit F-09).
    res.setHeader('Set-Cookie',`qz_pilot=${token}; HttpOnly; SameSite=Strict; Secure; Path=/api/pilot; Max-Age=3600`);json(200,{actor,csrf,mode:'PILOT_TEST'});return;
   }
   const token=req.headers.cookie?.match(/(?:^|;\s*)qz_pilot=([a-f0-9]{64})(?:;|$)/)?.[1];
   const session=service.store.db.prepare('SELECT actor,csrf FROM sessions WHERE token=? AND expires>?').get(token??'',service.now()) as {actor:string;csrf:string}|undefined;
   requireThat(session,'AUTH_REQUIRED',401);const actor=service.actor(session.actor);
   if(req.method==='GET'&&path==='/api/pilot/state'){json(200,{...service.state(actor),csrf:session.csrf});return;}
   requireThat(req.headers['x-pilot-csrf']===session.csrf,'CSRF_DENIED',403);
   if(req.method==='POST'&&path==='/api/pilot/logout'){
    service.store.db.prepare('DELETE FROM sessions WHERE token=?').run(token!);res.setHeader('Set-Cookie','qz_pilot=; HttpOnly; SameSite=Strict; Path=/api/pilot; Max-Age=0');json(200,{ok:true});return;
   }
   if(req.method==='POST'&&path==='/api/pilot/commands'){json(200,service.run(actor,body));return;}
   throw new Fault('NOT_FOUND',404);
  }catch(e){const fault=e instanceof Fault?e:new Fault('SERVER_ERROR',500);json(fault.status,{error:fault.message});}
 });
}
