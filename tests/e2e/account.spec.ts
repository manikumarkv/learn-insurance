import { expect, test } from '@playwright/test';

// CI builds without Clerk keys, so these check the parts that work either way.
// With keys, the same pages show Clerk's sign-in and sign-up forms.

test('the header links to sign-in', async ({ page }) => {
  await page.goto('/');
  const signIn = page.getByRole('banner').getByRole('link', { name: 'Sign in' }).first();
  await expect(signIn).toBeVisible();
  await signIn.click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Sign in' })).toBeVisible();
});

test('the sign-up page loads', async ({ page }) => {
  await page.goto('/sign-up');
  await expect(page.getByRole('heading', { level: 1, name: 'Create an account' })).toBeVisible();
});
