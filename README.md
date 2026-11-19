# qa-automation-training-antonio

Antonio Esparis · FS Learning · Training Plan 1 (Nov 23 – Dec 15, 2026).

TypeScript, Playwright UI and API automation, test design, and SQL data validation, practised against **TallyPay Overtime**, a small payroll app that runs on your machine.

## One-time setup

```bash
npm install                        # installs Playwright, TypeScript and Node types
npx playwright install chromium    # downloads the browser Playwright drives
npm run typecheck                  # should finish with no errors
npm run sandbox                    # starts TallyPay on http://localhost:4020 (Ctrl+C to stop)
```

Needs Node.js 22.18 or later (Node 24 LTS recommended), Git, VS Code (with the "Playwright Test for VS Code" extension), the Postman desktop app, and DB Browser for SQLite.

**Windows:** if PowerShell says *"running scripts is disabled on this system"* when you run `npm` or `npx`, either use Command Prompt (cmd) instead, or run this once in PowerShell: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## Folders

| Folder | What goes there | Days |
|---|---|---|
| `sandbox/` | The TallyPay app and its specification (`sandbox/README.md`). Don't edit it. | all |
| `drills/` | TypeScript drills with ready-made tests | 2–4 |
| `tests/` | Playwright UI tests (`tests/*.spec.ts`) and API tests (`tests/api/*.spec.ts`) | 5–12 |
| `pages/` | Page Objects | 7 onward |
| `postman/` | Your Postman collection and environment exports (create the folder on Day 8) | 8 |
| `tests-legacy/` | An inherited test suite you will triage (don't open before Day 12) | 12 |
| `test-design/` | Mini-tickets, story cards and your test designs | 4, 7, 10–14 |
| `sql/` | Practice database, drills and validation brief | 13–14 |
| `defects/` | Your bug reports, one file per defect | 6 onward |
| `notes/` | Short notes the plan asks for (cheat sheets, decisions) | any |

## Commands

| Command | What it does |
|---|---|
| `npm run drills:day02` (…`day03`, `day04`) | Run one day's drill tests |
| `npm test` | Run all Playwright tests (starts the sandbox if it isn't running) |
| `npm run test:ui` | Playwright UI mode: watch, step through and debug tests |
| `npm run test:api` | Only the API tests |
| `npm run test:legacy` | The inherited suite in `tests-legacy/` (Day 12) |
| `npm run codegen` | Record a test by clicking through the app (Day 6) |
| `npm run report` | Open the last HTML report |

## Working rules

- `main` is protected. Every change goes through a branch and a pull request: `git switch -c day-05-first-tests`, commit, `git push -u origin day-05-first-tests`, open the PR on GitHub.
- One PR per day, titled `Day N — <focus>`. Put the commands you ran and their result (or a screenshot) in the PR description.
- A test that fails because the app has a real defect stays in the suite, marked `test.fail()` with the bug file name, e.g. `test.fail(true, 'defects/BUG-001-short-title.md')`. Never delete or weaken an assertion to make a test pass.
