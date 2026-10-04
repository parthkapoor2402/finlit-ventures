# 22 — Response to the external scorecard

The scorecard is a review of the written summary, dated in the chat on 2 October 2026. Provisional total 60/100. Presentation and communication (12/20) is out of scope for this revision because the deck has not been made.

This file does not award a new score. It separates three kinds of comment:

- **Already in the research folder**, which the reviewer did not have.
- **Accepted and changed** in the product definition.
- **Still open**, because closing it would require interviews, a built prototype, a measured channel, or counsel. Those are not invented here.

## What the 60/100 was looking at

The reviewer said the score is of the solution text, not of `research/`. These items were marked lagged or absent even though the folder already contained them:

| Comment in the scorecard | Where it already was |
| --- | --- |
| No source-backed competitor matrix with links and fact versus inference | `09_competitor_matrix.csv` (access date 2026-10-02, `evidence_status`, source URL, notes). `10_competitive_gap_analysis.md` |
| No selection model with weights and sensitivity | `03_focus_area_selection.md` |
| No payer, price, or conflict control | `14_business_model_and_gtm.md`: user pays, published ₹99–₹2,499, no trail |
| No phased roadmap or kill test | `17_execution_roadmap_and_gtm.md`, `04_hypothesis_register.md` |
| No event-level metrics or guardrails | `15_metric_tree_and_experimentation.md` |
| No risk owners | `16_risk_compliance_and_privacy.md` |
| No edge states | `13` and `18`, partial |

Those documents are not a substitute for a deck. They are why a 60 based only on the summary understates the written research. The gaps below are the ones that were real.

## Accepted gaps

1. **Distribution was named and not chosen.** The summary said arrival is the weakest assumption and then listed an article, a review, and a future partner. That is not one entry point.
2. **The calculator was described in prose**, not as a function with rejected inputs. A rate-based "goal gap" was still allowed if the user typed a rate. That is too easy to read as a forecast.
3. **"Lead with Pause" on the cash path** can look like a nudge. Choices were supposed to stay equal.
4. **A restart month can be read as an automatic restart.** No platform rule we verified says FinLit can restart a SIP.
5. **"Other" was not an explicit unsure state.**
6. **The evidence chain was scattered** across files rather than one observation → insight → requirement → intervention table.
7. **The step from prototype to pilot had no written gate** beyond the 7-of-10 usability rule.

## Changes made

### One entry point

**The only entry under test is a FinLit page the person opens themselves.**

Two doors on that page:

- "I am about to change a SIP in my own app, and I have not confirmed it."
- "I am only reading."

Skip Check runs only after the first door. The second door shows a labeled sample and does not count as a decision session.

Not claimed: a button inside Groww, Coin, Kuvera, or ET Money. A partner embed stays a later idea with no contract.

Why a person would open a second site at all, stated as a hypothesis not a finding: the broker confirm, as documented in the help articles, does not show the contribution difference or split cash from fear, and FinLit is not paid if the SIP continues. Whether anyone actually leaves the broker app to do this is the distribution test. It has not been run.

**Planning rule for that test, not a measured result.** After a page exists, look at the first 50 non-staff sessions. If fewer than 10 choose "I am about to change a SIP," this channel is an education audience, not a decision-moment channel, and it fails as distribution. The 10-of-50 line is a pre-registered planning rule. It is not derived from traffic we have. We have no traffic.

### Calculator

Only this function is in the product:

```text
contribution_difference = (current_monthly_rupees - proposed_monthly_rupees) × months
```

- Keep: proposed = current, difference = 0.
- Pause or cancel of future instalments: proposed = 0, difference = current × months.
- Reduce: proposed is what they type, and it must be greater than 0 and less than current.

Label, exactly: **"Contributions that would not be invested over this period under these inputs."** Not a loss. Not a return. Not units.

Worked illustration, using the persona's SIP amount, not a customer record: current ₹12,000, proposed ₹6,000, 6 months. Difference = ₹6,000 × 6 = **₹36,000** of contributions that would not be invested. Existing units are untouched. Future units are not estimated.

The optional user-supplied rate and "goal gap" line is **removed from the MVP**. It was the easiest way to slide into a forecast.

Input rules:

| Input | Rule |
| --- | --- |
| Blank, text, or negative amount | Do not calculate. Ask for a number of rupees greater than zero |
| Current amount of 0 | Invalid |
| Months blank, zero, or above 24 | Do not calculate. Ask for a whole number from 1 to 24 |
| Proposed amount greater than current | Stop. Say this check is for a skip, reduction, or cancel, not for raising a SIP |
| Proposed amount equal to current on the reduce path | Treat as keep, difference 0 |
| Amount above ₹10,00,000 a month | Ask them to confirm the digits before showing the card. This is a typo check, not a statement about typical SIPs |
| No reason | Reason is required, including "I'm not sure." The card does not invent one |

### Reasons and choices

Reasons: cash need, market worry, goal reached or near, fund no longer fits, I'm not sure.

"I'm not sure" shows the contribution line and the units line only. No paragraph about crashes. All three buttons stay available.

Cash need uses the same three buttons in the same order and the same visual weight. The sentence above them states that the contributions stay in their bank. It does not argue for or against the pause.

A restart month is collected only after they choose Pause, and it is optional ("no date" remains available). Copy: **"A month you might start the SIP again. Skip Check will not restart it. Your investing app will not restart it unless that app says so."** An email reminder exists only if they opt in, and the notice calls it a reminder, not an instruction to the AMC.

### Evidence chain

| Observation | Class | Insight | Requirement | What Skip Check does |
| --- | --- | --- | --- | --- |
| Groww, Coin, Kuvera, and ET Money help pages document a short skip, pause, or cancel confirm. Groww's help says three consecutive skips cancel the SIP | Verified help text, 2 Oct 2026. Not a screen recording of every app version | The confirm is an instruction. The rupee consequence is not in those articles | Show the contribution difference before they return to the app | Calculator line |
| Kuvera's help exists because users thought stopping a SIP returned cash. Groww's cancel note says existing units stay until a redemption | Verified help text. Kuvera article last modified 19 Apr 2022, so it may be stale | Stop and redeem are easy to confuse | Say that this action does not redeem units, and tell them to confirm on their app | Units line |
| Mint (2026) and Economic Times commentary, and public threads, describe both fear of a fall and a real cash use | Expert opinion and a small forum sample. Not a rate | One message cannot serve both | Branch on reason. Do not treat pause as a mistake | Reason control and equal choices |
| AMFI's discontinued/tenure-completed count includes finished tenures and ceased SIPs after failed instalments. July 2026: 50.30 lakh such SIPs versus 61.44 lakh new, via Economic Times citing AMFI | The definition is an industry footnote. The July counts are secondary | The ratio is not the prevalence of fear | Do not size the product as 50 lakh panics a month | Sizing in `07` stays a scenario |
| FinLit's site footer says the firm is not registered with SEBI or AMFI. The same site describes discretionary portfolio management | Verified strings in the site bundle, 2 Oct 2026 | Advice-shaped copy is a launch problem, including copy that already exists | Descriptive language only. Counsel before any pilot | Banned "you should." No fund name |
| No session with a person who recently faced this decision | Absence | Prevalence and comprehension are unknown | Do not claim the intervention works | Protocol in `17`. No results |

### Gates

| Phase | Work | Exit, or stop | Owner role |
| --- | --- | --- | --- |
| 0. This revision | Entry point, calculator, evidence chain | Written and reviewable. **Done as writing. Not done as user evidence** | Product |
| 1. Prototype | Six screens, calculator tests, error states in `18` | Arithmetic tests pass, including the ₹36,000 example and the rejected inputs. **Not built** | Engineering |
| 2. Usability | 8–10 people, fear scenario and cash scenario | At least 7 of 10 restate the rupee line and that units are not redeemed. Cash-need users can pause without hunting. Otherwise rewrite or stop. **Not run** | Product |
| 3. Distribution | The single FinLit page | First 50 non-staff sessions: at least 10 choose "about to change a SIP." Otherwise the channel fails. **Not run** | Product |
| 4. Counsel | Copy, data, platform-rule quotes, and the existing discretionary-management wording | A written review from qualified counsel. This folder is not that review. No pilot before it | Founder |
| 5. Pilot decision | Only if 2, 3, and 4 pass | Guardrails in `15` hold on observed sessions. Continuation rate is not the gate | Founder |

Roles are functions, not named hires. Headcount is unknown.

### Business model, restated so it cannot be missed

| Item | Decision |
| --- | --- |
| Who pays | The user, and only if they ask for a review |
| What is free | Skip Check |
| What costs money | The published FinLit session prices, starting at ₹99. No new price is invented for this card |
| What is not sold | A fee, trail, or affiliate payment that depends on the SIP continuing |
| Acquisition | The one page above. No paid-ads budget is assumed |
| Conflict control | Equal choices, no continuation metric in the north star, no fund link on the card |

Willingness to pay for the card itself remains unknown.

## What this revision does not do

- It does not report interviews. None were conducted.
- It does not report a usability test or a distribution test.
- It does not raise or lower the 60/100. Presentation was not re-scored.
- It does not build the prototype. That is still Phase B and needs an explicit go-ahead.
- It does not claim SEBI or AMFI status changed.
- It does not treat 7 of 10, or 10 of 50, as a population result. They are gates.

## How the category gaps move, as a judgment about the documents only

| Category | Scorecard | After this revision |
| --- | --- | --- |
| Problem understanding, 14/20 | Direct validation and prevalence still missing | Still missing. The evidence chain is easier to audit. The unknown split is still unknown |
| Strategy, 15/20 | Distribution and a copyable screen | One channel is now specified and falsifiable. The screen is still easy to copy. Behavioural proof is still absent |
| Design, 9/20 | No prototype, no test | Spec is tighter. The scorecard's "not demonstrated" judgment stands until a prototype exists |
| Execution, 10/20 | GTM, gates, instrumentation | Gates and the payer line are now explicit. Nothing has been operated |
| Presentation, 12/20 | Ignored | No deck |
