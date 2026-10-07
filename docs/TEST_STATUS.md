# Test status

Results below were produced by running the commands in this workspace. A row is not a pass unless the command exited 0.

## Phase 1 — foundation

Date: 2026-10-07. Branch: `cursor/neuplan-hypothesis-9c1c`.

An earlier `npm test` also executed tests inside `video/node_modules` because the include pattern was too wide. Those failures are not NeuPlan tests. The include list was narrowed to `lib`, `components`, and `app`. An earlier `npm run lint` failed on TypeScript 7.0.2 because `typescript-eslint` does not support it. TypeScript was set to 6.0.3, which is the line `eslint-config-next` can parse. Strict mode stayed on.

Final commands, in order:

| Command | Exit | Result |
| --- | --- | --- |
| `npm test` | 0 | Vitest 5.0.3. 6 files, 19 tests passed. Duration 3.75s. |
| `npm run typecheck` | 0 | `tsc --noEmit` reported no errors. |
| `npm run lint` | 0 | `eslint .` reported no errors. |
| `npm run build` | 0 | Next.js 16.4.0 compiled and generated 9 static pages. `GET /api/week` is dynamic. |

Production server: `npm start` on http://127.0.0.1:4180 (port 4173 was already taken by a pre-existing Vite preview, PID 63936, which this work did not stop).

| Request | Status | Body check |
| --- | --- | --- |
| `GET /` | 200 | HTML document returned. |
| `GET /api/week` | 200 | `week.startsOn` `2026-10-05`, `endsOn` `2026-10-11`, `timeZone` `Asia/Kolkata`, `items` `[]`. |

## Phase 2 — Tata Neu shell and NeuPlan entry

Date: 2026-10-07.

| Command | Exit | Result |
| --- | --- | --- |
| `npm test` | 0 | Vitest 5.0.3. 7 files, 22 tests passed. Duration 5.10s. |
| `npm run typecheck` | 0 | `tsc --noEmit` reported no errors. |
| `npm run lint` | 0 | `eslint .` reported no errors. |
| `npm run build` | 0 | Next.js 16.4.0 compiled. Routes include `/`, `/categories`, `/scan`, `/offers`, `/neucard`, `/neuplan`. |

`GET http://127.0.0.1:4180/` after restarting the production server returned the Home document with one NeuPlan link, the descriptor "Your week. Planned around what matters.", and the primary nav labels Home, Categories, Scan & Pay, Offers, NeuCard. A headless Chrome console pass did not finish: Chrome aborted because another profile lock existed, and a second launch with a fresh profile did not return. The Home render test asserts `console.error` was not called.

## Phase 3 — onboarding and persistence

Date: 2026-10-07.

| Command | Exit | Result |
| --- | --- | --- |
| `npm test` | 0 | Vitest 5.0.3. 10 files, 27 tests passed. Duration 6.80s. |
| `npm run typecheck` | 0 | `tsc --noEmit` reported no errors. |
| `npm run lint` | 0 | `eslint .` reported no errors. |
| `npm run build` | 0 | Next.js 16.4.0 compiled. New routes: `/api/user`, `/api/analytics`, `/neuplan/onboarding`. |

The onboarding tests cover a disabled Continue until a week shape is chosen, a remount that keeps step 2, and the browser Back control returning to the week question with Study still pressed. `PUT /api/user` rejects completion until living situation, week shapes, and help focus are present, then `GET /api/user` reads them back.

## Phase 4 — week view

Date: 2026-10-07.

| Command | Exit | Result |
| --- | --- | --- |
| `npm test` | 0 | Vitest 5.0.3. 12 files, 31 tests passed. Duration 8.33s. |
| `npm run typecheck` | 0 | `tsc --noEmit` reported no errors. |
| `npm run lint` | 0 | `eslint .` reported no errors. |
| `npm run build` | 0 | Next.js 16.4.0 compiled. New routes: `POST /api/week/items`, `PATCH` and `DELETE /api/week/items/[id]`. |

Week route tests create an item, mark it done, and reject a day outside the current week. The screen test shows "Your week is clear.", posts a title, and shows "We couldn't refresh your week." with Try again.

## Phase 5 — needs and demo Tata stops

Date: 2026-10-07.

| Command | Exit | Result |
| --- | --- | --- |
| `npm test` | 0 | Vitest 5.0.3. 14 files, 33 tests passed. Duration 9.65s. |
| `npm run typecheck` | 0 | `tsc --noEmit` reported no errors. |
| `npm run lint` | 0 | `eslint .` reported no errors. |
| `npm run build` | 0 | Next.js 16.4.0 compiled. New routes include `/api/needs`, `/api/needs/[id]`, `/neuplan/needs`, `/neuplan/demo/[destination]`, `/neuplan/activity`. |

A remember need patched to Croma returns 400, "That Tata stop does not fit this need." The needs screen offers Croma, Westside, and BigBasket for a buy need, and does not offer Neu UPI or IHCL. The remember row does not offer Croma.

## Phase 6 — Gemini summary and fallback

Date: 2026-10-07.

| Command | Exit | Result |
| --- | --- | --- |
| `npm test` | 0 | Vitest 5.0.3. 17 files, 45 tests passed. Duration 11.94s. |
| `npm run typecheck` | 0 | `tsc --noEmit` reported no errors. |
| `npm run lint` | 0 | `eslint .` reported no errors. |
| `npm run build` | 0 | Next.js 16.4.0 compiled. New route: `POST /api/ai/weekly-summary`. |

Summary tests cover a missing key, a missing model, a successful SDK reply, a timeout, a thrown request, an empty reply, a reply containing a rupee price, a number that is not in the counts, and a second call that does not call the model again. The key string in the log test was not printed by the test name. `GEMINI_API_KEY` was not found in `.next/static`.

No `GEMINI_API_KEY` is set in this environment, so the running app uses the deterministic fallback. That is not a live model call.

## Phase 7 — visual polish

Date: 2026-10-07.

| Command | Exit | Result |
| --- | --- | --- |
| `npm test` | 0 | Vitest 5.0.3. 17 files, 45 tests passed. Duration 11.86s. |
| `npm run typecheck` | 0 | `tsc --noEmit` reported no errors. |
| `npm run lint` | 0 | `eslint .` reported no errors. |
| `npm run build` | 0 | Next.js 16.4.0 compiled. |

Changes in this phase: category glyphs are no longer one repeated card icon, offer tiles no longer use empty colour blocks as stand-in photographs, and the week is a day list rather than a stack of cards.

## Phase 8 — Playwright

Date: 2026-10-07. Commands were run in this order on the same tree.

| Command | Exit | Result |
| --- | --- | --- |
| `npm test` | 0 | Vitest 5.0.3. 17 files, 45 tests passed. Duration 11.68s. |
| `npm run typecheck` | 0 | `tsc --noEmit` reported no errors. |
| `npm run lint` | 0 | `eslint .` reported no errors. |
| `npm run build` | 0 | Next.js 16.4.0 compiled 20 routes, including `/icon.svg`. |
| `npm run e2e` | 0 | Playwright 1.63. 1 test passed. Test time 4.0s, run 5.1s. Chrome channel. Production server on port 4180 with `NEUPLAN_DATA_DIR=/tmp/neuplan-e2e`. |

The browser test covered first visit, onboarding, an empty week, add, edit, mark done, a need resolved to Croma, the demo page, the app-written summary, a forced summary HTTP 500, refresh, back from the demo page, mobile 390, tablet 768, and desktop 1280. Axe reported no violations on Home, onboarding, and the week. The desktop phone column was at most 430px wide. Screenshots are in `/opt/cursor/artifacts/neuplan/`.

No Gemini key was configured. The summary assertion was "Written by the app."

