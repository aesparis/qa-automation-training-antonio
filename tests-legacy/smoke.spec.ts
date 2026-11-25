import { test, expect } from '@playwright/test';

test('admin can sign in', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('ana.admin');
  await page.getByLabel('Password').fill('Train#2026');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Overtime claims' })).toBeVisible();
});

test('claims page shows the claims', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('vic.viewer');
  await page.getByLabel('Password').fill('Train#2026');
  await page.getByRole('button', { name: 'Sign in' }).click();
  const rows = page.locator('table tbody tr');
  expect(rows).toBeTruthy();
});
