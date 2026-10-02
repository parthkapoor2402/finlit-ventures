# 15 — Metric tree

Baselines are **not yet measured** unless noted. Targets are set from the usability test, then from the first public month. No target is a disguised continuation quota.

## L0 — North star

**Informed choice rate**

- Numerator: sessions that (1) stated a reason, (2) displayed the rupee consequence, (3) recorded an explicit choice of keep, reduce, or pause, and (4) passed a one-line restatement check ("these rupees will not be invested" selected correctly).
- Denominator: sessions that passed the intent check and reached the card with a valid amount.
- Window: the same session. A choice made after abandoning does not count.
- Source: product events.
- Exclusions: sample mode unless the user replaces the sample with their own amount; sessions that bounce before the card; internal staff.
- Cadence: weekly once live.
- Attribution: this measures the session, not whether the user then did the same thing in Groww. A follow-up question ("what did you do in your app?") is optional and biased.
- Gaming: do not put continuation in the numerator. A team that did would bury Pause.
- Companion business metrics, separate from the north star: paid-review starts; 7-day return to FinLit; a one-question trust rating. These are not the north star.

"Verified" in the sense of a broker callback is **not** available. The metric does not pretend it is.

Events for the two-door page, still unmeasured: `door_about_to_change`, `door_only_reading`, `inputs_rejected` with a reason code (blank, negative, months, proposed_above_current, amount_confirm), `card_shown`, `reason_selected`, `choice_keep`, `choice_reduce`, `choice_pause`, `restart_month_set`, `restart_month_skipped`, `restatement_passed`, `restatement_failed`, `dismissed`, `pressure_flag`. Sample-mode sessions are excluded from the informed-choice rate unless the person replaces the sample amount. The distribution gate uses `door_about_to_change` over the first 50 non-staff sessions and is defined in `22_scorecard_revision.md`. It is not a measured baseline.

## L1 — Drivers

| Metric | Formula | Instrumentation | Baseline |
| --- | --- | --- | --- |
| Intent sessions | Users who choose the SIP-change intent | `intent_selected` | Not measured |
| Card shown with complete inputs | Cards rendered after validation | `card_shown` | Not measured |
| Reason stated | `reason_selected` / `card_shown` | event | Not measured |
| Consequence viewed | rupee line in viewport / `card_shown` | event | Not measured |
| Restatement passed | correct check / those who submit it | event | Not measured |
| Choice recorded | keep, reduce, or pause / `card_shown` | event | Not measured |
| Pause with restart date | pause choices that include a month / pauses | event | Not measured |
| Cash-need pauses | pauses where reason = cash / cash-reason cards | event | Not measured. A very low rate is a **failure**, not a win |
| Optional review click | clicks / completions | event | Not measured |

Clicks and notification opens are not in this list.

## L2 — Diagnostics

| Metric | Formula | Owner | Cadence | Failure threshold |
| --- | --- | --- | --- | --- |
| Input validation failure | invalid submits / submits | Engineering | Weekly | Spike after a copy change |
| Calculator test pass | CI suite | Engineering | Every change | Any failure blocks release |
| Unsupported claim in prose | checker rejects / LLM calls | Product | Weekly | Any user-visible reject that was not caught is an incident |
| Platform-rule citation coverage | cards for a named app that quote only a sourced rule | Product | Monthly | Zero tolerance for an unsourced day count |
| Time to card | p50 and p95 from intent to `card_shown` | Engineering | Weekly | Investigate if p95 > 2 seconds on the static card |
| Missing optional fields | share with no horizon, no app | Product | Weekly | Expected. Not a failure |
| Dismiss rate | dismiss / `card_shown` | Product | Weekly | A rise after copy changes |
| "This is wrong" | taps / `card_shown` | Product | Weekly | Read every comment in the pilot |
| Confusion flag | "I don't understand" / `card_shown` | Product | Weekly | Above the rate seen in the usability test |
| Cost per session | inference spend / sessions | Product | Monthly | Cap LLM; fall back to template |

Segment the choice mix by reason. Do not segment by predicted wealth.

## Guardrails

| Guardrail | Signal | Response |
| --- | --- | --- |
| Misleading number | Checker failure or user report of a wrong rupee | Kill prose; show the table only; incident |
| Pressure to stay invested | Cash-need users in tests say they felt pushed; or cash-reason pause rate collapses versus the pre-card choice | Rewrite the branch; stop the test |
| Unwanted interrupt | Card shown without intent | Bug |
| Uneven comprehension | Restatement pass rate much worse for one reason branch | Rewrite that branch before adding features |
| Harm from a wrong rule | Quoted cutoff later contradicted | Remove the number |
| Privacy | Data stored without the notice | Block save |
| Regulatory drift | Copy gains "you should buy/hold" | Block release |
| Cost | LLM cost per session above the cap | Template only |

Decision quality is **not** the user's return over the next month. A pause before a rally and a continuation before a fall can both be informed.
