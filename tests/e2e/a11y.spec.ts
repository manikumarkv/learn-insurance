import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/** Key pages checked against WCAG 2.2 AA (story 5.5). */
const PAGES = [
  '/',
  '/terms',
  '/terms/endorsement',
  '/terms/health-maintenance-organization',
  '/types',
  '/types/life.term',
  '/search?q=deductible',
  '/about',
  '/privacy',
  '/no-such-page',
];

for (const path of PAGES) {
  test(`no moderate or worse accessibility issues on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    // The story asks for zero serious issues; we also hold the line on moderate ones.
    const serious = violations
      .filter((v) => v.impact === 'moderate' || v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id} (${v.impact}): ${v.nodes.length} × ${v.nodes[0]?.target.join(' ')}`);
    expect(serious, serious.join('\n')).toEqual([]);
  });
}

for (const theme of ['dark', 'light-hc', 'dark-hc']) {
  test(`colour contrast holds in the ${theme} theme`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    await page.goto('/terms/endorsement');
    const { violations } = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
    expect(violations.map((v) => v.nodes[0]?.target.join(' '))).toEqual([]);
  });
}
