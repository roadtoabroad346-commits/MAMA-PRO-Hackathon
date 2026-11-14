import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import raw from '../../src/data/catalog.json' with { type: 'json' };
import { catalogSchema, type Catalog } from '../../src/domain/catalog';
import { emptySearchInput, type Locale, type SearchInput } from '../../src/domain/contracts';
import { messages } from '../../src/i18n/messages';

const base = emptySearchInput();
const catalog = catalogSchema.parse(raw);
const selected = (p: Page) => p.getByTestId('selected-offer');
const cards = (p: Page) => p.getByTestId('comparison-card');
const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => { const list: string[] = []; errors.set(page, list); page.on('pageerror', e => list.push(e.message)); });
test.afterEach(async ({ page }) => { expect(errors.get(page)).toEqual([]); });
async function setup(page: Page, locale: Locale, data: Catalog = catalog, input: SearchInput = base) {
  await page.route(/\/(?:src\/data\/catalog\.json|assets\/catalog-[^/]+\.json)(?:\?.*)?$/, route => route.request().resourceType() === 'fetch'
    ? route.fulfill({ json: data }) : route.continue());
  await page.addInitScript(({ locale, input }) => {
    if (!localStorage.getItem('qoldau.locale')) localStorage.setItem('qoldau.locale', locale);
    if (!sessionStorage.getItem('qoldau.demo-search')) sessionStorage.setItem('qoldau.demo-search', JSON.stringify({
      schemaVersion: 1, catalogVersion: 'catalog-v2', expiresAt: Date.now() + 7200000, input, step: 1 }));
  }, { locale, input });
}
async function add(page: Page, locale: Locale, id: string) {
  const card = page.getByTestId('specialist-card').filter({ has: page.locator(`#profile-${id}`) });
  await card.getByRole('button', { name: messages[locale].compare, exact: true }).click();
}
async function openCompare(page: Page, locale: Locale, ids = ['O01', 'O02', 'O03']) {
  await page.goto('/specialists');
  for (const id of ids) await add(page, locale, id);
  await page.locator('#comparison-open').click();
  await expect(cards(page)).toHaveCount(ids.length);
}

for (const locale of ['ru', 'kk'] as const) {
  const t = messages[locale];
  test(`P04-T02/08/25/32/33/44 ${locale}: contradictory sibling switches every fact and action, never pinned evidence`, async ({ page }) => {
    const data = structuredClone(catalog);
    const first = data.offers.find(o => o.id === 'O23')!;
    const second = data.offers.find(o => o.id === 'O24')!;
    Object.assign(first, { durationMinutes: 30, unit: 'group_session', acceptingEnquiries: false });
    Object.assign(second, { durationMinutes: 60, unit: 'consultation', acceptingEnquiries: null, availabilityConfirmedAt: null });
    second.fieldSources.availability.checkedAt = null;
    second.fieldSources.languages = { sourceKind: 'unknown', checkedAt: null };
    const specialist = data.specialists.find(s => s.id === 'S12')!;
    specialist.verificationFacts.push({ ...catalog.specialists[0].verificationFacts[0], scope: 'offer_data', offerId: 'O23', status: 'SOURCE_CONFIRMED',
      evidenceSummary: { ru: 'Только O23: уникальный проверенный факт', kk: 'Тек O23: ерекше тексерілген дерек' } });
    await setup(page, locale, data);
    await page.goto('/specialists/S12?offer=O23');
    await selected(page).getByRole('button', { name: t.compare, exact: true }).click();
    await expect(selected(page)).toContainText(t.group_session);
    await expect(selected(page)).toContainText(t.notAccepting);
    await expect(selected(page)).toContainText(t.addressUnknown);
    await expect(page.locator('[data-trust-scope="offer_data"]')).toContainText('O23:');
    await page.locator('input[value="O23"]').focus();
    await page.keyboard.press('ArrowDown');
    await expect(page).toHaveURL('/specialists/S12?offer=O24');
    await expect(page.locator('input[value="O24"]')).toBeFocused();
    await expect(selected(page)).toHaveAttribute('data-offer-id', 'O24');
    await expect(selected(page).locator('.price')).toHaveText(`9 500 ₸ · ${t.duration.replace('{minutes}', '60')}`);
    await expect(selected(page)).toContainText(t.consultation);
    await expect(selected(page)).not.toContainText(t.group_session);
    await expect(selected(page)).toContainText(t.onlineAddressNA);
    await expect(selected(page)).toContainText(t.onlineDistrictNA);
    await expect(selected(page)).toContainText(t.staleAvailability);
    await expect(page.locator('[data-trust-field="languages"]')).toContainText(t.UNVERIFIED);
    await expect(page.locator('[data-trust-scope="offer_data"]')).not.toContainText('O23:');
    await expect(page.locator('#create-demo-request')).toHaveAttribute('href', '/request/O24');
    await page.getByRole('link', { name: new RegExp(t.openComparison) }).click();
    await expect(cards(page)).toHaveAttribute('data-offer-id', 'O23');
    await cards(page).getByRole('link', { name: t.profile, exact: true }).click();
    await page.locator('input[value="O24"]').check();
    await selected(page).getByRole('button', { name: t.replaceCompare, exact: true }).click();
    await page.getByRole('link', { name: new RegExp(t.openComparison) }).click();
    await expect(cards(page)).toHaveAttribute('data-offer-id', 'O24');
    await cards(page).locator('summary').click();
    await expect(cards(page).locator('[data-trust-scope="offer_data"]')).not.toContainText('O23:');
    await cards(page).getByRole('link', { name: t.profile, exact: true }).click();
    await page.reload();
    await expect(selected(page)).toHaveAttribute('data-offer-id', 'O24');
  });

  test(`P04-T28..31/35/39/40 ${locale}: compare capacity, stable order, middle remove, filters, locale and reload`, async ({ page }) => {
    await setup(page, locale);
    await page.goto('/specialists');
    await add(page, locale, 'O01');
    await page.locator('#comparison-open').click();
    await expect(page).toHaveURL('/specialists');
    await expect(page.locator('.compare-tray')).toContainText(t.compareMore);
    await add(page, locale, 'O02'); await add(page, locale, 'O03'); await add(page, locale, 'O04');
    await expect(page.locator('.compare-tray')).toContainText(t.compareLimit);
    await expect(page.locator('.compare-selected li')).toHaveCount(3);
    await page.locator('#comparison-open').click();
    await expect(cards(page)).toHaveCount(3);
    expect(await cards(page).evaluateAll(xs => xs.map(x => x.getAttribute('data-offer-id')))).toEqual(['O01', 'O02', 'O03']);
    await cards(page).nth(1).getByRole('button', { name: t.removeCompare, exact: true }).focus();
    await page.keyboard.press('Space');
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
    expect(await cards(page).evaluateAll(xs => xs.map(x => x.getAttribute('data-offer-id')))).toEqual(['O01', 'O03']);
    await page.getByRole('link', { name: t.backToResults, exact: true }).click();
    await page.getByLabel(t.nameSearch, { exact: true }).fill('literal no matching offer');
    await page.locator('#comparison-open').click();
    await expect(page.getByText(t.compareChanged, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: locale === 'ru' ? 'Қаз' : 'Рус', exact: true }).click();
    expect(await cards(page).evaluateAll(xs => xs.map(x => x.getAttribute('data-offer-id')))).toEqual(['O01', 'O03']);
    await page.reload();
    await expect(cards(page)).toHaveCount(0); // Actual contract: comparison is tab-memory only.
    await expect(page.getByText(messages[locale === 'ru' ? 'kk' : 'ru'].compareEmpty, { exact: true })).toBeVisible();
    expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('qoldau.demo-search')!).input.query)).toBe('literal no matching offer');
  });

  test(`P04-T11..16/18/24/36 ${locale}: free vs unknown, mixed units, sources and current offer limitations`, async ({ page }) => {
    const data = structuredClone(catalog);
    const free = data.offers.find(o => o.id === 'O01')!;
    Object.assign(free, { priceKind: 'free', priceAmountKzt: 0, unit: 'consultation', durationMinutes: 20 });
    const missing = data.offers.find(o => o.id === 'O02')!;
    Object.assign(missing, { priceKind: 'unknown', priceAmountKzt: null, priceConfirmedAt: null, unit: 'group_session', durationMinutes: null });
    missing.fieldSources.price.checkedAt = null;
    const stale = data.offers.find(o => o.id === 'O03')!;
    stale.priceConfirmedAt = '2020-01-01T00:00:00Z'; stale.fieldSources.price.checkedAt = stale.priceConfirmedAt;
    stale.availabilityConfirmedAt = '2020-01-01T00:00:00Z'; stale.fieldSources.availability.checkedAt = stale.availabilityConfirmedAt;
    await setup(page, locale, data); await openCompare(page, locale);
    await expect(cards(page).nth(0).locator('.price')).toContainText(t.priceFree);
    await expect(cards(page).nth(0)).toContainText(t.consultation);
    await expect(cards(page).nth(1).locator('.price')).toContainText(t.priceUnknown);
    await expect(cards(page).nth(1).locator('.price')).not.toContainText(t.priceFree);
    await expect(cards(page).nth(1)).toContainText(t.group_session);
    await expect(cards(page).nth(1)).toContainText(t.durationUnknown);
    await expect(cards(page).nth(2)).toContainText(t.stalePrice);
    await expect(cards(page).nth(2)).toContainText(t.staleAvailability);
    for (const card of await cards(page).all()) {
      await card.locator('summary').click();
      const field = card.locator('[data-trust-field="price"]');
      for (const label of [t.factStatus, t.factSource, t.factDate, t.factScope, t.factLimit]) await expect(field.locator('dt').filter({ hasText: label })).toBeVisible();
    }
    await expect(cards(page).nth(1).locator('[data-trust-field="price"]')).toContainText(t.UNVERIFIED);
    await expect(cards(page).nth(2).locator('[data-trust-field="price"]')).toContainText(t.STALE);
  });

  test(`P04-T03..07/10/42/48 ${locale}: explicit forged, ambiguous and unpublished routes never fall back`, async ({ page }) => {
    const data = structuredClone(catalog);
    data.offers.find(o => o.id === 'O23')!.publicationStatus = 'withdrawn';
    data.specialists.find(s => s.id === 'S01')!.publicationStatus = 'hidden';
    data.specialists.find(s => s.id === 'S12')!.bio = null;
    await setup(page, locale, data);
    for (const suffix of ['?offer=', '?offer=O01', '?offer=O23', '?offer=unknown', '?offer=%E0%A4%A', '?offer=O12&offer=O24']) {
      await page.goto('/specialists/S12' + suffix);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.offerNotFound);
      await expect(page.locator('[data-offer-id]')).toHaveCount(0);
    }
    for (const url of ['/specialists/S01?offer=O01', '/request/O23', '/request/O01']) {
      await page.goto(url); await expect(page.locator('[data-offer-id]')).toHaveCount(0);
    }
    await page.goto('/specialists/S12');
    await expect(selected(page)).toHaveAttribute('data-offer-id', 'O12');
    await expect(page.getByText(t.defaultOffer, { exact: true })).toBeVisible();
    await expect(page.getByText(t.approachUnknown, { exact: true })).toBeVisible();
    await expect(page.getByText(t.noPhoto, { exact: true })).toBeVisible();
  });

  test(`P04-T20/21/26/43 ${locale}: script-like sources/bio are text, missing source and mismatched availability never confirm`, async ({ page }) => {
    const data = structuredClone(catalog);
    const payload = '<img src=x onerror="window.__exp04Xss=1">';
    data.specialists[0].bio = { ru: payload, kk: payload };
    const fact = data.specialists[0].verificationFacts[0];
    fact.sourceLabel = { ru: payload, kk: payload }; fact.status = 'SELF_DECLARED';
    Object.assign(fact, { inspectorNotes: 'PRIVATE-NOTE', scanUrl: 'https://private.invalid', documentId: 'PRIVATE-DOC' });
    const offer = data.offers[0]; offer.fieldSources.availability.checkedAt = '2020-01-01T00:00:00Z';
    await setup(page, locale, data);
    await page.goto('/specialists/S01?offer=O01');
    await expect(page.locator('[data-trust-scope="education"]')).toContainText(payload);
    await expect(page.locator('[data-trust-scope="education"]')).toContainText(t.SELF_DECLARED);
    await expect(page.locator('[data-trust-field="availability"]')).toContainText(t.UNVERIFIED);
    await expect(page.locator('.profile-page img')).toHaveCount(0);
    expect(await page.evaluate(() => (window as unknown as { __exp04Xss?: number }).__exp04Xss)).toBeUndefined();
    expect(await page.locator('body').innerText()).not.toMatch(/PRIVATE-NOTE|PRIVATE-DOC|private.invalid/u);
    await selected(page).getByRole('button', { name: t.compare, exact: true }).click();
    await page.getByRole('link', { name: new RegExp(t.openComparison) }).click();
    await expect(cards(page).locator('.verification')).toContainText(payload);
    expect(await page.evaluate(() => (window as unknown as { __exp04Xss?: number }).__exp04Xss)).toBeUndefined();
  });

  test(`P04-T08/09/30/38 ${locale}: neutral deep-link, toggle, exact request and back preserve applied filters/focus`, async ({ page }) => {
    const input: SearchInput = { ...base, serviceLanguage: 'kk', format: 'offline' };
    await setup(page, locale, catalog, input);
    await page.goto('/specialists/S06?offer=O15');
    await expect(selected(page)).toContainText(t.neutralOffer);
    await expect(page.locator('[data-reason]')).toHaveCount(0);
    await selected(page).getByRole('button', { name: t.compare, exact: true }).click();
    await selected(page).getByRole('button', { name: t.removeCompare, exact: true }).click();
    await expect(selected(page).getByRole('button', { name: t.compare, exact: true })).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#create-demo-request').focus(); await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/request/O15');
    await expect(page.getByTestId('request-offer')).toHaveAttribute('data-specialist-id', 'S06');
    await page.goto('/specialists');
    await page.locator('#profile-O06').click();
    await page.getByRole('button', { name: t.backToResults, exact: true }).click();
    await expect(page.locator('#profile-O06')).toBeFocused();
    expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('qoldau.demo-search')!).input)).toEqual(input);
  });

  test(`P04-T17 ${locale}: Almaty date rollover uses the documented locale policy in real Chromium`, async ({ page }) => {
    const data = structuredClone(catalog);
    data.specialists[0].verificationFacts[0].checkedAt = '2026-11-12T20:00:00Z';
    await setup(page, locale, data);
    await page.goto('/specialists/S01?offer=O01');
    const date = page.locator('[data-trust-scope="education"] time[datetime="2026-11-12T20:00:00Z"]');
    await expect(date).toHaveText(locale === 'kk' ? '13.11.2026' : /13 нояб. 2026/u);
    await expect(page.locator('.trust-passport')).not.toContainText('M11');
  });

  test(`P04-T27/37/38/41 ${locale}: three aligned desktop alternatives, mobile stack, long text200 and keyboard`, async ({ page }) => {
    const data = structuredClone(catalog);
    data.specialists[1].displayName = { ru: 'Очень длинное имя вымышленного специалиста для проверки переноса каждого слова', kk: 'Әр сөздің тасымалдануын тексеруге арналған ойдан шығарылған маманның өте ұзын аты' };
    data.specialists[1].verificationFacts[0].limitations = { ru: 'Ограничение синтетического источника. '.repeat(6), kk: 'Синтетикалық дереккөздің шектеулері және нақтылауды қажет ететін мәліметтер. '.repeat(8) };
    await setup(page, locale, data); await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await openCompare(page, locale);
    const geometry = await cards(page).evaluateAll(xs => xs.map(x => ({ x: x.getBoundingClientRect().x, y: x.getBoundingClientRect().y,
      fields: [...x.querySelectorAll('.offer-facts > div')].map(f => ({ label: f.querySelector('dt')!.textContent, y: f.getBoundingClientRect().y })) })));
    expect(new Set(geometry.map(x => x.x)).size).toBe(3);
    expect(Math.max(...geometry.map(x => x.y)) - Math.min(...geometry.map(x => x.y))).toBeLessThan(2);
    for (let i = 0; i < 7; i++) {
      expect(new Set(geometry.map(x => x.fields[i].label)).size).toBe(1);
      expect(Math.max(...geometry.map(x => x.fields[i].y)) - Math.min(...geometry.map(x => x.fields[i].y))).toBeLessThan(2);
    }
    const artifactDir = process.env.EXP04_ARTIFACT_DIR || 'work/exp04/screenshots';
    await mkdir(artifactDir, { recursive: true });
    await page.screenshot({ path: `${artifactDir}/compare-${locale}-1280.jpg`, fullPage: true, type: 'jpeg', quality: 75, scale: 'css' });
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      const positions = await cards(page).evaluateAll(xs => xs.map(x => ({ x: x.getBoundingClientRect().x, y: x.getBoundingClientRect().y })));
      expect(new Set(positions.map(x => x.x)).size).toBe(1);
      expect(positions[1].y).toBeGreaterThan(positions[0].y);
      if (width === 390) await page.screenshot({ path: `${artifactDir}/compare-${locale}-390.jpg`, fullPage: true, type: 'jpeg', quality: 75, scale: 'css' });
    }
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    for (const card of await cards(page).all()) {
      await card.locator('summary').focus(); await page.keyboard.press('Space');
      await expect(card.locator('details')).toHaveAttribute('open', '');
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const clips = await page.locator('.comparison-grid .price, .comparison-grid button, .comparison-grid dd, .comparison-grid summary').evaluateAll(xs => xs.filter(x => x.scrollWidth > x.clientWidth + 1).map(x => x.textContent));
    expect(clips).toEqual([]);
    if (locale === 'kk') await page.screenshot({ path: `${artifactDir}/compare-kk-320-text200.jpg`, fullPage: true, type: 'jpeg', quality: 65, scale: 'css' });
    await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
    await cards(page).nth(1).getByRole('button', { name: t.removeCompare, exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
    await expect(cards(page)).toHaveCount(2);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: t.backToResults, exact: true })).toBeFocused();
    await page.getByRole('button', { name: t.clearComparison, exact: true }).focus(); await page.keyboard.press('Space');
    await expect(cards(page)).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  });
}
