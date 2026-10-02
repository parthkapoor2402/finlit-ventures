# 13 — AI experience and guardrails

The experience is a decision card. A language model may explain a result the calculator already produced. It does not produce the result.

## Trigger and intent

- **Trigger:** the user selects "I am about to skip, reduce, or cancel a SIP" or opens Skip Check from an article with that intent. A market banner alone does not open the interrupt.
- **Intent check:** "Which SIP, and what are you trying to do: skip instalments, reduce the amount, or cancel?" If they are only browsing, show a labeled sample and do not call it their portfolio.
- **Do not interrupt** a user who is reading research with no stated intent to change a SIP.

## Minimum context

Required before a personal card, all user-supplied in the MVP:

- Monthly amount (rupees)
- What they want to change (skip N months, new monthly amount, or cancel)
- Reason: cash need, market worry, goal reached or near, fund no longer fits, or "I'm not sure"
- Goal horizon in years, if they have one. Optional. If missing, skip goal language
- Their app, optional, so a platform rule can be quoted only when it is on the verified list

Not required and not implied: holdings feed, bank balance, PAN, broker credentials.

## What the card shows

1. **What you said.** Amount, action, reason, horizon. Editable.
2. **What definitely changes.** One function, and no other:

```text
contribution_difference = (current_monthly_rupees - proposed_monthly_rupees) × months
```

Keep sets proposed equal to current, so the difference is 0. Pause or cancel of future instalments sets proposed to 0. Reduce uses the amount they type, which must be greater than 0 and less than current. The label is "Contributions that would not be invested over this period under these inputs." It is not a loss and not a return.

Illustration only, using the persona's ₹12,000 SIP, not a customer record: proposed ₹6,000 for 6 months is ₹36,000 of contributions that would not be invested. A user-typed assumed return, and any "goal gap" built from it, is not in the MVP.
3. **What does not change.** Existing units are not redeemed by a skip or cancel. Source: the product copy, grounded in Kuvera and Groww help, and phrased as a general rule with a "confirm in your app" line.
4. **What is unknown.** How many units those rupees would have bought. That needs a future NAV. The card says so and does not invent one.
5. **Platform rule, only if verified for the named app.** Example: if they select Groww, the card may say Groww's help states that three consecutive skipped instalments cancel the SIP, and that a skip close to the debit date can miss the next debit. If the articles still conflict on the cancel cutoff, the card says the cutoff exists and tells them to read the confirm screen rather than quoting a single number.
6. **Reason branch.** The three buttons stay in the same order and the same visual weight on every branch.
   - Market worry, and horizon they entered is more than five years: one sentence that a single red month does not settle a long SIP, then the contribution line. No instruction to continue.
   - Cash need: one sentence that those contributions stay in their bank. No argument for or against pausing.
   - Goal near: stopping new money can fit a goal that has arrived. No line about missing a rally.
   - Fund no longer fits: this check does not name a replacement fund. A human conversation is optional and is not a product recommendation.
   - I'm not sure: contribution line and units line only. No market paragraph.
7. **Choices:** Keep this SIP, Reduce to an amount they type, Pause. A restart month is asked only after Pause, and "no date" is allowed. The words are: "A month you might start the SIP again. Skip Check will not restart it. Your investing app will not restart it unless that app says so."
8. **Challenge the card:** "This is wrong" opens the inputs. "I don't understand" expands one sentence under each number. Dismiss returns them without a choice recorded.

## Missing data

- No amount: ask. Do not estimate a typical SIP.
- No horizon: omit goal sentences.
- No app: omit platform-specific day counts.
- Sample mode: a persistent label, "Sample, not your portfolio."

## Explainability, per number

| Line | What happened | Data | Why it might matter | Assumption | Uncertain |
| --- | --- | --- | --- | --- | --- |
| Rupees not invested | The instalments will not be paid | User amount and months | That cash stays in their bank instead of the fund | They would have funded those months | None on the arithmetic |
| Units | Not shown as a number | — | People ask "how many units" | — | Future NAV unknown |
| Goal gap | Not shown in the MVP | — | A rate the user types is still easy to read as a forecast | Removed until a later version has a reviewed label | — |
| Three-skip rule | Quoted only for Groww, as a help-center rule | Groww help | Repeated skips can end the SIP | The help article is still accurate | Cutoffs conflict across articles |

Language is descriptive and educational. It is not a personal recommendation to buy, sell, or hold a security. If a sentence cannot be rewritten without "you should," it is cut.

## Model boundary

- Calculator: the function above, with tests. Blank, text, negative, or zero current amount: no result. Months must be a whole number from 1 to 24. Proposed amount above current: stop and say this check is not for raising a SIP. Amount above ₹10,00,000 a month: ask them to confirm the digits before the card. That ceiling is a typo check, not a fact about typical SIPs.
- Rules: reason branch is a decision table, not a prompt.
- LLM, if used: receives the calculator JSON and writes a short explanation. A checker rejects output that contains a return percentage, a unit count, a tax figure, or a fund recommendation not present in the JSON.
- If the checker fails, show the structured card without prose.
- No autonomous transaction.

## Harm controls

- Pause is never buried.
- No countdown, no "investors like you stayed in," no social proof.
- No red warning color reserved for the pause path.
- Cash-need branch is reviewed separately so it does not inherit the market-worry copy.
