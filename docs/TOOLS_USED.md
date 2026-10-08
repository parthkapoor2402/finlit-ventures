# Tools used

| Tool | Purpose | Why | What was actually used |
| --- | --- | --- | --- |
| Git | Branch, commit, push | The work had to land on `cursor/neuplan-hypothesis-9c1c` from `main` | `git checkout`, `git commit`, `git push`. No force push and no amend. |
| Node.js 22, npm | Install and run the app | The machine already had Node 22.14 and npm 10.9 | `npm install`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm start`, `npm run e2e` |
| Next.js 16.4 | App Router, route handlers, production server | `main` had no app. The brief asked for Next.js if that was the case | App Router pages and `app/api` routes. `next build` and `next start` on port 4180 |
| TypeScript 6.0.3 | Strict types | TypeScript 7.0.2 failed lint because `typescript-eslint` does not support it | `tsc --noEmit` and the Next build's typecheck. `strict` and `noUncheckedIndexedAccess` |
| ESLint 9 with `eslint-config-next` | Lint | The Next config is the project's lint | `npm run lint` |
| Vitest 5, jsdom, Testing Library | Unit and component tests | Fast checks for the store, catalogue, onboarding, week, needs, and Gemini | `npm test`. 45 tests in the last unit run before Playwright |
| `@google/genai` 2.27 | Weekly summary | The brief required the official SDK, server-side only | `GoogleGenAI.models.generateContent`. Model string comes from `GEMINI_MODEL`. Tests mock the SDK. No live key was present |
| Playwright 1.63 with Chrome | Browser journey | The brief asked for Playwright against the production build, including viewports and basic accessibility | `npm run e2e`, `channel: "chrome"`, one serial test. It passed |
| `@axe-core/playwright` | Basic accessibility | Home, onboarding, and the week view | `AxeBuilder.analyze()` inside the Playwright test. The run passed with no violations |
| Python PIL | Sample screenshot colours | The shell colour had to come from the reference images, not a guessed brand purple | One local script. Active nav purple clustered near rgb(136, 0, 236), used as `#8800EC` |
| curl | Check the production server | Confirm the process was actually listening | `GET /` and `GET /api/week` during phase 1 |

V2 used the same tools. Vitest then reported 19 files and 49 tests. Playwright covered the intro, the example, the seeded week, and the Croma demo. No icon package was added. Icons are a small inline set in `components/ui/Glyph.tsx`.

Not used: a Gemini live call, a vendor analytics SDK, Tailwind, Redux, Zustand, a database, and a payment API.

The headless Chrome check outside Playwright was abandoned. A profile lock aborted the first launch, and a second launch with a fresh profile did not return. Playwright later drove Chrome successfully.
