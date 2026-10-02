import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { AssessmentApp } from './features/assessment/AssessmentApp.tsx'

export function App() {
  return (
    <ErrorBoundary>
      <AssessmentApp />
    </ErrorBoundary>
  )
}
