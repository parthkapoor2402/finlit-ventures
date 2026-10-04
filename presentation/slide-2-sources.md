# Slide 2 source register

No investor was interviewed. No survey was run. No percentage on this slide is a share of Indian investors.

| Claim on the slide | Type | Source | Limit |
| --- | --- | --- | --- |
| Public threads show questions, not how common they are | Research limit | `research/08_voice_of_customer.md`, retrieved 2 October 2026 | Excerpts, not a scraped sample |
| An education-loan use of SIP cash | Documented discussion | [r/personalfinanceindia](https://www.reddit.com/r/personalfinanceindia/comments/1auecgg/im_thinking_of_stopping_my_sips_next_month/) | One thread |
| A two-month pause in a cash crunch | Documented discussion | [r/IndianStockMarket](https://www.reddit.com/r/IndianStockMarket/comments/1sbi166/lost_30_of_my_portfolio_in_6_months_but_i_didnt/) | One thread |
| Whether to stop because of a possible correction | Documented discussion | [r/MutualfundsIndia](https://www.reddit.com/r/MutualfundsIndia/comments/1mpox9p/should_i_stop_my_sips_now_due_to_fear_of_market/) | One thread |
| Changing goals, and wanting to understand the investment | Product capability, not a finding | `src/domain/assessment-reasons.ts` | Labeled on the slide as still to validate |
| Stopping is not a withdrawal | Platform documentation | [Kuvera help](https://kuvera.freshdesk.com/support/solutions/articles/82000703516-i-have-stopped-the-sip-but-i-have-not-received-the-funds-), modified 19 April 2022 | One article |
| A near-dated cancel can still be debited | Platform documentation | [Groww help](https://groww.in/help/mutual-funds/order/i-cancelled-my-sip-instalment-but-still-my-amount-got-deducted--79) | One article |
| July 2026 contributions ₹31,961 crore | Desk figure | [AMFI July 2026 note](https://www.amfiindia.com/uploads/AMFI_Monthly_Note_July2026_53ab600348.pdf) | Industry total |
| August 2026 contributions ₹32,297 crore; 10.02 crore contributing accounts | Desk figure | [AMFI August 2026 note](https://www.amfiindia.com/uploads/AMFI_Monthly_Note_August2026_230122d90a.pdf) | Accounts, not people |
| About 50.30 lakh discontinued or tenure-completed in July 2026 | Secondary figure | [Economic Times, citing AMFI](https://economictimes.indiatimes.com/mf/analysis/mutual-fund-sip-stoppage-ratio-falls-to-82-in-july-as-new-registrations-outpace-closures-for-the-third-straight-month/articleshow/133202521.cms) | Not re-read from an AMFI workbook. Not a count of voluntary pauses |
| Keep, Reduce, and Pause; the formula; units; optional reason; no execution | Product capability | Live assessment in `src/features/assessment/AssessmentApp.tsx` and `src/domain/sip-calculator.ts` | Not a usability result |
| The closing opportunity sentence | Inference | Desk research above | Not an observed need from interviews |

## Left off the slide

Mint and the Economic Times commentary split a cash shock from a correction. That is commentary, not behaviour, so it was not drawn as a user preference. No pie chart was used, because this project has no defensible distribution of reasons.
