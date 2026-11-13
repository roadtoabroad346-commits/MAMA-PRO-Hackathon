import { expect, test, type Page } from '@playwright/test';
import raw from '../../src/data/catalog.json' with { type: 'json' };
import { catalogSchema, type Catalog } from '../../src/domain/catalog';
import { emptySearchInput, type SearchInput } from '../../src/domain/contracts';
import { messages } from '../../src/i18n/messages';

const base = emptySearchInput();
const catalog = catalogSchema.parse(raw);
const applied = (page: Page): Promise<SearchInput> => page.evaluate(() => JSON.parse(sessionStorage.getItem('qoldau.demo-search')!).input);
const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const list: string[] = []; errors.set(page, list);
  page.on('pageerror', error => list.push(error.message));
});
test.afterEach(async ({ page }) => { expect(errors.get(page)).toEqual([]); });

async function open(page: Page, locale: 'ru' | 'kk', input: SearchInput = base, fixture?: Catalog) {
  if (fixture) await page.route(/\/(?:src\/data\/catalog\.json|assets\/catalog-[^/]+\.json)(?:\?.*)?$/, route =>
    route.request().resourceType() === 'fetch'
      ? route.fulfill({ contentType: 'application/json', body: JSON.stringify(fixture) })
      : route.continue()); // Preserve Vite's JS module for the ?url import.
  await page.addInitScript(({ locale, input }) => {
    // Do not re-seed on reload: navigation/persistence must prove actual storage.
    if (!sessionStorage.getItem('qoldau.demo-search')) sessionStorage.setItem('qoldau.demo-search', JSON.stringify({
      schemaVersion: 1, catalogVersion: 'catalog-v2', expiresAt: Date.now() + 7200000, input, step: 1 }));
    if (!localStorage.getItem('qoldau.locale')) localStorage.setItem('qoldau.locale', locale);
  }, { locale, input });
  await page.goto('/specialists');
  await expect(page.getByTestId('search-count')).toBeVisible();
}

for (const locale of ['ru', 'kk'] as const) {
  const t = messages[locale];
  test(`EXP-03 ${locale}: own service title selects one offer and cannot borrow a sibling language`, async ({ page }) => {
    const fixture = structuredClone(catalog);
    fixture.offers.find(o => o.id === 'O23')!.title = { ru: 'Редкая очная услуга', kk: 'Ерекше бетпе-бет қызмет' };
    await open(page, locale, base, fixture);
    await page.getByLabel(t.nameSearch, { exact: true }).fill(fixture.offers.find(o => o.id === 'O23')!.title[locale]);
    await expect(page.getByTestId('specialist-card')).toHaveCount(1);
    await expect(page.getByTestId('specialist-card')).toHaveAttribute('data-offer-id', 'O23');
    await page.locator('#filters-open').click();
    await page.locator('#filter-language').selectOption('kk');
    await page.locator('#filter-format').selectOption('offline');
    await page.getByRole('button', { name: t.applyFilters, exact: true }).click();
    // O23 is RU/offline, O24 KK/online: neither may become this title/KK/offline.
    await expect(page.getByTestId('specialist-card')).toHaveCount(0);
    await expect(page.getByTestId('incomplete-card')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: t.emptyExact, exact: true })).toBeVisible();
  });

  test(`EXP-03 ${locale}: combined filters, price/age boundary, soft availability and explicit reset`, async ({ page }) => {
    await open(page, locale);
    await page.locator('#filters-open').click();
    await page.getByRole('checkbox', { name: t.LOGOPED, exact: true }).check();
    await page.getByRole('checkbox', { name: t.PSYCHOLOG, exact: true }).check();
    await page.locator('#filter-age').selectOption('AGE_3_5');
    await page.locator('#filter-language').selectOption('kk');
    await page.locator('#filter-format').selectOption('offline');
    await page.locator('#filter-district').selectOption('BOSTANDYK');
    await page.getByRole('checkbox', { name: t.districtRequired, exact: true }).check();
    await page.locator('#filter-budget').fill('6000');
    await page.locator('#filter-budget-mode').selectOption('hard');
    await page.getByRole('checkbox', { name: t.availability, exact: true }).check();
    expect(await applied(page)).toEqual(base);
    await page.getByRole('button', { name: t.applyFilters, exact: true }).click();
    await expect(page.getByTestId('specialist-card')).toHaveCount(1);
    await expect(page.getByTestId('specialist-card')).toHaveAttribute('data-offer-id', 'O01');
    const expected = { ...base, categoryIds: ['LOGOPED', 'PSYCHOLOG'], ageGroup: 'AGE_3_5', serviceLanguage: 'kk',
      format: 'offline', districtId: 'BOSTANDYK', districtHard: true, budgetKzt: 6000, budgetHard: true, availabilityPreferred: true };
    expect(await applied(page)).toEqual(expected);
    await page.getByRole('button', { name: t.resetAll, exact: true }).click();
    expect(await applied(page)).toEqual(base);
    await expect(page.getByTestId('specialist-card')).toHaveCount(12);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
  });

  test(`EXP-03 ${locale}: zero results never relax hard conditions through incomplete, cancel, language switch or reload`, async ({ page }) => {
    const input: SearchInput = { ...base, serviceLanguage: 'kk', format: 'offline', budgetKzt: 1000, budgetHard: true };
    await open(page, locale, input);
    await expect(page.getByRole('heading', { name: t.emptyExact, exact: true })).toBeVisible();
    await expect(page.getByTestId('specialist-card')).toHaveCount(0);
    await page.getByRole('button', { name: t.showIncomplete.replace('{count}', '1'), exact: true }).click();
    const card = page.getByTestId('incomplete-card');
    await expect(card).toHaveAttribute('data-offer-id', 'O11');
    await expect(card.locator('[data-unknown="BUDGET_STALE"]')).toHaveText(t.unknownBudgetStale);
    await expect(card.locator('[data-reason="BUDGET_MATCH"]')).toHaveCount(0);
    await page.getByRole('button', { name: t.editPreferences, exact: true }).click();
    await expect(page.locator('#filter-budget-mode')).toHaveValue('hard');
    await page.locator('#filter-budget').fill('10000');
    await page.keyboard.press('Escape');
    expect(await applied(page)).toEqual(input);
    await page.getByRole('button', { name: locale === 'ru' ? 'Қаз' : 'Рус', exact: true }).click();
    await page.reload();
    expect(await applied(page)).toEqual(input);
    await expect(page.getByTestId('specialist-card')).toHaveCount(0);
    await expect(page.locator('[data-condition="budget"]')).toBeVisible();
  });

  test(`EXP-03 ${locale}: free zero is exact, missing price is incomplete and stale is never a budget match`, async ({ page }) => {
    const fixture = structuredClone(catalog);
    const free = fixture.offers.find(o => o.id === 'O01')!;
    Object.assign(free, { priceKind: 'free', priceAmountKzt: 0 });
    await open(page, locale, { ...base, budgetKzt: 0, budgetHard: true }, fixture);
    await expect(page.getByTestId('specialist-card')).toHaveCount(1);
    const card = page.getByTestId('specialist-card');
    await expect(card).toHaveAttribute('data-offer-id', 'O01');
    await expect(card.locator('[data-reason="BUDGET_MATCH"]')).toHaveText(t.reasonBudget);
    await page.getByRole('button', { name: t.showIncomplete.replace('{count}', '2'), exact: true }).click();
    const unknown = page.getByTestId('incomplete-card').filter({ has: page.locator('#profile-O09') });
    await expect(unknown.locator('[data-unknown="BUDGET_UNKNOWN"]')).toHaveText(t.unknownBudget);
    await expect(unknown.locator('[data-reason="BUDGET_MATCH"]')).toHaveCount(0);
    const stale = page.getByTestId('incomplete-card').filter({ has: page.locator('#profile-O11') });
    await expect(stale.locator('[data-unknown="BUDGET_STALE"]')).toHaveText(t.unknownBudgetStale);
  });

  test(`EXP-03 ${locale}: applied query/sort/filters survive profile, comparison, history and reload`, async ({ page }) => {
    const input: SearchInput = { ...base, categoryIds: ['LOGOPED'], serviceLanguage: 'kk', format: 'offline', sort: 'price', budgetKzt: 6000 };
    await open(page, locale, input);
    const ids = await page.getByTestId('specialist-card').evaluateAll(nodes => nodes.map(n => n.getAttribute('data-offer-id')));
    const first = ids[0]!;
    await page.locator(`#profile-${first}`).click();
    await expect(page.getByTestId('selected-offer')).toHaveAttribute('data-offer-id', first);
    await page.getByRole('button', { name: t.backToResults, exact: true }).click();
    await expect(page.locator(`#profile-${first}`)).toBeFocused();
    expect(await applied(page)).toEqual(input);
    for (const id of ids.slice(0, 2)) await page.locator(`[data-testid="specialist-card"][data-offer-id="${id}"]`).getByRole('button', { name: t.compare, exact: true }).click();
    await page.locator('#comparison-open').click();
    await expect(page).toHaveURL('/compare');
    await page.goBack();
    await expect(page.getByTestId('specialist-card')).toHaveCount(ids.length);
    await page.reload();
    expect(await applied(page)).toEqual(input);
    expect(await page.getByTestId('specialist-card').evaluateAll(nodes => nodes.map(n => n.getAttribute('data-offer-id')))).toEqual(ids);
  });

  test(`EXP-03 ${locale}: mobile reflow, long query, text200%, keyboard modal, focus restore and reduced motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, locale);
    await page.locator('#query').fill('Ұ'.repeat(80));
    for (const width of [320, 360, 390, 430]) {
      await page.setViewportSize({ width, height: 740 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    }
    await page.locator('#filters-open').focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    for (const width of [320, 360, 390, 430]) {
      await page.setViewportSize({ width, height: 740 });
      expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    }
    // Text scaling is an automated proxy, not a claim of physical browser zoom.
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    for (let i = 0; i < 35; i++) {
      await page.keyboard.press('Tab');
      // A native modal may yield focus to browser chrome (body in the DOM),
      // but never to a background control. Do not replace native dialog policy.
      expect(await dialog.evaluate(node => node.contains(document.activeElement) || document.activeElement === document.body)).toBe(true);
    }
    await page.screenshot({ path: `work/exp03/catalog-${locale}-mobile.png`, fullPage: true });
    await page.keyboard.press('Escape');
    await expect(page.locator('#filters-open')).toBeFocused();
    expect((await applied(page)).query).toBe('Ұ'.repeat(80));
  });

  test(`EXP-03 ${locale}: query injection stays text and never creates markup or outbound search requests`, async ({ page }) => {
    await open(page, locale);
    const requests: string[] = [];
    page.on('request', request => { if (request.url().includes('onerror') || request.url().includes('search?')) requests.push(request.url()); });
    await page.locator('#query').fill('<img src=x onerror="window.EXP03_XSS=1">');
    await expect(page.getByTestId('specialist-card')).toHaveCount(0);
    await expect(page.locator('.active-conditions img')).toHaveCount(0);
    expect(await page.evaluate(() => 'EXP03_XSS' in window)).toBe(false);
    expect(requests).toEqual([]);
    await page.getByRole('button', { name: t.clearSearch, exact: true }).click();
    await expect(page.getByTestId('specialist-card')).toHaveCount(12);
  });
}
