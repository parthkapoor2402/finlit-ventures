# 16 — Risk, compliance, and privacy

This is a product risk note, not a legal opinion. Counsel needs to review before public launch.

## Rules examined

| Topic | Source | What it implies for Skip Check |
| --- | --- | --- |
| Investment advice definition | SEBI (Investment Advisers) Regulations, 2013, amended through 10 February 2025. Advice includes advice on buying, selling, or dealing in securities or investment products, and advice on a portfolio, and includes financial planning. Widely broadcast general commentary is treated differently from client-specific advice. FAQ: https://www.sebi.gov.in/sebi_data/faqfiles/aug-2025/1755174193178.pdf and the regulation page https://www.sebi.gov.in/legal/regulations/feb-2025/securities-and-exchange-board-of-india-investment-advisers-regulations-2013-last-amended-on-february-10-2025-_92319.html | A card that says "do not pause this SIP" or "switch to this fund," fitted to the user's amounts and goals, can be read as investment advice. The firm footer says it is not SEBI-registered. Skip Check must stay on description, arithmetic, and education, or the firm must register before it gives advice |
| Suitability | IA regulations require risk profiling and suitability before advice | The MVP does not do suitability and must not imitate it with a risk score that outputs a fund |
| Research analyst | SEBI RA regulations; FAQ July 2025 https://www.sebi.gov.in/sebi_data/faqfiles/jul-2025/1753269723942.pdf | A published research report is a different activity from this card. The founder's personal NISM RA certification is not the same as the company being registered. The site's "exit guidance" and "discretionary portfolio management" lines need their own legal review |
| Mutual fund distribution | Footer: not registered with AMFI | Do not intermediate orders or take trail |
| Personal data | Digital Personal Data Protection Act, 2023. Rules notified November 2025. PIB note: https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf . MeitY explanatory note on notice content. Phased dates are reported by law-firm summaries as extending into 2026 and 2027 for parts of the rules; do not treat every obligation as fully switched on without counsel | If a restart reminder stores name, email, amount, or goal, give a standalone notice: what is stored, why, and how to delete it. Sample mode stores nothing |

## Risk register

Likelihood and severity are low / medium / high judgments.

| Risk | L | S | Who | Trigger | Prevention | Detection | Mitigation | Residual | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Card read as personal advice | M | H | User, firm | "You should" copy | Banned-phrase list; legal read | Review each release | Pull copy | M until counsel signs | Product |
| Hallucinated number | M | H | User | LLM prose | Calculator is the only source of numbers; checker | Reject logs | Template fallback | L if checker is on | Engineering |
| Stale platform rule | M | M | User | Help article changes | Quote only dated sources; prefer "see your confirm screen" | Quarterly re-read | Delete the number | M | Product |
| Wrong arithmetic | L | H | User | Bug | Unit tests | CI | Block release | L | Engineering |
| Pressure on cash-need users | M | H | User | Shared copy with the fear branch | Separate branch | Usability sessions; pause-rate guardrail | Rewrite | M | Product |
| Existing site claims discretionary PMS | H | H | Firm | Already published | Out of scope to silently expand | This dossier | Counsel and copy change, separate from Skip Check | H until fixed | Founder |
| Conflict if monetized on continuation | L | H | User | Future pricing idea | Ban trail and per-continuation fees | Pricing review | Reject the model | L if the ban holds | Product |
| Over-reliance | M | M | User | User treats the card as a guarantee | Uncertainty lines | Restatement check | Keep the unknown row | M | Product |
| Privacy | M | H | User | Saving a reminder | Notice, purpose limit, delete | Access review | Do not store in sample mode | M | Engineering |
| Account takeover | L | H | User | No broker link in MVP | Do not ask for broker passwords | n/a in MVP | Refuse credentials | L | Engineering |
| Accessibility | M | M | User | Dense text | Short lines, contrast, buttons not color-only | Pass on a phone screen reader in Phase B | Fix before pilot | M | Design |
| Model drift | L | M | User | Prompt edits | Checker and fixtures | Weekly reject rate | Freeze prompts | L | Engineering |
| Third-party outage | L | L | User | LLM down | Template does not need the LLM | Error event | Show the table | L | Engineering |

## Human path

If the reason is "fund no longer fits" or the user asks "what should I buy," the card stops and offers a human conversation. That conversation is not advice unless a registered adviser gives it. Today the firm says it is not registered, so the offer is a research discussion or a referral, not a recommendation. The exact wording is a legal item.

## Validation still required

- Counsel on the advice boundary for reason-specific copy.
- Counsel on the existing discretionary-portfolio wording.
- A fresh read of Groww's skip and cancel cutoffs before any number is shown.
- A privacy notice if any field is stored.
