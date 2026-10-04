import { expect, test } from '@playwright/test';

test("a guest's quiz answers count towards progress on this device", async ({ page }) => {
  await page.goto('/terms/endorsement');
  const quiz = page.locator('section', {
    has: page.getByRole('heading', { name: 'Check yourself' }),
  });
  await expect(quiz.getByText(/Question 1 of 3/)).toBeVisible();

  // The 3 questions shown are remembered, so the next visit picks others.
  const recent = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('recent-questions') ?? '{}'),
  );
  expect(recent.endorsement).toHaveLength(3);

  await quiz.getByRole('radio').first().check();
  await quiz.getByRole('button', { name: 'Check answer' }).click();
  const status = quiz.getByRole('status');
  await expect(status).toBeVisible();
  const right = (await status.textContent())?.includes('Correct.');

  // No account here (static site), so a right answer is saved on the device.
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('learned-terms') ?? '[]'))
    .toBe(right ? '["endorsement"]' : '[]');
});
