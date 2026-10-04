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
