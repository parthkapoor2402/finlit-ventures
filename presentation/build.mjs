/**
 * Skip Check strategy deck, pages 1–6.
 * node build.mjs
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import PptxGenJS from 'pptxgenjs'

const root = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(root, 'out')

const C = {
  paper: 'F6F1E8',
  ink: '1C1917',
  muted: '44403C',
  line: 'E4DCD0',
  forest: '1E4D3A',
  card: 'FFFDF8',
  amber: '8A5A2B',
  track: 'E6DED2',
  soft: '7F9A8C',
}

const URLS = {
  amfiAug: 'https://www.amfiindia.com/uploads/AMFI_Monthly_Note_August2026_230122d90a.pdf',
  amfiJul: 'https://www.amfiindia.com/uploads/AMFI_Monthly_Note_July2026_53ab600348.pdf',
  etStoppage:
    'https://economictimes.indiatimes.com/mf/analysis/mutual-fund-sip-stoppage-ratio-falls-to-82-in-july-as-new-registrations-outpace-closures-for-the-third-straight-month/articleshow/133202521.cms',
  etCorrections:
    'https://economictimes.indiatimes.com/mf/analysis/should-you-stop-sips-during-market-corrections-heres-what-investors-need-to-know/articleshow/127525519.cms',
  mint: 'https://www.livemint.com/money/personal-finance/when-should-you-pause-your-sip-experts-explain-when-it-makes-sense-and-when-it-doesnt-11785041953658.html',
  sebiReport:
    'https://www.sebi.gov.in/sebi_data/commondocs/jan-2026/Investor%20Survey%202025%20Main%20Report.pdf',
  sebiPress: 'https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1759239238040.pdf',
  redditFear:
    'https://www.reddit.com/r/MutualfundsIndia/comments/1mpox9p/should_i_stop_my_sips_now_due_to_fear_of_market/',
  redditLoan:
    'https://www.reddit.com/r/personalfinanceindia/comments/1auecgg/im_thinking_of_stopping_my_sips_next_month/',
  redditDrawdown:
    'https://www.reddit.com/r/IndianStockMarket/comments/1sbi166/lost_30_of_my_portfolio_in_6_months_but_i_didnt/',
  kuvera:
    'https://kuvera.freshdesk.com/support/solutions/articles/82000703516-i-have-stopped-the-sip-but-i-have-not-received-the-funds-',
  groww:
    'https://groww.in/help/mutual-funds/order/i-cancelled-my-sip-instalment-but-still-my-amount-got-deducted--79',
  prototype: 'https://skip-check.vercel.app',
}

const pptx = new PptxGenJS()
pptx.defineLayout({ name: 'DECK', width: 13.333, height: 7.5 })
pptx.layout = 'DECK'
pptx.author = 'FinLit Ventures'
pptx.title = 'Skip Check: what to test before building further'
pptx.subject = 'Executive product strategy, pages 1 to 6. Desk research. No interviews.'

function slideBase(section, page) {
  const slide = pptx.addSlide()
  slide.background = { color: C.paper }
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.1,
    h: 7.5,
    fill: { color: C.forest },
    line: { color: C.forest, width: 0 },
  })
  slide.addText(section, {
    x: 0.4,
    y: 0.16,
    w: 8.4,
    h: 0.28,
    fontFace: 'Calibri',
    fontSize: 13,
    bold: true,
    color: C.forest,
    margin: 0,
    valign: 'middle',
  })
  slide.addText(`${String(page).padStart(2, '0')}  /  06`, {
    x: 10.2,
    y: 0.16,
    w: 2.7,
    h: 0.28,
    fontFace: 'Calibri',
    fontSize: 13,
    color: C.muted,
    align: 'right',
    margin: 0,
    valign: 'middle',
  })
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.4,
    y: 7.14,
    w: 12.52,
    h: 0.01,
    fill: { color: C.line },
    line: { color: C.line, width: 0 },
  })
  slide.addText('Desk research compiled for this project on 2 October 2026. No interviews, and no observed usage.', {
    x: 0.4,
    y: 7.18,
    w: 12.52,
    h: 0.24,
    fontFace: 'Calibri',
    fontSize: 11,
    color: C.muted,
    margin: 0,
    valign: 'middle',
  })
  return slide
}

function headline(slide, text) {
  slide.addText(text, {
    x: 0.4,
    y: 0.48,
    w: 12.52,
    h: 0.9,
    fontFace: 'Georgia',
    fontSize: 26,
    color: C.ink,
    margin: 0,
    valign: 'top',
  })
}

function body(slide, runs, box) {
  slide.addText(runs, {
    fontFace: 'Calibri',
    fontSize: 14,
    color: C.ink,
    margin: 0,
    valign: 'top',
    ...box,
  })
}

function link(text, url) {
  return { text, options: { hyperlink: { url }, color: C.forest, underline: true } }
}

function plain(text) {
  return { text, options: { color: C.ink } }
}

function card(slide, x, y, w, h) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x,
    y,
    w,
    h,
    fill: { color: C.card },
    line: { color: C.line, width: 1 },
    rectRadius: 0.08,
  })
}

function bars(slide, spec) {
  const { x, y, labelW, trackW, rows, max } = spec
  const rowH = 0.5
  rows.forEach((row, index) => {
    const yy = y + index * 0.68
    slide.addText(row.label, {
      x,
      y: yy,
      w: labelW,
      h: rowH,
      fontFace: 'Calibri',
      fontSize: 14,
      color: C.ink,
      margin: 0,
      valign: 'middle',
    })
    const trackX = x + labelW
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: trackX,
      y: yy + 0.14,
      w: trackW,
      h: 0.22,
      fill: { color: C.track },
      line: { color: C.track, width: 0 },
      rectRadius: 0.04,
    })
    const width = Math.max(0.08, (row.value / max) * trackW)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: trackX,
      y: yy + 0.14,
      w: width,
      h: 0.22,
      fill: { color: row.color },
      line: { color: row.color, width: 0 },
      rectRadius: 0.04,
    })
    slide.addText(row.display, {
      x: trackX + trackW + 0.08,
      y: yy,
      w: 0.58,
      h: rowH,
      fontFace: 'Calibri',
      fontSize: 16,
      bold: true,
      color: C.ink,
      margin: 0,
      valign: 'middle',
    })
  })
}

function stackedBars(slide, spec) {
  const { x, y, w, rows, max, step = 0.95 } = spec
  const valueW = 0.78
  const trackW = w - valueW
  rows.forEach((row, index) => {
    const yy = y + index * step
    slide.addText(row.label, {
      x,
      y: yy,
      w: trackW,
      h: 0.3,
      fontFace: 'Calibri',
      fontSize: 14,
      color: C.ink,
      margin: 0,
    })
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y: yy + 0.36,
      w: trackW,
      h: 0.24,
      fill: { color: C.track },
      line: { color: C.track, width: 0 },
      rectRadius: 0.04,
    })
    const width = Math.max(0.08, (row.value / max) * trackW)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y: yy + 0.36,
      w: width,
      h: 0.24,
      fill: { color: row.color },
      line: { color: row.color, width: 0 },
      rectRadius: 0.04,
    })
    slide.addText(row.display, {
      x: x + trackW,
      y: yy + 0.28,
      w: valueW,
      h: 0.4,
      fontFace: 'Calibri',
      fontSize: 16,
      bold: true,
      color: C.ink,
      align: 'right',
      margin: 0,
      valign: 'middle',
    })
  })
}

function panel(slide, x, y, w, h) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x,
    y,
    w,
    h,
    fill: { color: 'FFFFFF' },
    line: { color: '1C1917', width: 1.25 },
    rectRadius: 0.04,
  })
}

function panelTitle(slide, title, x, y, w) {
  slide.addText(title, {
    x,
    y,
    w,
    h: 0.32,
    fontFace: 'Calibri',
    fontSize: 14,
    bold: true,
    underline: { style: 'sng', color: '1C1917' },
    align: 'center',
    color: '1C1917',
    margin: 0,
  })
}

function iconPerson(slide, x, y) {
  slide.addShape(pptx.shapes.OVAL, {
    x: x + 0.1,
    y,
    w: 0.22,
    h: 0.22,
    fill: { color: C.forest },
    line: { color: C.forest, width: 0 },
  })
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x,
    y: y + 0.26,
    w: 0.42,
    h: 0.22,
    fill: { color: C.forest },
    line: { color: C.forest, width: 0 },
    rectRadius: 0.08,
  })
}

function iconApp(slide, x, y) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x,
    y,
    w: 0.34,
    h: 0.46,
    fill: { color: 'FFFFFF' },
    line: { color: C.forest, width: 1.5 },
    rectRadius: 0.04,
  })
  slide.addShape(pptx.shapes.OVAL, {
    x: x + 0.12,
    y: y + 0.34,
    w: 0.1,
    h: 0.06,
    fill: { color: C.forest },
    line: { color: C.forest, width: 0 },
  })
}

function iconMark(slide, x, y) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x,
    y,
    w: 0.42,
    h: 0.42,
    fill: { color: C.forest },
    line: { color: C.forest, width: 0 },
    rectRadius: 0.06,
  })
  slide.addText('F', {
    x,
    y: y + 0.04,
    w: 0.42,
    h: 0.34,
    fontFace: 'Georgia',
    fontSize: 16,
    color: 'FFFFFF',
    align: 'center',
    margin: 0,
  })
}

function iconPages(slide, x, y) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: x + 0.08,
    y,
    w: 0.3,
    h: 0.4,
    fill: { color: 'FFFFFF' },
    line: { color: C.forest, width: 1.25 },
  })
  slide.addShape(pptx.shapes.RECTANGLE, {
    x,
    y: y + 0.08,
    w: 0.3,
    h: 0.4,
    fill: { color: 'FFFFFF' },
    line: { color: C.forest, width: 1.25 },
  })
}

function slide1() {
  const slide = pptx.addSlide()
  slide.background = { color: C.paper }

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.4,
    fill: { color: C.forest },
    line: { color: C.forest, width: 0 },
  })
  slide.addText('SKIP CHECK', {
    x: 0.22,
    y: 0.04,
    w: 1.7,
    h: 0.28,
    fontFace: 'Georgia',
    fontSize: 14,
    bold: true,
    color: 'FFFFFF',
    margin: 0,
    valign: 'middle',
  })
  const tabs = [
    ['MARKET LANDSCAPE', true],
    ['USER EVIDENCE', false],
    ['PERSONA', false],
    ['JOURNEY', false],
    ['FRAMING', false],
    ['WHAT TO TEST', false],
  ]
  tabs.forEach((tab, index) => {
    const x = 2.1 + index * 1.78
    slide.addText(tab[0], {
      x,
      y: 0.05,
      w: 1.7,
      h: 0.24,
      fontFace: 'Calibri',
      fontSize: 12,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      margin: 0,
      valign: 'middle',
    })
    if (tab[1]) {
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: x + 0.14,
        y: 0.33,
        w: 1.42,
        h: 0.035,
        fill: { color: 'FFFFFF' },
        line: { color: 'FFFFFF', width: 0 },
      })
    }
  })

  card(slide, 0.22, 0.48, 12.89, 1.54)
  slide.addText('SKIP CHECK BY FINLIT VENTURES', {
    x: 0.4,
    y: 0.54,
    w: 12.52,
    h: 0.36,
    fontFace: 'Georgia',
    fontSize: 26,
    bold: true,
    color: C.forest,
    margin: 0,
    valign: 'middle',
  })
  slide.addText('Personalised clarity before an SIP decision.', {
    x: 0.4,
    y: 0.9,
    w: 12.52,
    h: 0.28,
    fontFace: 'Georgia',
    fontSize: 18,
    color: C.ink,
    margin: 0,
  })
  slide.addText(
    [
      plain(
        'Investors consider changing a SIP for different personal reasons. Existing tools and investing apps may show amounts and transaction options, but that does not explain the implications in the context of the person’s reason. Skip Check addresses this gap with ',
      ),
      { text: 'reason-aware, personalised decision support', options: { bold: true, color: C.ink } },
      plain(
        '. The reason changes the emphasis, not the formula: current minus proposed, times one to twenty-four months, in whole rupees.',
      ),
    ],
    {
      x: 0.4,
      y: 1.2,
      w: 12.52,
      h: 0.72,
      fontFace: 'Calibri',
      fontSize: 14,
      color: C.ink,
      margin: 0,
      lineSpacing: 16,
    },
  )

  card(slide, 0.22, 2.1, 8.36, 2.46)
  slide.addText('THE JOB TO BE DONE', {
    x: 0.4,
    y: 2.18,
    w: 3.15,
    h: 0.24,
    fontFace: 'Calibri',
    fontSize: 13,
    bold: true,
    color: C.forest,
    margin: 0,
    valign: 'middle',
  })
  slide.addText('Reconstructed from desk research, not an interview.', {
    x: 3.5,
    y: 2.18,
    w: 4.88,
    h: 0.24,
    fontFace: 'Calibri',
    fontSize: 13,
    italic: true,
    color: C.muted,
    align: 'right',
    margin: 0,
    valign: 'middle',
  })
  slide.addText(
    'When I’m reconsidering my SIP because my financial situation, confidence, or priorities have changed, I want to understand how keeping, reducing, or pausing future contributions changes my planned investment amounts, so I can make a more informed decision without guessing.',
    {
      x: 0.4,
      y: 2.46,
      w: 8.0,
      h: 1.1,
      fontFace: 'Georgia',
      fontSize: 14,
      italic: true,
      color: C.ink,
      margin: 0,
      lineSpacing: 16,
    },
  )
  slide.addText('Different reasons. One need: clarity before commitment.', {
    x: 0.4,
    y: 3.58,
    w: 8.0,
    h: 0.26,
    fontFace: 'Georgia',
    fontSize: 15,
    bold: true,
    color: C.forest,
    margin: 0,
  })
  slide.addText(
    'Reasons the product records include: “My expenses or priorities have changed.” “I’m unsure about market movements.” “My plans or timeline have changed.” “I want to understand my investment better.”',
    {
      x: 0.4,
      y: 3.88,
      w: 8.0,
      h: 0.54,
      fontFace: 'Calibri',
      fontSize: 13,
      color: C.ink,
      margin: 0,
      lineSpacing: 16,
    },
  )

  card(slide, 8.7, 2.1, 4.41, 2.46)
  slide.addText('DECISION SUPPORT, NOT\nTRANSACTION EXECUTION', {
    x: 8.86,
    y: 2.2,
    w: 4.08,
    h: 0.5,
    fontFace: 'Georgia',
    fontSize: 14,
    bold: true,
    color: C.ink,
    margin: 0,
    lineSpacing: 16,
  })
  slide.addText(
    'Investors change SIPs in their own apps. Skip Check explains the contribution difference and does not execute, pause, cancel, or restart a SIP.',
    {
      x: 8.86,
      y: 2.74,
      w: 4.08,
      h: 0.7,
      fontFace: 'Calibri',
      fontSize: 13,
      color: C.ink,
      margin: 0,
      lineSpacing: 15,
    },
  )
  ;[
    'Investor reconsidering a SIP',
    'Skip Check comparison',
    'Investor decides',
    'Investor returns to their own app',
  ].forEach((label, index) => {
    const y = 3.5 + index * 0.25
    slide.addShape(pptx.shapes.OVAL, {
      x: 8.88,
      y: y + 0.01,
      w: 0.22,
      h: 0.22,
      fill: { color: C.card },
      line: { color: C.forest, width: 1.25 },
    })
    slide.addText(String(index + 1), {
      x: 8.88,
      y: y + 0.01,
      w: 0.22,
      h: 0.22,
      fontFace: 'Calibri',
      fontSize: 11,
      bold: true,
      color: C.forest,
      align: 'center',
      margin: 0,
      valign: 'middle',
    })
    slide.addText(label, {
      x: 9.18,
      y,
      w: 3.76,
      h: 0.24,
      fontFace: 'Calibri',
      fontSize: 13,
      color: C.ink,
      margin: 0,
      valign: 'middle',
    })
  })

  card(slide, 0.22, 4.66, 8.36, 1.28)
  slide.addText('A FREE FEATURE. A POTENTIAL CONVERSION DRIVER.', {
    x: 0.4,
    y: 4.74,
    w: 8.0,
    h: 0.26,
    fontFace: 'Georgia',
    fontSize: 14,
    bold: true,
    color: C.ink,
    margin: 0,
  })
  slide.addText(
    [
      plain(
        'Skip Check is free. By addressing the person’s reason, it aims to build trust and create a pathway to FinLit’s existing paid listing plans, published from ₹99 to ₹2,499. ',
      ),
      { text: 'This is a hypothesis: ', options: { bold: true, color: C.ink } },
      plain(
        'personalised clarity may increase the likelihood that visitors explore or purchase a relevant FinLit plan. No conversion lift has been measured. This prototype does not take payment.',
      ),
    ],
    {
      x: 0.4,
      y: 5.02,
      w: 8.0,
      h: 0.84,
      fontFace: 'Calibri',
      fontSize: 13,
      color: C.ink,
      margin: 0,
      lineSpacing: 15,
    },
  )

  card(slide, 8.7, 4.66, 4.41, 1.28)
  slide.addText('A LARGE, ACTIVE SIP ECOSYSTEM.', {
    x: 8.86,
    y: 4.74,
    w: 4.1,
    h: 0.24,
    fontFace: 'Georgia',
    fontSize: 13,
    color: C.ink,
    margin: 0,
  })
  slide.addText('₹32,297 crore', {
    x: 8.86,
    y: 5.02,
    w: 2.08,
    h: 0.3,
    fontFace: 'Georgia',
    fontSize: 16,
    bold: true,
    color: C.forest,
    margin: 0,
  })
  slide.addText('August 2026 SIP contributions.', {
    x: 8.86,
    y: 5.32,
    w: 2.08,
    h: 0.5,
    fontFace: 'Calibri',
    fontSize: 13,
    color: C.ink,
    margin: 0,
    lineSpacing: 15,
  })
  slide.addText('10.02 crore', {
    x: 11.0,
    y: 5.02,
    w: 1.94,
    h: 0.3,
    fontFace: 'Georgia',
    fontSize: 16,
    bold: true,
    color: C.forest,
    margin: 0,
  })
  slide.addText('Contributing accounts, not people.', {
    x: 11.0,
    y: 5.32,
    w: 1.94,
    h: 0.5,
    fontFace: 'Calibri',
    fontSize: 13,
    color: C.ink,
    margin: 0,
    lineSpacing: 15,
  })

  slide.addText(
    'About 50.30 lakh SIPs were discontinued or tenure-completed in July 2026. Discontinued SIPs are not a count of voluntary pauses from market worry or cash distress.',
    {
      x: 0.22,
      y: 6.02,
      w: 12.89,
      h: 0.24,
      fontFace: 'Calibri',
      fontSize: 13,
      color: C.ink,
      margin: 0,
    },
  )
  slide.addText(
    [
      link('AMFI monthly note, August 2026', URLS.amfiAug),
      plain('. '),
      link('Economic Times, citing AMFI', URLS.etStoppage),
      plain(', for the July count. That July figure was not re-read from an AMFI workbook.'),
    ],
    {
      x: 0.22,
      y: 6.26,
      w: 12.89,
      h: 0.2,
      fontFace: 'Calibri',
      fontSize: 11,
      margin: 0,
    },
  )

  const actorRows = [
    ['Investor. ', 'Has a SIP and is reconsidering future contributions.', 0.22, 6.52, 7.15],
    ['Investing app. ', 'Where the change is executed.', 7.52, 6.52, 5.58],
    [
      'Skip Check. ',
      'Explains the planned-contribution difference from the selected reason and inputs.',
      0.22,
      6.76,
      7.15,
    ],
    ['FinLit Ventures. ', 'Free feature, plus an optional pathway to paid plans.', 7.52, 6.76, 5.58],
  ]
  actorRows.forEach(([role, detail, x, y, w]) => {
    slide.addText(
      [
        { text: role, options: { bold: true, color: C.forest } },
        { text: detail, options: { color: C.ink } },
      ],
      {
        x,
        y,
        w,
        h: 0.24,
        fontFace: 'Calibri',
        fontSize: 13,
        margin: 0,
        valign: 'middle',
      },
    )
  })

  slide.addText(
    'FinLit states it is not registered with SEBI or AMFI. A compliance review of this prototype has not been completed. The difference is in planned contributions, not an investment loss. Existing units generally remain invested unless redeemed separately.',
    {
      x: 0.22,
      y: 7.04,
      w: 12.89,
      h: 0.42,
      fontFace: 'Calibri',
      fontSize: 13,
      color: C.muted,
      margin: 0,
      lineSpacing: 15,
    },
  )
}
function slide2Header(slide) {
  slide.background = { color: C.paper }
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.38,
    fill: { color: C.forest },
    line: { color: C.forest, width: 0 },
  })
  slide.addText('SKIP CHECK', {
    x: 0.2,
    y: 0.04,
    w: 1.65,
    h: 0.28,
    fontFace: 'Georgia',
    fontSize: 13,
    bold: true,
    color: 'FFFFFF',
    margin: 0,
    valign: 'middle',
  })
  const tabs = [
    ['MARKET LANDSCAPE', false],
    ['USER EVIDENCE', true],
    ['PERSONA', false],
    ['JOURNEY', false],
    ['FRAMING', false],
    ['WHAT TO TEST', false],
  ]
  tabs.forEach((tab, index) => {
    const x = 2.05 + index * 1.82
    slide.addText(tab[0], {
      x,
      y: 0.05,
      w: 1.74,
      h: 0.22,
      fontFace: 'Calibri',
      fontSize: 11,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      margin: 0,
    })
    if (tab[1]) {
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: x + 0.16,
        y: 0.3,
        w: 1.42,
        h: 0.035,
        fill: { color: 'FFFFFF' },
        line: { color: 'FFFFFF', width: 0 },
      })
    }
  })
}

function slide2() {
  const slide = pptx.addSlide()
  slide2Header(slide)

  slide.addText('Understanding the SIP reconsideration moment.', {
    x: 0.22,
    y: 0.44,
    w: 8.3,
    h: 0.34,
    fontFace: 'Georgia',
    fontSize: 20,
    color: C.ink,
    margin: 0,
  })
  slide.addText('Secondary research and a product-flow review. Primary investor validation is still outstanding.', {
    x: 8.4,
    y: 0.46,
    w: 4.7,
    h: 0.32,
    fontFace: 'Calibri',
    fontSize: 12,
    color: C.muted,
    align: 'right',
    margin: 0,
  })

  card(slide, 0.22, 0.86, 3.85, 2.52)
  slide.addText('RESEARCH FOUNDATION', {
    x: 0.36,
    y: 0.94,
    w: 3.56,
    h: 0.26,
    fontFace: 'Calibri',
    fontSize: 13,
    bold: true,
    color: C.forest,
    margin: 0,
  })
  slide.addText(
    'Public threads show questions people ask. They do not show how common those questions are.\n\nAMFI notes describe industry activity. A discontinued or completed SIP is not a stated reason.\n\nHelp articles record a misunderstood rule. They are not a sample of investors.\n\nThe live Skip Check flow shows what the page does. It does not show that people find it useful.',
    {
      x: 0.36,
      y: 1.24,
      w: 3.56,
      h: 2.02,
      fontFace: 'Calibri',
      fontSize: 12,
      color: C.ink,
      margin: 0,
    },
  )

  card(slide, 4.17, 0.86, 5.15, 2.52)
  slide.addText('WHY INVESTORS RECONSIDER', {
    x: 4.31,
    y: 0.94,
    w: 4.86,
    h: 0.26,
    fontFace: 'Calibri',
    fontSize: 13,
    bold: true,
    color: C.forest,
    margin: 0,
  })
  slide.addText(
    [
      { text: 'Cash-flow pressure. ', options: { bold: true } },
      plain('Public threads describe an education-loan use of SIP cash, and a two-month pause in a cash crunch. '),
      link('Loan thread', URLS.redditLoan),
      plain('. '),
      link('Cash-crunch thread', URLS.redditDrawdown),
      plain('. Not a rate.\n'),
      { text: 'Market uncertainty. ', options: { bold: true } },
      plain('A public thread asks whether to stop because of a possible correction. '),
      link('Correction thread', URLS.redditFear),
      plain('. Not a rate.\n'),
      { text: 'Changing goals. ', options: { bold: true } },
      plain('The live page offers this reason. No matching thread was in this sample. A trigger to validate.\n'),
      { text: 'Understanding the investment. ', options: { bold: true } },
      plain('The live page offers this reason. Not a measured preference.\n'),
      { text: 'The action itself. ', options: { bold: true } },
      link('Kuvera’s help', URLS.kuvera),
      plain(' says stopping is not a withdrawal. '),
      link('Groww’s help', URLS.groww),
      plain(' says a near-dated cancel can still be debited.'),
    ],
    {
      x: 4.31,
      y: 1.22,
      w: 4.86,
      h: 2.06,
      fontFace: 'Calibri',
      fontSize: 11,
      color: C.ink,
      margin: 0,
    },
  )

  card(slide, 9.42, 0.86, 3.69, 2.52)
  slide.addText('SIP CONTRIBUTIONS', {
    x: 9.56,
    y: 0.94,
    w: 3.4,
    h: 0.24,
    fontFace: 'Calibri',
    fontSize: 13,
    bold: true,
    color: C.forest,
    margin: 0,
  })
  slide.addText('₹ crore. Both bars use a scale from 0.', {
    x: 9.56,
    y: 1.18,
    w: 3.4,
    h: 0.22,
    fontFace: 'Calibri',
    fontSize: 12,
    color: C.muted,
    margin: 0,
  })
  const contrib = [
    { label: 'July 2026', value: 31961, display: '31,961' },
    { label: 'August 2026', value: 32297, display: '32,297' },
  ]
  contrib.forEach((row, index) => {
    const y = 1.48 + index * 0.58
    slide.addText(row.label, {
      x: 9.56,
      y,
      w: 3.4,
      h: 0.2,
      fontFace: 'Calibri',
      fontSize: 12,
      color: C.ink,
      margin: 0,
    })
    const trackW = 2.35
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 9.56,
      y: y + 0.22,
      w: trackW,
      h: 0.18,
      fill: { color: C.track },
      line: { color: C.track, width: 0 },
      rectRadius: 0.04,
    })
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 9.56,
      y: y + 0.22,
      w: Math.max(0.08, (row.value / 36000) * trackW),
      h: 0.18,
      fill: { color: index === 1 ? C.forest : C.soft },
      line: { color: index === 1 ? C.forest : C.soft, width: 0 },
      rectRadius: 0.04,
    })
    slide.addText(row.display, {
      x: 11.98,
      y: y + 0.14,
      w: 0.95,
      h: 0.32,
      fontFace: 'Calibri',
      fontSize: 13,
      bold: true,
      color: C.ink,
      margin: 0,
      valign: 'middle',
    })
  })
  slide.addText(
    [
      plain('Contributions rose. 10.02 crore August accounts are accounts, not people. '),
      link('August note', URLS.amfiAug),
      plain('. '),
      link('July note', URLS.amfiJul),
      plain('.'),
    ],
    {
      x: 9.56,
      y: 2.7,
      w: 3.4,
      h: 0.56,
      fontFace: 'Calibri',
      fontSize: 11,
      color: C.ink,
      margin: 0,
    },
  )

  card(slide, 0.22, 3.48, 12.89, 1.18)
  slide.addText('THE CURRENT DECISION JOURNEY', {
    x: 0.36,
    y: 3.54,
    w: 6.2,
    h: 0.22,
    fontFace: 'Calibri',
    fontSize: 13,
    bold: true,
    color: C.forest,
    margin: 0,
  })
  slide.addText('Candidate stages. Only the threads and help articles are documented.', {
    x: 6.6,
    y: 3.54,
    w: 6.3,
    h: 0.22,
    fontFace: 'Calibri',
    fontSize: 12,
    italic: true,
    color: C.muted,
    align: 'right',
    margin: 0,
  })
  const steps = [
    ['1', 'A trigger', 'Cash or a possible correction, in public threads.'],
    ['2', 'Their app', 'Help articles describe cancel and stop. Not a watched session.'],
    ['3', 'A search', 'The same questions appear on a forum or a help page.'],
    ['4', 'A choice', 'Replies split. That split is not a measured rate.'],
    ['5', 'Their app again', 'A change, if any, is made there. Skip Check does not execute it.'],
  ]
  steps.forEach((step, index) => {
    const x = 0.36 + index * 2.54
    slide.addText(step[0], {
      x,
      y: 3.8,
      w: 0.28,
      h: 0.24,
      fontFace: 'Georgia',
      fontSize: 14,
      color: C.forest,
      margin: 0,
    })
    slide.addText(step[1], {
      x: x + 0.3,
      y: 3.8,
      w: 2.1,
      h: 0.24,
      fontFace: 'Calibri',
      fontSize: 13,
      bold: true,
      color: C.ink,
      margin: 0,
    })
    slide.addText(step[2], {
      x,
      y: 4.06,
      w: 2.4,
      h: 0.5,
      fontFace: 'Calibri',
      fontSize: 11,
      color: C.ink,
      margin: 0,
    })
  })

  card(slide, 0.22, 4.76, 7.35, 1.92)
  slide.addText('WHAT MAY BE NEEDED BEFORE A DECISION', {
    x: 0.36,
    y: 4.84,
    w: 7.05,
    h: 0.24,
    fontFace: 'Calibri',
    fontSize: 13,
    bold: true,
    color: C.forest,
    margin: 0,
  })
  slide.addText('A mapping from this desk research to the live page. Not a usability result.', {
    x: 0.36,
    y: 5.08,
    w: 7.05,
    h: 0.2,
    fontFace: 'Calibri',
    fontSize: 12,
    italic: true,
    color: C.muted,
    margin: 0,
  })
  const needs = [
    ['Compare the three paths.', 'Keep, Reduce, and Pause are equal cards. Pause is a proposed ₹0.'],
    ['See the rupees.', 'Current minus proposed, times the months. Not an investment loss.'],
    ['Know what stays invested.', 'Pausing future contributions does not itself redeem existing units.'],
    ['Name a reason.', 'The reason is optional. It changes emphasis, not the formula.'],
    ['Keep the decision.', 'Any change is still made in the person’s own investing app.'],
  ]
  needs.forEach((row, index) => {
    const y = 5.32 + index * 0.25
    slide.addText(row[0], {
      x: 0.36,
      y,
      w: 2.35,
      h: 0.24,
      fontFace: 'Calibri',
      fontSize: 12,
      bold: true,
      color: C.ink,
      margin: 0,
    })
    slide.addText(row[1], {
      x: 2.72,
      y,
      w: 4.65,
      h: 0.24,
      fontFace: 'Calibri',
      fontSize: 12,
      color: C.ink,
      margin: 0,
    })
  })

  card(slide, 7.67, 4.76, 5.44, 1.92)
  slide.addText('WHAT THE EVIDENCE SUGGESTS', {
    x: 7.81,
    y: 4.84,
    w: 5.14,
    h: 0.24,
    fontFace: 'Calibri',
    fontSize: 13,
    bold: true,
    color: C.forest,
    margin: 0,
  })
  slide.addText(
    'The reason can differ. Cash and a possible correction both appear in public threads. They are not shown to be equally common.\n\nChanging a contribution and understanding it are different questions. Kuvera’s article exists because a stop was read as a withdrawal.\n\nTrust needs a boundary. The live page calculates planned contributions, does not predict returns, and does not change the SIP.',
    {
      x: 7.81,
      y: 5.14,
      w: 5.14,
      h: 1.42,
      fontFace: 'Calibri',
      fontSize: 12,
      color: C.ink,
      margin: 0,
    },
  )

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.22,
    y: 6.78,
    w: 12.89,
    h: 0.64,
    fill: { color: C.forest },
    line: { color: C.forest, width: 0 },
    rectRadius: 0.04,
  })
  slide.addText(
    'The opportunity is not simply to calculate a SIP difference. It is to make that difference understandable in the context of why the investor is reconsidering the contribution.',
    {
      x: 0.4,
      y: 6.84,
      w: 12.52,
      h: 0.34,
      fontFace: 'Georgia',
      fontSize: 13,
      color: 'FFFFFF',
      margin: 0,
    },
  )
  slide.addText('Inferred from desk research. Not an observed need from interviews. July’s 50.30 lakh discontinued or completed SIPs are not voluntary pauses.', {
    x: 0.4,
    y: 7.16,
    w: 9.4,
    h: 0.2,
    fontFace: 'Calibri',
    fontSize: 11,
    color: 'E7F0EB',
    margin: 0,
  })
  slide.addText(
    [
      {
        text: 'July count, Economic Times citing AMFI',
        options: { hyperlink: { url: URLS.etStoppage }, color: 'F6F1E8', underline: true },
      },
    ],
    {
      x: 9.5,
      y: 7.14,
      w: 3.4,
      h: 0.22,
      fontFace: 'Calibri',
      fontSize: 11,
      align: 'right',
      margin: 0,
    },
  )
}


function slide3() {
  const slide = slideBase('One person, two months', 3)
  headline(slide, 'The same illustrative person has a market-worry month and a cash-gap month.')
  body(
    slide,
    [
      plain(
        'Ananya Shah is a teaching composite. She was not interviewed, and she is not a customer. The notes place her at 31, in Pune, in a salaried job, with two equity SIPs totalling ₹12,000 a month and a house goal about eight years away. ',
      ),
      link('SEBI’s 2025 investor survey', URLS.sebiReport),
      plain(' is background for that portrait, not a measurement of her: about 6.7 percent of households hold mutual funds or ETFs, and '),
      link('the survey press note', URLS.sebiPress),
      plain(' says 36 percent of investors have high or moderate securities knowledge.'),
    ],
    { x: 0.4, y: 1.46, w: 12.52, h: 1.12 },
  )

  card(slide, 0.4, 2.68, 6.16, 2.28)
  slide.addText('Market-worry month', {
    x: 0.58,
    y: 2.8,
    w: 5.8,
    h: 0.32,
    fontFace: 'Georgia',
    fontSize: 16,
    color: C.ink,
    margin: 0,
  })
  slide.addText(
    'The fund is down, and a colleague says to wait for the bottom. That trigger follows the shape of the public threads on the previous page. It is not a sentence Ananya spoke. Keep, Reduce, and Pause stay equal. A useful result is that she can restate the rupee difference and still choose for herself.',
    {
      x: 0.58,
      y: 3.16,
      w: 5.8,
      h: 1.62,
      fontFace: 'Calibri',
      fontSize: 14,
      color: C.ink,
      margin: 0,
    },
  )

  card(slide, 6.76, 2.68, 6.16, 2.28)
  slide.addText('Salary delayed — same person', {
    x: 6.94,
    y: 2.8,
    w: 5.8,
    h: 0.32,
    fontFace: 'Georgia',
    fontSize: 16,
    color: C.ink,
    margin: 0,
  })
  slide.addText(
    'Her salary is delayed by one to three months. Pause is a legitimate result in this month. A useful result is that she can pause without being talked out of it. Continuation is not the success metric here. The product fails this month if the pause is hidden or discouraged.',
    {
      x: 6.94,
      y: 3.16,
      w: 5.8,
      h: 1.62,
      fontFace: 'Calibri',
      fontSize: 14,
      color: C.ink,
      margin: 0,
    },
  )

  const outcomes = [
    [
      'Immediate. ',
      'She can restate the difference: current monthly amount minus proposed monthly amount, multiplied by the months, in whole rupees. That figure is less in planned contributions. It is not an investment loss.',
    ],
    [
      'Behaviour. ',
      'She decides in her own investing application. Skip Check does not change the SIP. Units she already holds generally remain invested unless she redeems them separately.',
    ],
    [
      'Trust. ',
      'FinLit states that it is not registered with SEBI or AMFI. If the contact and booking addresses are empty, the page says a person is not connected.',
    ],
    [
      'Business. ',
      '₹99 is an unpaid list price. Nothing here is measured. The prototype keeps the formula and in-memory events with no amounts. The 7-of-10 gate is proposed, not run.',
    ],
  ]
  outcomes.forEach((pair, index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    slide.addText(
      [
        { text: pair[0], options: { bold: true, color: C.forest } },
        { text: pair[1], options: { color: C.ink } },
      ],
      {
        x: 0.4 + col * 6.36,
        y: 5.12 + row * 0.96,
        w: 6.16,
        h: 0.9,
        fontFace: 'Calibri',
        fontSize: 14,
        margin: 0,
      },
    )
  })
}

function slide4() {
  const slide = slideBase('Journey and hypotheses', 4)
  headline(slide, 'The idea to test is a branched explanation, and a pause is sometimes the right result.')
  body(
    slide,
    [
      plain(
        'The live homepage is the assessment. Landing offers “Explore my options” or “I’m just exploring.” A reason is optional and skippable: it changes emphasis, not the formula. Amounts are whole rupees, for 1 to 24 months. Keep, Reduce, and Pause have equal weight, and Pause is a proposed ₹0. What if uses sliders, numeric fields, and a reset. Three clarity questions can be skipped. A recap is local, and only after consent. A reminder stays in that browser. Increases are rejected. Above ₹10,00,000 needs confirmation. SIP Check Bot explains and does not decide. Analytics stay in memory and store no amounts.',
      ),
    ],
    { x: 0.4, y: 1.48, w: 7.2, h: 1.72 },
  )
  body(
    slide,
    [
      plain(
        'Why H2. The darker bar is the gap to test: an undifferentiated confirm, not the pause itself. It still helps if most pauses are legitimate, because the arithmetic is shown and Pause stays allowed. H1, mean 3.7, is a mechanism, not a rate. H3, mean 3.5, is background literacy. H4, mean 2.8, is a weak product bet and a high-confidence warning that the stoppage ratio is the wrong count. The six criteria were weighted equally. These are not user ratings.',
      ),
    ],
    { x: 0.4, y: 3.28, w: 7.2, h: 1.28 },
  )
  body(
    slide,
    [
      plain(
        'Discrepancy. research/17 still says the prototype was “not built.” docs/product-decisions.md describes an earlier card, with a restart month and no persistence. informedChoiceRate counts reason_selected, calculation_viewed, choice_recorded, and comprehension_passed over valid_card_reached. The assessment emits different events and has no observed rate. Do not present that rate as a result. Falsify H2 if a cash-need user feels pressed to continue, or cannot restate the arithmetic. That test has not been run.',
      ),
    ],
    { x: 0.4, y: 4.64, w: 7.2, h: 1.55 },
  )

  card(slide, 7.8, 1.48, 5.12, 5.5)
  slide.addText('Equal-weight desk scores, 0 to 5', {
    x: 8.0,
    y: 1.62,
    w: 4.72,
    h: 0.32,
    fontFace: 'Georgia',
    fontSize: 16,
    color: C.ink,
    margin: 0,
  })
  slide.addText('These are not survey results. H2 is the darker bar.', {
    x: 8.0,
    y: 1.98,
    w: 4.72,
    h: 0.32,
    fontFace: 'Calibri',
    fontSize: 14,
    color: C.muted,
    margin: 0,
  })
  bars(slide, {
    x: 8.0,
    y: 2.46,
    labelW: 0.52,
    trackW: 3.2,
    max: 5,
    rows: [
      { label: 'H1', value: 3.7, display: '3.7', color: C.soft },
      { label: 'H2', value: 4.3, display: '4.3', color: C.forest },
      { label: 'H3', value: 3.5, display: '3.5', color: C.soft },
      { label: 'H4', value: 2.8, display: '2.8', color: C.soft },
    ],
  })
  slide.addText(
    'Each label matches one explanation in the paragraph on the left. The number is that explanation’s mean desk score, on a scale from 0 to 5, and it sits in its own column.',
    {
      x: 8.0,
      y: 5.28,
      w: 4.72,
      h: 1.4,
      fontFace: 'Calibri',
      fontSize: 14,
      color: C.ink,
      margin: 0,
    },
  )
}

function slide5() {
  const slide = slideBase('Problem framing', 5)
  headline(slide, 'The problem is how the next instalments are explained at the moment of change.')

  const cells = [
    {
      k: 'True problem',
      v: 'At a SIP change, a cash need and a market worry meet the same thin confirm. The next instalments are not calculated from this person’s amounts. A pause is sometimes the right choice. The difference is not an investment loss.',
    },
    {
      k: 'Who',
      v: 'A person who already runs a SIP and is about to keep, reduce, or pause. Illustrated by Ananya, not interviewed. Not someone who has yet to start, and not a household that is only aware of a securities product.',
    },
    {
      k: 'How we know',
      v: 'AMFI’s notes and the ceased-SIP rule, three paraphrased threads, and Kuvera and Groww help. No interviews and no measured use. The voluntary share of July’s 50.30 lakh is not published, so this deck does not invent it.',
    },
    {
      k: 'Value, potential only',
      v: 'Customer, if it works: a choice she can restate, including a pause. Not a higher return. Business, if anyone comes: a free check and an unpaid ₹99 review. Not fewer pauses. Do not use the 38.5 crore TAM or “NCFE 2026.” That 27% figure is 2019 fieldwork.',
    },
  ]
  cells.forEach((cell, index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    const x = 0.4 + col * 6.36
    const y = 1.48 + row * 1.68
    card(slide, x, y, 6.2, 1.56)
    slide.addText(cell.k, {
      x: x + 0.18,
      y: y + 0.1,
      w: 5.84,
      h: 0.28,
      fontFace: 'Calibri',
      fontSize: 14,
      bold: true,
      color: C.forest,
      margin: 0,
    })
    slide.addText(cell.v, {
      x: x + 0.18,
      y: y + 0.42,
      w: 5.84,
      h: 1.02,
      fontFace: 'Calibri',
      fontSize: 14,
      color: C.ink,
      margin: 0,
    })
  })

  slide.addText(
    [
      { text: 'Why look now. ', options: { bold: true, color: C.forest } },
      { text: 'This is a hypothesis, not a crisis. Contributions were higher in the ', options: { color: C.ink } },
      link('August 2026 note', URLS.amfiAug),
      { text: ' than in the ', options: { color: C.ink } },
      link('July note', URLS.amfiJul),
      {
        text: ', so this deck does not describe a redemption emergency. The reason to test the page is that public threads still mix a scare with a cash need, and help centers still explain that stopping a SIP is not the same as getting the money back.',
        options: { color: C.ink },
      },
    ],
    { x: 0.4, y: 4.92, w: 12.52, h: 1.05, fontFace: 'Calibri', fontSize: 14, margin: 0 },
  )
  slide.addText(
    [
      { text: 'Synthesis. ', options: { bold: true, color: C.forest } },
      {
        text: 'Customer value and business value are both potential, and neither has been measured. The test is whether a reason-specific explanation, with an honest boundary, is more useful than a bare subtraction. That has not been shown.',
        options: { color: C.ink },
      },
    ],
    { x: 0.4, y: 6.02, w: 12.52, h: 0.98, fontFace: 'Calibri', fontSize: 14, margin: 0 },
  )
}

function slide6() {
  const slide = slideBase('What to validate next', 6)
  slide.addText('Three tests should pass before any further solution work.', {
    x: 0.4,
    y: 0.48,
    w: 12.52,
    h: 0.48,
    fontFace: 'Georgia',
    fontSize: 26,
    color: C.ink,
    margin: 0,
  })

  const tests = [
    {
      n: '01',
      t: 'Counsel, before a public pilot.',
      d: 'A compliance review comes before any public pilot. FinLit states that it is not registered with SEBI or AMFI. A compliance review of this prototype has not been completed.',
    },
    {
      n: '02',
      t: 'Usability, with eight to ten people.',
      d: 'Not run. It passes only if at least seven of the ten restate the rupee line and the units line, and a person with a cash need can pause without hunting.',
    },
    {
      n: '03',
      t: 'Distribution, on the first fifty sessions.',
      d: 'Not run. It fails if fewer than ten of those sessions, excluding staff, are from someone about to change a SIP. Continuation is not the gate.',
    },
  ]
  tests.forEach((item, index) => {
    const y = 1.12 + index * 1.42
    card(slide, 0.4, y, 12.52, 1.32)
    slide.addText(item.n, {
      x: 0.58,
      y: y + 0.28,
      w: 0.72,
      h: 0.7,
      fontFace: 'Georgia',
      fontSize: 22,
      color: C.forest,
      margin: 0,
      valign: 'middle',
    })
    slide.addText(item.t, {
      x: 1.45,
      y: y + 0.12,
      w: 11.2,
      h: 0.34,
      fontFace: 'Georgia',
      fontSize: 16,
      color: C.ink,
      margin: 0,
    })
    slide.addText(item.d, {
      x: 1.45,
      y: y + 0.5,
      w: 11.2,
      h: 0.7,
      fontFace: 'Calibri',
      fontSize: 14,
      color: C.ink,
      margin: 0,
    })
  })

  slide.addText(
    [
      {
        text: 'Believe. ',
        options: { bold: true, color: C.forest },
      },
      plain(
        'H2 is worth a test because it still helps if most pauses are legitimate, and the arithmetic is already deterministic. ',
      ),
      {
        text: 'Unproven. ',
        options: { bold: true, color: C.forest },
      },
      plain(
        'Any interview, any restatement, whether cash-need users feel pressed, any informed-choice rate, and a RICE reach of 200. That reach is an assumption, not a historical score. ',
      ),
      link('skip-check.vercel.app', URLS.prototype),
      plain(
        ' shows that the page opens. It is not evidence of use. This deck stops before wireframes. A later section would show the screens, and those pages are not included.',
      ),
    ],
    {
      x: 0.4,
      y: 5.42,
      w: 12.52,
      h: 1.58,
      fontFace: 'Calibri',
      fontSize: 14,
      color: C.ink,
      margin: 0,
    },
  )
}

slide1()
slide2()
slide3()
slide4()
slide5()
slide6()

if (pptx.slides.length !== 6) {
  throw new Error(`Expected 6 slides, got ${pptx.slides.length}`)
}

await mkdir(outDir, { recursive: true })
const pptxPath = path.join(outDir, 'finlit-skip-check-strategy.pptx')
await pptx.writeFile({ fileName: pptxPath })
console.log(pptxPath)
