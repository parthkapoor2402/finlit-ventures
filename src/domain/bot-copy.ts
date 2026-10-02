import type { AssessmentReason } from './assessment-reasons.ts'
import type { Choice } from './sip-types.ts'

export const BOT_OPENING =
  'Hi, I’m SIP Check. I can help you understand the scenarios you just explored, explain how contribution changes work, and clarify the assumptions behind the numbers. I won’t choose an investment decision for you or change your SIP.'

export type BotContext = {
  reason: AssessmentReason | null
  current: string
  proposed: string
  months: string
  contributionDifference: string
  scenario: Choice | null
  misconceptions: string[]
}
