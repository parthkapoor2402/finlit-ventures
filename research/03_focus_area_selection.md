# 03 — Focus-area selection

Scores are 1–5 decision aids. They are not measurements. Weights are a choice, explained below, and then stressed.

## Weights

| Criterion | Weight | Why this weight |
| --- | --- | --- |
| Severity of the customer problem | 20% | A wrong decision can be costly, but severity alone favors the rarest, most irreversible act |
| Frequency / addressable reach | 15% | The brief needs a moment that actually happens |
| Potential improvement in decision quality | 20% | The business objective is informed decisions, not fewer transactions |
| Ability to intervene before the action is final | 15% | The brief's constraint |
| Strategic fit with FinLit as it exists publicly | 10% | A product FinLit cannot operate is a concept, not a recommendation |
| Credible MVP without a broker integration | 10% | Phase B has to be demonstrable on mock and user-entered data |
| Differentiation from the current confirm step | 10% | If the apps already do this, do not build it |

Fit and MVP feasibility are intentionally not the largest weights. They still matter because the prompt requires a product this company could run.

## Scores

Confidence is in the score's evidence, not in a false decimal.

### 1. SIP pause or reduction

| Criterion | Score | Rationale | Evidence | Confidence |
| --- | --- | --- | --- | --- |
| Severity | 3 | Does not by itself realize a loss or a tax. Repeated skips can cancel the plan. A cash-need pause is sometimes the right act | Groww help: 3 consecutive skips cancel the SIP. Mint: pause for cash shocks, not for a correction | Medium |
| Frequency | 5 | The action is mass-market. July 2026: 50.30 lakh SIPs discontinued or tenure-completed versus 61.44 lakh new (Economic Times, citing AMFI). The series mixes reasons, so frequency of the *button* is high and frequency of *panic* is unknown | ET 2026 articles; AMFI definition footnote | Medium on the count, low on the panic share |
| Decision quality | 4 | Reason split plus missed-rupee math can be done without forecasting returns | Deterministic from user inputs | Medium |
| Moment | 4 | The button exists on major apps. FinLit does not own it, so the first intervention is adjacent, not embedded | Groww, Coin, Kuvera, ET Money help | High on the button, medium on FinLit's reach |
| Fit | 5 | Matches "understand before action" and does not require executing a fund order | Company dossier | High |
| MVP | 5 | Amount, months, goal, horizon, and reason are enough for an honest prototype | — | High |
| Differentiation | 4 | Public help flows confirm the action. They do not show goal arithmetic or a fear-versus-cash fork | Help articles | Medium. A private experiment could exist |

Weighted score: **4.15**

### 2. Mutual fund redemption

| Criterion | Score | Rationale | Evidence | Confidence |
| --- | --- | --- | --- | --- |
| Severity | 5 | Can realize a loss, an exit load, and a tax. Harder to undo | Domain fact; tax rules must be verified per holding before any product states them | High on severity, low on being able to state the tax safely |
| Frequency | 3 | Redemptions are continuous, and equity funds have still reported net inflows in 2026 AMFI commentary. The panic share is unknown | AMFI monthly notes, July and August 2026, cite sustained SIP and equity participation | Low |
| Decision quality | 4 | Exit load, holding period, and goal fit would improve the decision if the data is scheme-accurate | Not safely available in a mock MVP | Medium |
| Moment | 3 | Redeem sits behind a confirm. FinLit is not there. The content is closer to advice | Help articles distinguish stop-SIP from redeem | Medium |
| Fit | 3 | Useful, but nearer a registered adviser's job | SEBI IA definition includes advice on selling | Medium |
| MVP | 3 | Wrong exit-load or tax copy is worse than no copy | — | High |
| Differentiation | 3 | Some apps already warn about exit load and tax. Not fully verified screen-by-screen | ET Money help index mentions tax and exit load questions | Low |

Weighted score: **3.60**

### 3. Investment withdrawal

Treated as a partial or goal-based cash-out, overlapping redemption. The moment is less standardized across products.

Scores: severity 4, frequency 3, quality 3, moment 3, fit 3, MVP 3, differentiation 2. Weighted: **3.10**.

Main weakness: "withdrawal" is not one workflow. A SIP investor, a stock investor, and a goal folio do different things. Building it means boiling the ocean.

### 4. Portfolio exit

Scores: severity 5, frequency 2, quality 3, moment 2, fit 2, MVP 2, differentiation 2. Weighted: **2.80**.

An exit of a whole portfolio is closer to discretionary advice. FinLit's site already uses "exit guidance" language while saying it is unregistered. This is the worst place to add an AI co-pilot.

### 5. Investment decision during market volatility

Scores: severity 4, frequency 4, quality 2, moment 2, fit 3, MVP 2, differentiation 2. Weighted: **2.80**.

Volatility is a condition, not a decision. Without a specific action, the product collapses into a market chatbot, which the brief's own critique of dashboards and chatbots already describes.

## Sensitivity

| Weighting | Winner | Runner-up | Gap |
| --- | --- | --- | --- |
| Baseline, as above | SIP pause or reduction (4.15) | Redemption (3.60) | 0.55 |
| Severity and decision quality at 30% each; frequency 10%; moment 10%; fit 10%; MVP 5%; differentiation 5% | SIP (3.95) | Redemption (3.90) | 0.05 |
| MVP and moment emphasized (MVP 30%, moment 25%, severity 15%, quality 15%, others 5%) | SIP (4.25) | Redemption (3.45) | 0.80 |

The choice is stable. It is not stable by a wide margin when severity is weighted hardest. Redemption is the right second use case once scheme-level exit load and a reviewed tax description exist. It is the wrong first use case for an unregistered firm using mock data.

## Decision

**Selected focus area: SIP pause or reduction.**

The product question is not "how do we stop people pausing?" It is "before this skip, reduction, or cancel is confirmed, can this person see whether the reason is cash, fear, a completed goal, or a fund that no longer fits, and what the next instalments and the platform's cancellation rule change?"

Abandoned as the primary scope:

- A general volatility co-pilot.
- A portfolio-exit adviser.
- A redemption tax engine in the MVP.
