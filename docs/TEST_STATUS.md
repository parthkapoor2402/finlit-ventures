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

Phases 6–8 have not been run.
