import { expect, test, type Page } from '@playwright/test';
import raw from '../../src/data/catalog.json' with { type: 'json' };
import { emptySearchInput, type SearchInput } from '../../src/domain/contracts';

async function seed(page: Page, input: SearchInput = emptySearchInput(), locale: 'ru' | 'kk' = 'ru') {
  await page.addInitScript(({ input, locale }) => {
    sessionStorage.setItem('qoldau.demo-search', JSON.stringify({ schemaVersion: 1, catalogVersion: 'catalog-v2', expiresAt: Date.now() + 7200000, input, step: 1 }));
    localStorage.setItem('qoldau.locale', locale);
  }, { input, locale });
}
async function fixture(page: Page, data: unknown) {
  await page.route('**/src/data/catalog.json', route => route.fulfill({ json: data }));
}
const selected = (page: Page) => page.getByTestId('selected-offer');

test('profile without offer selects a stable public service; changing it updates all facts and URL', async ({ page }) => {
  await page.goto('/specialists/S12');
  await expect(selected(page)).toHaveAttribute('data-offer-id', 'O12');
  await expect(page.getByRole('radio')).toHaveCount(3);
  await expect(page.getByText('Фото не предоставлено', { exact: true })).toBeVisible();
  await expect(page.locator('.profile-header')).toContainText('Логопед, Психолог');
  await page.locator('input[value="O23"]').check();
  await expect(selected(page)).toHaveAttribute('data-offer-id', 'O23');
  await expect(selected(page).locator('.price')).toHaveText(/4\s?500 ₸ · 45 мин/u);
  await expect(selected(page)).toContainText('3–9 лет (включительно)');
  await page.locator('input[value="O24"]').check();
  await expect(page).toHaveURL('/specialists/S12?offer=O24');
  await expect(selected(page).locator('.price')).toHaveText(/9\s?500 ₸ · 45 мин/u);
  await expect(selected(page).locator('.offer-facts')).toContainText('Казахский');
  await expect(selected(page).locator('.offer-facts')).toContainText('Онлайн');
  await expect(page.locator('[data-trust-scope="offer_data"]')).toHaveAttribute('data-trust-offer-id', 'O24');
  await expect(page.locator('[data-reason]')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('input[value="O24"]')).toBeChecked();
  await expect(selected(page)).toHaveAttribute('data-offer-id', 'O24');
});

test('switching to an incompatible offer removes old reasons and preserves the exact request/compare selection', async ({ page }) => {
  await seed(page, { ...emptySearchInput(), ageGroup: 'AGE_6_9', serviceLanguage: 'kk', format: 'offline' });
  await page.goto('/specialists');
  await page.locator('#profile-O06').click();
  await expect(selected(page)).toHaveAttribute('data-offer-id', 'O06');
  await expect(page.locator('[data-reason="LANGUAGE_MATCH"]')).toBeVisible();
  await selected(page).getByRole('button', { name: 'Сравнить', exact: true }).click();
  await page.locator('input[value="O15"]').check();
  await expect(selected(page)).toHaveAttribute('data-offer-id', 'O15');
  await expect(page.locator('[data-reason]')).toHaveCount(0);
  await expect(selected(page)).toContainText('не соответствует текущему поиску');
  await expect(selected(page).locator('.price')).toHaveText(/4\s?300 ₸ · 30 мин/u);
  await expect(selected(page).locator('.offer-facts')).toContainText('Русский');
  await expect(selected(page).locator('.offer-facts')).toContainText('Онлайн');
  await expect(selected(page)).toContainText('6–14 лет (включительно)');
  await expect(selected(page).getByRole('button', { name: 'Создать демозапрос', exact: true })).toBeDisabled();
  await selected(page).getByRole('button', { name: 'Сравнить эту услугу вместо прежней', exact: true }).click();
  await page.getByRole('link', { name: /Открыть сравнение/u }).click();
  await expect(page.getByTestId('comparison-card')).toHaveAttribute('data-offer-id', 'O15');
  await page.goBack();
  await page.getByRole('checkbox').check();
  await page.locator('#create-demo-request').click();
  await expect(page).toHaveURL('/request/O15');
  await expect(page.getByTestId('request-offer')).toHaveAttribute('data-specialist-id', 'S06');
  await expect(page.getByTestId('request-offer')).toHaveAttribute('data-offer-id', 'O15');
  await expect(page.getByText('Демонстрация: реальное сообщение не отправляется и запись не создаётся.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Вернуться к выбранной услуге', exact: true }).click();
  await expect(page.locator('input[value="O15"]')).toBeChecked();
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await page.locator('input[value="O06"]').check();
  await expect(page.locator('[data-reason="LANGUAGE_MATCH"]')).toBeVisible();
  await page.locator('input[value="O15"]').check();
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await page.getByRole('button', { name: 'Вернуться к выдаче', exact: true }).click();
  await expect(page).toHaveURL('/specialists');
  await expect(page.locator('#profile-O06')).toBeFocused();
  await expect(page.locator('.compare-selected')).toContainText('O15');
  await page.goto('/request/O15');
  await page.reload();
  await expect(page.getByTestId('request-offer')).toHaveAttribute('data-offer-id', 'O15');
});

test('unknown age disappears only when another offer supplies it', async ({ page }) => {
  await seed(page, { ...emptySearchInput(), ageGroup: 'AGE_3_5' });
  await page.goto('/specialists');
  await page.locator('#profile-O16').click();
  await page.locator('input[value="O07"]').check();
  await expect(page.locator('[data-unknown="AGE_UNKNOWN"]')).toBeVisible();
  await page.locator('input[value="O16"]').check();
  await expect(page.locator('[data-unknown="AGE_UNKNOWN"]')).toHaveCount(0);
  await expect(page.locator('[data-reason="AGE_MATCH"]')).toBeVisible();
  await page.locator('input[value="O07"]').check();
  await expect(page.locator('[data-unknown="AGE_UNKNOWN"]')).toBeVisible();
  await expect(page.locator('[data-reason="AGE_MATCH"]')).toHaveCount(0);
});

test('deep link stays neutral even if this tab has search conditions', async ({ page }) => {
  await seed(page, { ...emptySearchInput(), serviceLanguage: 'kk', format: 'offline', ageGroup: 'AGE_3_5' });
  await page.goto('/specialists/S12?offer=O24');
  await expect(selected(page)).toHaveAttribute('data-offer-id', 'O24');
  await expect(page.locator('[data-reason]')).toHaveCount(0);
  await expect(selected(page)).toContainText('Условия подбора не заданы');
  await expect(page.getByRole('checkbox')).toHaveCount(0);
});

test('unknown and mismatched IDs show clear not found; hidden offers and profiles cannot be opened', async ({ page }) => {
  const data = structuredClone(raw);
  data.offers.find(o => o.id === 'O23')!.publicationStatus = 'hidden';
  data.specialists.find(s => s.id === 'S01')!.publicationStatus = 'hidden';
  await fixture(page, data);
  for (const url of ['/specialists/missing', '/specialists/S01?offer=O01', '/specialists/S12?offer=O01', '/specialists/S12?offer=O23', '/specialists/S12?offer=', '/request/O23', '/request/O01', '/request/missing']) {
    await page.goto(url);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/не найден/u);
    await expect(page.locator('[data-offer-id]')).toHaveCount(0);
    await expect(page.locator('#create-demo-request')).toHaveCount(0);
  }
  await page.goto('/specialists/S12');
  await expect(page.getByRole('radio')).toHaveCount(2);
  await expect(page.locator('input[value="O23"]')).toHaveCount(0);
});

test('passport keeps identity, education, contact and offer data separate with explicit evidence limits', async ({ page }) => {
  await page.goto('/specialists/S01?offer=O01');
  const passport = page.getByRole('region', { name: 'Паспорт доверия', exact: true });
  const education = passport.locator('[data-trust-scope="education"]');
  await expect(education).toContainText('Документ просмотрен');
  await expect(education).toContainText('Синтетический документ об образовании');
  await expect(education).toContainText('13 нояб. 2026');
  await expect(education).toContainText('Просмотр документа не подтверждает его подлинность');
  for (const scope of ['identity', 'contact']) {
    const fact = passport.locator(`[data-trust-scope="${scope}"]`);
    await expect(fact).toContainText('Не проверено');
    await expect(fact).toContainText('Источник не указан');
    await expect(fact).toContainText('Дата не указана');
  }
  await expect(passport.locator('[data-trust-field="languages"]')).toContainText('Со слов специалиста');
  await expect(passport.locator('[data-trust-field="languages"]')).toContainText('Только поле «Язык занятий» услуги O01');
  await expect(passport.getByText('Подтверждено источником', { exact: true })).toHaveCount(0);
  await expect(page.locator('.badge')).not.toContainText(['Одобрено фондом']);
});

test('partial profile and missing verification remain unknown; unknown and stale prices are explicit', async ({ page }) => {
  await page.goto('/specialists/S08?offer=O08');
  await expect(page.locator('[data-unknown="LANGUAGE_UNKNOWN"]')).toBeVisible();
  await expect(page.locator('[data-trust-field="languages"]')).toContainText('Не проверено');
  await expect(page.locator('[data-trust-scope="education"]')).toContainText('Факт проверки этого раздела не представлен');
  await page.goto('/specialists/S09?offer=O09');
  await expect(selected(page).locator('.price')).toContainText('Цена не указана');
  await expect(selected(page)).toContainText('Дата сведений о цене не указана');
  await expect(page.locator('[data-unknown="BUDGET_UNKNOWN"]')).toBeVisible();
  await page.goto('/specialists/S11?offer=O11');
  await expect(selected(page)).toContainText('Цена требует уточнения');
  await expect(page.locator('[data-trust-field="price"]')).toContainText('Сведения устарели');
  await expect(page.locator('[data-unknown="BUDGET_STALE"]')).toBeVisible();
});

test('expired/future/revoked evidence cannot appear as current source confirmation; private data is never rendered', async ({ page }) => {
  const data = structuredClone(raw);
  const base = data.specialists[0].verificationFacts[0];
  const facts = [
    { ...base, scope: 'identity', status: 'SOURCE_CONFIRMED', sourceLabel: { ru: 'Синтетический источник личности', kk: 'Жеке бастың синтетикалық дереккөзі' }, reviewDueAt: '2026-10-01T00:00:00Z' },
    { ...base, scope: 'contact', status: 'SOURCE_CONFIRMED', checkedAt: '2026-11-15T00:00:00Z' },
    { ...base, scope: 'education', status: 'REVOKED' },
  ];
  Object.assign(data.specialists[0], { verificationFacts: facts, documentNumber: 'PRIVATE-DOC-123', scanUrl: 'https://private.invalid/scan', internalNotes: 'PRIVATE-NOTE-456' });
  await fixture(page, data);
  await page.goto('/specialists/S01?offer=O01');
  await expect(page.locator('[data-trust-scope="identity"]')).toContainText('Сведения устарели');
  await expect(page.locator('[data-trust-scope="contact"]')).toContainText('Не проверено');
  await expect(page.locator('[data-trust-scope="contact"]')).toContainText('Дата проверки ещё не наступила');
  await expect(page.locator('[data-trust-scope="education"]')).toContainText('Проверка отозвана');
  await expect(page.getByText('Подтверждено источником', { exact: true })).toHaveCount(0);
  expect(await page.locator('body').innerText()).not.toMatch(/PRIVATE-DOC|PRIVATE-NOTE|private.invalid/u);
  await expect(page.locator('a[href*="private.invalid"], img[src*="private.invalid"]')).toHaveCount(0);
});

test('source confirmation remains scoped to its exact offer when switching', async ({ page }) => {
  const data = structuredClone(raw);
  Object.assign(data.specialists.find(s => s.id === 'S06')!, { verificationFacts: [{
    ...data.specialists[0].verificationFacts[0], scope: 'offer_data', offerId: 'O06', status: 'SOURCE_CONFIRMED',
    sourceLabel: { ru: 'Синтетический источник условий O06', kk: 'O06 шарттарының синтетикалық дереккөзі' },
    evidenceSummary: { ru: 'Только длительность O06', kk: 'Тек O06 ұзақтығы' },
  }] });
  await fixture(page, data);
  await page.goto('/specialists/S06?offer=O06');
  await expect(page.locator('[data-trust-scope="offer_data"]')).toContainText('Подтверждено источником');
  await page.locator('input[value="O15"]').check();
  await expect(page.locator('[data-trust-scope="offer_data"]')).not.toContainText('Подтверждено источником');
  await expect(page.locator('[data-trust-scope="offer_data"]')).not.toContainText('Только длительность O06');
});

test('missing approach and partial service facts remain explicit; free consultation keeps its own unit', async ({ page }) => {
  const data = structuredClone(raw);
  Object.assign(data.specialists.find(s => s.id === 'S08')!, { bio: null });
  Object.assign(data.offers.find(o => o.id === 'O08')!, {
    ageMinMonths: null, format: 'unknown', districtId: null, priceKind: 'free', priceAmountKzt: 0,
    durationMinutes: null, unit: 'consultation', acceptingEnquiries: null, availabilityConfirmedAt: null,
  });
  await fixture(page, data);
  await page.goto('/specialists/S08?offer=O08');
  await expect(page.getByText('Описание подхода не предоставлено.', { exact: true })).toBeVisible();
  await expect(selected(page).locator('.price')).toHaveText('Бесплатно · Демо · Длительность не указана');
  await expect(selected(page).getByText('Консультация', { exact: true })).toBeVisible();
  await expect(selected(page)).toContainText('Возрастной диапазон указан не полностью');
  for (const factor of ['AGE', 'LANGUAGE', 'FORMAT', 'AVAILABILITY']) await expect(page.locator(`[data-unknown="${factor}_UNKNOWN"]`)).toBeVisible();
  await expect(page.locator('[data-trust-field="ageRange"]')).toContainText('Не проверено');
  await expect(page.locator('[data-trust-field="format"]')).toContainText('Не проверено');
});

test('changing RU/KK inside a profile preserves offer, comparison and request target', async ({ page }) => {
  await page.goto('/specialists/S06?offer=O15');
  await selected(page).getByRole('button', { name: 'Сравнить', exact: true }).click();
  await page.getByRole('button', { name: 'Қаз', exact: true }).click();
  await expect(page.locator('input[value="O15"]')).toBeChecked();
  await expect(selected(page)).toContainText('Орысша');
  await expect(page.locator('[data-trust-field="languages"]')).toContainText('Маманның синтетикалық сауалнамасы');
  await expect(selected(page).getByRole('button', { name: 'Салыстырудан алып тастау', exact: true })).toBeVisible();
  await expect(page.locator('#create-demo-request')).toHaveAttribute('href', '/request/O15');
  await page.getByRole('button', { name: 'Рус', exact: true }).click();
  await expect(selected(page).getByRole('button', { name: 'Убрать из сравнения', exact: true })).toBeVisible();
  await expect(page.locator('input[value="O15"]')).toBeChecked();
});

for (const locale of ['ru', 'kk'] as const) {
  test(`${locale}: long name, reflow320, text200, landscape and keyboard service/request/Back`, async ({ page }) => {
    const data = structuredClone(raw);
    data.specialists.find(s => s.id === 'S12')!.displayName = { ru: 'Вымышленный специалист с очень длинным публичным именем для проверки переноса текста', kk: 'Мәтіннің тасымалдануын тексеруге арналған өте ұзын жария аты бар ойдан шығарылған маман' };
    await fixture(page, data);
    await seed(page, emptySearchInput(), locale);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto('/specialists/S12?offer=O12');
    const first = page.locator('input[value="O12"]');
    await first.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('input[value="O23"]')).toBeChecked();
    await expect(page.locator('input[value="O23"]')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('input[value="O24"]')).toBeFocused();
    for (const width of [320, 844]) {
      await page.setViewportSize({ width, height: width === 320 ? 740 : 390 });
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    }
    await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
    await page.locator('#create-demo-request').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/request/O24');
    await expect(page.getByTestId('request-offer')).toContainText('O24');
    await page.goBack();
    await expect(page.locator('input[value="O24"]')).toBeChecked();
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  });
}
