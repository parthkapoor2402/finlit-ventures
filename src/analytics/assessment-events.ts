export type AssessmentEventName =
  | 'assessment_started'
  | 'landing_primary_clicked'
  | 'landing_exploration_clicked'
  | 'reason_selected'
  | 'inputs_completed'
  | 'scenarios_viewed'
  | 'scenario_explorer_opened'
  | 'scenario_adjusted'
  | 'contribution_help_opened'
  | 'knowledge_check_started'
  | 'knowledge_check_skipped'
  | 'knowledge_check_completed'
  | 'knowledge_check_retry'
  | 'recap_saved'
  | 'recap_deleted'
  | 'recap_revisited'
  | 'bot_opened'
  | 'bot_message_sent'
  | 'bot_helpfulness_submitted'
  | 'human_support_cta_clicked'
  | 'reminder_opted_in'
  | 'reminder_opted_out'
  | 'session_completed'
  | 'assessment_completed'

export type AssessmentEvent = {
  name: AssessmentEventName
  at: number
  sessionId: string | null
  sessionKind: 'decision' | 'sample'
  helpful?: 'yes' | 'no'
}

const events: AssessmentEvent[] = []

export function trackAssessment(event: Omit<AssessmentEvent, 'at'>): void {
  try {
    events.push({ ...event, at: Date.now() })
  } catch {
    // Measurement must not block the assessment.
  }
}

export function getAssessmentEvents(): AssessmentEvent[] {
  return events.map((event) => ({ ...event }))
}

export function resetAssessmentAnalytics(): void {
  events.length = 0
}

/**
 * A meaningful return reviews a saved recap, updates an assessment, or starts a new scenario.
 * Opening a reminder is not enough, and continuing a SIP is not the success metric.
 */
export function meaningfulReturn(eventsIn: AssessmentEvent[]): boolean {
  return eventsIn.some((event) =>
    event.name === 'scenarios_viewed' ||
    event.name === 'scenario_adjusted' ||
    event.name === 'recap_saved' ||
    event.name === 'recap_revisited',
  )
}
