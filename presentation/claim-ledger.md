# Skip Check deck — claim ledger

Access date for desk research: 2 October 2026, unless a row says otherwise. The prototype URL was rechecked on 4 October 2026. Nothing here is an interview, a usage metric, or a validation result.

Status values: **Primary**, **Secondary**, **Product** (code or running prototype), **Commentary**, **Hypothesis**, **Illustrative**, **Not measured**, **Do not use**.

## Slide 01 — Business context

| Claim on the slide | Status | Source |
| --- | --- | --- |
| August 2026 SIP contribution ₹32,297 crore | Primary | AMFI Monthly Note, August 2026. https://www.amfiindia.com/uploads/AMFI_Monthly_Note_August2026_230122d90a.pdf |
| July 2026 SIP contribution ₹31,961 crore | Primary | AMFI Monthly Note, July 2026. https://www.amfiindia.com/uploads/AMFI_Monthly_Note_July2026_53ab600348.pdf |
| 10.02 crore contributing SIP accounts in August 2026; 9.90 crore in July | Primary | Same AMFI notes. Accounts, not people. |
| July 2026 discontinued/tenure completed 50.30 lakh vs 61.44 lakh new; ratio 81.87% | Secondary | Economic Times citing AMFI. Not re-read from an AMFI workbook. https://economictimes.indiatimes.com/mf/analysis/mutual-fund-sip-stoppage-ratio-falls-to-82-in-july-as-new-registrations-outpace-closures-for-the-third-straight-month/articleshow/133202521.cms |
| A ceased SIP includes three consecutive failed instalments. Not a researched decision | Primary for the definition | AMFI footnote, as recorded in `research/05_market_landscape.md` and `research/04_hypothesis_register.md` |
| FinLit Ventures, founded publicly in 2026 by Nishant Jain; footer says not registered with SEBI or AMFI | Primary for the public site | finlitventures.com bundle, accessed 2 Oct 2026. `research/01_company_dossier.md` |
| Discretionary-management wording is a compliance tension, not a feature | Interpretation of primary copy | Same dossier. The deck does not claim the firm manages client money |
| Site list prices ₹99–₹2,499. Conversion unknown | Primary for the prices; unknown for conversion | Same dossier |
| Skip Check is free. ₹99 is a list price. The prototype does not take payment or book a review. Connect only if a contact or booking URL is set; otherwise an honest not-connected panel | Product | `src/domain/finlit-contact.ts`, `FinlitConnect` in `src/features/assessment/AssessmentApp.tsx` |
| skip-check.vercel.app is the deployed prototype, not usage evidence | Product | HTTP 200 on 4 Oct 2026. No usage data |
| The product does not change the SIP | Product | `DOES_NOT_CHANGE` in `src/domain/decision-rules.ts`; assessment copy |
| JTBD sentence | Illustrative, reconstructed | `research/06_persona_and_segmentation.md`. Not a locked sentence. Not an interview |

## Slide 02 — Evidence

| Claim on the slide | Status | Source |
| --- | --- | --- |
| r/MutualfundsIndia: a poster asks whether to stop from fear of a correction; replies disagree | Single anecdote, paraphrased | https://www.reddit.com/r/MutualfundsIndia/comments/1mpox9p/should_i_stop_my_sips_now_due_to_fear_of_market/ — `research/08_voice_of_customer.md` V1. No username, no verbatim quote |
| r/personalfinanceindia: SIP cash for an education loan; replies favour reduce and not selling units | Single anecdote, paraphrased | https://www.reddit.com/r/personalfinanceindia/comments/1auecgg/im_thinking_of_stopping_my_sips_next_month/ — V2 |
| r/IndianStockMarket: paused two months in a cash crunch during a drawdown | Single anecdote, paraphrased | https://www.reddit.com/r/IndianStockMarket/comments/1sbi166/lost_30_of_my_portfolio_in_6_months_but_i_didnt/ — V3 |
| H4 mean 2.8. High confidence as a measurement warning. Not “pauses are rare” | Hypothesis score; high confidence only for the warning | `research/04_hypothesis_register.md`. Equal weights. Not validated |
| H1 mean 3.7. Mechanism, not a rate | Hypothesis | Same file |
| H2 mean 4.3. Selected. Cash and fear can share one thin confirm | Hypothesis | Same file |
| Kuvera: stop is not a withdrawal. Modified 19 Apr 2022 | Primary help article | https://kuvera.freshdesk.com/support/solutions/articles/82000703516-i-have-stopped-the-sip-but-i-have-not-received-the-funds- |
| Groww: cancel may not stop a near-dated debit | Primary help article | https://groww.in/help/mutual-funds/order/i-cancelled-my-sip-instalment-but-still-my-amount-got-deducted--79 |
| Existing units stay invested. The difference is not an investment loss | Product, and consistent with the Kuvera article | Assessment copy and `src/domain/decision-rules.ts` |
| Mint 2026 and Economic Times: a cash-flow shock can justify a pause; a correction is a weak reason | Commentary | `research/05_market_landscape.md`. Mint: https://www.livemint.com/money/personal-finance/when-should-you-pause-your-sip-experts-explain-when-it-makes-sense-and-when-it-doesnt-11785041953658.html — ET: https://economictimes.indiatimes.com/mf/analysis/should-you-stop-sips-during-market-corrections-heres-what-investors-need-to-know/articleshow/127525519.cms |
| Nobody has been interviewed | Method limit | `research/06`, `research/08`, `research/20` |

## Slide 03 — Persona

| Claim on the slide | Status | Source |
| --- | --- | --- |
| Ananya Shah, 31, Pune, salaried. Two equity SIPs totaling ₹12,000/month. House goal about eight years | Illustrative | `research/06_persona_and_segmentation.md`. Not interviewed. Not a customer record |
| Situation 1 is a market-worry month, anchored to public threads, not her words | Illustrative | Same file, plus the threads in slide 02 |
| Situation 2 is the same person, salary delayed 1–3 months. Pause is legitimate | Illustrative | Same file, secondary branch |
| No second named person | Method rule | Same file. The deck does not invent one |
| Outcomes (restate, pause without hunting, no pressure, unpaid ₹99) | Not measured | Intended outcomes. `research/17_execution_roadmap_and_gtm.md` |
| Formula, in-memory events, no amounts, local recap after consent, local-only reminder, no observed rate | Product | `src/domain/sip-calculator.ts`, `src/analytics/assessment-events.ts`, `src/features/assessment/recap-store.ts`, `AssessmentApp.tsx` |
| Usability 8–10; 7 of 10 restate both lines; distribution 10 of first 50 | Not measured | `research/17`. Proposed gates |

## Slide 04 — Journey and hypotheses

| Claim on the slide | Status | Source |
| --- | --- | --- |
| Live journey: landing doors, optional reason, amounts, equal Keep/Reduce/Pause, What if, optional 3-question clarity, recap, connect-or-not-connected | Product | `src/features/assessment/AssessmentApp.tsx`. `src/App.tsx` renders `AssessmentApp` only |
| Reason changes emphasis, not the formula, and can be skipped | Product | `assessmentReasonLine` in `src/domain/assessment-reasons.ts` |
| Formula (current − proposed) × months; whole rupees; 1–24 months; increases rejected; above ₹10,00,000 needs confirmation; pause is proposed ₹0 | Product | `src/domain/sip-calculator.ts` |
| SIP Check Bot explains and does not decide | Product | `src/domain/bot-copy.ts`, `BotPanel.tsx` |
| Analytics in memory, no amounts | Product | `AssessmentEvent` has no amount fields |
| H1 3.7, H2 4.3 selected, H3 3.5, H4 2.8 | Hypothesis | `research/04`. Equal weights. Not validated |
| Why H2: still useful if most pauses are legitimate | Hypothesis rationale | Same file |
| Falsifier: cash-need users feel pressed, or cannot restate the arithmetic | Not measured | Same file. Proposed, not run |
| research/17 says the prototype was “not built” | Discrepancy | `research/17_execution_roadmap_and_gtm.md` phase 3 |
| product-decisions.md describes an earlier card flow (restart month, no persistence) | Discrepancy | `docs/product-decisions.md` |
| `informedChoiceRate` uses `reason_selected`, `calculation_viewed`, `choice_recorded`, `comprehension_passed` over `valid_card_reached`, `sessionKind` decision | Product, earlier flow | `src/analytics/funnel-metrics.ts`, event names in `src/analytics/event-types.ts` |
| The live assessment emits different events and has no observed rate | Product | `src/analytics/assessment-events.ts`. Do not present either rate as a result |

## Slide 05 — Problem framing

| Claim on the slide | Status | Source |
| --- | --- | --- |
| True problem: undifferentiated confirm; pause can be right; difference is not a loss; units stay invested | Hypothesis plus product rules | `research/02_problem_reconstruction.md`, `research/11`, assessment copy |
| Who: salaried SIP investor, distant goal; Ananya illustrative; same person if salary slips | Illustrative | `research/06` |
| About 6.7% of households hold MF or ETFs; about 18% in the top nine metros | Primary | SEBI Investor Survey 2025 main report. https://www.sebi.gov.in/sebi_data/commondocs/jan-2026/Investor%20Survey%202025%20Main%20Report.pdf |
| 63% / about 213 million households aware of a securities product. Awareness ≠ participation | Primary | SEBI press note. https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1759239238040.pdf |
| 36% of investors had high or moderate securities knowledge | Primary | Same press note. Investors, not all households. Not a skip rate |
| Customer and business value | Not measured | Potential only. `research/11_problem_validation_and_impact.md` |
| Do not use FinLit site TAM 38.5 crore or “NCFE 2026” | Do not use | `research/01`. The site’s own label is an estimate and mis-dates the survey |
| NCFE literacy 27% is 2019 fieldwork | Primary, old | NCFE / RBI, fieldwork 2018–19. `research/05` |
| Why now: large habit, thin confirm, July ratio fell. Not a crisis claim | Hypothesis | `research/11`, `research/21` |
| Synthesis sentence | Recommendation | Follows H2 and H4. Not a measured outcome |

## Slide 06 — Synthesis

| Claim on the slide | Status | Source |
| --- | --- | --- |
| Believe: H2, legitimate pauses, deterministic arithmetic, units and loss lines, stoppage count is the wrong count | Hypothesis and product | `research/04`, `src/domain/sip-calculator.ts` |
| Unproven: interviews, fear share, restatement, pressure, any rate, RICE 200 | Not measured | `research/04`, `research/17`. RICE reach of 200 is an assumption, not a historical score |
| Gate 1: counsel before a public pilot. Registration line. Compliance review not completed | Not measured | `research/17`, `REGISTRATION_LINE` in `src/domain/decision-rules.ts` |
| Gate 2: at least 7 of 10 restate the rupee line and the units line; cash-need users can pause without hunting | Not measured | `research/17`. Not run |
| Gate 3: fail if fewer than 10 of the first 50 non-staff sessions are about to change a SIP | Not measured | `research/17`, `research/22`. Not run. Continuation is not the gate |
| Wireframes are a later section and are not in this deck | Scope | This file set is six pages |

## Explicitly absent

- Verbatim quotes, usernames, or a second persona.
- A measured informed-choice rate.
- FinLit’s site TAM and an “NCFE 2026” literacy rate.
- Any claim that FinLit is registered with SEBI or AMFI.
- Any claim that the prototype collects payment or books the ₹99 review.
