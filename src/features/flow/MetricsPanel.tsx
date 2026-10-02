import type { AnalyticsEvent } from '../../analytics/event-types.ts'
import {
  decisionAbandonmentCount,
  informedChoiceRate,
  sampleSessionCount,
} from '../../analytics/funnel-metrics.ts'

export function MetricsPanel({ events }: { events: AnalyticsEvent[] }) {
  const summary = informedChoiceRate(events)
  return (
    <details className="mt-10 border-t border-line pt-4 text-sm text-muted">
      <summary className="cursor-pointer min-h-12 py-2">Local counts in this tab</summary>
      <div className="space-y-2 pb-2 leading-relaxed">
        <p>Not a pilot result. These counts are only what happened in this browser tab.</p>
        <p>Decision sessions with a comparison: {summary.denominator}</p>
        <p>Informed choices among those sessions: {summary.numerator}</p>
        <p>Sample sessions opened: {sampleSessionCount(events)}</p>
        <p>Left before the recap: {decisionAbandonmentCount(events)}</p>
      </div>
    </details>
  )
}
