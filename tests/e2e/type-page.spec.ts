import { expect, test } from '@playwright/test';

test('a top-level type shows its quick answer, sub-types and key terms', async ({ page }) => {
  await page.goto('/types/life');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Life Insurance');
  await expect(page.getByRole('heading', { name: 'Quick answer' })).toBeVisible();
  const subTypes = page.locator('section', {
    has: page.getByRole('heading', { name: 'Sub-types' }),
  });
  await expect(subTypes.getByRole('link', { name: 'Term Life' })).toBeVisible();
  const keyTerms = page.locator('section', {
    has: page.getByRole('heading', { name: 'Key terms' }),
  });
  await expect(keyTerms.getByRole('link').first()).toBeVisible();
  await expect(
    page.getByRole('link', { name: /^See all \d+ terms for Life Insurance$/ }),
  ).toHaveAttribute('href', '/terms?type=life&sort=most-used');
});

test('a nested type shows where it sits and related types', async ({ page }) => {
  await page.goto('/types/life.term');
  await expect(
    page
      .getByRole('navigation', { name: 'Breadcrumb' })
      .getByRole('link', { name: 'Life Insurance' }),
  ).toBeVisible();
  await expect(page.getByLabel('Path in the insurance types tree')).toContainText('Life Insurance');
  await expect(
    page.getByRole('navigation', { name: 'Related types' }).getByRole('link').first(),
  ).toBeVisible();
});
