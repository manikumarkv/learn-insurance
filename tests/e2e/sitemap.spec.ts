import { expect, test } from '@playwright/test';

test('robots.txt allows crawling and points to the sitemap', async ({ request }) => {
  const text = await (await request.get('/robots.txt')).text();
  expect(text).toContain('User-agent: *');
  expect(text).toContain('Disallow: /keystatic');
  expect(text).toMatch(/Sitemap: https?:\/\/\S+\/sitemap-index\.xml/);
});

test('sitemap lists term and type pages but not search or design', async ({ request }) => {
  const xml = await (await request.get('/sitemap-0.xml')).text();
  expect(xml).toMatch(/<loc>[^<]*\/terms\/endorsement<\/loc><lastmod>2026-10-02/);
  expect(xml).toMatch(/<loc>[^<]*\/types\/life\.term<\/loc>/);
  expect(xml).not.toMatch(/<loc>[^<]*\/(search|design)<\/loc>/);
});

test('llms.txt describes the site and lists terms', async ({ request }) => {
  const text = await (await request.get('/llms.txt')).text();
  expect(text.startsWith('# LearnInsurance')).toBe(true);
  expect(text).toMatch(/^> Plain-English explanations of 1,016 US insurance terms/m);
  expect(text).toMatch(/- \[Endorsement\]\(https?:\/\/\S+\/terms\/endorsement\): /);
});
