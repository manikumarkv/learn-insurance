import { expect, test } from '@playwright/test';

test('term links show a preview on hover and keyboard focus', async ({ page }) => {
  await page.goto('/terms/health-maintenance-organization');
  const link = page.locator('a[data-term-link]', { hasText: 'referral' }).first();
  await expect(link).toHaveAttribute('href', '/terms/referral');
  await expect(link).toHaveCSS('text-decoration-style', 'dotted');

  const preview = page.getByRole('tooltip');
  await link.hover();
  await expect(preview).toBeVisible();
  await expect(preview.getByRole('link', { name: 'Open term →' })).toHaveAttribute(
    'href',
    /\/terms\/referral$/,
  );
  await expect(link).toHaveAttribute('aria-describedby', 'term-preview');

  await page.keyboard.press('Escape');
  await expect(preview).toBeHidden();

  await link.focus();
  await expect(preview).toBeVisible();
});

test('normal links keep a solid underline', async ({ page }) => {
  await page.goto('/terms/health-maintenance-organization');
  await expect(page.getByRole('link', { name: 'Terms', exact: true })).toHaveCSS(
    'text-decoration-style',
    'solid',
  );
});

test.describe('on a touch screen', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 800 } });

  test('the first tap previews and does not leave the page', async ({ page }) => {
    await page.goto('/terms/health-maintenance-organization');
    const link = page.locator('a[data-term-link]', { hasText: 'referral' }).first();
    await link.tap();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await expect(page).toHaveURL(/health-maintenance-organization/);
  });
});
