import { mkdirSync } from 'node:fs';
import { PilotService } from './service.ts';
import { createPilotServer, testOnly } from './http.ts';
testOnly();
mkdirSync('.pilot-test',{recursive:true,mode:0o700});
const databaseName=process.env.PILOT_DB_NAME??'pilot';
if(!/^[a-zA-Z0-9_-]{1,100}$/.test(databaseName))throw new Error('INVALID_TEST_DB_NAME');
const service=new PilotService(`.pilot-test/${databaseName}.sqlite`);
const server=createPilotServer(service,process.env.PILOT_MODE,process.env.NODE_ENV);
const timer=setInterval(()=>{try{service.pump();}catch{console.error('PILOT_JOB_ERROR');}},1000);
server.listen(8787,'127.0.0.1',()=>console.log('PILOT_TEST loopback server :8787; synthetic accounts only; LIVE_BLOCKED'));
function stop(){clearInterval(timer);server.close(()=>{service.store.db.close();process.exit(0);});}
process.on('SIGTERM',stop);process.on('SIGINT',stop);
