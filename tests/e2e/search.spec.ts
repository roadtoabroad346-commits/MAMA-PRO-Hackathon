import { expect, test, type Page } from '@playwright/test';
import raw from '../../src/data/catalog.json' with { type: 'json' };
import { catalogSchema } from '../../src/domain/catalog';
import { emptySearchInput, type SearchInput } from '../../src/domain/contracts';
import { SearchService } from '../../src/domain/SearchService';

const base = emptySearchInput();
const service = new SearchService(catalogSchema.parse(raw));
const example: SearchInput = { ...base, needTag: 'speech', ageGroup: 'AGE_3_5', serviceLanguage: 'kk', format: 'offline', budgetKzt: 6000, districtId: 'BOSTANDYK', availabilityPreferred: true };

async function open(page: Page, input: SearchInput = base, locale: 'ru' | 'kk' = 'ru') {
  await page.addInitScript(({ input, locale }) => {
    sessionStorage.setItem('qoldau.demo-search', JSON.stringify({ schemaVersion: 1, catalogVersion: 'catalog-v1', expiresAt: Date.now() + 7200000, input, step: 1 }));
    localStorage.setItem('qoldau.locale', locale);
  }, { input, locale });
  await page.goto('/specialists');
  await expect(page.getByTestId('search-count')).toBeVisible();
}
async function applied(page: Page): Promise<SearchInput> {
  return page.evaluate(() => JSON.parse(sessionStorage.getItem('qoldau.demo-search')!).input);
}
async function expectResult(page: Page, input: SearchInput, locale: 'ru' | 'kk' = 'ru') {
  const result = service.search(input);
  await expect(page.getByTestId('search-count')).toHaveText(locale === 'ru' ? `Специалистов: ${result.specialistCount}. Услуг: ${result.eligibleOfferCount}.` : `Мамандар: ${result.specialistCount}. Қызметтер: ${result.eligibleOfferCount}.`);
  await expect(page.getByTestId('specialist-card')).toHaveCount(result.specialistCount);
  expect(await page.getByTestId('specialist-card').evaluateAll(cards => cards.map(card => card.getAttribute('data-offer-id')))).toEqual(result.items.map(item => item.selectedOfferId));
  for (const item of result.items) {
    const card = page.getByTestId('specialist-card').filter({ has: page.locator(`#profile-${item.selectedOfferId}`) });
    expect(await card.locator('[data-reason]').evaluateAll(reasons => reasons.map(reason => reason.getAttribute('data-reason')))).toEqual(item.reasons.slice(0, 3).map(reason => reason.code));
    expect(await card.locator('[data-unknown]').evaluateAll(reasons => reasons.map(reason => reason.getAttribute('data-unknown')))).toEqual(item.unknowns.map(reason => reason.code));
  }
}

test('search + category OR and cross-group AND use one applied input', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Фильтры', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('checkbox', { name: 'Логопед', exact: true }).check();
  await dialog.getByRole('checkbox', { name: 'Психолог', exact: true }).check();
  await dialog.locator('#filter-language').selectOption('kk');
  await dialog.locator('#filter-format').selectOption('offline');
  const next: SearchInput = { ...base, categoryIds: ['LOGOPED', 'PSYCHOLOG'], serviceLanguage: 'kk', format: 'offline' };
  const preview = service.search(next);
  await expect(dialog.getByTestId('filter-preview')).toHaveText(`Предпросмотр: специалистов ${preview.specialistCount}, услуг ${preview.eligibleOfferCount}. Нужно уточнить: ${preview.incompleteSpecialistCount}.`);
  expect(await applied(page)).toEqual(base);
  await dialog.getByRole('button', { name: 'Применить', exact: true }).click();
  await expectResult(page, next);
  await page.locator('#query').fill('  ЛОГОПЕД  ');
  await expectResult(page, { ...next, query: 'ЛОГОПЕД' });
  await page.locator('#query').fill('Демо-специалист 12');
  await expectResult(page, { ...next, query: 'Демо-специалист 12' });
  await expect(page.getByTestId('incomplete-card')).toHaveCount(0);
});

test('Cancel, Escape, Close and backdrop discard draft and restore initiating focus', async ({ page }) => {
  await open(page, example);
  for (const action of ['cancel', 'escape', 'close', 'outside']) {
    await page.locator('#filters-open').click();
    await page.locator('#filter-language').selectOption('ru');
    await page.locator('#filter-budget').fill('1000');
    expect(await applied(page)).toEqual(example);
    if (action === 'cancel') await page.getByRole('button', { name: 'Отмена', exact: true }).click();
    if (action === 'close') await page.getByRole('button', { name: 'Закрыть', exact: true }).click();
    if (action === 'escape') await page.keyboard.press('Escape');
    if (action === 'outside') await page.mouse.click(2, 2);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('#filters-open')).toBeFocused();
    expect(await applied(page)).toEqual(example);
  }
  await page.locator('#filters-open').click();
  await expect(page.locator('#filter-language')).toHaveValue('kk');
  await expect(page.locator('#filter-budget')).toHaveValue('6000');
});

test('draft Reset does not apply; Apply publishes all fields atomically', async ({ page }) => {
  await open(page, example);
  await page.locator('#filters-open').click();
  await page.getByRole('button', { name: 'Сбросить черновик', exact: true }).click();
  await expect(page.getByTestId('filter-preview')).toHaveText('Предпросмотр: специалистов 12, услуг 20. Нужно уточнить: 0.');
  expect(await applied(page)).toEqual(example);
  await page.getByRole('button', { name: 'Отмена', exact: true }).click();
  await expectResult(page, example);
  await page.locator('#filters-open').click();
  await page.getByRole('button', { name: 'Сбросить черновик', exact: true }).click();
  await page.evaluate(() => {
    const writes: SearchInput[] = [];
    Object.defineProperty(window, 'searchWrites', { value: writes });
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === 'qoldau.demo-search') writes.push(JSON.parse(value).input);
      original.call(this, key, value);
    };
  });
  await page.getByRole('button', { name: 'Применить', exact: true }).click();
  await expectResult(page, base);
  await expect(page.locator('#filters-open')).toBeFocused();
  expect(await applied(page)).toEqual(base);
  const writes = await page.evaluate(() => (window as unknown as { searchWrites: SearchInput[] }).searchWrites);
  expect(writes.length).toBeGreaterThan(0);
  expect(writes.every(input => JSON.stringify(input) === JSON.stringify(base))).toBe(true);
});

test('invalid budget disables Apply and never shows a fabricated preview', async ({ page }) => {
  await open(page);
  await page.locator('#filters-open').click();
  for (const raw of ['-1', '1.5', '100001']) {
    await page.locator('#filter-budget').fill(raw);
    await expect(page.getByRole('button', { name: 'Применить', exact: true })).toBeDisabled();
    await expect(page.locator('#filter-budget-error')).toBeVisible();
    await expect(page.getByTestId('filter-preview')).toContainText('Введите корректный бюджет');
    expect(await applied(page)).toEqual(base);
  }
  await page.locator('#filter-budget').fill('0');
  await page.locator('#filter-budget-mode').selectOption('hard');
  await expect(page.getByTestId('filter-preview')).toContainText('специалистов 0, услуг 0');
  await page.getByRole('button', { name: 'Применить', exact: true }).click();
  await expectResult(page, { ...base, budgetKzt: 0, budgetHard: true });
});

test('removes just one category chip; full reset retains interface locale', async ({ page }) => {
  const input: SearchInput = { ...example, categoryIds: ['LOGOPED', 'PSYCHOLOG'], query: 'логопед', sort: 'price' };
  await open(page, input);
  await page.locator('[data-condition="category-PSYCHOLOG"]').click();
  const next = { ...input, categoryIds: ['LOGOPED'] as SearchInput['categoryIds'] };
  await expectResult(page, next);
  expect(await applied(page)).toEqual(next);
  await page.getByRole('button', { name: 'Қаз', exact: true }).click();
  await page.getByRole('button', { name: 'Іздеу мен сүзгілерді тазарту', exact: true }).click();
  await expectResult(page, base, 'kk');
  expect(await applied(page)).toEqual(base);
  await expect(page.locator('html')).toHaveAttribute('lang', 'kk');
  await expect(page.locator('[data-condition]')).toHaveCount(0);
});

test('price/district sorting changes selected offer and keeps counts and explanations aligned', async ({ page }) => {
  await open(page, example);
  for (const sort of ['price', 'district', 'relevant'] as const) {
    await page.locator('#sort').selectOption(sort);
    await expectResult(page, { ...example, sort });
  }
  await page.getByRole('button', { name: 'Сбросить поиск и фильтры', exact: true }).click();
  await page.locator('#sort').selectOption('price');
  await expectResult(page, { ...base, sort: 'price' });
  await expect(page.getByTestId('specialist-card').first()).toHaveAttribute('data-offer-id', 'O06');
  await expect(page.getByText('Сравниваются цены за указанную услугу', { exact: false })).toBeVisible();
});

test('empty keeps hard conditions; incomplete is an explicit separate action', async ({ page }) => {
  const input: SearchInput = { ...base, serviceLanguage: 'kk', format: 'offline', budgetKzt: 1000, budgetHard: true };
  await open(page, input);
  await expectResult(page, input);
  await expect(page.getByRole('heading', { name: 'Точных вариантов по этому поиску нет' })).toBeVisible();
  await expect(page.getByText('Можно изменить предпочтения:', { exact: false })).toBeVisible();
  await expect(page.getByTestId('incomplete-card')).toHaveCount(0);
  await page.getByRole('button', { name: 'Показать варианты, которые нужно уточнить (1)', exact: true }).click();
  await expect(page.getByTestId('incomplete-card')).toHaveCount(1);
  await expect(page.getByTestId('incomplete-card').locator('[data-unknown="BUDGET_UNKNOWN"]')).toBeVisible();
  expect(await applied(page)).toEqual(input);
  await expect(page.getByTestId('search-count')).toHaveText('Специалистов: 0. Услуг: 0.');
  await page.getByRole('button', { name: 'Изменить предпочтения и условия', exact: true }).click();
  await expect(page.locator('#filter-budget-mode')).toHaveValue('hard');
  await page.keyboard.press('Escape');
});

test('compare 1/2/3, fourth rejection, fixed offers, removal and changed conditions', async ({ page }) => {
  await open(page);
  const cards = page.getByTestId('specialist-card');
  await cards.nth(0).getByRole('button', { name: 'Сравнить', exact: true }).click();
  await page.locator('#comparison-open').click();
  await expect(page.getByText('Добавьте ещё одного специалиста для сравнения.', { exact: true })).toBeVisible();
  await expect(page).toHaveURL('/specialists');
  for (const index of [1, 2, 3]) await cards.nth(index).getByRole('button', { name: 'Сравнить', exact: true }).click();
  await expect(page.locator('.compare-tray')).toContainText('Выбрано для сравнения: 3/3');
  await expect(page.locator('.compare-tray')).toContainText('Можно сравнить до трёх');
  await page.locator('#sort').selectOption('price');
  await page.locator('#comparison-open').click();
  await expect(page.getByTestId('comparison-card')).toHaveCount(3);
  await expect(page.getByText('Условия поиска изменились;', { exact: false })).toHaveCount(0);
  expect(await page.getByTestId('comparison-card').evaluateAll(cards => cards.map(card => card.getAttribute('data-offer-id')))).toEqual(['O01', 'O02', 'O03']);
  await page.getByRole('link', { name: 'Вернуться к выдаче', exact: true }).click();
  await page.locator('#query').fill('Демо-специалист 12');
  await page.locator('#comparison-open').click();
  await expect(page.getByText('Условия поиска изменились;', { exact: false })).toBeVisible();
  await expect(page.getByText('Эта услуга не соответствует текущему поиску.', { exact: false })).toHaveCount(3);
  await page.getByTestId('comparison-card').first().getByRole('button', { name: 'Убрать из сравнения', exact: true }).click();
  await expect(page.getByTestId('comparison-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Очистить сравнение', exact: true }).click();
  await expect(page.getByTestId('comparison-card')).toHaveCount(0);
});

test('profile return preserves input, sort, compare, scroll and focus on the same offer', async ({ page }) => {
  await open(page, { ...base, sort: 'price' });
  await page.getByTestId('specialist-card').first().getByRole('button', { name: 'Сравнить', exact: true }).click();
  const profile = page.locator('#profile-O23');
  await profile.scrollIntoViewIfNeeded();
  const position = await page.evaluate(() => window.scrollY);
  await profile.click();
  await expect(page).toHaveURL('/specialists/S12?offer=O23');
  await expect(page.locator('[data-offer-id="O23"]')).toBeVisible();
  await page.getByRole('button', { name: 'Вернуться к выдаче', exact: true }).click();
  await expect(page.locator('#profile-O23')).toBeFocused();
  await expectResult(page, { ...base, sort: 'price' });
  expect(Math.abs(await page.evaluate(() => window.scrollY) - position)).toBeLessThan(8);
  await expect(page.locator('.compare-tray')).toContainText('1/3');
});

for (const locale of ['ru', 'kk'] as const) {
  test(`${locale}: keyboard focus trap, mobile/landscape reflow, no numeric ratings`, async ({ page }) => {
    await open(page, example, locale);
    if (locale === 'kk') await page.getByRole('button', { name: 'Қаз', exact: true }).click();
    await page.setViewportSize({ width: 320, height: 740 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('#filters-open').focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    for (let index = 0; index < 28; index++) {
      await page.keyboard.press(index % 2 ? 'Shift+Tab' : 'Tab');
      expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
    }
    await dialog.locator('#filter-format').selectOption('online');
    await dialog.locator('#filter-budget').fill('7000');
    for (const viewport of [{ width: 320, height: 740 }, { width: 844, height: 390 }]) {
      await page.setViewportSize(viewport);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
      await expect(dialog.getByRole('button', { name: locale === 'ru' ? 'Применить' : 'Қолдану', exact: true })).toBeInViewport();
    }
    await page.keyboard.press('Escape');
    await expect(page.locator('#filters-open')).toBeFocused();
    await expectResult(page, example, locale);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    expect(await page.getByTestId('specialist-card').allTextContents()).not.toEqual(expect.arrayContaining([expect.stringMatching(/\d+\s*%|★/u)]));
  });
}

test('rapid text edits end with the newest input; 80-character limit is enforced', async ({ page }) => {
  await open(page);
  for (const query of ['логопед', 'психолог', 'никаких совпадений', 'Демо-специалист 01']) await page.locator('#query').fill(query);
  await expectResult(page, { ...base, query: 'Демо-специалист 01' });
  await page.locator('#query').fill('я'.repeat(100));
  await expect(page.locator('#query')).toHaveValue('я'.repeat(80));
  await expectResult(page, { ...base, query: 'я'.repeat(80) });
});

test('loading reserves cards; corrupted fixtures show error and Retry reloads validated data', async ({ page }) => {
  let release: (() => void) | undefined;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let corrupted = true;
  await page.route('**/src/data/catalog.json', async route => {
    await gate;
    await route.fulfill({ contentType: 'application/json', body: corrupted ? '{"catalogVersion":"broken"}' : JSON.stringify(raw) });
  });
  await page.goto('/specialists');
  await expect(page.getByRole('status')).toHaveText('Загружаем демонстрационный каталог…');
  await expect(page.locator('.loading-card')).toHaveCount(3);
  release!();
  await expect(page.getByRole('alert')).toContainText('Не удалось загрузить демонстрационный каталог');
  await expect(page.getByTestId('specialist-card')).toHaveCount(0);
  corrupted = false;
  await page.getByRole('button', { name: 'Попробовать снова', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expectResult(page, base);
});

test('empty opener can disappear after Apply and focus still returns to filters', async ({ page }) => {
  await open(page, { ...base, budgetKzt: 0, budgetHard: true });
  await page.getByRole('button', { name: 'Изменить предпочтения и условия', exact: true }).click();
  await page.getByRole('button', { name: 'Сбросить черновик', exact: true }).click();
  await page.getByRole('button', { name: 'Применить', exact: true }).click();
  await expectResult(page, base);
  await expect(page.locator('#filters-open')).toBeFocused();
});

test('direct profile has neutral explanations; mismatched public IDs never substitute another offer', async ({ page }) => {
  await page.goto('/specialists/S01?offer=O01');
  await expect(page.locator('[data-offer-id="O01"]')).toBeVisible();
  await expect(page.locator('[data-reason]')).toHaveCount(0);
  await expect(page.getByText('Условия подбора не заданы;', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Совпало с вашими условиями', exact: true })).toHaveCount(0);
  await page.goto('/specialists/S01?offer=O02');
  await expect(page.getByRole('heading', { name: 'Услуга не найдена или недоступна' })).toBeVisible();
  await expect(page.locator('[data-offer-id]')).toHaveCount(0);
});

test('compare offer replacement is explicit and a fourth addition also reports the limit inside a profile', async ({ page }) => {
  await open(page);
  await page.locator('#query').fill('Демо-специалист 12');
  await page.getByTestId('specialist-card').getByRole('button', { name: 'Сравнить', exact: true }).click();
  await expect(page.locator('.compare-selected')).toContainText('O12');
  await page.locator('#sort').selectOption('price');
  await expect(page.getByTestId('specialist-card')).toHaveAttribute('data-offer-id', 'O23');
  await expect(page.locator('.compare-selected')).toContainText('O12');
  await page.getByRole('button', { name: 'Сравнить эту услугу вместо прежней', exact: true }).click();
  await expect(page.locator('.compare-selected')).toContainText('O23');
  await expect(page.locator('.compare-tray')).toContainText('1/3');
  await page.locator('#query').fill('');
  for (const offerId of ['O06', 'O16']) await page.getByTestId('specialist-card').filter({ has: page.locator(`#profile-${offerId}`) }).getByRole('button', { name: 'Сравнить', exact: true }).click();
  await page.locator('#profile-O01').click();
  await expect(page.getByTestId('selected-offer')).toHaveAttribute('data-offer-id', 'O01');
  await page.getByRole('button', { name: 'Сравнить', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Можно сравнить до трёх специалистов');
  await page.getByRole('button', { name: 'Вернуться к выдаче', exact: true }).click();
  await expect(page.locator('.compare-tray')).toContainText('3/3');
});
