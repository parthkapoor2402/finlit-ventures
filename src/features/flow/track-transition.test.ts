import { describe, expect, it } from 'vitest'
import type { AnalyticsEvent } from '../../analytics/event-types.ts'
import { informedChoiceRate } from '../../analytics/funnel-metrics.ts'
import { flowReducer, initialFlowState, type FlowAction, type FlowState } from './flow-state.ts'
import { eventsForTransition } from './track-transition.ts'

function run(actions: FlowAction[]) {
  let state: FlowState = initialFlowState
  const events: AnalyticsEvent[] = []
  for (const action of actions) {
    const next = flowReducer(state, action)
    for (const event of eventsForTransition(state, next, action)) {
      events.push({ ...event, at: events.length + 1 })
    }
    state = next
  }
  return { state, events }
}

const decisionPath: FlowAction[] = [
  { type: 'start-decision', sessionId: 'd1' },
  { type: 'set-reason', reason: 'market_worry' },
  { type: 'continue-reason' },
  { type: 'set-field', field: 'currentRaw', value: '12000' },
  { type: 'set-field', field: 'proposedRaw', value: '6000' },
  { type: 'set-field', field: 'monthsRaw', value: '6' },
  { type: 'submit-inputs' },
  { type: 'continue-impact' },
  { type: 'select-choice', choice: 'reduce' },
  { type: 'continue-choice' },
  { type: 'set-rupee-answer', value: 'contributions' },
  { type: 'set-units-answer', value: 'stay' },
  { type: 'submit-comprehension' },
]

describe('eventsForTransition', () => {
  it('records one informed choice and no raw amounts', () => {
    const { events } = run(decisionPath)
    expect(informedChoiceRate(events)).toEqual({ numerator: 1, denominator: 1, rate: 1 })
    expect(JSON.stringify(events)).not.toContain('12000')
    expect(JSON.stringify(events)).not.toContain('6000')
    expect(events.filter((event) => event.name === 'reason_selected')).toHaveLength(1)
    expect(events.filter((event) => event.name === 'choice_recorded')).toHaveLength(1)
  })

  it('does not emit a valid card for invalid input or a cancelled high amount', () => {
    const invalid = run([
      { type: 'start-decision', sessionId: 'd1' },
      { type: 'set-reason', reason: 'cash_need' },
      { type: 'continue-reason' },
      { type: 'submit-inputs' },
    ])
    expect(invalid.events.some((event) => event.name === 'valid_card_reached')).toBe(false)
    expect(invalid.events.some((event) => event.name === 'inputs_rejected')).toBe(true)

    const cancelled = run([
      { type: 'start-decision', sessionId: 'd1' },
      { type: 'set-reason', reason: 'cash_need' },
      { type: 'continue-reason' },
      { type: 'set-field', field: 'currentRaw', value: '1000001' },
      { type: 'set-field', field: 'proposedRaw', value: '0' },
      { type: 'set-field', field: 'monthsRaw', value: '6' },
      { type: 'submit-inputs' },
      { type: 'cancel-amount' },
    ])
    expect(cancelled.events.some((event) => event.name === 'valid_card_reached')).toBe(false)
    expect(cancelled.events.some((event) => event.name === 'inputs_submitted')).toBe(true)
    expect(JSON.stringify(cancelled.events)).not.toContain('1000001')
  })

  it('excludes the sample path from the decision denominator', () => {
    const { events } = run([
      { type: 'start-sample', sessionId: 's1' },
      ...decisionPath,
    ])
    expect(informedChoiceRate(events)).toEqual({ numerator: 1, denominator: 1, rate: 1 })
    expect(events.some((event) => event.name === 'sample_path_selected' && event.sessionKind === 'sample')).toBe(
      true,
    )
  })

  it('does not duplicate a reason event when continue is repeated, and records leaving', () => {
    const { events } = run([
      { type: 'start-decision', sessionId: 'd1' },
      { type: 'set-reason', reason: 'fund_no_longer_fits' },
      { type: 'continue-reason' },
      { type: 'continue-reason' },
      { type: 'back' },
      { type: 'back' },
    ])
    expect(events.filter((event) => event.name === 'reason_selected')).toHaveLength(1)
    expect(events.filter((event) => event.name === 'flow_abandoned')).toHaveLength(1)
  })
})
