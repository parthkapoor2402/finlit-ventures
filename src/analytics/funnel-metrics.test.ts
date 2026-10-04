import { describe, expect, it } from 'vitest'
import type { AnalyticsEvent } from './event-types.ts'
import {
  calculatorErrorRate,
  choiceCounts,
  decisionAbandonmentCount,
  informedChoiceRate,
  pauseChoicesForReason,
  sampleSessionCount,
} from './funnel-metrics.ts'

function event(partial: Omit<AnalyticsEvent, 'at'> & { at?: number }): AnalyticsEvent {
  return { at: partial.at ?? 1, ...partial }
}

describe('informedChoiceRate', () => {
  it('counts a decision session only when the informed-choice events are present', () => {
    const events = [
      event({ name: 'valid_card_reached', sessionId: 'd1', sessionKind: 'decision' }),
      event({ name: 'reason_selected', sessionId: 'd1', sessionKind: 'decision', reason: 'cash_need' }),
      event({ name: 'calculation_viewed', sessionId: 'd1', sessionKind: 'decision' }),
      event({ name: 'choice_recorded', sessionId: 'd1', sessionKind: 'decision', choice: 'pause' }),
      event({ name: 'comprehension_passed', sessionId: 'd1', sessionKind: 'decision' }),
      event({ name: 'valid_card_reached', sessionId: 'd2', sessionKind: 'decision' }),
      event({ name: 'valid_card_reached', sessionId: 's1', sessionKind: 'sample' }),
      event({ name: 'reason_selected', sessionId: 's1', sessionKind: 'sample', reason: 'market_worry' }),
      event({ name: 'calculation_viewed', sessionId: 's1', sessionKind: 'sample' }),
      event({ name: 'choice_recorded', sessionId: 's1', sessionKind: 'sample', choice: 'reduce' }),
      event({ name: 'comprehension_passed', sessionId: 's1', sessionKind: 'sample' }),
    ]
    expect(informedChoiceRate(events)).toEqual({ numerator: 1, denominator: 2, rate: 0.5 })
    expect(sampleSessionCount(events)).toBe(0)
  })

  it('is null when no decision session has reached a valid card', () => {
    expect(
      informedChoiceRate([
        event({ name: 'sample_path_selected', sessionId: 's1', sessionKind: 'sample' }),
        event({ name: 'valid_card_reached', sessionId: 's1', sessionKind: 'sample' }),
      ]),
    ).toEqual({ numerator: 0, denominator: 0, rate: null })
    expect(
      sampleSessionCount([
        event({ name: 'sample_path_selected', sessionId: 's1', sessionKind: 'sample' }),
      ]),
    ).toBe(1)
  })

  it('does not put raw amounts on the event shape used by the fixtures', () => {
    const events = [
      event({ name: 'inputs_submitted', sessionId: 'd1', sessionKind: 'decision' }),
      event({ name: 'choice_recorded', sessionId: 'd1', sessionKind: 'decision', choice: 'keep' }),
    ]
    expect(JSON.stringify(events)).not.toContain('12000')
    expect(choiceCounts(events)).toEqual({ keep: 1, reduce: 0, pause: 0 })
  })

  it('counts the first choice per decision session and pauses by reason', () => {
    const events = [
      event({ name: 'reason_selected', sessionId: 'd1', sessionKind: 'decision', reason: 'cash_need' }),
      event({ name: 'choice_recorded', sessionId: 'd1', sessionKind: 'decision', choice: 'pause' }),
      event({ name: 'choice_recorded', sessionId: 'd1', sessionKind: 'decision', choice: 'keep' }),
      event({ name: 'flow_abandoned', sessionId: 'd2', sessionKind: 'decision' }),
      event({ name: 'flow_abandoned', sessionId: 's1', sessionKind: 'sample' }),
    ]
    expect(choiceCounts(events)).toEqual({ keep: 0, reduce: 0, pause: 1 })
    expect(pauseChoicesForReason(events, 'cash_need')).toBe(1)
    expect(decisionAbandonmentCount(events)).toBe(1)
  })

  it('calculates the calculator error rate from rejected and submitted inputs', () => {
    expect(calculatorErrorRate([])).toBeNull()
    expect(
      calculatorErrorRate([
        event({ name: 'inputs_rejected', sessionId: 'd1', sessionKind: 'decision' }),
        event({ name: 'inputs_submitted', sessionId: 'd1', sessionKind: 'decision' }),
        event({ name: 'inputs_submitted', sessionId: 'd2', sessionKind: 'decision' }),
      ]),
    ).toBeCloseTo(1 / 3)
  })
})
