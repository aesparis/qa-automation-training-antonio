// Day 5 — your first three UI tests. Replace each `test.fixme` with `test` when you write it.
// `test.fixme` means "known to be unfinished": Playwright skips it, so the suite stays green until you start.
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/api/test/reset');
});

test.fixme('TODO 1: a wrong password shows "Invalid username or password" and stays on the sign-in page', async ({ page }) => {
  // Steps: open '/', fill Username = ana.admin and a wrong Password, click Sign in.
  // Assert: the alert (getByRole('alert')) has the exact text, and the "Sign in" heading is still visible.
});

test.fixme('TODO 2: a Payroll Viewer does not see the "New claim" link or any Approve button', async ({ page }) => {
  // Sign in as vic.viewer. Assert the heading is visible first (so you know the page loaded),
  // then that getByRole('link', { name: 'New claim' }) is hidden and there are 0 buttons named /Approve/.
});

test.fixme('TODO 3: the Status filter "Submitted" shows only Submitted claims', async ({ page }) => {
  // Sign in as ana.admin, choose "Submitted" in the Status filter (getByLabel('Status').selectOption(...)).
  // Assert every status cell (getByTestId('status')) has the text "Submitted", and that there is at least one row.
  // Hint: await expect(page.getByTestId('status')).toHaveText([...]) needs the exact list; think about
  // what you can assert that does not depend on the exact number of rows.
});
