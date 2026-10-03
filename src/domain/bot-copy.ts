import type { AssessmentReason } from './assessment-reasons.ts'
import type { Choice } from './sip-types.ts'

export const BOT_OPENING =
  'Hi, I’m SIP Check. I can help explain the numbers you’re seeing and clarify how contribution changes work. I won’t choose an investment decision for you or change your SIP.'

export type BotContext = {
  reason: AssessmentReason | null
  current: string
  proposed: string
  months: string
  contributionDifference: string
  scenario: Choice | null
  misconceptions: string[]
}
