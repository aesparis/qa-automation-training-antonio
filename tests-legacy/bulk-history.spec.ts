import { test, expect } from '@playwright/test';

test('claims list handles a long history (25 claims)', async ({ page, request }) => {
  test.setTimeout(4000);
  await request.post('/api/test/reset');
  const today = (await (await request.get('/api/health')).json()).today;
  await page.goto('/');
  await page.getByLabel('Username').fill('ana.admin');
  await page.getByLabel('Password').fill('Train#2026');
  await page.getByRole('button', { name: 'Sign in' }).click();
  for (let i = 0; i < 25; i++) {
    await page.goto('/new-claim.html');
    await page.getByLabel('Employee').selectOption('E103');
    await page.getByLabel('Date').fill(today);
    await page.getByLabel('Hours').fill('0.5');
    await page.getByRole('button', { name: 'Submit claim' }).click();
    await expect(page.getByRole('status')).toContainText('submitted');
  }
  await page.goto('/claims.html');
  await expect(page.getByRole('row')).toHaveCount(1 + 13 + 25);
});
