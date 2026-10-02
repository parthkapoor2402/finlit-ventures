# 04 — Hypothesis register

Four causal explanations. They are not four feature ideas. None is treated as validated.

Scoring uses equal weights across customer impact, frequency, evidence strength, addressability, business relevance, and feasibility (each 1–5). Equal weights are used because this register is about which explanation to test, not which feature to ship.

## H1 — Fear is misread as a reason to interrupt a long-horizon SIP

- Segment: salaried people with a SIP and a goal more than five years away, in the first drawdown they have felt personally.
- Trigger: a visible fall in the fund or the index, often encountered in the app's return number.
- Current behaviour: they open skip or cancel, or they ask a forum whether to stop "until the correction."
- Root cause: recency and loss aversion. The recent red number is treated as information about the next instalment. The SIP's purpose, buying through that period, is not on the confirm step.
- Customer consequence: instalments are skipped during the period a long-horizon SIP is designed to continue, and restart is easy to delay.
- Business consequence: FinLit's promise is understanding before action. If it cannot help at this moment, the portfolio review arrives after the habit is broken.
- Supporting evidence: Mint and Economic Times expert commentary that volatility is a weak reason to stop and cash-flow change is a strong one. Reddit threads titled as fear of a correction. Groww's confirm flow, as documented, does not show goal math.
- Contradicting evidence: industry SIP contributions were ₹31,961 crore in July 2026 and ₹32,297 crore in August 2026, with about 10 crore contributing accounts. The aggregate book is not collapsing. Many commenters tell the poster not to stop. H1 can be true for a minority and still matter, but it is not the whole market.
- Unknowns: the share of skip/cancel sessions whose stated reason is the market.
- Confidence: medium-low as a population claim; medium as a mechanism that shows up in public advice and forums.
- Research required: a reason taxonomy on real skip attempts, or a diary study. FinLit does not have that data.

Scores: impact 4, frequency 3, evidence 3, addressability 4, business 4, feasibility 4. Mean **3.7**.

## H2 — The harmful gap is an undifferentiated confirm, not the pause itself

- Segment: the same SIP investor, plus the person who is pausing for a real cash need.
- Trigger: any skip, reduce, or cancel, whatever the motive.
- Current behaviour: one confirm path. A cash emergency and a scare look the same. The user is not shown missed rupees, a restart date, or the rule that repeated skips can cancel the SIP.
- Root cause: the workflow collects a tap, and sometimes a reason code, and does not branch the explanation.
- Customer consequence: the scared investor pauses without seeing the horizon math; the strapped investor pauses without a restart plan and can trip an auto-cancel.
- Business consequence: a tool that only says "stay invested" will be distrusted and, for the cash-need user, wrong.
- Supporting evidence: Groww documents both a reason step on cancel and a three-skip cancellation rule, in separate help articles. Kuvera documents that stopping a SIP does not return the money already invested, a confusion real users write in about. Expert sources explicitly split "cash" from "market."
- Contradicting evidence: some users may already understand this and still choose correctly. A reason dropdown may already do light segmentation inside Groww; the help article confirms a reason is selected, not that it changes the explanation.
- Unknowns: whether any app already branches copy by reason. Not found in the help centers reviewed.
- Confidence: medium. This is the most addressable hypothesis because it does not require the pause to be a mistake.
- Research required: 8–10 moderated tests of a reason-branched card versus a plain confirm. Kill the idea if people who need cash feel pressed to continue, or if people cannot restate the arithmetic.

Scores: impact 4, frequency 4, evidence 3, addressability 5, business 5, feasibility 5. Mean **4.3**.

## H3 — The binding problem is distrust and low comprehension, and the moment does not matter

- Segment: newer investors with low securities knowledge.
- Trigger: any confusing screen, not specifically SIP skip.
- Current behaviour: they look for a person, a forum, or a review, and they delay.
- Root cause: 36% of investors in the SEBI 2025 survey had high or moderate knowledge; trust and complexity are stated barriers to participation.
- Customer consequence: they either avoid markets or outsource the decision to anonymous comments.
- Business consequence: FinLit's existing research and 0→1 service would be the product, and a decision-moment co-pilot would be a distraction.
- Supporting evidence: SEBI survey barriers; NCFE 2019 literacy rate; FinLit's own positioning around confusion.
- Contradicting evidence: the people in the SIP threads are already investing. Their question is narrow and timed. A general literacy course does not answer "what changes if I skip three months of this ₹8,000 SIP?"
- Unknowns: whether comprehension of a one-screen consequence card is high enough to matter.
- Confidence: medium that literacy is a background condition; low that it replaces the moment-specific problem.
- Research required: a comprehension test. If a plain-language card is still misunderstood, H3 dominates and the MVP must shrink further.

Scores: impact 4, frequency 5, evidence 4, addressability 2, business 3, feasibility 3. Mean **3.5**.

## H4 — "SIP stoppage" is mostly tenure completion, failed debits, and churn

- Segment: the industry statistic, not a person in a scare.
- Trigger: a SIP reaches its end date, or instalments fail.
- Current behaviour: the account is counted as discontinued/tenure completed.
- Root cause: AMFI's definition. The footnote on the industry SIP table says SIPs with 3 consecutive failed monthly instalments are ceased, and the published count is "discontinued/tenure completed."
- Customer consequence: building an anti-panic product against this number would lecture people who finished a goal or whose bank mandate failed.
- Business consequence: a vanity metric and a wrong roadmap.
- Supporting evidence: AMFI wording, quoted via the industry page snippet and the Economic Times description of the ratio. March and April 2026 ratios above 100% coincided with record or near-record contributions, which is inconsistent with a simple story of investors fleeing.
- Contradicting evidence: experts and forums still describe voluntary, fear-based stops. Both can be true. H4 kills the use of the ratio as a market-sizing input. It does not kill the existence of the decision.
- Unknowns: the voluntary share. Unknown. Do not invent it.
- Confidence: high as a critique of the statistic; not a claim that voluntary pauses are rare.
- Research required: an AMFI or AMC split, which is not public in the sources reviewed. Until then, size the opportunity as a framework, not as "50 lakh panics a month."

Scores: impact 3, frequency 5, evidence 4, addressability 1, business 2, feasibility 2. Mean **2.8**.

## Leading hypothesis

**H2, informed by H1 and constrained by H4.**

The decision to test is: at the moment of skip, reduce, or cancel, investors do not get a branched explanation that separates a cash need from a market scare and shows the arithmetic of the next instalments and the cancellation rule. Some of those sessions are fear-driven (H1). The industry stoppage ratio must not be used as the count of those sessions (H4). Background literacy is real (H3) and is the reason the card must be short.

### Why H2

It is the only hypothesis that stays useful if H1 is only partly true. If most pauses are legitimate, the product still helps by making the restart plan and the auto-cancel rule visible. If many pauses are fear, the same card shows horizon and missed rupees without forbidding the pause.

### What would disprove H2

- Moderated users who already state the missed amount, the horizon effect, and the cancellation rule before seeing the card, and do not change their choice or their confidence.
- Users with a real cash need who feel the card is pushing them to stay invested.
- Evidence that target apps already present this branch at confirm.

### What must be true for a solution to work

- The user can supply, or has already supplied, SIP amount, intended interruption, goal horizon, and reason.
- The arithmetic is deterministic and labeled.
- The card does not predict returns.
- The user can still pause in one or two taps.

### Cheapest validation

Eight to ten usability sessions with salaried SIP investors. Give them a sample SIP and two scenarios (a 8% fall with a stable salary; a salary delay). Ask them to choose continue, reduce, or pause before and after the card. Record whether they can restate the missed rupees and the restart date. This does not estimate a population effect.

### Behavioural change to measure

Not "fewer pauses." The change is: the user names a reason, can restate the consequence, and then chooses continue, reduce, or pause. Secondary: among fear scenarios, a higher share choose continue or reduce; among cash scenarios, pause remains easy and includes a restart date.

### Abandon or revise if

- Fewer than half of session participants can restate the core numbers after using the card.
- Cash-need participants describe pressure to continue.
- A public help article or a recorded app flow already does the branch, and users understand it.
