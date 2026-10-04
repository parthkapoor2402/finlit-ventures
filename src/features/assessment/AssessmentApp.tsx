import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { trackAssessment } from '../../analytics/assessment-events.ts'
import { Shell } from '../../components/Shell.tsx'
import { TextField } from '../../components/TextField.tsx'
import {
  ASSESSMENT_REASONS,
  ASSESSMENT_REASON_DETAIL,
  ASSESSMENT_REASON_LABELS,
  assessmentReasonLine,
  type AssessmentReason,
} from '../../domain/assessment-reasons.ts'
import { ADVICE_LINE } from '../../domain/decision-rules.ts'
import { finlitContact, hasFinlitDestination } from '../../domain/finlit-contact.ts'
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
  { id: 'situation', label: 'Your situation' },
  { id: 'scenarios', label: 'The numbers' },
  { id: 'knowledge', label: 'Optional clarity' },
  { id: 'recap', label: 'Your recap' },
] as const

const CLARIFICATION =
  'This is the difference in planned contributions under your inputs. It is not an investment loss, a return forecast, or a prediction of future portfolio value.'

const NOT_CHANGED =
  'Skip Check has not changed your SIP. If you decide to make a change, review and complete it separately in your own investment application.'

const HELP = {
  difference:
    'This number compares planned contributions under the two scenarios you entered. It does not estimate how your investments will perform.',
  units:
    'Pausing future SIP contributions does not itself redeem the mutual fund units you already own. Their value may still rise or fall with the market.',
  pause:
    'This page is comparing future planned contributions. It does not pause your actual SIP. Existing units are not redeemed by this comparison.',
} as const

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
  const [usedDefaultAmount, setUsedDefaultAmount] = useState(false)
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
  const [questionIndex, setQuestionIndex] = useState(0)
  const [consent, setConsent] = useState(false)
  const [note, setNote] = useState('')
  const [reviewChoice, setReviewChoice] = useState<ReviewChoice>('none')
  const [reviewDateInput, setReviewDateInput] = useState('')
  const [shareMisses, setShareMisses] = useState(false)
  const [shareReason, setShareReason] = useState(false)
  const [recaps, setRecaps] = useState<SavedRecap[]>(() => loadRecaps())
  const [savedId, setSavedId] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [adjusted, setAdjusted] = useState(false)
  const [helpKey, setHelpKey] = useState<keyof typeof HELP | null>(null)
  const [botOpen, setBotOpen] = useState(false)
  const [revisitBanner, setRevisitBanner] = useState(false)

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
    setFinished(false)
    setRevisitBanner(false)
    setReason(null)
    trackAssessment({ name: 'assessment_started', sessionId: nextId, sessionKind: nextKind })
    if (nextKind === 'sample') {
      trackAssessment({ name: 'landing_exploration_clicked', sessionId: nextId, sessionKind: nextKind })
      enterScenarios('12000', '6000', '6', nextId, nextKind)
      return
    }
    trackAssessment({ name: 'landing_primary_clicked', sessionId: nextId, sessionKind: nextKind })
    setStep('reason')
  }

  function continueReason(selected: AssessmentReason | null) {
    setReason(selected)
    setFieldError(null)
    if (selected) {
      trackAssessment({ name: 'reason_selected', sessionId: id, sessionKind: kind })
    }
    setStep('situation')
  }

  function submitSituation() {
    const proposed = undecided ? currentRaw : proposedRaw
    const result = calculateContributionDifference({
      currentMonthlyAmount: currentRaw,
      proposedMonthlyAmount: proposed,
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
    const nextProposed = undecided ? defaultExploreAmount(result.current) : result.proposed
    setUsedDefaultAmount(undecided)
    if (result.confirmationRequired) {
      setPendingCurrent(result.current)
      setPendingProposed(nextProposed)
      setPendingMonths(result.months)
      setFieldError(null)
      setStep('confirm')
      return
    }
    enterScenarios(result.current, nextProposed, result.months)
  }

  function enterScenarios(
    current: string,
    proposed: string,
    months: string,
    session = id,
    sessionKind: 'decision' | 'sample' = kind,
  ) {
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
    trackAssessment({ name: 'inputs_completed', sessionId: session, sessionKind })
    trackAssessment({ name: 'scenarios_viewed', sessionId: session, sessionKind })
    trackAssessment({ name: 'scenario_explorer_opened', sessionId: session, sessionKind })
  }

  function onExplore(nextProposed: string, nextMonths: string) {
    setExploreProposed(nextProposed)
    setExploreMonths(nextMonths)
    if (!adjusted) {
      setAdjusted(true)
      trackAssessment({ name: 'scenario_adjusted', sessionId: id, sessionKind: kind })
    }
  }

  function openHelp(key: keyof typeof HELP) {
    setHelpKey((current) => (current === key ? null : key))
    trackAssessment({ name: 'contribution_help_opened', sessionId: id, sessionKind: kind })
  }

  function openBot() {
    setBotOpen(true)
    trackAssessment({ name: 'bot_opened', sessionId: id, sessionKind: kind })
  }

  function answerQuestion(questionId: string, optionId: string) {
    const question = KNOWLEDGE_QUESTIONS.find((item) => item.id === questionId)
    if (!question) return
    const graded = gradeAnswer(question, optionId)
    setAnswers((current) => ({ ...current, [questionId]: optionId }))
    setFeedback((current) => ({ ...current, [questionId]: graded }))
  }

  function startClarity() {
    setQuestionIndex(0)
    setStep('knowledge')
    trackAssessment({ name: 'knowledge_check_started', sessionId: id, sessionKind: kind })
  }

  function skipClarity() {
    trackAssessment({ name: 'knowledge_check_skipped', sessionId: id, sessionKind: kind })
    setStep('recap')
  }

  function nextClarity() {
    const answeredAll = KNOWLEDGE_QUESTIONS.every((question) => answers[question.id])
    if (questionIndex < KNOWLEDGE_QUESTIONS.length - 1) {
      setQuestionIndex((current) => current + 1)
      return
    }
    if (answeredAll) {
      trackAssessment({ name: 'knowledge_check_completed', sessionId: id, sessionKind: kind })
    }
    setStep('recap')
  }

  function save() {
    if (!consent || !scenarios || !scenarios.ok) return
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

  function revisit(recap: SavedRecap) {
    const nextId = sessionId()
    setKind('decision')
    setId(nextId)
    setReason(recap.reason)
    setUsedDefaultAmount(false)
    setRevisitBanner(true)
    setFinished(false)
    enterScenarios(recap.current, recap.proposed, recap.months, nextId, 'decision')
    trackAssessment({ name: 'recap_revisited', sessionId: nextId, sessionKind: 'decision' })
  }

  function finish() {
    setFinished(true)
    trackAssessment({ name: 'assessment_completed', sessionId: id, sessionKind: kind })
    trackAssessment({ name: 'session_completed', sessionId: id, sessionKind: kind })
  }

  const explored = scenarios && scenarios.ok ? scenarios.scenarios.explored : null
  const misses = KNOWLEDGE_QUESTIONS.filter((question) => feedback[question.id] && !feedback[question.id]?.correct).map(
    (question) => question.prompt,
  )
  const activeQuestion = KNOWLEDGE_QUESTIONS[questionIndex]
  const clarityReviewed = KNOWLEDGE_QUESTIONS.every((question) => answers[question.id])

  return (
    <Shell wide>
      {step !== 'welcome' ? <Progress milestoneIndex={milestoneIndex} saved={savedId !== null} /> : null}
      {kind === 'sample' && step !== 'welcome' ? (
        <p className="mt-4 text-sm text-amber">
          This is a sample, using ₹12,000 reduced to ₹6,000 for 6 months. It is not your SIP, and nothing here is a recommendation.
        </p>
      ) : null}

      {step === 'welcome' ? (
        <section>
          <h1 className="mt-2 font-serif text-4xl leading-tight">Thinking about reducing or pausing your SIP?</h1>
          <p className="mt-4 leading-relaxed">
            That’s okay. Life, expenses, and priorities change. Let’s look at what a change could mean for your planned contributions—without pressure to choose any particular option.
          </p>
          <p className="mt-3 text-sm text-muted">About 2 minutes · No changes are made to your SIP.</p>
          <p className="mt-2 text-sm text-muted">You don’t need to justify your decision. This is a space to understand the numbers.</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{ADVICE_LINE}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="min-h-12 rounded-full bg-forest px-5 text-card" onClick={() => begin('decision')}>
              Explore my options
            </button>
            <button type="button" className="min-h-12 rounded-full border border-forest px-5" onClick={() => begin('sample')}>
              I’m just exploring
            </button>
          </div>
          {due.length > 0 ? (
            <p className="mt-4 rounded-2xl border border-line bg-card p-4 leading-relaxed" role="status">
              Has anything changed since you last explored these options? This note stays in this browser. Skip Check does not email or message you.
            </p>
          ) : null}
          <SavedList
            recaps={recaps}
            onDelete={(recapId) => {
              setRecaps(deleteRecap(recapId))
              trackAssessment({ name: 'recap_deleted', sessionId: id || null, sessionKind: kind })
            }}
            onNote={(recapId, nextNote) => setRecaps(updateRecap(recapId, { note: nextNote }))}
            onRevisit={revisit}
          />
        </section>
      ) : null}

      {step === 'reason' ? (
        <section>
          <h1 className="mt-6 font-serif text-3xl">What’s on your mind?</h1>
          <p className="mt-3 leading-relaxed">Choose whatever feels closest. You can skip this if you’d rather not say.</p>
          <fieldset className="mt-4">
            <legend className="sr-only">Reason</legend>
            <div className="flex flex-col gap-2">
              {ASSESSMENT_REASONS.map((item) => (
                <label key={item} className="flex min-h-12 items-start gap-3 rounded-2xl border border-line bg-card px-3 py-3">
                  <input
                    className="mt-1"
                    type="radio"
                    name="reason"
                    checked={reason === item}
                    onChange={() => {
                      setReason(item)
                      setFieldError(null)
                    }}
                  />
                  <span>
                    <span className="block">{ASSESSMENT_REASON_LABELS[item]}</span>
                    <span className="block text-sm text-muted">{ASSESSMENT_REASON_DETAIL[item]}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <TextField id="reason-note" label="Optional note" value={reasonNote} onChange={setReasonNote} inputMode="text" hint="You can leave this blank." />
          {reason === 'not_sure' ? <p className="mt-4 leading-relaxed">{assessmentReasonLine(reason)}</p> : null}
          {reason && reason !== 'not_sure' ? <p className="mt-4 leading-relaxed">{assessmentReasonLine(reason)}</p> : null}
          <div className="no-print mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="min-h-12 rounded-full border border-line px-5" onClick={() => setStep('welcome')}>
              Back
            </button>
            <button type="button" className="min-h-12 rounded-full border border-line px-5" onClick={() => continueReason(null)}>
              Skip this
            </button>
            <button
              type="button"
              className="min-h-12 rounded-full bg-forest px-5 text-card"
              onClick={() => continueReason(reason)}
            >
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === 'situation' ? (
        <section>
          <h1 className="mt-6 font-serif text-3xl">The amounts for this comparison</h1>
          {reason === 'cash_need' || immediateExpenses ? (
            <p className="mt-3 leading-relaxed">
              If money is needed for essential expenses, you can explore all three contribution scenarios without pressure.
            </p>
          ) : null}
          <TextField id="current" label="Current monthly SIP" value={currentRaw} onChange={setCurrentRaw} hint="Whole rupees." />
          {undecided ? (
            <p className="mt-6 text-sm leading-relaxed">
              You can continue without an amount. The explorer will open on a starting figure so the comparison has a number. That figure is not a recommendation.
            </p>
          ) : (
            <TextField
              id="proposed"
              label="What monthly amount are you considering?"
              value={proposedRaw}
              onChange={setProposedRaw}
              hint="Enter a smaller amount, or ₹0 if you are exploring a pause."
            />
          )}
          <label className="mt-4 flex min-h-12 items-center gap-3">
            <input type="checkbox" checked={undecided} onChange={(event) => setUndecided(event.target.checked)} />
            I haven’t decided on an amount yet.
          </label>
          <TextField id="months" label="Duration in months" value={monthsRaw} onChange={setMonthsRaw} hint="From 1 to 24." />
          <TextField id="goal-timeline" label="Goal timeline, if you want to note one" value={goalTimeline} onChange={setGoalTimeline} inputMode="text" hint="Optional. This page does not move a goal date." />
          <label className="mt-4 flex min-h-12 items-center gap-3">
            <input type="checkbox" checked={immediateExpenses} onChange={(event) => setImmediateExpenses(event.target.checked)} />
            I need money for immediate expenses.
          </label>
          {fieldError ? <p role="alert" className="mt-3 text-sm text-error">{fieldError}</p> : null}
          <Nav onBack={() => setStep('reason')} onNext={submitSituation} nextLabel="See the numbers" />
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
          {revisitBanner ? (
            <p className="mt-6 rounded-2xl border border-line bg-card p-4 leading-relaxed" role="status">
              Has anything changed since you last explored these options? You can move the amount and duration, then look at the numbers again.
            </p>
          ) : null}
          <h1 className="mt-6 font-serif text-3xl">See how different choices change your planned contributions.</h1>
          <p className="mt-3 leading-relaxed">Adjust the amount and duration to explore the numbers that matter to you.</p>
          {usedDefaultAmount ? (
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The amount shown is a starting point so the comparison has a number to work with. It is not a recommendation, and it is not an amount you decided.
            </p>
          ) : null}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ScenarioArticle title="Keep" card={scenarios.scenarios.keep} body="Continue the current monthly contribution." />
            <ScenarioArticle
              title="Reduce"
              card={scenarios.scenarios.reduce}
              body="A monthly amount above ₹0 and below the current SIP."
              empty="Move the amount below the current SIP to see a reduction."
            />
            <ScenarioArticle
              title="Pause"
              card={scenarios.scenarios.pause}
              body="₹0 in planned monthly contributions during this period."
              extra={
                <HelpLink label="Understand what pausing means" pressed={helpKey === 'pause'} onClick={() => openHelp('pause')} />
              }
            />
          </div>
          {helpKey ? <p className="mt-4 rounded-2xl border border-line bg-card p-4 text-sm leading-relaxed" role="status">{HELP[helpKey]}</p> : null}
          <p className="mt-4 leading-relaxed">{CLARIFICATION}</p>
          <HelpLink label="Help me understand this number" pressed={helpKey === 'difference'} onClick={() => openHelp('difference')} />
          <p className="mt-2 leading-relaxed">Existing units remain invested when future contributions are paused. Pausing does not redeem or sell them.</p>
          <HelpLink label="What happens to my existing investments?" pressed={helpKey === 'units'} onClick={() => openHelp('units')} />
          <p className="mt-4 text-sm text-muted">Need help understanding this?</p>
          <FinlitConnect label="Talk to FinLit" sessionId={id} sessionKind={kind} />
          <WhatIf
            current={pendingCurrent}
            proposed={exploreProposed}
            months={exploreMonths}
            sessionId={id}
            sessionKind={kind}
            onChange={onExplore}
            onReset={() => {
              setExploreProposed(baselineProposed)
              setExploreMonths(baselineMonths)
            }}
            onCompare={openBot}
          />
          {reason === 'not_sure' ? (
            <div className="mt-4 rounded-2xl border border-line bg-card p-4">
              <p>You don’t have to decide right now. You can explore the numbers, talk through your questions, or finish for now.</p>
              <p className="mt-2 text-sm text-muted">You can explore the numbers first. If you’d like, you can also discuss your questions with FinLit.</p>
              <FinlitConnect label="Talk it through with FinLit" sessionId={id} sessionKind={kind} />
            </div>
          ) : null}
          <ul className="mt-6 space-y-2 text-sm leading-relaxed text-muted">
            <li>A shorter pause means fewer months without new contributions.</li>
            <li>Reducing an SIP changes future contributions, not the units you already own.</li>
            <li>A contribution difference alone cannot tell you what your portfolio will be worth.</li>
            <li>The right choice depends on your financial circumstances and priorities.</li>
          </ul>
          <div className="no-print mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="min-h-12 rounded-full border border-line px-5" onClick={() => setStep(kind === 'sample' ? 'welcome' : 'situation')}>
              Back
            </button>
            <button type="button" className="min-h-12 rounded-full border border-line px-5" onClick={skipClarity}>
              Skip for now
            </button>
            <button type="button" className="min-h-12 rounded-full bg-forest px-5 text-card" onClick={startClarity}>
              Review the numbers
            </button>
          </div>
        </section>
      ) : null}

      {step === 'knowledge' && activeQuestion ? (
        <section>
          <h1 className="mt-6 font-serif text-3xl">Want to make sure the numbers are clear?</h1>
          <p className="mt-3 leading-relaxed">Three quick questions. No score, no judgement. Skip any time.</p>
          <fieldset className="mt-6 rounded-2xl border border-line bg-card p-4">
            <legend className="font-semibold">{activeQuestion.prompt}</legend>
            <div className="mt-3 flex flex-col gap-2">
              {activeQuestion.options.map((option) => (
                <label key={option.id} className="flex min-h-12 items-center gap-3">
                  <input
                    type="radio"
                    name={activeQuestion.id}
                    checked={answers[activeQuestion.id] === option.id}
                    onChange={() => answerQuestion(activeQuestion.id, option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            {feedback[activeQuestion.id] ? (
              <p className="mt-3 text-sm leading-relaxed" role="status">
                {feedback[activeQuestion.id]?.explanation}
              </p>
            ) : null}
          </fieldset>
          {clarityReviewed ? <p className="mt-4 leading-relaxed">You’ve reviewed the key ideas.</p> : null}
          <div className="no-print mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="min-h-12 rounded-full border border-line px-5" onClick={() => setStep('scenarios')}>
              Back
            </button>
            <button type="button" className="min-h-12 rounded-full border border-line px-5" onClick={skipClarity}>
              Skip for now
            </button>
            <button type="button" className="min-h-12 rounded-full bg-forest px-5 text-card" onClick={nextClarity}>
              {questionIndex < KNOWLEDGE_QUESTIONS.length - 1 ? 'Next' : 'See my recap'}
            </button>
          </div>
        </section>
      ) : null}

      {step === 'recap' && scenarios?.ok ? (
        <section>
          <h1 className="mt-6 font-serif text-3xl">Here’s what you explored.</h1>
          <p className="mt-3 leading-relaxed">You can keep this summary for reference, talk through any remaining questions, or finish here.</p>
          <article id="assessment-recap" className="mt-4 rounded-2xl border border-line bg-card p-4 leading-relaxed">
            <p>{reason ? ASSESSMENT_REASON_LABELS[reason] : 'You skipped the reason.'}</p>
            {reasonNote ? <p className="mt-2">{reasonNote}</p> : null}
            <p className="mt-2">Current monthly SIP: {inr(pendingCurrent)}</p>
            <p>Proposed monthly contribution: {inr(exploreProposed || '0')}</p>
            <p>Duration: {exploreMonths} months</p>
            <p>Scenario being explored: {labelChoice(explored)}</p>
            <p>Contribution difference: {inr(differenceFor(scenarios.scenarios.explored, scenarios.scenarios))}</p>
            <p className="mt-3">Keep plans {inr(scenarios.scenarios.keep.totalPlanned)}. {scenarios.scenarios.reduce ? `Reduce plans ${inr(scenarios.scenarios.reduce.totalPlanned)}.` : 'Reduce appears when the amount is between the current SIP and ₹0.'} Pause plans {inr(scenarios.scenarios.pause.totalPlanned)}.</p>
            <p className="mt-3">{CLARIFICATION}</p>
            <p className="mt-3">Existing units are not automatically redeemed when future contributions are paused.</p>
            <p className="mt-3">{NOT_CHANGED}</p>
          </article>
          <div className="mt-6 flex flex-col gap-3">
            <FinlitConnect label="Connect with FinLit Ventures" prominent sessionId={id} sessionKind={kind} />
          </div>
          <label className="mt-4 flex items-start gap-3">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            <span>Save this recap in this browser. It stores the reason, amounts, difference, whether the clarity questions were answered, an optional note, and an optional review month. It is not sent to an analytics service. You can delete it.</span>
          </label>
          <TextField id="recap-note" label="Optional note" value={note} onChange={setNote} inputMode="text" />
          <fieldset className="mt-4">
            <legend>Remind me to revisit this</legend>
            <p className="mt-1 text-sm text-muted">This is a local note in this browser. Skip Check will not email, text, or push a reminder, and it does not confirm that a reminder was sent.</p>
            {(['none', '1', '3', '6', 'date'] as const).map((choice) => (
              <label key={choice} className="mt-2 flex min-h-12 items-center gap-3">
                <input type="radio" name="review" checked={reviewChoice === choice} onChange={() => setReviewChoice(choice)} />
                <span>{choice === 'none' ? 'No review date' : choice === 'date' ? 'A date I choose' : `${choice} month${choice === '1' ? '' : 's'}`}</span>
              </label>
            ))}
            {reviewChoice === 'date' ? (
              <input className="mt-2 min-h-12 border-2 border-line bg-card px-3" type="date" value={reviewDateInput} onChange={(event) => setReviewDateInput(event.target.value)} />
            ) : null}
          </fieldset>
          <label className="mt-4 flex items-start gap-3">
            <input type="checkbox" checked={shareReason} onChange={(event) => setShareReason(event.target.checked)} />
            <span>If I chat, SIP Check may use the reason I selected. Leave this off to keep the reason out of the chat.</span>
          </label>
          <label className="mt-4 flex items-start gap-3">
            <input type="checkbox" checked={shareMisses} onChange={(event) => setShareMisses(event.target.checked)} />
            <span>If I chat, SIP Check may use a clarity question I missed. Leave this off to keep those answers private.</span>
          </label>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="min-h-12 rounded-full border border-forest px-5" disabled={!consent} onClick={save}>
              Save my recap
            </button>
            <button type="button" className="min-h-12 rounded-full border border-line px-5" onClick={finish}>
              Finish for now
            </button>
          </div>
          {savedId ? <p className="mt-3 text-sm" role="status">Saved in this browser. You can delete it from the welcome screen.</p> : null}
          {finished ? (
            <div className="mt-4">
              <p>You can come back to these numbers whenever your circumstances change. You can leave without chatting, saving, or setting a reminder.</p>
              <FinlitConnect label="Connect with FinLit Ventures" sessionId={id} sessionKind={kind} />
            </div>
          ) : null}
          <BotPanel
            opened={botOpen}
            sessionId={id}
            sessionKind={kind}
            context={{
              reason: shareReason ? reason : null,
              current: pendingCurrent,
              proposed: exploreProposed,
              months: exploreMonths,
              contributionDifference: differenceFor(scenarios.scenarios.explored, scenarios.scenarios),
              scenario: scenarios.scenarios.explored,
              misconceptions: shareMisses ? misses : [],
            }}
          />
          <p className="mt-3 text-sm text-muted">{finlitContact.reviewNote}</p>
          <Nav onBack={() => setStep('scenarios')} onNext={() => setStep('welcome')} nextLabel="Back to the start" />
        </section>
      ) : null}

      {step === 'scenarios' && scenarios?.ok ? (
        <BotPanel
          opened={botOpen}
          sessionId={id}
          sessionKind={kind}
          context={{
            reason: shareReason ? reason : null,
            current: pendingCurrent,
            proposed: exploreProposed,
            months: exploreMonths,
            contributionDifference: differenceFor(scenarios.scenarios.explored, scenarios.scenarios),
            scenario: scenarios.scenarios.explored,
            misconceptions: shareMisses ? misses : [],
          }}
        />
      ) : null}
    </Shell>
  )
}

function Progress({ milestoneIndex, saved }: { milestoneIndex: number; saved: boolean }) {
  return (
    <ol className="mt-2 grid gap-2 sm:grid-cols-4" aria-label="Progress">
      {MILESTONES.map((milestone, index) => {
        const done = index < milestoneIndex || (milestone.id === 'recap' && saved)
        return (
          <li key={milestone.id} className={`rounded-2xl border border-line bg-card px-3 py-2 text-sm ${done ? 'milestone-done' : ''}`}>
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

function HelpLink({ label, pressed, onClick }: { label: string; pressed: boolean; onClick: () => void }) {
  return (
    <button type="button" className="mt-2 min-h-12 text-left text-sm underline" aria-pressed={pressed} onClick={onClick}>
      {label}
    </button>
  )
}

function FinlitConnect({
  label,
  prominent = false,
  sessionId,
  sessionKind,
}: {
  label: string
  prominent?: boolean
  sessionId: string
  sessionKind: 'decision' | 'sample'
}) {
  const [open, setOpen] = useState(false)
  const className = prominent
    ? 'min-h-12 rounded-full bg-forest px-5 text-card'
    : 'mt-2 min-h-12 text-left text-sm underline'
  function track() {
    trackAssessment({ name: 'human_support_cta_clicked', sessionId, sessionKind })
  }
  return (
    <div>
      {hasFinlitDestination() ? (
        <a
          className={`inline-flex items-center ${className}`}
          href={finlitContact.contactUrl || finlitContact.bookingUrl}
          onClick={track}
        >
          {label}
        </a>
      ) : (
        <button
          type="button"
          className={className}
          onClick={() => {
            track()
            setOpen(true)
          }}
        >
          {label}
        </button>
      )}
      {open ? (
        <div className="mt-3 rounded-2xl border border-line bg-card p-4 text-sm leading-relaxed" role="status">
          <p>{finlitContact.supportNote}</p>
          <p className="mt-2">{finlitContact.reviewNote}</p>
        </div>
      ) : null}
    </div>
  )
}

function ScenarioArticle({
  title,
  body,
  card,
  empty,
  extra,
}: {
  title: string
  body: string
  card: ScenarioCard | null
  empty?: string
  extra?: ReactNode
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
      {extra}
    </article>
  )
}

function WhatIf({
  current,
  proposed,
  months,
  onChange,
  onReset,
  onCompare,
  sessionId,
  sessionKind,
}: {
  current: string
  proposed: string
  months: string
  onChange: (proposed: string, months: string) => void
  onReset: () => void
  onCompare: () => void
  sessionId: string
  sessionKind: 'decision' | 'sample'
}) {
  const [localError, setLocalError] = useState<string | null>(null)
  const [amountDraft, setAmountDraft] = useState(proposed)
  const [monthsDraft, setMonthsDraft] = useState(months)
  const max = Number(current)
  const proposedNumber = Number(proposed || '0')
  const monthsNumber = Number(months || '1')

  useEffect(() => {
    setAmountDraft(proposed)
    setMonthsDraft(months)
  }, [proposed, months])

  function applyProposed(raw: string) {
    if (!/^\d+$/.test(raw)) {
      setLocalError('Enter a whole number of rupees.')
      return
    }
    if (Number(raw) > max) {
      setLocalError('This explorer stops at the current SIP. Increasing is outside this version.')
      setAmountDraft(proposed)
      return
    }
    setLocalError(null)
    onChange(String(Number(raw)), months)
  }

  function applyMonths(raw: string) {
    if (!/^\d+$/.test(raw) || Number(raw) < 1 || Number(raw) > 24) {
      setLocalError('Duration stays between 1 and 24 months.')
      setMonthsDraft(months)
      return
    }
    setLocalError(null)
    onChange(proposed, String(Number(raw)))
  }

  return (
    <div className="mt-6 rounded-2xl border border-line bg-card p-4">
      <h2 className="font-serif text-2xl">What if?</h2>
      <p className="mt-2 text-sm leading-relaxed">Want to talk through your scenario?</p>
      <FinlitConnect label="Connect with FinLit Ventures" sessionId={sessionId} sessionKind={sessionKind} />
      <button type="button" className="mt-2 min-h-12 text-left text-sm underline" onClick={onCompare}>
        Help me compare these scenarios
      </button>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_8rem] sm:items-end">
        <label className="block" htmlFor="amount-slider">
          Proposed monthly amount: {inr(String(proposedNumber))}
          <input
            id="amount-slider"
            className="mt-2 w-full"
            type="range"
            min={0}
            max={Number.isFinite(max) ? max : 0}
            step={1}
            value={Number.isFinite(proposedNumber) ? Math.min(proposedNumber, max) : 0}
            onChange={(event) => {
              setLocalError(null)
              onChange(event.target.value, months)
            }}
          />
        </label>
        <label className="block text-sm" htmlFor="amount-number">
          Amount
          <input
            id="amount-number"
            className="mt-1 w-full min-h-12 border-2 border-line bg-paper px-3"
            inputMode="numeric"
            value={amountDraft}
            onChange={(event) => {
              const raw = event.target.value.replace(/[^\d]/g, '')
              setAmountDraft(raw)
              if (raw === '') return
              applyProposed(raw)
            }}
          />
        </label>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_8rem] sm:items-end">
        <label className="block" htmlFor="months-slider">
          Duration: {monthsNumber} months
          <input
            id="months-slider"
            className="mt-2 w-full"
            type="range"
            min={1}
            max={24}
            step={1}
            value={Number.isFinite(monthsNumber) ? monthsNumber : 1}
            onChange={(event) => {
              setLocalError(null)
              onChange(proposed, event.target.value)
            }}
          />
        </label>
        <label className="block text-sm" htmlFor="months-number">
          Months
          <input
            id="months-number"
            className="mt-1 w-full min-h-12 border-2 border-line bg-paper px-3"
            inputMode="numeric"
            value={monthsDraft}
            onChange={(event) => {
              const raw = event.target.value.replace(/[^\d]/g, '')
              setMonthsDraft(raw)
              if (raw === '') return
              applyMonths(raw)
            }}
          />
        </label>
      </div>
      {localError ? <p role="alert" className="mt-3 text-sm text-error">{localError}</p> : null}
      <button
        type="button"
        className="mt-4 min-h-12 rounded-full border border-line px-4"
        onClick={() => {
          setLocalError(null)
          onReset()
        }}
      >
        Reset to my original inputs
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
  onRevisit,
}: {
  recaps: SavedRecap[]
  onDelete: (id: string) => void
  onNote: (id: string, note: string) => void
  onRevisit: (recap: SavedRecap) => void
}) {
  if (recaps.length === 0) return null
  return (
    <section className="mt-8">
      <h2 className="font-serif text-2xl">Saved in this browser</h2>
      <ul className="mt-3 space-y-3">
        {recaps.map((recap) => (
          <li key={recap.id} className="rounded-2xl border border-line bg-card p-4">
            <p>
              {recap.reason ? ASSESSMENT_REASON_LABELS[recap.reason] : 'Reason skipped'} · {labelChoice(recap.scenario)} · {inr(recap.contributionDifference)} less in planned contributions
            </p>
            <label className="mt-2 block text-sm" htmlFor={`note-${recap.id}`}>
              Note
            </label>
            <input
              id={`note-${recap.id}`}
              className="mt-1 min-h-12 w-full border-2 border-line bg-paper px-3"
              defaultValue={recap.note}
              onBlur={(event) => onNote(recap.id, event.target.value)}
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="min-h-12 rounded-full border border-forest px-4" onClick={() => onRevisit(recap)}>
                Revisit these numbers
              </button>
              <button type="button" className="min-h-12 rounded-full border border-line px-4" onClick={() => onDelete(recap.id)}>
                Delete this recap
              </button>
            </div>
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
