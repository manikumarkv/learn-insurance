import { expect, test } from '@playwright/test';

test.describe('basic term page', () => {
  test('shows the seed fields and a coming-soon note', async ({ page }) => {
    await page.goto('/terms/health-maintenance-organization');
    await expect(page).toHaveTitle('What Is HMO? Insurance Definition & Example');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'HMO (Health Maintenance Organization)',
    );
    await expect(page.getByRole('note')).toContainText('Full explanation coming soon');
    await expect(page.getByRole('heading', { name: 'In plain English' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Example' })).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: 'Related terms' }).getByRole('link').first(),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Check yourself' })).toHaveCount(0);
  });

  test('puts the full name first when the abbreviation is not the common name', async ({
    page,
  }) => {
    await page.goto('/terms/actual-cash-value');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Actual Cash Value (ACV)');
  });
});

test.describe('full term page', () => {
  test('shows every section', async ({ page }) => {
    await page.goto('/terms/endorsement');
    await expect(page.locator('article')).toHaveAttribute('data-content-status', 'full');
    for (const name of [
      'Quick answer',
      'See it',
      'In plain English',
      'Example',
      'Where it happens in the policy flow',
      'Check yourself',
      'Frequently asked questions',
    ]) {
      await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    }
    await expect(page.getByText('AI-generated · AI-reviewed')).toBeVisible();
    await expect(page.locator('figure[data-visual]')).toBeVisible();
    await expect(page.getByText(/Last updated/)).toBeVisible();
  });

  test('check yourself asks 3 questions and explains each answer', async ({ page }) => {
    await page.goto('/terms/endorsement');
    const quiz = page.locator('section', {
      has: page.getByRole('heading', { name: 'Check yourself' }),
    });
    await expect(quiz.getByText(/Question 1 of 3 · from a pool of \d+/)).toBeVisible();
    await quiz.getByRole('radio').first().check();
    await quiz.getByRole('button', { name: 'Check answer' }).click();
    await expect(quiz.getByRole('status')).toContainText(/Correct\.|Not quite\./);
    await quiz.getByRole('button', { name: 'Next question' }).click();
    await expect(quiz.getByText(/Question 2 of 3/)).toBeVisible();
  });
});
