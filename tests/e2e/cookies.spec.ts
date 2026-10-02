import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

const banner = (page: import('@playwright/test').Page) =>
  page.getByRole('region', { name: 'Cookie choice' });

test('asks once, remembers the choice and can be reopened from the footer', async ({ page }) => {
  await page.goto('/');
  await expect(banner(page)).toBeVisible();
  await banner(page).getByRole('button', { name: 'Only necessary' }).click();
  await expect(banner(page)).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem('cookie-consent'))).toBe('necessary');

  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(banner(page)).toBeHidden();

  await page.getByRole('contentinfo').getByRole('link', { name: 'Cookie settings' }).click();
  await expect(banner(page)).toBeVisible();
  await expect(banner(page)).toContainText('Current choice: only necessary');
  await banner(page).getByRole('button', { name: 'Accept' }).click();
  expect(await page.evaluate(() => localStorage.getItem('cookie-consent'))).toBe('analytics');
});
