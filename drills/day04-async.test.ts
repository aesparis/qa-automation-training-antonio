// Day 4 tests — do not edit. Run: npm run drills:day04
// Starts its own sandbox on port 4021 with TODAY pinned, so results are repeatable.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import { login, getJson, TallyPayClient } from './day04-async.ts';

const BASE = 'http://localhost:4021';
let server: ChildProcess;

before(async () => {
  server = spawn(process.execPath, ['sandbox/server.js'], { env: { ...process.env, PORT: '4021', TODAY: '2026-12-01' }, stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(BASE + '/api/health')).ok) return; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('sandbox did not start on port 4021 (run the tests from the repo root)');
});
after(() => { server?.kill(); });

test('login returns a token for valid credentials', async () => {
  const token = await login(BASE, 'ana.admin', 'Train#2026');
  assert.equal(typeof token, 'string');
  assert.ok(token.length >= 16);
});
test('login throws with the status code on bad credentials', async () => {
  await assert.rejects(login(BASE, 'ana.admin', 'wrong'), /401/);
});
test('getJson returns status and body, including errors', async () => {
  const token = await login(BASE, 'vic.viewer', 'Train#2026');
  const me = await getJson<{ username: string; role: string }>(BASE, '/api/me', token);
  assert.equal(me.status, 200);
  assert.equal(me.body.role, 'payroll_viewer');
  const missing = await getJson<{ error: string }>(BASE, '/api/employees/E999', token);
  assert.equal(missing.status, 404);
  assert.equal(missing.body.error, 'Employee not found');
});
test('TallyPayClient requires login', async () => {
  const c = new TallyPayClient(BASE);
  await assert.rejects(c.claims(), /Not logged in/);
});
test('TallyPayClient lists and filters claims', async () => {
  const c = new TallyPayClient(BASE);
  await c.login('ana.admin', 'Train#2026');
  const all = await c.claims();
  assert.equal(all.status, 200);
  assert.equal(all.body.length, 13); // company C1 only (C2 claims are not visible to ana.admin)
  const submitted = await c.claims('Submitted');
  assert.ok(submitted.body.length > 0);
  assert.ok(submitted.body.every((x) => x.status === 'Submitted'));
});
test('TallyPayClient creates a claim and returns API errors without throwing', async () => {
  const c = new TallyPayClient(BASE);
  await c.login('ana.admin', 'Train#2026');
  const ok = await c.createClaim({ employeeId: 'E101', date: '2026-12-01', hours: 2, type: 'Regular' });
  assert.equal(ok.status, 201);
  assert.equal(ok.body.amount, 237.5);
  assert.equal(ok.body.status, 'Submitted');
  const bad = await c.createClaim({ employeeId: 'E101', date: '2026-12-02', hours: 2, type: 'Regular' });
  assert.equal(bad.status, 400);
  assert.match(bad.body.error ?? '', /future/);
});
