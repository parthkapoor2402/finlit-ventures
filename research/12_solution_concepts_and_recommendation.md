# 12 — Solution concepts and recommendation

Concepts were written after the evidence review. The most automated concept is not the recommendation.

## Concept A — Broker interrupt

The card is injected into Groww, Coin, Kuvera, or ET Money between "Skip" and "Confirm."

- Trigger: the platform's skip or cancel event.
- Context: the platform's SIP amount, next date, and scheme.
- Journey: tap Skip, see the card, then confirm or back out.
- User choice: continue, reduce, pause.
- Data: partner API. High complexity and a commercial contract.
- Regulation: the partner is often the distributor. Copy that says "do not pause" could be incidental advice or a conflict. Needs the partner's compliance team.
- Differentiation: highest moment fit, lowest FinLit control.
- MVP: not feasible for FinLit alone.
- Value: real only if a partner agrees.

## Concept B — FinLit Skip Check, before the user confirms in their own app

A page on FinLit. The user is considering a change and enters, or confirms, the SIP amount, the number of months, the goal horizon, and the reason. The card computes what can be computed and then tells them to complete the action in their own app.

- Trigger: declared intent ("I am about to skip or cancel").
- Context: only what they type, plus a clearly labeled sample if they are exploring.
- Journey: reason, consequence, choice, a short note they can take back to the app. No order is sent.
- Follow-up: optional restart reminder they opt into. Optional ₹99 review.
- Data: user-entered. No broker link in the MVP.
- Regulation: educational consequence math. No buy/sell instruction. Footer already says the firm is not SEBI or AMFI registered; the screen repeats a plain-language limit.
- Differentiation: reason branch plus arithmetic, with pause left intact. Copyable, but aligned with a firm that does not earn trail.
- MVP: feasible.
- Weakness: the user must arrive. Many will not leave the broker app. This is the largest adoption risk.

## Concept C — Retrospective review after the pause

Extend today's portfolio review. After someone has already paused, explain what happened.

- Trigger: a booked review, or a user saying they already stopped.
- Fit: matches a service FinLit already sells.
- Failure: the brief's constraint is before the action is finalized. This is the dashboard pattern the brief criticizes. It remains a paid service. It is not the co-pilot.

## Matrix

Scores 1–5. Weights: customer value 20, evidence 15, moment fit 20, differentiation 10, feasibility 15, explainability 10, trust and safety 10.

|  | A Broker | B Skip Check | C After the fact |
| --- | --- | --- | --- |
| Customer value | 5 | 4 | 2 |
| Evidence the gap exists | 4 | 4 | 3 |
| Moment | 5 | 3 | 1 |
| Differentiation | 3 | 4 | 2 |
| Feasibility now | 1 | 5 | 4 |
| Explainability | 4 | 5 | 4 |
| Trust and safety | 2 | 4 | 3 |

Weighted: A = 0.2*5 + 0.15*4 + 0.2*5 + 0.1*3 + 0.15*1 + 0.1*4 + 0.1*2 = 1+0.6+1+0.3+0.15+0.4+0.2 = **3.65**

B = 0.2*4 + 0.15*4 + 0.2*3 + 0.1*4 + 0.15*5 + 0.1*5 + 0.1*4 = 0.8+0.6+0.6+0.4+0.75+0.5+0.4 = **4.05**

C = 0.2*2 + 0.15*3 + 0.2*1 + 0.1*2 + 0.15*4 + 0.1*4 + 0.1*3 = 0.4+0.45+0.2+0.2+0.6+0.4+0.3 = **2.55**

A wins on the pure moment and loses on the ability of this company to ship it. B is the recommendation. A is the expansion if a partner appears. C is the current business, not the new product.

## Selected product

**Skip Check.**

For a salaried SIP investor
who has decided to open a skip, reduce, or cancel and has not confirmed it,
Skip Check helps them judge that instalment
by showing a reason branch and a deterministic consequence card
at the last moment they are still willing to look, on FinLit, before they confirm in their own app,
so they can choose continue, reduce, or pause and restate what will change.

### Vision

People change a SIP only after they can say why, and what the next instalments do and do not do.

### Value proposition

Before you confirm a skip or a cancel, see the reason, the rupees, and the rule. Then decide. Pausing is allowed.

### Positioning

Not a fund picker. Not a forecast. Not the broker. A check beside the decision the broker already executes.

### Job

Make an instalment decision the user can explain.

### Boundaries, including what it will not do

- It will not place, pause, or cancel a SIP.
- It will not say "you should stay invested" as an instruction.
- It will not predict NAV, returns, or a goal date. The MVP calculator is only the difference in contributions. A rate-based goal illustration is out.
- It will not recommend a replacement fund.
- It will not take a commission on the mutual fund.
- It will not require a broker login in the MVP.
- It will not use the industry stoppage ratio as proof that the user is panicking.

### Why this use case first

It is the stable winner in `03`, the addressable hypothesis in `04`, and the only concept FinLit can operate without pretending to be a distributor. Redemption is the next decision, after scheme data and a legal review.
