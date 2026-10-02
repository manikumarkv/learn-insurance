import { expect, test } from '@playwright/test';

test('lists terms with letters, filters and pages', async ({ page }) => {
  await page.goto('/terms');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Insurance terms A–Z');
  await expect(page.getByRole('status')).toHaveText('1016 terms');
  await expect(page.getByRole('navigation', { name: 'Pages' })).toContainText('Page 1 of');
});

test('filters are reflected in the URL and survive a reload', async ({ page }) => {
  await page.goto('/terms');
  await page.getByRole('button', { name: 'H', exact: true }).click();
  await page.getByLabel('Usage').selectOption('High');
  await expect(page).toHaveURL(/letter=H/);
  await expect(page).toHaveURL(/usage=High/);
  const count = await page.getByRole('status').textContent();

  await page.reload();
  await expect(page.getByLabel('Usage')).toHaveValue('High');
  await expect(page.getByRole('status')).toHaveText(count ?? '');
  await expect(
    page.getByRole('link', { name: 'HMO (Health Maintenance Organization)' }),
  ).toBeVisible();
});

test('abbreviations filter shows only terms with an abbreviation', async ({ page }) => {
  await page.goto('/terms?abbr=1&letter=A');
  await expect(page.getByRole('link', { name: 'Actual Cash Value (ACV)' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Accident', exact: true })).toHaveCount(0);
});

test('next page moves through the list', async ({ page }) => {
  await page.goto('/terms');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByRole('navigation', { name: 'Pages' })).toContainText('Page 2 of');
});
