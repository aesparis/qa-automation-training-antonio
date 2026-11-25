import { test, expect } from '@playwright/test';

test('monthly summary for Liza Ramos (E104) counts her approved and paid overtime', async ({ request }) => {
  await request.post('/api/test/reset');
  const login = await request.post('/api/auth/login', { data: { username: 'ana.admin', password: 'Train#2026' } });
  const { token } = await login.json();
  const today: string = (await (await request.get('/api/health')).json()).today;
  const res = await request.get(`/api/monthly-summary?month=${today.slice(0, 7)}`, { headers: { Authorization: `Bearer ${token}` } });
  expect(res.status()).toBe(200);
  const row = (await res.json()).rows.find((r: { employeeId: string }) => r.employeeId === 'E104');
  // Seed: OT-5006 and OT-5007 Approved, OT-5008 Paid, 12 h each at 88.75 x 1.25
  expect(row).toMatchObject({ hours: 36, amount: 3993.75 });
});
