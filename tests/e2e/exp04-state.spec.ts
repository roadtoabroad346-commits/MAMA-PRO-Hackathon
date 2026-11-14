import { expect, test } from '@playwright/test';

test('P04-T34/48 unavailable pinned pairs retain safe placeholders, are removable, never replaced or exposed', async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/exp04-state.html');
  await page.getByRole('button', { name: 'Pin three pairs', exact: true }).click();
  await expect(page.getByTestId('comparison-card')).toHaveCount(3);
  await page.getByRole('button', { name: 'Withdraw offer and hide provider', exact: true }).click();
  await expect(page.getByTestId('comparison-card')).toHaveCount(1);
  await expect(page.getByTestId('comparison-unavailable')).toHaveCount(2);
  await expect(page.getByTestId('comparison-unavailable')).not.toContainText(['O02', 'O03']);
  await expect(page.locator('a[href*="O02"], a[href*="O03"]')).toHaveCount(0);
  await page.getByTestId('comparison-unavailable').first().getByRole('button').click();
  await expect(page.getByTestId('comparison-unavailable')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.getByTestId('pairs')).toHaveText('[{"specialistId":"S01","offerId":"O01"},{"specialistId":"S03","offerId":"O03"}]');
  await page.getByTestId('comparison-unavailable').getByRole('button').click();
  await expect(page.getByTestId('pairs')).toHaveText('[{"specialistId":"S01","offerId":"O01"}]');
});

test('P04-T30/48 forged additions never mutate legitimate pairs; toggle removes only exact pinned identity', async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/exp04-state.html');
  await page.getByRole('button', { name: 'Try forged pairs', exact: true }).click();
  await expect(page.getByTestId('pairs')).toHaveText('[]');
  await page.getByRole('button', { name: 'Pin three pairs', exact: true }).click();
  const before = await page.getByTestId('pairs').textContent();
  await page.getByRole('button', { name: 'Try forged pairs', exact: true }).click();
  await expect(page.getByTestId('pairs')).toHaveText(before!);
  await page.getByRole('button', { name: 'Pin three pairs', exact: true }).click();
  await expect(page.getByTestId('pairs')).toHaveText('[]');
});
