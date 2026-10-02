import { useEffect, useReducer, useRef, useState } from 'react'
import { getEvents, track, trackEntryOnce } from '../../analytics/track-event.ts'
import { Shell } from '../../components/Shell.tsx'
import { flowReducer, initialFlowState, type FlowAction } from './flow-state.ts'
import { MetricsPanel } from './MetricsPanel.tsx'
import { StepView } from './screens.tsx'
import { eventsForTransition } from './track-transition.ts'

const STEP_TITLES = {
  entry: 'Skip Check by FinLit',
  reason: 'Reason — Skip Check',
  inputs: 'Amounts — Skip Check',
  'confirm-amount': 'Check the digits — Skip Check',
  impact: 'The plan — Skip Check',
  choice: 'Choice — Skip Check',
  comprehension: 'Restate the comparison — Skip Check',
  recap: 'Decision card — Skip Check',
} as const

export function FlowApp() {
  const [state, rawDispatch] = useReducer(flowReducer, initialFlowState)
  const stateRef = useRef(state)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [, setTick] = useState(0)
  stateRef.current = state

  function dispatch(action: FlowAction) {
    const prev = stateRef.current
    const next = flowReducer(prev, action)
    stateRef.current = next
    for (const event of eventsForTransition(prev, next, action)) {
      track(event)
    }
    rawDispatch(action)
    setTick((value) => value + 1)
  }

  useEffect(() => {
    trackEntryOnce()
    setTick((value) => value + 1)
  }, [])

  useEffect(() => {
    document.title = STEP_TITLES[state.step]
    headingRef.current?.focus()
  }, [state.step])

  return (
    <Shell>
      <StepView state={state} dispatch={dispatch} headingRef={headingRef} />
      {state.step === 'entry' ? <MetricsPanel events={getEvents()} /> : null}
    </Shell>
  )
}
