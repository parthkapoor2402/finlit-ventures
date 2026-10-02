export const ASSESSMENT_REASONS = [
  'cash_need',
  'market_worry',
  'goal_changed',
  'fund_reconsider',
  'income_changed',
  'not_sure',
  'something_else',
] as const

export type AssessmentReason = (typeof ASSESSMENT_REASONS)[number]

export const ASSESSMENT_REASON_LABELS: Record<AssessmentReason, string> = {
  cash_need: 'I need cash for upcoming expenses.',
  market_worry: 'I am worried about market fluctuations.',
  goal_changed: 'My financial goal or timeline has changed.',
  fund_reconsider: 'I am reconsidering the fund.',
  income_changed: 'My income or expenses have changed.',
  not_sure: 'I am not sure yet.',
  something_else: 'Something else.',
}

/** Neutral sentences. A reason changes emphasis, not the formula, and is not scored. */
export function assessmentReasonLine(reason: AssessmentReason): string {
  switch (reason) {
    case 'cash_need':
      return 'A cash need can be a sound reason to change future contributions. This check does not weigh that need for you.'
    case 'market_worry':
      return 'Worry about the market is recorded as your reason. This page does not judge that worry, and the figure is not a loss.'
    case 'goal_changed':
      return 'A change in a goal or timeline is recorded as you stated it. This page does not move a goal date.'
    case 'fund_reconsider':
      return 'Reconsidering a fund is recorded as your reason. This check does not name a replacement fund.'
    case 'income_changed':
      return 'A change in income or expenses is recorded as your reason. This page does not ask for income.'
    case 'not_sure':
      return 'You can compare the scenarios without settling on a reason.'
    case 'something_else':
      return 'Your note, if you add one, stays in this browser unless you choose to save the recap.'
  }
}
