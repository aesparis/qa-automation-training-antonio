# TypeScript drills (Days 2, 3 and 4)

Each drill file has functions with a `// TODO` and a `throw new Error('TODO')` body. Replace the body with working code. The matching `.test.ts` file already contains the tests: **do not edit the test files**. When every test passes, the drill is done.

```bash
npm run drills:day02     # runs drills/day02-basics.test.ts
npm run drills:day03     # runs drills/day03-collections.test.ts
npm run drills:day04     # runs drills/day04-async.test.ts (it starts its own copy of the sandbox on port 4021)
npm run typecheck        # TypeScript type check for the whole repo (must be clean before you open a PR)
```

Rules
- Keep the function names and parameter types exactly as given; the tests import them.
- Use `const`/`let` (never `var`), strict equality (`===`), and give every function an explicit return type.
- AI tools are allowed for explanations ("why does this error happen?"), but type the solution yourself. The Day 15 post-assessment is closed-book, so the practice has to be yours.
- Stuck for more than 20 minutes on one function? Move on, note it in your EOD email under Blockers, and come back.

Node.js runs these `.ts` files directly (type stripping, Node 22.18+). That's why imports end in `.ts`, why type-only imports use `import type`, and why `enum` isn't used here.
