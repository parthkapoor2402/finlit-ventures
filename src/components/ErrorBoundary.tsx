import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <main className="mx-auto max-w-xl px-5 py-16">
          <h1 className="font-serif text-3xl">This page hit a problem</h1>
          <p className="mt-4 leading-relaxed">
            The comparison did not run. Refresh the page and try again. Nothing was changed in an
            investing app.
          </p>
          <button
            type="button"
            className="mt-8 min-h-12 bg-forest px-4 py-3 font-semibold text-paper"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </main>
      )
    }
    return this.props.children
  }
}
