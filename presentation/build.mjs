/**
 * FinLit Ventures — Skip Check executive strategy deck.
 * Six slides, 16:9. No wireframes.
 *
 *   node build.mjs
 *   soffice --headless --norestore --convert-to pdf --outdir out out/finlit-skip-check-strategy.pptx
 */
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import PptxGenJS from 'pptxgenjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, 'out/finlit-skip-check-strategy.pptx')

const W = 13.333
const H = 7.5
const M = 0.42
const CW = W - M * 2

const PAPER = 'F6F1E8'
const INK = '1C1917'
const FOREST = '1E4D3A'
const CARD = 'FFFDF8'
const LINE = 'E4DCD0'
const AMBER = '8A5A2B'
const MUTED = '44403C'
const SERIF = 'Georgia'
const SANS = 'Calibri'

const pres = new PptxGenJS()
pres.defineLayout({ name: 'SKIP_16x9', width: W, height: H })
pres.layout = 'SKIP_16x9'
pres.author = 'FinLit Ventures'
pres.title = 'Skip Check — Executive strategy'
pres.subject = 'Six-page strategy. Desk research through 2 Oct 2026. No wireframes.'
pres.theme = { headFontFace: SERIF, bodyFontFace: SANS }

function text(slide, content, opts) {
  slide.addText(content, {
    fontFace: SANS,
    color: INK,
    fontSize: 13,
    align: 'left',
    valign: 'top',
    wrap: true,
    margin: 0,
    ...opts,
    margin: 0,
  })
}

function card(slide, x, y, w, h, fill = CARD) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x,
    y,
    w,
    h,
    fill: { color: fill },
    line: { color: LINE, width: 1 },
    rectRadius: 0.05,
  })
}

function rule(slide, x, y, w, color = LINE) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x,
    y,
    w,
    h: 0.012,
    fill: { color },
    line: { color },
  })
}

function chrome(slide, num, section) {
  slide.background = { color: PAPER }
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: W,
    h: 0.06,
    fill: { color: FOREST },
    line: { color: FOREST },
  })
  text(
    slide,
    [
      { text: num, options: { fontFace: SERIF, fontSize: 13, color: FOREST } },
      {
        text: `    ${section}`,
        options: { fontFace: SANS, fontSize: 11, color: MUTED, charSpacing: 1.1 },
      },
    ],
    { x: M, y: 0.16, w: 8, h: 0.26 },
  )
}

function footer(slide, page, source) {
  rule(slide, M, 7.06, CW)
  text(slide, source, {
    x: M,
    y: 7.12,
    w: CW - 0.7,
    h: 0.28,
    fontSize: 10,
    color: MUTED,
  })
  text(slide, page, {
    x: W - M - 0.55,
    y: 7.12,
    w: 0.55,
    h: 0.28,
    fontFace: SERIF,
    fontSize: 12,
    color: FOREST,
    align: 'right',
  })
}

function headline(slide, line1, line2) {
  text(slide, line2 ? `${line1}\n${line2}` : line1, {
    x: M,
    y: 0.44,
    w: CW,
    h: line2 ? 0.86 : 0.46,
    fontFace: SERIF,
    fontSize: 24,
    color: INK,
  })
  return line2 ? 1.4 : 1.0
}

function slide1() {
  const s = pres.addSlide()
  chrome(s, '01', 'BUSINESS CONTEXT')
  const y0 = headline(
    s,
    'Contributions are still rising.',
    'The published stoppage count is not a count of voluntary pauses.',
  )

  const statY = y0 + 0.06
  const statH = 1.72
  const gap = 0.12
  const wA = 3.55
  const wB = 3.55
  const wC = CW - wA - wB - gap * 2
  const stats = [
    {
      x: M,
      w: wA,
      kicker: 'STILL RISING',
      figure: '₹32,297 crore',
      label: 'August 2026 SIP contribution',
      note: 'July 2026 was ₹31,961 crore. AMFI monthly notes. Industry total, not FinLit revenue.',
    },
    {
      x: M + wA + gap,
      w: wB,
      kicker: 'ACCOUNTS, NOT PEOPLE',
      figure: '10.02 crore',
      label: 'Contributing SIP accounts',
      note: 'August 2026. July was 9.90 crore. One person often holds several accounts.',
    },
    {
      x: M + wA + wB + gap * 2,
      w: wC,
      kicker: 'NOT A VOLUNTARY COUNT',
      figure: '81.87%',
      label: 'July 2026 discontinued or tenure-completed, versus new',
      note: '50.30 lakh against 61.44 lakh new. Economic Times citing AMFI, secondary. Three failed instalments count as ceased. Not a researched pause.',
    },
  ]
  for (const item of stats) {
    card(s, item.x, statY, item.w, statH)
    text(s, item.kicker, {
      x: item.x + 0.16,
      y: statY + 0.12,
      w: item.w - 0.32,
      h: 0.2,
      fontSize: 10,
      color: AMBER,
      charSpacing: 0.8,
    })
    text(s, item.figure, {
      x: item.x + 0.16,
      y: statY + 0.34,
      w: item.w - 0.32,
      h: 0.36,
      fontFace: SANS,
      fontSize: 22,
      color: FOREST,
    })
    text(s, item.label, {
      x: item.x + 0.16,
      y: statY + 0.72,
      w: item.w - 0.32,
      h: 0.36,
      fontSize: 12,
      color: INK,
    })
    text(s, item.note, {
      x: item.x + 0.16,
      y: statY + 1.08,
      w: item.w - 0.32,
      h: 0.52,
      fontSize: 11,
      color: MUTED,
    })
  }

  const bodyY = statY + statH + 0.14
  const bodyH = 7.0 - bodyY
  const colW = (CW - gap) / 2

  card(s, M, bodyY, colW, bodyH)
  text(s, 'Where FinLit stands', {
    x: M + 0.18,
    y: bodyY + 0.12,
    w: colW - 0.36,
    h: 0.28,
    fontFace: SERIF,
    fontSize: 16,
    color: FOREST,
  })
  text(
    s,
    [
      {
        text: 'A research and planning site, founded publicly in 2026 by Nishant Jain. The footer says FinLit is not registered with SEBI or AMFI. Discretionary-management wording on the same site is a compliance tension, not a feature.',
        options: { breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: 'Skip Check is free. skip-check.vercel.app is the deployed prototype, rechecked 4 Oct 2026. That names the build. It is not usage evidence. The product does not change the SIP.',
        options: { breakLine: true, paraSpaceAfter: 8 },
      },
      {
        text: '₹99 is the published list price for an optional review. Site list prices run ₹99–₹2,499. The prototype does not take payment and does not book a review. Connect opens only if a contact or booking URL is set. Otherwise the panel says a person is not connected. Conversion is unknown.',
        options: {},
      },
    ],
    { x: M + 0.18, y: bodyY + 0.44, w: colW - 0.36, h: bodyH - 0.56, fontSize: 12 },
  )

  const rx = M + colW + gap
  card(s, rx, bodyY, colW, bodyH)
  text(s, 'Initial job, and who is in the room', {
    x: rx + 0.18,
    y: bodyY + 0.12,
    w: colW - 0.36,
    h: 0.28,
    fontFace: SERIF,
    fontSize: 16,
    color: FOREST,
  })
  text(s, 'RECONSTRUCTED FROM RESEARCH/06. NOT A LOCKED SENTENCE. NOT AN INTERVIEW.', {
    x: rx + 0.18,
    y: bodyY + 0.42,
    w: colW - 0.36,
    h: 0.2,
    fontSize: 10,
    color: AMBER,
  })
  text(
    s,
    'When I am about to change a SIP, I want the next instalments explained in light of my own reason, so I can choose without guessing.',
    {
      x: rx + 0.18,
      y: bodyY + 0.64,
      w: colW - 0.36,
      h: 0.7,
      fontFace: SERIF,
      fontSize: 14,
      color: INK,
    },
  )
  const actors = [
    ['Person', 'Has a live SIP and is about to keep, reduce, or pause.'],
    ['Their app', 'Where any change is actually made. Skip Check does not execute it.'],
    ['FinLit', 'Explains the arithmetic. Not registered with SEBI or AMFI.'],
    ['Evidence', 'Public sources only. No interviews. No measured usage.'],
  ]
  actors.forEach((pair, i) => {
    const ay = bodyY + 1.42 + i * 0.36
    text(s, pair[0], {
      x: rx + 0.18,
      y: ay,
      w: 1.15,
      h: 0.32,
      fontSize: 12,
      color: FOREST,
    })
    text(s, pair[1], {
      x: rx + 1.35,
      y: ay,
      w: colW - 1.7,
      h: 0.32,
      fontSize: 12,
      color: INK,
    })
  })

  footer(
    s,
    '01',
    'AMFI monthly notes, July and August 2026. Ratio: Economic Times citing AMFI, secondary. finlitventures.com footer, 2 Oct 2026.',
  )
}

function slide2() {
  const s = pres.addSlide()
  chrome(s, '02', 'EVIDENCE')
  const y0 = headline(s, 'Desk research and public threads.', 'Nobody has been interviewed.')
  text(s, 'Three single anecdotes, paraphrased. Not quotes, not usernames, not a prevalence.', {
    x: M,
    y: y0 - 0.02,
    w: CW,
    h: 0.26,
    fontSize: 13,
    color: MUTED,
  })

  const anecdotes = [
    [
      '01   r/MutualfundsIndia',
      'A poster asks whether to stop SIPs from fear of a market correction. Replies disagree, including advice to continue.',
    ],
    [
      '02   r/personalfinanceindia',
      'A poster wants next month’s SIP cash for an education loan. Replies favour reducing rather than stopping, and not selling units.',
    ],
    [
      '03   r/IndianStockMarket',
      'A poster paused SIPs for two months because of a cash crunch during a drawdown. Pause was the cash response.',
    ],
  ]
  let y = y0 + 0.3
  anecdotes.forEach((row) => {
    text(s, row[0], { x: M, y, w: 3.3, h: 0.48, fontSize: 13, color: FOREST })
    text(s, row[1], { x: M + 3.4, y, w: CW - 3.4, h: 0.48, fontSize: 13, color: INK })
    y += 0.5
    rule(s, M, y - 0.06, CW)
  })

  text(s, 'EVIDENCE', { x: M, y: y + 0.06, w: 3.7, h: 0.22, fontSize: 10, color: AMBER, charSpacing: 0.8 })
  text(s, 'INTERPRETATION', {
    x: M + 3.85,
    y: y + 0.06,
    w: 4.2,
    h: 0.22,
    fontSize: 10,
    color: AMBER,
    charSpacing: 0.8,
  })
  text(s, 'IMPLICATION', {
    x: M + 8.15,
    y: y + 0.06,
    w: 4.2,
    h: 0.22,
    fontSize: 10,
    color: AMBER,
    charSpacing: 0.8,
  })

  const insights = [
    {
      tag: 'H4  ·  MEAN 2.8',
      e: 'July contribution ₹31,961 crore; August ₹32,297 crore. July stoppage ratio 81.87%.',
      i: 'The published count mixes finished tenures and failed debits. High confidence as a measurement warning. Not a claim that pauses are rare.',
      m: 'Do not size Skip Check as 50 lakh panics a month. The voluntary share is unknown.',
    },
    {
      tag: 'H1 3.7  ·  H2 4.3',
      e: 'Threads ask about stopping for a correction, for a loan, and after a cash crunch in a drawdown.',
      i: 'Hypothesis. Fear is a mechanism, not a measured rate. Cash and fear can share one thin confirm. H2 is the selected hypothesis.',
      m: 'Explain both. Pause stays legitimate. “Never stop” is already free advice on those threads.',
    },
    {
      tag: 'HELP CENTRES',
      e: 'Kuvera help, modified 19 Apr 2022: stopping a SIP is not a withdrawal. Groww help: a cancel may not stop a near-dated debit.',
      i: 'Hypothesis. The consequence of the tap is easy to misread. These articles exist because people ask.',
      m: 'Say existing units stay invested. The difference is not an investment loss. Do not invent a cutoff.',
    },
  ]
  y += 0.32
  const rowH = 1.02
  const col = [3.7, 4.15, CW - 3.7 - 4.15 - 0.16]
  insights.forEach((item) => {
    card(s, M, y, col[0], rowH)
    card(s, M + col[0] + 0.08, y, col[1], rowH)
    card(s, M + col[0] + col[1] + 0.16, y, col[2], rowH)
    text(s, item.tag, { x: M + 0.12, y: y + 0.08, w: col[0] - 0.24, h: 0.2, fontSize: 10, color: FOREST })
    text(s, item.e, { x: M + 0.12, y: y + 0.3, w: col[0] - 0.24, h: 0.64, fontSize: 12 })
    text(s, item.i, {
      x: M + col[0] + 0.2,
      y: y + 0.1,
      w: col[1] - 0.28,
      h: rowH - 0.2,
      fontSize: 12,
    })
    text(s, item.m, {
      x: M + col[0] + col[1] + 0.28,
      y: y + 0.1,
      w: col[2] - 0.28,
      h: rowH - 0.2,
      fontSize: 12,
    })
    y += rowH + 0.08
  })

  footer(
    s,
    '02',
    'Thread and help URLs in the claim ledger. Mint 2026 and ET: commentary, not behaviour. research/05 and research/08.',
  )
}

function slide3() {
  const s = pres.addSlide()
  chrome(s, '03', 'PERSONA')
  const y0 = headline(s, 'One illustrative person, two situations.', 'Ananya has not been interviewed.')

  card(s, M, y0, CW, 0.78)
  text(s, 'Ananya Shah    ·    31    ·    Pune    ·    Salaried', {
    x: M + 0.18,
    y: y0 + 0.1,
    w: CW - 0.36,
    h: 0.28,
    fontFace: SERIF,
    fontSize: 16,
    color: INK,
  })
  text(
    s,
    'Two equity SIPs totaling ₹12,000 a month. House goal in about eight years. A teaching case. The trigger language is anchored to public threads, not to her words. There is no second named person.',
    { x: M + 0.18, y: y0 + 0.4, w: CW - 0.36, h: 0.3, fontSize: 13, color: MUTED },
  )

  const sitY = y0 + 0.9
  const sitH = 1.28
  const gap = 0.12
  const sitW = (CW - gap) / 2
  const sits = [
    {
      kicker: 'SITUATION 1    ·    MARKET-WORRY MONTH',
      body: 'The fund is down. A colleague says to wait for the bottom. That scene is taken from public threads, not from an interview with her.',
    },
    {
      kicker: 'SITUATION 2    ·    SAME PERSON, SALARY DELAYED',
      body: 'Pay is late by one to three months. This is a secondary branch, not another persona. Pause is a legitimate outcome. Success is not continuation.',
    },
  ]
  sits.forEach((item, i) => {
    const x = M + i * (sitW + gap)
    card(s, x, sitY, sitW, sitH)
    text(s, item.kicker, {
      x: x + 0.16,
      y: sitY + 0.12,
      w: sitW - 0.32,
      h: 0.22,
      fontSize: 11,
      color: AMBER,
    })
    text(s, item.body, {
      x: x + 0.16,
      y: sitY + 0.4,
      w: sitW - 0.32,
      h: 0.74,
      fontSize: 14,
    })
  })

  const tableY = sitY + sitH + 0.12
  text(s, 'INTENDED OUTCOMES. NONE OF THESE ARE MEASURED RESULTS.', {
    x: M,
    y: tableY,
    w: CW,
    h: 0.2,
    fontSize: 10,
    color: AMBER,
    charSpacing: 0.6,
  })

  const headers = ['', 'Immediate', 'Behavioural', 'Trust', 'Business']
  const rows = [
    [
      'Market worry',
      'The contribution difference is visible, and it is not a loss.',
      'Restate the rupee line and the units line, then choose.',
      'The worry is not judged. Pause stays available.',
      'A session about understanding, not a continued SIP.',
    ],
    [
      'Salary delay',
      'Pause is an equal choice. The proposed amount is ₹0.',
      'She can pause without hunting for the control.',
      'No pressure to continue. This is also the falsifier.',
      'An optional unpaid ₹99 review, only if she asks.',
    ],
  ]
  const colW = [1.7, 2.75, 2.75, 2.7, CW - 1.7 - 2.75 - 2.75 - 2.7]
  const headY = tableY + 0.24
  const headH = 0.32
  const rowH = 0.78
  let x = M
  headers.forEach((label, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x,
      y: headY,
      w: colW[i],
      h: headH,
      fill: { color: FOREST },
      line: { color: FOREST },
    })
    if (label) {
      text(s, label, {
        x: x + 0.08,
        y: headY + 0.06,
        w: colW[i] - 0.12,
        h: 0.22,
        fontSize: 11,
        color: PAPER,
      })
    }
    x += colW[i]
  })
  rows.forEach((row, r) => {
    x = M
    const ry = headY + headH + r * rowH
    row.forEach((cell, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x,
        y: ry,
        w: colW[i],
        h: rowH,
        fill: { color: r === 0 ? CARD : PAPER },
        line: { color: LINE, width: 0.75 },
      })
      text(s, cell, {
        x: x + 0.08,
        y: ry + 0.08,
        w: colW[i] - 0.14,
        h: rowH - 0.14,
        fontSize: 11,
        color: i === 0 ? FOREST : INK,
      })
      x += colW[i]
    })
  })

  const metY = headY + headH + rowH * 2 + 0.1
  const metH = 6.98 - metY
  const metW = (CW - gap) / 2
  card(s, M, metY, metW, metH)
  card(s, M + metW + gap, metY, metW, metH)
  text(s, 'IN THE PROTOTYPE', {
    x: M + 0.14,
    y: metY + 0.08,
    w: metW - 0.28,
    h: 0.18,
    fontSize: 10,
    color: AMBER,
  })
  text(
    s,
    'The formula, in-memory events, and no amounts in analytics. A local recap only after consent. A reminder that stays in the browser. No observed rate.',
    { x: M + 0.14, y: metY + 0.28, w: metW - 0.28, h: metH - 0.36, fontSize: 12 },
  )
  text(s, 'PROPOSED, NOT RUN', {
    x: M + metW + gap + 0.14,
    y: metY + 0.08,
    w: metW - 0.28,
    h: 0.18,
    fontSize: 10,
    color: AMBER,
  })
  text(
    s,
    'Usability with 8–10 people. Pass if at least 7 of 10 restate both lines, and cash-need users can pause without hunting. Distribution fails below 10 of the first 50 non-staff sessions.',
    {
      x: M + metW + gap + 0.14,
      y: metY + 0.28,
      w: metW - 0.28,
      h: metH - 0.36,
      fontSize: 12,
    },
  )

  footer(s, '03', 'Persona: research/06, illustrative. Gates: research/17, not results. No second named person.')
}

function slide4() {
  const s = pres.addSlide()
  chrome(s, '04', 'JOURNEY AND HYPOTHESES')
  const y0 = headline(s, 'The breakdown is the reason and the numbers.', 'H2 is selected, and it has not been tested.')

  card(s, M, y0 - 0.02, CW, 0.62)
  text(s, 'JOB, RECONSTRUCTED. NOT A LOCKED SENTENCE.', {
    x: M + 0.16,
    y: y0 + 0.04,
    w: CW - 0.32,
    h: 0.16,
    fontSize: 10,
    color: AMBER,
  })
  text(
    s,
    'When I am about to change a SIP, I want the next instalments explained in light of my own reason, so I can choose without guessing.',
    { x: M + 0.16, y: y0 + 0.22, w: CW - 0.32, h: 0.32, fontFace: SERIF, fontSize: 14 },
  )

  const colY = y0 + 0.72
  const leftW = 6.55
  const rightX = M + leftW + 0.14
  const rightW = CW - leftW - 0.14

  const steps = [
    ['1', 'Landing', '“Explore my options,” or “I’m just exploring.”', false],
    ['2', 'Reason', 'Optional and skippable. Neutral lines change emphasis, not the formula.', true],
    ['3', 'Amounts', 'Whole rupees, 1–24 months. Above ₹10,00,000 needs confirmation. Increases are rejected.', true],
    ['4', 'Choice', 'Keep, Reduce, and Pause at equal weight. Pause is a proposed ₹0.', false],
    ['5', 'What if', 'Sliders, numeric fields, and a reset.', false],
    ['6', 'Clarity', 'Three questions. They can be skipped. No score.', false],
    ['7', 'Recap', 'Saved in this browser only after consent. The reminder is local only.', false],
    ['8', 'Close', 'Connect only if a URL is set; otherwise “not connected.” The bot explains. It does not decide.', false],
  ]
  let sy = colY
  steps.forEach((step) => {
    const h = step[3] ? 0.52 : 0.34
    if (step[3]) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: M,
        y: sy,
        w: leftW,
        h,
        fill: { color: 'E7F0EB' },
        line: { color: 'E7F0EB' },
      })
      s.addShape(pres.shapes.RECTANGLE, {
        x: M,
        y: sy,
        w: 0.06,
        h,
        fill: { color: FOREST },
        line: { color: FOREST },
      })
    }
    text(s, step[0], { x: M + 0.12, y: sy + 0.04, w: 0.28, h: 0.28, fontFace: SERIF, fontSize: 13, color: FOREST })
    text(s, step[1], { x: M + 0.42, y: sy + 0.04, w: 1.15, h: 0.28, fontSize: 12, color: FOREST })
    text(s, step[2], { x: M + 1.6, y: sy + 0.04, w: leftW - 1.74, h: h - 0.08, fontSize: 12 })
    sy += h
  })
  text(s, 'Marked rows are the breakdown. Formula: (current − proposed) × months. The product does not change the SIP. Analytics stay in memory, with no amounts.', {
    x: M,
    y: sy + 0.04,
    w: leftW,
    h: 0.48,
    fontSize: 11,
    color: MUTED,
  })

  const scores = [
    ['H1', '3.7', 'Fear misread as a reason to interrupt a long-horizon SIP.', false],
    ['H2', '4.3', 'Undifferentiated confirm is the gap. Selected.', true],
    ['H3', '3.5', 'General literacy. Background, not the moment.', false],
    ['H4', '2.8', 'Stoppage ratio is the wrong count. High confidence as a warning.', false],
  ]
  let hy = colY
  scores.forEach((row) => {
    const h = 0.44
    if (row[3]) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: rightX,
        y: hy,
        w: rightW,
        h,
        fill: { color: FOREST },
        line: { color: FOREST },
        rectRadius: 0.04,
      })
    }
    const color = row[3] ? PAPER : INK
    const numColor = row[3] ? PAPER : FOREST
    text(s, row[1], { x: rightX + 0.1, y: hy + 0.08, w: 0.7, h: 0.34, fontFace: SERIF, fontSize: 18, color: numColor })
    text(s, `${row[0]}   ${row[2]}`, {
      x: rightX + 0.85,
      y: hy + 0.08,
      w: rightW - 1.0,
      h: 0.36,
      fontSize: 12,
      color,
    })
    hy += h + 0.04
  })
  text(s, 'Equal weights. Not validated. H4’s low mean is the product bet. The warning itself is high confidence.', {
    x: rightX,
    y: hy,
    w: rightW,
    h: 0.4,
    fontSize: 11,
    color: MUTED,
  })
  hy += 0.42
  card(s, rightX, hy, rightW, 1.16)
  text(s, 'Why H2. It still helps if most pauses are legitimate: show the arithmetic, and leave pause allowed.', {
    x: rightX + 0.12,
    y: hy + 0.1,
    w: rightW - 0.24,
    h: 0.52,
    fontSize: 12,
  })
  text(s, 'Falsify if cash-need users feel pressed to continue, or cannot restate the arithmetic. Proposed. Not run.', {
    x: rightX + 0.12,
    y: hy + 0.64,
    w: rightW - 0.24,
    h: 0.52,
    fontSize: 12,
  })

  const bandY = 5.86
  card(s, M, bandY, CW, 1.12, 'F3E6D4')
  text(s, 'METRIC DISCREPANCY. DO NOT PRESENT A RATE.', {
    x: M + 0.16,
    y: bandY + 0.08,
    w: CW - 0.32,
    h: 0.18,
    fontSize: 10,
    color: AMBER,
  })
  text(
    s,
    'research/17 says the prototype was “not built.” docs/product-decisions.md describes an earlier card flow: a restart month, and no persistence. The live homepage is the assessment. informedChoiceRate counts reason_selected, calculation_viewed, choice_recorded, and comprehension_passed over valid_card_reached, sessionKind decision. The assessment emits different events and has no observed rate. Neither figure is a measured result.',
    { x: M + 0.16, y: bandY + 0.3, w: CW - 0.32, h: 0.8, fontSize: 12 },
  )

  footer(s, '04', 'Hypotheses: research/04. Live journey: AssessmentApp. Earlier metric: src/analytics/funnel-metrics.ts.')
}

function slide5() {
  const s = pres.addSlide()
  chrome(s, '05', 'PROBLEM FRAMING')
  const y0 = headline(s, 'The problem is an under-specified confirm,', 'not a crisis in the SIP book.')

  const gap = 0.1
  const row1H = 2.28
  const col3 = (CW - gap * 2) / 3
  const cells = [
    {
      n: '01',
      title: 'True problem',
      body: 'At a SIP change, a cash need and a market worry meet the same thin confirm. The next instalments are not calculated from this person’s amounts. A pause is sometimes the right choice. The difference in contributions is not an investment loss, and existing units stay invested.',
    },
    {
      n: '02',
      title: 'Who',
      body: 'A salaried investor with a live SIP and a distant goal, illustrated by Ananya. The same person if salary is delayed. SEBI 2025: about 6.7% of households hold mutual funds or ETFs; about 18% in the top nine metros. 63% are aware of a securities product. Awareness is not participation.',
    },
    {
      n: '03',
      title: 'How we know',
      body: 'AMFI’s definition and the July and August 2026 notes. Kuvera and Groww help. Three paraphrased threads. Mint and Economic Times are commentary, not proof of behaviour. No interviews. No measured use. SEBI 2025: 36% of investors had high or moderate securities knowledge. Background, not a skip rate.',
    },
  ]
  cells.forEach((cell, i) => {
    const x = M + i * (col3 + gap)
    card(s, x, y0, col3, row1H)
    text(s, cell.n, { x: x + 0.14, y: y0 + 0.1, w: 0.5, h: 0.24, fontFace: SERIF, fontSize: 14, color: FOREST })
    text(s, cell.title, {
      x: x + 0.6,
      y: y0 + 0.1,
      w: col3 - 0.76,
      h: 0.24,
      fontFace: SERIF,
      fontSize: 14,
      color: INK,
    })
    text(s, cell.body, { x: x + 0.14, y: y0 + 0.44, w: col3 - 0.28, h: row1H - 0.56, fontSize: 12 })
  })

  const row2Y = y0 + row1H + gap
  const row2H = 1.72
  const wide = CW * 0.62
  const narrow = CW - wide - gap
  card(s, M, row2Y, wide, row2H)
  text(s, '04', { x: M + 0.14, y: row2Y + 0.1, w: 0.5, h: 0.24, fontFace: SERIF, fontSize: 14, color: FOREST })
  text(s, 'Customer value and business value — potential, not measured', {
    x: M + 0.64,
    y: row2Y + 0.1,
    w: wide - 0.8,
    h: 0.24,
    fontFace: SERIF,
    fontSize: 14,
  })
  text(
    s,
    'Customer, if it works: a choice she can restate, including an allowed pause. Not a higher return. Business, if anyone uses it: a free demonstration of understand-before-action, and an optional unpaid ₹99 review. Conversion is unknown. Not fewer pauses. Do not use the site TAM of 38.5 crore, or “NCFE 2026.” The 27% literacy figure is 2019 fieldwork.',
    { x: M + 0.14, y: row2Y + 0.44, w: wide - 0.28, h: row2H - 0.56, fontSize: 12 },
  )

  card(s, M + wide + gap, row2Y, narrow, row2H)
  text(s, '05', {
    x: M + wide + gap + 0.14,
    y: row2Y + 0.1,
    w: 0.46,
    h: 0.24,
    fontFace: SERIF,
    fontSize: 14,
    color: FOREST,
  })
  text(s, 'Why now — a hypothesis', {
    x: M + wide + gap + 0.58,
    y: row2Y + 0.1,
    w: narrow - 0.74,
    h: 0.24,
    fontFace: SERIF,
    fontSize: 14,
  })
  text(
    s,
    'The SIP habit is large, and contributions are still rising, while the confirm in the help articles reviewed is still thin. July 2026’s reported ratio fell. This is not a claim that pauses are accelerating.',
    {
      x: M + wide + gap + 0.14,
      y: row2Y + 0.44,
      w: narrow - 0.28,
      h: row2H - 0.56,
      fontSize: 12,
    },
  )

  const synY = row2Y + row2H + 0.1
  const synH = 6.98 - synY
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: M,
    y: synY,
    w: CW,
    h: synH,
    fill: { color: FOREST },
    line: { color: FOREST },
    rectRadius: 0.05,
  })
  text(s, 'SYNTHESIS', {
    x: M + 0.18,
    y: synY + 0.08,
    w: CW - 0.36,
    h: 0.18,
    fontSize: 10,
    color: 'D7E3DC',
    charSpacing: 0.8,
  })
  text(
    s,
    'Explain the next instalments in light of the person’s own reason, keep Keep, Reduce, and Pause at equal weight, and do not treat the stoppage ratio as the size of the problem.',
    {
      x: M + 0.18,
      y: synY + 0.28,
      w: CW - 0.36,
      h: synH - 0.38,
      fontFace: SERIF,
      fontSize: 15,
      color: PAPER,
    },
  )

  footer(
    s,
    '05',
    'SEBI Investor Survey 2025, press note and main report. NCFE literacy is 2019 fieldwork. Why now is a hypothesis.',
  )
}

function slide6() {
  const s = pres.addSlide()
  chrome(s, '06', 'SYNTHESIS')
  const y0 = headline(s, 'Test the mechanism.', 'Do not report a result that has not been measured.')

  const gap = 0.12
  const colW = (CW - gap) / 2
  const colH = 2.15
  card(s, M, y0, colW, colH)
  card(s, M + colW + gap, y0, colW, colH)
  text(s, 'WHAT WE BELIEVE', {
    x: M + 0.16,
    y: y0 + 0.1,
    w: colW - 0.32,
    h: 0.2,
    fontSize: 11,
    color: AMBER,
    charSpacing: 0.6,
  })
  text(s, 'WHAT IS UNPROVEN', {
    x: M + colW + gap + 0.16,
    y: y0 + 0.1,
    w: colW - 0.32,
    h: 0.2,
    fontSize: 11,
    color: AMBER,
    charSpacing: 0.6,
  })
  const believe = [
    'H2 is the hypothesis to test. Mean 4.3, equal weights, not validated.',
    'It still helps if most pauses are legitimate.',
    'The arithmetic is deterministic, and it is already in the prototype.',
    'Existing units stay invested. The difference is not a loss. The product does not change the SIP.',
    'The published stoppage count is the wrong count of voluntary pauses.',
  ]
  const unproven = [
    'Any interview, and any share of pauses that are fear.',
    'That people can restate the rupee line and the units line.',
    'That cash-need users do not feel pressed to continue.',
    'Any informed-choice rate, usage, or conversion to the ₹99 review.',
    'RICE reach of 200. It is an assumption, not a historical score.',
  ]
  believe.forEach((line, i) => {
    text(s, line, { x: M + 0.16, y: y0 + 0.38 + i * 0.32, w: colW - 0.32, h: 0.3, fontSize: 12 })
  })
  unproven.forEach((line, i) => {
    text(s, line, {
      x: M + colW + gap + 0.16,
      y: y0 + 0.38 + i * 0.32,
      w: colW - 0.32,
      h: 0.3,
      fontSize: 12,
    })
  })

  const gateY = y0 + colH + 0.12
  text(s, 'THREE GATES. PROPOSED, NOT RESULTS. COUNSEL COMES BEFORE A PUBLIC PILOT.', {
    x: M,
    y: gateY,
    w: CW,
    h: 0.2,
    fontSize: 10,
    color: AMBER,
    charSpacing: 0.5,
  })
  const gates = [
    ['01', 'Counsel', 'Before any public pilot. FinLit says it is not registered with SEBI or AMFI. A compliance review of this prototype has not been completed.'],
    ['02', 'Usability', '8–10 sessions. Not run. Pass only if at least 7 of 10 restate the rupee line and the units line, and cash-need users can pause without hunting.'],
    ['03', 'Distribution', 'Not run. Fail if fewer than 10 of the first 50 non-staff sessions are about to change a SIP. Continuation is not the gate.'],
  ]
  const gW = (CW - gap * 2) / 3
  const gY = gateY + 0.26
  const gH = 1.48
  gates.forEach((g, i) => {
    const x = M + i * (gW + gap)
    card(s, x, gY, gW, gH)
    text(s, g[0], { x: x + 0.14, y: gY + 0.1, w: gW - 0.28, h: 0.24, fontFace: SERIF, fontSize: 16, color: FOREST })
    text(s, g[1], { x: x + 0.14, y: gY + 0.36, w: gW - 0.28, h: 0.22, fontSize: 13, color: INK })
    text(s, g[2], { x: x + 0.14, y: gY + 0.62, w: gW - 0.28, h: 0.76, fontSize: 12 })
  })

  const closeY = gY + gH + 0.1
  const closeH = 6.98 - closeY
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: M,
    y: closeY,
    w: CW,
    h: closeH,
    fill: { color: FOREST },
    line: { color: FOREST },
    rectRadius: 0.05,
  })
  text(
    s,
    'This deck stops before wireframes. A later section would show the screens of this journey. Those pages are not included.',
    {
      x: M + 0.2,
      y: closeY + 0.1,
      w: CW - 0.4,
      h: closeH - 0.18,
      fontFace: SERIF,
      fontSize: 15,
      color: PAPER,
      valign: 'middle',
    },
  )

  footer(s, '06', 'Gates: research/17 and research/22. Not results. RICE reach of 200 is an assumption in research/17.')
}

slide1()
slide2()
slide3()
slide4()
slide5()
slide6()

if (pres.slides.length !== 6) {
  throw new Error(`Expected 6 slides, got ${pres.slides.length}`)
}

mkdirSync(dirname(OUT), { recursive: true })
await pres.writeFile({ fileName: OUT })
console.log(`Wrote ${OUT}`)
