import { calculateContributionDifference } from './sip-calculator.ts'
import type { Choice, ContributionSuccess } from './sip-types.ts'

export type ScenarioCard = {
  choice: Choice
  monthly: string
  totalPlanned: string
  contributionDifference: string
}

export type ScenarioSet = {
  keep: ScenarioCard
  reduce: ScenarioCard | null
  pause: ScenarioCard
  explored: Choice
}

function cardFrom(result: ContributionSuccess): ScenarioCard {
  const total = (BigInt(result.proposed) * BigInt(result.months)).toString()
  return {
    choice: result.mode,
    monthly: result.proposed,
    totalPlanned: total,
    contributionDifference: result.contributionDifference,
  }
}

/** Three equal readings of one period. Arithmetic stays in the SIP calculator. */
export function buildScenarios(
  current: string,
  exploredMonthly: string,
  months: string,
): { ok: true; scenarios: ScenarioSet } | { ok: false; message: string } {
  const keep = calculateContributionDifference({
    currentMonthlyAmount: current,
    proposedMonthlyAmount: current,
    months,
  })
  if (!keep.ok) return { ok: false, message: keep.message }

  const pause = calculateContributionDifference({
    currentMonthlyAmount: current,
    proposedMonthlyAmount: '0',
    months,
  })
  if (!pause.ok) return { ok: false, message: pause.message }

  const explored = calculateContributionDifference({
    currentMonthlyAmount: current,
    proposedMonthlyAmount: exploredMonthly,
    months,
  })
  if (!explored.ok) return { ok: false, message: explored.message }

  const reduce =
    explored.mode === 'reduce'
      ? cardFrom(explored)
      : null

  return {
    ok: true,
    scenarios: {
      keep: cardFrom(keep),
      reduce,
      pause: cardFrom(pause),
      explored: explored.mode,
    },
  }
}

/** A starting reduce amount when the person has not chosen one. Half, at least ₹1 below current when current is above ₹1. */
export function defaultExploreAmount(currentDigits: string): string {
  const current = BigInt(currentDigits)
  if (current <= 1n) return '0'
  const half = current / 2n
  if (half === 0n || half === current) return (current - 1n).toString()
  return half.toString()
}
