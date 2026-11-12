import type { PilotService } from '../../../server/service.ts';
import type { Command } from '../../../server/contracts.ts';
export type PilotState=ReturnType<PilotService['state']>;
export type Preview={recipient:string;items:{id:string;kind:string;text:string;author:string;version:number}[];questions:string};
export async function pilotApi<T>(path:string,body?:unknown,csrf?:string):Promise<T>{
 const response=await fetch(`/api/pilot/${path}`,{method:body===undefined?'GET':'POST',cache:'no-store',credentials:'same-origin',headers:body===undefined?{}:{'Content-Type':'application/json',...(csrf?{'X-Pilot-CSRF':csrf}:{})},body:body===undefined?undefined:JSON.stringify(body)});
 let data;try{data=await response.json();}catch{throw new Error('SERVER_ERROR');}
 if(!response.ok)throw new Error(data.error??'SERVER_ERROR');return data as T;
}
export type Run=(command:Command)=>Promise<unknown>;
