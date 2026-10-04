import type { ReactNode } from 'react'

export function ForwardButton({
  children,
  type = 'submit',
}: {
  children: ReactNode
  type?: 'submit' | 'button'
}) {
  return (
    <button
      type={type}
      className="mt-8 w-full min-h-12 bg-forest px-4 py-3 font-semibold text-paper"
    >
      {children}
    </button>
  )
}
