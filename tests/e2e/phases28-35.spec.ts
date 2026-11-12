import { expect, test, type Page } from '@playwright/test';
import { messages } from '../../src/i18n/messages';
import raw from '../../src/data/catalog.json' with { type: 'json' };
import { emptySearchInput } from '../../src/domain/contracts';

async function snapshot(page: Page) {
  return page.evaluate(() => JSON.parse(sessionStorage.getItem('qoldau.demo-search')!));
}
async function conditions(page: Page) {
  await page.goto('/route');
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Далее', exact: true }).click();
}

test('draft preview never replaces applied catalog until review CTA; reload keeps both', async ({ page }) => {
  const logs: string[] = [], urls: string[] = [];
  page.on('console', msg => logs.push(msg.text()));
  page.on('request', req => urls.push(req.url()));
  await conditions(page);
  await page.locator('#budget').fill('0');
  await page.getByRole('radio', { name: 'Строгий максимум', exact: true }).check();
  await page.getByRole('button', { name: messages.ru.reviewCta, exact: true }).click();
  await expect(page.getByTestId('search-count')).toHaveText('Специалистов: 0. Услуг: 0.');
  expect((await snapshot(page)).input).toEqual(emptySearchInput());
  expect((await snapshot(page)).intakeDraft.budgetKzt).toBe(0);
  await page.reload();
  await expect(page.getByTestId('search-count')).toHaveText('Специалистов: 0. Услуг: 0.');
  await page.locator('.brand').click();
  await page.getByRole('link', { name: messages.ru.catalog, exact: true }).click();
  await expect(page.getByTestId('specialist-card')).toHaveCount(12);
  await page.getByRole('link', { name: messages.ru.reviewTitle, exact: true }).click();
  await expect(page.locator('[data-field="budgetKzt"]')).toContainText('0 ₸');
  await page.getByRole('link', { name: messages.ru.show, exact: true }).click();
  await expect(page.getByTestId('specialist-card')).toHaveCount(0);
  expect((await snapshot(page)).input.budgetKzt).toBe(0);
  await page.reload();
  await expect(page.getByTestId('specialist-card')).toHaveCount(0);
  expect(urls.every(url => new URL(url).origin === 'http://127.0.0.1:5173' && !new URL(url).search.includes('budget'))).toBe(true);
  expect(logs.some(log => log.includes('budgetKzt'))).toBe(false);
});

test('invalid budget survives Back to review and blocks count/application until repaired', async ({ page }) => {
  await page.goto('/route/review');
  await page.getByRole('link', { name: 'Изменить: Бюджет за одно занятие, ₸', exact: true }).click();
  await page.locator('#budget').fill('-2');
  await page.getByRole('button', { name: 'Назад', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('отрицательной');
  await expect(page.getByTestId('search-count')).toHaveCount(0);
  await expect(page.getByRole('button', { name: messages.ru.show, exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Қаз', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('теріс');
  await page.locator('.field-error a').click();
  await expect(page.locator('#budget')).toHaveValue('-2');
  await page.locator('#budget').fill('6100');
  await page.getByRole('button', { name: messages.kk.reviewCta, exact: true }).click();
  await expect(page.getByTestId('search-count')).toBeVisible();
  expect((await snapshot(page)).input.budgetKzt).toBeNull();
  await page.getByRole('link', { name: messages.kk.show, exact: true }).click();
  expect((await snapshot(page)).input.budgetKzt).toBe(6100);
});

test('unsure topic stays null; mixed district is explicit hard and online-only disables its effect', async ({ page }) => {
  await page.goto('/route');
  await page.getByRole('radio', { name: messages.ru.unsure, exact: true }).check();
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: messages.ru.next, exact: true }).click();
  await page.locator('input[name="districtId"][value="BOSTANDYK"]').check();
  await page.getByRole('checkbox', { name: messages.ru.districtRequired, exact: true }).check();
  await page.getByRole('button', { name: messages.ru.reviewCta, exact: true }).click();
  await expect(page.locator('[data-field="needTag"]')).toContainText(messages.ru.unsure);
  await expect(page.locator('[data-field="districtId"]')).toContainText(messages.ru.strict);
  expect((await snapshot(page)).intakeDraft.needTag).toBeNull();
  expect((await snapshot(page)).intakeDraft.categoryIds).toEqual([]);
  await page.locator('[data-field="format"] .edit-link').click();
  await page.getByRole('radio', { name: messages.ru.online, exact: true }).check();
  await page.getByRole('button', { name: messages.ru.reviewCta, exact: true }).click();
  await expect(page.locator('[data-field="districtId"]')).toContainText(messages.ru.unused);
  const saved = (await snapshot(page)).intakeDraft;
  expect(saved.districtId).toBe('BOSTANDYK');
  expect(saved.districtHard).toBe(true);
  await page.getByRole('link', { name: messages.ru.show, exact: true }).click();
  await expect(page.getByTestId('specialist-card')).toHaveCount(4);
  await expect(page.getByTestId('search-count')).toHaveText('Специалистов: 4. Услуг: 6.');
  expect(await page.getByTestId('specialist-card').evaluateAll(cards => cards.map(c => c.getAttribute('data-offer-id')))).toEqual(['O05', 'O15', 'O09', 'O24']);
});

test('catalog load failure on review is distinct from zero and Retry restores the synthetic draft', async ({ page }) => {
  await conditions(page);
  await page.locator('#budget').fill('6000');
  await page.getByRole('button', { name: messages.ru.reviewCta, exact: true }).click();
  let fail = true;
  await page.route('**/src/data/catalog.json', route => fail ? route.fulfill({ status: 503, body: 'Unavailable' }) : route.fulfill({ json: raw }));
  await page.reload();
  await expect(page.getByRole('alert')).toContainText(messages.ru.loadError);
  await expect(page.getByTestId('search-count')).toHaveCount(0);
  expect((await snapshot(page)).intakeDraft.budgetKzt).toBe(6000);
  fail = false;
  await page.getByRole('button', { name: messages.ru.retry, exact: true }).click();
  await expect(page.locator('[data-field="budgetKzt"]')).toContainText('6 000 ₸');
  await expect(page.getByTestId('search-count')).toHaveText('Специалистов: 12. Услуг: 20.');
});

for (const locale of ['ru', 'kk'] as const) {
  for (const width of [360, 390, 430]) {
    test(`${locale} S01–S03 at ${width}px, 200% text, reduced motion and no runtime errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      const t = messages[locale];
      await page.getByRole('button', { name: locale === 'ru' ? 'Рус' : 'Қаз', exact: true }).click();
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      if (locale === 'ru' && width === 390) await page.screenshot({ path: 'work/phases28-35/home-ru-390.png', fullPage: true });
      await page.getByRole('link', { name: t.guide, exact: true }).click();
      for (let step = 1; step <= 4; step++) {
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
        await page.getByRole('button', { name: t.skip, exact: true }).click();
      }
      await expect(page.locator('dl.summary > .summary-row')).toHaveCount(7);
      await expect(page.getByTestId('search-count')).toHaveText(t.count.replace('{specialists}', '12').replace('{offers}', '20'));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      if (width === 390) await page.screenshot({ path: `work/phases28-35/review-${locale}-390.png`, fullPage: true });
      await page.getByRole('link', { name: t.show, exact: true }).focus();
      await page.keyboard.press('Enter');
      await expect(page.getByTestId('specialist-card')).toHaveCount(12);
      expect(errors).toEqual([]);
    });
  }
}
