import { test, expect } from '@playwright/test';

async function signIn(page: import('@playwright/test').Page, user: string): Promise<void> {
  await page.goto('/');
  await page.getByLabel('Username').fill(user);
  await page.getByLabel('Password').fill('Train#2026');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Overtime claims' })).toBeVisible();
}

test('second admin approves OT-5001', async ({ page }) => {
  await signIn(page, 'ben.admin');
  await page.getByRole('button', { name: 'Approve OT-5001' }).click();
  await expect(page.getByRole('row').filter({ hasText: 'OT-5001' }).getByTestId('status')).toHaveText('Approved');
});

test('OT-5001 is waiting for approval', async ({ page }) => {
  await signIn(page, 'vic.viewer');
  await expect(page.getByRole('row').filter({ hasText: 'OT-5001' }).getByTestId('status')).toHaveText('Submitted');
});
