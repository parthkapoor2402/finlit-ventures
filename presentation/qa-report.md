# QA report

Checked on 4 October 2026 after `node presentation/build.mjs`.

## File

- `presentation/out/finlit-skip-check-strategy.pptx`
- `presentation/out/finlit-skip-check-strategy.pdf` (LibreOffice Impress export, 6 pages, 13.333 by 7.5 inches)
- Slide relationships contain the AMFI, Economic Times, Reddit, Kuvera, Groww, Mint, SEBI, and prototype URLs named in `claim-ledger.md`.

## Read-through

`pdftotext -layout` shows every sentence in the script, including the July counts, the three Reddit paths, the four hypothesis means, the formula, the three tests, and the footer. No sentence stops mid-word.

## Visual

Rendered at 130 pixels per inch and inspected page by page, including crops of both charts, the Reddit cards, and the closing page.

- July bars: the label is above the bar, and 61.44 and 50.30 sit in a column to the right of the track.
- Hypothesis bars: H1–H4 stay in their own column, and 3.7, 4.3, 3.5, and 2.8 stay in theirs. H2 is the darker bar.
- Card text, including the 13 pt Reddit paraphrases and the 14 pt outcome lines, finishes above the next element.
- The 11 pt footer sits under a rule and does not run into the body.

The PDF uses Gelasio and Carlito as metric stand-ins for Georgia and Calibri. Wrapping in PowerPoint should stay close. It will not be identical if those faces are missing.

## What this check does not prove

The remote articles were not re-downloaded in this pass. The URLs are the ones already written in `research/05_market_landscape.md` and `research/08_voice_of_customer.md`. No investor session was run, and the deck does not report one.
