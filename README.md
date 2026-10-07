# NeuPlan

NeuPlan is a qualitative prototype inside a Tata Neu-like shell. The descriptor is "Your week. Planned around what matters."

The strategy note [`tata-neu-weekly-job-strategy.md`](tata-neu-weekly-job-strategy.md) concludes that no concept can credibly create two or three meaningful Tata Neu opens in an ordinary college week. This app does not claim that result. Youth weekly active users +15% is a target in the case. It is not measured here and it is not achieved here.

The persona on screen is Ananya, labelled DEMO DATA. The prototype does not store a college, roommates, spend, or a city.

## Stack

`main` had no application. This branch uses Next.js (App Router), TypeScript in strict mode, and CSS modules. Tailwind, Redux, and Zustand are not used. Week data goes through route handlers and `lib/repository.ts`, not through constants inside components.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The dev server listens on [http://127.0.0.1:3000](http://127.0.0.1:3000).

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm start
```

`npm start` serves the production build on [http://127.0.0.1:4180](http://127.0.0.1:4180). Port 4173 is left alone because another process was already listening there.

## Gemini

`GEMINI_API_KEY` and `GEMINI_MODEL` are read on the server. Both stay empty in `.env.example`. If either is missing, or the call times out or returns text the app will not accept, the weekly summary is a deterministic paragraph from counts the app already stored. The model name is not written in source.

Do not commit `.env`.

## Limitations

Payments, offers, and NeuCard applications are not connected. Tata stops inside NeuPlan are a demo catalogue (`isLive: false`, `demoOnly: true`) with no prices and no stock. This is not a proven weekly-active-user solution.

Architecture: [`docs/NEUPLAN_ARCHITECTURE.md`](docs/NEUPLAN_ARCHITECTURE.md).
