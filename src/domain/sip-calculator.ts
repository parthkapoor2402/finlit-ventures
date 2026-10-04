import type {
  Choice,
  ContributionErrorCode,
  ContributionFailure,
  ContributionInput,
  ContributionMode,
  ContributionResult,
  FieldName,
} from './sip-types.ts'

const CONFIRM_ABOVE = 1_000_000n
const MAX_INPUT_DIGITS = 18

const MESSAGES: Record<ContributionErrorCode, string> = {
  blank: 'Enter a whole number of rupees.',
  negative: 'Enter an amount without a minus sign.',
  non_numeric: 'Use digits only, without paise.',
  zero_current: 'Enter a current monthly amount greater than zero.',
  months_range: 'Enter a whole number of months from 1 to 24.',
  increase: 'This check is for a skip, a reduction, or a cancel. It does not cover raising a SIP.',
  too_large: 'That amount is too large to compare safely here. Check the digits.',
  reduce_needs_lower_amount:
    'For a reduction, enter a monthly amount greater than zero and below the current SIP.',
}

function fail(field: FieldName, code: ContributionErrorCode): ContributionFailure {
  const message =
    field === 'months' && code === 'blank'
      ? 'Enter how many months to compare, from 1 to 24.'
      : field === 'current' && code === 'blank'
        ? 'Enter the current monthly amount for this SIP, in rupees.'
        : field === 'proposed' && code === 'blank'
          ? 'Enter the monthly amount you are considering. Use 0 for a pause.'
          : MESSAGES[code]
  return { ok: false, field, code, message }
}

function parseAmount(
  raw: string,
  field: 'current' | 'proposed',
): { ok: true; value: bigint } | ContributionFailure {
  const trimmed = raw.trim().replace(/[₹,\s]/g, '')
  if (trimmed === '') {
    return fail(field, 'blank')
  }
  if (trimmed.startsWith('-')) {
    return fail(field, 'negative')
  }
  if (!/^\d+$/.test(trimmed)) {
    return fail(field, 'non_numeric')
  }
  if (trimmed.length > MAX_INPUT_DIGITS) {
    return fail(field, 'too_large')
  }
  const value = BigInt(trimmed)
  if (field === 'current' && value === 0n) {
    return fail(field, 'zero_current')
  }
  return { ok: true, value }
}

function parseMonths(raw: string): { ok: true; value: bigint } | ContributionFailure {
  const trimmed = raw.trim()
  if (trimmed === '') {
    return fail('months', 'blank')
  }
  if (trimmed.startsWith('-') && /^\d+$/.test(trimmed.slice(1))) {
    return fail('months', 'months_range')
  }
  if (!/^\d+$/.test(trimmed)) {
    return fail('months', 'non_numeric')
  }
  const value = BigInt(trimmed)
  if (value < 1n || value > 24n) {
    return fail('months', 'months_range')
  }
  return { ok: true, value }
}

function modeFor(current: bigint, proposed: bigint): ContributionMode {
  if (proposed === current) return 'keep'
  if (proposed === 0n) return 'pause'
  return 'reduce'
}

/**
 * The only SIP calculation in the prototype.
 * Contribution difference = (current − proposed) × months.
 * Inputs are strings so an empty field is not treated as zero.
 */
export function calculateContributionDifference(input: ContributionInput): ContributionResult {
  const current = parseAmount(input.currentMonthlyAmount, 'current')
  if (!current.ok) return current
  const proposed = parseAmount(input.proposedMonthlyAmount, 'proposed')
  if (!proposed.ok) return proposed
  const months = parseMonths(input.months)
  if (!months.ok) return months

  if (proposed.value > current.value) {
    return fail('proposed', 'increase')
  }

  const monthlyDifference = current.value - proposed.value
  const contributionDifference = monthlyDifference * months.value

  return {
    ok: true,
    current: current.value.toString(),
    proposed: proposed.value.toString(),
    months: months.value.toString(),
    monthlyDifference: monthlyDifference.toString(),
    contributionDifference: contributionDifference.toString(),
    mode: modeFor(current.value, proposed.value),
    confirmationRequired: current.value > CONFIRM_ABOVE || proposed.value > CONFIRM_ABOVE,
  }
}

export function contributionForChoice(
  current: string,
  proposed: string,
  months: string,
  choice: Choice,
): ContributionResult {
  if (choice === 'keep') {
    return calculateContributionDifference({
      currentMonthlyAmount: current,
      proposedMonthlyAmount: current,
      months,
    })
  }
  if (choice === 'pause') {
    return calculateContributionDifference({
      currentMonthlyAmount: current,
      proposedMonthlyAmount: '0',
      months,
    })
  }
  const preview = calculateContributionDifference({
    currentMonthlyAmount: current,
    proposedMonthlyAmount: proposed,
    months,
  })
  if (!preview.ok) return preview
  if (preview.mode !== 'reduce') {
    return fail('proposed', 'reduce_needs_lower_amount')
  }
  return preview
}
