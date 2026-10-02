import { expect, test } from '@playwright/test';

test('finds a term by name and shows its usage', async ({ page }) => {
  await page.goto('/search?q=deductible');
  await expect(page.getByRole('status')).toHaveText(/\d+ results for “deductible”/);
  const terms = page.getByRole('region', { name: 'Terms' });
  await expect(terms.getByRole('link', { name: 'Deductible', exact: true })).toBeVisible();
  await expect(terms.getByText(/(High|Medium|Low) usage/).first()).toBeVisible();
});

test('finds a term by its abbreviation', async ({ page }) => {
  await page.goto('/search?q=HMO');
  await expect(
    page
      .getByRole('region', { name: 'Terms' })
      .getByRole('link', { name: 'HMO (Health Maintenance Organization)' }),
  ).toBeVisible();
});

test('shows matching insurance types', async ({ page }) => {
  await page.goto('/search?q=cyber');
  await expect(
    page.getByRole('region', { name: 'Insurance types' }).getByRole('link').first(),
  ).toBeVisible();
});

test('the header search box goes to the results page', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 800 });
  await page.goto('/');
  const box = page.getByRole('banner').getByRole('searchbox', { name: 'Search terms' });
  await box.fill('premium');
  await box.press('Enter');
  await expect(page).toHaveURL(/\/search\?q=premium/);
  await expect(
    page.getByRole('searchbox', { name: 'Search terms and insurance types' }),
  ).toHaveValue('premium');
  await expect(page.getByRole('status')).toHaveText(/results for “premium”/);
});
