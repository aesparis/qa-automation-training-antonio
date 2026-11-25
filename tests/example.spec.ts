// Worked examples (Day 5). Read every line, run them, then use them as patterns for your own tests.
// Run: npm test -- tests/example.spec.ts     (or click the green arrow in VS Code's Testing panel)
import { test, expect } from '@playwright/test';

// Reset the sandbox before every test so each test starts from the same seed data.
test.beforeEach(async ({ request }) => {
  const res = await request.post('/api/test/reset');
  expect(res.status()).toBe(204);
});

test('worked example 1: an admin can sign in and sees the claims page', async ({ page }) => {
  await page.goto('/');
  // Locate elements the way a user finds them: by label, role and visible name. Avoid CSS paths.
  await page.getByLabel('Username').fill('ana.admin');
  await page.getByLabel('Password').fill('Train#2026');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Web-first assertions wait automatically (up to 5 s) until the condition is true. No manual waits.
  await expect(page.getByRole('heading', { name: 'Overtime claims' })).toBeVisible();
  await expect(page.getByText('Signed in as ana.admin (Payroll Admin)')).toBeVisible();
  await expect(page.getByRole('link', { name: 'New claim' })).toBeVisible();
});

test('worked example 2: the claims table shows a seeded claim with its amount', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('ana.admin');
  await page.getByLabel('Password').fill('Train#2026');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // A row is found by the text it contains; then we check cells inside that row only.
  const row = page.getByRole('row').filter({ hasText: 'OT-5001' });
  await expect(row).toContainText('Maria Santos');
  await expect(row).toContainText('₱237.50'); // E101 ₱95.00/h × 2 h × 1.25 (sandbox/README.md §4)
  await expect(row.getByTestId('status')).toHaveText('Submitted');
});

test('worked example 3: API test with the request fixture (no browser needed)', async ({ request }) => {
  const login = await request.post('/api/auth/login', { data: { username: 'vic.viewer', password: 'Train#2026' } });
  expect(login.status()).toBe(200);
  const { token } = await login.json();

  const res = await request.get('/api/employees/E101', { headers: { Authorization: `Bearer ${token}` } });
  expect(res.status()).toBe(200);
  const employee = await res.json();
  expect(employee).toMatchObject({ id: 'E101', name: 'Maria Santos', hourlyRate: 95, status: 'Active' });
});
