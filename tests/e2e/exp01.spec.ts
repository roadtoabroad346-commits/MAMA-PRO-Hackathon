import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { messages } from '../../src/i18n/messages';

// EXP-01-AC-01/04: real public journeys, decorative illustrations, all required widths.
// Screenshots are fresh review evidence, not an invented visual-diff baseline.
for (const locale of ['ru', 'kk'] as const) {
  for (const width of [320, 390, 1280]) {
    test(`EXP-01 ${locale} ${width}: anonymous entry and three noninteractive poses`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(locale => localStorage.setItem('qoldau.locale', locale), locale);
      await mkdir('work/exp01/screenshots', { recursive: true });
      const t = messages[locale];
      await page.goto('/');
      await expect(page.locator('h1')).toHaveText(t.homeTitle);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      // Visit each pose by its public CTA; no login/session fixture is used.
      for (const pose of ['welcome', 'guide', 'search'] as const) {
        if (pose === 'guide') await page.getByRole('link', { name: t.guide, exact: true }).click();
        if (pose === 'search') {
          await page.goBack();
          await expect(page.locator('h1')).toHaveText(t.homeTitle);
          await page.getByRole('link', { name: t.catalog, exact: true }).click();
        }
        const bird = page.locator(`svg.bird.${pose}`);
        await expect(bird).toBeVisible();
        await expect(bird).toHaveAttribute('aria-hidden', 'true');
        expect(await bird.evaluate(element => element.tabIndex)).toBeLessThan(0);
        await expect(bird.locator('a, button, [tabindex="0"]')).toHaveCount(0);
        const box = await bird.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThan(0);
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        await expect(page.locator('.site-header .badge')).toHaveText(t.demo);
        await page.screenshot({ path: `work/exp01/screenshots/${locale}-${width}-${pose}.png`, fullPage: true });
      }
      expect(errors).toEqual([]);
    });
  }
}
