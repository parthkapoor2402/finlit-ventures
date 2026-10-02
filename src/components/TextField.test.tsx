import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { ForwardButton } from './ForwardButton.tsx'
import { TextField } from './TextField.tsx'

describe('design system controls', () => {
  it('associates an error with the field', () => {
    render(
      <TextField
        id="current-sip"
        label="Current monthly SIP"
        value=""
        error="Enter the current monthly amount for this SIP, in rupees."
        hint="Whole rupees for this SIP only."
        onChange={() => undefined}
      />,
    )
    const field = screen.getByLabelText('Current monthly SIP')
    expect(field).toHaveAttribute('aria-invalid', 'true')
    const error = screen.getByRole('alert')
    expect(field.getAttribute('aria-describedby')).toContain(error.id)
    expect(error).toHaveTextContent(/current monthly amount/)
  })

  it('names the forward button from its text', () => {
    render(<ForwardButton>See the comparison</ForwardButton>)
    expect(screen.getByRole('button', { name: 'See the comparison' })).toBeEnabled()
  })
})
