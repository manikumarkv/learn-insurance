import { expect, test } from '@playwright/test';

test('learn cards go through a path one term at a time', async ({ page }) => {
  await page.goto('/paths/insurance-basics');
  await page.getByRole('link', { name: 'Start learning' }).click();

  await expect(page).toHaveURL(/\/paths\/insurance-basics\/learn\/insurance$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Insurance' })).toBeVisible();
  await expect(page.getByText(/Term 1 of 194 · 0 answered correctly · 0%/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Read the full term page →' })).toHaveAttribute(
    'href',
    '/terms/insurance',
  );

  const nav = page.getByRole('navigation', { name: 'Learn card' });
  await nav.getByRole('link', { name: 'Next term' }).click();
  await expect(page).toHaveURL(/\/learn\/insured$/);
  await expect(page.getByText(/Term 2 of 194/)).toBeVisible();

  await nav.getByRole('link', { name: 'Previous' }).click();
  await expect(page).toHaveURL(/\/learn\/insurance$/);
});
