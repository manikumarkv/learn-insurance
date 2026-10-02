import { expect, test } from '@playwright/test';

test('theme follows the device by default', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('/design');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await context.close();
});

test('chosen theme is applied and remembered after reload', async ({ page }) => {
  await page.goto('/design');
  const picker = page.getByRole('banner').getByLabel('Theme').first();
  await picker.selectOption('dark-hc');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark-hc');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark-hc');
  await expect(picker).toHaveValue('dark-hc');
});

test('keyboard focus shows the Paper Design focus ring', async ({ page }) => {
  await page.goto('/design');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  const ring = await skip.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(ring).not.toBe('none');
});
