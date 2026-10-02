# Skip Check by FinLit

Skip Check compares the SIP contributions that would not be invested if a person keeps, reduces, or pauses one SIP. It does not change the SIP. The person finishes any action in their own investing app.

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
- One calculation: `(current monthly SIP − proposed monthly SIP) × months`, in whole rupees, for 1 to 24 months.
- Keep, reduce, and pause have the same visual weight. A restart month after pause is optional and does not restart anything.
- A comprehension check comes before the recap. The recap is not an order.
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
