import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const results=[];
for(const locale of ['ru','kk']) {
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();const sends=[];const errors=[];
 page.on('request',r=>{if(!['GET','HEAD'].includes(r.method())||new URL(r.url()).origin!=='http://127.0.0.1:5174')sends.push(r.method()+' '+r.url());});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5174/route');await page.locator('.site-header').waitFor();await page.getByRole('button',{name:locale==='ru'?'Рус':'Қаз',exact:true}).click();
 for(let i=0;i<4;i++)await page.getByRole('button',{name:locale==='ru'?'Пропустить шаг':'Қадамды өткізіп жіберу',exact:true}).click();
 await page.getByRole('link',{name:locale==='ru'?'Показать варианты':'Нұсқаларды көрсету',exact:true}).click();
 for(const i of [0,1])await page.getByTestId('specialist-card').nth(i).getByRole('button',{name:locale==='ru'?'Сравнить':'Салыстыру',exact:true}).click();
 await page.locator('#comparison-open').click();
 await page.getByTestId('comparison-card').first().getByRole('link',{name:locale==='ru'?'Выбрать эту услугу':'Осы қызметті таңдау',exact:true}).click();
 await page.getByRole('checkbox').check();await page.getByRole('button',{name:locale==='ru'?'Сохранить демозапрос':'Демосұрауды сақтау',exact:true}).click();
 await page.getByTestId('request-metadata').waitFor();const id=await page.getByTestId('request-id').innerText();await page.reload();await page.getByTestId('request-metadata').waitFor();
 const readId=await page.getByTestId('request-id').innerText();
 await page.getByRole('button',{name:locale==='ru'?'Отменить демозапрос':'Демосұраудан бас тарту',exact:true}).click();
 await page.getByRole('dialog').getByRole('button',{name:locale==='ru'?'Отменить демозапрос':'Демосұраудан бас тарту',exact:true}).click();
 await page.reload();await page.locator('[data-status="cancelled_demo"]').waitFor();
 const rows=await page.evaluate(()=>new Promise((resolve,reject)=>{const open=indexedDB.open('qoldau-demo-v1',1);open.onerror=()=>reject(open.error);open.onsuccess=()=>{const db=open.result;const tx=db.transaction('requests');const read=tx.objectStore('requests').getAll();tx.oncomplete=()=>{db.close();resolve(read.result)};};}));
 results.push({locale,viewport:'390x844',reloadSameId:id===readId,persisted:rows.length,pair:[rows[0]?.specialistId,rows[0]?.offerId],status:rows[0]?.status,sends,errors});
 await page.screenshot({path:`work/qa/production-${locale}-cancelled.png`});await context.close();
}
await fs.writeFile('work/qa/production.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));await browser.close();
if(results.some(r=>!r.reloadSameId||r.persisted!==1||r.status!=='cancelled_demo'||r.sends.length||r.errors.length))process.exit(1);
