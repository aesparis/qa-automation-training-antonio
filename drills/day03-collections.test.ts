// Day 3 tests — do not edit. Run: npm run drills:day03
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activeEmployees, findEmployee, totalHours, wouldExceedCap, countByStatus, summaryLine, sortByAmountDesc } from './day03-collections.ts';
import type { Employee, Claim } from './day03-collections.ts';

const employees: Employee[] = [
  { id: 'E101', name: 'Maria Santos', companyId: 'C1', hourlyRate: 95, status: 'Active' },
  { id: 'E106', name: 'Grace Lim', companyId: 'C1', hourlyRate: 97.25, status: 'Terminated' },
  { id: 'E104', name: 'Liza Ramos', companyId: 'C1', hourlyRate: 88.75, status: 'Active' },
];
const claims: Claim[] = [
  { id: 'OT-1', employeeId: 'E104', date: '2026-12-01', hours: 12, type: 'Regular', status: 'Approved', amount: 1331.25 },
  { id: 'OT-2', employeeId: 'E104', date: '2026-12-02', hours: 12, type: 'Regular', status: 'Paid', amount: 1331.25 },
  { id: 'OT-3', employeeId: 'E104', date: '2026-12-03', hours: 10, type: 'Regular', status: 'Submitted', amount: 1109.38 },
  { id: 'OT-4', employeeId: 'E104', date: '2026-12-04', hours: 8, type: 'Regular', status: 'Rejected', amount: 887.5 },
  { id: 'OT-5', employeeId: 'E104', date: '2026-11-30', hours: 6, type: 'Holiday', status: 'Paid', amount: 1065 },
  { id: 'OT-6', employeeId: 'E101', date: '2026-12-01', hours: 2, type: 'Regular', status: 'Submitted', amount: 237.5 },
];

test('activeEmployees keeps only Active, in order', () => {
  assert.deepEqual(activeEmployees(employees).map((e) => e.id), ['E101', 'E104']);
});
test('findEmployee finds by id or returns undefined', () => {
  assert.equal(findEmployee(employees, 'E106')?.name, 'Grace Lim');
  assert.equal(findEmployee(employees, 'E999'), undefined);
});
test('totalHours counts Submitted, Approved and Paid in the month only', () => {
  assert.equal(totalHours(claims, 'E104', '2026-12'), 34);
  assert.equal(totalHours(claims, 'E104', '2026-11'), 6);
  assert.equal(totalHours(claims, 'E101', '2026-12'), 2);
  assert.equal(totalHours(claims, 'E999', '2026-12'), 0);
});
test('wouldExceedCap: exactly 40 is allowed, over 40 is not', () => {
  assert.equal(wouldExceedCap(claims, 'E104', '2026-12', 6), false);
  assert.equal(wouldExceedCap(claims, 'E104', '2026-12', 6.5), true);
  assert.equal(wouldExceedCap(claims, 'E104', '2026-12', 2, 35), true);
});
test('countByStatus includes every status', () => {
  assert.deepEqual(countByStatus(claims), { Submitted: 2, Approved: 1, Rejected: 1, Paid: 2 });
  assert.deepEqual(countByStatus([]), { Submitted: 0, Approved: 0, Rejected: 0, Paid: 0 });
});
test('summaryLine formats one report line', () => {
  assert.equal(summaryLine(claims[5]!, employees[0]!), 'OT-6 · Maria Santos · 2h Regular · PHP 237.50');
  assert.equal(summaryLine(claims[4]!, employees[2]!), 'OT-5 · Liza Ramos · 6h Holiday · PHP 1065.00');
});
test('sortByAmountDesc returns a new sorted array and leaves the input alone', () => {
  const before = claims.map((c) => c.id);
  const sorted = sortByAmountDesc(claims);
  assert.deepEqual(sorted.map((c) => c.id), ['OT-1', 'OT-2', 'OT-3', 'OT-5', 'OT-4', 'OT-6']);
  assert.deepEqual(claims.map((c) => c.id), before);
  assert.notEqual(sorted, claims);
});
