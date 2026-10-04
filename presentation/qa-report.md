# QA report

Checked on 4 October 2026. The generator is `presentation/build.mjs`. Output is `presentation/out/finlit-skip-check-strategy.pptx` and the LibreOffice PDF beside it.

## Method

1. `node build.mjs` wrote six slides at 13.333 by 7.5 inches.
2. LibreOffice Impress exported the PDF (`soffice --headless --convert-to pdf`). `pdfinfo` reports 6 pages and a page size of 959.981 by 540 points.
3. `pdftoppm -png -r 120` rendered `/tmp/skip-slides3/slide-1.png` through `slide-6.png`.
4. Each page was read, including the July bars, the hypothesis bars, the anecdote cards, the discrepancy paragraph, and the closing band of copy.
5. `pdffonts` shows Georgia embedded for headlines. Body text is Carlito, the metric stand-in for Calibri on this machine. PowerPoint on an Office install uses Calibri. Wrapping should stay close. It will not be identical if Calibri is missing.

The prototype URL `https://skip-check.vercel.app` returned HTTP 200 on 4 October 2026. That check is a deploy check, not usage.

## What the first rendered draft needed

The first readable draft was spacious and the bars were already labeled, but it left out claims the strategy has to carry:

- A reason changes emphasis and does not change the formula.
- Pause is a proposed ₹0. What if uses sliders, numeric fields, and a reset.
- SIP Check Bot explains and does not decide. Analytics stay in memory and store no amounts. The reminder stays in the browser.
- Why H2 still helps if most pauses are legitimate.
- The discrepancy: `research/17` still says the prototype was “not built”; `docs/product-decisions.md` describes the earlier card; `informedChoiceRate` uses the earlier events and has no observed rate.
- Counsel is the first gate, before a public pilot.
- Believe and unproven are separated, including RICE reach of 200 as an assumption.
- The problem canvas names the true problem, who, how we know, and value that is only potential, and it rejects the 38.5 crore TAM and “NCFE 2026.”

Those lines were added in the generator and the deck was rendered again.

## What the second render showed

- Headlines are one or two lines of Georgia and sit clear of the body.
- July bars: the label is above the track, and 61.44 and 50.30 sit in a column to the right of the fill. The caption says the shorter bar is not a count of chosen pauses.
- Hypothesis bars: H1–H4 stay in their own column. 3.7, 4.3, 3.5, and 2.8 stay in theirs. H2 is the darker bar.
- The discrepancy paragraph on page 4 finishes above the footer, and it does not run into the chart.
- Anecdote cards and the three Evidence / Interpretation / Implication lines finish above the footer. No sentence stops mid-word.
- Page 6 lists counsel, usability, and distribution in that order, then the believe / unproven close, then the line that this deck stops before wireframes.
- The 11 pt footer sits under a rule and does not run into the body.
- Source names in the body are links. The visible words are the publication, not a raw URL, except the short Reddit paths and `skip-check.vercel.app`.

## Remaining limits

- Cards for the three threads are the same height because the items are parallel. The loan card and the drawdown card have more unused space inside the card than the correction card. The links sit on the same baseline.
- Page 4’s left column ends above the footer while the score card continues lower. The gap is empty on purpose.
- The PDF check uses Carlito for Calibri. A machine without Calibri can wrap a line differently.
- The Economic Times stoppage counts were not re-read from an AMFI workbook. The slide says so.
- No investor was interviewed, and no product rate was measured. The deck does not report either.
