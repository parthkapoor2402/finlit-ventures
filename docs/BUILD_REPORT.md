# Build report

NeuPlan is a qualitative prototype. It is not a proven way to raise youth weekly active users.

## Architecture

Next.js App Router, TypeScript strict, CSS modules. A JSON file repository backs the week, needs, demo user, summary cache, and analytics. Gemini is a server route that may only summarise counts. If it cannot, the app writes the note itself.

## Features

Tata Neu shell with the existing bottom nav. One NeuPlan entry on Home and one in Categories. Three-step onboarding stored locally and on the server. Week create, edit, complete, remove, undo, empty state, and refresh error. Needs with a closed demo catalogue. Activity list. Weekly summary with fallback.

## Branch

`cursor/neuplan-hypothesis-9c1c`

## Tests

Recorded in `docs/TEST_STATUS.md` from commands that were run. The last Playwright run, `npm run e2e`, passed one test in about 4 seconds of test time. Unit tests at that point were 17 files and 45 tests. Typecheck, lint, and production build had passed on the same tree before the browser run, and are run again with the browser test in the phase 8 row.

## Gemini

No `GEMINI_API_KEY` in the environment used for the run. The summary in Playwright was the app fallback: "Written by the app." The SDK is installed and covered by mocked tests for success, missing key, missing model, timeout, empty reply, and a price-like reply.

## Local URL

Production: http://127.0.0.1:4180 (`npm start`). Dev: http://127.0.0.1:3000 (`npm run dev`).

## Limitations

One demo user. No payments. No live catalogue. No claim of habit. An empty week stays empty.

## Strategic risk

A stakeholder can still mistake a polished screen for evidence. The on-screen line says the +15% youth WAU figure is a target, not a result. The strategy note's recommendation remains: do not treat this as the weekly-open answer.

## Next iteration

Only if a diary or a Tata log pull shows a job that passes the strategy note's kill test. Until then, the useful next step is to watch whether a student, unprompted, opens this twice in a real week. This prototype cannot answer that.
