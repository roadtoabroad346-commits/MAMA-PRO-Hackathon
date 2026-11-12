import { expect, test } from '@playwright/test';
import raw from '../../src/data/catalog.json' with { type: 'json' };

for (const locale of ['ru', 'kk'] as const) {
  test(`${locale}: catalog error and Retry keep document language`, async ({ page }) => {
    await page.addInitScript(locale => {
      localStorage.setItem('qoldau.locale', locale);
    }, locale);
    let broken = true;
    await page.route('**/src/data/catalog.json', route => route.fulfill({
      contentType: 'application/json', body: broken ? '{}' : JSON.stringify(raw),
    }));
    await page.goto('/specialists');
    await expect(page.getByRole('alert')).toContainText(locale === 'ru' ? 'Не удалось загрузить' : 'жүктеу мүмкін болмады');
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.getByTestId('specialist-card')).toHaveCount(0);
    broken = false;
    await page.getByRole('button').click();
    await expect(page.getByTestId('specialist-card')).toHaveCount(12);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
  });

  test(`${locale}: hidden offer IDs are never selectable in profile or request`, async ({ page }) => {
    const catalog = structuredClone(raw);
    catalog.offers.find(o => o.id === 'O23')!.publicationStatus = 'hidden';
    await page.addInitScript(locale => localStorage.setItem('qoldau.locale', locale), locale);
    await page.route('**/src/data/catalog.json', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(catalog) }));
    for (const path of ['/specialists/S12?offer=O23', '/request/O23']) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(locale === 'ru' ? 'Услуга не найдена или недоступна' : 'Қызмет табылмады немесе қолжетімсіз');
      await expect(page.locator('[data-offer-id], [data-request-phase]')).toHaveCount(0);
    }
  });
}
