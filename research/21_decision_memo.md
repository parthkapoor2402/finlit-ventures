# 21 — Decision memo (Phase A)

Phase B is not started. This memo is the approval document.

## 1. Executive summary

FinLit should not build a general investing chatbot, a redemption engine, or a tool whose success is "fewer pauses."

The public company is an early research and planning site. Its own footer says it is not registered with SEBI or AMFI. Major mutual-fund apps already let people skip or cancel a SIP through a short confirm. What those confirms do not do, in the help articles reviewed, is force a split between "I need the cash" and "the market scared me," or show the rupees that will not be invested and the fact that existing units are not redeemed.

**Recommendation: Skip Check.** A pre-confirm decision card on FinLit. The user states the reason and the amount. A calculator shows what is knowable. The user chooses keep, reduce, or pause, including an easy pause when the reason is cash. Nothing is executed. The north star is an informed choice, not a continued SIP.

The industry "stoppage ratio" is the wrong size of the prize. It mixes finished tenures and failed debits with voluntary stops.

## 2. What FinLit is today

A 2026 research and planning site run publicly by Nishant Jain: 0→1 investing, wealth and family planning, global investing, portfolio review, a published model-style portfolio, list prices from ₹99 to ₹2,499, and an education assistant that says it is not personalized advice. The site also describes discretionary portfolio management and exit guidance while stating it is not SEBI- or AMFI-registered. That wording is a pre-existing risk. Customer counts are unknown. The site's 38.5 crore TAM is its own estimate and mis-dates the NCFE 2019 literacy result as 2026. Detail: `01_company_dossier.md`.

## 3. The problem, reconstructed

Information is not scarce. The scarce thing is a personal, pre-confirm explanation of a SIP change. Layers and the causal map are in `02_problem_reconstruction.md`. A pause is sometimes the correct decision.

## 4. Every focus area

Weighted scores (decision aids): SIP pause or reduction **4.15**, mutual-fund redemption **3.60**, investment withdrawal **3.10**, portfolio exit **2.80**, volatility-as-a-decision **2.80**. SIP remains first when severity is up-weighted (3.95 vs 3.90) and when feasibility is up-weighted (4.25 vs 3.45). Redemption is the runner-up and the phase-2 problem. Detail: `03_focus_area_selection.md`.

## 5. Four hypotheses

- **H1.** Fear leads long-horizon investors to interrupt a SIP. Mean score 3.7. True for some people. The aggregate SIP book is not collapsing (about ₹32,297 crore and 10.02 crore contributing accounts in August 2026).
- **H2.** The harm is an undifferentiated confirm: cash and fear take the same path, without rupee consequences or a restart plan. Mean 4.3. Leading hypothesis.
- **H3.** Low knowledge and distrust dominate, and the moment does not matter. Mean 3.5. Background condition. Explains why the card must be short. Does not replace the moment.
- **H4.** Published stoppage counts are mostly tenure completion and failed mandates. Mean 2.8 as a product hypothesis, high as a measurement warning.

## 6. Why H2, and sensitivity

H2 stays useful if H1 is only partly true, because a correct pause still needs a restart date and a clear statement that units are not sold. H4 forbids using 50 lakh monthly stops as the count of panics. Detail: `04_hypothesis_register.md`.

## 7. Persona

**Illustrative, not interviewed: Ananya Shah, 31, Pune, salaried, two SIPs totaling ₹12,000 a month, house goal in about eight years.** She is the target because the problem is "at the skip button with a distant goal," not because of her age. A second branch is the same person with a salary delay, for whom pause is the right outcome. Detail: `06_persona_and_segmentation.md`.

## 8. Market and size

SEBI 2025: 9.5% of households participate in securities; about 6.7% hold MF or ETF; 36% of investors have high or moderate knowledge. SIP contributions are large and still growing. FinLit-alone scenarios, all assumptions: on the order of tens to low thousands of completed checks a month, not a share of industry AUM. Detail: `05`, `07`.

## 9. Customer evidence

A small public sample, not a market rate. Threads ask whether to stop because of a fall. Other threads stop or cut SIPs to pay a loan or survive a cash crunch, and replies say reduce rather than stop and do not redeem. Kuvera had to explain that stopping a SIP does not return cash. Groww documents surprise when a cancel does not catch a near debit. Detail: `08_voice_of_customer.md`.

## 10. Competitors

Groww, Coin, Kuvera, and ET Money verify a short skip or cancel. Groww collects a cancel reason; branching of the explanation is unknown, not proven absent. ET Money Genius has portfolio health as a separate product. Forums already say "don't stop in a crash." Detail: `09_competitor_matrix.csv`, `10_competitive_gap_analysis.md`.

## 11. The precise pain

At the confirm step, the investor does the hard classification and the arithmetic alone.

## 12. Why it is unresolved

Apps are built to execute. Goal data is often missing. The public statistic hides the voluntary decision. A slogan is already free on the internet, so another slogan has no value.

## 13. Why now

The SIP habit is mainstream (about 10 crore contributing accounts). The confirm step is still thin. This is not "stops are exploding." July 2026's reported ratio fell.

## 14. Urgency and cost of the status quo

Once they are in the flow, the next debit has a cutoff of days. A skipped instalment is not bought later by magic. A cash pause without a restart date is how a temporary cut becomes a cancelled SIP, including via Groww's three-skip rule. The cost is not the whole portfolio.

## 15. Impact

Customer: a choice they can restate, including a guilt-free pause. Business: a concrete expression of FinLit's understand-before-action line, and a user-paid review only if they ask. Not claimed: higher returns, higher AUM, fewer pauses.

## 16. Three concepts

| Concept | Moment | Feasibility for this firm | Weighted score |
| --- | --- | --- | --- |
| A. Inside the broker confirm | Best | Cannot ship | 3.65 |
| B. Skip Check on FinLit, before they confirm in their app | Good enough, depends on the user arriving | Can ship | 4.05 |
| C. Explain the pause afterward | Misses the brief | Already close to today's review | 2.55 |

## 17. Recommended solution

**Skip Check (concept B).** Concept A is the later partnership, not the MVP. Concept C stays a service, not the co-pilot.

## 18. Trigger and intervention

Trigger: declared intent to skip, reduce, or cancel, before the broker confirm. Intervention: reason, deterministic rupees, "units are not redeemed," "future units are unknown," a sourced platform rule only when one exists, then keep / reduce / pause.

## 19. Journey

Article or review → intent → inputs or labeled sample → card → choice → one restatement → recap that tells her to finish in her own app. Detail: `18_user_journey_and_design_brief.md`.

## 20. MVP scope

Six screens. Sample plus editable inputs. Calculator. Four reasons. Three equal choices. Restatement. No account.

## 21. Not in the MVP

Broker login, order routing, LLM-written numbers, return forecasts, fund picks, tax and exit-load math, redemption, trail fees, stored data without a notice, performance marketing.

## 22. Metric tree

- **L0:** Informed choice rate. Reason stated, rupee line shown, choice recorded, restatement passed, over sessions that reached a valid card. Continuation is not the numerator.
- **L1:** Intent, card shown, reason, consequence viewed, restatement, choice, pause-with-date, and the cash-need pause rate (a collapse is a failure).
- **L2:** Calculator tests, unsupported-claim rejects, stale-rule citations, latency, dismiss, confusion, cost per session.

Detail: `15_metric_tree_and_experimentation.md`.

## 23. Guardrails

Wrong numbers, pressure on cash-need users, interrupts without intent, comprehension gaps, bad platform rules, privacy, advice-like copy, inference cost. Returns are not a success proxy.

## 24. Business model

Free card. Optional user-paid review at existing list prices. No payment for keeping the SIP alive. A broker embed is a later model with a conflict review. Detail: `14_business_model_and_gtm.md`.

## 25. GTM

Publish the answer to "should I pause my SIP," with the cash case and the fear case both in the story, and put Skip Check at the end. No assumed ad budget. No partner pitch until the comprehension test passes.

## 26. Prioritization and roadmap

Must: reason branch, arithmetic, sample label, non-redemption line, restart month, restatement. Should: a single sourced Groww rule. Won't: broker, tax engine, forecasts. Order: counsel on copy, prototype, 8–10 session test, revise or stop, then a public article. Detail: `17_execution_roadmap_and_gtm.md`.

## 27. Risks

Highest: the card is read as investment advice; the existing site already claims discretionary management while disclaiming registration; a cash-need user feels pushed; a quoted cutoff is wrong. Controls and owners: `16_risk_compliance_and_privacy.md`.

## 28. AI and explainability

The calculator and a decision table produce the card. A model is optional later and may only phrase JSON it is given. A checker drops any number, tax, or fund the JSON does not contain. Detail: `13`, `19`.

## 29. Regulatory and privacy

SEBI's advice definition includes portfolio advice and financial planning. The firm says it is not registered. Copy stays descriptive. DPDP notice only if a reminder is stored. Sample mode stores nothing. This memo is not a legal clearance.

## 30. Experiments

Ten moderated sessions, fear scenario and cash scenario. Pass if at least 7 of 10 restate the rupees and the non-redemption fact, and cash-need users can pause without hunting. Fail if they feel pressed to continue. No claim of statistical significance.

## 31. Evidence gaps

Voluntary share of SIP stops. Whether Groww's reason list already changes the next screen. FinLit traffic. Whether users will leave a broker app to use this. Legal sign-off.

## 32. Fifteen-slide outline

| # | Slide | What it must show | Evidence |
| --- | --- | --- | --- |
| 1 | Thesis | One moment: before a SIP skip or cancel. Informed choice, not fewer pauses | Brief; this memo §1 |
| 2 | Company and market | What FinLit is, including the registration line. SIP book is large; literacy and knowledge are limited | `01`, `05` |
| 3 | Evidence | Stoppage ratio's definition. Forum split between fear and cash. Thin confirms | `08`, S10, S14–S19 |
| 4 | Persona and journey | Ananya, labeled illustrative. Current confirm vs Skip Check | `06`, `18` |
| 5 | Hypothesis | H2 leads; H4 blocks bad sizing; what would kill H2 | `04` |
| 6 | Focus areas and size | Five scores and the sensitivity. FinLit SOM is sessions, not AUM | `03`, `07` |
| 7 | Gap | What four apps already do. The arithmetic they leave to the user | `10` |
| 8 | Product | The one-sentence definition and the three concepts | `12` |
| 9 | Experience | Six screens, three equal buttons | `18` |
| 10 | Explainability | Knowable rupees, unknown NAV, no "you should" | `13` |
| 11 | MVP | Must / won't | `17` |
| 12 | Metrics | L0 formula and the cash-need guardrail | `15` |
| 13 | Model and GTM | Free card, paid review, article-led, no trail | `14` |
| 14 | Risk and architecture | Advice boundary, calculator vs model | `16`, `19` |
| 15 | Roadmap and kill test | Usability pass/fail. Ask for Phase B | `17`, `04` |

No deck is created in Phase A.

## 33. Prototype plan for Phase B

After approval: a mobile-width clickable flow, sample and editable inputs, tested calculator, template copy, event stubs, a walkthrough recording. No broker, no model, no new market-data vendor.

## 34. Self-critique

**Customer advocate.** The problem is real as a workflow gap and unproven as a large error rate. The card can still overwhelm if it grows past one screen. Pause is specified as equal weight; the build has to keep it that way.

**Business leader.** Fit with "understand before action" is good. The path to revenue is a ₹99 review, which will not, by itself, build a large company. Distribution is the weak point: FinLit does not own the button. If leadership needs venture-scale AUM, this MVP will disappoint, and the honest answer is to seek a platform partner only after the card proves comprehension.

**Competitor.** Groww can copy the card. The differentiator is a firm that is not paid trail and is willing to make pause easy. That is a positioning advantage, not a moat. Forums already give the slogan for free.

**Data scientist.** The Reddit sample is biased toward people who ask for help. The SEBI survey is about participation, not skip behaviour. The north star is measurable and gameable if someone later adds continuation. Baselines do not exist.

**Financial domain.** Missed rupees are solid. Any goal-date shift would be fake precision and is excluded unless the user supplies the rate and it is labeled an assumption. Taxes are omitted on purpose.

**Compliance.** The advice boundary is the serious unresolved item. Separately, the current website's discretionary-management wording should be fixed whether or not Skip Check is built. A disclaimer under a "you should" sentence would not cure it.

**Engineering.** The MVP does not need integrations. The fragile piece is content operations: platform rules go stale.

**Strongest argument against.** People who are scared will not leave Groww to open FinLit, and people who will open FinLit already read the article that says not to panic. The card's incremental value could be near zero.

**Weakest assumption.** Arrival. The second weakest is that a reason branch changes comprehension rather than only adding steps.

**Largest evidence gap.** The share of skip sessions that are fear versus cash versus tenure versus failed debit.

**Worst unintended consequence.** A cash-strapped user feels told to keep a SIP they cannot afford, or a sentence is enforced as advice by an unregistered firm.

**Cheapest invalidation.** Ten usability sessions. Abandon or rewrite if restatement fails or the cash path feels coercive.

**When to abandon.** Those test failures; or a verified in-app flow that already does this branch clearly; or counsel says even the descriptive card is advice the firm cannot give. In that last case the choice is register, or do not ship.

The recommendation stands because the test is cheap and the alternative concepts are either inoperable (A) or too late (C). It should not stand if the test fails.

## Revision after the external scorecard

An external review scored the summary 60/100 and did not have this folder. Presentation was left unchanged. The accepted product changes, and the items that stay unproven, are in `22_scorecard_revision.md`.

In short: one entry page with two doors; the calculator is only `(current − proposed) × months`, labeled as contributions that would not be invested; the ₹36,000 figure is that illustration for ₹12,000 reduced to ₹6,000 over 6 months; a restart month does not restart anything; the rate-based goal gap is out of the MVP. No interviews, no prototype, and no legal clearance were added.
