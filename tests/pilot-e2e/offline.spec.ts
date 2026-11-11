import {test,expect} from '@playwright/test';
test('explicit synthetic saved card survives offline reload; private API and pilot excluded from public caches',async({page,context})=>{
 await page.goto('/specialists/S01?offer=O01');await page.getByRole('button',{name:'Сохранить демокарточку офлайн',exact:true}).click();await expect(page.getByRole('status').filter({hasText:'Синтетическая карточка сохранена'})).toBeVisible();
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 await page.goto('/saved');await expect(page.locator('article')).toHaveCount(1);const stored=await page.locator('article').innerText();await page.request.get('/api/pilot/state');
 await context.setOffline(true);await page.reload();await expect(page.locator('article')).toHaveCount(1);await expect.poll(()=>page.locator('article').innerText()).toBe(stored);
 await page.getByRole('button',{name:'Қаз',exact:true}).click();await expect(page.getByRole('heading',{name:'Сақталған демо карточкалар',exact:true})).toBeVisible();await page.goto('/pilot');await expect(page.getByText('Приватный пилот требует соединения с сервером.',{exact:false})).toBeVisible();
 const urls=await page.evaluate(async()=>{const keys=await caches.keys();return (await Promise.all(keys.map(async key=>(await(await caches.open(key)).keys()).map(r=>r.url)))).flat();});expect(urls.some(url=>url.includes('/api/')||url.endsWith('/pilot'))).toBe(false);
});
test('map reuses current result, geolocation denied keeps manual search and list alternative',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'geolocation',{value:{getCurrentPosition:(_success:unknown,error:()=>void)=>error()}});});
 await page.goto('/specialists');await page.getByRole('button',{name:'Показать схему карты',exact:true}).click();await page.getByRole('button',{name:'Проверить доступ к геолокации',exact:true}).click();await expect(page.getByRole('status').filter({hasText:'Геолокация недоступна'})).toBeVisible();await expect(page.getByRole('heading',{name:'Список точек',exact:true})).toBeVisible();
 const before=await page.getByTestId('search-count').innerText();await page.getByRole('button',{name:'Фильтры',exact:true}).click();await page.getByRole('button',{name:'Отмена',exact:true}).click();await expect(page.getByTestId('search-count')).toHaveText(before);
 for(const width of [320,360,390,430]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.screenshot({path:'work/phases55-67/map-mobile.png',fullPage:true});
});
