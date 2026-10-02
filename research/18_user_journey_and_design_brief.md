# 18 — User journey and design brief

Prototype only after approval. This is the specification Phase B would build.

## Current state

1. Ananya sees a negative return or a tight month.
2. She opens the SIP in her app.
3. She taps Skip or Cancel.
4. She confirms, sometimes picks a reason, sometimes enters an OTP.
5. If confused, she searches or asks a forum, often after she has already tapped.
6. The instalment either runs, is skipped, or the SIP ends. She may not know which rule applied.

## Future state

1. She reaches FinLit from an article or a review, with the intent to change a SIP, before she confirms in the app.
2. She says what she is trying to do.
3. She enters amount, months or new amount, reason, optional horizon, optional app. Or she explores a labeled sample.
4. The calculator returns a verified card.
5. She reads rupees, the non-redemption line, and the unknown-NAV line.
6. She can edit inputs or dismiss.
7. She chooses keep, reduce, or pause with a restart month.
8. She passes or fails a one-line restatement. Failure re-shows the line; it does not block the choice after one retry.
9. The session ends with a plain recap she can use in her own app. Nothing is sent to the AMC.
10. If she opted in, a restart reminder is the only follow-up.

## Flows

- **Sample explore:** pre-filled ₹12,000, 3 months, market-worry, 8-year horizon, banner "Sample."
- **Own numbers:** empty fields, no banner, no storage unless she saves a reminder.
- **Cash branch:** Pause visually equal to the other choices, restart month required to finish that choice, skip still allowed with an explicit "no date."
- **Goal-near branch:** no language about missing a rally.
- **Fund-fit branch:** no replacement fund. Link to a human conversation labeled as not a product recommendation.
- **Dismiss:** no guilt modal.

## Information architecture

Skip Check

- Intent
- Inputs
- Card
- Choice
- Recap

Separate from the marketing site's portfolio track record and from any "discretionary" page. Do not place Skip Check next to performance claims.

## Screens

| Screen | Purpose |
| --- | --- |
| 1. Intent | "Are you about to change a SIP?" Yes / I am just looking |
| 2. Inputs | Amount, action, reason, optional horizon and app |
| 3. Card | The five blocks in `13` |
| 4. Choice | Keep, Reduce, Pause |
| 5. Restatement | One question, then recap |
| 6. Recap | What she chose, what to tap in her app, what this did not do |

### Empty

Intent not chosen: stay on screen 1. No market chart.

### Error

Amount blank or not a number: inline "Enter the monthly amount in rupees." No toast that blames the user.

### Missing data

Horizon empty: card omits goal lines and says "Add a horizon if you want this tied to a goal."

### Consent

Sample: no consent, no save. Reminder: a separate notice before email is stored, with delete. Not bundled into the choice button.

### Accessibility

Body text at least 16px, contrast on the dark theme the site already uses, choices as text buttons, reason not conveyed by color alone, card usable at 360px width. The product is mobile-first because the broker action happens on a phone.

## Low-fidelity specification

Screen 1. Title: "Before you skip this SIP." Sub: "This does not pause anything. You decide in your own app." Two buttons.

Screen 2. Four fields. Reason as four radio options plus Other. Primary: "Show the consequences."

Screen 3. Stacked blocks, in order: You said / Rupees that will not be invested / Your units stay / What this cannot know / Rule, if any. Text button: "Something is wrong" goes to screen 2.

Screen 4. Three full-width buttons of equal visual weight.

Screen 5. "Which of these is true?" with the correct rupee sentence and two distractors (a unit prediction, a redeem). Then recap.

## Dark patterns that are out

No countdown. No "most investors continued." No disabled pause. No pre-selected Keep. No headline about losses waiting if she pauses.

## Phase B prototype

A clickable web flow of these six screens, sample plus editable inputs, calculator in code, template sentences, no model, no accounts, no broker. A short walkthrough recording if the build is approved. Deck remains 15 slides and is written from `21`, not invented in the prototype.
