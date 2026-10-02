import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { AssessmentApp } from './AssessmentApp.tsx'

beforeEach(() => {
  localStorage.clear()
})

async function reachScenarios(user: ReturnType<typeof userEvent.setup>) {
  render(<AssessmentApp />)
  await user.click(screen.getByRole('button', { name: 'Start my assessment' }))
  await user.click(screen.getByRole('radio', { name: 'I need cash for upcoming expenses.' }))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.type(screen.getByLabelText('Current monthly SIP'), '12000')
  await user.type(screen.getByLabelText('Proposed monthly SIP'), '6000')
  await user.clear(screen.getByLabelText('Months for this change'))
  await user.type(screen.getByLabelText('Months for this change'), '6')
  await user.click(screen.getByRole('button', { name: 'See the scenarios' }))
}

describe('SIP impact assessment', () => {
  it('shows keep, reduce, and pause with a ₹36,000 contribution difference', async () => {
    const user = userEvent.setup()
    await reachScenarios(user)
    expect(screen.getByRole('heading', { name: 'Keep' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Reduce' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Pause' })).toBeVisible()
    expect(screen.getAllByText(/₹36,000/).length).toBeGreaterThan(0)
    expect(screen.getByText(/not an investment loss/i)).toBeVisible()
    expect(screen.getByText(/does not redeem or sell/i)).toBeVisible()
  })

  it('rejects an increase and still offers pause', async () => {
    const user = userEvent.setup()
    render(<AssessmentApp />)
    await user.click(screen.getByRole('button', { name: 'Start my assessment' }))
    await user.click(screen.getByRole('radio', { name: 'I am worried about market fluctuations.' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.type(screen.getByLabelText('Current monthly SIP'), '12000')
    await user.type(screen.getByLabelText('Proposed monthly SIP'), '13000')
    await user.click(screen.getByRole('button', { name: 'See the scenarios' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/outside this assessment/i)
  })

  it('reaches a recap and can finish without the bot', async () => {
    const user = userEvent.setup()
    await reachScenarios(user)
    await user.click(screen.getByRole('button', { name: 'Check my understanding' }))
    await user.click(screen.getByRole('radio', { name: 'They generally remain invested unless separately redeemed.' }))
    await user.click(screen.getByRole('radio', { name: '₹36,000' }))
    await user.click(screen.getByRole('radio', { name: 'No. It is only the difference in planned contributions.' }))
    await user.click(screen.getByRole('button', { name: 'See my recap' }))
    expect(screen.getByRole('heading', { name: 'Assessment recap' })).toBeVisible()
    expect(screen.getByText(/has not changed your SIP/i)).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Finish for now' }))
    expect(screen.getByText(/without chatting or saving/i)).toBeVisible()
  })
})
