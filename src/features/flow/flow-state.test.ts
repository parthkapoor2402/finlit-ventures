import { describe, expect, it } from 'vitest'
import { flowReducer, initialFlowState, type FlowAction, type FlowState } from './flow-state.ts'

function apply(actions: FlowAction[], start: FlowState = initialFlowState): FlowState {
  return actions.reduce((state, action) => flowReducer(state, action), start)
}

describe('flowReducer', () => {
  it('opens the sample on the ₹36,000 comparison and can leave it', () => {
    const state = apply([{ type: 'start-sample', sessionId: 's1' }])
    expect(state.step).toBe('impact')
    expect(state.kind).toBe('sample')
    expect(state.preview?.contributionDifference).toBe('36000')
    expect(apply([{ type: 'leave' }], state)).toEqual(initialFlowState)
  })

  it('hides a high-amount result when confirmation is cancelled', () => {
    const state = apply([
      { type: 'start-decision', sessionId: 'd1' },
      { type: 'set-reason', reason: 'cash_need' },
      { type: 'continue-reason' },
      { type: 'set-field', field: 'currentRaw', value: '1000001' },
      { type: 'set-field', field: 'proposedRaw', value: '0' },
      { type: 'set-field', field: 'monthsRaw', value: '6' },
      { type: 'submit-inputs' },
    ])
    expect(state.step).toBe('confirm-amount')
    expect(state.preview?.confirmationRequired).toBe(true)
    const cancelled = flowReducer(state, { type: 'cancel-amount' })
    expect(cancelled.step).toBe('inputs')
    expect(cancelled.preview).toBeNull()
    expect(cancelled.amountConfirmed).toBe(false)
  })

  it('rejects a contribution target that is not a whole-rupee figure and does not invent one when blank', () => {
    const rejected = apply([
      { type: 'start-decision', sessionId: 'd1' },
      { type: 'set-reason', reason: 'goal_reached' },
      { type: 'continue-reason' },
      { type: 'set-field', field: 'currentRaw', value: '12000' },
      { type: 'set-field', field: 'proposedRaw', value: '6000' },
      { type: 'set-field', field: 'monthsRaw', value: '6' },
      { type: 'set-field', field: 'targetRaw', value: '12.5' },
      { type: 'submit-inputs' },
    ])
    expect(rejected.step).toBe('inputs')
    expect(rejected.preview).toBeNull()
    expect(rejected.fieldErrors.target).toMatch(/digits only/)
    const blankTarget = apply(
      [
        { type: 'set-field', field: 'targetRaw', value: '' },
        { type: 'submit-inputs' },
      ],
      rejected,
    )
    expect(blankTarget.step).toBe('impact')
    expect(blankTarget.preview?.contributionDifference).toBe('36000')
    expect(blankTarget.targetRaw).toBe('')
  })

  it('rejects invalid input without a preview and accepts a correction', () => {
    let state = apply([
      { type: 'start-decision', sessionId: 'd1' },
      { type: 'set-reason', reason: 'market_worry' },
      { type: 'continue-reason' },
      { type: 'submit-inputs' },
    ])
    expect(state.step).toBe('inputs')
    expect(state.preview).toBeNull()
    expect(state.fieldErrors.current).toBeTruthy()
    state = apply(
      [
        { type: 'set-field', field: 'currentRaw', value: '12000' },
        { type: 'set-field', field: 'proposedRaw', value: '6000' },
        { type: 'set-field', field: 'monthsRaw', value: '6' },
        { type: 'submit-inputs' },
      ],
      state,
    )
    expect(state.step).toBe('impact')
    expect(state.preview?.contributionDifference).toBe('36000')
  })

  it('walks keep, reduce, and pause to a recap without recommending one', () => {
    const base: FlowAction[] = [
      { type: 'start-decision', sessionId: 'd1' },
      { type: 'set-reason', reason: 'not_sure' },
      { type: 'continue-reason' },
      { type: 'set-field', field: 'currentRaw', value: '12000' },
      { type: 'set-field', field: 'proposedRaw', value: '6000' },
      { type: 'set-field', field: 'monthsRaw', value: '6' },
      { type: 'submit-inputs' },
      { type: 'continue-impact' },
    ]
    const keep = apply([...base, { type: 'select-choice', choice: 'keep' }, { type: 'continue-choice' }])
    expect(keep.finalResult).toMatchObject({ mode: 'keep', contributionDifference: '0' })
    const reduce = apply([
      ...base,
      { type: 'select-choice', choice: 'reduce' },
      { type: 'continue-choice' },
    ])
    expect(reduce.finalResult).toMatchObject({ mode: 'reduce', contributionDifference: '36000' })
    const pause = apply([
      ...base,
      { type: 'select-choice', choice: 'pause' },
      { type: 'set-restart', value: 'June' },
      { type: 'continue-choice' },
      { type: 'set-rupee-answer', value: 'contributions' },
      { type: 'set-units-answer', value: 'stay' },
      { type: 'submit-comprehension' },
    ])
    expect(pause.step).toBe('recap')
    expect(pause.finalResult).toMatchObject({ mode: 'pause', contributionDifference: '72000' })
    expect(pause.restartMonth).toBe('June')
    expect(pause.reason).toBe('not_sure')
  })

  it('stays on the comprehension step when the restatement does not match', () => {
    const state = apply([
      { type: 'start-decision', sessionId: 'd1' },
      { type: 'set-reason', reason: 'cash_need' },
      { type: 'continue-reason' },
      { type: 'set-field', field: 'currentRaw', value: '12000' },
      { type: 'set-field', field: 'proposedRaw', value: '0' },
      { type: 'set-field', field: 'monthsRaw', value: '1' },
      { type: 'submit-inputs' },
      { type: 'continue-impact' },
      { type: 'select-choice', choice: 'pause' },
      { type: 'continue-choice' },
      { type: 'set-rupee-answer', value: 'loss' },
      { type: 'set-units-answer', value: 'sold' },
      { type: 'submit-comprehension' },
    ])
    expect(state.step).toBe('comprehension')
    expect(state.comprehensionPassed).toBe(false)
    expect(state.comprehensionNote).toMatch(/not a loss/)
    const passed = apply(
      [
        { type: 'set-rupee-answer', value: 'contributions' },
        { type: 'set-units-answer', value: 'stay' },
        { type: 'submit-comprehension' },
      ],
      state,
    )
    expect(passed.step).toBe('recap')
  })

  it('returns to the inputs when the person edits after the comparison', () => {
    const shown = apply([
      { type: 'start-decision', sessionId: 'd1' },
      { type: 'set-reason', reason: 'goal_reached' },
      { type: 'continue-reason' },
      { type: 'set-field', field: 'currentRaw', value: '12000' },
      { type: 'set-field', field: 'proposedRaw', value: '6000' },
      { type: 'set-field', field: 'monthsRaw', value: '24' },
      { type: 'submit-inputs' },
    ])
    expect(shown.preview?.contributionDifference).toBe('144000')
    const edited = apply(
      [
        { type: 'back' },
        { type: 'set-field', field: 'proposedRaw', value: '8000' },
        { type: 'submit-inputs' },
      ],
      shown,
    )
    expect(edited.step).toBe('impact')
    expect(edited.preview?.contributionDifference).toBe('96000')
    expect(edited.reason).toBe('goal_reached')
  })
})
