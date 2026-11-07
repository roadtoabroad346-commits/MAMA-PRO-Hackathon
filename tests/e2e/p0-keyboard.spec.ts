import { expect, test, type Locator, type Page } from '@playwright/test';
import { messages } from '../../src/i18n/messages';

async function keyboardActivate(page: Page, target: Locator) {
  for (let i = 0; i < 180; i++) {
    if (await target.evaluate(el => el === document.activeElement)) break;
    await page.keyboard.press('Tab');
  }
  await expect(target).toBeFocused();
  await page.keyboard.press('Enter');
}

test('compare removal and clear keep a stable keyboard focus at 2/1/0', async ({ page }) => {
  await page.goto('/specialists');
  await expect(page.getByTestId('specialist-card')).toHaveCount(12);
  for (const i of [0, 1, 2]) await page.getByTestId('specialist-card').nth(i).getByRole('button', { name: 'Сравнить', exact: true }).click();
  await page.locator('#comparison-open').click();
  for (const count of [2, 1]) {
    await page.getByTestId('comparison-card').first().getByRole('button', { name: 'Убрать из сравнения', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('comparison-card')).toHaveCount(count);
    await expect(page.locator('h1')).toBeFocused();
  }
  await keyboardActivate(page, page.getByRole('button', { name: 'Очистить сравнение', exact: true }));
  await expect(page.getByTestId('comparison-card')).toHaveCount(0);
  await expect(page.locator('h1')).toBeFocused();
});

for (const locale of ['ru', 'kk'] as const) {
  const t = messages[locale];
  test(`${locale}: keyboard-only entry → skipped input → compare → save → cancel dialog`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    if (locale === 'kk') await keyboardActivate(page, page.getByRole('button', { name: 'Қаз', exact: true }));
    await keyboardActivate(page, page.getByRole('link', { name: t.guide, exact: true }));
    for (let i = 0; i < 4; i++) await keyboardActivate(page, page.getByRole('button', { name: t.skip, exact: true }));
    await keyboardActivate(page, page.getByRole('link', { name: t.show, exact: true }));
    await keyboardActivate(page, page.getByTestId('specialist-card').nth(0).getByRole('button', { name: t.compare, exact: true }));
    await keyboardActivate(page, page.getByTestId('specialist-card').nth(1).getByRole('button', { name: t.compare, exact: true }));
    await keyboardActivate(page, page.locator('#comparison-open'));
    await keyboardActivate(page, page.getByTestId('comparison-card').first().getByRole('link', { name: locale === 'ru' ? 'Выбрать эту услугу' : 'Осы қызметті таңдау', exact: true }));
    const ack = page.getByRole('checkbox');
    for (let i = 0; i < 30 && !await ack.evaluate(el => el === document.activeElement); i++) await page.keyboard.press('Tab');
    await expect(ack).toBeFocused(); await page.keyboard.press('Space');
    await keyboardActivate(page, page.getByRole('button', { name: t.requestSave, exact: true }));
    await expect(page.getByTestId('request-metadata')).toHaveAttribute('data-status', 'recorded_demo');
    await keyboardActivate(page, page.getByRole('button', { name: t.requestCancel, exact: true }));
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press(i % 2 ? 'Shift+Tab' : 'Tab');
      expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: t.requestCancel, exact: true })).toBeFocused();
    const id = await page.getByTestId('request-id').innerText();
    await keyboardActivate(page, page.getByRole('button', { name: locale === 'ru' ? 'Қаз' : 'Рус', exact: true }));
    await expect(page.getByTestId('request-id')).toHaveText(id);
    await page.reload();
    await expect(page.getByTestId('request-id')).toHaveText(id);
    await expect(page.locator('html')).toHaveAttribute('lang', locale === 'ru' ? 'kk' : 'ru');
  });
}

test('unknown route, compare reload and changed hard conditions stay explicit', async ({ page }) => {
  await page.goto('/no-such-route');
  await expect(page.getByRole('heading', { name: 'Страница не найдена' })).toBeVisible();
  await page.goto('/specialists');
  await expect(page.getByTestId('specialist-card')).toHaveCount(12);
  for (const i of [0, 1]) await page.getByTestId('specialist-card').nth(i).getByRole('button', { name: 'Сравнить', exact: true }).click();
  await page.locator('#filters-open').click();
  await page.locator('#filter-format').selectOption('online');
  await page.getByRole('button', { name: 'Применить', exact: true }).click();
  await page.locator('#comparison-open').click();
  const first = page.getByTestId('comparison-card').first();
  await expect(first).toHaveAttribute('data-offer-id', 'O01');
  await expect(first.getByRole('button', { name: 'Выбрать эту услугу', exact: true })).toBeDisabled();
  await expect(first.getByText('Эта услуга не соответствует текущему поиску.', { exact: false })).toBeVisible();
  await first.getByRole('checkbox').check();
  await first.getByRole('link', { name: 'Выбрать эту услугу', exact: true }).click();
  await expect(page).toHaveURL('/request/O01');
  await page.getByRole('button', { name: 'Вернуться к сравнению', exact: true }).click();
  await expect(page.getByTestId('comparison-card')).toHaveCount(2);
  await page.reload();
  await expect(page.getByTestId('comparison-card')).toHaveCount(0);
  await expect(page.getByText('Выберите от двух до трёх специалистов в каталоге.', { exact: true })).toBeVisible();
});

test('review exposes seven valid term/definition pairs with associated edit controls', async ({ page }) => {
  await page.goto('/route/review');
  await expect(page.locator('dl.summary > .summary-row > dt')).toHaveCount(7);
  await expect(page.locator('dl.summary > .summary-row > dd')).toHaveCount(7);
  await expect(page.locator('dl.summary > .summary-row > dd a')).toHaveCount(7);
});
