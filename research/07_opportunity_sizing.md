# 07 — Opportunity sizing

No TAM is presented as a fact. The industry totals and FinLit's reach measure different things. Scenarios are assumptions. They are here so the assumptions can be attacked.

## What is known

- About 9.90 crore contributing SIP accounts in July 2026 and 10.02 crore in August 2026 (AMFI monthly notes). These are accounts.
- About 50.30 lakh SIPs were discontinued or tenure-completed in July 2026, against 61.44 lakh new registrations (Economic Times, citing AMFI). The numerator mixes finished plans and ceased plans.
- About 6.7% of households hold MF/ETF (SEBI survey 2025). That is the participation base, not the monthly decision base.
- FinLit's published audience of ~38.5 crore is its own estimate and is not used.

## What is unknown, and therefore not filled in

- Unique SIP investors.
- Share of discontinuations that are voluntary.
- Share of voluntary stops motivated by market fear rather than cash, goal completion, or a fund change.
- FinLit site traffic, review bookings, and paid conversion.

## Bottom-up framework

```text
Monthly SIP stop or completion events          S   (observed order: ~50 lakh, mixed causes)
x voluntary decision share                     v   (unknown)
x share that are skip/reduce/cancel intent
  rather than a finished tenure                d   (unknown; subset of v)
x share FinLit could reach without a broker    r   (tiny; content and review clients)
x share who start a decision check             a
= monthly decision-check sessions
```

## Scenarios for a FinLit-operated MVP, not for India

These are planning ranges for the company as it publicly exists, a new research site with no demonstrated app install base.

| Input | Conservative | Base | Optimistic | Why |
| --- | --- | --- | --- | --- |
| People who reach a FinLit article or review about pausing a SIP, per month, after a basic content push | 200 | 1,000 | 5,000 | Assumption. No traffic data. Optimistic still is not "a percent of AMFI" |
| Start a decision check | 20% | 35% | 50% | Assumption. A tool on an article converts worse than a button inside Groww |
| Finish an informed choice | 40% of starters | 55% | 70% | Assumption, to be replaced by the usability test |
| Monthly completed checks | 16 | 193 | 1,750 | Product of the rows above |
| Paid review attach, ₹99 or a plan | 2% | 5% | 10% | Assumption. Conflict-free only if the review is paid by the user, not by a fund |

At the base case, about 200 completed checks a month is a learning product, not a venture-scale AUM story. That is the honest SOM for FinLit alone.

A partner embed inside a large app would multiply `r` by the partner's skip-screen traffic. No such partner exists in public evidence. That case is not in the base scenario. If a partner with 1 lakh skip attempts a month sent 10% into a check, sessions would be 10,000. That sentence is a sensitivity, not a forecast, and it depends on a contract and a regulatory review.

## Money

Industry SIP flow of ~₹32,000 crore a month is not FinLit revenue. FinLit does not earn trail commission on these SIPs, according to its statement that it is not AMFI-registered. The commercial numerator is sessions and paid reviews, priced today from ₹99 to ₹2,499. Willingness to pay for this specific card is untested.

## Sensitivity

The output moves almost one-for-one with traffic (`r`) and with start rate (`a`). It does not move with the 50 lakh industry figure until FinLit is in the distributor's screen. Using the industry figure as SOM would overstate the opportunity by orders of magnitude.

## What would change the sizing

A measured voluntary-pause share, from an AMC or from a platform partnership, would replace `v` and `d`. Until then, the market argument for building the card is the existence of the decision and the thin confirm step, not a rupee TAM.
