import { chromium, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

// Replay against `PORT=5180 node scripts/serve-release.mjs` after npm run build.
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium' });
const observations = [];
try {
  for (const locale of ['ru', 'kk']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => requests.push(request.url()));
    await page.goto('http://127.0.0.1:5180/');
    await page.getByRole('button', { name: locale === 'ru' ? 'Рус' : 'Қаз', exact: true }).click();
    await page.screenshot({ path: `docs/phases28-35/production-home-${locale}.png`, fullPage: true });
    await page.locator('.home-actions a[href="/route"]').click();
    await page.locator('input[name="needTag"][value="speech"]').check();
    await page.locator('button[type="submit"]').click();
    await page.locator('input[name="ageGroup"][value="AGE_3_5"]').check();
    await page.locator('button[type="submit"]').click();
    await page.locator('input[name="serviceLanguage"][value="kk"]').check();
    await page.locator('input[name="format"][value="offline"]').check();
    await page.locator('button[type="submit"]').click();
    await page.locator('#district').selectOption('BOSTANDYK');
    await page.locator('#budget').fill('6000');
    await page.locator('.check-field').last().getByRole('checkbox').check();
    await page.locator('button[type="submit"]').click();
    const count = locale === 'ru' ? 'Специалистов: 5. Услуг: 5.' : 'Мамандар: 5. Қызметтер: 5.';
    await expect(page.getByTestId('search-count')).toHaveText(count);
    const snapshot = await page.evaluate(() => JSON.parse(sessionStorage.getItem('qoldau.demo-search')));
    expect(snapshot.input.budgetKzt).toBeNull();
    expect(snapshot.intakeDraft.budgetKzt).toBe(6000);
    await page.screenshot({ path: `docs/phases28-35/production-review-${locale}.png`, fullPage: true });
    await page.locator('.review-actions a.primary').click();
    const ids = await page.getByTestId('specialist-card').evaluateAll(cards => cards.map(c => c.getAttribute('data-offer-id')));
    expect(ids).toEqual(['O01', 'O03', 'O02', 'O11', 'O10']);
    await expect(page.getByTestId('search-count')).toHaveText(count);
    await page.reload();
    await expect(page.getByTestId('search-count')).toHaveText(count);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
    expect(errors).toEqual([]);
    expect(requests.every(url => new URL(url).origin === 'http://127.0.0.1:5180')).toBe(true);
    observations.push({ locale, status: 'PASS', count, ids, runtimeErrors: errors, overflow, localRequestsOnly: true });
    await context.close();
  }
  await writeFile('docs/phases28-35/production-smoke.json', JSON.stringify({ status: 'PASS', observations }, null, 2) + '\n');
} finally { await browser.close(); }
