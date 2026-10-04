# 01 — Company dossier: FinLit Ventures

Access date: 2 October 2026. This is public-web research. It is not an internal data room. Customer usage, revenue, and conversion are unknown.

## Disambiguation

Two different businesses use the FinLit name:

| Entity | What public sources show | Relevance |
| --- | --- | --- |
| FinLit Ventures, finlitventures.com | Research and planning site founded publicly in 2026 by Nishant Jain. LinkedIn company page `finlitventures`. | This is the company named in the brief and the repository. |
| FinLit Investment Advisory, Chennai | LinkedIn company page says founded 2021, founders Akash Rajagopal and Narayanan S, "over 100 clients." | A different firm. Not used as evidence for this product. |

## What the site actually offers

The marketing site is a JavaScript application. Visible copy was taken from the production bundle `main.9ce7cdf2.js` fetched from `https://www.finlitventures.com/` on 2 October 2026. The homepage HTML title is "FinLit | Investment Research" and the meta description is "FinLit investment research, portfolio reviews, and market insights."

Routes in the bundle include `/`, `/about`, `/why-we-exist`, `/what-we-do`, `/services`, `/portfolio`, `/financial-product`, `/blog`, `/contact`, plus blog and portfolio admin paths.

### Positioning, as written on the site

- "Making Money Make Sense" appears in the founder's August 2026 LinkedIn launch post.
- Site language includes "understand before action," "Less confusion. More clarity. Better decisions," and a loop: Discover, Diagnose, Learn, Act, Review, Upgrade.
- A six-stage investor problem is named on the site as Scattered ("Random SIPs, no plan"), Stuck at Zero, and Unstructured ("Earning well, no goals").
- Footer on the portfolio view: "FinLitventure is a technology company and is not registered with SEBI or AMFI."
- In-product assistant footer: "FinLit AI provides general financial education and information about FinLit Ventures. This is not personalized investment advice."

### Services and published prices

Service cards in the bundle:

| Service | Proposition in the bundle |
| --- | --- |
| 0 → 1 Investing | Start investing from zero, with confidence. |
| Wealth Planning | Turn income and savings into long-term wealth. |
| Family Financial Planning | Plan for education, major goals, insurance, and investments. |
| Global Investing | Understand opportunities beyond domestic markets. |
| Portfolio Review & Stock Selection | Objective view of an existing portfolio: diversification, risk, performance, holdings. |

Published engagement prices in the same bundle:

| Plan | Price |
| --- | --- |
| First Session | ₹99 |
| 1 Month | ₹299 |
| 3 Months | ₹699 |
| 6 Months | ₹1,299 |
| 1 Year | ₹2,499 |

These are list prices in the front end. Whether they are collected, and at what conversion, is unknown.

### Founder, as publicly described

Nishant Jain, Founder & Researcher. Credentials printed on the site and LinkedIn: B.Tech, IIT Kanpur; Minor in Finance; CFA Level I cleared; NISM Certified Research Analyst. The site describes a fundamental-research approach: business quality, valuation, position sizing, long-term compounding. LinkedIn company page (accessed via search snippet, 2 October 2026) says founded 2026, privately held, financial services, about 1 employee, and lists a United States headquarters. The US headquarters line is low confidence; the product copy is consistently about Indian investors. Treat headcount and HQ as LinkedIn profile fields, not audited facts.

### A regulated-activity tension on the same site

The portfolio section describes "Discretionary Portfolio Management" as "a concentrated, research-driven equity portfolio built and rebalanced on your behalf," with bespoke construction, active rebalancing, and quarterly reporting. Adjacent copy offers "Equity Research & Advisory" with "entry, sizing and exit guidance." The same site says it is not registered with SEBI or AMFI.

That combination is a compliance issue for the current business, not a feature to extend. Discretionary portfolio management and client-specific buy/sell guidance are regulated activities. This dossier does not conclude that client money is being managed. It records that the public wording claims a service the footer says the company is not registered to provide. Any new product must not widen that gap. See `16_risk_compliance_and_privacy.md`.

### Market numbers the site prints, and why they are not used as facts

The homepage funnel prints:

| Figure | Label on site | Source label on site |
| --- | --- | --- |
| 144 cr | India, 2026 | "Govt. est. 2026" |
| 39 cr | Financially literate | "NCFE 2026" |
| ~12.5 cr | Investing, portfolios under ₹30L | "NSE · AMFI 2026" |
| ~38.5 cr | Addressable TAM | "FLV estimate" |

The site itself marks the 38.5 crore figure as "FLV estimate, not official market-sizing data."

The 27% literacy figure matches **NCFE Financial Literacy and Inclusion Survey 2019**, which measured 27% (RBI cites 27.18%) of adults against an OECD-INFE threshold, from fieldwork in 2018–19. It is not an 2026 statistic, and it is not "27% of the 2026 population." See RBI and NCFE sources in `05_market_landscape.md`. The 39 crore and 38.5 crore audience figures are arithmetic extensions of that old rate. They are not used as TAM in this recommendation.

## Evidence table

| Finding | Source | Date | Evidence | Confidence | Product implication |
| --- | --- | --- | --- | --- | --- |
| Public site is investment research, portfolio reviews, planning, and an education-style AI assistant | finlitventures.com bundle, 2 Oct 2026 | Site fetched 2 Oct 2026 | Routes, service cards, assistant disclaimer | High for copy; unknown for usage | The co-pilot should extend "understand before action," not become a broker |
| Not registered with SEBI or AMFI, as stated in the footer | Same bundle, portfolio footer | 2 Oct 2026 | Exact sentence quoted above | High that the sentence is on the site | Do not ship personalized buy/hold/sell instructions |
| List prices from ₹99 to ₹2,499 | Same bundle, `TW` price array | 2 Oct 2026 | Five plan strings | High that prices are published; unknown if paid | A free decision check can sit in front of a paid review |
| Founder has NISM Research Analyst certification and CFA Level I | Site and LinkedIn profile snippets | LinkedIn posts dated on-page as 2026-08 | Credential lines | Medium. Certification was not independently checked on NISM's register in this pass | Research content is a credible voice; registration status of the firm is still "not registered" per its own footer |
| Launch post lists portfolio reviews, stocks, mutual funds, ETFs, global investing, 0→1, and questions | LinkedIn post by Nishant Jain | Search snippet dated 2026-08-15 | Numbered product list | Medium. Snippet, not a full-page archive | MF and portfolio context are in the stated scope |
| LinkedIn: founded 2026, ~1 person, ~58 followers on one snippet | linkedin.com/company/finlitventures search snippet | Accessed 2 Oct 2026 | Company about fields | Low–medium. Profile fields change and can be wrong | Distribution is early. The product cannot assume an installed app base |
| Site TAM of ~38.5 cr is an internal estimate built on a mis-dated literacy stat | Bundle `uQ` array; NCFE 2019; RBI | NCFE fieldwork 2018–19; site 2 Oct 2026 | Site says "FLV estimate" and "NCFE 2026" | High that the site mis-dates NCFE | Do not size the opportunity with the site's TAM |
| Public copy also offers discretionary portfolio management and exit guidance | Bundle service block `dr` | 2 Oct 2026 | Titles and detail strings | High that the words are published | New work should narrow claims, not add another advisory surface |

## What is hypothesis, not finding

- That FinLit's buyers are salaried investors with portfolios under ₹30 lakh. The site says this is the audience. No customer list was reviewed.
- That the ₹99 session is the current acquisition motion. It is a published price, not a proven funnel.
- That an AI assistant already answers investing questions in production. The UI strings exist. Quality, volume, and model provider are unknown.
- That FinLit can partner with a mutual-fund platform. No partnership is published.

## Where a co-pilot fits, and what it would take to operate

FinLit's stated job is clarity before action: research, a portfolio review, and planning conversations. It does not publish a mutual-fund order screen. A co-pilot that appears only inside Groww's or Coin's skip button is not operable by this company alone.

An operable first version is a decision check on FinLit's own surface, used when someone is about to skip, reduce, or cancel a SIP and is willing to enter the SIP, the goal, and the reason. A later version could be a partner module, which requires a distributor relationship FinLit does not have, and a regulatory review FinLit has not completed.

The company also needs a legal pass on the existing "discretionary portfolio management" and "exit guidance" wording before it adds any product that looks like advice.
