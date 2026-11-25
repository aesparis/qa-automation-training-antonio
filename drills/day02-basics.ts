// Day 2 drills — variables, types, operators, conditionals and loops.
// Payroll rules are from sandbox/README.md §3 and §4.

/** Multiplier for an overtime type: Regular 1.25, RestDay 1.30, Holiday 2.00. Any other value: throw an Error whose message contains "Unknown type". */
export function overtimeMultiplier(type: string): number {
  switch (type) {
    case 'Regular':
      return 1.25;
    case 'RestDay':
      return 1.3;
    case 'Holiday':
      return 2;
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

/** True when hours is from 0.5 to 12 inclusive, in steps of 0.5. */
export function isValidHours(hours: number): boolean {
  return hours >= 0.5 && hours <= 12 && hours % 0.5 === 0;
}

/** Round to 2 decimal places, half up (e.g. 414.375 -> 414.38). Hint: Math.round((n + Number.EPSILON) * 100) / 100 */
export function roundToCents(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Overtime amount = hourlyRate × hours × multiplier, rounded to cents. Throw an Error containing "Invalid hours" when hours is not valid. */
export function overtimeAmount(hourlyRate: number, hours: number, type: string): number {
  if (!isValidHours(hours)) {
    throw new Error(`Invalid hours: ${hours}`);
  }
  const multiplier = overtimeMultiplier(type);
  return roundToCents(hourlyRate * hours * multiplier);
}

/** 'invalid' when hours is not valid; 'short' up to 2 hours; 'standard' over 2 and up to 8; 'long' over 8. */
export function classifyHours(hours: number): 'invalid' | 'short' | 'standard' | 'long' {
  if (!isValidHours(hours)) {
    return 'invalid';
  }
  if (hours <= 2) {
    return 'short';
  }
  if (hours <= 8) {
    return 'standard';
  }
  return 'long';
}

/** How many entries in the list are valid hours (use a for...of loop). */
export function countValid(hoursList: number[]): number {
  let count = 0;
  for (const hours of hoursList) {
    if (isValidHours(hours)) count++;
  }
  return count;
}

/** Two-sided boundary values for a range: [min - step, min, max, max + step]. Example: (0.5, 12, 0.5) -> [0, 0.5, 12, 12.5] */
export function boundaryValues(min: number, max: number, step: number): number[] {
  return [min - step, min, max, max + step];
}
