import type { AnalyticsEvent } from './event-types.ts'
import type { Choice, Reason } from '../domain/sip-types.ts'

export type InformedChoiceSummary = {
  numerator: number
  denominator: number
  rate: number | null
}

const REQUIRED = [
  'reason_selected',
  'calculation_viewed',
  'choice_recorded',
  'comprehension_passed',
] as const

export function informedChoiceRate(events: AnalyticsEvent[]): InformedChoiceSummary {
  const decision = events.filter((event) => event.sessionKind === 'decision' && event.sessionId)
  const reached = new Set(
    decision.filter((event) => event.name === 'valid_card_reached').map((event) => event.sessionId),
  )
  let numerator = 0
  for (const sessionId of reached) {
    const names = new Set(
      decision.filter((event) => event.sessionId === sessionId).map((event) => event.name),
    )
    if (REQUIRED.every((name) => names.has(name))) numerator += 1
  }
  const denominator = reached.size
  return {
    numerator,
    denominator,
    rate: denominator === 0 ? null : numerator / denominator,
  }
}

export function choiceCounts(events: AnalyticsEvent[]): Record<Choice, number> {
  const counts: Record<Choice, number> = { keep: 0, reduce: 0, pause: 0 }
  const seen = new Set<string>()
  for (const event of events) {
    if (event.name !== 'choice_recorded' || event.sessionKind !== 'decision' || !event.choice) continue
    if (!event.sessionId || seen.has(event.sessionId)) continue
    seen.add(event.sessionId)
    counts[event.choice] += 1
  }
  return counts
}

export function pauseChoicesForReason(events: AnalyticsEvent[], reason: Reason): number {
  const sessions = new Set(
    events
      .filter(
        (event) =>
          event.sessionKind === 'decision' &&
          event.name === 'reason_selected' &&
          event.reason === reason &&
          event.sessionId,
      )
      .map((event) => event.sessionId),
  )
  return events.filter(
    (event) =>
      event.name === 'choice_recorded' &&
      event.choice === 'pause' &&
      event.sessionId &&
      sessions.has(event.sessionId),
  ).length
}

export function calculatorErrorRate(events: AnalyticsEvent[]): number | null {
  const rejected = events.filter((event) => event.name === 'inputs_rejected').length
  const submitted = events.filter((event) => event.name === 'inputs_submitted').length
  const total = rejected + submitted
  if (total === 0) return null
  return rejected / total
}

export function sampleSessionCount(events: AnalyticsEvent[]): number {
  return new Set(
    events
      .filter((event) => event.name === 'sample_path_selected' && event.sessionId)
      .map((event) => event.sessionId),
  ).size
}

export function decisionAbandonmentCount(events: AnalyticsEvent[]): number {
  return events.filter(
    (event) => event.name === 'flow_abandoned' && event.sessionKind === 'decision',
  ).length
}
