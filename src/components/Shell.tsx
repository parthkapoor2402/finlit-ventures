import type { ReactNode } from 'react'
import { REGISTRATION_LINE, REVIEW_LINE } from '../domain/decision-rules.ts'

export function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const width = wide ? 'max-w-5xl' : 'max-w-xl'
  return (
    <div className="flex min-h-screen flex-col">
      <header className="no-print border-b border-line">
        <div className={`mx-auto flex w-full ${width} items-baseline justify-between gap-4 px-5 py-4`}>
          <p className="font-serif text-lg leading-none">Skip Check</p>
          <p className="text-sm text-muted">by FinLit</p>
        </div>
      </header>
      <main className={`mx-auto w-full ${width} flex-1 px-5 py-8`}>{children}</main>
      <footer className={`no-print mx-auto w-full ${width} space-y-3 px-5 pb-12 text-sm leading-relaxed text-muted`}>
        <p>{REGISTRATION_LINE}</p>
        <p>{REVIEW_LINE}</p>
        <p>
          Amounts you type stay in this browser. A recap is stored only if you agree, and you can
          delete it. Unsaved amounts clear when you refresh. They are not sent to an analytics
          service.
        </p>
      </footer>
    </div>
  )
}
