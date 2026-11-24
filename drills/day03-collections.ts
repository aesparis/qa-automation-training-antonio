// Day 3 drills — interfaces, union types, arrays, objects, functions and modules.

export type ClaimType = 'Regular' | 'RestDay' | 'Holiday';
export type ClaimStatus = 'Submitted' | 'Approved' | 'Rejected' | 'Paid';

export interface Employee {
  id: string;
  name: string;
  companyId: string;
  hourlyRate: number;
  status: 'Active' | 'Terminated';
}

export interface Claim {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  hours: number;
  type: ClaimType;
  status: ClaimStatus;
  amount: number;
}

/** Only the Active employees, in the same order. */
export function activeEmployees(list: Employee[]): Employee[] {
  // TODO (use .filter)
  throw new Error('TODO');
}

/** The employee with this id, or undefined if there is none. */
export function findEmployee(list: Employee[], id: string): Employee | undefined {
  // TODO (use .find)
  throw new Error('TODO');
}

/** Total hours for one employee in one month ("YYYY-MM"), counting Submitted, Approved and Paid claims (not Rejected). */
export function totalHours(claims: Claim[], employeeId: string, month: string): number {
  // TODO (filter, then reduce)
  throw new Error('TODO');
}

/** True when adding newHours would take the month over the cap. Exactly reaching the cap is allowed. */
export function wouldExceedCap(claims: Claim[], employeeId: string, month: string, newHours: number, cap: number = 40): boolean {
  // TODO (reuse totalHours)
  throw new Error('TODO');
}

/** How many claims are in each status. Every status must be present, with 0 when there are none. */
export function countByStatus(claims: Claim[]): Record<ClaimStatus, number> {
  // TODO
  throw new Error('TODO');
}

/** One line for a report, e.g. "OT-5001 · Maria Santos · 2h Regular · PHP 237.50" (amount always with 2 decimals). Use a template literal. */
export function summaryLine(claim: Claim, employee: Employee): string {
  // TODO
  throw new Error('TODO');
}

/** A NEW array sorted by amount, highest first. The input array must not change. */
export function sortByAmountDesc(claims: Claim[]): Claim[] {
  // TODO
  throw new Error('TODO');
}
