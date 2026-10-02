# 10 — Competitive gap

Status labels: **verified** means a public help article or page was fetched or returned with the steps. **Advertised** means marketing copy. **Inferred** means a reasonable reading. **Unknown** means not checked.

## What existing products already do well

- **Execution is fast.** Groww, Coin, Kuvera, and ET Money all let a user skip, pause, or cancel a SIP from the SIP list. Verified in help articles. That is the right place for an intervention, and they already own it.
- **They separate stop from redeem, if the user looks it up.** Kuvera's help explicitly says stopping a SIP does not return units. Groww's cancel note says invested units stay until a redemption. Verified. The explanation is in a help center, not established as part of the confirm screen.
- **Operational rules exist.** Groww: three consecutive skips cancel the SIP; a skip inside two days of the debit applies later; cancel is blocked when the next instalment is imminent (one article says 7 days, another says 3 days — the articles conflict, so the product must not pretend there is one Groww rule without a fresh check). Kuvera: edits up to five business days before execution. Coin: a short pause confirm. ET Money: OTP, and no modify while an instalment is in process.
- **Paid advice exists beside the button, not in it.** ET Money Genius has portfolio health, "fund needs attention," and membership. The skip help article is still a menu path plus OTP. The link from health to the skip screen was **not verified**.
- **Human and forum substitutes are plentiful.** Mint, Economic Times, and Reddit already tell people not to stop only because the market fell, and to reduce rather than stop when cash is tight.

## Where the customer still does the hard part alone

At the confirm step, across the verified flows, the user is not shown:

- a forced distinction between "I need the cash," "I am reacting to the market," "the goal is here," and "this fund no longer fits"
- the rupees that will not be invested if they skip N months
- a reminder that existing units are not redeemed
- a restart month
- goal-horizon context tied to their stated plan
- an explanation that changes with the reason they pick

Groww's cancel flow does ask for a reason. Verified. The help article does not say the reason changes the information on the next screen. Treat branching as **unknown**, not as absent forever.

## Why this has not been closed

Inferences, labeled as such:

- Platforms are paid to complete the instruction safely. A longer screen can look like friction and, if it argues for continuation, like a conflict.
- Goal data is often missing, so honest personal math is hard.
- The industry metric mixes tenure completion with stops, so the problem does not show up cleanly on an AMC dashboard.
- A slogan ("never stop your SIP") is already published. The missing piece is personal and branched, which is more work than a tooltip.

## Is it technically addressable?

Yes, for the arithmetic of missed instalments, a restart date, and a reason branch. Those need no market feed.

No, for a trustworthy tax and exit-load redemption card, until scheme data is licensed and checked. That is why redemption is phase 2.

No, for FinLit to put the card inside Groww. That is a partnership.

## Could an incumbent copy it?

Yes. Groww or ET Money could add a reason branch and a missed-rupee line in a sprint. There is no network-effect moat in the card itself.

What is harder to copy is a **conflict-light** version: FinLit does not take AMFI trail on the SIP, so it can show "pause is a valid outcome" without being paid when the SIP survives. An incumbent can still do that. The practical advantage is trust positioning plus research content, not a patent.

## Differentiation worth claiming

Only this, and only if the build matches it:

A pre-confirm check that (1) branches on reason, (2) computes missed rupees and states what it cannot know about future units, (3) keeps pause one tap away, and (4) refuses to forecast returns or to recommend a fund.

Not claimed: better fund picks, a smarter chatbot, or exclusive data.
