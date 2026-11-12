import { expect, test } from '@playwright/test';

for (const locale of ['ru', 'kk'] as const) {
  test(`${locale}: 320px with 200% text uses the layout viewport, including header and notices`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.addInitScript(locale => localStorage.setItem('qoldau.locale', locale), locale);
    for (const path of ['/', '/route', '/route/review', '/specialists', '/specialists/S01?offer=O01', '/compare', '/request/O01', '/privacy', '/about-demo']) {
      await page.goto(path);
      await expect(page.locator('.site-header')).toBeVisible();
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      const geometry = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
      expect(geometry.client, path).toBe(320);
      expect(geometry.scroll, path).toBeLessThanOrEqual(geometry.client);
      await expect(page.getByRole('button', { name: 'Қаз', exact: true })).toBeInViewport();
    }
  });
}
