## MT-1 (Day 4) — Rice allowance

**Story.** As a Payroll Admin, I want TallyPay to add the monthly rice allowance to each payslip automatically.

- **AC1** Every Active employee gets a rice allowance of ₱2,000.00 per calendar month.
- **AC2** An employee hired during the month gets it pro-rated by calendar days employed: ₱2,000.00 × days employed in the month ÷ days in the month, rounded to the cent.
- **AC3** Employees on unpaid leave for more than 10 working days in the month get no rice allowance that month.
- **AC4** The payslip shows a "Rice Allowance" earning line.


**ID: AC01**
**Title:** Verify that an active employee with no unpaid leave more than 10 working days get a rice allowance of ₱2,000.00
**Pre-condition:** User must be a payroll admin, existing active employee with no 10 days unpaid leave
**Step 1:** Open TallyPay app and login an admin user
**Expected Result:** Should be able to login successfully
**Step 2:** Go to Employee page > select an active employee with no 10 unpaid leave days and generate a payslip
**Expected Result:**
    * Payslip should show a "Rice Allowance" earning line.
    * "Rice Allowance" line should show ₱2,000.00 (Note:If the employee is already working for the company for more than a month already)

**ID: AC02**
**Title:** Verify that an active employee with unpaid leave more than 10 working days does NOT get a rice allowance
**Pre-condition:** User must be a payroll admin, existing active employee with 10 days unpaid leave
**Step 1:** Open TallyPay app and login an admin user
**Expected Result:** Should be able to login successfully
**Step 2:** Go to Employee page > select an active employee with 10 unpaid leave days and generate a payslip
**Expected Result:**
    * Payslip should show a "Rice Allowance" earning line.
    * "Rice Allowance" line should be showing 0.00

**ID: AC03**
**Title:** Verify that an active employee hired during the month gets pro-rated rice allowance by calendar days employed
**Pre-condition:** User must be a payroll admin, existing active employee hired during the month
**Step 1:** Open TallyPay app and login an admin user
**Expected Result:** Should be able to login successfully
**Step 2:** Go to Employee page > select an active employee that is hired during the month and generate a payslip for that month
**Expected Result:**
    * Payslip should show a "Rice Allowance" earning line.
    * "Rice Allowance" line should show pro-rated amount of 666.67
       *Days employed =  5
       *Days in the month = 15
        Calculation:
        = ₱2,000.00 × days employed in the month ÷ days in the month, rounded to the cent.
        = (₱2,000.00 * 5) / 15
        = 10000 / 15
        = 666.67

**OPEN QUESTIONS**
1. If the employee has more than 10 unpaid leaves, should the "Rice Allowance" earning line show empty or 0.00? I would assume it's 0.00.

**TOP 3 CASES**
 - All cases above since it cover all requirements