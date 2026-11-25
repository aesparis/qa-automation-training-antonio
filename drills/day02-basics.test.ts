// Day 2 tests — do not edit. Run: npm run drills:day02
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { overtimeMultiplier, isValidHours, roundToCents, overtimeAmount, classifyHours, countValid, boundaryValues } from './day02-basics.ts';

test('overtimeMultiplier returns the README multipliers', () => {
  assert.equal(overtimeMultiplier('Regular'), 1.25);
  assert.equal(overtimeMultiplier('RestDay'), 1.3);
  assert.equal(overtimeMultiplier('Holiday'), 2);
});
test('overtimeMultiplier rejects unknown types', () => {
  assert.throws(() => overtimeMultiplier('Night'), /Unknown type/);
  assert.throws(() => overtimeMultiplier('regular'), /Unknown type/);
});
test('isValidHours: boundaries and steps', () => {
  for (const ok of [0.5, 1, 7.5, 12]) assert.equal(isValidHours(ok), true, `${ok} should be valid`);
  for (const bad of [0, -1, 0.25, 12.5, 13, 1.3]) assert.equal(isValidHours(bad), false, `${bad} should be invalid`);
});
test('roundToCents rounds half up to 2 decimals', () => {
  assert.equal(roundToCents(414.375), 414.38);
  assert.equal(roundToCents(237.5), 237.5);
  assert.equal(roundToCents(1.005), 1.01);
  assert.equal(roundToCents(10.004), 10);
});
test('overtimeAmount matches worked examples', () => {
  assert.equal(overtimeAmount(95, 2, 'Regular'), 237.5);
  assert.equal(overtimeAmount(110.5, 3, 'RestDay'), 430.95);
  assert.equal(overtimeAmount(187.5, 4, 'Holiday'), 1500);
  assert.equal(overtimeAmount(88.75, 0.5, 'Regular'), 55.47);
  assert.throws(() => overtimeAmount(95, 12.5, 'Regular'), /Invalid hours/);
});
test('classifyHours buckets', () => {
  assert.equal(classifyHours(0.25), 'invalid');
  assert.equal(classifyHours(2), 'short');
  assert.equal(classifyHours(2.5), 'standard');
  assert.equal(classifyHours(8), 'standard');
  assert.equal(classifyHours(8.5), 'long');
  assert.equal(classifyHours(12.5), 'invalid');
});
test('countValid counts valid entries', () => {
  assert.equal(countValid([0.5, 12, 12.5, 0, 3]), 3);
  assert.equal(countValid([]), 0);
});
test('boundaryValues produces two-sided boundaries', () => {
  assert.deepEqual(boundaryValues(0.5, 12, 0.5), [0, 0.5, 12, 12.5]);
  assert.deepEqual(boundaryValues(1, 40, 1), [0, 1, 40, 41]);
});
