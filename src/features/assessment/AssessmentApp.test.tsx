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
  await user.click(screen.getByRole('button', { name: 'Explore my options' }))
  await user.click(screen.getByRole('radio', { name: /My expenses or priorities have changed/ }))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.type(screen.getByLabelText('Current monthly SIP'), '12000')
  await user.type(screen.getByLabelText('What monthly amount are you considering?'), '6000')
  await user.clear(screen.getByLabelText('Duration in months'))
  await user.type(screen.getByLabelText('Duration in months'), '6')
  await user.click(screen.getByRole('button', { name: 'See the numbers' }))
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
    expect(screen.getByRole('button', { name: 'Reset to my original inputs' })).toBeVisible()
    await user.clear(screen.getByLabelText('Amount'))
    await user.type(screen.getByLabelText('Amount'), '5000')
    expect(screen.getByText('₹42,000 less in planned contributions over this period.')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Reset to my original inputs' }))
    expect(screen.getByText('₹36,000 less in planned contributions over this period.')).toBeVisible()
  })

  it('rejects an increase and still offers pause', async () => {
    const user = userEvent.setup()
    render(<AssessmentApp />)
    await user.click(screen.getByRole('button', { name: 'Explore my options' }))
    await user.click(screen.getByRole('radio', { name: /I’m unsure about market movements/ }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.type(screen.getByLabelText('Current monthly SIP'), '12000')
    await user.type(screen.getByLabelText('What monthly amount are you considering?'), '13000')
    await user.click(screen.getByRole('button', { name: 'See the numbers' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/outside this assessment/i)
  })

  it('reaches a recap without answering the clarity questions', async () => {
    const user = userEvent.setup()
    await reachScenarios(user)
    await user.click(screen.getByRole('button', { name: 'Skip for now' }))
    expect(screen.getByRole('heading', { name: 'Here’s what you explored.' })).toBeVisible()
    expect(screen.getByText(/has not changed your SIP/i)).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Finish for now' }))
    expect(screen.getByText(/without chatting, saving, or setting a reminder/i)).toBeVisible()
  })

  it('lets someone continue without a proposed amount', async () => {
    const user = userEvent.setup()
    render(<AssessmentApp />)
    await user.click(screen.getByRole('button', { name: 'Explore my options' }))
    await user.click(screen.getByRole('button', { name: 'Skip this' }))
    await user.type(screen.getByLabelText('Current monthly SIP'), '12000')
    await user.click(screen.getByRole('checkbox', { name: /haven’t decided on an amount yet/i }))
    await user.click(screen.getByRole('button', { name: 'See the numbers' }))
    expect(screen.getByText(/not an amount you decided/i)).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Pause' })).toBeVisible()
  })
})
