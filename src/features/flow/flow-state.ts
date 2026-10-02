import { parseRemainingTarget } from '../../domain/plan-translation.ts'
import {
  calculateContributionDifference,
  contributionForChoice,
} from '../../domain/sip-calculator.ts'
import type { Choice, ContributionSuccess, Reason } from '../../domain/sip-types.ts'

export type Step =
  | 'entry'
  | 'reason'
  | 'inputs'
  | 'confirm-amount'
  | 'impact'
  | 'choice'
  | 'comprehension'
  | 'recap'

export type FieldErrors = {
  current?: string
  proposed?: string
  months?: string
  choice?: string
  reason?: string
  target?: string
}

export type FlowState = {
  step: Step
  kind: 'decision' | 'sample' | null
  sessionId: string | null
  reason: Reason | null
  currentRaw: string
  proposedRaw: string
  monthsRaw: string
  targetRaw: string
  amountConfirmed: boolean
  preview: ContributionSuccess | null
  choice: Choice | null
  finalResult: ContributionSuccess | null
  restartMonth: string
  reduceDraft: string
  fieldErrors: FieldErrors
  comprehensionNote: string | null
  comprehensionPassed: boolean
  rupeeAnswer: string
  unitsAnswer: string
}

export const initialFlowState: FlowState = {
  step: 'entry',
  kind: null,
  sessionId: null,
  reason: null,
  currentRaw: '',
  proposedRaw: '',
  monthsRaw: '',
  targetRaw: '',
  amountConfirmed: false,
  preview: null,
  choice: null,
  finalResult: null,
  restartMonth: '',
  reduceDraft: '',
  fieldErrors: {},
  comprehensionNote: null,
  comprehensionPassed: false,
  rupeeAnswer: '',
  unitsAnswer: '',
}

export type FlowAction =
  | { type: 'start-decision'; sessionId: string }
  | { type: 'start-sample'; sessionId: string }
  | { type: 'set-reason'; reason: Reason }
  | { type: 'continue-reason' }
  | { type: 'set-field'; field: 'currentRaw' | 'proposedRaw' | 'monthsRaw' | 'targetRaw'; value: string }
  | { type: 'submit-inputs' }
  | { type: 'confirm-amount' }
  | { type: 'cancel-amount' }
  | { type: 'continue-impact' }
  | { type: 'select-choice'; choice: Choice }
  | { type: 'set-restart'; value: string }
  | { type: 'set-reduce-draft'; value: string }
  | { type: 'continue-choice' }
  | { type: 'set-rupee-answer'; value: string }
  | { type: 'set-units-answer'; value: string }
  | { type: 'submit-comprehension' }
  | { type: 'back' }
  | { type: 'leave' }

function clearedAnswers(state: FlowState): FlowState {
  return {
    ...state,
    comprehensionNote: null,
    comprehensionPassed: false,
    rupeeAnswer: '',
    unitsAnswer: '',
    finalResult: null,
  }
}

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'start-decision':
      return {
        ...initialFlowState,
        step: 'reason',
        kind: 'decision',
        sessionId: action.sessionId,
      }
    case 'start-sample': {
      const preview = calculateContributionDifference({
        currentMonthlyAmount: '12000',
        proposedMonthlyAmount: '6000',
        months: '6',
      })
      if (!preview.ok) return state
      return {
        ...initialFlowState,
        step: 'impact',
        kind: 'sample',
        sessionId: action.sessionId,
        reason: 'market_worry',
        currentRaw: '12000',
        proposedRaw: '6000',
        monthsRaw: '6',
        preview,
      }
    }
    case 'set-reason':
      return clearedAnswers({ ...state, reason: action.reason, choice: null, fieldErrors: {} })
    case 'continue-reason':
      if (!state.reason) {
        return { ...state, fieldErrors: { reason: 'Choose one reason to continue.' } }
      }
      return { ...state, step: 'inputs', fieldErrors: {} }
    case 'set-field':
      return clearedAnswers({
        ...state,
        [action.field]: action.value,
        amountConfirmed: false,
        preview: null,
        choice: null,
        reduceDraft: '',
        restartMonth: '',
        fieldErrors: {},
      })
    case 'submit-inputs': {
      const result = calculateContributionDifference({
        currentMonthlyAmount: state.currentRaw,
        proposedMonthlyAmount: state.proposedRaw,
        months: state.monthsRaw,
      })
      if (!result.ok) {
        return {
          ...state,
          fieldErrors: { [result.field]: result.message },
          preview: null,
        }
      }
      const target = parseRemainingTarget(state.targetRaw)
      if (!target.ok) {
        return {
          ...state,
          fieldErrors: { target: target.message },
          preview: null,
        }
      }
      if (result.confirmationRequired && !state.amountConfirmed) {
        return { ...state, preview: result, fieldErrors: {}, step: 'confirm-amount' }
      }
      return {
        ...clearedAnswers(state),
        preview: result,
        fieldErrors: {},
        step: 'impact',
        choice: null,
        reduceDraft: '',
        restartMonth: '',
      }
    }
    case 'confirm-amount':
      if (!state.preview) return state
      return { ...state, amountConfirmed: true, step: 'impact' }
    case 'cancel-amount':
      return { ...state, step: 'inputs', amountConfirmed: false, preview: null }
    case 'continue-impact':
      if (!state.preview || state.step !== 'impact') return state
      return { ...state, step: 'choice', fieldErrors: {} }
    case 'select-choice': {
      const draft =
        action.choice === 'reduce'
          ? state.reduceDraft || (state.preview?.mode === 'reduce' ? state.preview.proposed : '')
          : ''
      return {
        ...state,
        choice: action.choice,
        fieldErrors: {},
        restartMonth: action.choice === 'keep' ? '' : state.restartMonth,
        reduceDraft: draft,
      }
    }
    case 'set-restart':
      return { ...state, restartMonth: action.value }
    case 'set-reduce-draft':
      return { ...state, reduceDraft: action.value, fieldErrors: {} }
    case 'continue-choice': {
      if (!state.preview || !state.choice) {
        return { ...state, fieldErrors: { choice: 'Choose keep, reduce, or pause.' } }
      }
      const proposed = state.choice === 'reduce' ? state.reduceDraft : state.preview.proposed
      const result = contributionForChoice(
        state.preview.current,
        proposed,
        state.preview.months,
        state.choice,
      )
      if (!result.ok) {
        return { ...state, fieldErrors: { choice: result.message } }
      }
      return {
        ...state,
        finalResult: result,
        fieldErrors: {},
        step: 'comprehension',
        comprehensionNote: null,
        comprehensionPassed: false,
        rupeeAnswer: '',
        unitsAnswer: '',
      }
    }
    case 'set-rupee-answer':
      return { ...state, rupeeAnswer: action.value, comprehensionNote: null }
    case 'set-units-answer':
      return { ...state, unitsAnswer: action.value, comprehensionNote: null }
    case 'submit-comprehension': {
      if (!state.finalResult) return state
      if (!state.rupeeAnswer || !state.unitsAnswer) {
        return {
          ...state,
          comprehensionPassed: false,
          comprehensionNote:
            'Choose one statement for the figure, and one for the units you already hold. You can change either answer.',
        }
      }
      const rupeeCorrect = state.rupeeAnswer === 'contributions'
      const unitsCorrect = state.unitsAnswer === 'stay'
      if (rupeeCorrect && unitsCorrect) {
        return { ...state, comprehensionPassed: true, comprehensionNote: null, step: 'recap' }
      }
      return {
        ...state,
        comprehensionPassed: false,
        comprehensionNote:
          'The figure is contributions that would not be invested under these inputs. It is not a loss or a return. Existing units stay invested unless you redeem them in your own app.',
      }
    }
    case 'back': {
      const previous: Partial<Record<Step, Step>> = {
        reason: 'entry',
        inputs: 'reason',
        'confirm-amount': 'inputs',
        impact: 'inputs',
        choice: 'impact',
        comprehension: 'choice',
        recap: 'comprehension',
      }
      const step = previous[state.step]
      if (!step) return state
      if (step === 'entry') return { ...initialFlowState }
      return { ...state, step, comprehensionPassed: false, comprehensionNote: null }
    }
    case 'leave':
      return { ...initialFlowState }
    default:
      return state
  }
}
