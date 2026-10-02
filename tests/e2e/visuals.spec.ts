import { expect, test } from '@playwright/test';

const TEMPLATES = ['who-pays', 'timeline', 'before-after', 'split', 'flow'];

test('every diagram template renders with a text alternative', async ({ page }) => {
  await page.goto('/design');
  for (const t of TEMPLATES) {
    const figure = page.locator(`figure[data-visual="${t}"]`);
    await expect(figure).toBeVisible();
    await expect(figure.locator('.sr-only')).not.toBeEmpty();
  }
  await expect(page.locator('figure[data-visual="who-pays"] .sr-only')).toHaveText(
    'Total $5,000. You pay $1,000 (Your deductible). Insurer pays $4,000 (Insurer pays).',
  );
});

test('diagrams fit a 390px screen without sideways scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/design');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
