# 00 — Problem statement deconstruction

Access date: 2 October 2026. Source: the three-page PDF supplied with this assignment, saved locally as `problem_statement (1).pdf`. No text was found outside the three pages. There is no second, hidden problem statement in the file. Interpretation below is labeled as such.

## What the PDF actually says

### Problem statement

FinLit Ventures is asked to re-imagine how investors make financial decisions at critical moments using AI. The brief states that platforms already provide dashboards, research, portfolio analytics, and AI insights, but the experience is largely retrospective. It states that users often:

- receive information after a decision has already been made
- struggle to interpret market movements
- react emotionally to volatility
- pause or withdraw investments
- rarely receive contextual guidance at the exact moment a financial decision is being made

It concludes that financial information often remains informative rather than actionable, with limited intervention at the moment it can influence behaviour.

### Market insights and key observations

The brief locates the setting in the Indian investment ecosystem and says decision-making remains fragmented and reactive. Stated observations:

- Investors have a large amount of financial information but lack contextual guidance for time-sensitive decisions.
- Platforms rely on dashboards, alerts, reports, and chatbots that are retrospective or reactive rather than intervening at the decision moment.
- Investors may pause SIPs, reduce investments, redeem mutual funds, or exit positions during volatility without fully understanding implications for the portfolio or goals.
- The same market event can produce different reactions depending on horizon, portfolio structure, risk profile, and goals.
- Trust requires AI that explains reasoning rather than a black box.
- Regulatory and compliance considerations require interventions to be transparent, explainable, and bounded around automated decision-making.

### Business objective

Design an AI financial-intelligence experience that:

- increases informed decision-making among retail investors
- reduces impulsive or poorly contextualized investment decisions during volatility
- improves understanding of portfolio performance, risk, and goals
- creates interventions at critical financial decision moments
- builds trust through explainable AI
- strengthens a stated vision of helping people understand their money before investing it

### Challenge and allowed focus areas

Design an AI co-pilot that intervenes at **one** clearly defined investment decision moment, before the action is finalized, with the user remaining in control.

Named examples:

1. SIP pause or reduction
2. Mutual fund redemption
3. Evaluating an exit during volatility
4. Portfolio and goal context before a significant withdrawal
5. Explanations based on portfolio, horizon, risk, and market context

Named focus areas to choose among:

- SIP Pause or Reduction
- Mutual Fund Redemption
- Investment Withdrawal
- Portfolio Exit
- Investment Decision During Market Volatility
- Or another clearly defined pre-decision use case, including an algorithmic stock-picking solution

The brief asks for a justification of scope, persona, exact trigger, AI intervention, and success metric. It lists capability areas the solution may integrate: portfolio health, mutual fund analytics, ETF analytics, goals, risk and diversification, market context, historical performance, horizon, and other integrations. Required qualities: simple, intuitive, explainable, scalable, aligned with a technology-first financial-intelligence vision.

### Deliverables requested by the brief

| Bucket | Items |
| --- | --- |
| Product strategy | Product understanding and industry overview; market research and competitor analysis; target persona; problem and opportunity sizing; vision and value proposition; product strategy |
| Product execution | Success metrics and north-star metric; GTM; roadmap; assumptions and risks |
| Product design | User journey; key flows; feature prioritization (RICE, MoSCoW, or another framework); low- or high-fidelity wireframes; prototype walkthrough |
| Bonus, optional | AI reasoning framework; explainable AI; personalization; decision guardrails; regulatory considerations; monetization; technical architecture; data instrumentation |
| Submission | Presentation deck, maximum 15 slides; clickable prototype (Figma, Lovable, Bolt, Replit, Cursor, or another tool); optional short demo video |

### Evaluation weights

Each of the following is 20%:

- Problem understanding and research
- Product strategy and innovation
- Product design and prototype
- Product execution (prioritization, metrics, roadmap, GTM)
- Presentation and communication

## Constraints that are non-negotiable in the brief

- One decision moment, not a general finance app.
- Intervention before the action is finalized.
- The user keeps the final decision.
- Explainability and a boundary on automated decision-making.
- Different investors can rationally respond differently to the same market event.

## Implied, not stated

These are inferences, not PDF text:

- "Reduce impulsive decisions" can conflict with "informed decision-making" if the product treats every pause or redemption as a mistake.
- The brief assumes FinLit can sit close enough to the action to intervene. The public company evidence in `01_company_dossier.md` does not show a brokerage or mutual-fund transaction surface.
- Success is framed as behaviour change during volatility, but the brief does not define the metric.

## Ambiguities

- "FinLit Ventures" in the PDF is a case role ("You are a Product Manager"). A real site at finlitventures.com exists. The PDF does not say the case is that company, and it does not disclose internal data. This research treats the public site as the operating context and does not invent internal usage.
- "Investment withdrawal" and "mutual fund redemption" overlap. "Portfolio exit" and "decision during volatility" also overlap.
- No customer counts, revenue, or deadline are in the PDF.
- No requirement to execute trades. The opposite boundary is explicit.

## Unknowns that research had to fill

- What FinLit actually sells and whether it is a regulated adviser or distributor.
- How large SIP interruption and redemption actually are, and what share is panic versus tenure completion, failed mandates, or cash need.
- What Groww, Coin, Kuvera, and ET Money already show before a skip or cancel.
- Where personalized consequence math becomes investment advice under SEBI rules.
