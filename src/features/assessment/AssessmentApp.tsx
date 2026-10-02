import { useMemo, useState } from 'react'
import { trackAssessment } from '../../analytics/assessment-events.ts'
import { Shell } from '../../components/Shell.tsx'
import { TextField } from '../../components/TextField.tsx'
import {
  ASSESSMENT_REASONS,
  ASSESSMENT_REASON_LABELS,
  assessmentReasonLine,
  type AssessmentReason,
} from '../../domain/assessment-reasons.ts'
import { REGISTRATION_LINE } from '../../domain/decision-rules.ts'
import {
  KNOWLEDGE_QUESTIONS,
  allKnowledgeCorrect,
  gradeAnswer,
} from '../../domain/knowledge-check.ts'
import { formatInrDigits } from '../../domain/money.ts'
import { buildScenarios, defaultExploreAmount, type ScenarioCard } from '../../domain/scenarios.ts'
import { calculateContributionDifference } from '../../domain/sip-calculator.ts'
import type { Choice } from '../../domain/sip-types.ts'
import { BotPanel } from './BotPanel.tsx'
import {
  deleteRecap,
  dueRecaps,
  loadRecaps,
  reviewDateFor,
  saveRecap,
  updateRecap,
  type ReviewChoice,
  type SavedRecap,
} from './recap-store.ts'

type Step = 'welcome' | 'reason' | 'situation' | 'confirm' | 'scenarios' | 'knowledge' | 'recap'

const MILESTONES = [
  { id: 'situation', label: 'Understand my situation' },
  { id: 'scenarios', label: 'Explore my scenarios' },
  { id: 'knowledge', label: 'Check my understanding' },
  { id: 'recap', label: 'Save my recap' },
] as const

const CLARIFICATION =
  'This is the difference in planned contributions under your inputs. It is not an investment loss, a return forecast, or a prediction of future portfolio value.'

const NOT_CHANGED =
  'Skip Check has not changed your SIP. If you decide to make a change, review and complete it separately in your own investment application.'

function sessionId(): string {
  return `assess-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function inr(digits: string): string {
  return formatInrDigits(digits)
}

export function AssessmentApp() {
  const [step, setStep] = useState<Step>('welcome')
  const [kind, setKind] = useState<'decision' | 'sample'>('decision')
  const [id, setId] = useState('')
  const [reason, setReason] = useState<AssessmentReason | null>(null)
  const [reasonNote, setReasonNote] = useState('')
  const [currentRaw, setCurrentRaw] = useState('')
  const [proposedRaw, setProposedRaw] = useState('')
  const [monthsRaw, setMonthsRaw] = useState('6')
  const [undecided, setUndecided] = useState(false)
  const [immediateExpenses, setImmediateExpenses] = useState(false)
  const [goalTimeline, setGoalTimeline] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [pendingCurrent, setPendingCurrent] = useState('')
  const [pendingProposed, setPendingProposed] = useState('')
  const [pendingMonths, setPendingMonths] = useState('')
  const [exploreProposed, setExploreProposed] = useState('')
  const [exploreMonths, setExploreMonths] = useState('6')
  const [baselineProposed, setBaselineProposed] = useState('')
  const [baselineMonths, setBaselineMonths] = useState('6')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState<Record<string, { correct: boolean; explanation: string }>>({})
  const [consent, setConsent] = useState(false)
  const [note, setNote] = useState('')
  const [reviewChoice, setReviewChoice] = useState<ReviewChoice>('none')
  const [reviewDateInput, setReviewDateInput] = useState('')
  const [shareMisses, setShareMisses] = useState(false)
  const [recaps, setRecaps] = useState<SavedRecap[]>(() => loadRecaps())
  const [savedId, setSavedId] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [adjusted, setAdjusted] = useState(false)

  const scenarios = useMemo(() => {
    if (!pendingCurrent) return null
    return buildScenarios(pendingCurrent, exploreProposed || '0', exploreMonths)
  }, [pendingCurrent, exploreProposed, exploreMonths])

  const due = dueRecaps(recaps)
  const milestoneIndex = step === 'welcome' || step === 'reason' || step === 'situation' || step === 'confirm'
    ? 0
    : step === 'scenarios'
      ? 1
      : step === 'knowledge'
        ? 2
        : 3

  function begin(nextKind: 'decision' | 'sample') {
    const nextId = sessionId()
    setKind(nextKind)
    setId(nextId)
    setStep('reason')
    setFinished(false)
    trackAssessment({ name: 'assessment_started', sessionId: nextId, sessionKind: nextKind })
  }

  function submitReason() {
    if (!reason) {
      setFieldError('Choose one reason to continue.')
      return
    }
    setFieldError(null)
    trackAssessment({ name: 'reason_selected', sessionId: id, sessionKind: kind })
    setStep('situation')
  }

  function submitSituation() {
    const proposed = undecided ? currentRaw : proposedRaw
    const result = calculateContributionDifference({
      currentMonthlyAmount: currentRaw,
      proposedMonthlyAmount: undecided ? currentRaw : proposed,
      months: monthsRaw,
    })
    if (!result.ok) {
      setFieldError(
        result.code === 'increase'
          ? 'Increasing a SIP is outside this assessment. Enter the same amount, a lower amount, or 0 for a pause.'
          : result.message,
      )
      return
    }
    if (result.confirmationRequired) {
      setPendingCurrent(result.current)
      setPendingProposed(undecided ? defaultExploreAmount(result.current) : proposedRaw.replace(/\D/g, '') || result.proposed)
      setPendingMonths(result.months)
      setFieldError(null)
      setStep('confirm')
      return
    }
    enterScenarios(result.current, undecided ? defaultExploreAmount(result.current) : result.proposed, result.months)
  }

  function enterScenarios(current: string, proposed: string, months: string) {
    setPendingCurrent(current)
    setPendingProposed(proposed)
    setPendingMonths(months)
    setExploreProposed(proposed)
    setExploreMonths(months)
    setBaselineProposed(proposed)
    setBaselineMonths(months)
    setFieldError(null)
    setAdjusted(false)
    setStep('scenarios')
    trackAssessment({ name: 'inputs_completed', sessionId: id, sessionKind: kind })
    trackAssessment({ name: 'scenarios_viewed', sessionId: id, sessionKind: kind })
  }

  function onExplore(nextProposed: string, nextMonths: string) {
    setExploreProposed(nextProposed)
    setExploreMonths(nextMonths)
    if (!adjusted) {
      setAdjusted(true)
      trackAssessment({ name: 'scenario_adjusted', sessionId: id, sessionKind: kind })
    }
  }

  function answerQuestion(questionId: string, optionId: string) {
    const question = KNOWLEDGE_QUESTIONS.find((item) => item.id === questionId)
    if (!question) return
    const graded = gradeAnswer(question, optionId)
    const nextAnswers = { ...answers, [questionId]: optionId }
    setAnswers(nextAnswers)
    setFeedback({ ...feedback, [questionId]: graded })
    if (!graded.correct) {
      trackAssessment({ name: 'knowledge_check_retry', sessionId: id, sessionKind: kind })
    }
    if (allKnowledgeCorrect(nextAnswers)) {
      trackAssessment({ name: 'knowledge_check_completed', sessionId: id, sessionKind: kind })
    }
  }

  function save() {
    if (!consent || !scenarios || !scenarios.ok || !reason) return
    const idForRecap = savedId ?? `recap-${Date.now().toString(36)}`
    const stored: SavedRecap = {
      id: idForRecap,
      savedAt: new Date().toISOString(),
      reason,
      current: pendingCurrent,
      proposed: exploreProposed,
      months: exploreMonths,
      contributionDifference: differenceFor(scenarios.scenarios.explored, scenarios.scenarios),
      scenario: scenarios.scenarios.explored,
      immediateExpenses,
      goalTimeline,
      note,
      knowledgeComplete: allKnowledgeCorrect(answers),
      reviewChoice,
      reviewDate: reviewDateFor(reviewChoice, reviewDateInput),
    }
    setRecaps(saveRecap(stored))
    setSavedId(idForRecap)
    trackAssessment({ name: 'recap_saved', sessionId: id, sessionKind: kind })
    if (reviewChoice === 'none') {
      trackAssessment({ name: 'reminder_opted_out', sessionId: id, sessionKind: kind })
    } else {
      trackAssessment({ name: 'reminder_opted_in', sessionId: id, sessionKind: kind })
    }
  }

  const explored = scenarios && scenarios.ok ? scenarios.scenarios.explored : null
  const misses = KNOWLEDGE_QUESTIONS.filter((question) => feedback[question.id] && !feedback[question.id]?.correct).map(
    (question) => question.prompt,
  )

  return (
    <Shell wide>
      <p className="text-sm leading-relaxed text-muted">{REGISTRATION_LINE}</p>
      {due.length > 0 && step === 'welcome' ? (
        <p className="mt-4 rounded-2xl border border-line bg-card p-4 leading-relaxed" role="status">
          You chose to review your SIP plan around this time. Would you like to revisit your circumstances? This reminder stays in this browser. Skip Check does not email or message you.
        </p>
      ) : null}
      {step !== 'welcome' ? <Progress milestoneIndex={milestoneIndex} saved={savedId !== null} /> : null}
      {kind === 'sample' && step !== 'welcome' ? (
        <p className="mt-4 text-sm text-amber">You are exploring a sample. It is not a decision about your SIP.</p>
      ) : null}

      {step === 'welcome' ? (
        <section>
          <h1 className="mt-6 font-serif text-4xl leading-tight">Thinking of changing your SIP?</h1>
          <p className="mt-4 leading-relaxed">
            Take a short assessment to understand how different contribution choices affect your planned investing.
          </p>
          <p className="mt-3 text-sm text-muted">About 60–90 seconds. This is educational. It does not modify your SIP.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="min-h-12 rounded-full bg-forest px-5 text-card" onClick={() => begin('decision')}>
              Start my assessment
            </button>
            <button type="button" className="min-h-12 rounded-full border border-forest px-5" onClick={() => begin('sample')}>
              I’m just exploring
            </button>
          </div>
          <SavedList
            recaps={recaps}
            onDelete={(recapId) => {
              setRecaps(deleteRecap(recapId))
              trackAssessment({ name: 'recap_deleted', sessionId: id || null, sessionKind: kind })
            }}
            onNote={(recapId, nextNote) => setRecaps(updateRecap(recapId, { note: nextNote }))}
          />
        </section>
      ) : null}

      {step === 'reason' ? (
        <section>
          <h1 className="mt-6 font-serif text-3xl">What is making you reconsider your SIP?</h1>
          <fieldset className="mt-4">
            <legend className="sr-only">Reason</legend>
            <div className="flex flex-col gap-2">
              {ASSESSMENT_REASONS.map((item) => (
                <label key={item} className="flex min-h-12 items-center gap-3 rounded-2xl border border-line bg-card px-3">
                  <input
                    type="radio"
                    name="reason"
                    checked={reason === item}
                    onChange={() => {
                      setReason(item)
                      setFieldError(null)
                    }}
                  />
                  <span>{ASSESSMENT_REASON_LABELS[item]}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <TextField id="reason-note" label="Optional note" value={reasonNote} onChange={setReasonNote} inputMode="text" hint="You can leave this blank." />
          {reason ? <p className="mt-4 leading-relaxed">{assessmentReasonLine(reason)}</p> : null}
          {fieldError ? <p role="alert" className="mt-3 text-sm text-error">{fieldError}</p> : null}
          <Nav onBack={() => setStep('welcome')} onNext={submitReason} nextLabel="Continue" />
        </section>
      ) : null}

      {step === 'situation' ? (
        <section>
          <h1 className="mt-6 font-serif text-3xl">The amounts for this comparison</h1>
          <TextField id="current" label="Current monthly SIP" value={currentRaw} onChange={setCurrentRaw} hint="Whole rupees." error={undefined} />
          <TextField
            id="proposed"
            label="Proposed monthly SIP"
            value={proposedRaw}
            onChange={setProposedRaw}
            hint="Use 0 for a pause. Leave this only if you have not decided."
          />
          <label className="mt-4 flex min-h-12 items-center gap-3">
            <input type="checkbox" checked={undecided} onChange={(event) => setUndecided(event.target.checked)} />
            I haven't decided on an amount yet.
          </label>
          <TextField id="months" label="Months for this change" value={monthsRaw} onChange={setMonthsRaw} hint="From 1 to 24." />
          <TextField id="goal-timeline" label="Goal timeline, if you want to note one" value={goalTimeline} onChange={setGoalTimeline} inputMode="text" hint="Optional. This page does not move a goal date." />
          <label className="mt-4 flex min-h-12 items-center gap-3">
            <input type="checkbox" checked={immediateExpenses} onChange={(event) => setImmediateExpenses(event.target.checked)} />
            I need money for immediate expenses.
          </label>
          {fieldError ? <p role="alert" className="mt-3 text-sm text-error">{fieldError}</p> : null}
          <Nav onBack={() => setStep('reason')} onNext={submitSituation} nextLabel="See the scenarios" />
        </section>
      ) : null}

      {step === 'confirm' ? (
        <section>
          <h1 className="mt-6 font-serif text-3xl">Check these digits</h1>
          <p className="mt-4 leading-relaxed">An amount is above ₹10,00,000. Confirm it was entered correctly. Nothing is corrected for you.</p>
          <p className="mt-3 font-semibold">{inr(pendingCurrent)} current, {inr(pendingProposed || '0')} proposed, {pendingMonths} months.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="min-h-12 rounded-full bg-forest px-5 text-card" onClick={() => enterScenarios(pendingCurrent, pendingProposed || defaultExploreAmount(pendingCurrent), pendingMonths)}>
              The digits are right
            </button>
            <button type="button" className="min-h-12 rounded-full border border-line px-5" onClick={() => setStep('situation')}>
              Go back
            </button>
          </div>
        </section>
      ) : null}

      {step === 'scenarios' && scenarios?.ok ? (
        <section>
          <h1 className="mt-6 font-serif text-3xl">Three ways to read this period</h1>
          <p className="mt-3 leading-relaxed">Keep, reduce, and pause are shown the same way. None of them is marked as the better choice.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ScenarioArticle title="Keep" card={scenarios.scenarios.keep} body="Continue the current monthly contribution." />
            <ScenarioArticle
              title="Reduce"
              card={scenarios.scenarios.reduce}
              body="A monthly amount above ₹0 and below the current SIP."
              empty="Move the amount below the current SIP to see a reduction."
            />
            <ScenarioArticle title="Pause" card={scenarios.scenarios.pause} body="₹0 in planned monthly contributions during this period." />
          </div>
          <p className="mt-4 leading-relaxed">{CLARIFICATION}</p>
          <p className="mt-2 leading-relaxed">Existing units remain invested when future contributions are paused. Pausing does not redeem or sell them.</p>
          <WhatIf
            current={pendingCurrent}
            proposed={exploreProposed}
            months={exploreMonths}
            onChange={onExplore}
            onReset={() => onExplore(baselineProposed, baselineMonths)}
          />
          <ul className="mt-6 space-y-2 text-sm leading-relaxed text-muted">
            <li>A shorter pause means fewer months without new contributions.</li>
            <li>Reducing an SIP changes future contributions, not the units you already own.</li>
            <li>A contribution difference alone cannot tell you what your portfolio will be worth.</li>
            <li>The right choice depends on your financial circumstances and priorities.</li>
          </ul>
          <Nav onBack={() => setStep('situation')} onNext={() => setStep('knowledge')} nextLabel="Check my understanding" />
        </section>
      ) : null}

      {step === 'knowledge' ? (
        <section>
          <h1 className="mt-6 font-serif text-3xl">Check my understanding</h1>
          <p className="mt-3 leading-relaxed">These questions are about the ideas on this page, not about investment skill. A miss is something to reread, not a verdict.</p>
          {KNOWLEDGE_QUESTIONS.map((question) => (
            <fieldset key={question.id} className="mt-6 rounded-2xl border border-line bg-card p-4">
              <legend className="font-semibold">{question.prompt}</legend>
              <div className="mt-3 flex flex-col gap-2">
                {question.options.map((option) => (
                  <label key={option.id} className="flex min-h-12 items-center gap-3">
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => answerQuestion(question.id, option.id)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {feedback[question.id] ? (
                <p className="mt-3 text-sm leading-relaxed" role="status">
                  {feedback[question.id]?.correct ? 'That matches the explanation on this page. ' : 'Not quite. You can choose again. '}
                  {feedback[question.id]?.explanation}
                </p>
              ) : null}
            </fieldset>
          ))}
          <Nav
            onBack={() => setStep('scenarios')}
            onNext={() => setStep('recap')}
            nextLabel="See my recap"
          />
        </section>
      ) : null}

      {step === 'recap' && scenarios?.ok && reason ? (
        <section>
          <h1 className="mt-6 font-serif text-3xl">Assessment recap</h1>
          <article id="assessment-recap" className="mt-4 rounded-2xl border border-line bg-card p-4 leading-relaxed">
            <p>{ASSESSMENT_REASON_LABELS[reason]}</p>
            {reasonNote ? <p className="mt-2">{reasonNote}</p> : null}
            <p className="mt-2">Current monthly SIP: {inr(pendingCurrent)}</p>
            <p>Proposed monthly contribution: {inr(exploreProposed || '0')}</p>
            <p>Duration: {exploreMonths} months</p>
            <p>Scenario being explored: {labelChoice(explored)}</p>
            <p>Contribution difference: {inr(differenceFor(scenarios.scenarios.explored, scenarios.scenarios))}</p>
            <p className="mt-3">{CLARIFICATION}</p>
            <p className="mt-3">Three things this assessment covered: the contribution arithmetic, the difference between existing units and future contributions, and that Keep, Reduce, and Pause are all available.</p>
            <p className="mt-3">{NOT_CHANGED}</p>
          </article>
          <label className="mt-4 flex items-start gap-3">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            <span>Save this recap in this browser. It stores the reason, amounts, difference, quiz completion, an optional note, and an optional review month. It is not sent to an analytics service. You can delete it.</span>
          </label>
          <TextField id="recap-note" label="Optional note" value={note} onChange={setNote} inputMode="text" />
          <fieldset className="mt-4">
            <legend>Optional review in this browser</legend>
            <p className="mt-1 text-sm text-muted">Skip Check will not email, text, or push a reminder. If you return after the date, this page can show a neutral note.</p>
            {(['none', '1', '3', '6', 'date'] as const).map((choice) => (
              <label key={choice} className="mt-2 flex min-h-12 items-center gap-3">
                <input type="radio" name="review" checked={reviewChoice === choice} onChange={() => setReviewChoice(choice)} />
                <span>{choice === 'none' ? 'No review date' : choice === 'date' ? 'A date I choose' : `${choice} months`}</span>
              </label>
            ))}
            {reviewChoice === 'date' ? (
              <input className="mt-2 min-h-12 border-2 border-line bg-card px-3" type="date" value={reviewDateInput} onChange={(event) => setReviewDateInput(event.target.value)} />
            ) : null}
          </fieldset>
          <label className="mt-4 flex items-start gap-3">
            <input type="checkbox" checked={shareMisses} onChange={(event) => setShareMisses(event.target.checked)} />
            <span>If I chat, SIP Check may use a missed quiz idea to explain it. Leave this off to keep the quiz private.</span>
          </label>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="min-h-12 rounded-full bg-forest px-5 text-card" disabled={!consent} onClick={save}>
              Save my recap
            </button>
            <button
              type="button"
              className="min-h-12 rounded-full border border-line px-5"
              onClick={() => {
                setFinished(true)
                trackAssessment({ name: 'assessment_completed', sessionId: id, sessionKind: kind })
              }}
            >
              Finish for now
            </button>
          </div>
          {savedId ? <p className="mt-3 text-sm" role="status">Saved in this browser. You can delete it from the welcome screen.</p> : null}
          {finished ? <p className="mt-3 leading-relaxed">You can leave without chatting or saving.</p> : null}
          <BotPanel
            sessionId={id}
            sessionKind={kind}
            context={{
              reason,
              current: pendingCurrent,
              proposed: exploreProposed,
              months: exploreMonths,
              contributionDifference: differenceFor(scenarios.scenarios.explored, scenarios.scenarios),
              scenario: scenarios.scenarios.explored,
              misconceptions: shareMisses ? misses : [],
            }}
          />
          <Nav onBack={() => setStep('knowledge')} onNext={() => setStep('welcome')} nextLabel="Back to the start" />
        </section>
      ) : null}
    </Shell>
  )
}

function Progress({ milestoneIndex, saved }: { milestoneIndex: number; saved: boolean }) {
  return (
    <ol className="mt-6 grid gap-2 sm:grid-cols-4" aria-label="Assessment progress">
      {MILESTONES.map((milestone, index) => {
        const done = index < milestoneIndex || (milestone.id === 'recap' && saved)
        return (
          <li key={milestone.id} className={`rounded-2xl border border-line bg-card px-3 py-3 text-sm ${done ? 'milestone-done' : ''}`}>
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-forest text-xs" aria-hidden="true">
              {done ? '✓' : index + 1}
            </span>
            {milestone.label}
          </li>
        )
      })}
    </ol>
  )
}

function ScenarioArticle({
  title,
  body,
  card,
  empty,
}: {
  title: string
  body: string
  card: ScenarioCard | null
  empty?: string
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-card p-4 shadow-sm">
      <h2 className="font-serif text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed">{body}</p>
      {card ? (
        <>
          <p className="mt-4">Monthly: {inr(card.monthly)}</p>
          <p>Planned contributions over the period: {inr(card.totalPlanned)}</p>
          <p className="mt-2 font-semibold">
            {card.contributionDifference === '0'
              ? `${inr('0')} difference from the current plan.`
              : `${inr(card.contributionDifference)} less in planned contributions over this period.`}
          </p>
        </>
      ) : (
        <p className="mt-4 text-sm">{empty}</p>
      )}
    </article>
  )
}

function WhatIf({
  current,
  proposed,
  months,
  onChange,
  onReset,
}: {
  current: string
  proposed: string
  months: string
  onChange: (proposed: string, months: string) => void
  onReset: () => void
}) {
  const max = Number(current)
  const proposedNumber = Number(proposed || '0')
  const monthsNumber = Number(months || '1')
  return (
    <div className="mt-6 rounded-2xl border border-line bg-card p-4">
      <h2 className="font-serif text-2xl">What if?</h2>
      <label className="mt-4 block" htmlFor="amount-slider">
        Proposed monthly amount: {inr(String(proposedNumber))}
      </label>
      <input
        id="amount-slider"
        className="mt-2 w-full"
        type="range"
        min={0}
        max={Number.isFinite(max) ? max : 0}
        step={1}
        value={Number.isFinite(proposedNumber) ? proposedNumber : 0}
        onChange={(event) => onChange(event.target.value, months)}
      />
      <label className="mt-4 block" htmlFor="months-slider">
        Months: {monthsNumber}
      </label>
      <input
        id="months-slider"
        className="mt-2 w-full"
        type="range"
        min={1}
        max={24}
        step={1}
        value={Number.isFinite(monthsNumber) ? monthsNumber : 1}
        onChange={(event) => onChange(proposed, event.target.value)}
      />
      <button type="button" className="mt-4 min-h-12 rounded-full border border-line px-4" onClick={onReset}>
        Reset to the amounts I entered
      </button>
    </div>
  )
}

function Nav({ onBack, onNext, nextLabel }: { onBack: () => void; onNext: () => void; nextLabel: string }) {
  return (
    <div className="no-print mt-8 flex flex-col gap-3 sm:flex-row">
      <button type="button" className="min-h-12 rounded-full border border-line px-5" onClick={onBack}>
        Back
      </button>
      <button type="button" className="min-h-12 rounded-full bg-forest px-5 text-card" onClick={onNext}>
        {nextLabel}
      </button>
    </div>
  )
}

function SavedList({
  recaps,
  onDelete,
  onNote,
}: {
  recaps: SavedRecap[]
  onDelete: (id: string) => void
  onNote: (id: string, note: string) => void
}) {
  if (recaps.length === 0) return null
  return (
    <section className="mt-8">
      <h2 className="font-serif text-2xl">Saved in this browser</h2>
      <ul className="mt-3 space-y-3">
        {recaps.map((recap) => (
          <li key={recap.id} className="rounded-2xl border border-line bg-card p-4">
            <p>
              {ASSESSMENT_REASON_LABELS[recap.reason]} · {labelChoice(recap.scenario)} · {inr(recap.contributionDifference)} less in planned contributions
            </p>
            <label className="mt-2 block text-sm" htmlFor={`note-${recap.id}`}>
              Note
            </label>
            <input
              id={`note-${recap.id}`}
              className="mt-1 w-full min-h-12 border-2 border-line bg-paper px-3"
              defaultValue={recap.note}
              onBlur={(event) => onNote(recap.id, event.target.value)}
            />
            <button type="button" className="mt-3 min-h-12 rounded-full border border-line px-4" onClick={() => onDelete(recap.id)}>
              Delete this recap
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function labelChoice(choice: Choice | null): string {
  if (choice === 'keep') return 'Keep'
  if (choice === 'reduce') return 'Reduce'
  if (choice === 'pause') return 'Pause'
  return 'Not chosen'
}

function differenceFor(
  explored: Choice,
  scenarios: { keep: ScenarioCard; reduce: ScenarioCard | null; pause: ScenarioCard },
): string {
  if (explored === 'keep') return scenarios.keep.contributionDifference
  if (explored === 'pause') return scenarios.pause.contributionDifference
  return scenarios.reduce?.contributionDifference ?? '0'
}
