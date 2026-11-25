import { test, expect } from '@playwright/test';

test('admin submits a 2-hour Regular claim and sees the amount', async ({ page, request }) => {
  await request.post('/api/test/reset');
  const today = (await (await request.get('/api/health')).json()).today;
  await page.goto('/');
  await page.getByLabel('Username').fill('ana.admin');
  await page.getByLabel('Password').fill('Train#2026');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'New claim' }).click();
  await page.getByLabel('Employee').selectOption('E101');
  await page.getByLabel('Date').fill(today);
  await page.getByLabel('Hours').fill('2');
  await page.getByLabel('Type').selectOption('Regular');
  await page.locator('#submit-claim').click();
  await expect(page.getByRole('status')).toContainText('₱237.50');
});
