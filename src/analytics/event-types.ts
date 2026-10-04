import type { Choice, Reason } from '../domain/sip-types.ts'

export type SessionKind = 'decision' | 'sample' | 'none'

export type AnalyticsEventName =
  | 'entry_page_viewed'
  | 'decision_intent_selected'
  | 'sample_path_selected'
  | 'reason_selected'
  | 'inputs_submitted'
  | 'inputs_rejected'
  | 'valid_card_reached'
  | 'calculation_viewed'
  | 'choice_recorded'
  | 'comprehension_attempted'
  | 'comprehension_passed'
  | 'recap_viewed'
  | 'flow_abandoned'
  | 'pressure_reported'
  | 'usefulness_reported'

export type AnalyticsEvent = {
  name: AnalyticsEventName
  at: number
  sessionId: string | null
  sessionKind: SessionKind
  reason?: Reason
  choice?: Choice
  passed?: boolean
  answer?: 'yes' | 'no'
}
