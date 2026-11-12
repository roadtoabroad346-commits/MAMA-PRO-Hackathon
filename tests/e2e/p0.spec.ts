import { expect, test, type Page } from '@playwright/test';
import { messages } from '../../src/i18n/messages';

// Acceptance oracles are fixed IDs from spec §20.3, not SearchService output.
for (const locale of ['ru', 'kk'] as const) {
  const t = messages[locale];
  async function start(page: Page) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: locale === 'ru' ? 'Рус' : 'Қаз', exact: true }).click();
  }
  async function compare(page: Page, ids: string[]) {
    for (const id of ids) await page.getByTestId('specialist-card').filter({ has: page.locator(`#profile-${id}`) })
      .getByRole('button', { name: t.compare, exact: true }).click();
    await page.locator('#comparison-open').click();
    await expect(page.getByTestId('comparison-card')).toHaveCount(ids.length);
    expect(await page.getByTestId('comparison-card').evaluateAll(cards => cards.map(c => c.getAttribute('data-offer-id')))).toEqual(ids);
  }

  test(`${locale} P0 A: guided route → review → profile → compare → request → durable status`, async ({ page }, info) => {
    const sends: string[] = []; const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => {
      if (!['GET', 'HEAD'].includes(r.method()) || new URL(r.url()).origin !== 'http://127.0.0.1:5173') sends.push(`${r.method()} ${r.url()}`);
    });
    await start(page);
    await page.getByRole('link', { name: t.guide, exact: true }).click();
    await page.getByRole('radio', { name: t.speech, exact: true }).check();
    await page.getByRole('button', { name: t.next, exact: true }).click();
    await page.getByRole('radio', { name: t.age3, exact: true }).check();
    await page.getByRole('button', { name: t.next, exact: true }).click();
    await page.getByRole('radio', { name: t.kazakh, exact: true }).check();
    await page.getByRole('radio', { name: t.offline, exact: true }).check();
    await page.getByRole('button', { name: t.next, exact: true }).click();
    await page.locator('input[name="districtId"][value="BOSTANDYK"]').check();
    await page.locator('#budget').fill('6000');
    await page.getByRole('checkbox', { name: t.availability, exact: true }).check();
    await page.getByRole('button', { name: t.reviewCta, exact: true }).click();
    await expect(page).toHaveURL('/route/review');
    await expect(page.locator('[data-field="serviceLanguage"]')).toContainText(t.kazakh);
    await page.getByRole('link', { name: t.show, exact: true }).click();
    expect(await page.getByTestId('specialist-card').evaluateAll(cards => cards.map(c => c.getAttribute('data-offer-id')))).toEqual(['O01', 'O03', 'O02', 'O11', 'O10']);
    await page.locator('#profile-O01').click();
    await expect(page.getByTestId('selected-offer')).toHaveAttribute('data-offer-id', 'O01');
    await expect(page.locator('[data-trust-scope="education"]')).toContainText(t.noDocumentAuthenticity);
    await page.getByRole('button', { name: t.compare, exact: true }).click();
    await page.getByRole('button', { name: t.backToResults, exact: true }).click();
    await page.locator('#profile-O03').click();
    await page.getByRole('button', { name: t.compare, exact: true }).click();
    await page.getByRole('link', { name: `${t.openComparison} · 2/3`, exact: true }).click();
    await expect(page.getByTestId('comparison-card')).toHaveCount(2);
    const chosen = page.getByTestId('comparison-card').filter({ has: page.locator('[href="/specialists/S03?offer=O03"]') });
    await chosen.getByRole('link', { name: locale === 'ru' ? 'Выбрать эту услугу' : 'Осы қызметті таңдау', exact: true }).click();
    await expect(page).toHaveURL('/request/O03');
    await expect(page.getByTestId('request-offer')).toHaveAttribute('data-specialist-id', 'S03');
    await expect(page.getByRole('checkbox')).not.toBeChecked();
    await expect(page.getByRole('button', { name: t.requestSave, exact: true })).toBeDisabled();
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: t.requestSave, exact: true }).click();
    await expect(page).toHaveURL(/\/request-status\//);
    await expect(page.getByText(t.requestNotSent, { exact: true })).toBeVisible();
    const id = await page.getByTestId('request-id').innerText();
    await page.reload();
    await expect(page.getByTestId('request-id')).toHaveText(id);
    await expect(page.getByTestId('request-metadata')).toHaveAttribute('data-status', 'recorded_demo');
    expect(sends).toEqual([]); expect(errors).toEqual([]);
    await info.attach('A-status-mobile', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  });

  test(`${locale} P0 B: direct catalog → hard filters → compare → exact selection`, async ({ page }, info) => {
    await start(page);
    await page.getByRole('link', { name: t.catalog, exact: true }).click();
    await page.locator('#filters-open').click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('checkbox', { name: t.LOGOPED, exact: true }).check();
    await page.locator('#filter-language').selectOption('kk');
    await page.locator('#filter-format').selectOption('offline');
    await page.locator('#filter-budget').fill('6000');
    await page.locator('#filter-budget-mode').selectOption('hard');
    await dialog.getByRole('button', { name: t.applyFilters, exact: true }).click();
    expect(await page.getByTestId('specialist-card').evaluateAll(cards => cards.map(c => c.getAttribute('data-offer-id')))).toEqual(['O01', 'O03', 'O06', 'O07']);
    await compare(page, ['O01', 'O03']);
    await info.attach('B-compare-mobile', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
    await page.getByTestId('comparison-card').first().getByRole('link', { name: locale === 'ru' ? 'Выбрать эту услугу' : 'Осы қызметті таңдау', exact: true }).click();
    await expect(page).toHaveURL('/request/O01');
    await expect(page.getByTestId('request-offer')).toHaveAttribute('data-offer-id', 'O01');
    await page.goBack();
    await expect(page.getByTestId('comparison-card')).toHaveCount(2);
  });

  test(`${locale} P0 C: no exact results → explicit budget reset → retry`, async ({ page }) => {
    await start(page);
    await page.getByRole('link', { name: t.catalog, exact: true }).click();
    await page.locator('#filters-open').click();
    await page.locator('#filter-language').selectOption('kk');
    await page.locator('#filter-format').selectOption('offline');
    await page.locator('#filter-budget').fill('1000');
    await page.locator('#filter-budget-mode').selectOption('hard');
    await page.getByRole('button', { name: t.applyFilters, exact: true }).click();
    await expect(page.getByTestId('specialist-card')).toHaveCount(0);
    await expect(page.getByTestId('incomplete-card')).toHaveCount(0);
    await page.reload();
    await expect(page.getByTestId('specialist-card')).toHaveCount(0);
    await page.locator('#filters-open').click();
    await expect(page.locator('#filter-budget')).toHaveValue('1000');
    await expect(page.locator('#filter-budget-mode')).toHaveValue('hard');
    await page.locator('#filter-budget').fill('');
    await page.getByRole('button', { name: t.applyFilters, exact: true }).click();
    expect(await page.getByTestId('specialist-card').evaluateAll(cards => cards.map(c => c.getAttribute('data-offer-id')))).toEqual(['O01', 'O02', 'O03', 'O06', 'O07', 'O10', 'O11']);
    const input = await page.evaluate(() => JSON.parse(sessionStorage.getItem('qoldau.demo-search')!).input);
    expect(input).toMatchObject({ serviceLanguage: 'kk', languageHard: true, format: 'offline', formatHard: true, budgetKzt: null, budgetHard: true });
  });
}
