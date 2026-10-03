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
