import { expect, test } from '@playwright/test';

test('home page gets people to an answer fast', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Insurance words, in plain English',
  );
  await expect(page.getByRole('main').getByRole('search')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Deductible', exact: true }).first()).toBeVisible();
  const flow = page.locator('section', {
    has: page.getByRole('heading', { name: 'How a policy works' }),
  });
  await expect(flow.getByRole('listitem')).toHaveCount(7);
  const types = page.locator('section', {
    has: page.getByRole('heading', { name: 'Insurance types' }),
  });
  await expect(types.getByRole('link', { name: /Life Insurance/ })).toHaveAttribute(
    'href',
    '/types/life',
  );
  await expect(page.getByRole('heading', { name: 'Learning paths' })).toBeVisible();
});
