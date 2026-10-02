import type { AnalyticsEvent } from './event-types.ts'

const events: AnalyticsEvent[] = []
let entryTracked = false

export function track(event: Omit<AnalyticsEvent, 'at'>): void {
  try {
    events.push({ ...event, at: Date.now() })
  } catch {
    // Measurement must not block the decision.
  }
}

export function trackEntryOnce(): void {
  if (entryTracked) return
  entryTracked = true
  track({
    name: 'entry_page_viewed',
    sessionId: null,
    sessionKind: 'none',
  })
}

export function getEvents(): AnalyticsEvent[] {
  return events.map((event) => ({ ...event }))
}

export function resetAnalytics(): void {
  events.length = 0
  entryTracked = false
}
