export const REASONS = [
  'cash_need',
  'market_worry',
  'goal_reached',
  'fund_no_longer_fits',
  'not_sure',
] as const

export type Reason = (typeof REASONS)[number]

export type Choice = 'keep' | 'reduce' | 'pause'

export type ContributionMode = Choice

export type FieldName = 'current' | 'proposed' | 'months'

export type ContributionErrorCode =
  | 'blank'
  | 'negative'
  | 'non_numeric'
  | 'zero_current'
  | 'months_range'
  | 'increase'
  | 'too_large'
  | 'reduce_needs_lower_amount'

export type ContributionSuccess = {
  ok: true
  current: string
  proposed: string
  months: string
  monthlyDifference: string
  contributionDifference: string
  mode: ContributionMode
  confirmationRequired: boolean
}

export type ContributionFailure = {
  ok: false
  field: FieldName
  code: ContributionErrorCode
  message: string
}

export type ContributionResult = ContributionSuccess | ContributionFailure

export type ContributionInput = {
  currentMonthlyAmount: string
  proposedMonthlyAmount: string
  months: string
}
