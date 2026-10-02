import { expect, test } from '@playwright/test';

/*
 * Launch smoke test (story 5.7). Tagged @smoke so it can run alone against a deployed site:
 *   BASE_URL=https://<domain> pnpm test:smoke
 */

test.describe('smoke @smoke', () => {
  test('home, a term page and the A–Z list load', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.goto('/terms/endorsement');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Endorsement');

    await page.goto('/terms');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('search finds a term', async ({ page }) => {
    await page.goto('/search?q=deductible');
    // A deployed site loads the search index over the network, so allow more time than locally.
    await expect(page.getByRole('link', { name: /Deductible/ }).first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test('robots.txt and the sitemap are served', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain('Sitemap:');

    const sitemap = await request.get('/sitemap-index.xml');
    expect(sitemap.ok()).toBe(true);
  });

  test('the about, privacy and terms of use pages load', async ({ page }) => {
    for (const path of ['/about', '/privacy', '/terms-of-use']) {
      const res = await page.goto(path);
      expect(res?.ok()).toBe(true);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });
});
