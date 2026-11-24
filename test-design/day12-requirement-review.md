# Day 12 — Requirement review: TP-340 Bulk approve (self-administered, no EM send)

Read the story the way you would before sprint planning. You are not testing an app today for this part: you are testing the **requirement**.

**Story:** As a Payroll Admin, I want to select several Submitted overtime claims and approve them in one action, so that month-end approval takes minutes instead of an hour.

**Acceptance criteria**
- **AC1** The claims list gets a checkbox per row and an **Approve selected** button.
- **AC2** Only Submitted claims can be selected.
- **AC3** Clicking **Approve selected** approves all selected claims and shows "N claims approved".
- **AC4** The same approval rules as single approval apply.
- **AC5** API: `POST /api/overtime-claims/bulk-approve` with `{ "ids": [...] }`.

## Your tasks (about 45 minutes)

Write `test-design/day12-TP-340-review.md` with:

1. **Ambiguities and gaps.** At least 8 questions. For each: the question, why it matters (what could go wrong in production), and the default you would propose. Think about: what happens when one claim in the batch fails a rule (all or nothing, or partial?); claims created by the approver inside the batch; a Viewer calling the API; IDs from another company; duplicate IDs; a maximum batch size; what the response body looks like for partial success; the monthly cap if approval ever affects it; concurrency (two admins approving the same batch); audit trail.
2. **Proposed acceptance criteria.** Rewrite the ACs so a tester could not misread them (Given / When / Then is fine).
3. **Where each check belongs.** A table with three columns, *API test*, *UI test*, *Manual or exploratory*, placing at least 10 checks and explaining your choice in one line each. (Rule of thumb: business rules and access control at the API level, a thin UI path for the user flow, judgment calls manual.)

**Deliverable:** part of `day-12-automation-pr` (see your plan).
