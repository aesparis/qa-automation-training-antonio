# Mini-tickets — 20-minute test-design reps (Days 4, 7 and 10; self-administered, no EM send)

One small ticket per rep. Open it only on its day, set a 20-minute timer, and design the tests **before** you look at anything else. Write the answer in `test-design/MT-N.md` and add it to that day's PR.

Each answer has four short parts:
1. **Partitions and boundaries** — two-sided, for every number, date or time in the ticket.
2. **Three expected results you computed yourself** — exact pesos, minutes or counts, with the arithmetic.
3. **Three open questions**, each with the answer you'll assume until someone replies.
4. **Your top 3 cases** if you only had 10 minutes, with one line of risk reasoning each.

Stop at 20 minutes, even mid-sentence. Speed under a time box is part of the skill.

---

## MT-1 (Day 4) — Rice allowance

**Story.** As a Payroll Admin, I want TallyPay to add the monthly rice allowance to each payslip automatically.

- **AC1** Every Active employee gets a rice allowance of ₱2,000.00 per calendar month.
- **AC2** An employee hired during the month gets it pro-rated by calendar days employed: ₱2,000.00 × days employed in the month ÷ days in the month, rounded to the cent.
- **AC3** Employees on unpaid leave for more than 10 working days in the month get no rice allowance that month.
- **AC4** The payslip shows a "Rice Allowance" earning line.

---

## MT-2 (Day 7) — Tardiness deduction

**Story.** As a Payroll Admin, I want late arrivals deducted from pay automatically, so that we stop calculating them by hand.

- **AC1** Lateness is measured in minutes from the scheduled shift start to the first clock-in of the day.
- **AC2** A grace period of up to 10 minutes per day applies: lateness within the grace period is not deducted.
- **AC3** Deduction = hourly rate ÷ 60 × minutes deducted, rounded to the cent. At most 60 minutes are deducted per day; anything later is handled as a half-day absence by HR.
- **AC4** No deduction on public holidays or on approved leave days.

---

## MT-3 (Day 10) — Payslip email release

**Story.** As a Payroll Admin, I want payslips emailed to employees automatically on pay day.

- **AC1** Payslips are emailed at 08:00 on the pay date, company time (Asia/Manila).
- **AC2** Only Active employees with a verified email address receive one; everyone else appears in a "Not sent" list with the reason.
- **AC3** A Payroll Admin can resend one employee's payslip, at most 3 resends per employee per pay run. A Payroll Viewer cannot resend.
- **AC4** The email has the payslip attached as a password-protected PDF; the password is the employee's date of birth (YYYYMMDD).
