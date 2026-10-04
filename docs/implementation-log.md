# Implementation log

Results below are from commands run in this workspace on 2 October 2026. A command is listed only if it was actually run.

## Repository at the start of the build

The branch already held the Phase A research notes. There was no application, no `package.json`, and no test runner. The app was added on that branch rather than replacing the research.

## Checks

| Command | Result |
| --- | --- |
| `npx tsc -b --pretty false` | Passed. The first attempt failed because `tsconfig.node.json` asks for Node types. `@types/node` was installed and the same command then passed. |
| `npx vitest run` | Passed after two fixes. The first component run failed because Testing Library was not cleaning the document between tests (`cleanup` added in `src/test/setup.ts`). The second run failed two assertions that looked for the wrong sentence and for a rupee amount that appears twice on the recap. Final run: 7 files, 48 tests passed. |
| `npx eslint .` | Passed, no findings. |
| `npm run build` | Passed. `tsc -b` and Vite 8.3.2. Output: `dist/index.html` 0.94 kB, CSS 11.27 kB, JS 250.00 kB. |
| `npx playwright test` | First run: 14 passed, 2 failed. Both failures were strict-mode locator clashes (`Pause` also appears in a sentence; `₹6,000` appears as both the figure and the proposed amount). Locators were narrowed. Rerun: 16 passed. The suite fails the test if the page logs a console error or throws. None did. |
| `npm run dev` on port 5173 | HTTP 200. Left running. |
| `npm run preview` on port 4173 | HTTP 200 for the HTML, the JS asset, and the CSS asset. Left running. |
| Browser walkthrough | Cash need, pause of ₹12,000 for 6 months, comparison ₹72,000, comprehension, recap, then the illustrative sample at ₹36,000. A 390px reload of the entry page showed no horizontal overflow. The console had no application errors. |

## What was not run

- No moderated usability sessions. The 7-of-10 rule is not a result.
- No distribution test. The 10-of-50 rule is not a result.
- No compliance review.
- Vitest’s dev dependency has a moderate advisory (`GHSA-82fw-gwwq-j7x9`) in `@vitest/mocker`. `npm audit --omit=dev` reports no production vulnerabilities. The advisory is not fixed here because the suggested upgrade is a breaking Vitest 5 install, and the package does not ship in the production bundle.
