import {
  ADVICE_LINE,
  CHOICE_COPY,
  DIFFERENCE_LABEL,
  DOES_NOT_CHANGE,
  HANDOFF,
  PAUSE_SEPARATE_LABEL,
  REASON_LABELS,
  RESTART_COPY,
  reasonEmphasis,
} from './decision-rules.ts'
import { formatInrDigits } from './money.ts'
import { calculateContributionDifference } from './sip-calculator.ts'
import type { Choice, ContributionSuccess, Reason } from './sip-types.ts'

/**
 * Translates a calculator result into the person's stated plan.
 * This file does not compute rupees. The gap always comes from
 * calculateContributionDifference: (current − proposed) × months.
 */

export type ExactSpan = {
  wholeMonths: string
  remainderRupees: string
}

export type GoalTimeShift = {
  kind: 'goal-time-shift'
  remainingTarget: string
  chosenMonthly: string
  /** Contribution gap ÷ chosen monthly amount, exact integer division. */
  gapSpan: ExactSpan
  /** Stated target ÷ chosen monthly amount, exact integer division. */
  targetSpan: ExactSpan
}

export type ContinuityHabit = 'continues' | 'reduced' | 'stops'

export type ContinuityReading = {
  kind: 'continuity'
  habit: ContinuityHabit
  /** Months of the current uninterrupted contribution that stop. Zero when the amount continues. */
  monthsUninterruptedThatStop: string
  continuingMonthly: string
  restartMonth: string | null
  /**
   * A target was stated, but the chosen monthly amount is ₹0, so the gap is not divided.
   * The figure is kept as they entered it. No target is invented.
   */
  statedTargetNotDivided: string | null
}

export type PlanTranslation = GoalTimeShift | ContinuityReading

export type TargetParse =
  | { ok: true; value: bigint | null }
  | { ok: false; message: string }

const MAX_INPUT_DIGITS = 18

export function parseRemainingTarget(raw: string): TargetParse {
  const trimmed = raw.trim().replace(/[₹,\s]/g, '')
  if (trimmed === '') {
    return { ok: true, value: null }
  }
  if (trimmed.startsWith('-')) {
    return {
      ok: false,
      message: 'Enter a remaining contribution target without a minus sign, or leave it blank.',
    }
  }
  if (!/^\d+$/.test(trimmed)) {
    return {
      ok: false,
      message: 'Use digits only for the remaining contribution target, or leave it blank.',
    }
  }
  if (trimmed.length > MAX_INPUT_DIGITS) {
    return {
      ok: false,
      message: 'That target is too large to compare safely here. Check the digits.',
    }
  }
  const value = BigInt(trimmed)
  if (value === 0n) {
    return {
      ok: false,
      message: 'Enter a remaining contribution target above zero, or leave it blank.',
    }
  }
  return { ok: true, value }
}

export function divideExactly(numerator: bigint, denominator: bigint): ExactSpan {
  if (denominator <= 0n) {
    throw new Error('divideExactly requires a chosen monthly amount above zero')
  }
  if (numerator < 0n) {
    throw new Error('divideExactly requires a non-negative contribution amount')
  }
  const whole = numerator / denominator
  const remainder = numerator % denominator
  return { wholeMonths: whole.toString(), remainderRupees: remainder.toString() }
}

export function formatMonthCount(months: string): string {
  return months === '1' ? '1 month' : `${months} months`
}

/** Exact planned-contribution months. A remainder stays in rupees. Never a rounded decimal. */
export function formatPlannedContributionMonths(span: ExactSpan): string {
  if (span.wholeMonths === '0' && span.remainderRupees === '0') {
    return '0 months of planned contributions'
  }
  if (span.wholeMonths === '0') {
    return `${formatInrDigits(span.remainderRupees)} toward the next month of planned contributions`
  }
  const monthWord = span.wholeMonths === '1' ? '1 month' : `${span.wholeMonths} months`
  if (span.remainderRupees === '0') {
    return `${monthWord} of planned contributions`
  }
  return `${monthWord} and ${formatInrDigits(span.remainderRupees)} of planned contributions`
}

export function translatePlan(input: {
  result: ContributionSuccess
  remainingTargetRaw: string
  restartMonth: string
}): { ok: true; translation: PlanTranslation } | { ok: false; message: string } {
  const parsed = parseRemainingTarget(input.remainingTargetRaw)
  if (!parsed.ok) return parsed

  const chosen = BigInt(input.result.proposed)
  const gap = BigInt(input.result.contributionDifference)
  const restartMonth = blankToNull(input.restartMonth)
  const habit = habitFor(input.result)

  if (parsed.value === null || chosen === 0n) {
    return {
      ok: true,
      translation: {
        kind: 'continuity',
        habit,
        monthsUninterruptedThatStop: habit === 'continues' ? '0' : input.result.months,
        continuingMonthly: input.result.proposed,
        restartMonth: habit === 'continues' ? null : restartMonth,
        statedTargetNotDivided: chosen === 0n && parsed.value !== null ? parsed.value.toString() : null,
      },
    }
  }

  return {
    ok: true,
    translation: {
      kind: 'goal-time-shift',
      remainingTarget: parsed.value.toString(),
      chosenMonthly: chosen.toString(),
      gapSpan: divideExactly(gap, chosen),
      targetSpan: divideExactly(parsed.value, chosen),
    },
  }
}

export function goalShiftCopy(shift: GoalTimeShift): {
  headline: string
  gapLine: string
  targetLine: string
} {
  const headline = formatPlannedContributionMonths(shift.gapSpan)
  return {
    headline,
    gapLine: `The contribution gap adds ${headline} before the stated remaining contribution target is met, at the monthly amount you are choosing. These are planned-contribution months, not wealth, returns, or units.`,
    targetLine: `At ${formatInrDigits(shift.chosenMonthly)} a month, the remaining contribution target of ${formatInrDigits(shift.remainingTarget)} is ${formatPlannedContributionMonths(shift.targetSpan)}.`,
  }
}

export function continuityCopy(reading: ContinuityReading): { headline: string; detail: string } {
  if (reading.habit === 'continues') {
    return {
      headline: 'The monthly contribution continues',
      detail: 'No months of uninterrupted contribution stop. There is no restart to record.',
    }
  }
  const months = formatMonthCount(reading.monthsUninterruptedThatStop)
  const headline = `${months} of uninterrupted contribution stop`
  if (reading.habit === 'reduced') {
    return {
      headline,
      detail: `The current monthly amount does not continue through those months. ${formatInrDigits(reading.continuingMonthly)} would continue instead. A pause is a different decision, even when the rupee gap matches. ${restartSentence(reading.restartMonth)}`,
    }
  }
  const targetNote = reading.statedTargetNotDivided
    ? ` You stated a remaining contribution target of ${formatInrDigits(reading.statedTargetNotDivided)}. Months of planned contributions are not computed while the chosen monthly amount is ₹0.`
    : ''
  return {
    headline,
    detail: `The chosen monthly amount is ₹0. ${restartSentence(reading.restartMonth)}${targetNote}`,
  }
}

export function separatePauseComparison(result: ContributionSuccess): ContributionSuccess | null {
  if (result.mode !== 'reduce') return null
  const pause = calculateContributionDifference({
    currentMonthlyAmount: result.current,
    proposedMonthlyAmount: '0',
    months: result.months,
  })
  if (!pause.ok) return null
  return pause
}

export function separatePauseLine(pause: ContributionSuccess): string {
  return `A full pause of ${formatInrDigits(pause.current)} for ${formatMonthCount(pause.months)} is ${formatInrDigits(pause.contributionDifference)} of contributions that would not be invested. This figure is a pause, shown separately from the reduction.`
}

export type DecisionCardModel = {
  reasonLabel: string
  choiceLabel: string
  current: string
  proposed: string
  monthsLabel: string
  gap: string
  gapLabel: string
  planKind: PlanTranslation['kind']
  headline: string
  planLines: string[]
  restartMonth: string | null
  emphasis: string
  showRestartNote: boolean
  pauseSeparateLabel: string | null
  pauseGap: string | null
  pauseSeparateLine: string | null
}

export function buildDecisionCard(input: {
  reason: Reason
  choice: Choice
  result: ContributionSuccess
  translation: PlanTranslation
  restartMonth: string
}): DecisionCardModel {
  const restartMonth = input.choice === 'keep' ? null : blankToNull(input.restartMonth)
  const headlineAndLines = planLinesFor(input.translation, restartMonth)
  const pause = separatePauseComparison(input.result)
  return {
    reasonLabel: REASON_LABELS[input.reason],
    choiceLabel: CHOICE_COPY[input.choice].title,
    current: formatInrDigits(input.result.current),
    proposed: formatInrDigits(input.result.proposed),
    monthsLabel: formatMonthCount(input.result.months),
    gap: formatInrDigits(input.result.contributionDifference),
    gapLabel: DIFFERENCE_LABEL,
    planKind: input.translation.kind,
    headline: headlineAndLines.headline,
    planLines: headlineAndLines.planLines,
    restartMonth,
    emphasis: reasonEmphasis(input.reason),
    showRestartNote: input.choice === 'pause' || restartMonth !== null,
    pauseSeparateLabel: pause ? PAUSE_SEPARATE_LABEL : null,
    pauseGap: pause ? formatInrDigits(pause.contributionDifference) : null,
    pauseSeparateLine: pause ? separatePauseLine(pause) : null,
  }
}

export function decisionCardPlainText(card: DecisionCardModel): string {
  const lines = [
    'Skip Check decision card',
    '',
    `Reason: ${card.reasonLabel}`,
    `Choice: ${card.choiceLabel}`,
    `Current monthly SIP: ${card.current}`,
    `Proposed monthly SIP: ${card.proposed}`,
    `Months: ${card.monthsLabel}`,
    `Contribution gap: ${card.gap}`,
    card.gapLabel,
    '',
    'Plan:',
    card.headline,
    ...card.planLines,
  ]
  if (card.pauseSeparateLabel && card.pauseSeparateLine) {
    lines.push('', `${card.pauseSeparateLabel}. ${card.pauseSeparateLine}`)
  }
  if (card.restartMonth) {
    lines.push('', `Restart month: ${card.restartMonth}`)
  }
  if (card.showRestartNote) {
    lines.push(RESTART_COPY)
  }
  lines.push('', card.emphasis, '', ADVICE_LINE, DOES_NOT_CHANGE, HANDOFF)
  lines.push('This is a record of what you entered. It is not an order.')
  return lines.join('\n')
}

function planLinesFor(
  translation: PlanTranslation,
  restartMonth: string | null,
): { headline: string; planLines: string[] } {
  if (translation.kind === 'goal-time-shift') {
    const copy = goalShiftCopy(translation)
    return { headline: copy.headline, planLines: [copy.gapLine, copy.targetLine] }
  }
  const copy = continuityCopy({ ...translation, restartMonth })
  return { headline: copy.headline, planLines: [copy.detail] }
}

function habitFor(result: ContributionSuccess): ContinuityHabit {
  if (result.mode === 'keep') return 'continues'
  if (result.mode === 'pause') return 'stops'
  return 'reduced'
}

function blankToNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function restartSentence(restartMonth: string | null): string {
  if (restartMonth) {
    return `Restart month on this card: ${restartMonth}. Skip Check will not restart the SIP.`
  }
  return 'No restart month is named. Skip Check will not restart the SIP.'
}
