import { formatInrDigits } from "../../../src/domain/money.ts"
import { goalShiftCopy, translatePlan } from "../../../src/domain/plan-translation.ts"
import { calculateContributionDifference } from "../../../src/domain/sip-calculator.ts"

const result = calculateContributionDifference({
  currentMonthlyAmount: "5000",
  proposedMonthlyAmount: "2300",
  months: "12",
})

if (!result.ok) {
  throw new Error(result.message)
}

const pause = calculateContributionDifference({
  currentMonthlyAmount: "5000",
  proposedMonthlyAmount: "0",
  months: "12",
})

if (!pause.ok) {
  throw new Error(pause.message)
}

const plan = translatePlan({
  result,
  remainingTargetRaw: "144000",
  restartMonth: "June",
})

if (!plan.ok || plan.translation.kind !== "goal-time-shift") {
  throw new Error("hero plan")
}

const copy = goalShiftCopy(plan.translation)

/** Whole-rupee cards for the What if explorer. Current SIP stays ₹5,000. */
export function figuresFor(proposedAmount: number, monthCount: number) {
  const proposed = String(Math.min(5000, Math.max(0, Math.round(proposedAmount))))
  const months = String(Math.min(24, Math.max(1, Math.round(monthCount))))
  const reduced = calculateContributionDifference({
    currentMonthlyAmount: "5000",
    proposedMonthlyAmount: proposed,
    months,
  })
  const paused = calculateContributionDifference({
    currentMonthlyAmount: "5000",
    proposedMonthlyAmount: "0",
    months,
  })
  if (!reduced.ok || !paused.ok) {
    throw new Error("what if")
  }
  return {
    proposed,
    months: reduced.months,
    proposedLabel: formatInrDigits(reduced.proposed),
    currentLabel: formatInrDigits(reduced.current),
    keepTotal: formatInrDigits((BigInt(reduced.current) * BigInt(reduced.months)).toString()),
    reduceTotal: formatInrDigits((BigInt(reduced.proposed) * BigInt(reduced.months)).toString()),
    reduceDiff: formatInrDigits(reduced.contributionDifference),
    pauseDiff: formatInrDigits(paused.contributionDifference),
    pauseTotal: formatInrDigits("0"),
    rawReduce: reduced.contributionDifference,
  }
}

/** Screenshot state: ₹1,000 for 6 months, from the film's ₹5,000 current SIP. */
export const WHAT_IF = figuresFor(1000, 6)

export const WALKTHROUGH = {
  current: formatInrDigits(result.current),
  proposed: formatInrDigits(result.proposed),
  monthlyDifference: formatInrDigits(result.monthlyDifference),
  difference: formatInrDigits(result.contributionDifference),
  months: result.months,
  rawDifference: result.contributionDifference,
  pauseDifference: formatInrDigits(pause.contributionDifference),
  keepTotal: formatInrDigits((BigInt(result.current) * BigInt(result.months)).toString()),
  reduceTotal: formatInrDigits((BigInt(result.proposed) * BigInt(result.months)).toString()),
  pauseTotal: formatInrDigits("0"),
  target: formatInrDigits(plan.translation.remainingTarget),
  plannedMonths: copy.headline,
  targetLine: copy.targetLine,
  restartMonth: "June",
}
