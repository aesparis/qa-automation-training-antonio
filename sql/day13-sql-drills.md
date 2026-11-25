# Day 13 — SQL drills on the TallyPay payroll database (self-administered, no EM send)

**Database:** `sql/payroll.db` (SQLite). Open it in **DB Browser for SQLite** (Open Database → Execute SQL tab). Read `sql/payroll-schema.sql` first, especially the business rules at the bottom.

**How to work**
- Write every query in `sql/day13-drills.sql`, one block per drill, with a comment line above it: `-- D13.05`.
- Under each query, record the result as a comment: the row count, and the value(s) if the result is one or two numbers. Example: `-- Result: 4 rows` or `-- Result: 301224.43`.
- Your clients use **SQL Server (MSSQL)**. Where the syntax differs, write the SQL Server version as a comment too (for example `LIMIT 5` in SQLite is `TOP 5` in SQL Server; `||` string join is `+` or `CONCAT`).
- Read-only: use `SELECT` only. Never `UPDATE` or `DELETE` a database you are validating.

## Drills

| # | Task |
|---|---|
| D13.01 | List the id, full name and status of every employee in company `C2`. |
| D13.02 | Count employees per company (one row per company). |
| D13.03 | List each distinct `status` value in `employees` and how many employees have it. Write one sentence about what you notice. |
| D13.04 | Employees hired on or after 2022-01-01, newest hire first. |
| D13.05 | Company C1's pay runs with period start, period end and pay date, in date order. |
| D13.06 | For pay run 1, how many payslip lines of each `line_type` are there? |
| D13.07 | Total of all `EARNING` lines in pay run 1 (one number). |
| D13.08 | Net pay per employee in pay run 1 (earnings minus deductions), with the employee's name, highest first. Hint: `SUM(CASE WHEN kind = 'EARNING' THEN amount ELSE -amount END)`. |
| D13.09 | Who had an `OVERTIME` line in pay run 1, and how much? |
| D13.10 | Which C1 employees were paid in run 1 but had **no** `OVERTIME` line? Use `NOT EXISTS` or a `LEFT JOIN … IS NULL`. |
| D13.11 | Average `monthly_basic` per company, rounded to 2 decimals. |
| D13.12 | Employees whose `monthly_basic` is above their own company's average (use a subquery). |
| D13.13 | Total bank transfers per pay run for company C2. |
| D13.14 | For pay run 5, list each transfer with the employee's name, the amount and the run's pay date (three tables). |
| D13.15 | Rewrite D13.08 in SQL Server syntax so it returns only the top 3 earners. You can't run it here; write it as a comment and explain each difference from your SQLite version. |

**Deliverable:** `day-13-sql-drills-pr`, a PR adding `sql/day13-drills.sql` with every query and its recorded result.
