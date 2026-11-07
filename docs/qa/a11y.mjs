import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ executablePath:'/usr/bin/chromium',args:['--no-sandbox'] });
const reports=[];
for(const locale of ['ru','kk']) {
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await context.newPage();
 await page.goto('http://127.0.0.1:5173');
 await page.getByRole('button',{name:locale==='ru'?'Рус':'Қаз',exact:true}).click();
 async function inspect(screen) {
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  reports.push({locale,screen,violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:result.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))});
  console.log(locale,screen,'violations',result.violations.map(v=>v.id));
  await fs.writeFile(`work/qa/ax-${locale}-${screen}.yml`,await page.locator('body').ariaSnapshot());
 }
 for(const path of ['/','/route','/route/review','/specialists/S01?offer=O01','/about-demo','/privacy','/unknown']) {
  await page.goto('http://127.0.0.1:5173'+path); await page.locator('.site-header').waitFor();
  await inspect(path==='/'?'home':path.split('?')[0].replaceAll('/','_'));
 }
 await page.goto('http://127.0.0.1:5173/specialists');await page.getByTestId('specialist-card').first().waitFor();
 await inspect('catalog');
 await page.locator('#filters-open').click(); await inspect('filters');
 await page.screenshot({path:`work/qa/${locale}-filters.png`,fullPage:false});
 await page.keyboard.press('Escape');
 for(const i of [0,1]) await page.getByTestId('specialist-card').nth(i).getByRole('button',{name:locale==='ru'?'Сравнить':'Салыстыру',exact:true}).click();
 await page.locator('#comparison-open').click();await inspect('compare');
 await page.screenshot({path:`work/qa/${locale}-compare.png`,fullPage:true});
 await page.getByTestId('comparison-card').first().getByRole('link',{name:locale==='ru'?'Выбрать эту услугу':'Осы қызметті таңдау',exact:true}).click();
 await inspect('request');
 await page.getByRole('checkbox').check();
 await page.getByRole('button',{name:locale==='ru'?'Сохранить демозапрос':'Демосұрауды сақтау',exact:true}).click();
 await page.getByTestId('request-metadata').waitFor();await inspect('status');
 await page.screenshot({path:`work/qa/${locale}-status.png`,fullPage:true});
 await page.getByRole('button',{name:locale==='ru'?'Отменить демозапрос':'Демосұраудан бас тарту',exact:true}).click();await inspect('cancel-dialog');
 await page.keyboard.press('Escape');
 await context.close();
}
await fs.writeFile('work/qa/a11y.json',JSON.stringify(reports,null,2));
await browser.close();
