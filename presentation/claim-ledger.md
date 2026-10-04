# Claim ledger

Status words: product (in the current Skip Check code), desk (a published source recorded in `research/` on 2 October 2026), hypothesis (not tested with users), illustrative (a teaching composite).

| Claim on the slides | Status | Where it comes from |
| --- | --- | --- |
| August 2026 SIP contribution ₹32,297 crore; 10.02 crore contributing accounts | Desk | [AMFI August 2026 note](https://www.amfiindia.com/uploads/AMFI_Monthly_Note_August2026_230122d90a.pdf), via `research/05_market_landscape.md` |
| July 2026 SIP contribution ₹31,961 crore; 9.90 crore contributing accounts | Desk | [AMFI July 2026 note](https://www.amfiindia.com/uploads/AMFI_Monthly_Note_July2026_53ab600348.pdf) |
| July 2026 new registrations 61.44 lakh; discontinued or tenure-completed 50.30 lakh; ratio 81.87% | Desk, secondary | [Economic Times, citing AMFI](https://economictimes.indiatimes.com/mf/analysis/mutual-fund-sip-stoppage-ratio-falls-to-82-in-july-as-new-registrations-outpace-closures-for-the-third-straight-month/articleshow/133202521.cms). Not re-read from an AMFI spreadsheet |
| A ceased SIP includes three consecutive failed instalments | Desk | AMFI wording, as recorded in `research/05` |
| Accounts are not people | Desk | Same AMFI notes and the research caveat |
| Skip Check is free; ₹99 is the listed review price; the prototype does not take payment | Product | `src/domain/finlit-contact.ts` |
| FinLit states it is not registered with SEBI or AMFI; a compliance review of this prototype has not been completed | Product | `src/domain/decision-rules.ts` |
| Empty contact and booking addresses say a person is not connected | Product | `src/domain/finlit-contact.ts` |
| Skip Check does not change the SIP | Product | Assessment copy in `src/features/assessment/AssessmentApp.tsx` |
| Formula is (current − proposed) × months, whole rupees, 1–24 months; increases rejected; amounts above ₹10,00,000 need confirmation | Product | `src/domain/sip-calculator.ts` |
| Keep, Reduce, and Pause are shown together; What if updates the cards; three clarity questions can be skipped; recap saves in the browser after consent | Product | `AssessmentApp.tsx`, `src/domain/knowledge-check.ts` |
| The difference is less in planned contributions, not an investment loss. Existing units generally remain invested unless redeemed separately | Product | Knowledge-check copy |
| Job to be done | Hypothesis, reconstructed | `research/06_persona_and_segmentation.md`. Not an interview |
| r/MutualfundsIndia correction thread; r/personalfinanceindia education-loan thread; r/IndianStockMarket cash-crunch thread | Desk, one anecdote each | [MutualfundsIndia](https://www.reddit.com/r/MutualfundsIndia/comments/1mpox9p/should_i_stop_my_sips_now_due_to_fear_of_market/), [personalfinanceindia](https://www.reddit.com/r/personalfinanceindia/comments/1auecgg/im_thinking_of_stopping_my_sips_next_month/), [IndianStockMarket](https://www.reddit.com/r/IndianStockMarket/comments/1sbi166/lost_30_of_my_portfolio_in_6_months_but_i_didnt/). Paraphrased in `research/08_voice_of_customer.md`. Not a sample |
| Kuvera: stopping a SIP is not a withdrawal. Modified 19 April 2022 | Desk | [Kuvera help](https://kuvera.freshdesk.com/support/solutions/articles/82000703516-i-have-stopped-the-sip-but-i-have-not-received-the-funds-) |
| Groww: a cancel may not stop a near-dated debit | Desk | [Groww help](https://groww.in/help/mutual-funds/order/i-cancelled-my-sip-instalment-but-still-my-amount-got-deducted--79) |
| Cash-flow shock can justify a pause; a correction is a weak reason | Desk, commentary | [Mint, 2026](https://www.livemint.com/money/personal-finance/when-should-you-pause-your-sip-experts-explain-when-it-makes-sense-and-when-it-doesnt-11785041953658.html), [Economic Times](https://economictimes.indiatimes.com/mf/analysis/should-you-stop-sips-during-market-corrections-heres-what-investors-need-to-know/articleshow/127525519.cms) |
| About 6.7% of households hold mutual funds or ETFs; 36% of investors have high or moderate securities knowledge | Desk | [SEBI Investor Survey 2025 main report](https://www.sebi.gov.in/sebi_data/commondocs/jan-2026/Investor%20Survey%202025%20Main%20Report.pdf), [press note](https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1759239238040.pdf) |
| Ananya Shah, 31, Pune, salaried, two equity SIPs totalling ₹12,000, house goal about eight years | Illustrative | `research/06`. Not a real interviewed person |
| H1 3.7, H2 4.3, H3 3.5, H4 2.8 | Desk scores | Equal weights in `research/04_hypothesis_register.md`. Not user ratings. H2 is the one selected to test |
| Live assessment does not compute the older informed-choice rate | Product | `src/analytics/funnel-metrics.ts` versus `src/analytics/assessment-events.ts` |
| Usability 8–10, pass at 7 of 10; distribution fail below 10 of the first 50 non-staff sessions | Hypothesis, not run | `research/17_execution_roadmap_and_gtm.md` |
| Reach of 200 | Assumption | `research/17` and `research/07_opportunity_sizing.md`. Not a result |
| Prototype URL | Product, deployed | https://skip-check.vercel.app. Opening the page is not evidence of use |

Not used, because they would overclaim: a voluntary share of the 50.30 lakh, any interview, any conversion, NCFE labelled as 2026, and the site’s own 38.5 crore TAM.
