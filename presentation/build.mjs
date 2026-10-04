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
  const { x, y, w, rows, max } = spec
  const valueW = 0.78
  const trackW = w - valueW
  rows.forEach((row, index) => {
    const yy = y + index * 0.95
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

function slide1() {
  const slide = slideBase('Business context', 1)
  headline(slide, 'SIP contributions are still rising, and the published stoppage count is not a count of voluntary pauses.')
  body(
    slide,
    [
      link('AMFI’s August 2026 monthly note', URLS.amfiAug),
      plain(
        ' reports SIP contributions of ₹32,297 crore and 10.02 crore contributing accounts. Those are accounts, not people, and one investor often holds more than one SIP.',
      ),
    ],
    { x: 0.4, y: 1.48, w: 7.15, h: 0.88 },
  )
  body(
    slide,
    [
      link('The July 2026 note', URLS.amfiJul),
      plain(
        ' reports ₹31,961 crore and 9.90 crore contributing accounts. The bars compare that month’s new registrations with SIPs that were discontinued or whose tenure was completed.',
      ),
    ],
    { x: 0.4, y: 2.4, w: 7.15, h: 0.88 },
  )
  body(
    slide,
    [
      link('Economic Times, citing AMFI,', URLS.etStoppage),
      plain(
        ' puts new registrations at 61.44 lakh and discontinued or tenure-completed SIPs at 50.30 lakh. The ratio is 81.87 percent. This deck did not re-read those two counts from an AMFI spreadsheet. A ceased SIP, under AMFI’s rule, includes three consecutive failed instalments, so a failed debit sits in the same count as a finished plan and a chosen pause.',
      ),
    ],
    { x: 0.4, y: 3.32, w: 7.15, h: 1.48 },
  )
  body(
    slide,
    [
      plain('FinLit, founded publicly in 2026 by Nishant Jain, offers Skip Check free. '),
      link('skip-check.vercel.app', URLS.prototype),
      plain(
        ' opens the prototype; that is not usage. ₹99 is listed and unpaid: no payment, and no booking. The footer says FinLit is not registered with SEBI or AMFI. Discretionary wording on the same site is a compliance tension, not a feature.',
      ),
    ],
    { x: 0.4, y: 4.58, w: 7.15, h: 1.05 },
  )
  body(
    slide,
    [
      plain(
        'The job was reconstructed from this desk research, not locked in an interview. When someone is about to change a SIP, they want the next instalments explained in light of their own reason, so they can choose without guessing. The actors are that person, their own app, and FinLit. Skip Check does not change the SIP.',
      ),
    ],
    { x: 0.4, y: 5.72, w: 7.15, h: 1.15 },
  )

  card(slide, 7.75, 1.48, 5.15, 5.48)
  slide.addText('July 2026 SIP activity, in lakh', {
    x: 7.95,
    y: 1.64,
    w: 4.75,
    h: 0.32,
    fontFace: 'Georgia',
    fontSize: 16,
    color: C.ink,
    margin: 0,
  })
  slide.addText('Bar length follows the count. The shorter bar is not a count of investors who chose to pause.', {
    x: 7.95,
    y: 2.0,
    w: 4.75,
    h: 0.58,
    fontFace: 'Calibri',
    fontSize: 14,
    color: C.muted,
    margin: 0,
  })
  stackedBars(slide, {
    x: 7.95,
    y: 2.68,
    w: 4.75,
    max: 70,
    rows: [
      { label: 'New registrations', value: 61.44, display: '61.44', color: C.forest },
      { label: 'Discontinued or completed', value: 50.3, display: '50.30', color: C.amber },
    ],
  })
  slide.addText(
    [
      plain('Source: '),
      link('Economic Times, citing AMFI', URLS.etStoppage),
      plain('. This is a secondary source. The contribution totals are in the '),
      link('August note', URLS.amfiAug),
      plain(' and the '),
      link('July note', URLS.amfiJul),
      plain('. The scale runs from 0 to 70 lakh, and each number sits beside its bar.'),
    ],
    {
      x: 7.95,
      y: 4.7,
      w: 4.75,
      h: 1.9,
      fontFace: 'Calibri',
      fontSize: 14,
      color: C.ink,
      margin: 0,
    },
  )
}

function slide2() {
  const slide = slideBase('User evidence', 2)
  headline(slide, 'The evidence is public writing. No investor has been interviewed for this product.')
  body(
    slide,
    [
      plain(
        'Three threads, each read as evidence, then an interpretation, then an implication. The interpretation is a hypothesis. Nothing here is a quotation or a sample of Indian investors.',
      ),
    ],
    { x: 0.4, y: 1.46, w: 12.52, h: 0.5 },
  )

  const cards = [
    {
      title: 'A scare, not a measured trend',
      body: 'A poster asked whether to stop SIPs because of a possible market correction. Replies in that thread split among continuing, shifting from small-cap toward large-cap, and parking money to re-enter later. This supports a hypothesis that a scare and a plan can be mixed together. It does not say how often that happens.',
      linkLabel: 'reddit.com/r/MutualfundsIndia',
      url: URLS.redditFear,
    },
    {
      title: 'A loan, not a crash',
      body: 'A poster wanted to stop the next month’s SIPs and redirect the cash toward an education loan. Replies included reducing rather than stopping, and not selling units already bought. This supports a hypothesis that a cash need can be a sound reason to change a SIP.',
      linkLabel: 'reddit.com/r/personalfinanceindia',
      url: URLS.redditLoan,
    },
    {
      title: 'Cash during a drawdown',
      body: 'A poster described a large drawdown and a two-month SIP pause caused by a cash crunch. The thread treats cash as the first constraint. This supports a hypothesis that Pause has to stay available. It is still one anecdote.',
      linkLabel: 'reddit.com/r/IndianStockMarket',
      url: URLS.redditDrawdown,
    },
  ]
  cards.forEach((item, index) => {
    const x = 0.4 + index * 4.22
    card(slide, x, 2.04, 4.06, 2.78)
    slide.addText(item.title, {
      x: x + 0.16,
      y: 2.14,
      w: 3.74,
      h: 0.32,
      fontFace: 'Georgia',
      fontSize: 15,
      color: C.ink,
      margin: 0,
    })
    slide.addText(item.body, {
      x: x + 0.16,
      y: 2.48,
      w: 3.74,
      h: 1.7,
      fontFace: 'Calibri',
      fontSize: 13,
      color: C.ink,
      margin: 0,
    })
    slide.addText([link(item.linkLabel, item.url)], {
      x: x + 0.16,
      y: 4.28,
      w: 3.74,
      h: 0.38,
      fontFace: 'Calibri',
      fontSize: 13,
      margin: 0,
    })
  })

  const notes = [
    [
      plain('Evidence. '),
      link('Kuvera’s help', URLS.kuvera),
      plain(
        ', modified 19 April 2022, says stopping a SIP does not return the money. Interpretation, a hypothesis: a stop is easy to confuse with a withdrawal. Implication: say that existing units stay invested.',
      ),
    ],
    [
      plain('Evidence. '),
      link('Groww’s help', URLS.groww),
      plain(
        ' says a cancel may not stop a near-dated debit. Interpretation, a hypothesis: the timing rule is easy to miss. Implication: this prototype does not invent a cutoff.',
      ),
    ],
    [
      plain('Evidence. '),
      link('Mint, in 2026,', URLS.mint),
      plain(' and an '),
      link('Economic Times commentary', URLS.etCorrections),
      plain(
        ' split a cash-flow shock from a correction. Interpretation: commentary, not behaviour. Implication: a cash pause can be legitimate.',
      ),
    ],
  ]
  notes.forEach((runs, index) => {
    body(slide, runs, { x: 0.4, y: 4.96 + index * 0.7, w: 12.52, h: 0.66, fontSize: 13 })
  })
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
