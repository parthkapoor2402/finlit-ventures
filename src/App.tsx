import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { FlowApp } from './features/flow/FlowApp.tsx'

export function App() {
  return (
    <ErrorBoundary>
      <FlowApp />
    </ErrorBoundary>
  )
}
