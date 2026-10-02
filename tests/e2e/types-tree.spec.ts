import { expect, test } from '@playwright/test';

test('expands a branch and shows the type in the side panel', async ({ page }) => {
  await page.goto('/types');
  const tree = page.getByRole('tree', { name: 'Insurance types' });
  const life = tree.getByRole('treeitem', { name: 'Life Insurance', exact: true });
  await expect(life).toHaveAttribute('aria-expanded', 'false');
  await life.locator('> div').click();
  await expect(life).toHaveAttribute('aria-expanded', 'true');
  await expect(tree.getByRole('treeitem', { name: 'Term Life', exact: true })).toBeVisible();
  await expect(
    page.getByRole('complementary').getByRole('heading', { name: 'Life Insurance' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Life Insurance' })).toHaveAttribute(
    'href',
    '/types/life',
  );
});

test('works with the keyboard (tree pattern)', async ({ page }) => {
  await page.goto('/types');
  const tree = page.getByRole('tree', { name: 'Insurance types' });
  const first = tree.getByRole('treeitem').first();
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowDown');
  const second = tree.getByRole('treeitem', { expanded: undefined }).nth(1);
  await expect(second).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(first).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('aria-selected', 'true');
});

test('filter shows matches with their parents', async ({ page }) => {
  await page.goto('/types');
  await page.getByLabel('Filter types').fill('term life');
  const tree = page.getByRole('tree', { name: 'Insurance types' });
  await expect(tree.getByRole('treeitem', { name: 'Term Life', exact: true })).toBeVisible();
  await expect(tree.getByRole('treeitem', { name: 'Life Insurance', exact: true })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
});

test('expand all opens every branch', async ({ page }) => {
  await page.goto('/types');
  await page.getByRole('button', { name: 'Expand all' }).click();
  await expect(page.getByRole('treeitem', { expanded: false })).toHaveCount(0);
});
