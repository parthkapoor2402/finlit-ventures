# NeuPlan

NeuPlan is a qualitative prototype inside a Tata Neu-like shell. The line on screen is "Your week. Planned around what matters."

The strategy note [`tata-neu-weekly-job-strategy.md`](tata-neu-weekly-job-strategy.md) concludes that no concept can credibly create two or three meaningful Tata Neu opens in an ordinary college week. This app does not overturn that conclusion. It is a hypothesis a person can react to. It is not a validated habit, not product-market fit, and not a weekly-active-user result.

Youth weekly active users +15% is a target in the case. It is not measured here and it is not achieved here.

The only persona is Ananya, labelled **DEMO DATA**. The prototype does not store a college, roommates, spend, or a city. Hostel appears only after that living situation is chosen in onboarding.

## What it contains

The shell keeps the Tata Neu bottom nav: Home, Categories, Scan & Pay, Offers, NeuCard. NeuPlan is not a tab. It is one row on Home and one row in Categories.

Scan & Pay, search, quick actions, and NeuCard Apply do not move money or start an application.

NeuPlan, after a three-step onboarding, shows the current week, needs, a demo Tata stop, a weekly summary, and an activity list of events this prototype recorded.

Tata stops are a closed demo catalogue: Croma, Westside, BigBasket, Tata 1mg, Travel, IHCL, Neu UPI. Each one is `isLive: false` and `demoOnly: true`. There is no price and no stock.

## Architecture

`main` had no application. This branch uses Next.js (App Router), TypeScript in strict mode, and CSS modules. Tailwind, Redux, and Zustand are not used.

Week items, needs, the demo user, and analytics events go through route handlers and `lib/repository.ts`. Components do not embed that data. The repository writes a JSON file under `.data/`, or under `NEUPLAN_DATA_DIR`. The week is Monday to Sunday in `Asia/Kolkata`. That zone is the product's country, not a detected city.

Details are in [`docs/NEUPLAN_ARCHITECTURE.md`](docs/NEUPLAN_ARCHITECTURE.md). Decisions are in [`docs/PRODUCT_DECISIONS.md`](docs/PRODUCT_DECISIONS.md).

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The dev server listens on [http://127.0.0.1:3000](http://127.0.0.1:3000).

Production:

```bash
npm run build
npm start
```

`npm start` listens on [http://127.0.0.1:4180](http://127.0.0.1:4180). Port 4173 was already taken by another process when this workspace was set up, so NeuPlan does not use it.

## Gemini

`GEMINI_API_KEY` and `GEMINI_MODEL` are read only on the server, in `lib/ai/gemini.ts`. Do not prefix them with `NEXT_PUBLIC_`. Do not commit `.env`.

The model name is not written in source. Set `GEMINI_MODEL` to a model your key can call. If the key or the model is missing, or the call times out, throws, or returns text the app will not accept, the summary is a deterministic paragraph from counts the app already stored. Titles are not sent to the model. The summary is not allowed to invent events, products, prices, inventory, discounts, history, or financial advice.

This environment did not have a Gemini key. The running app uses the fallback.

## Checks

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm run e2e
```

`npm test` is Vitest. `npm run e2e` is Playwright against the production server on port 4180, using the Chrome already installed on the machine. It writes screenshots to `/opt/cursor/artifacts/neuplan/` when that directory exists.

End-to-end data is stored in `/tmp/neuplan-e2e`, not in `.data/`.

## Dependencies

Runtime:

- `next`, `react`, `react-dom` — the app shell and route handlers.
- `@google/genai` — the official Google GenAI SDK, server-side weekly summary only.

Development:

- `typescript` 6.0.3 — strict mode. TypeScript 7 was not used because `typescript-eslint`, via `eslint-config-next`, does not support it yet.
- `eslint`, `eslint-config-next` — lint.
- `vitest`, `jsdom`, `@vitejs/plugin-react`, Testing Library — unit and component tests.
- `@playwright/test`, `@axe-core/playwright` — the browser journey and basic accessibility checks.

## Limitations

- One demo user. The JSON file is not an account system and is not safe for more than one person at a time.
- Payments, offers, cards, and search are not connected.
- Offer and NeuCard lines are transcribed from reference screenshots. They are not a live catalogue and they are not personalised.
- No push, no streak, no coins for opening, no fake urgency.
- Analytics stay in the prototype store. They are not sent to a vendor.
- A week with nothing added stays empty. That is intentional.

## Assumptions

- The week boundary is `Asia/Kolkata`.
- Ananya is an illustration, not an interviewed student.
- A meaningful session in this prototype means the person added or completed an item, or added or resolved a need, in this browser tab. That flag is not a weekly-active-user measurement.
