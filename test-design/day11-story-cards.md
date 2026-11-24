# Day 11 — Test design story cards (self-administered, no EM send)

Two cards. For each one, design the tests **before** you touch the app. Label every case with the technique that produced it: `EP` (equivalence partition), `BVA` (boundary value), `DT` (decision table), `ST` (state transition), `EG` (error guessing).

Write expected results as **exact values** you computed yourself (amounts to the cent, status codes, statuses), never "amount is correct".

---

## Card 1 — TP-301 Overtime claims (the rules you have been testing)

**Source:** `sandbox/README.md` §3 to §7. Treat it as a new story you are designing from scratch, even though you have tested parts of it.

Produce `test-design/day11-TP-301.md` with:

1. **Partitions and boundaries** for: hours; claim date relative to today; claim date relative to hire date; monthly cap (existing hours + new hours). Each boundary two-sided (the last valid value and the first invalid value on each side).
2. **Decision table** for *"can this user approve this claim?"* with these conditions: role (Admin / Viewer), is the creator (yes / no), same company (yes / no), claim status (Submitted / other). One column per rule, the expected HTTP status in the action row. Collapse columns that can't matter, and say why.
3. **State-transition table** for claim status: every status × every action (approve, reject, pay), valid and invalid, with the expected status code.
4. **Computed amounts**: for each type (Regular, Rest day, Holiday), one case with E101 (₱95.00/h) and one with E104 (₱88.75/h). Pick hours so at least one result needs half-up rounding. Show the arithmetic.
5. **Top 5**: if you had 30 minutes before a release, which 5 cases run first, with one line of risk reasoning each (money, access, data integrity, frequency).

## Card 2 — TP-322 13th-month pay

**Story:** As a Payroll Admin, I want TallyPay to compute each employee's 13th-month pay so that it is paid correctly and on time.

**Acceptance criteria**
- **AC1** 13th-month pay = total basic salary actually earned from Jan 1 to Dec 31 of the year ÷ 12, rounded to the cent.
- **AC2** Only employees who worked at least one month during the year are entitled.
- **AC3** Overtime, allowances and other premiums are **not** part of basic salary for this computation. Unpaid leave deductions **reduce** basic salary earned.
- **AC4** Employees who leave during the year receive it pro-rated (by basic actually earned) in their final pay. Everyone else receives it on or before December 24.
- **AC5** The payslip shows a separate "13th Month Pay" earning line.

**Data for your computed cases (year 2026, monthly basic is constant unless stated):**

| Employee | Monthly basic | Employment in 2026 | Other facts |
|---|---|---|---|
| A | ₱24,000.00 | Full year | ₱18,500 overtime during the year |
| B | ₱30,000.00 | Hired 2026-07-01 | |
| C | ₱20,000.00 | Full year | 3 unpaid leave days in March, ₱2,298.85 deducted |
| D | ₱26,500.00 | Left 2026-04-15 | Paid ₱26,500 × 3 months + ₱12,822.58 for April 1–15 |

Produce `test-design/day11-TP-322.md` with:
1. The expected 13th-month amount for A, B, C and D, with the arithmetic.
2. Partitions and boundaries for entitlement (AC2), including the edge around "one month".
3. An **open questions log**: at least 6 questions you would ask the Product Owner before testing, each with the default you would assume if no one answers, and the risk if your assumption is wrong. (Example topic: does "one month" mean 30 days, a calendar month, or a full pay period?)
4. Your top 5 cases in risk order.

**Deliverable:** `day-11-test-design-pr`, a PR adding both files.
