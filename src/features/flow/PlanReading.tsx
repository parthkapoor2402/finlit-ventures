import { PAUSE_SEPARATE_LABEL, reasonEmphasis, standingLines } from '../../domain/decision-rules.ts'
import { formatInrDigits } from '../../domain/money.ts'
import {
  continuityCopy,
  goalShiftCopy,
  separatePauseComparison,
  separatePauseLine,
  type PlanTranslation,
} from '../../domain/plan-translation.ts'
import type { ContributionSuccess, Reason } from '../../domain/sip-types.ts'

export function PlanReading({
  translation,
  reason,
  size = 'hero',
}: {
  translation: PlanTranslation
  reason: Reason
  size?: 'hero' | 'compact'
}) {
  const emphasis = reasonEmphasis(reason)
  const headlineClass =
    size === 'hero'
      ? 'mt-2 font-serif text-4xl leading-tight tracking-tight'
      : 'mt-2 font-serif text-2xl leading-tight'
  if (translation.kind === 'goal-time-shift') {
    const copy = goalShiftCopy(translation)
    return (
      <div>
        <p className="text-sm text-muted">Months of planned contributions the gap adds</p>
        <p data-testid={size === 'hero' ? 'plan-headline' : undefined} className={headlineClass}>
          {copy.headline}
        </p>
        <p className="mt-4 leading-relaxed">{copy.gapLine}</p>
        <p className="mt-4 leading-relaxed">{copy.targetLine}</p>
        <p className="mt-6 border-l-2 border-amber pl-4 leading-relaxed">{emphasis}</p>
      </div>
    )
  }
  const copy = continuityCopy(translation)
  return (
    <div>
      <p className="text-sm text-muted">Continuity of the contribution</p>
      <p data-testid={size === 'hero' ? 'plan-headline' : undefined} className={headlineClass}>
        {copy.headline}
      </p>
      <p className="mt-4 leading-relaxed">{copy.detail}</p>
      <p className="mt-6 border-l-2 border-amber pl-4 leading-relaxed">{emphasis}</p>
    </div>
  )
}

export function StandingList({ reason }: { reason: Reason | null }) {
  return (
    <ul className="mt-8 space-y-4 border-t border-line pt-6 leading-relaxed">
      {standingLines(reason).map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  )
}

export function PauseAside({ result }: { result: ContributionSuccess }) {
  const pause = separatePauseComparison(result)
  if (!pause) return null
  return (
    <div className="mt-8 border border-line bg-card px-4 py-4" data-testid="pause-aside">
      <p className="text-sm text-amber">{PAUSE_SEPARATE_LABEL}</p>
      <p className="mt-2 font-serif text-3xl tracking-tight">{formatInrDigits(pause.contributionDifference)}</p>
      <p className="mt-3 leading-relaxed">{separatePauseLine(pause)}</p>
    </div>
  )
}
