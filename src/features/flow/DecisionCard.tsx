import { useState, type ReactNode, type RefObject } from 'react'
import { ADVICE_LINE, RESTART_COPY } from '../../domain/decision-rules.ts'
import { buildDecisionCard, decisionCardPlainText, type PlanTranslation } from '../../domain/plan-translation.ts'
import type { Choice, ContributionSuccess, Reason } from '../../domain/sip-types.ts'
import { PauseAside, StandingList } from './PlanReading.tsx'

export function DecisionCard({
  reason,
  choice,
  result,
  translation,
  restartMonth,
  headingRef,
  children,
}: {
  reason: Reason
  choice: Choice
  result: ContributionSuccess
  translation: PlanTranslation
  restartMonth: string
  headingRef: RefObject<HTMLHeadingElement | null>
  children: ReactNode
}) {
  const card = buildDecisionCard({ reason, choice, result, translation, restartMonth })
  const text = decisionCardPlainText(card)
  const [copyNote, setCopyNote] = useState<string | null>(null)

  async function copyPlainText() {
    try {
      await navigator.clipboard.writeText(text)
      setCopyNote('Copied.')
    } catch {
      setCopyNote('Select the plain text below and copy it from there.')
    }
  }

  return (
    <>
      <article id="decision-card" aria-label="Decision card" className="border border-line bg-card px-4 py-5">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-serif text-[2rem] leading-tight font-medium tracking-tight"
        >
          Decision card
        </h1>
        <p className="mt-4 leading-relaxed">
          This is a record of what you entered. It is not an order, and nothing has been changed.
        </p>
        <p className="mt-6 border-l-2 border-amber pl-4 leading-relaxed">{card.emphasis}</p>
        <p className="mt-8 text-sm text-muted">
          {card.planKind === 'goal-time-shift'
            ? 'Months of planned contributions the gap adds'
            : 'Continuity of the contribution'}
        </p>
        <p data-testid="plan-headline" className="mt-2 font-serif text-4xl leading-tight tracking-tight">
          {card.headline}
        </p>
        {card.planLines.map((line) => (
          <p key={line} className="mt-4 leading-relaxed">
            {line}
          </p>
        ))}
        <dl className="mt-8 space-y-4">
          <CardRow label="Reason" value={card.reasonLabel} />
          <CardRow label="Choice" value={card.choiceLabel} />
          <CardRow label="Current monthly SIP" value={card.current} />
          <CardRow label="Proposed monthly SIP" value={card.proposed} />
          <CardRow label="Comparison period" value={card.monthsLabel} />
          {card.restartMonth ? <CardRow label="Restart month you noted" value={card.restartMonth} /> : null}
        </dl>
        <div className="mt-8 border-t border-line pt-6">{children}</div>
        <PauseAside result={result} />
        {card.showRestartNote ? <p className="mt-6 leading-relaxed">{RESTART_COPY}</p> : null}
        <p className="mt-6 font-semibold leading-relaxed">{ADVICE_LINE}</p>
        <StandingList reason={reason} />
      </article>
      <div className="no-print mt-6 grid gap-3">
        <button
          type="button"
          className="min-h-12 border-2 border-line bg-card px-4 py-3"
          onClick={() => void copyPlainText()}
        >
          Copy plain text
        </button>
        <button type="button" className="min-h-12 border-2 border-line bg-card px-4 py-3" onClick={() => window.print()}>
          Print
        </button>
        {copyNote ? (
          <p role="status" className="text-sm text-muted">
            {copyNote}
          </p>
        ) : null}
        <label className="text-sm text-muted" htmlFor="decision-plain-text">
          Plain text to take back to your own app
        </label>
        <textarea
          id="decision-plain-text"
          data-testid="decision-plain-text"
          className="min-h-64 w-full border-2 border-line bg-paper p-3 text-sm leading-relaxed"
          readOnly
          value={text}
          aria-label="Decision card as plain text"
        />
      </div>
    </>
  )
}

function CardRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
