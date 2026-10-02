import type { ReactNode } from 'react'
import { REGISTRATION_LINE, REVIEW_LINE } from '../domain/decision-rules.ts'

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-xl items-baseline justify-between gap-4 px-5 py-4">
          <p className="font-serif text-lg leading-none">Skip Check</p>
          <p className="text-sm text-muted">by FinLit</p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-8">{children}</main>
      <footer className="mx-auto w-full max-w-xl space-y-3 px-5 pb-12 text-sm leading-relaxed text-muted">
        <p>{REGISTRATION_LINE}</p>
        <p>{REVIEW_LINE}</p>
        <p>
          Amounts you type stay in this browser tab. Refreshing the page clears them. They are not
          sent to an analytics service.
        </p>
      </footer>
    </div>
  )
}
