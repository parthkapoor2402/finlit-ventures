# 20 — Research method and tool log

## Tools actually available

| Tool | Used? | For |
| --- | --- | --- |
| Cursor WebSearch | Yes | Discovery of sources |
| Cursor WebFetch | Yes | SEBI survey text, AMFI monthly-note PDFs, NCFE and RBI pages, SEBI regulation PDFs |
| Shell curl | Yes | finlitventures.com HTML and JS bundle, because the site is a client-rendered app and WebFetch returned only the title |
| Firecrawl MCP | No. Not installed | — |
| Browser automation | Not used | Help articles and PDFs were readable without it |
| Figma | No. Not installed. Phase A forbids the prototype | — |
| GitHub | Yes, only to store these files | — |
| Reddit API or app-store APIs | No | Forum evidence is from search excerpts |

## How claims were classed

- **Fact:** a figure or sentence in a primary page or a help article that was fetched or quoted in a fetched extract.
- **Observation:** a repeated pattern in that small set.
- **Inference:** a conclusion across sources.
- **Assumption:** a number in the sizing scenarios.
- **Hypothesis:** H1–H4.
- **Recommendation:** Skip Check.

## Source register

See `sources.csv` in this folder. Access date for all rows is 2 October 2026 unless the source itself carries an older publication date, which is recorded in the file.

## Limits that change confidence

- The FinLit site was read from the JS bundle, not by clicking every screen. Copy can differ by route state. Prices and the non-registration sentence were found as string literals.
- July 2026 discontinuation counts are from the Economic Times citing AMFI, not from an AMFI spreadsheet opened in this pass. The AMFI monthly notes that were fetched emphasize contribution and contributing accounts and, in the extracted text, did not repeat the discontinuation count.
- Reddit was not fully read. Themes can be over-weighted.
- INDmoney's skip flow was not verified and is marked unknown.
- No investor was interviewed. The persona is illustrative.
- This is not legal advice.

## What was not done

- No application code, no prototype, no package install, no change to a product surface. The repository had only a README before these research files.
- No fabricated interview, review count, or willingness-to-pay study.
