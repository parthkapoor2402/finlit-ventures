import { formatInrDigits } from "../../../src/domain/money.ts"
import { calculateContributionDifference } from "../../../src/domain/sip-calculator.ts"

const result = calculateContributionDifference({
  currentMonthlyAmount: "12000",
  proposedMonthlyAmount: "6000",
  months: "6",
})

if (!result.ok) {
  throw new Error(result.message)
}

const pause = calculateContributionDifference({
  currentMonthlyAmount: "12000",
  proposedMonthlyAmount: "0",
  months: "6",
})

if (!pause.ok) {
  throw new Error(pause.message)
}

export const WALKTHROUGH = {
  current: formatInrDigits(result.current),
  proposed: formatInrDigits(result.proposed),
  monthlyDifference: formatInrDigits(result.monthlyDifference),
  difference: formatInrDigits(result.contributionDifference),
  months: result.months,
  rawDifference: result.contributionDifference,
  pauseDifference: formatInrDigits(pause.contributionDifference),
}
