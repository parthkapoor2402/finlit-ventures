# Skip Check by FinLit

Skip Check is the page before a person confirms a skip, reduction, or pause of one SIP in their own investing app. It does not change the SIP. The rupee gap is `(current − proposed) × months`. The decision is that gap read against a contribution target they already stated, or the continuity of the habit if they state none, written on a decision card they can take back.

This repository also holds the Phase A research notes in `research/`. The prototype is the Vite app at the repository root.

## Local setup

```bash
npm install
npm run dev
```

The development server runs at [http://127.0.0.1:5173](http://127.0.0.1:5173).

Production build and local preview:

```bash
npm run build
npm run preview
```

The preview server runs at [http://127.0.0.1:4173](http://127.0.0.1:4173).

## Checks

```bash
npm run lint
npm run test
npm run e2e
npm run build
```

End-to-end tests use Playwright with Chromium. The first run needs:

```bash
npx playwright install chromium
```

## What the prototype does

- Two entry doors. “I'm about to change a SIP” starts a decision session. “I'm only reading” opens a labelled sample and is excluded from the decision metrics.
- Reasons: cash need, market worry, goal reached or near, fund no longer fits, and I'm not sure.
- One rupee calculation: `(current monthly SIP − proposed monthly SIP) × months`, in whole rupees, for 1 to 24 months. A pause is a proposed amount of ₹0.
- If they state a remaining contribution target, the gap is divided by the monthly amount they are choosing. The result is months of planned contributions, with any remainder kept in rupees. A blank target is not filled in. The page shows continuity instead.
- Keep, reduce, and pause have the same visual weight. A restart month after a reduction or a pause is optional, remembered on the decision card, and does not restart anything.
- The decision card is the last screen. It prints and copies as plain text. A comprehension check comes before it. The card is not an order. See `docs/plan-translation-design.md`.
- Analytics stay in the browser tab. Amounts are not included in events and are cleared on refresh.

The only formula lives in `src/domain/sip-calculator.ts`.

## Architecture

See `docs/architecture.md`, `docs/product-decisions.md`, `docs/test-plan.md`, and `docs/implementation-log.md`.

## Limitations

- No accounts, broker connection, payment, or external market data.
- FinLit states that it is not registered with SEBI or AMFI. A compliance review of this prototype has not been completed.
- The optional review mentioned in the footer starts at ₹99 on the published list. This prototype does not take payment.
- Usability and distribution gates are planning rules. They have not been run, and the app does not display them as results.
- Integer rupees only. Raising a SIP is out of scope.
- Ananya, used in the sample, is an illustration and has not been interviewed.
