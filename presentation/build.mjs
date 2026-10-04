/**
 * Skip Check strategy deck. The cover is first, then pages 1–10.
 * Slide 9 is the system, journey, and go-to-market canvas.
 * Slide 10 is the detailed design that slide 9 links to.
 * node build.mjs
 * node build.mjs --five   writes pages 1–5 only
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
pptx.title = 'Skip Check: strategy, journey, and product logic'
pptx.subject = 'Executive product strategy. Cover, then pages 1 to 10. Desk research. No interviews.'

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
  slide.background = { color: 'FFFFFF' }

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.58,
    fill: { color: C.forest },
    line: { color: C.forest, width: 0 },
  })
  slide.addText('SKIP CHECK', {
    x: 0.22,
    y: 0.1,
    w: 1.85,
    h: 0.38,
    fontFace: 'Georgia',
    fontSize: 16,
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
    const x = 2.15 + index * 1.82
    slide.addText(tab[0], {
      x,
      y: 0.12,
      w: 1.72,
      h: 0.28,
      fontFace: 'Calibri',
      fontSize: 12,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      margin: 0,
    })
    if (tab[1]) {
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: x + 0.12,
        y: 0.42,
        w: 1.48,
        h: 0.045,
        fill: { color: 'FFFFFF' },
        line: { color: 'FFFFFF', width: 0 },
      })
    }
  })

  const margin = 0.16
  const gap = 0.06
  const width = 13.333 - margin * 2
  const pad = 0.13
  const textW = width - pad * 2
  const top = 0.66
  const limit = 7.42
  const hProblem = 0.82
  const hFeatures = 1.92
  const hMid = 1.22
  const yProblem = top
  const yFeatures = yProblem + hProblem + gap
  const yMid = yFeatures + hFeatures + gap
  const yBottom = yMid + hMid + gap
  const hBottom = limit - yBottom
  const colGap = 0.08
  const colW = (width - colGap) / 2
  const chartW = 4.72
  const buzzW = width - colGap - chartW

  function bodyText(content, x, y, w, h, extra = {}) {
    slide.addText(content, {
      x,
      y,
      w,
      h,
      fontFace: 'Calibri',
      fontSize: 13,
      color: C.ink,
      margin: 0,
      valign: 'top',
      lineSpacing: 16,
      ...extra,
    })
  }

  function sentences(list) {
    return list.map((sentence, index) => ({
      text: sentence,
      options: { breakLine: index < list.length - 1, color: C.ink },
    }))
  }

  function close(run) {
    return { text: run.text, options: { ...run.options, breakLine: true } }
  }

  panel(slide, margin, yProblem, width, hProblem)
  panelTitle(slide, 'THE PROBLEM', margin + pad, yProblem + 0.04, textW)
  bodyText(
    'At a SIP change, a cash need and a market scare meet the same thin confirm, so the person cannot see what the next instalments mean, and Skip Check is built so they can restate the rupee difference, Pause stays available, and they still decide in their own app.',
    margin + pad,
    yProblem + 0.32,
    textW,
    0.46,
  )

  panel(slide, margin, yFeatures, width, hFeatures)
  panelTitle(slide, 'WHAT SKIP CHECK INCLUDES', margin + pad, yFeatures + 0.04, textW)
  bodyText(
    sentences([
      'The need is a reason that changes emphasis only, so the formula stays (current − proposed) × months, in whole rupees, for 1–24 months, and an increase is still rejected.',
      'The need is three equal choices, so Keep, Reduce, and Pause stay side by side, and Pause remains a proposed ₹0.',
      'The need is to try another amount first, so What if sliders and numeric fields update the cards, reset restores the inputs, and above ₹10,00,000 asks for confirmation.',
      'The need is to tell a smaller contribution from a loss, so the difference is less in planned contributions and units generally stay invested unless redeemed separately.',
      'The need is a check the person may skip, so three optional questions can be skipped, or they confirm units, the rupee difference, and that it is not a forecast.',
      'The need is a recap without an email or a message, so it can be saved in that browser only after consent.',
      'The need is an explainer that will not decide or change the SIP, so the bot restates the numbers, and empty contact or booking URLs say a person is not connected.',
    ]),
    margin + pad,
    yFeatures + 0.32,
    textW,
    hFeatures - 0.36,
  )

  panel(slide, margin, yMid, colW, hMid)
  panelTitle(slide, 'JTBD', margin + pad, yMid + 0.04, colW - pad * 2)
  slide.addText('Reconstructed from desk research. This is not an interview.', {
    x: margin + pad,
    y: yMid + 0.3,
    w: colW - pad * 2,
    h: 0.2,
    fontFace: 'Calibri',
    fontSize: 13,
    italic: true,
    color: C.muted,
    align: 'center',
    margin: 0,
  })
  slide.addText(
    'When I am about to change a SIP, I want the next instalments explained in light of my own reason, so I can choose without guessing.',
    {
      x: margin + pad,
      y: yMid + 0.5,
      w: colW - pad * 2,
      h: 0.66,
      fontFace: 'Georgia',
      fontSize: 14,
      color: C.ink,
      align: 'center',
      margin: 0,
      lineSpacing: 18,
    },
  )

  const xRev = margin + colW + colGap
  panel(slide, xRev, yMid, colW, hMid)
  panelTitle(slide, 'REVENUE MODEL', xRev + pad, yMid + 0.04, colW - pad * 2)
  bodyText(
    sentences([
      'The need is that a person will not start a paid conversation before the choice is clear, so Skip Check is free and is built to create more connects for FinLit Ventures.',
      'The need is paid work only after that connect, so the listed range is ₹99 to ₹2,499, this prototype takes no payment, and the lift has not been measured.',
    ]),
    xRev + pad,
    yMid + 0.32,
    colW - pad * 2,
    hMid - 0.38,
  )

  panel(slide, margin, yBottom, buzzW, hBottom)
  panelTitle(slide, 'MARKET BUZZ', margin + pad, yBottom + 0.04, buzzW - pad * 2)
  bodyText(
    [
      plain('The need is rising contributions, not a redemption crisis, so this is not an anti-panic product: '),
      link('August ₹32,297 crore', URLS.amfiAug),
      plain(' (10.02 crore accounts) and '),
      link('July ₹31,961 crore', URLS.amfiJul),
      close(plain(' (9.90 crore accounts, not people).')),
      plain('The need is a count of chosen pauses, so July’s '),
      link('50.30 lakh discontinued or completed SIPs', URLS.etStoppage),
      close(
        plain(
          ' is the wrong size: Economic Times citing AMFI is secondary, and a ceased SIP includes three consecutive failed instalments.',
        ),
      ),
      plain('The need is that public writing mixes scare and cash, so both are explained and Pause stays: '),
      link('Mint', URLS.mint),
      plain(' and '),
      link('Economic Times', URLS.etCorrections),
      close(
        plain(
          ' say a cash shock can justify a pause and a correction is a weak reason, as commentary, not a behaviour count.',
        ),
      ),
      plain(
        'The need is that a stop is still confused with redeeming, so this screen says units generally stay invested: ',
      ),
      link('Kuvera', URLS.kuvera),
      plain(' says a stop is not a withdrawal, and '),
      link('Groww', URLS.groww),
      plain(' says a near-dated debit can still go through.'),
    ],
    margin + pad,
    yBottom + 0.32,
    buzzW - pad * 2,
    hBottom - 0.4,
  )

  const xChart = margin + buzzW + colGap
  panel(slide, xChart, yBottom, chartW, hBottom)
  panelTitle(slide, 'JULY 2026', xChart + pad, yBottom + 0.04, chartW - pad * 2)
  stackedBars(slide, {
    x: xChart + pad,
    y: yBottom + 0.36,
    w: chartW - pad * 2,
    max: 70,
    step: 0.72,
    rows: [
      { label: 'New registrations', value: 61.44, display: '61.44', color: C.forest },
      { label: 'Discontinued or completed', value: 50.3, display: '50.30', color: C.amber },
    ],
  })
  bodyText(
    [
      plain('A ceased SIP includes three consecutive failed instalments. Source: '),
      link('Economic Times, citing AMFI', URLS.etStoppage),
      plain('. Secondary, not re-read from an AMFI workbook.'),
    ],
    xChart + pad,
    yBottom + 1.86,
    chartW - pad * 2,
    hBottom - 1.94,
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
    y: 0.92,
    w: 3.56,
    h: 0.22,
    fontFace: 'Calibri',
    fontSize: 13,
    bold: true,
    color: C.forest,
    margin: 0,
    valign: 'top',
  })
  ;[
    'Public threads show questions people ask. They do not show how common those questions are.',
    'AMFI notes describe industry activity. A discontinued or completed SIP is not a stated reason.',
    'Help articles record a misunderstood rule. They are not a sample of investors.',
    'The live Skip Check flow shows what the page does. It does not show that people find it useful.',
  ].forEach((line, index) => {
    slide.addText(line, {
      x: 0.36,
      y: 1.2 + index * 0.52,
      w: 3.56,
      h: 0.48,
      fontFace: 'Calibri',
      fontSize: 12,
      color: C.ink,
      margin: 0,
      valign: 'top',
    })
  })

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


function slide3Header(slide) {
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
    ['USER EVIDENCE', false],
    ['PERSONA', true],
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

function t(slide, text, x, y, w, h, extra = {}) {
  slide.addText(text, {
    x,
    y,
    w,
    h,
    fontFace: 'Calibri',
    fontSize: 12,
    color: C.ink,
    margin: 0,
    valign: 'top',
    ...extra,
  })
}

function personaCard(slide, spec) {
  const { x, y, w, h, month, monthColor, note, demo, needs, behaviour, pain, outcome } = spec
  card(slide, x, y, w, h)
  const portrait = path.join(root, 'assets', 'ananya-shah-illustration.jpg')
  slide.addImage({
    path: portrait,
    x: x + 0.12,
    y: y + 0.12,
    w: 0.82,
    h: 0.82,
    rounding: true,
  })
  t(slide, 'Ananya Shah', x + 1.06, y + 0.14, 2.12, 0.26, {
    fontFace: 'Georgia',
    fontSize: 15,
    color: C.ink,
  })
  t(slide, month, x + 1.06, y + 0.4, 2.12, 0.2, { bold: true, color: monthColor, fontSize: 12 })
  t(slide, note, x + 1.06, y + 0.62, 2.12, 0.28, { fontSize: 11, color: C.muted })

  t(slide, 'SITUATION', x + 0.14, y + 1.04, 3.0, 0.18, { bold: true, color: C.forest, fontSize: 11 })
  demo.forEach((line, index) => {
    t(slide, line, x + 0.14, y + 1.24 + index * 0.22, 3.0, 0.2, { fontSize: 12 })
  })
  t(slide, 'NEEDS', x + 0.14, y + 1.94, 3.0, 0.18, { bold: true, color: C.forest, fontSize: 11 })
  needs.forEach((line, index) => {
    t(slide, line, x + 0.14, y + 2.14 + index * 0.24, 3.0, 0.22, { fontSize: 12 })
  })

  t(slide, 'BEHAVIOUR', x + 3.28, y + 0.14, 3.08, 0.18, { bold: true, color: C.forest, fontSize: 11 })
  behaviour.forEach((line, index) => {
    t(slide, line, x + 3.28, y + 0.36 + index * 0.48, 3.08, 0.44, { fontSize: 12 })
  })
  t(slide, 'PAIN POINTS', x + 3.28, y + 1.36, 3.08, 0.18, { bold: true, color: C.forest, fontSize: 11 })
  pain.forEach((line, index) => {
    t(slide, line, x + 3.28, y + 1.56 + index * 0.48, 3.08, 0.44, { fontSize: 12 })
  })

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.12,
    y: y + 2.72,
    w: w - 0.24,
    h: 0.38,
    fill: { color: 'E7F0EB' },
    line: { color: 'E7F0EB', width: 0 },
    rectRadius: 0.04,
  })
  t(slide, outcome, x + 0.22, y + 2.78, w - 0.44, 0.26, { fontSize: 12, color: C.forest })
}

function slide3() {
  const slide = pptx.addSlide()
  slide3Header(slide)

  t(slide, 'User personas and expected outcomes.', 0.22, 0.44, 8.0, 0.32, {
    fontFace: 'Georgia',
    fontSize: 20,
    color: C.ink,
  })
  t(slide, 'One teaching case, in two months. Not an interview.', 8.2, 0.48, 4.9, 0.24, {
    fontSize: 12,
    color: C.muted,
    align: 'right',
  })

  card(slide, 0.22, 0.84, 6.22, 1.16)
  t(slide, 'TARGET USER', 0.36, 0.92, 5.94, 0.2, { bold: true, color: C.forest, fontSize: 12 })
  t(
    slide,
    'Salaried investors with a live SIP, about to keep, reduce, or pause, and a goal still years away. The notes illustrate that moment with Ananya Shah, 31, in Pune. She was not interviewed.',
    0.36,
    1.16,
    5.94,
    0.74,
    { fontSize: 13 },
  )

  card(slide, 0.22, 2.1, 6.22, 2.58)
  const outcomeCols = [
    {
      x: 0.36,
      title: 'PRODUCT OUTCOMES',
      color: C.forest,
      lines: [
        'The reason changes emphasis. The formula does not.',
        'Keep, Reduce, and Pause stay equal. Pause is ₹0.',
        'Not a loss. She changes the SIP only in her app.',
      ],
    },
    {
      x: 3.36,
      title: 'BUSINESS OUTCOMES',
      color: C.amber,
      lines: [
        'The check is free, before a paid conversation.',
        'Listed plans run from ₹99 to ₹2,499.',
        'Any enquiry lift is a hypothesis, not a result.',
      ],
    },
  ]
  outcomeCols.forEach((col) => {
    t(slide, col.title, col.x, 2.2, 2.9, 0.2, { bold: true, color: col.color, fontSize: 12 })
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: col.x,
      y: 2.42,
      w: 1.35,
      h: 0.025,
      fill: { color: col.color },
      line: { color: col.color, width: 0 },
    })
    col.lines.forEach((line, index) => {
      t(slide, line, col.x, 2.52 + index * 0.46, 2.9, 0.42, { fontSize: 12 })
    })
  })
  t(
    slide,
    'Explanation, then a restated choice, then a possible enquiry. The last step is a hypothesis.',
    0.36,
    4.16,
    5.94,
    0.4,
    { fontSize: 12, color: C.forest },
  )

  card(slide, 0.22, 4.78, 6.22, 2.58)
  t(slide, 'POTENTIAL IMPACT', 0.36, 4.88, 5.94, 0.2, { bold: true, color: C.forest, fontSize: 12 })
  const impact = [
    ['User value. ', 'She can see the next instalments beside the reason she names. Intended, not observed.'],
    ['Business value. ', 'A free check may build trust before a paid review. No lift is measured. Fewer pauses are not the aim.'],
    ['Validation. ', 'Whether she can restate the difference, and whether a cash month still allows Pause. The informed-choice rate in the notes belongs to an earlier flow. It is not a result here.'],
  ]
  impact.forEach((row, index) => {
    const yy = [5.16, 5.78, 6.48][index]
    const hh = [0.54, 0.62, 0.76][index]
    slide.addText(
      [
        { text: row[0], options: { bold: true, color: C.forest } },
        { text: row[1], options: { color: C.ink } },
      ],
      {
        x: 0.36,
        y: yy,
        w: 5.94,
        h: hh,
        fontFace: 'Calibri',
        fontSize: 12,
        margin: 0,
        valign: 'top',
      },
    )
  })

  personaCard(slide, {
    x: 6.58,
    y: 0.84,
    w: 6.53,
    h: 3.2,
    month: 'Market-worry month',
    monthColor: C.forest,
    note: 'Not a participant.',
    demo: ['31 · Pune · salaried', 'Two equity SIPs, ₹12,000 a month', 'House goal about eight years away'],
    needs: ['See the rupee difference.', 'Keep the three paths equal.'],
    behaviour: [
      'The fund is down. A colleague says to wait for the bottom.',
      'She may then ask a forum. This is not a quote from her.',
    ],
    pain: [
      'The app shows the fall, not the next instalments.',
      'A stop can be read as a withdrawal. It is not.',
    ],
    outcome: 'Intended: restate the difference, then choose. Not measured.',
  })
  personaCard(slide, {
    x: 6.58,
    y: 4.16,
    w: 6.53,
    h: 3.2,
    month: 'Salary delayed',
    monthColor: C.amber,
    note: 'Same person, new month.',
    demo: ['Same age, city, and SIPs', 'Salary late by one to three months', 'The house goal is unchanged'],
    needs: ['See a proposed ₹0 in rupees.', 'Know units generally stay invested.'],
    behaviour: [
      'The trigger is a salary delay, not the index.',
      'Pause is legitimate. She still decides in her app.',
    ],
    pain: [
      'A cash month and a market scare can look the same.',
      'If Pause is hidden, this month fails.',
    ],
    outcome: 'Intended: Pause stays open. Staying invested is not success.',
  })
}


function slide4Header(slide) {
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
    ['USER EVIDENCE', false],
    ['PERSONA', false],
    ['JOURNEY', false],
    ['FRAMING', true],
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

function slide4() {
  const slide = pptx.addSlide()
  slide4Header(slide)

  const left = 0.18
  const colW = 6.46
  const right = 6.74
  const topY = 0.48
  const topH = 2.7
  const botY = 3.28
  const botH = 3.38
  card(slide, left, topY, colW, topH)
  card(slide, right, topY, colW, topH)
  card(slide, left, botY, colW, botH)
  card(slide, right, botY, colW, botH)
  card(slide, left, 6.76, 12.98, 0.64)

  function mark(x, y) {
    slide.addShape(pptx.shapes.RECTANGLE, {
      x,
      y: y + 0.03,
      w: 0.07,
      h: 0.18,
      fill: { color: C.forest },
      line: { color: C.forest, width: 0 },
    })
  }

  mark(0.32, 0.58)
  t(slide, 'WHAT IS THE TRUE PROBLEM?', 0.48, 0.56, 5.96, 0.26, { bold: true, color: C.forest, fontSize: 13 })
  t(
    slide,
    'Investors who already run a SIP may keep, reduce, or pause future instalments for different reasons. A cash need, a market worry, a changed goal, and doubt about the fund are not the same decision.',
    0.32,
    0.9,
    6.16,
    0.62,
    { fontSize: 13 },
  )
  t(
    slide,
    'An investing app can show an amount and a confirm step. That display does not explain the change in light of the person’s own reason.',
    0.32,
    1.56,
    6.16,
    0.48,
    { fontSize: 13 },
  )
  t(
    slide,
    'Skip Check joins the stated reason to the difference in planned contributions: current minus proposed, times the months. The person still decides in their own app.',
    0.32,
    2.1,
    6.16,
    0.9,
    { fontSize: 13 },
  )

  mark(6.88, 0.58)
  t(slide, 'WHO FACES THIS PROBLEM?', 7.04, 0.56, 5.96, 0.26, { bold: true, color: C.forest, fontSize: 13 })
  t(
    slide,
    'Ananya Shah, 31, in Pune, is the one teaching case. She is salaried, with two equity SIPs of ₹12,000 a month and a house goal about eight years away. She was not interviewed.',
    6.88,
    0.9,
    6.16,
    0.62,
    { fontSize: 13 },
  )
  t(slide, 'Market-worry month.', 6.88, 1.58, 6.16, 0.22, { bold: true, fontSize: 13 })
  t(
    slide,
    'The fund is down, and a colleague says to wait for the bottom. She needs the rupee difference, with Keep, Reduce, and Pause left equal.',
    6.88,
    1.82,
    6.16,
    0.46,
    { fontSize: 13 },
  )
  t(slide, 'Salary-delay month. Same person.', 6.88, 2.32, 6.16, 0.22, { bold: true, fontSize: 13, color: C.amber })
  t(
    slide,
    'Her salary is one to three months late. Pause is a legitimate result, and existing units generally stay invested.',
    6.88,
    2.56,
    6.16,
    0.5,
    { fontSize: 13 },
  )

  mark(0.32, 3.4)
  t(slide, 'HOW DO WE KNOW THIS IS REAL?', 0.48, 3.38, 5.96, 0.24, { bold: true, color: C.forest, fontSize: 13 })
  const evidence = [
    {
      y: 3.7,
      h: 0.7,
      runs: [
        plain('Public threads show one use of SIP cash for an education loan, and one question about stopping for a possible correction. Each thread is a single anecdote, not a rate. '),
        link('Loan thread', URLS.redditLoan),
        plain('. '),
        link('Correction thread', URLS.redditFear),
        plain('.'),
      ],
    },
    {
      y: 4.44,
      h: 0.62,
      runs: [
        plain('Help pages record a rule people misunderstand. '),
        link('Kuvera’s help', URLS.kuvera),
        plain(' says a stop is not a withdrawal. '),
        link('Groww’s help', URLS.groww),
        plain(' says a near-dated cancel can still be debited.'),
      ],
    },
    {
      y: 5.1,
      h: 0.7,
      runs: [
        plain('The explanation selected for a test is one confirm path for different reasons. That desk judgement is not a user rating, and the comparison has not been run. July’s 50.30 lakh discontinued or completed SIPs are not voluntary pauses. '),
        link('July count', URLS.etStoppage),
        plain('.'),
      ],
    },
    {
      y: 5.84,
      h: 0.68,
      runs: [
        plain('No interview, usability test, or conversion measurement has been completed. The informed-choice rate in the notes belongs to an earlier flow. It is not a result on the live page.'),
      ],
    },
  ]
  evidence.forEach((item) => {
    slide.addText(item.runs, {
      x: 0.32,
      y: item.y,
      w: 6.16,
      h: item.h,
      fontFace: 'Calibri',
      fontSize: 12,
      color: C.ink,
      margin: 0,
      valign: 'top',
    })
  })

  mark(6.88, 3.4)
  t(slide, 'WHAT VALUE DOES SOLVING IT CREATE?', 7.04, 3.38, 5.96, 0.24, { bold: true, color: C.forest, fontSize: 13 })
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 9.9,
    y: 3.72,
    w: 0.01,
    h: 2.78,
    fill: { color: C.line },
    line: { color: C.line, width: 0 },
  })
  t(slide, 'FOR THE INVESTOR', 6.88, 3.7, 2.9, 0.22, { bold: true, color: C.forest, fontSize: 12 })
  t(slide, 'FOR FINLIT VENTURES', 10.04, 3.7, 2.96, 0.22, { bold: true, color: C.amber, fontSize: 12 })
  const investor = [
    'She can see current minus proposed, times the months. That figure is less in planned contributions, not an investment loss.',
    'The reason changes the emphasis only. Keep, Reduce, and Pause stay equal, and Pause is a proposed ₹0.',
    'Units she already holds generally stay invested. Any change is still made in her own app.',
  ]
  const business = [
    'The check is free, so the choice can be clear before a paid conversation.',
    'Listed plans run from a first session at ₹99 to one year at ₹2,499. This prototype does not take payment.',
    'A path from the free check to a paid plan is a hypothesis. No conversion has been measured.',
  ]
  investor.forEach((line, index) => {
    t(slide, line, 6.88, 4.0 + index * 0.82, 2.9, 0.76, { fontSize: 12 })
  })
  business.forEach((line, index) => {
    t(slide, line, 10.04, 4.0 + index * 0.82, 2.96, 0.76, { fontSize: 12 })
  })

  t(slide, 'WHY LOOK NOW', 0.32, 6.84, 1.7, 0.22, { bold: true, color: C.forest, fontSize: 12 })
  slide.addText(
    [
      plain('Contributions were higher in the '),
      link('August 2026 note', URLS.amfiAug),
      plain(' than in the '),
      link('July note', URLS.amfiJul),
      plain('. This is not framed as a redemption crisis. A test is still timely, because a cash need and a market worry can share one thin confirm, and the free check can be tried before anyone is asked to pay.'),
    ],
    {
      x: 2.05,
      y: 6.84,
      w: 10.9,
      h: 0.48,
      fontFace: 'Calibri',
      fontSize: 12,
      color: C.ink,
      margin: 0,
      valign: 'top',
    },
  )
}

function slide5Header(slide) {
  slide.background = { color: C.paper }
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 0.38,
    fill: { color: C.forest }, line: { color: C.forest, width: 0 },
  })
  slide.addText('SKIP CHECK', {
    x: 0.2, y: 0.04, w: 1.65, h: 0.28,
    fontFace: 'Georgia', fontSize: 13, bold: true, color: 'FFFFFF', margin: 0, valign: 'middle',
  })
  const tabs = [
    ['MARKET LANDSCAPE', false],
    ['USER EVIDENCE', false],
    ['PERSONA', false],
    ['JOURNEY', false],
    ['FRAMING', false],
    ['WHAT TO TEST', false],
  ]
  tabs.forEach((tab, index) => {
    slide.addText(tab[0], {
      x: 2.05 + index * 1.82, y: 0.05, w: 1.74, h: 0.22,
      fontFace: 'Calibri', fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', margin: 0,
    })
  })
}

function slide5() {
  const slide = pptx.addSlide()
  slide5Header(slide)

  const concepts = [
    {
      title: 'BROKER INTERRUPT',
      body: 'The card would sit inside Groww, Coin, Kuvera, or ET Money, between skip and confirm. The platform would supply the amount. FinLit cannot ship this alone, and the partner would own the compliance review. It was not built.',
    },
    {
      title: 'SKIP CHECK',
      body: 'The live page asks for an optional reason and the amounts. It shows current minus proposed, times the months, and keeps Keep, Reduce, and Pause equal. Pause is a proposed ₹0. The person still acts in their own app.',
    },
    {
      title: 'REVIEW AFTER A PAUSE',
      body: 'A review after a pause matches a service FinLit already lists, from ₹99 to ₹2,499. It comes after the confirm, so it misses the moment the notes set out to support. It remains a paid conversation, not this check.',
    },
  ]
  concepts.forEach((item, index) => {
    const y = 0.48 + index * 1.78
    card(slide, 0.18, y, 7.15, 1.68)
    t(slide, item.title, 0.32, y + 0.1, 6.86, 0.22, { bold: true, color: C.forest, fontSize: 13 })
    t(slide, item.body, 0.32, y + 0.38, 6.86, 1.2, { fontSize: 13 })
  })

  card(slide, 7.45, 0.48, 5.7, 5.24)
  t(slide, 'SOLUTION PRIORITISATION', 7.59, 0.56, 5.42, 0.22, { bold: true, color: C.forest, fontSize: 13 })
  t(
    slide,
    'The concept choice used a weighted desk score from 1 to 5. It is not a survey, and it is not RICE.',
    7.59,
    0.82,
    5.42,
    0.4,
    { fontSize: 12 },
  )

  const weights = [
    ['Broker interrupt', 0.2 * 5 + 0.15 * 4 + 0.2 * 5 + 0.1 * 3 + 0.15 * 1 + 0.1 * 4 + 0.1 * 2],
    ['Skip Check', 0.2 * 4 + 0.15 * 4 + 0.2 * 3 + 0.1 * 4 + 0.15 * 5 + 0.1 * 5 + 0.1 * 4],
    ['Review after a pause', 0.2 * 2 + 0.15 * 3 + 0.2 * 1 + 0.1 * 2 + 0.15 * 4 + 0.1 * 4 + 0.1 * 3],
  ]
  t(slide, 'CONCEPT', 7.59, 1.28, 2.5, 0.2, { bold: true, fontSize: 11, color: C.muted })
  t(slide, 'SCORE', 10.15, 1.28, 0.7, 0.2, { bold: true, fontSize: 11, color: C.muted, align: 'right' })
  t(slide, 'READING', 10.95, 1.28, 2.0, 0.2, { bold: true, fontSize: 11, color: C.muted })
  const readings = ['Best moment. Cannot ship.', 'Highest. This is the page.', 'Too late for the confirm.']
  weights.forEach((row, index) => {
    const y = 1.52 + index * 0.36
    const score = (Math.round(row[1] * 100) / 100).toFixed(2)
    if (index === 1) {
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 7.55, y: y - 0.04, w: 5.5, h: 0.32,
        fill: { color: 'E7F0EB' }, line: { color: 'E7F0EB', width: 0 }, rectRadius: 0.03,
      })
    }
    t(slide, row[0], 7.59, y, 2.5, 0.24, { fontSize: 12, bold: index === 1 })
    t(slide, score, 10.15, y, 0.7, 0.24, { fontSize: 12, bold: true, align: 'right' })
    t(slide, readings[index], 10.95, y, 2.0, 0.24, { fontSize: 12 })
  })
  t(
    slide,
    'Weights: value 20, evidence 15, moment 20, differentiation 10, feasibility 15, explainability 10, trust 10.',
    7.59,
    2.64,
    5.42,
    0.4,
    { fontSize: 11, color: C.muted },
  )

  t(slide, 'RICE INSIDE SKIP CHECK', 7.59, 3.1, 5.42, 0.2, { bold: true, color: C.forest, fontSize: 12 })
  t(slide, 'Score = (Reach × Impact × Confidence) ÷ Effort. Reach of 200 is an assumption.', 7.59, 3.32, 5.42, 0.36, { fontSize: 11 })
  const riceHeads = [
    [7.59, 1.7, 'ITEM'],
    [9.35, 0.42, 'R'],
    [9.8, 0.38, 'I'],
    [10.2, 0.48, 'C'],
    [10.7, 0.4, 'E'],
    [11.15, 0.85, 'SCORE'],
  ]
  riceHeads.forEach((col) => {
    t(slide, col[2], col[0], 3.72, col[1], 0.18, { bold: true, fontSize: 11, color: C.muted, align: col[2] === 'ITEM' ? 'left' : 'right' })
  })
  const rice = [
    ['Reason and three choices', 200, 2, 0.7, 2],
    ['Rupee line and units', 200, 2, 0.8, 1],
    ['Restatement check', 200, 1, 0.6, 1],
  ]
  rice.forEach((row, index) => {
    const y = 3.94 + index * 0.32
    const score = (row[1] * row[2] * row[3]) / row[4]
    const cells = [row[0], String(row[1]), String(row[2]), String(row[3]), String(row[4]), String(Math.round(score))]
    riceHeads.forEach((col, i) => {
      t(slide, cells[i], col[0], y, col[1], 0.28, {
        fontSize: 12,
        align: i === 0 ? 'left' : 'right',
        bold: i === 5,
      })
    })
  })
  t(
    slide,
    'Impact here is a desk weight on an informed choice, not a measured lift. Effort is person-weeks for a small prototype. A restart month is scored in the notes and is not on the live page.',
    7.59,
    4.92,
    5.42,
    0.68,
    { fontSize: 11, color: C.muted },
  )

  card(slide, 0.18, 5.82, 12.97, 1.56)
  t(slide, 'MVP: THE LIVE SKIP CHECK PAGE', 0.32, 5.9, 8.2, 0.22, { bold: true, color: C.forest, fontSize: 13 })
  t(slide, 'FOR THE INVESTOR', 0.32, 6.18, 6.1, 0.18, { bold: true, fontSize: 12, color: C.forest })
  t(slide, 'FOR FINLIT VENTURES', 6.7, 6.18, 6.1, 0.18, { bold: true, fontSize: 12, color: C.amber })
  t(
    slide,
    'She can restate the rupee difference, keep all three paths open, and leave existing units invested unless she redeems them separately.',
    0.32,
    6.4,
    6.15,
    0.5,
    { fontSize: 12 },
  )
  t(
    slide,
    'The check is free. Listed plans run from ₹99 to ₹2,499. Whether a visitor then buys a plan has not been measured.',
    6.7,
    6.4,
    6.2,
    0.5,
    { fontSize: 12 },
  )
  t(
    slide,
    'Explain the implications. Preserve the choice. Do not execute the SIP change. FinLit states it is not registered with SEBI or AMFI.',
    0.32,
    6.96,
    12.6,
    0.3,
    { fontSize: 12, color: C.forest },
  )
}

function journeyBar(slide, active) {
  slide.background = { color: C.paper }
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 0.38,
    fill: { color: C.forest }, line: { color: C.forest, width: 0 },
  })
  slide.addText('SKIP CHECK', {
    x: 0.16, y: 0.05, w: 1.55, h: 0.26,
    fontFace: 'Georgia', fontSize: 13, bold: true, color: 'FFFFFF', margin: 0, valign: 'middle',
  })
  const tabs = [
    ['WIREFRAMES', 1.85, 1.5, 'wire'],
    ['DESKTOP MVP USER JOURNEY', 3.4, 3.55, 'wire'],
    ['METRICS & PRODUCT LOGIC', 8.7, 4.4, 'metrics'],
  ]
  tabs.forEach((tab) => {
    const on = tab[3] === active
    slide.addText(tab[0], {
      x: tab[1], y: 0.05, w: tab[2], h: 0.24,
      fontFace: 'Calibri', fontSize: 12, bold: true,
      color: on ? 'FFFFFF' : 'C5D5CC',
      margin: 0, valign: 'middle',
    })
    if (on) {
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: tab[1], y: 0.31, w: Math.min(tab[2], 2.4), h: 0.035,
        fill: { color: 'FFFFFF' }, line: { color: 'FFFFFF', width: 0 },
      })
    }
  })
}

function stepCircle(slide, n, x, y) {
  slide.addShape(pptx.shapes.OVAL, {
    x, y, w: 0.3, h: 0.3,
    fill: { color: C.card },
    line: { color: C.forest, width: 1.5 },
  })
  slide.addText(String(n), {
    x, y, w: 0.3, h: 0.3,
    fontFace: 'Calibri', fontSize: 13, bold: true, color: C.forest,
    align: 'center', valign: 'middle', margin: 0,
  })
}

function hArrow(slide, x1, x2, y) {
  slide.addShape(pptx.shapes.LINE, {
    x: x1, y, w: x2 - x1, h: 0,
    line: { color: C.forest, width: 1.25, endArrowType: 'triangle' },
  })
}

function frameShot(slide, file, iw, ih, x, y, boxW, boxH) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w: boxW, h: boxH,
    fill: { color: C.card },
    line: { color: C.line, width: 1 },
    rectRadius: 0.06,
  })
  const aspect = iw / ih
  let w = boxW - 0.08
  let h = w / aspect
  if (h > boxH - 0.08) {
    h = boxH - 0.08
    w = h * aspect
  }
  slide.addImage({
    path: file,
    x: x + (boxW - w) / 2,
    y: y + (boxH - h) / 2,
    w, h,
  })
}

function cover() {
  const slide = pptx.addSlide()
  slide.addImage({
    path: path.join(root, 'assets', 'cover-page.png'),
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
  })
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 7.78,
    y: 5.42,
    w: 3.4,
    h: 0.64,
    fill: { color: '1E4D3A', transparency: 100 },
    line: { color: '1E4D3A', transparency: 100, width: 0 },
    rectRadius: 0.32,
    hyperlink: { url: 'https://skip-check-demo.vercel.app/', tooltip: 'Watch the product demo' },
  })
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 10.5,
    y: 6.88,
    w: 2.7,
    h: 0.32,
    fill: { color: 'FFFFFF', transparency: 100 },
    line: { color: 'FFFFFF', transparency: 100, width: 0 },
    hyperlink: { url: 'https://skip-check-demo.vercel.app/', tooltip: 'Watch the product demo' },
  })
}

function slide6() {
  const slide = pptx.addSlide()
  journeyBar(slide, 'wire')
  t(slide, 'THE MVP', 0.16, 0.44, 0.85, 0.22, {
    fontSize: 12, bold: true, color: '1A4F8B', underline: true,
    hyperlink: { url: 'https://skip-check.vercel.app/', tooltip: 'Open the live Skip Check page' },
  })
  t(slide, 'Skip Check · FinLit Ventures · Annotated interaction flow', 1.08, 0.44, 6.2, 0.22, {
    fontSize: 12, color: C.muted,
  })
  t(slide, 'Product principle: Skip Check informs. The user decides.', 7.5, 0.44, 5.66, 0.22, {
    fontSize: 12, bold: true, color: C.forest, align: 'right',
  })

  const shot = path.join(root, 'assets', 'mvp', 'slide')
  const cols = [0.16, 4.56, 8.96]
  const colW = 4.22
  const frames = [
    ['01-welcome.png', 1272, 792],
    ['02-reason.png', 1272, 1460],
    ['03-amounts.png', 1272, 1340],
    ['04-cards.png', 2216, 666],
    ['05-meaning.png', 1272, 554],
    ['06-recap.png', 1272, 964],
  ]
  const notes = [
    'The user opens Skip Check before changing a SIP in their own app. The page says that no change is made.',
    'The user can record a reason or skip it. The reason is context, and it does not change the calculation.',
    'The user enters ₹12,000, ₹3,500, and 6 months. Illustrative: (₹12,000 − ₹3,500) × 6 = ₹51,000.',
    'Keep, Reduce, and Pause are on one screen. Over 6 months the plans are ₹72,000, ₹21,000, and ₹0. Reduce is ₹51,000 less, and Pause is ₹72,000 less.',
    '₹51,000 is less in planned contributions, not a loss or a forecast. Existing units stay invested unless the user redeems them.',
    'The user reviews the recap, then decides in their own app. Skip Check does not execute, pause, or cancel the SIP.',
  ]

  frames.forEach((item, index) => {
    const row = index < 3 ? 0 : 1
    const col = index % 3
    const x = cols[col]
    const circleY = row === 0 ? 0.72 : 4.18
    const imageY = row === 0 ? 1.08 : 4.54
    const imageH = row === 0 ? 2.22 : 1.7
    const noteY = row === 0 ? 3.36 : 6.3
    const noteH = row === 0 ? 0.72 : 0.64
    stepCircle(slide, index + 1, x, circleY)
    frameShot(slide, path.join(shot, item[0]), item[1], item[2], x, imageY, colW, imageH)
    t(slide, notes[index], x, noteY, colW, noteH, { fontSize: 12 })
  })

  hArrow(slide, cols[0] + 0.34, cols[1] - 0.04, 0.87)
  hArrow(slide, cols[1] + 0.34, cols[2] - 0.04, 0.87)
  hArrow(slide, cols[0] + 0.34, cols[1] - 0.04, 4.33)
  hArrow(slide, cols[1] + 0.34, cols[2] - 0.04, 4.33)

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 8.96, y: 7.02, w: 4.22, h: 0.3,
    fill: { color: C.forest }, line: { color: C.forest, width: 0 }, rectRadius: 0.05,
  })
  t(slide, 'The user decides in their own app', 9.06, 7.05, 4.02, 0.24, {
    fontSize: 12, bold: true, color: 'FFFFFF', align: 'center',
  })
}

function slide7() {
  const slide = pptx.addSlide()
  journeyBar(slide, 'metrics')
  t(slide, 'Skip Check · Calculation model · Success criteria · Validation gates', 0.16, 0.44, 12.9, 0.22, {
    fontSize: 12, color: C.muted,
  })

  card(slide, 0.14, 0.72, 7.05, 3.16)
  t(slide, 'CALCULATION ENGINE', 0.28, 0.8, 4.2, 0.22, { bold: true, color: C.forest, fontSize: 13 })
  t(slide, 'Contribution difference = (Current monthly SIP − Proposed monthly SIP) × Months', 0.28, 1.04, 4.35, 0.44, { fontSize: 12 })

  const rows = [
    ['Current monthly SIP', '₹12,000'],
    ['Proposed monthly SIP', '₹3,500'],
    ['Duration', '6 months'],
    ['Current-plan contributions', '₹72,000'],
    ['Proposed-plan contributions', '₹21,000'],
    ['Difference', '₹51,000'],
  ]
  rows.forEach((row, index) => {
    const y = 1.52 + index * 0.24
    t(slide, row[0], 0.28, y, 2.7, 0.22, { fontSize: 12 })
    t(slide, row[1], 2.95, y, 1.65, 0.22, { fontSize: 12, bold: true, align: 'right' })
  })
  t(slide, 'Worked example, labeled illustrative. ₹12,000 × 6 = ₹72,000. ₹3,500 × 6 = ₹21,000. ₹72,000 − ₹21,000 = ₹51,000.', 0.28, 2.98, 4.35, 0.48, { fontSize: 12 })
  t(slide, 'A pause differs by ₹72,000. The figure compares planned contributions, not a portfolio forecast.', 0.28, 3.4, 4.35, 0.42, { fontSize: 12 })

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.78, y: 0.92, w: 2.22, h: 2.72,
    fill: { color: 'E7F0EB' }, line: { color: 'E7F0EB', width: 0 }, rectRadius: 0.08,
  })
  t(slide, '₹51,000', 4.9, 1.04, 1.98, 0.48, { fontFace: 'Georgia', fontSize: 26, bold: true, color: C.forest, align: 'center' })
  t(slide, 'LESS IN PLANNED CONTRIBUTIONS OVER 6 MONTHS', 4.94, 1.54, 1.9, 0.7, { fontSize: 12, bold: true, color: C.forest, align: 'center' })
  t(slide, 'Pause', 4.94, 2.32, 1.9, 0.22, { fontSize: 12, align: 'center', color: C.muted })
  t(slide, '₹72,000', 4.9, 2.54, 1.98, 0.4, { fontFace: 'Georgia', fontSize: 22, bold: true, color: C.ink, align: 'center' })
  t(slide, 'less over 6 months', 4.94, 2.96, 1.9, 0.4, { fontSize: 12, align: 'center' })

  card(slide, 7.32, 0.72, 5.86, 3.16)
  t(slide, 'OPTION COMPARISON', 7.46, 0.8, 5.55, 0.22, { bold: true, color: C.forest, fontSize: 13 })
  const heads = [
    [7.46, 2.35, 'Dimension'],
    [9.84, 1.02, 'Keep'],
    [10.88, 1.08, 'Reduce'],
    [11.98, 1.02, 'Pause'],
  ]
  heads.forEach((col) => {
    t(slide, col[2], col[0], 1.08, col[1], 0.22, { bold: true, fontSize: 12, color: C.muted })
  })
  const matrix = [
    ['Monthly amount', '₹12,000', '₹3,500', '₹0'],
    ['Contributions, 6 months', '₹72,000', '₹21,000', '₹0'],
    ['Difference versus plan', '₹0', '₹51,000', '₹72,000'],
    ['Units redeemed here', 'No', 'No', 'No'],
    ['SIP action executed here', 'No', 'No', 'No'],
  ]
  matrix.forEach((row, index) => {
    const y = 1.34 + index * 0.34
    if (index % 2 === 0) {
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: 7.42, y: y - 0.04, w: 5.66, h: 0.32,
        fill: { color: 'F7F3EC' }, line: { color: 'F7F3EC', width: 0 },
      })
    }
    heads.forEach((col, i) => {
      t(slide, row[i], col[0], y, col[1], 0.26, {
        fontSize: 12,
        bold: i > 0,
        color: row[i] === 'No' ? C.forest : C.ink,
      })
    })
  })
  t(slide, 'Keep, Reduce, and Pause are equally valid. Skip Check explains the numbers and does not recommend an action.', 7.46, 3.08, 5.55, 0.66, { fontSize: 12 })

  card(slide, 0.14, 4.0, 7.05, 3.16)
  t(slide, 'INFORMED CHOICE RATE', 0.28, 4.08, 6.7, 0.22, { bold: true, color: C.forest, fontSize: 13 })
  t(slide, 'Proposed metric, not measured on the live page. It is the share of valid-comparison sessions that finish every comprehension step.', 0.28, 4.3, 6.75, 0.4, { fontSize: 12 })
  t(slide, 'Informed Choice Rate = (Sessions that finish every required step ÷ Sessions that reach a valid comparison) × 100', 0.28, 4.72, 6.75, 0.4, { fontSize: 12 })
  const must = [
    '1. Reach a valid comparison card.',
    '2. Record a reason, or explicitly skip it.',
    '3. View the contribution-difference explanation.',
    '4. Record Keep, Reduce, or Pause.',
    '5. Restate the difference, and see that existing units are not redeemed.',
  ]
  must.forEach((line, index) => {
    t(slide, line, 0.28, 5.16 + index * 0.2, 6.75, 0.2, { fontSize: 12 })
  })
  t(slide, 'Valid comparison  →  See the difference  →  Record a choice  →  Restate it', 0.28, 6.2, 6.75, 0.24, {
    fontSize: 12, bold: true, color: C.forest,
  })
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.28, y: 6.48, w: 6.75, h: 0.5,
    fill: { color: 'E7F0EB' }, line: { color: C.forest, width: 1, dashType: 'dash' }, rectRadius: 0.05,
  })
  t(slide, 'Illustrative, not observed: 35 qualifying sessions ÷ 50 valid comparisons = 70%.', 0.4, 6.52, 6.5, 0.22, { fontSize: 12, bold: true })
  t(slide, 'Keep, Reduce, and Pause stay neutral. Continuing a SIP is not the success definition.', 0.4, 6.72, 6.5, 0.22, { fontSize: 12 })

  card(slide, 7.32, 4.0, 5.86, 3.16)
  t(slide, 'VALIDATION GATES', 7.46, 4.08, 5.55, 0.2, { bold: true, color: C.forest, fontSize: 13 })
  t(slide, 'Proposed criteria. These tests have not been run.', 7.46, 4.28, 5.55, 0.2, { fontSize: 12, color: C.muted })
  const gates = [
    ['Usability', 'Plan for 8 to 10 people, with a cash need and a market worry. At least 7 of 10 should restate the difference and the units line.', 4.5, 0.4],
    ['Distribution', 'If fewer than 10 of the first 50 non-staff sessions are about to change a SIP, revisit positioning. This is not retention.', 5.1, 0.4],
    ['Calculation', 'Whole rupees, for 1 to 24 months. Reject a blank, invalid, zero, or negative current amount, and any proposed amount above it. Pause is ₹0. Above ₹10,00,000, confirm the digits.', 5.7, 0.62],
    ['Trust', 'No recommendation and no SIP change. Units stay invested unless the user redeems them elsewhere.', 6.52, 0.42],
  ]
  gates.forEach((gate) => {
    t(slide, gate[0], 7.46, gate[2], 5.55, 0.18, { bold: true, fontSize: 12, color: C.forest })
    t(slide, gate[1], 7.46, gate[2] + 0.18, 5.55, gate[3], { fontSize: 12 })
  })

  t(slide, 'Proposed gates, not completed tests. FinLit states it is not registered with SEBI or AMFI, and a written compliance review is required before a live pilot.', 0.16, 7.24, 13.0, 0.22, { fontSize: 12, color: C.muted })
}

function slide8() {
  const slide = pptx.addSlide()
  journeyBar(slide, 'metrics')
  t(slide, 'Success Metrics, KPI Hierarchy & Guardrails', 0.18, 0.42, 9.3, 0.28, {
    fontFace: 'Georgia', fontSize: 20, bold: true,
  })
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.18, y: 0.765, w: 6.5, h: 0.018,
    fill: { color: C.forest }, line: { color: C.forest, width: 0 },
  })
  t(slide, 'Measure informed decisions, comprehension, and safe usage — not just clicks or continued SIP contributions.', 0.18, 0.80, 12.95, 0.2, {
    fontSize: 12, color: C.muted,
  })

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.16, y: 1.00, w: 9.18, h: 1.06,
    fill: { color: C.card },
    line: { color: C.forest, width: 1.25, dashType: 'dash' },
    rectRadius: 0.06,
  })
  t(slide, 'North Star Metric — Informed Choice Rate (ICR)', 0.30, 1.06, 6.4, 0.2, {
    bold: true, color: C.forest, fontSize: 13,
  })
  t(slide, 'ICR = (Eligible sessions that finish the checks) ÷ (Eligible sessions with a valid comparison card) × 100.', 0.30, 1.28, 6.48, 0.2, {
    fontSize: 11,
  })
  t(slide, 'Record Keep, Reduce, or Pause, restate the difference, and see that a pause does not sell existing units. The three paths count the same. Proposed for the pilot, not a measured result.', 0.30, 1.50, 6.48, 0.46, {
    fontSize: 11,
  })
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.90, y: 1.14, w: 2.28, h: 0.76,
    fill: { color: 'E7F0EB' }, line: { color: 'E7F0EB', width: 0 }, rectRadius: 0.06,
  })
  t(slide, '≥70%', 7.00, 1.20, 2.08, 0.38, {
    fontFace: 'Georgia', fontSize: 22, bold: true, color: C.forest, align: 'center',
  })
  t(slide, 'Proposed pilot threshold', 7.00, 1.58, 2.08, 0.22, {
    fontSize: 11, bold: true, color: C.forest, align: 'center',
  })

  card(slide, 9.48, 1.00, 3.70, 2.32)
  t(slide, 'Leading Indicators — Early Signals', 9.60, 1.08, 3.46, 0.2, {
    bold: true, color: C.forest, fontSize: 12,
  })
  t(slide, 'No historical rates. These are signals to watch.', 9.60, 1.28, 3.46, 0.18, {
    fontSize: 11, color: C.muted,
  })
  const leading = [
    'Entry intent: an unconfirmed SIP change.',
    'Flow start: visitors who begin the flow.',
    'Comparison reach: a valid numerical card.',
    'Restatement: users who attempt the check.',
    'Pause findability: a cash need can locate it.',
    'Input recovery: users fix a validation error.',
  ]
  leading.forEach((line, index) => {
    t(slide, line, 9.60, 1.50 + index * 0.28, 3.46, 0.24, { fontSize: 11 })
  })

  const kpiX = [0.22, 1.20, 2.84, 6.16, 7.66]
  const kpiW = [0.94, 1.60, 3.28, 1.46, 1.66]
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.18, y: 2.14, w: 9.16, h: 0.24,
    fill: { color: C.forest }, line: { color: C.forest, width: 0 },
  })
  ;['Level', 'Metric', 'Definition', 'Proposed target', 'Why it matters'].forEach((label, index) => {
    t(slide, label, kpiX[index], 2.16, kpiW[index], 0.2, {
      fontSize: 11, bold: true, color: 'FFFFFF', valign: 'middle',
    })
  })
  const kpis = [
    ['L0 Outcome', 'Informed Choice Rate', 'Eligible sessions finishing the checks ÷ valid cards.', '≥70%', 'Options understood.'],
    ['L1 Behaviour', 'Comparison completion', 'Valid cards ÷ sessions that start the flow.', '≥65%', 'Friction before the card.'],
    ['L1 Behaviour', 'Amount restatement', 'Users who restate the difference in a usability test.', '≥80% usability', 'Figure is understood.'],
    ['L1 Behaviour', 'Pause for a cash need', 'Cash-need users who reach Pause unaided.', '≥90% usability', 'Cash need finds Pause.'],
    ['L1 Product', 'Decision recap', 'Users who finish the recap after a comparison.', '≥60%', 'Recap may add friction.'],
    ['L2 Diagnostic', 'Invalid-input recovery', 'Fix a bad amount, then reach a valid card.', 'Baseline first', 'Set a baseline first.'],
    ['L2 Diagnostic', 'Decision-path mix', 'Keep, Reduce, and Pause shares. No target mix.', 'No mix target', 'Do not steer one path.'],
    ['L2 Diagnostic', 'Pre-confirm relevance', 'Considering a SIP change, not yet confirmed.', '≥20% hypothesis', 'The intended moment.'],
  ]
  kpis.forEach((row, index) => {
    const y = 2.38 + index * 0.26
    if (index % 2 === 0) {
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.18, y, w: 9.16, h: 0.26,
        fill: { color: 'F7F3EC' }, line: { color: 'F7F3EC', width: 0 },
      })
    }
    row.forEach((value, i) => {
      t(slide, value, kpiX[i], y + 0.03, kpiW[i], 0.2, {
        fontSize: 11,
        bold: i === 1 || i === 3,
        color: i === 3 ? C.forest : C.ink,
        valign: 'middle',
      })
    })
  })

  t(slide, 'Guardrail Metrics — Must Not Degrade While Optimizing ICR', 0.18, 4.50, 9.16, 0.2, {
    bold: true, color: C.forest, fontSize: 12,
  })
  const gX = [0.22, 2.16, 5.06]
  const gW = [1.90, 2.86, 4.24]
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.18, y: 4.72, w: 9.16, h: 0.22,
    fill: { color: 'E7F0EB' }, line: { color: 'E7F0EB', width: 0 },
  })
  ;['Guardrail', 'Proposed threshold', 'Why it matters'].forEach((label, index) => {
    t(slide, label, gX[index], 4.73, gW[index], 0.2, {
      fontSize: 11, bold: true, color: C.forest, valign: 'middle',
    })
  })
  const guards = [
    ['Misread as a loss', '0 critical cases in final testing.', 'Lower contributions are not money already lost.'],
    ['Existing units', 'At least 9 of 10 understand it.', 'A pause does not sell units already held.'],
    ['Pressure to one path', '0 pressuring defaults, copy, or hierarchy.', 'Do not push Keep, Reduce, or Pause.'],
    ['Cash-need blockage', '0 critical failures to locate Pause.', 'A cash need must still reach Pause.'],
    ['Calculation integrity', '100% match with the formula in tests.', 'One wrong figure can undermine trust.'],
    ['Privacy of amounts', '0 unauthorized sends of amounts.', 'Typed amounts stay in the browser.'],
    ['Advice boundary', '0 unreviewed advice or execution claims.', 'No fund tip, forecast, or SIP execution.'],
  ]
  guards.forEach((row, index) => {
    const y = 4.94 + index * 0.26
    if (index % 2 === 1) {
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.18, y, w: 9.16, h: 0.26,
        fill: { color: 'F7F3EC' }, line: { color: 'F7F3EC', width: 0 },
      })
    }
    row.forEach((value, i) => {
      t(slide, value, gX[i], y + 0.03, gW[i], 0.2, {
        fontSize: 11,
        bold: i === 0 || i === 1,
        color: i === 1 ? C.forest : C.ink,
        valign: 'middle',
      })
    })
  })

  card(slide, 9.48, 3.42, 3.70, 3.58)
  t(slide, 'Downstream Signals — Validate Carefully', 9.60, 3.50, 3.46, 0.36, {
    bold: true, color: C.forest, fontSize: 12,
  })
  const downstream = [
    'Clarity before the comparison, and after it.',
    'Can the user explain Reduce versus Pause.',
    'Confidence in the numbers, not the market.',
    'Later usefulness, after their own app.',
    'Themes: cash need, worry, goals, uncertainty.',
  ]
  downstream.forEach((line, index) => {
    t(slide, line, 9.60, 3.90 + index * 0.26, 3.46, 0.24, { fontSize: 11 })
  })
  t(slide, 'A continued SIP, fewer pauses, or a higher amount is not success.', 9.60, 5.22, 3.46, 0.40, {
    fontSize: 11, bold: true,
  })
  t(slide, 'Pilot sequence: 8–10 moderated sessions, automated calculation tests, then a written compliance review. Instrument only disclosed events, set a baseline, and report the denominator, sample, time, and segment. Formative only, not proof of demand.', 9.60, 5.66, 3.46, 1.16, {
    fontSize: 11, color: C.muted,
  })

  t(slide, 'All targets are proposed pilot thresholds, not measured results. The 8–10 person study is formative, not proof of demand. FinLit states it is not registered with SEBI or AMFI.', 0.18, 7.16, 13.0, 0.26, {
    fontSize: 11, color: C.muted,
  })
}

const LINK = '1A4F8B'

function frame(slide, x, y, w, h) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.card },
    line: { color: C.ink, width: 1.15 },
  })
}

function chip(slide, x, y, w, h, label) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: 'F4F8F5' },
    line: { color: C.forest, width: 1 },
    rectRadius: 0.04,
  })
  t(slide, label, x + 0.04, y, w - 0.08, h, {
    fontSize: 10, bold: true, align: 'center', valign: 'middle',
  })
}

function slide9() {
  const slide = pptx.addSlide()
  slide.background = { color: C.paper }
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 0.42,
    fill: { color: C.forest }, line: { color: C.forest, width: 0 },
  })
  t(slide, 'SYSTEM DESIGN, USER JOURNEY & GTM', 0.16, 0.06, 8.4, 0.3, {
    fontFace: 'Georgia', fontSize: 16, bold: true, color: 'FFFFFF', valign: 'middle',
  })
  t(slide, 'METRICS & RISKS', 9.3, 0.08, 3.8, 0.26, {
    fontSize: 13, bold: true, color: 'FFFFFF', align: 'right', underline: true, valign: 'middle',
    hyperlink: { slide: 9, tooltip: 'Success metrics and guardrails' },
  })

  frame(slide, 0.1, 0.52, 8.22, 3.58)
  frame(slide, 8.42, 0.52, 4.8, 3.58)
  frame(slide, 0.1, 4.2, 8.22, 3.18)
  frame(slide, 8.42, 4.2, 4.8, 3.18)

  t(slide, 'HIGH LEVEL SYSTEM DESIGN (SKIP CHECK DESKTOP MVP)', 0.22, 0.58, 6.2, 0.22, {
    fontSize: 11, bold: true, color: C.forest,
  })
  t(slide, 'DETAILED DESIGN →', 6.5, 0.58, 1.7, 0.22, {
    fontSize: 11, bold: true, color: LINK, align: 'right', underline: true,
    hyperlink: { slide: 11, tooltip: 'Detailed system design' },
  })

  t(slide, 'Interface', 0.2, 0.9, 0.7, 0.32, { fontSize: 10, bold: true, color: C.forest, valign: 'middle' })
  const ui = [
    [0.92, 'Landing'],
    [2.28, 'Intent'],
    [3.64, 'Reason'],
    [5.0, 'Amounts'],
  ]
  ui.forEach((item, index) => {
    chip(slide, item[0], 0.88, 1.2, 0.36, item[1])
    if (index < ui.length - 1) hArrow(slide, item[0] + 1.22, ui[index + 1][0] - 0.02, 1.06)
  })
  t(slide, 'I’m just exploring opens a sample. That path is not a qualified decision.', 0.92, 1.26, 5.4, 0.16, {
    fontSize: 10, color: C.muted,
  })

  t(slide, 'Calculation', 0.2, 1.5, 0.7, 0.36, { fontSize: 10, bold: true, color: C.forest, valign: 'middle' })
  const calc = [
    [0.92, 1.28, 'Validation'],
    [2.4, 1.55, 'Difference'],
    [4.15, 1.7, 'Keep, Reduce, Pause'],
  ]
  calc.forEach((item, index) => {
    chip(slide, item[0], 1.48, item[1], 0.4, item[2])
    if (index < calc.length - 1) hArrow(slide, item[0] + item[1] + 0.02, calc[index + 1][0] - 0.02, 1.68)
  })
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.05, y: 1.46, w: 2.12, h: 0.46,
    fill: { color: 'E7F0EB' }, line: { color: 'E7F0EB', width: 0 }, rectRadius: 0.04,
  })
  t(slide, '₹51,000', 6.1, 1.46, 2.02, 0.22, {
    fontFace: 'Georgia', fontSize: 14, bold: true, color: C.forest, align: 'center',
  })
  t(slide, 'less in planned contributions', 6.1, 1.66, 2.02, 0.22, {
    fontSize: 9, color: C.forest, align: 'center',
  })

  t(slide, 'Support', 0.2, 2.08, 0.7, 0.32, { fontSize: 10, bold: true, color: C.forest, valign: 'middle' })
  const support = [
    [0.92, 1.7, 'Units stay invested'],
    [2.82, 1.45, 'Bot, if opened'],
    [4.47, 1.55, 'Recap in browser'],
  ]
  support.forEach((item, index) => {
    chip(slide, item[0], 2.04, item[1], 0.36, item[2])
    if (index < support.length - 1) hArrow(slide, item[0] + item[1] + 0.02, support[index + 1][0] - 0.02, 2.22)
  })
  t(slide, '(₹12,000 − ₹3,500) × 6 = ₹51,000', 6.15, 2.04, 2.02, 0.18, { fontSize: 10, bold: true })
  t(slide, 'Not a loss or a forecast.', 6.15, 2.22, 2.02, 0.16, { fontSize: 10 })

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.22, y: 2.5, w: 7.96, h: 0.4,
    fill: { color: C.card },
    line: { color: C.forest, width: 1.15, dashType: 'dash' },
    rectRadius: 0.04,
  })
  t(slide, 'Outside Skip Check. The user finishes any SIP change in their own investing app.', 0.34, 2.52, 7.72, 0.18, {
    fontSize: 10, bold: true, align: 'center',
  })
  t(slide, 'No connection to Groww, Coin, Kuvera, ET Money, or any other platform.', 0.34, 2.7, 7.72, 0.16, {
    fontSize: 10, color: C.muted, align: 'center',
  })

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.22, y: 2.98, w: 7.96, h: 0.26,
    fill: { color: C.forest }, line: { color: C.forest, width: 0 },
  })
  t(slide, 'NO SIP EXECUTION  ·  NO BROKER INTEGRATION  ·  NO AUTOMATIC PAUSE OR RESTART', 0.3, 3.0, 7.8, 0.22, {
    fontSize: 10, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle',
  })
  t(slide, 'Amounts stay in this browser and are not sent to analytics. A recap is saved only with consent. The bot, if opened, sends the calculated context to Skip Check’s own explanation API.', 0.22, 3.28, 7.96, 0.36, {
    fontSize: 10,
  })

  t(slide, 'CUSTOMER SIDE USER JOURNEY', 0.22, 4.26, 5.6, 0.22, {
    fontSize: 11, bold: true, color: C.forest,
  })
  t(slide, 'DETAILED JOURNEY →', 6.4, 4.26, 1.8, 0.22, {
    fontSize: 11, bold: true, color: LINK, align: 'right', underline: true,
    hyperlink: { slide: 7, tooltip: 'Desktop wireframes and annotated journey' },
  })

  const steps = ['Arrive', 'Intent', 'Reason', 'Inputs', 'Compare', 'Clarity', 'Recap', 'Own app']
  steps.forEach((label, index) => {
    const x = 0.24 + index * 1.0
    if (index === 1) {
      slide.addShape(pptx.shapes.DIAMOND, {
        x: x + 0.28, y: 4.54, w: 0.36, h: 0.36,
        fill: { color: 'E7F0EB' }, line: { color: C.forest, width: 1.15 },
      })
    } else {
      slide.addShape(pptx.shapes.OVAL, {
        x: x + 0.32, y: 4.56, w: 0.32, h: 0.32,
        fill: { color: C.card }, line: { color: C.forest, width: 1.25 },
      })
    }
    t(slide, String(index + 1), x + 0.28, 4.56, 0.36, 0.32, {
      fontSize: 11, bold: true, color: C.forest, align: 'center', valign: 'middle',
    })
    t(slide, label, x, 4.92, 0.96, 0.18, { fontSize: 10, align: 'center' })
    if (index < steps.length - 1) hArrow(slide, x + 0.68, x + 1.26, 4.72)
  })

  const notes = [
    '1  Arrival. No investing-app integration is assumed.',
    '2  Explore my options, or I’m just exploring. A sample is not qualified.',
    '3  Reason is optional and can be skipped. It does not change the formula.',
    '4  Current, proposed, and 1–24 months. Invalid input stops before a card.',
    '5  Keep, Reduce, and Pause. The three choices stay equal.',
    '6  The figure is not a loss or a forecast. Units stay unless redeemed elsewhere.',
    '7  The recap restates the figure. Saving it needs consent.',
    '8  The user decides in their own app. Skip Check does not act.',
  ]
  notes.forEach((line, index) => {
    const col = index < 4 ? 0 : 1
    const row = index % 4
    t(slide, line, 0.24 + col * 4.02, 5.16 + row * 0.32, 3.92, 0.3, { fontSize: 10 })
  })

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.22, y: 6.48, w: 7.96, h: 0.8,
    fill: { color: 'E7F0EB' }, line: { color: 'E7F0EB', width: 0 },
  })
  t(slide, 'Proposed definitions, not measured. Keep, Reduce, and Pause stay equal.', 0.32, 6.52, 7.76, 0.16, {
    fontSize: 10, bold: true, color: C.forest,
  })
  t(slide, 'Qualified intent: unconfirmed SIP-change sessions ÷ eligible non-staff sessions.', 0.32, 6.68, 7.76, 0.16, { fontSize: 10 })
  t(slide, 'Valid comparison: valid cards ÷ decision-flow starts. Informed Choice Rate: choice plus the comprehension checks ÷ valid comparison cards.', 0.32, 6.84, 7.76, 0.32, { fontSize: 10 })

  t(slide, 'GO-TO-MARKET STRATEGY', 8.54, 0.58, 4.56, 0.2, {
    fontSize: 12, bold: true, color: C.forest,
  })
  const gtm = [
    ['A separate desktop page. It cannot sit inside the investing app.', 0.28, { fontSize: 10 }],
    ['PRE-LAUNCH · WEEKS 1–2 · Proposed tests', 0.18, { fontSize: 10, bold: true, color: C.forest }],
    ['8–10 sessions: a cash need and a market worry.', 0.16, { fontSize: 10 }],
    ['Watch whether a pause is read as selling units.', 0.16, { fontSize: 10 }],
    ['Proposed CTA: Compare my SIP options. The check stays free.', 0.16, { fontSize: 10 }],
    ['Exit: 7 of 10 explain the figure and the units line.', 0.16, { fontSize: 10 }],
    ['A cash need finds Pause. Written review before a public link.', 0.18, { fontSize: 10 }],
    ['PILOT · WEEKS 3–6 · Proposed rule', 0.18, { fontSize: 10, bold: true, color: C.forest }],
    ['Search: plain pages on reduce versus pause, then the check.', 0.16, { fontSize: 10 }],
    ['Communities, where allowed. No fear and no fund tip.', 0.16, { fontSize: 10 }],
    ['Workplace: opt-in only. Employers do not see amounts.', 0.16, { fontSize: 10 }],
    ['Gate: under 10 of the first 50 non-staff sessions, revisit it.', 0.18, { fontSize: 10 }],
    ['SCALE · WEEKS 7–12 · Only with evidence', 0.18, { fontSize: 10, bold: true, color: C.forest }],
    ['Compare intent, completion, and Informed Choice Rate by source.', 0.16, { fontSize: 10 }],
    ['Fix repeated input errors and confusion about units.', 0.16, { fontSize: 10 }],
    ['Scale after comprehension, one relevant channel, and the reviews.', 0.16, { fontSize: 10 }],
  ]
  let gtmY = 0.8
  gtm.forEach((row) => {
    t(slide, row[0], 8.54, gtmY, 4.56, row[1], row[2])
    gtmY += row[1]
  })
  if (gtmY > 4.02) throw new Error(`GTM text ends at ${gtmY.toFixed(2)}`)

  t(slide, 'REVENUE MODEL', 8.54, 4.28, 4.56, 0.2, {
    fontSize: 12, bold: true, color: C.forest,
  })
  t(slide, '1  Free calculator — current', 8.54, 4.5, 4.56, 0.16, { fontSize: 10, bold: true })
  t(slide, 'Keep, Reduce, and Pause stay free, so the check is usable at the decision moment. The aim is relevance, trust, and comprehension.', 8.54, 4.66, 4.56, 0.36, { fontSize: 10 })
  t(slide, 'CURRENT PRODUCT POSITIONING', 8.54, 5.02, 4.56, 0.16, { fontSize: 10, bold: true, color: C.forest })

  t(slide, '2  Optional FinLit review — hypothesis', 8.54, 5.24, 4.56, 0.16, { fontSize: 10, bold: true })
  t(slide, 'Listed at ₹99. This prototype does not take payment or book the review. Define the service before offering it. It is not regulated advice.', 8.54, 5.4, 4.56, 0.36, { fontSize: 10 })
  t(slide, '₹99 LISTED PRICE · DEMAND NOT YET VALIDATED', 8.54, 5.78, 4.56, 0.16, { fontSize: 10, bold: true, color: C.amber })

  t(slide, '3  Distribution partnerships — future', 8.54, 6.0, 4.56, 0.16, { fontSize: 10, bold: true })
  t(slide, 'Transparent sponsorships only. Do not sell inputs or decision records. Commercial terms must not change how the three choices are shown.', 8.54, 6.16, 4.56, 0.36, { fontSize: 10 })
  t(slide, 'FUTURE OPTION · SUBJECT TO VALIDATION', 8.54, 6.54, 4.56, 0.16, { fontSize: 10, bold: true, color: C.amber })

  t(slide, 'VALIDATE TRUST AND DISTRIBUTION BEFORE MONETIZATION.', 8.54, 6.82, 4.56, 0.36, {
    fontSize: 11, bold: true, color: C.forest,
  })
}

function slide10() {
  const slide = pptx.addSlide()
  journeyBar(slide, 'metrics')
  t(slide, 'Detailed system design', 0.16, 0.46, 8.2, 0.28, {
    fontFace: 'Georgia', fontSize: 22, bold: true,
  })
  t(slide, 'The live desktop page. Proposed work is labeled on the previous slide.', 0.16, 0.76, 9.2, 0.2, {
    fontSize: 12, color: C.muted,
  })
  t(slide, '← OVERVIEW', 10.4, 0.74, 2.7, 0.22, {
    fontSize: 12, bold: true, color: LINK, align: 'right', underline: true,
    hyperlink: { slide: 10, tooltip: 'System design, journey, and go-to-market' },
  })

  card(slide, 0.14, 1.06, 4.28, 4.28)
  t(slide, 'INTERFACE — LIVE', 0.28, 1.14, 4.0, 0.22, { fontSize: 13, bold: true, color: C.forest })
  const iface = [
    'Explore my options starts a decision session.',
    'I’m just exploring opens a sample at ₹12,000, ₹6,000, and 6 months. The page says it is not the user’s SIP.',
    'Reason is optional. Skip this is on the page. The reason does not change the formula.',
    'Then the current amount, the proposed amount, and 1 to 24 months.',
    'Above ₹10,00,000, the page asks the user to confirm the digits.',
    'Keep, Reduce, and Pause are shown together.',
    'Clarity questions are optional. The recap follows.',
  ]
  iface.forEach((line, index) => {
    const h = index === 1 ? 0.48 : 0.36
    const y = 1.42 + iface.slice(0, index).reduce((sum, _, i) => sum + (i === 1 ? 0.48 : 0.36), 0)
    t(slide, line, 0.28, y, 4.0, h, { fontSize: 12 })
  })

  card(slide, 4.54, 1.06, 4.28, 4.28)
  t(slide, 'CALCULATION — IN THE BROWSER', 4.68, 1.14, 4.0, 0.22, { fontSize: 13, bold: true, color: C.forest })
  const calcLines = [
    ['(Current − proposed) × months, in whole rupees.', 0.4],
    ['Illustrative: (₹12,000 − ₹3,500) × 6 = ₹51,000.', 0.4],
    ['That is less in planned contributions over 6 months. It is not a loss or a forecast.', 0.48],
    ['Pause uses ₹0. On this example a pause differs by ₹72,000.', 0.4],
    ['A blank, invalid, zero, or negative current amount is rejected. An increase is rejected.', 0.48],
    ['There is no separate calculation service.', 0.32],
  ]
  let calcY = 1.44
  calcLines.forEach((line) => {
    t(slide, line[0], 4.68, calcY, 4.0, line[1], { fontSize: 12 })
    calcY += line[1]
  })

  card(slide, 8.94, 1.06, 4.24, 4.28)
  t(slide, 'TRUST AND THE OUTSIDE', 9.08, 1.14, 3.96, 0.22, { fontSize: 13, bold: true, color: C.forest })
  const trust = [
    ['Typed amounts stay in the browser. Page events do not include those amounts.', 0.48],
    ['A recap is stored here only after the user agrees, and the user can delete it.', 0.48],
    ['SIP Check Bot is optional. If opened, the calculated context goes to Skip Check’s own explanation API. The bot explains. It does not choose or change the SIP.', 0.72],
    ['FinLit states it is not registered with SEBI or AMFI. A written compliance review has not been completed.', 0.52],
    ['An optional review is listed at ₹99. This prototype does not take payment or book it.', 0.48],
  ]
  let trustY = 1.42
  trust.forEach((line) => {
    t(slide, line[0], 9.08, trustY, 3.96, line[1], { fontSize: 12 })
    trustY += line[1]
  })

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.14, y: 5.48, w: 13.04, h: 0.7,
    fill: { color: C.card },
    line: { color: C.forest, width: 1.25, dashType: 'dash' },
    rectRadius: 0.05,
  })
  t(slide, 'USER COMPLETES ANY SIP CHANGE SEPARATELY IN THEIR OWN INVESTING APP', 0.28, 5.54, 12.76, 0.24, {
    fontSize: 13, bold: true, align: 'center',
  })
  t(slide, 'No API to Groww, Coin, Kuvera, ET Money, or any other investing platform.', 0.28, 5.8, 12.76, 0.24, {
    fontSize: 12, color: C.muted, align: 'center',
  })

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.14, y: 6.32, w: 13.04, h: 0.42,
    fill: { color: C.forest }, line: { color: C.forest, width: 0 }, rectRadius: 0.05,
  })
  t(slide, 'NO SIP EXECUTION  ·  NO BROKER INTEGRATION  ·  NO AUTOMATIC PAUSE OR RESTART', 0.28, 6.38, 12.76, 0.3, {
    fontSize: 14, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle',
  })
  t(slide, 'Go-to-market weeks, channel gates, and partnership ideas on the previous slide are proposals. They are not signed and they are not measured.', 0.16, 6.86, 13.0, 0.36, {
    fontSize: 12, color: C.muted,
  })
}

const fiveOnly = process.argv.includes('--five')

if (!fiveOnly) cover()
slide1()
slide2()
slide3()
slide4()
slide5()
if (!fiveOnly) {
  slide6()
  slide7()
  slide8()
  slide9()
  slide10()
}

const expected = fiveOnly ? 5 : 11
if (pptx.slides.length !== expected) {
  throw new Error(`Expected ${expected} slides, got ${pptx.slides.length}`)
}

await mkdir(outDir, { recursive: true })
const pptxPath = path.join(outDir, fiveOnly ? 'finlit-skip-check-pages-1-5.pptx' : 'finlit-skip-check-strategy.pptx')
await pptx.writeFile({ fileName: pptxPath })
console.log(pptxPath)
