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

Phases 2–8 have not been run.
