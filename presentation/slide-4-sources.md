# Slide 4 source register

The page is a problem-framing canvas. It does not report interviews, a survey, or a measured conversion.

## Evidence used

| Claim on the slide | Status | Source |
| --- | --- | --- |
| Different reasons can lead to the same SIP change | Desk synthesis | `research/06_persona_and_segmentation.md`, `research/08_voice_of_customer.md` |
| An education-loan use of SIP cash | One public thread | [r/personalfinanceindia](https://www.reddit.com/r/personalfinanceindia/comments/1auecgg/im_thinking_of_stopping_my_sips_next_month/) |
| A question about stopping for a possible correction | One public thread | [r/MutualfundsIndia](https://www.reddit.com/r/MutualfundsIndia/comments/1mpox9p/should_i_stop_my_sips_now_due_to_fear_of_market/) |
| A stop is not a withdrawal | Help article | [Kuvera](https://kuvera.freshdesk.com/support/solutions/articles/82000703516-i-have-stopped-the-sip-but-i-have-not-received-the-funds-) |
| A near-dated cancel can still be debited | Help article | [Groww](https://groww.in/help/mutual-funds/order/i-cancelled-my-sip-instalment-but-still-my-amount-got-deducted--79) |
| One confirm path for different reasons was the explanation selected to test | Equal-weight desk scores. Not a user rating | `research/04_hypothesis_register.md`, H2 |
| July 2026 discontinued or completed SIPs, 50.30 lakh | Secondary. Economic Times citing AMFI. Not re-read from an AMFI workbook. Not voluntary pauses | [Economic Times](https://economictimes.indiatimes.com/mf/analysis/mutual-fund-sip-stoppage-ratio-falls-to-82-in-july-as-new-registrations-outpace-closures-for-the-third-straight-month/articleshow/133202521.cms) |
| August contributions were higher than July | AMFI monthly notes | [August](https://www.amfiindia.com/uploads/AMFI_Monthly_Note_August2026_230122d90a.pdf), [July](https://www.amfiindia.com/uploads/AMFI_Monthly_Note_July2026_53ab600348.pdf) |
| Ananya Shah, 31, Pune, salaried, ₹12,000, house goal about eight years | Illustrative. Not interviewed | `research/06_persona_and_segmentation.md` |
| Reason changes emphasis. Formula is current minus proposed, times the months. Three equal paths. Pause is ₹0. Units generally stay invested. The app still makes the change | Live page | Assessment flow, `src/domain/sip-calculator.ts`, `src/domain/knowledge-check.ts` |
| Plans from ₹99 to ₹2,499. Prototype does not take payment | Published list prices | `research/01_company_dossier.md` |

## Still a hypothesis, or missing

- Any interview, usability result, or observed session.
- Any conversion from the free check to a paid plan.
- The informed-choice rate. It is defined for an earlier flow and has not been measured on the live page.
- How common a cash need is relative to a market worry.
- The voluntary share of July’s 50.30 lakh.
- A restart month. The notes mention one. The live page does not ask for one, so this slide does not show it.
