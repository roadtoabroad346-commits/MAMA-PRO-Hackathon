import { expect, test, type Page } from '@playwright/test';
import manifest from '../../docs/DEMO_SCENARIOS.json' with { type: 'json' };
import raw from '../../src/data/catalog.json' with { type: 'json' };
import { catalogSchema } from '../../src/domain/catalog';
import { emptySearchInput, type SearchInput } from '../../src/domain/contracts';
import { SearchService } from '../../src/domain/SearchService';
import { categoryKeys, messages } from '../../src/i18n/messages';

const service = new SearchService(catalogSchema.parse(raw));
const snapshot = (page: Page) => page.evaluate(() => JSON.parse(sessionStorage.getItem('qoldau.demo-search')!));
const radio = (page: Page, name: string, value: string | null) => page.locator(`input[name="${name}"][value="${value ?? ''}"]`).check();

for (const locale of ['ru', 'kk'] as const) {
  const t = messages[locale];
  const count = (specialists: number, offers: number) => t.count.replace('{specialists}', String(specialists)).replace('{offers}', String(offers));
  test(`EXP-02 ${locale}: language and format preferences remain soft after editing and reload`, async ({ page }) => {
    await page.addInitScript(locale => localStorage.setItem('qoldau.locale', locale), locale);
    await page.goto('/route');
    for (let step = 1; step <= 2; step++) await page.getByRole('button', { name: t.skip, exact: true }).click();
    await radio(page, 'serviceLanguage', 'kk');
    await radio(page, 'format', 'online');
    await page.getByRole('checkbox', { name: t.required, exact: true }).nth(0).uncheck();
    await page.getByRole('checkbox', { name: t.required, exact: true }).nth(1).uncheck();
    await page.getByRole('button', { name: t.next, exact: true }).click();
    await radio(page, 'districtId', 'BOSTANDYK');
    await page.locator('#budget').fill('6000');
    await page.getByRole('checkbox', { name: t.availability, exact: true }).check();
    await page.getByRole('button', { name: t.reviewCta, exact: true }).click();
    const input = { ...emptySearchInput(), serviceLanguage: 'kk', languageHard: false, format: 'online', formatHard: false,
      districtId: 'BOSTANDYK', budgetKzt: 6000, availabilityPreferred: true } as SearchInput;
    expect((await snapshot(page)).intakeDraft).toEqual(input);
    for (const field of ['serviceLanguage', 'format', 'districtId', 'budgetKzt']) {
      await expect(page.locator(`[data-field="${field}"]`)).toContainText(t.preference);
    }
    await page.locator('[data-field="format"] .edit-link').click();
    await page.reload();
    await expect(page.getByRole('checkbox', { name: t.required, exact: true }).nth(0)).not.toBeChecked();
    await expect(page.getByRole('checkbox', { name: t.required, exact: true }).nth(1)).not.toBeChecked();
    await page.getByRole('button', { name: t.reviewCta, exact: true }).click();
    await expect(page.getByTestId('search-count')).toHaveText(count(12, 20));
    await page.getByRole('link', { name: t.show, exact: true }).click();
    await expect(page.getByTestId('search-count')).toHaveText(count(12, 20));
    expect((await snapshot(page)).input).toEqual(input);
  });
  for (const [name, scenario] of Object.entries(manifest.scenarios)) {
    test(`EXP-02 ${locale} ${name}: four-step draft, shared exact/incomplete counts and explicit apply`, async ({ page }) => {
      const input = scenario.input as SearchInput;
      const expected = service.search(input);
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(locale => localStorage.setItem('qoldau.locale', locale), locale);
      await page.goto('/route');
      await radio(page, 'needTag', input.needTag);
      await page.getByRole('button', { name: t.next, exact: true }).click();
      await radio(page, 'ageGroup', input.ageGroup);
      await page.getByRole('button', { name: t.next, exact: true }).click();
      await radio(page, 'serviceLanguage', input.serviceLanguage);
      await radio(page, 'format', input.format);
      await page.getByRole('button', { name: t.next, exact: true }).click();
      await radio(page, 'districtId', input.districtId);
      await page.locator('#budget').fill(String(input.budgetKzt));
      await page.getByRole('radio', { name: input.budgetHard ? t.budgetHard : t.budgetSoft, exact: true }).check();
      await page.getByRole('checkbox', { name: t.availability, exact: true }).setChecked(input.availabilityPreferred);
      await page.getByRole('button', { name: t.reviewCta, exact: true }).click();
      if (input.categoryIds.length) {
        await page.locator('.category-section summary').click();
        await page.getByRole('checkbox', { name: t[categoryKeys.LOGOPED], exact: true }).check();
      }
      await expect(page.getByTestId('search-count')).toHaveText(count(expected.specialistCount, expected.eligibleOfferCount));
      expect((await snapshot(page)).input).toEqual(emptySearchInput());
      expect((await snapshot(page)).intakeDraft).toEqual(input);
      await page.reload();
      await expect(page.getByTestId('search-count')).toHaveText(count(expected.specialistCount, expected.eligibleOfferCount));
      expect((await snapshot(page)).input).toEqual(emptySearchInput());
      expect((await snapshot(page)).intakeDraft).toEqual(input);
      await page.getByRole('link', { name: t.show, exact: true }).click();
      await expect(page.getByTestId('search-count')).toHaveText(count(expected.specialistCount, expected.eligibleOfferCount));
      expect(await page.getByTestId('specialist-card').evaluateAll(cards => cards.map(card => card.getAttribute('data-offer-id')))).toEqual(scenario.expectedExact);
      expect((await snapshot(page)).input).toEqual(input);
      await page.reload();
      await expect(page.getByTestId('specialist-card')).toHaveCount(expected.specialistCount);
      await page.getByRole('button', { name: t.showIncomplete.replace('{count}', String(expected.incompleteSpecialistCount)), exact: true }).click();
      await expect(page.getByTestId('incomplete-card')).toHaveCount(expected.incompleteSpecialistCount);
      expect(await page.getByTestId('incomplete-card').evaluateAll(cards => cards.map(card => card.getAttribute('data-offer-id')))).toEqual(scenario.expectedIncomplete);
      await expect(page.getByTestId('incomplete-count')).toHaveText(t.incompleteCount.replace('{specialists}', String(expected.incompleteSpecialistCount)).replace('{offers}', String(expected.incompleteOfferCount)));
      await page.goBack();
      await expect(page).toHaveURL('/route/review');
      await expect(page.getByTestId('search-count')).toHaveText(count(expected.specialistCount, expected.eligibleOfferCount));
      expect((await snapshot(page)).intakeDraft).toEqual(input);
      expect(errors).toEqual([]);
    });
  }

  test(`EXP-02 ${locale}: invalid budget blocks review apply and keeps other answers through history`, async ({ page }) => {
    await page.addInitScript(locale => localStorage.setItem('qoldau.locale', locale), locale);
    await page.goto('/route');
    await radio(page, 'needTag', 'learning');
    await page.getByRole('button', { name: t.next, exact: true }).click();
    await radio(page, 'ageGroup', 'AGE_6_9');
    await page.getByRole('button', { name: t.next, exact: true }).click();
    await radio(page, 'serviceLanguage', 'kk');
    await radio(page, 'format', 'offline');
    await page.getByRole('button', { name: t.next, exact: true }).click();
    await radio(page, 'districtId', 'AUEZOV');
    await page.getByRole('button', { name: t.reviewCta, exact: true }).click();
    const before = (await snapshot(page)).intakeDraft;
    for (const [rawBudget, error] of [['-1', 'budgetNegative'], ['100001', 'budgetLimit'], ['9'.repeat(32), 'budgetLimit'], ['2.5', 'budgetInteger']] as const) {
      await page.locator('[data-field="budgetKzt"] .edit-link').click();
      await page.locator('#budget').fill(rawBudget);
      await page.getByRole('button', { name: t.back, exact: true }).click();
      await expect(page.getByRole('alert')).toContainText(t[error]);
      await expect(page.getByTestId('search-count')).toHaveCount(0);
      await expect(page.getByRole('button', { name: t.show, exact: true })).toBeDisabled();
      expect((await snapshot(page)).intakeDraft).toEqual(before);
      expect((await snapshot(page)).input).toEqual(emptySearchInput());
      await page.goBack();
      await expect(page.locator('#budget')).toHaveValue(rawBudget);
      await page.goForward();
      await expect(page.getByRole('button', { name: t.show, exact: true })).toBeDisabled();
    }
    // Invalid raw text is intentionally memory-only; reload restores validated null,
    // never a coerced zero. Other answers and the unapplied boundary survive.
    await page.reload();
    await expect(page.locator('[data-field="budgetKzt"]')).toContainText(t.notSet);
    expect((await snapshot(page)).intakeDraft).toEqual(before);
    expect((await snapshot(page)).input).toEqual(emptySearchInput());
    await page.locator('[data-field="budgetKzt"] .edit-link').click();
    await page.locator('#budget').fill('0');
    await page.getByRole('radio', { name: t.budgetHard, exact: true }).check();
    await page.getByRole('button', { name: t.reviewCta, exact: true }).click();
    await expect(page.locator('[data-field="budgetKzt"]')).toContainText('0 ₸');
    await page.locator('[data-field="budgetKzt"] .edit-link').click();
    await page.locator('#budget').fill('');
    await page.getByRole('button', { name: t.reviewCta, exact: true }).click();
    expect((await snapshot(page)).intakeDraft).toEqual({ ...before, budgetHard: true });
  });
}
