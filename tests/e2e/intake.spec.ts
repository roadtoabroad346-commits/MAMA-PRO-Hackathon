import { expect, test, type Page } from '@playwright/test';
import { catalogSchema } from '../../src/domain/catalog';
import rawCatalog from '../../src/data/catalog.json' with { type: 'json' };
import { SearchService } from '../../src/domain/SearchService';
import { emptySearchInput, type SearchInput } from '../../src/domain/contracts';

const service = new SearchService(catalogSchema.parse(rawCatalog));
const base = emptySearchInput();
async function snapshot(page: Page): Promise<{ input: SearchInput; step: number }> {
  return page.evaluate(() => JSON.parse(sessionStorage.getItem('qoldau.demo-search')!));
}
async function goToConditions(page: Page) {
  await page.goto('/route');
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Далее', exact: true }).click();
}
async function exampleA(page: Page) {
  await page.goto('/');
  await page.getByRole('link', { name: 'Помогите начать', exact: true }).click();
  await page.getByRole('radio', { name: 'Речь и общение', exact: true }).check();
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
  await page.getByRole('radio', { name: '3–5 лет', exact: true }).check();
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
  await page.getByRole('radio', { name: 'Казахский', exact: true }).check();
  await page.getByRole('radio', { name: 'Очно', exact: true }).check();
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
  await page.getByLabel('Район', { exact: true }).selectOption('BOSTANDYK');
  await page.getByLabel('Бюджет за одно занятие, ₸', { exact: true }).fill('6000');
  await page.getByRole('checkbox', { name: 'Предпочесть актуально указанную готовность к обращению', exact: true }).check();
  await page.getByRole('button', { name: 'Посмотреть мой маршрут', exact: true }).click();
}

test('all steps can be skipped; null is preserved through review, reload and catalog', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByText('Без регистрации. Можно пропустить любой вопрос.')).toBeVisible();
  await page.getByRole('link', { name: 'Помогите начать', exact: true }).click();
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Пропустить шаг', exact: true }).click();
  await expect(page).toHaveURL('/route/review');
  await expect(page.locator('[data-field="budgetKzt"]')).toContainText('Не задано');
  await expect(page.getByTestId('search-count')).toHaveText('Специалистов: 12. Услуг: 20.');
  expect((await snapshot(page)).input).toEqual(base);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Ваши условия поиска' })).toBeVisible();
  expect((await snapshot(page)).input).toEqual(base);
  await page.getByRole('link', { name: 'Показать варианты', exact: true }).click();
  await expect(page.getByTestId('specialist-card')).toHaveCount(12);
  await expect(page.getByText('Общий каталог. Персональные параметры не заданы.')).toBeVisible();
  expect(errors).toEqual([]);
});

test('direct path works without intake and supports category/name search', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Я знаю, кого ищу', exact: true }).click();
  await expect(page.getByTestId('specialist-card')).toHaveCount(12);
  await page.getByLabel('Категория специалиста', { exact: true }).selectOption('LOGOPED');
  await page.getByLabel('Имя или категория', { exact: true }).fill('Демо-специалист 01');
  await expect(page.getByTestId('specialist-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'Ваши условия поиска', exact: true }).click();
  await expect(page.locator('[data-field="query"]')).toContainText('Демо-специалист 01');
  await expect(page.locator('[data-field="categoryIds"]')).toContainText('Логопед');
  await expect(page).toHaveURL('/route/review');
});

test('review matches complete SearchInput; count equals catalog; locale, Back and editing preserve state', async ({ page }) => {
  const urls: string[] = [];
  page.on('framenavigated', frame => { if (frame === page.mainFrame()) urls.push(frame.url()); });
  await exampleA(page);
  const input = (await snapshot(page)).input;
  expect(input).toEqual({ ...base, needTag: 'speech', ageGroup: 'AGE_3_5', serviceLanguage: 'kk', format: 'offline',
    budgetKzt: 6000, districtId: 'BOSTANDYK', availabilityPreferred: true });
  const result = service.search(input);
  await expect(page.getByTestId('search-count')).toHaveText(`Специалистов: ${result.specialistCount}. Услуг: ${result.eligibleOfferCount}.`);
  for (const [field, value, mode] of [
    ['needTag', 'Речь и общение', 'Предпочтение'], ['ageGroup', '3–5 лет', 'Обязательное условие'],
    ['serviceLanguage', 'Казахский', 'Обязательное условие'], ['format', 'Очно', 'Обязательное условие'],
    ['districtId', 'Бостандыкский', 'Предпочтение'], ['budgetKzt', '6 000 ₸', 'Предпочтение'],
  ]) {
    const row = page.locator(`[data-field="${field}"]`);
    await expect(row).toContainText(value);
    await expect(row).toContainText(mode);
  }
  await page.getByRole('button', { name: 'Қаз', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'kk');
  await expect(page.getByRole('heading', { name: 'Сіздің іздеу шарттарыңыз', exact: true })).toBeVisible();
  expect((await snapshot(page)).input).toEqual(input);
  await page.reload();
  await expect(page.locator('[data-field="serviceLanguage"]')).toContainText('Қазақша');
  expect((await snapshot(page)).input).toEqual(input);
  await page.getByRole('button', { name: 'Рус', exact: true }).click();
  await page.getByRole('link', { name: 'Показать варианты', exact: true }).click();
  await expect(page.getByTestId('specialist-card')).toHaveCount(result.specialistCount);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Ваши условия поиска' })).toBeVisible();
  await page.getByRole('link', { name: 'Изменить: Бюджет за одно занятие, ₸', exact: true }).click();
  await expect(page.getByLabel('Бюджет за одно занятие, ₸', { exact: true })).toHaveValue('6000');
  await page.getByLabel('Бюджет за одно занятие, ₸', { exact: true }).fill('1000');
  await page.getByRole('radio', { name: 'Строгий максимум', exact: true }).check();
  await page.getByRole('button', { name: 'Посмотреть мой маршрут', exact: true }).click();
  await expect(page.getByTestId('search-count')).toHaveText('Специалистов: 0. Услуг: 0.');
  await expect(page.locator('[data-field="budgetKzt"]')).toContainText('Обязательное условие');
  expect((await snapshot(page)).input).toEqual({ ...input, budgetKzt: 1000, budgetHard: true });
  await page.getByRole('link', { name: 'Показать варианты', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Точных вариантов по этому поиску нет' })).toBeVisible();
  expect(urls.every(url => !new URL(url).search)).toBe(true);
  expect(await page.evaluate(() => JSON.stringify(history.state))).not.toContain('1000');
});

test('Back and browser history preserve answers including invalid numeric draft; language does not change domain', async ({ page }) => {
  await goToConditions(page);
  const budget = page.getByLabel('Бюджет за одно занятие, ₸', { exact: true });
  await budget.fill('oops');
  await page.getByRole('button', { name: 'Назад', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Как удобнее заниматься?' })).toBeVisible();
  await page.getByRole('radio', { name: 'Русский', exact: true }).check();
  await page.getByRole('button', { name: 'Қаз', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Орысша', exact: true })).toBeChecked();
  expect((await snapshot(page)).input.serviceLanguage).toBe('ru');
  await page.getByRole('button', { name: 'Келесі', exact: true }).click();
  await expect(page.locator('#budget')).toHaveValue('oops');
  await page.getByRole('button', { name: 'Іздеу шарттарымды қарау', exact: true }).click();
  await expect(page.locator('#budget-error')).toContainText('бүтін соманы');
  await expect(page.locator('#budget')).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('radio', { name: 'Орысша', exact: true })).toBeChecked();
  await page.goForward();
  await expect(page.locator('#budget')).toHaveValue('oops');
});

test('budget validates all boundaries, preserves invalid input, accepts zero, supports skip', async ({ page }) => {
  await goToConditions(page);
  const budget = page.locator('#budget');
  for (const [value, message] of [['-1', 'отрицательной'], ['100001', 'Максимум'], ['2.5', 'целую сумму'], ['abc', 'целую сумму']]) {
    await budget.fill(value);
    await page.getByRole('button', { name: 'Посмотреть мой маршрут', exact: true }).click();
    await expect(page.locator('#budget-error')).toContainText(message);
    await expect(budget).toHaveValue(value);
    await expect(budget).toBeFocused();
    await expect(page).toHaveURL('/route');
  }
  await budget.fill('100000');
  await page.getByRole('button', { name: 'Посмотреть мой маршрут', exact: true }).click();
  await expect(page.locator('[data-field="budgetKzt"]')).toContainText('100 000 ₸');
  await page.getByRole('link', { name: 'Изменить: Бюджет за одно занятие, ₸', exact: true }).click();
  await budget.fill('0');
  await page.getByRole('radio', { name: 'Строгий максимум', exact: true }).check();
  await page.getByRole('button', { name: 'Посмотреть мой маршрут', exact: true }).click();
  expect((await snapshot(page)).input.budgetKzt).toBe(0);
  await expect(page.locator('[data-field="budgetKzt"]')).toContainText('0 ₸');
  await page.getByRole('link', { name: 'Изменить: Бюджет за одно занятие, ₸', exact: true }).click();
  await page.getByRole('button', { name: 'Пропустить шаг', exact: true }).click();
  expect((await snapshot(page)).input.budgetKzt).toBeNull();
  await expect(page.locator('[data-field="budgetKzt"]')).toContainText('Не задано');
});

test('reload restores step and answers; expired/corrupt state resets visibly', async ({ page }) => {
  await page.goto('/route');
  await page.getByRole('radio', { name: 'Речь и общение', exact: true }).check();
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Какая возрастная группа?' })).toBeVisible();
  expect((await snapshot(page)).input.needTag).toBe('speech');
  await page.evaluate(() => {
    const data = JSON.parse(sessionStorage.getItem('qoldau.demo-search')!);
    data.expiresAt = Date.now() - 1;
    sessionStorage.setItem('qoldau.demo-search', JSON.stringify(data));
  });
  await page.reload();
  await expect(page.getByText('Сохранённый демопоиск устарел или повреждён.', { exact: false })).toBeVisible();
  expect((await snapshot(page)).input).toEqual(base);
  await page.evaluate(() => sessionStorage.setItem('qoldau.demo-search', '{broken'));
  await page.reload();
  await expect(page.getByText('Сохранённый демопоиск устарел или повреждён.', { exact: false })).toBeVisible();
});

test('unavailable sessionStorage uses memory with an honest warning; flow remains usable', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('denied', 'SecurityError'); } }));
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/route');
  await expect(page.getByText('Хранилище вкладки недоступно.', { exact: false })).toBeVisible();
  await page.getByRole('radio', { name: 'Речь и общение', exact: true }).check();
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
  await page.getByRole('button', { name: 'Назад', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Речь и общение', exact: true })).toBeChecked();
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Пропустить шаг', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Ваши условия поиска' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('KK filled route validates budget; category editing updates the same service count', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await page.getByRole('button', { name: 'Қаз', exact: true }).click();
  await page.getByRole('link', { name: 'Неден бастау керегін түсінуге көмектесіңіз', exact: true }).click();
  await page.getByRole('radio', { name: 'Сөйлеу және қарым-қатынас', exact: true }).check();
  await page.getByRole('button', { name: 'Келесі', exact: true }).click();
  await page.getByRole('radio', { name: '3–5 жас', exact: true }).check();
  await page.getByRole('button', { name: 'Келесі', exact: true }).click();
  await page.getByRole('radio', { name: 'Қазақша', exact: true }).check();
  await page.getByRole('radio', { name: 'Онлайн', exact: true }).check();
  await page.getByRole('button', { name: 'Келесі', exact: true }).click();
  await page.getByLabel('Аудан', { exact: true }).selectOption('BOSTANDYK');
  await expect(page.getByText('Онлайн форматта аудан ескерілмейді.', { exact: false })).toBeVisible();
  await page.locator('#budget').fill('-1');
  await page.getByRole('button', { name: 'Іздеу шарттарымды қарау', exact: true }).click();
  await expect(page.locator('#budget-error')).toContainText('теріс болмауы');
  await page.locator('#budget').fill('6000');
  await page.getByRole('button', { name: 'Іздеу шарттарымды қарау', exact: true }).click();
  await expect(page.locator('[data-field="districtId"]')).toContainText('Іздеуде қолданылмайды');
  await page.locator('details summary').click();
  await page.getByRole('checkbox', { name: 'Логопед', exact: true }).check();
  const input = (await snapshot(page)).input;
  expect(input.categoryIds).toEqual(['LOGOPED']);
  const result = service.search(input);
  await expect(page.getByTestId('search-count')).toHaveText(`Мамандар: ${result.specialistCount}. Қызметтер: ${result.eligibleOfferCount}.`);
  await page.getByRole('link', { name: 'Нұсқаларды көрсету', exact: true }).click();
  await expect(page.getByTestId('specialist-card')).toHaveCount(result.specialistCount);
  expect(requests.every(url => new URL(url).origin === 'http://127.0.0.1:5173')).toBe(true);
});

test('write failure and locale storage denial do not crash or silently promise persistence', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('quota', 'QuotaExceededError'); };
  });
  await page.goto('/route');
  await expect(page.getByText('Хранилище вкладки недоступно.', { exact: false })).toBeVisible();
  await page.getByRole('radio', { name: 'Речь и общение', exact: true }).check();
  await page.getByRole('button', { name: 'Қаз', exact: true }).click();
  await expect(page.getByText('Интерфейс тілі жұмыс істейді', { exact: false })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Сөйлеу және қарым-қатынас', exact: true })).toBeChecked();
});

test('keyboard reaches both entry paths and completes wizard; native radio arrows work', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Помогите начать', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Я знаю, кого ищу', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Что вы хотите уточнить?', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('radio', { name: 'Пока не уверен(а)', exact: true })).toBeFocused();
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('radio', { name: 'Речь и общение', exact: true })).toBeChecked();
  // Tab: Back → Next → Skip. Enter activates Skip on each step.
  for (let step = 1; step <= 4; step++) {
    for (let i = 0; i < 30; i++) {
      if (await page.getByRole('button', { name: 'Пропустить шаг', exact: true }).evaluate(el => el === document.activeElement)) break;
      await page.keyboard.press('Tab');
    }
    await expect(page.getByRole('button', { name: 'Пропустить шаг', exact: true })).toBeFocused();
    const outline = await page.getByRole('button', { name: 'Пропустить шаг', exact: true }).evaluate(el => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe('none');
    await page.keyboard.press('Enter');
    if (step < 4) await expect(page.locator('h1')).toBeFocused();
  }
  await expect(page.getByRole('heading', { name: 'Ваши условия поиска' })).toBeFocused();
});

for (const locale of ['ru', 'kk'] as const) {
  test(`${locale}: no personal fields, mobile reflow and reduced motion`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: locale === 'ru' ? 'Рус' : 'Қаз', exact: true }).click();
    await page.setViewportSize({ width: 320, height: 700 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('link', { name: locale === 'ru' ? 'Помогите начать' : 'Неден бастау керегін түсінуге көмектесіңіз', exact: true }).click();
    const titles = locale === 'ru'
      ? ['Что вы хотите уточнить?', 'Какая возрастная группа?', 'Как удобнее заниматься?', 'Какие условия важны?']
      : ['Нені нақтылағыңыз келеді?', 'Баланың жас тобы қандай?', 'Қалай қатысқан ыңғайлы?', 'Қандай шарттар маңызды?'];
    for (let step = 1; step <= 4; step++) {
      await expect(page.locator('h1')).toHaveText(titles[step - 1]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await expect(page.locator('input:not([type="radio"]):not([type="checkbox"]), textarea')).toHaveCount(step === 4 ? 1 : 0);
      await page.getByRole('button', { name: locale === 'ru' ? 'Пропустить шаг' : 'Қадамды өткізіп жіберу', exact: true }).click();
    }
    await expect(page.locator('h1')).toHaveText(locale === 'ru' ? 'Ваши условия поиска' : 'Сіздің іздеу шарттарыңыз');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await page.getByRole('link', { name: locale === 'ru' ? 'Показать варианты' : 'Нұсқаларды көрсету', exact: true }).click();
    await expect(page.getByTestId('specialist-card')).toHaveCount(12);
  });
}
