# 02 — Problem reconstruction

The brief's tension is real as a description of the industry: information is abundant, and the confirm step on a SIP change is thin. The causal story is not "investors lack AI." Several different causes can produce the same tap on Pause.

## Separate the layers

| Layer | What it is | What the evidence supports | What it does not support |
| --- | --- | --- | --- |
| A. Information availability | Data exists somewhere | AMFI, AMC factsheets, and apps already show NAV, returns, and holdings. SEBI's 2025 survey finds 63% of households aware of at least one securities product | Availability does not mean the figure is on the confirm screen |
| B. Comprehension | The person can interpret the figure | Only 36% of investors in that survey had high or moderate securities knowledge. NCFE 2019 put adult financial literacy at 27% | This is general literacy, not proof that SIP investors misread a specific screen |
| C. Personal relevance | The figure is about this goal and this SIP | The brief asserts this. Apps show the fund. They do not, in the help articles reviewed, show "your house goal moves by N months" | Relevance requires goal data many apps do not have at the skip step |
| D. Decision confidence | The person can choose | Reddit threads ask strangers whether to stop a SIP. That is a confidence gap in a public sample, not a prevalence estimate | Asking is not the same as being unable to decide |
| E. Emotion | Fear, loss aversion, recency | Expert commentary (Mint, Economic Times) says volatility is a common but weak reason to stop. About 80% of households in the SEBI survey prefer capital preservation | Emotion is a plausible mechanism. It is not measured as the share of SIP stops |
| F. Consequence evaluation | Taxes, exit load, missed instalments, restart friction | Groww's own help says three consecutive skips cancel the SIP. Kuvera's help says stopping a SIP does not redeem units. Those consequences are easy to miss | Not every platform has the three-skip rule |
| G. Execution | The tap itself | Groww, Coin, Kuvera, and ET Money all document a short skip/cancel confirm | The tap is easy. The reasoning is what is missing |
| H. Long-term outcome | Wealth, goal funding | Not observed in this research. Continuing a SIP is not automatically the better outcome | Using "more money invested" as success would punish correct pauses |

## Causes worth taking seriously

Supported enough to design around:

- A skip/cancel confirm that records a reason or an OTP but does not compute what the next instalments would have bought or when the SIP dies. Verified from Groww, Zerodha Coin, Kuvera, and ET Money help articles. See `10_competitive_gap_analysis.md`.
- Two legitimate reasons that look identical on that screen: "I am short of cash" and "the market is scaring me." Mint (2026) quotes Groww Mutual Fund's CEO that job loss, medical costs, and cash-flow shocks are valid reasons to pause, and that a correction is not. Economic Times commentary says the same. A product that always argues for continuation will harm the first group.
- Restart friction. Commenters on r/personalfinanceindia, in a thread about stopping SIPs to pay an education loan, repeatedly suggest reducing rather than stopping because restarting is hard. That is a sample of comments, not a market rate.
- A measurement trap. AMFI's discontinued/tenure-completed series includes finished tenures and SIPs ceased after failed instalments (three consecutive failures for monthly SIPs, per the AMFI footnote citing SEBI guidelines). A high "stoppage ratio" is not a count of panic pauses.

Not established:

- That most redemptions during volatility are mistakes.
- That investors ignore alerts because alerts are generic. That is a plausible design claim without a measured open-to-action study in this research.
- That low trust in AI is the binding constraint. The SEBI survey cites trust deficits as a barrier to investing at all. It does not measure trust in an in-flow explainer.

## Causal map

```text
Market move and/or a cash event
        |
        v
Interpretation: "this fund is failing" or "I cannot spare the instalment"
        |
        v
State: anxiety, confusion, or a real budget gap
        |
        v
Decision considered: skip one instalment, reduce, or cancel
        |
        v
Current platform response: confirm dialog, sometimes a reason list, OTP
        |
        v
Outcome: SIP continues, is reduced, is skipped, or is cancelled
        |
        v
Consequences: instalments not invested; possible auto-cancel after repeated skips;
units already bought stay invested; goal funding changes only if the pause persists
```

| Link | Evidence | Still uncertain |
| --- | --- | --- |
| Market or cash event starts the thought | Expert interviews; Reddit threads that cite corrections, loans, and cash crunch | Share of stops by reason |
| Interpretation is often "loss = stop" | Consistent with loss aversion as a mechanism; expert warnings exist because advisers see the behaviour | How often the interpretation is wrong for that person |
| Platform response is a thin confirm | Help-center procedures for four large apps | Whether a newer in-app experiment shows goal math. Not found in the help articles |
| Outcome includes correct pauses | Loan and cash-crunch threads; expert quotes | No AMFI split of voluntary pause vs tenure vs failed debit |
| Long-term harm of a fear-based pause | Rupee-cost averaging is the design of a SIP; missing a recovery is a real risk if the horizon is long | Future returns are unknown. The product must not promise them |

## What this reconstruction rejects

The root problem is not "retail investors need another chatbot about the Nifty." The specific failure is that the SIP interruption decision is under-specified at the moment of confirmation: the reason is not separated from the consequence, and the consequence is not calculated from the user's own amount, horizon, and the platform rule that can kill the SIP.

A redemption has higher stakes and a weaker evidence split between need and panic. It stays a second problem, not the first. See `03_focus_area_selection.md`.
