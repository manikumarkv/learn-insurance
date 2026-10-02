import { expect, test } from '@playwright/test';

test('header shows the main navigation on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const header = page.getByRole('banner');
  for (const label of ['Terms A–Z', 'Insurance types', 'Learning paths']) {
    await expect(header.getByRole('link', { name: label })).toBeVisible();
  }
  await expect(header.getByRole('link', { name: 'Sign in' }).first()).toBeVisible();
  await expect(header.getByRole('button', { name: 'Menu' })).toBeHidden();
});

test('mobile menu opens below 768px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const header = page.getByRole('banner');
  const termsLink = header.getByRole('link', { name: 'Terms A–Z' });
  await expect(termsLink.first()).toBeHidden();
  await header.getByText('Menu').click();
  await expect(header.getByRole('link', { name: 'Terms A–Z' }).last()).toBeVisible();
});

test('footer shows the disclaimer and legal links', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByTestId('disclaimer')).toContainText('Educational only');
  for (const label of ['About', 'Privacy', 'Terms of use', 'Cookie settings']) {
    await expect(footer.getByRole('link', { name: label })).toBeVisible();
  }
});

test('unknown pages show the 404 page with search and "Request a term"', async ({ page }) => {
  const response = await page.goto('/no-such-page');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('We couldn’t find that page');
  await expect(page.getByRole('main').getByRole('search')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Request a term' })).toBeVisible();
});
