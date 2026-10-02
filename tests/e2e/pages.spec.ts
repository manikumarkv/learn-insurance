import { expect, test } from '@playwright/test';

test('about page renders the Keystatic content', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About LearnInsurance');
  await expect(page.getByRole('heading', { name: 'How terms are written' })).toBeVisible();
  await expect(page.getByText(/Last updated/)).toBeVisible();
});

test('the same disclaimer appears in the footer and on term pages', async ({ page }) => {
  await page.goto('/terms/deductible');
  const disclaimers = page.getByTestId('disclaimer');
  await expect(disclaimers).toHaveCount(2);
  for (const d of await disclaimers.all()) {
    await expect(d).toContainText('Educational only.');
    await expect(d).toContainText('not insurance, legal or financial advice');
  }
});

test('privacy policy covers the services we use', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy policy');
  for (const service of ['Vercel', 'Clerk', 'Neon', 'PostHog']) {
    await expect(page.getByRole('cell', { name: service, exact: true })).toBeVisible();
  }
});

test('terms of use say educational only, no advice', async ({ page }) => {
  await page.goto('/terms-of-use');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of use');
  await expect(page.getByRole('heading', { name: 'Educational only, not advice' })).toBeVisible();
  await expect(page.getByText(/not insurance, legal, tax or financial advice/)).toBeVisible();
});
