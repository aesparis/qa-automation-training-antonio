// Day 2 drills — variables, types, operators, conditionals and loops.
// Payroll rules are from sandbox/README.md §3 and §4.

/** Multiplier for an overtime type: Regular 1.25, RestDay 1.30, Holiday 2.00. Any other value: throw an Error whose message contains "Unknown type". */
export function overtimeMultiplier(type: string): number {
  // TODO
  throw new Error('TODO');
}

/** True when hours is from 0.5 to 12 inclusive, in steps of 0.5. */
export function isValidHours(hours: number): boolean {
  // TODO
  throw new Error('TODO');
}

/** Round to 2 decimal places, half up (e.g. 414.375 -> 414.38). Hint: Math.round((n + Number.EPSILON) * 100) / 100 */
export function roundToCents(n: number): number {
  // TODO
  throw new Error('TODO');
}

/** Overtime amount = hourlyRate × hours × multiplier, rounded to cents. Throw an Error containing "Invalid hours" when hours is not valid. */
export function overtimeAmount(hourlyRate: number, hours: number, type: string): number {
  // TODO
  throw new Error('TODO');
}

/** 'invalid' when hours is not valid; 'short' up to 2 hours; 'standard' over 2 and up to 8; 'long' over 8. */
export function classifyHours(hours: number): 'invalid' | 'short' | 'standard' | 'long' {
  // TODO
  throw new Error('TODO');
}

/** How many entries in the list are valid hours (use a for...of loop). */
export function countValid(hoursList: number[]): number {
  // TODO
  throw new Error('TODO');
}

/** Two-sided boundary values for a range: [min - step, min, max, max + step]. Example: (0.5, 12, 0.5) -> [0, 0.5, 12, 12.5] */
export function boundaryValues(min: number, max: number, step: number): number[] {
  // TODO
  throw new Error('TODO');
}
