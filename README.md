# Skip Check by FinLit

Skip Check is the page before a person confirms a skip, reduction, or pause of one SIP in their own investing app. It does not change the SIP. The rupee gap is `(current − proposed) × months`. The decision is that gap read against a contribution target they already stated, or the continuity of the habit if they state none, written on a decision card they can take back.

This repository also holds the Phase A research notes in `research/`. The prototype is the Vite app at the repository root.

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Paste a Grok key into `.env` as `XAI_API_KEY` if you want SIP Check Bot. The assessment works without it. The key is read only by the Vite server for `POST /api/sip-check`. Do not prefix it with `VITE_`. Create a key at [console.x.ai](https://console.x.ai/). The route calls `POST https://api.x.ai/v1/responses` with model `grok-4.7` unless `XAI_MODEL` is set. See [the xAI API docs](https://docs.x.ai/developers/model-capabilities/text/comparison).

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

The live journey is the SIP impact assessment, then an optional SIP Check Bot.

- Welcome, a reason, the amounts, three equal scenario cards (Keep, Reduce, Pause), a what-if control, a three-question knowledge check, and a recap.
- One rupee calculation: `(current monthly SIP − proposed monthly SIP) × months`, in whole rupees, for 1 to 24 months. A pause is a proposed amount of ₹0. ₹12,000 reduced to ₹6,000 for 6 months is ₹36,000 less in planned contributions. That figure is not a loss or a return.
- Increasing a SIP is rejected. Amounts above ₹10,00,000 ask for a digit confirmation and are not corrected silently.
- A recap is stored in this browser only after consent. It can be edited or deleted. An optional review date is shown on a later visit. There is no email, push, or WhatsApp delivery.
- SIP Check Bot explains the calculator’s figures through Grok. It does not choose Keep, Reduce, or Pause, and it does not change the SIP. Without `XAI_API_KEY`, the bot explains how to configure the key and the assessment still works.
- Analytics stay in the browser tab. Events do not include amounts or chat text.

The only formula lives in `src/domain/sip-calculator.ts`. The earlier plan-translation screens remain in `src/features/flow` and are covered by their own tests. They are not the live homepage.

## Architecture

See `docs/architecture.md`, `docs/product-decisions.md`, `docs/test-plan.md`, and `docs/implementation-log.md`.

## Limitations

- No accounts, broker connection, payment, or external market data.
- FinLit states that it is not registered with SEBI or AMFI. A compliance review of this prototype has not been completed.
- The optional review mentioned in the footer starts at ₹99 on the published list. This prototype does not take payment.
- Usability and distribution gates are planning rules. They have not been run, and the app does not display them as results.
- Integer rupees only. Raising a SIP is out of scope.
- Ananya, used in the sample, is an illustration and has not been interviewed.
