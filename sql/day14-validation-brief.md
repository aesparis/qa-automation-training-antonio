# Day 14 — Payroll data validation brief (self-administered, no EM send)

**Database:** `sql/payroll.db`. **Pay run in scope:** run 2 (company C1, August 2026). Use `SELECT` only.

## Part 1 — A sign-off check that cannot fail

Before the August pay date, a teammate signed off the bank file with this query and wrote "12 transfers, 12 payslips, all good":

```sql
SELECT COUNT(*) FROM bank_transfers WHERE pay_run_id = 2;
```

1. Explain in two or three sentences why this check would pass even if several people were paid the wrong amount.
2. Write **four checks that return 0 rows when run 2 is correct** and return the problem rows when it isn't:
   - (a) a bank transfer amount that differs from that employee's net pay
   - (b) an employee with more than one line of the same `line_type` in the run
   - (c) a payslip with no bank transfer, or a bank transfer with no payslip
   - (d) a transfer sent to an account that isn't the employee's account on file
3. Run all four against run 2 and record what each returns.

## Part 2 — "The dashboard says 8"

The payroll dashboard shows **8** active employees in Harbor Foods PH (C1). The HR team's headcount says **10**.

1. Find out who is right, and which employees explain the difference. Show the queries.
2. Write the likely cause of the dashboard's number as a bug report (title, environment, steps or query, expected, actual, severity, evidence).
3. Write a short message (under 120 words) to the payroll lead explaining what you found, in plain language.

## Part 3 — Totals that match are not proof

Finance compares two totals for August: the bank file total and the payroll register's total net pay.

1. Compute both totals for run 2. Do they match? If not, which employee(s) explain the difference?
2. Then answer the harder question: **can totals match while an employee is still paid wrongly?** Look for an example in run 2 and explain it.

## Write-up

`sql/day14-findings.md`: one section per part, each finding with the query, the rows it returned, the impact (who is over- or under-paid, by how much), and what you would do next.

**Deliverable:** `day-14-data-validation-pr`, a PR adding `sql/day14-validation.sql` and `sql/day14-findings.md`.
