import { expect, test } from '@playwright/test';

async function jsonLd(page: import('@playwright/test').Page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.map((b) => JSON.parse(b) as Record<string, unknown>);
}

test('full term page has meta, canonical, Open Graph and structured data', async ({ page }) => {
  await page.goto('/terms/endorsement');
  await expect(page).toHaveTitle('What Is an Endorsement? Insurance Definition & Example');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /endorsement/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/terms\/endorsement$/,
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Endorsement/);

  const types = (await jsonLd(page)).map((d) => d['@type']);
  expect(types).toEqual(['DefinedTerm', 'BreadcrumbList', 'FAQPage']);
});

test('basic term page has DefinedTerm and breadcrumbs but no FAQPage', async ({ page }) => {
  await page.goto('/terms/actual-cash-value');
  const data = await jsonLd(page);
  expect(data.map((d) => d['@type'])).toEqual(['DefinedTerm', 'BreadcrumbList']);
  expect(data[0]).toMatchObject({ name: 'Actual Cash Value (ACV)', alternateName: ['ACV'] });
});

test('type page has breadcrumbs through the tree', async ({ page }) => {
  await page.goto('/types/life.term');
  const crumbs = (await jsonLd(page)).find((d) => d['@type'] === 'BreadcrumbList');
  const names = (crumbs?.itemListElement as { name: string }[]).map((i) => i.name);
  expect(names).toEqual(['Insurance types', 'Life Insurance', 'Term Life']);
});

test('noindex pages have no canonical link', async ({ page }) => {
  await page.goto('/search');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
