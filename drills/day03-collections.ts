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
  return list.filter(employee => employee.status === 'Active');
}

/** The employee with this id, or undefined if there is none. */
export function findEmployee(list: Employee[], id: string): Employee | undefined {
  // TODO (use .find)
  return list.find(employee => employee.id === id);
}

/** Total hours for one employee in one month ("YYYY-MM"), counting Submitted, Approved and Paid claims (not Rejected). */
export function totalHours(claims: Claim[], employeeId: string, month: string): number {
  // TODO (filter, then reduce)
  return claims
  .filter(claim =>
    claim.employeeId === employeeId &&
    claim.date.startsWith(month) &&
    (claim.status === 'Submitted' ||
      claim.status === 'Approved' ||
      claim.status === 'Paid')
  )
  .reduce((total, claim) => total + claim.hours, 0);
}

/** True when adding newHours would take the month over the cap. Exactly reaching the cap is allowed. */
export function wouldExceedCap(claims: Claim[], employeeId: string, month: string, newHours: number, cap: number = 40): boolean {
  // TODO (reuse totalHours)
  const currentHours = totalHours(claims, employeeId, month);
  return currentHours + newHours > cap;
}

/** How many claims are in each status. Every status must be present, with 0 when there are none. */
export function countByStatus(claims: Claim[]): Record<ClaimStatus, number> {
  // TODO
 const counts: Record<ClaimStatus, number> = {
  Submitted: 0,
  Approved: 0,
  Rejected: 0,
  Paid: 0,
};
for (const claim of claims) {
  counts[claim.status]++;
}
return counts; 
}

/** One line for a report, e.g. "OT-5001 · Maria Santos · 2h Regular · PHP 237.50" (amount always with 2 decimals). Use a template literal. */
export function summaryLine(claim: Claim, employee: Employee): string {
  // TODO
  return `${claim.id} · ${employee.name} · ${claim.hours}h ${claim.type} · PHP ${claim.amount.toFixed(2)}`;
}

/** A NEW array sorted by amount, highest first. The input array must not change. */
export function sortByAmountDesc(claims: Claim[]): Claim[] {
  // TODO
  return [...claims].sort((a, b) => b.amount - a.amount);  
}
