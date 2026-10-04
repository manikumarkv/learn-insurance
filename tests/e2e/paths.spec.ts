import { expect, test } from '@playwright/test';

test('paths list starts with Insurance basics and opens its detail page', async ({ page }) => {
  await page.goto('/paths');
  await expect(page.getByRole('heading', { level: 1, name: 'Learning paths' })).toBeVisible();
  const startHere = page.locator('section', {
    has: page.getByRole('heading', { name: 'Start here' }),
  });
  await startHere.getByRole('link', { name: 'Insurance basics', exact: true }).click();

  await expect(page).toHaveURL(/\/paths\/insurance-basics$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Insurance basics' })).toBeVisible();
  await expect(page.getByText('Module 1')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start learning' })).toHaveAttribute(
    'href',
    '/paths/insurance-basics/learn/insurance',
  );
});

test("a guest's progress on this device shows on both pages", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('learned-terms', JSON.stringify(['insurance', 'insured']));
  });

  await page.goto('/paths/insurance-basics');
  const progress = page.getByRole('complementary', { name: 'Your progress' });
  await expect(progress.getByText('2 / 194 answered correctly')).toBeVisible();
  await expect(progress.getByRole('link', { name: 'Continue learning' })).toHaveAttribute(
    'href',
    '/paths/insurance-basics/learn/insurer',
  );
  await expect(page.getByText('2 of 30 learned')).toBeVisible();

  await page.goto('/paths');
  await expect(page.getByText('1% complete')).toBeVisible();
  await expect(page.getByRole('link', { name: /Continue Insurance basics/ })).toBeVisible();
});
