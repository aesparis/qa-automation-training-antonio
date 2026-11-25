-- TallyPay payroll practice database (SQLite). Training data only: names, accounts and rates are fictional,
-- and the deduction rates are simplified (not the real SSS, PhilHealth, Pag-IBIG or BIR tables).

CREATE TABLE companies (
  id   TEXT PRIMARY KEY,          -- 'C1', 'C2'
  name TEXT NOT NULL
);

CREATE TABLE employees (
  id               INTEGER PRIMARY KEY,
  company_id       TEXT NOT NULL REFERENCES companies(id),
  full_name        TEXT NOT NULL,
  status           TEXT NOT NULL,  -- should be 'Active' or 'Terminated'
  hire_date        TEXT NOT NULL,  -- YYYY-MM-DD
  termination_date TEXT,           -- YYYY-MM-DD, NULL while employed
  monthly_basic    REAL NOT NULL,  -- PHP per month
  bank_account     TEXT NOT NULL   -- account on file for salary credit
);

CREATE TABLE pay_runs (
  id           INTEGER PRIMARY KEY,
  company_id   TEXT NOT NULL REFERENCES companies(id),
  period_start TEXT NOT NULL,
  period_end   TEXT NOT NULL,
  pay_date     TEXT NOT NULL,
  status       TEXT NOT NULL       -- 'Open' or 'Closed'
);

CREATE TABLE payslip_lines (
  id          INTEGER PRIMARY KEY,
  pay_run_id  INTEGER NOT NULL REFERENCES pay_runs(id),
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  line_type   TEXT NOT NULL,      -- BASIC, OVERTIME, ALLOWANCE, SSS, PHILHEALTH, PAGIBIG, TAX
  kind        TEXT NOT NULL,      -- 'EARNING' or 'DEDUCTION' (amount is always positive)
  amount      REAL NOT NULL
);

CREATE TABLE bank_transfers (
  id           INTEGER PRIMARY KEY,
  pay_run_id   INTEGER NOT NULL REFERENCES pay_runs(id),
  employee_id  INTEGER NOT NULL REFERENCES employees(id),
  amount       REAL NOT NULL,     -- should equal the employee's net pay for that run
  bank_account TEXT NOT NULL,     -- account the money was sent to
  status       TEXT NOT NULL      -- 'Sent'
);

-- Business rules the data should follow:
--  * net pay per employee per run = SUM(EARNING lines) - SUM(DEDUCTION lines)
--  * each employee has at most one line per line_type per run
--  * every payslip in a run has exactly one bank transfer, for the net pay, to the account on file
--  * an employee is paid in a run only if employed during the period; a leaver's BASIC is pro-rated
--    to the termination date (calendar days); a new joiner's BASIC is pro-rated from the hire date
