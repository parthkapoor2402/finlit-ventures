# Skip Check by FinLit

Skip Check is the page before a person confirms a skip, reduction, or pause of one SIP in their own investing app. It does not change the SIP. The rupee gap is `(current − proposed) × months`. The decision is that gap read against a contribution target they already stated, or the continuity of the habit if they state none, written on a decision card they can take back.

This repository also holds the Phase A research notes in `research/`. The prototype is the Vite app at the repository root.

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Paste an API key into `.env` as `XAI_API_KEY` if you want SIP Check Bot. The assessment works without it. The key is read only by the Vite server for `POST /api/sip-check`. Do not prefix it with `VITE_`. A key that starts with `gsk_` is sent to Groq at `POST https://api.groq.com/openai/v1/chat/completions`, using `qwen/qwen3.8-27b` unless `GROQ_MODEL` names another model that key can call. A key that starts with `xai-` is sent to xAI at `POST https://api.x.ai/v1/responses` with model `grok-4.7` unless `XAI_MODEL` is set. Create a Groq key at [console.groq.com/keys](https://console.groq.com/keys) or an xAI key at [console.x.ai](https://console.x.ai/). Restart `npm run dev` after changing `.env`.

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

The live journey is Skip Check, then an optional SIP Check Bot.

- The landing page offers “Explore my options” and “I’m just exploring”. The sample opens on illustrative numbers and does not ask for a personal SIP.
- A reason is optional. The amounts step accepts a proposed SIP, or “I haven’t decided on an amount yet”, which opens the explorer on a clearly labelled starting figure.
- Keep, Reduce, and Pause stay equally visible. The what-if control has a slider and a matching number field, plus “Reset to my original inputs”.
- The three clarity questions are optional. “Skip for now” goes to the recap.
- The recap can connect to FinLit only when `VITE_FINLIT_CONTACT_URL` or `VITE_FINLIT_BOOKING_URL` is set. Until then, the button says that no contact page, phone number, email, or booking link is configured. The ₹99 line is the published list price. This prototype does not take payment.
- One rupee calculation: `(current monthly SIP − proposed monthly SIP) × months`, in whole rupees, for 1 to 24 months. A pause is a proposed amount of ₹0. ₹12,000 reduced to ₹6,000 for 6 months is ₹36,000 less in planned contributions. That figure is not a loss or a return.
- Increasing a SIP is rejected. Amounts above ₹10,00,000 ask for a digit confirmation and are not corrected silently.
- A recap is stored in this browser only after consent. It can be edited or deleted. An optional review date is shown on a later visit. There is no email, push, or WhatsApp delivery.
- SIP Check Bot explains the calculator’s figures. A `gsk_` key uses Groq. An `xai-` key uses Grok. It does not choose Keep, Reduce, or Pause, and it does not change the SIP. Without a key, the bot says how to configure one and the assessment still works.
- Analytics stay in the browser tab. Events do not include amounts or chat text.

The only formula lives in `src/domain/sip-calculator.ts`. The earlier plan-translation screens remain in `src/features/flow` and are covered by their own tests. They are not the live homepage.

## Product demo

The product film lives in `video/`. It runs about 82 seconds and includes the What if explorer. Render and playback instructions are in `video/README.md`. The spoken track is inside the MP4.

## Vercel

`npm run build` writes the static app to `dist` and bundles `api/sip-check.js` for the bot. Set `XAI_API_KEY` or `GROQ_API_KEY` in the Vercel project environment. The key is not part of the client bundle. Without it, the assessment still works and the bot explains that it is not configured.

## Architecture

See `docs/architecture.md`, `docs/product-decisions.md`, `docs/test-plan.md`, and `docs/implementation-log.md`.

## Limitations

- No accounts, broker connection, payment, or external market data.
- FinLit states that it is not registered with SEBI or AMFI. A compliance review of this prototype has not been completed.
- The optional review mentioned in the footer is listed at ₹99. This prototype does not take payment and does not book that review. Set `VITE_FINLIT_CONTACT_URL` or `VITE_FINLIT_BOOKING_URL` only when a real page exists.
- Usability and distribution gates are planning rules. They have not been run, and the app does not display them as results.
- Integer rupees only. Raising a SIP is out of scope.
- Ananya, used in the sample, is an illustration and has not been interviewed.
