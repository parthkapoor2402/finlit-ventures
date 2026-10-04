# 08 — Voice of the customer

Method limit: Reddit threads and news comments were retrieved through web search on 2 October 2026. Full threads were not scraped, engagement counts were not independently counted, and app-store review dumps were not available. Themes below are from this small public sample. They are not prevalence.

Firecrawl, a Reddit API, and app-store access were not available. See `20_research_method_and_tool_log.md`.

## Sources read via search excerpts

| ID | Source | Date on page or unknown | Situation | Pain | Workaround | Need | Versus H2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| V1 | r/MutualfundsIndia, "Should I stop my SIPs now due to fear of market correction?" https://www.reddit.com/r/MutualfundsIndia/comments/1mpox9p/should_i_stop_my_sips_now_due_to_fear_of_market/ | Unknown | Poster is considering stopping because of a possible correction | Fear of buying before a fall | Forum vote. Replies split: continue; move small-cap toward large-cap; park in liquid and re-enter | A way to separate a forecast from a plan | Supports H1 and H2. Also shows the opposite advice is already free, so a product that only says "never stop" is a commodity |
| V2 | r/personalfinanceindia, stopping SIPs to deal with an education loan https://www.reddit.com/r/personalfinanceindia/comments/1auecgg/im_thinking_of_stopping_my_sips_next_month/ | Unknown | Poster wants to redirect SIP cash to a loan | Cash use, not a crash | Replies: reduce rather than stop; do not sell units; some say markets are high so sell | Reduce-versus-stop, and a warning not to redeem just because the SIP stops | Supports H2. Contradicts any product that treats pause as irrational |
| V3 | r/IndianStockMarket, drawdown post https://www.reddit.com/r/IndianStockMarket/comments/1sbi166/lost_30_of_my_portfolio_in_6_months_but_i_didnt/ | Unknown | Poster paused SIPs for two months because of a cash crunch during a drawdown | Cash first, emotion second | Emergency fund, then resume | The product must allow the pause | Supports the cash branch of H2 |
| V4 | Groww help, users who cancelled and were still debited https://groww.in/help/mutual-funds/order/i-cancelled-my-sip-instalment-but-still-my-amount-got-deducted--79 | Help article, undated in extract | Cancel did not stop a near-dated instalment | Rule surprise | Pay this instalment, cancel after | State the timing rule before confirm | Supports H2's "show the rule" requirement |
| V5 | Kuvera help, "I stopped the SIP but have not received the funds" https://kuvera.freshdesk.com/support/solutions/articles/82000703516-i-have-stopped-the-sip-but-i-have-not-received-the-funds- | Modified 19 Apr 2022 | User equates stop with withdrawal | Conceptual confusion | Agent explains units remain | Say, in the same screen, that skip/cancel does not redeem | Supports H2. Older article; the confusion may still exist |
| V6 | Mint and Economic Times expert pieces | 2026 articles | Advisers describe clients who want to stop in a correction | Timing versus cash flow | Human explanation after the fact | The same split, earlier | Supports the content of the card. Does not prove people will read it in-app |

## Themes in this sample

| Theme | Seen in | Sample frequency | Market prevalence |
| --- | --- | --- | --- |
| "Should I stop because the market might fall?" | V1, V6 | Repeated in the excerpts | Unknown |
| "I should stop or cut because I need the cash for a loan, a crunch, or a delay" | V2, V3, V6 | Repeated | Unknown, and likely large |
| "Reduce, do not fully stop, or you will not restart" | V2 | Several replies in one thread | Unknown |
| "Stopping a SIP is not the same as getting the money back" | V5 | One help article written because users ask | Unknown |
| "The cancel did not work the way I thought because of a cutoff" | V4 | One help article | Unknown |
| Distrust of generic advice | V1 replies disagree with each other | Visible | Unknown. A card that hides disagreement will be distrusted |

## What the sample does not support

- A claim that most Indian investors panic-sell mutual funds.
- A quote presented as a verified verbatim interview.
- App-store ratings for Groww, Coin, or ET Money. Those were not collected.

## Design consequences from the voices that are here

- The first question is the reason, not the market chart.
- Continue, reduce, and pause all stay available.
- Copy must say that a skip does not redeem existing units.
- Copy must say when a cancel will not catch the next debit, using the rule of the user's platform if known, and "check your app" if not.
- Forum advice already says "never stop in a fall." The product's job is the personal arithmetic and the reason branch, not another slogan.
