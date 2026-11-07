import { expect, test } from '@playwright/test';
import { messages } from '../../src/i18n/messages';

for (const locale of ['ru', 'kk'] as const) {
  const t = messages[locale];
  test(`${locale} release: direct routes, reload, local assets, cancel and clean restart`, async ({ page, request }) => {
    const errors: string[] = []; const violations: string[] = []; const assets = new Set<string>();
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', req => {
      const url = new URL(req.url());
      if (url.origin !== 'http://127.0.0.1:5173' || !['GET', 'HEAD'].includes(req.method()) ||
        /\/@vite\/|\/@react-refresh|\/src\/|\/node_modules\//u.test(url.pathname)) violations.push(req.url());
      if (url.pathname.startsWith('/assets/')) assets.add(url.pathname);
    });
    await page.goto('/');
    await page.getByRole('button', { name: locale === 'ru' ? 'Рус' : 'Қаз', exact: true }).click();
    const routes = ['/', '/specialists/S01?offer=O01', '/compare', '/request-status/absent-demo', '/unknown-demo-route'];
    for (const path of routes) {
      expect((await page.goto(path))?.status()).toBe(200);
      await expect(page.locator('.site-header')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      if (path.includes('/specialists/')) await expect(page.getByTestId('selected-offer')).toHaveAttribute('data-offer-id', 'O01');
      if (path === '/compare') await expect(page.getByText(t.compareEmpty, { exact: true })).toBeVisible();
      if (path.includes('/request-status/')) await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.requestMissing);
      if (path.includes('unknown-demo-route')) await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.notFound);
      await page.reload();
      await expect(page.locator('.site-header')).toBeVisible();
    }
    expect((await request.get('/assets/missing.js')).status()).toBe(404);
    expect((await request.post('/request/O01')).status()).toBe(405);
    for (const path of assets) {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).not.toContain('text/html');
    }
    expect([...assets].some(path => path.endsWith('.js'))).toBe(true);
    expect([...assets].some(path => path.endsWith('.css'))).toBe(true);
    expect([...assets].some(path => path.endsWith('.json'))).toBe(true);

    await page.goto('/request/O01');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: t.requestSave, exact: true }).click();
    const metadata = page.getByTestId('request-metadata');
    await expect(metadata).toHaveAttribute('data-status', 'recorded_demo');
    const id = await page.getByTestId('request-id').innerText();
    const statusPath = new URL(page.url()).pathname;
    expect(statusPath).toBe(`/request-status/${id}`);
    await page.goto(statusPath);
    await expect(page.getByTestId('request-id')).toHaveText(id);
    await page.getByRole('button', { name: t.requestCancel, exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: t.requestCancel, exact: true }).click();
    await page.reload();
    await expect(metadata).toHaveAttribute('data-status', 'cancelled_demo');

    await page.goto('/privacy');
    await page.getByRole('button', { name: t.requestClear, exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: t.requestClearConfirm, exact: true }).click();
    await expect(page.getByText(t.requestCleared, { exact: true })).toBeVisible();
    // Exact manual reset recipe: only app-owned keys; reload drops in-memory compare.
    await page.evaluate(() => {
      sessionStorage.removeItem('qoldau.demo-search');
      sessionStorage.removeItem('qoldau.demo-request-attempt');
      localStorage.removeItem('qoldau.locale');
    });
    await page.goto(statusPath);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(messages.ru.requestMissing);
    const clean = await page.evaluate(() => ({
      input: JSON.parse(sessionStorage.getItem('qoldau.demo-search')!).input,
      attempt: sessionStorage.getItem('qoldau.demo-request-attempt'),
    }));
    expect(clean.input).toMatchObject({ needTag: null, categoryIds: [], ageGroup: null, serviceLanguage: null,
      format: null, budgetKzt: null, districtId: null, query: '', availabilityPreferred: false, sort: 'relevant' });
    expect(clean.attempt).toBeNull();
    await page.goto('/specialists');
    await expect(page.getByTestId('specialist-card')).toHaveCount(12);
    await page.goto('/compare');
    await expect(page.getByTestId('comparison-card')).toHaveCount(0);
    expect(errors).toEqual([]); expect(violations).toEqual([]);
  });
}
