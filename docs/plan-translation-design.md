# Plan translation

Skip Check still has one rupee formula, in `src/domain/sip-calculator.ts`:

```text
contribution gap = (current monthly SIP − proposed monthly SIP) × months
```

A pause is a proposed amount of ₹0. That product is necessary. It is not the product.

## What multiplication already gives the person

At the confirm step, an investing app shows a new monthly amount. The person can subtract and multiply. ₹12,000 reduced to ₹6,000 for 6 months is ₹36,000 either way. A page that stops there repeats arithmetic they can do on the confirm screen.

## What this page adds

The unconfirmed change is read against a plan they already have, then written down as a record they can take back. Nothing is executed.

1. **Goal-relative time shift.** If they type a remaining contribution target they already had in mind, the gap is divided by the monthly amount they are choosing. The quotient and the remainder are exact integers. The label is months of planned contributions. It is not wealth, a return, or units. The same division is applied to the target, so the card also says how many months of planned contributions that target is at the chosen amount. A blank target is left blank. The page does not invent a goal, a horizon, or a rate.

2. **Continuity, when there is no rate to divide by.** No target, or a chosen monthly amount of ₹0, uses continuity instead of a quotient. A reduction and a pause can share a rupee gap and still be different decisions: the reduction says how many months the current amount stops while a lower amount continues; the pause says those months stop at ₹0. A restart month they type is kept in the session and printed on the card. Skip Check does not restart the SIP.

3. **The decision card.** One page: reason, current, proposed, months, the calculator’s contribution gap, the time shift or the continuity reading, the choice (keep, reduce, or pause, same weight), the restart month if they named one, and the line “Decision support. Not investment advice.” It prints, and it copies as plain text.

4. **Reason changes the sentence, not the formula.** Cash need, market uncertainty, and a goal change are not scored. Cash need puts forward that a pause can be legitimate and shows the restart. Market uncertainty puts forward that the number is not a loss and that existing units stay invested. The gap is the same number either way.

A full pause of ₹12,000 for 6 months remains ₹72,000. When a reduction is on the card, that pause figure can appear beside it, labeled “Full pause, shown separately.” It is a different decision, not a second formula.

## What this is not

- **Not a dashboard.** There is no portfolio, no chart, and no second task. The session ends at the card.
- **Not a chatbot.** Every sentence is a fixed function of the reason, the choice, and the numbers they typed. No model is called. No API key is in the browser.
- **Not the multiplication they already know.** The rupee line stays on the card so the record is complete. The climax is the planned-contribution months, or the continuity of the habit, and the card they carry back to their own app.
