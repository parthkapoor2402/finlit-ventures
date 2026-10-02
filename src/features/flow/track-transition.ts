import type { AnalyticsEvent } from '../../analytics/event-types.ts'
import type { FlowAction, FlowState } from './flow-state.ts'

export type PendingEvent = Omit<AnalyticsEvent, 'at'>

export function eventsForTransition(
  prev: FlowState,
  next: FlowState,
  action: FlowAction,
): PendingEvent[] {
  const sessionId = next.sessionId
  const sessionKind = next.kind ?? 'none'

  switch (action.type) {
    case 'start-decision':
      return [
        {
          name: 'decision_intent_selected',
          sessionId: next.sessionId,
          sessionKind: 'decision',
        },
      ]
    case 'start-sample':
      return [
        { name: 'sample_path_selected', sessionId: next.sessionId, sessionKind: 'sample' },
        { name: 'calculation_viewed', sessionId: next.sessionId, sessionKind: 'sample' },
        { name: 'valid_card_reached', sessionId: next.sessionId, sessionKind: 'sample' },
      ]
    case 'continue-reason':
      if (prev.step === 'reason' && next.step === 'inputs' && next.reason) {
        return [{ name: 'reason_selected', sessionId, sessionKind, reason: next.reason }]
      }
      return []
    case 'submit-inputs':
      if (prev.step !== 'inputs') return []
      if (next.step === 'inputs') return [{ name: 'inputs_rejected', sessionId, sessionKind }]
      if (next.step === 'confirm-amount') return [{ name: 'inputs_submitted', sessionId, sessionKind }]
      if (next.step === 'impact') {
        return [
          { name: 'inputs_submitted', sessionId, sessionKind },
          { name: 'valid_card_reached', sessionId, sessionKind },
          { name: 'calculation_viewed', sessionId, sessionKind },
        ]
      }
      return []
    case 'confirm-amount':
      if (prev.step === 'confirm-amount' && next.step === 'impact') {
        return [
          { name: 'valid_card_reached', sessionId, sessionKind },
          { name: 'calculation_viewed', sessionId, sessionKind },
        ]
      }
      return []
    case 'continue-choice':
      if (prev.step === 'choice' && next.step === 'comprehension' && next.choice) {
        return [{ name: 'choice_recorded', sessionId, sessionKind, choice: next.choice }]
      }
      return []
    case 'submit-comprehension': {
      if (prev.step !== 'comprehension' || !prev.finalResult) return []
      const events: PendingEvent[] = [
        {
          name: 'comprehension_attempted',
          sessionId,
          sessionKind,
          passed: next.comprehensionPassed,
        },
      ]
      if (next.step === 'recap') {
        events.push(
          { name: 'comprehension_passed', sessionId, sessionKind, passed: true },
          { name: 'recap_viewed', sessionId, sessionKind },
        )
      }
      return events
    }
    case 'leave':
      if (prev.kind && prev.step !== 'entry' && prev.step !== 'recap') {
        return [
          {
            name: 'flow_abandoned',
            sessionId: prev.sessionId,
            sessionKind: prev.kind,
          },
        ]
      }
      return []
    case 'back':
      if (next.step === 'entry' && prev.kind && prev.step !== 'entry') {
        return [
          {
            name: 'flow_abandoned',
            sessionId: prev.sessionId,
            sessionKind: prev.kind,
          },
        ]
      }
      return []
    default:
      return []
  }
}
