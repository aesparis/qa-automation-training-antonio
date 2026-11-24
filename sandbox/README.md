# TallyPay Overtime — practice app and API (training sandbox)

A small payroll overtime app you run on your own computer. It has a web UI and a REST API, and it is your test target for Days 5 to 12. It contains deliberate defects. Your job is to find them with tests, not by reading `server.js`. Treat this README as the **specification**: where the app and this README disagree, the README is right and the app has a defect.

## 1. Run it

```bash
cd sandbox
node server.js          # needs Node.js 22.18 or later (Node 24 LTS recommended), no npm install needed
```

- Web UI: <http://localhost:4020>
- API: `http://localhost:4020/api/...`
- Health check: `GET /api/health` returns `{ "ok": true, "version": "1.0.0", "today": "YYYY-MM-DD" }`
- Data lives in memory. Restarting the server, or calling `POST /api/test/reset` (no token needed), restores the seed data. Reset before each test run so your tests don't depend on each other.
- "Today" is today's date in the Philippines (Asia/Manila). For repeatable runs you can pin it: `TODAY=2026-12-01 node server.js` (PowerShell: `$env:TODAY="2026-12-01"; node server.js`).

## 2. Users (fictional, training only)

All passwords are `Train#2026`.

| Username | Name | Role | Company |
|---|---|---|---|
| `ana.admin` | Ana Torres | Payroll Admin (`payroll_admin`) | C1 Harbor Foods PH |
| `ben.admin` | Ben Uy | Payroll Admin | C1 Harbor Foods PH |
| `vic.viewer` | Vic Ocampo | Payroll Viewer (`payroll_viewer`) | C1 Harbor Foods PH |
| `cora.admin` | Cora Lim | Payroll Admin | C2 Northwind Logistics PH |
| `dan.admin` | Dan Sy | Payroll Admin | C2 Northwind Logistics PH |

## 3. Overtime claim rules

- A claim is for one employee, one date, a number of hours, and a type.
- **Hours:** from 0.5 to 12 inclusive, in steps of 0.5 (0.5, 1, 1.5 … 12). Anything else is rejected with **400**.
- **Date:** `YYYY-MM-DD`. Not in the future. At most 30 days ago: today minus 30 days is allowed, today minus 31 days is rejected. Not before the employee's hire date. Each of these is rejected with **400**.
- **Employee:** must exist in your company (**404** otherwise) and be `Active` (**422** if `Terminated`).
- A new claim starts as `Submitted`.

## 4. Amount

`amount = hourlyRate × hours × multiplier`, rounded to 2 decimal places (half up).

| Type (API value) | UI label | Multiplier |
|---|---|---|
| `Regular` | Regular day | 1.25 |
| `RestDay` | Rest day | 1.30 |
| `Holiday` | Holiday | 2.00 |

Any other `type` value is rejected with **400**. Example: Maria Santos (E101, ₱95.00/hour), 2 hours, Regular → 95.00 × 2 × 1.25 = **237.50**.

## 5. Monthly cap

An employee can have at most **40 overtime hours per calendar month**, counting every claim in that month that is `Submitted`, `Approved` or `Paid` (not `Rejected`). A claim that would take the month over 40 hours is rejected with **422**. Exactly 40 is allowed.

## 6. Roles and access

- **Payroll Admin:** create, approve, reject and mark claims paid, in their own company only.
- **Payroll Viewer:** read only. Any create, approve, reject or pay request returns **403**.
- **No one approves or rejects a claim they created.** A second Payroll Admin must do it (**403** for the creator).
- **Company isolation:** users see only their own company's employees and claims. Asking for another company's employee or claim by ID returns **404**, exactly as if it did not exist.
- **Authentication:** a missing or invalid token returns **401**.

## 7. Status flow

`Submitted → Approved → Paid` or `Submitted → Rejected`. Any other move returns **409**. Rejecting needs a non-empty `reason` (**400** without one). `Paid` and `Rejected` are final.

## 8. API reference

All endpoints except login, health and reset need `Authorization: Bearer <token>`. Bodies are JSON.

| Method | Path | Body | Success |
|---|---|---|---|
| POST | `/api/auth/login` | `{ "username", "password" }` | 200 `{ token, username, role, companyId, displayName }` (401 on bad credentials) |
| GET | `/api/health` | | 200 |
| POST | `/api/test/reset` | | 204 |
| GET | `/api/me` | | 200 current user |
| GET | `/api/employees` | | 200 list (your company) |
| GET | `/api/employees/{id}` | | 200 employee |
| GET | `/api/overtime-claims?status=&employeeId=` | | 200 list (your company), both filters optional |
| GET | `/api/overtime-claims/{id}` | | 200 claim |
| POST | `/api/overtime-claims` | `{ "employeeId", "date", "hours", "type", "note"? }` | **201** claim |
| POST | `/api/overtime-claims/{id}/approve` | | 200 claim |
| POST | `/api/overtime-claims/{id}/reject` | `{ "reason" }` | 200 claim |
| POST | `/api/overtime-claims/{id}/pay` | | 200 claim |
| GET | `/api/monthly-summary?month=YYYY-MM` | | 200 `{ month, rows: [{ employeeId, name, hours, amount }] }` (Approved + Paid only) |

Error responses always look like `{ "error": "message" }`.

## 9. Seed data you can rely on

After a reset (all dates are relative to "today"):

- Employees in C1: E101 Maria Santos (₱95.00/h), E102 Jose Reyes (₱110.50/h), E103 Andrea Cruz (₱187.50/h), E104 Liza Ramos (₱88.75/h), E105 Paolo Garcia (₱102.00/h), E106 Grace Lim (Terminated), E107 Ramon Dela Cruz (hired 10 days ago), E108 Nina Bautista. C2: E201, E202, E203.
- Claims OT-5001 to OT-5015. OT-5001 (created by `ana.admin`) and OT-5002 (created by `ben.admin`) are `Submitted`. OT-5012 belongs to company C2.
- E104 Liza Ramos already has 36 hours (Approved/Paid) this month. E105 Paolo Garcia already has 36 hours `Submitted` this month.

## 10. Web UI

- `/` sign in (Username, Password, **Sign in**). A failed sign-in shows the error in an alert.
- `/claims.html` lists claims with a **Status** filter. Admins see **New claim**, and for claims created by someone else they see **Approve** and **Reject** (Reject asks for a reason, then **Confirm reject**). Approved claims show **Mark paid**. After an action, the row's status must show the new status.
- `/new-claim.html` creates a claim (Employee, Date, Hours, Type, Note, **Submit claim**). Success shows `Claim OT-xxxx submitted — amount ₱…`; errors show in an alert.
