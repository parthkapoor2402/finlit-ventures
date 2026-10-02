import { useState, type RefObject } from 'react'
import { ForwardButton } from '../../components/ForwardButton.tsx'
import { TextField } from '../../components/TextField.tsx'
import { track } from '../../analytics/track-event.ts'
import {
  CHOICE_COPY,
  DIFFERENCE_LABEL,
  DOES_NOT_CHANGE,
  HANDOFF,
  NOT_A_LOSS,
  REASON_LABELS,
  RESTART_COPY,
  SAMPLE_BANNER,
  UNITS_STAY,
  UNITS_UNKNOWN,
  reasonNote,
} from '../../domain/decision-rules.ts'
import { formatInrDigits } from '../../domain/money.ts'
import { contributionForChoice } from '../../domain/sip-calculator.ts'
import { REASONS, type Choice, type ContributionSuccess } from '../../domain/sip-types.ts'
import type { FlowAction, FlowState } from './flow-state.ts'

type Props = {
  state: FlowState
  dispatch: (action: FlowAction) => void
  headingRef: RefObject<HTMLHeadingElement | null>
}

function Heading({
  headingRef,
  children,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>
  children: string
}) {
  return (
    <h1
      ref={headingRef}
      tabIndex={-1}
      className="font-serif text-[2rem] leading-tight font-medium tracking-tight"
    >
      {children}
    </h1>
  )
}

function optionClass(selected: boolean): string {
  return [
    'flex min-h-12 cursor-pointer items-start gap-3 border-2 bg-card px-4 py-3 text-left transition-colors duration-150',
    selected ? 'border-forest' : 'border-line hover:border-ink/30',
  ].join(' ')
}

function NavRow({ dispatch, showBack }: { dispatch: Props['dispatch']; showBack: boolean }) {
  return (
    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
      {showBack ? (
        <button type="button" className="min-h-12 underline" onClick={() => dispatch({ type: 'back' })}>
          Back
        </button>
      ) : null}
      <button
        type="button"
        className="min-h-12 underline"
        onClick={() => dispatch({ type: 'leave' })}
      >
        Leave without choosing
      </button>
    </div>
  )
}

function SampleNote({ state }: { state: FlowState }) {
  if (state.kind !== 'sample') return null
  return (
    <p className="mb-6 border border-line bg-card px-4 py-3 text-sm leading-relaxed" role="note">
      {SAMPLE_BANNER}
    </p>
  )
}

function monthsPhrase(months: string): string {
  return months === '1' ? '1 month' : `${months} months`
}

function Figure({ result }: { result: ContributionSuccess }) {
  return (
    <div aria-live="polite" aria-atomic="true" data-testid="contribution-figure">
      <p className="figure font-serif text-5xl leading-none tracking-tight">
        {formatInrDigits(result.contributionDifference)}
      </p>
      <p className="mt-4 text-lg leading-snug">{DIFFERENCE_LABEL}</p>
      <p className="mt-4 text-muted leading-relaxed">
        Monthly amount {formatInrDigits(result.current)} compared with{' '}
        {formatInrDigits(result.proposed)}, over {monthsPhrase(result.months)}.
      </p>
    </div>
  )
}

function Explanations({ reason }: { reason: FlowState['reason'] }) {
  const note = reason ? reasonNote(reason) : null
  return (
    <ul className="mt-8 space-y-4 border-t border-line pt-6 leading-relaxed">
      {note ? <li>{note}</li> : null}
      <li>{NOT_A_LOSS}</li>
      <li>{UNITS_STAY}</li>
      <li>{UNITS_UNKNOWN}</li>
      <li>{DOES_NOT_CHANGE}</li>
      <li>{HANDOFF}</li>
    </ul>
  )
}

export function StepView({ state, dispatch, headingRef }: Props) {
  return (
    <>
      <SampleNote state={state} />
      {state.step === 'entry' ? <Entry headingRef={headingRef} dispatch={dispatch} /> : null}
      {state.step === 'reason' ? (
        <ReasonStep state={state} dispatch={dispatch} headingRef={headingRef} />
      ) : null}
      {state.step === 'inputs' ? (
        <InputsStep state={state} dispatch={dispatch} headingRef={headingRef} />
      ) : null}
      {state.step === 'confirm-amount' && state.preview ? (
        <ConfirmStep state={state} dispatch={dispatch} headingRef={headingRef} />
      ) : null}
      {state.step === 'impact' && state.preview ? (
        <ImpactStep state={state} dispatch={dispatch} headingRef={headingRef} />
      ) : null}
      {state.step === 'choice' && state.preview ? (
        <ChoiceStep state={state} dispatch={dispatch} headingRef={headingRef} />
      ) : null}
      {state.step === 'comprehension' && state.finalResult ? (
        <ComprehensionStep state={state} dispatch={dispatch} headingRef={headingRef} />
      ) : null}
      {state.step === 'recap' && state.finalResult && state.reason && state.choice ? (
        <RecapStep state={state} dispatch={dispatch} headingRef={headingRef} />
      ) : null}
    </>
  )
}

function Entry({
  headingRef,
  dispatch,
}: {
  headingRef: Props['headingRef']
  dispatch: Props['dispatch']
}) {
  return (
    <>
      <Heading headingRef={headingRef}>
        Before you change your SIP, see the contribution difference.
      </Heading>
      <p className="mt-4 leading-relaxed">
        Skip Check compares contributions you would not invest if you keep, reduce, or pause one
        SIP. It does not change the SIP. You finish any action in your own investing app.
      </p>
      <div className="mt-8 grid gap-3">
        <button
          type="button"
          className="min-h-12 border-2 border-line bg-card px-4 py-4 text-left"
          onClick={() =>
            dispatch({ type: 'start-decision', sessionId: crypto.randomUUID() })
          }
        >
          <span className="block font-serif text-xl">I'm about to change a SIP</span>
          <span className="mt-1 block text-muted">
            I have not confirmed the change in my own app.
          </span>
        </button>
        <button
          type="button"
          className="min-h-12 border-2 border-line bg-card px-4 py-4 text-left"
          onClick={() => dispatch({ type: 'start-sample', sessionId: crypto.randomUUID() })}
        >
          <span className="block font-serif text-xl">I'm only reading</span>
          <span className="mt-1 block text-muted">
            Show an illustrative sample. It is not counted as a decision.
          </span>
        </button>
      </div>
    </>
  )
}

function ReasonStep({ state, dispatch, headingRef }: Props) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        dispatch({ type: 'continue-reason' })
      }}
    >
      <Heading headingRef={headingRef}>What's making you consider this change?</Heading>
      <div className="mt-6 grid gap-3" role="radiogroup" aria-labelledby="reason-legend">
        <p id="reason-legend" className="sr-only">
          What's making you consider this change?
        </p>
        {REASONS.map((reason) => (
          <label key={reason} className={optionClass(state.reason === reason)}>
            <input
              className="mt-1 size-5 shrink-0"
              type="radio"
              name="reason"
              value={reason}
              checked={state.reason === reason}
              onChange={() => dispatch({ type: 'set-reason', reason })}
            />
            <span>{REASON_LABELS[reason]}</span>
          </label>
        ))}
      </div>
      {state.fieldErrors.reason ? (
        <p role="alert" className="mt-4 text-sm text-error">
          {state.fieldErrors.reason}
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted">Choose one reason. You can change it later.</p>
      )}
      <ForwardButton>Continue</ForwardButton>
      <NavRow dispatch={dispatch} showBack />
    </form>
  )
}

function InputsStep({ state, dispatch, headingRef }: Props) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        dispatch({ type: 'submit-inputs' })
      }}
    >
      <Heading headingRef={headingRef}>Amounts for this SIP</Heading>
      <p className="mt-4 leading-relaxed">
        Use the SIP you are about to change. If you hold more than one, this is not the total.
      </p>
      <TextField
        id="current-sip"
        label="Current monthly SIP"
        hint="Whole rupees for this SIP only."
        value={state.currentRaw}
        error={state.fieldErrors.current}
        onChange={(value) => dispatch({ type: 'set-field', field: 'currentRaw', value })}
      />
      <TextField
        id="proposed-sip"
        label="Monthly amount you are considering"
        hint="Use 0 for a pause. Raising a SIP is not part of this check."
        value={state.proposedRaw}
        error={state.fieldErrors.proposed}
        onChange={(value) => dispatch({ type: 'set-field', field: 'proposedRaw', value })}
      />
      <TextField
        id="months"
        label="Months to compare"
        hint="A whole number from 1 to 24."
        value={state.monthsRaw}
        error={state.fieldErrors.months}
        onChange={(value) => dispatch({ type: 'set-field', field: 'monthsRaw', value })}
      />
      <ForwardButton>See the comparison</ForwardButton>
      <NavRow dispatch={dispatch} showBack />
    </form>
  )
}

function ConfirmStep({ state, dispatch, headingRef }: Props) {
  const preview = state.preview
  if (!preview) return null
  return (
    <>
      <Heading headingRef={headingRef}>Check the digits</Heading>
      <p className="mt-4 leading-relaxed">
        You entered a monthly amount above ₹10,00,000. This checks for a typing error. It is not a
        statement about a typical SIP. The comparison stays hidden until you confirm the digits.
      </p>
      <dl className="mt-6 space-y-4">
        <div>
          <dt className="text-sm text-muted">Current monthly SIP</dt>
          <dd className="figure font-serif text-2xl">{formatInrDigits(preview.current)}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Monthly amount you are considering</dt>
          <dd className="figure font-serif text-2xl">{formatInrDigits(preview.proposed)}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Months</dt>
          <dd className="font-serif text-2xl">{monthsPhrase(preview.months)}</dd>
        </div>
      </dl>
      <button
        type="button"
        className="mt-8 w-full min-h-12 border-2 border-line bg-card px-4 py-3"
        onClick={() => dispatch({ type: 'cancel-amount' })}
      >
        Change the amounts
      </button>
      <button
        type="button"
        className="mt-3 w-full min-h-12 bg-forest px-4 py-3 font-semibold text-paper"
        onClick={() => dispatch({ type: 'confirm-amount' })}
      >
        These digits are right
      </button>
      <NavRow dispatch={dispatch} showBack={false} />
    </>
  )
}

function ImpactStep({ state, dispatch, headingRef }: Props) {
  if (!state.preview) return null
  return (
    <>
      <Heading headingRef={headingRef}>Contribution comparison</Heading>
      <div className="mt-6">
        <Figure result={state.preview} />
      </div>
      <Explanations reason={state.reason} />
      <button
        type="button"
        className="mt-8 w-full min-h-12 bg-forest px-4 py-3 font-semibold text-paper"
        onClick={() => dispatch({ type: 'continue-impact' })}
      >
        Continue
      </button>
      <NavRow dispatch={dispatch} showBack />
    </>
  )
}

const CHOICES: Choice[] = ['keep', 'reduce', 'pause']

function ChoiceStep({ state, dispatch, headingRef }: Props) {
  const preview = state.preview
  if (!preview) return null
  const live =
    state.choice === null
      ? null
      : contributionForChoice(
          preview.current,
          state.choice === 'reduce' ? state.reduceDraft : preview.proposed,
          preview.months,
          state.choice,
        )

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        dispatch({ type: 'continue-choice' })
      }}
    >
      <Heading headingRef={headingRef}>What you might do in your own app</Heading>
      <p className="mt-4 leading-relaxed">
        Keep, reduce, and pause are recorded the same way. Skip Check does not choose for you.
      </p>
      <div className="mt-6 grid gap-3" role="radiogroup" aria-labelledby="choice-legend">
        <p id="choice-legend" className="sr-only">
          What you might do in your own app
        </p>
        {CHOICES.map((choice) => (
          <label key={choice} className={optionClass(state.choice === choice)}>
            <input
              className="mt-1 size-5 shrink-0"
              type="radio"
              name="choice"
              value={choice}
              checked={state.choice === choice}
              onChange={() => dispatch({ type: 'select-choice', choice })}
            />
            <span>
              <span className="block font-serif text-xl">{CHOICE_COPY[choice].title}</span>
              <span className="mt-1 block text-muted">{CHOICE_COPY[choice].body}</span>
            </span>
          </label>
        ))}
      </div>
      {state.choice === 'reduce' ? (
        <TextField
          id="reduce-amount"
          label="Monthly amount after the reduction"
          hint="Greater than zero, and below the current SIP."
          value={state.reduceDraft}
          error={state.fieldErrors.choice}
          onChange={(value) => dispatch({ type: 'set-reduce-draft', value })}
        />
      ) : null}
      {state.choice === 'pause' ? (
        <TextField
          id="restart-month"
          label="Restart month, if you want to note one"
          hint={RESTART_COPY}
          inputMode="text"
          value={state.restartMonth}
          onChange={(value) => dispatch({ type: 'set-restart', value })}
        />
      ) : null}
      {state.choice !== 'reduce' && state.fieldErrors.choice ? (
        <p role="alert" className="mt-4 text-sm text-error">
          {state.fieldErrors.choice}
        </p>
      ) : null}
      {live?.ok ? (
        <div className="mt-8 border-t border-line pt-6">
          <Figure result={live} />
        </div>
      ) : null}
      <ForwardButton>Continue</ForwardButton>
      <NavRow dispatch={dispatch} showBack />
    </form>
  )
}

function ComprehensionStep({ state, dispatch, headingRef }: Props) {
  const result = state.finalResult
  if (!result) return null
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        dispatch({ type: 'submit-comprehension' })
      }}
    >
      <Heading headingRef={headingRef}>Restate the comparison</Heading>
      <p className="mt-4 leading-relaxed">
        This checks that the figure was clear. It is not a test of your financial knowledge.
      </p>
      <div className="mt-6">
        <Figure result={result} />
      </div>
      <fieldset className="mt-8">
        <legend className="font-semibold">Which statement matches the figure?</legend>
        <div className="mt-3 grid gap-3">
          <label className={optionClass(state.rupeeAnswer === 'contributions')}>
            <input
              className="mt-1 size-5 shrink-0"
              type="radio"
              name="rupee"
              value="contributions"
              checked={state.rupeeAnswer === 'contributions'}
              onChange={() => dispatch({ type: 'set-rupee-answer', value: 'contributions' })}
            />
            <span>It is contributions that would not be invested under these inputs.</span>
          </label>
          <label className={optionClass(state.rupeeAnswer === 'loss')}>
            <input
              className="mt-1 size-5 shrink-0"
              type="radio"
              name="rupee"
              value="loss"
              checked={state.rupeeAnswer === 'loss'}
              onChange={() => dispatch({ type: 'set-rupee-answer', value: 'loss' })}
            />
            <span>It is a loss the change would cause.</span>
          </label>
          <label className={optionClass(state.rupeeAnswer === 'return')}>
            <input
              className="mt-1 size-5 shrink-0"
              type="radio"
              name="rupee"
              value="return"
              checked={state.rupeeAnswer === 'return'}
              onChange={() => dispatch({ type: 'set-rupee-answer', value: 'return' })}
            />
            <span>It is a return those contributions would earn.</span>
          </label>
        </div>
      </fieldset>
      <fieldset className="mt-8">
        <legend className="font-semibold">What happens to units you already hold?</legend>
        <div className="mt-3 grid gap-3">
          <label className={optionClass(state.unitsAnswer === 'stay')}>
            <input
              className="mt-1 size-5 shrink-0"
              type="radio"
              name="units"
              value="stay"
              checked={state.unitsAnswer === 'stay'}
              onChange={() => dispatch({ type: 'set-units-answer', value: 'stay' })}
            />
            <span>Existing units stay invested unless I redeem them in my own app.</span>
          </label>
          <label className={optionClass(state.unitsAnswer === 'sold')}>
            <input
              className="mt-1 size-5 shrink-0"
              type="radio"
              name="units"
              value="sold"
              checked={state.unitsAnswer === 'sold'}
              onChange={() => dispatch({ type: 'set-units-answer', value: 'sold' })}
            />
            <span>The SIP change itself sells the units I already hold.</span>
          </label>
        </div>
      </fieldset>
      {state.comprehensionNote ? (
        <p role="status" className="mt-6 leading-relaxed">
          {state.comprehensionNote}
        </p>
      ) : null}
      <ForwardButton>Show the recap</ForwardButton>
      <NavRow dispatch={dispatch} showBack />
    </form>
  )
}

function RecapStep({ state, dispatch, headingRef }: Props) {
  const result = state.finalResult
  const reason = state.reason
  const choice = state.choice
  if (!result || !reason || !choice) return null
  const kind = state.kind ?? 'none'
  return (
    <>
      <Heading headingRef={headingRef}>Your recap</Heading>
      <p className="mt-4 leading-relaxed">
        This is a record of what you entered. It is not an order, and nothing has been changed.
      </p>
      <dl className="mt-6 space-y-4">
        <div>
          <dt className="text-sm text-muted">Reason</dt>
          <dd>{REASON_LABELS[reason]}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Choice</dt>
          <dd>{CHOICE_COPY[choice].title}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Current monthly SIP</dt>
          <dd className="figure">{formatInrDigits(result.current)}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Proposed monthly SIP</dt>
          <dd className="figure">{formatInrDigits(result.proposed)}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Comparison period</dt>
          <dd>{monthsPhrase(result.months)}</dd>
        </div>
        {choice === 'pause' && state.restartMonth.trim() ? (
          <div>
            <dt className="text-sm text-muted">Restart month you noted</dt>
            <dd>{state.restartMonth.trim()}</dd>
          </div>
        ) : null}
      </dl>
      <div className="mt-8">
        <Figure result={result} />
      </div>
      <ul className="mt-8 space-y-4 border-t border-line pt-6 leading-relaxed">
        <li>{UNITS_STAY}</li>
        <li>{UNITS_UNKNOWN}</li>
        <li>{NOT_A_LOSS}</li>
        <li>{DOES_NOT_CHANGE}</li>
        <li>{HANDOFF}</li>
        {choice === 'pause' ? <li>{RESTART_COPY}</li> : null}
      </ul>
      <YesNo
        legend="Did this page push you toward one option?"
        onAnswer={(answer) =>
          track({
            name: 'pressure_reported',
            sessionId: state.sessionId,
            sessionKind: kind,
            answer,
          })
        }
      />
      <YesNo
        legend="Was the comparison useful?"
        onAnswer={(answer) =>
          track({
            name: 'usefulness_reported',
            sessionId: state.sessionId,
            sessionKind: kind,
            answer,
          })
        }
      />
      <button
        type="button"
        className="mt-8 w-full min-h-12 border-2 border-line bg-card px-4 py-3"
        onClick={() => dispatch({ type: 'leave' })}
      >
        Start again
      </button>
    </>
  )
}

function YesNo({
  legend,
  onAnswer,
}: {
  legend: string
  onAnswer: (answer: 'yes' | 'no') => void
}) {
  const [answered, setAnswered] = useState<'yes' | 'no' | null>(null)
  function choose(answer: 'yes' | 'no') {
    if (answered) return
    setAnswered(answer)
    onAnswer(answer)
  }
  return (
    <fieldset className="mt-8">
      <legend>{legend}</legend>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {(['yes', 'no'] as const).map((answer) => (
          <button
            key={answer}
            type="button"
            aria-pressed={answered === answer}
            className="min-h-12 border-2 border-line bg-card"
            onClick={() => choose(answer)}
          >
            {answer === 'yes' ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
