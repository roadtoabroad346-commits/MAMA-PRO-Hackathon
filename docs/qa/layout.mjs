import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const page=await context.newPage(); const results=[];
for(const locale of ['ru','kk']) {
 await page.goto('http://127.0.0.1:5173');await page.getByRole('button',{name:locale==='ru'?'Рус':'Қаз',exact:true}).click();
 for(const width of [320,360,390,430,844]) {
  await page.setViewportSize({width,height:width===844?390:844});
  for(const path of ['/','/route','/route/review','/specialists','/specialists/S01?offer=O01','/compare','/request/O01','/about-demo','/privacy','/unknown']) {
   await page.goto('http://127.0.0.1:5173'+path);await page.locator('.site-header').waitFor();
   results.push({locale,width,path,...await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}))});
  }
 }
 for(const path of ['/','/route/review','/specialists/S01?offer=O01','/request/O01']) {
  await page.setViewportSize({width:320,height:740});await page.goto('http://127.0.0.1:5173'+path);await page.locator('.site-header').waitFor();
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  results.push({locale,width:320,path,textScale:'200%',...await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}))});
  await page.screenshot({path:`work/qa/text200-${locale}-${path==='/'?'home':path.split('?')[0].replaceAll('/','_')}.png`});
 }
}
await fs.writeFile('work/qa/layout.json',JSON.stringify(results,null,2));console.log(JSON.stringify({checks:results.length,failures:results.filter(r=>r.scrollWidth>r.clientWidth)}));
await browser.close();
