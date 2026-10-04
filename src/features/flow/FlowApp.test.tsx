import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { getEvents, resetAnalytics } from '../../analytics/track-event.ts'
import { informedChoiceRate } from '../../analytics/funnel-metrics.ts'
import { DIFFERENCE_LABEL } from '../../domain/decision-rules.ts'
import { FlowApp } from './FlowApp.tsx'

beforeEach(() => {
  resetAnalytics()
})

async function startDecision(user: ReturnType<typeof userEvent.setup>, reason: RegExp | string) {
  render(<FlowApp />)
  await user.click(screen.getByRole('button', { name: /I'm about to change a SIP/ }))
  await user.click(screen.getByRole('radio', { name: reason }))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
}

async function fillAmounts(
  user: ReturnType<typeof userEvent.setup>,
  current: string,
  proposed: string,
  months: string,
) {
  await user.type(screen.getByLabelText('Current monthly SIP'), current)
  await user.type(screen.getByLabelText('Monthly amount you are considering'), proposed)
  await user.type(screen.getByLabelText('Months to compare'), months)
  await user.click(screen.getByRole('button', { name: 'See the plan' }))
}

async function passCheck(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('radio', { name: /contributions that would not be invested/ }),
  )
  await user.click(screen.getByRole('radio', { name: /Existing units stay invested/ }))
  await user.click(screen.getByRole('button', { name: 'Show the decision card' }))
}

describe('Skip Check journey', () => {
  it('renders the entry and keeps the two doors at the same weight', () => {
    render(<FlowApp />)
    expect(
      screen.getByRole('heading', { name: /Before you confirm a SIP change/ }),
    ).toBeInTheDocument()
    const change = screen.getByRole('button', { name: /I'm about to change a SIP/ })
    const reading = screen.getByRole('button', { name: /I'm only reading/ })
    expect(change.className).toBe(reading.className)
    expect(document.body.textContent).not.toMatch(/you should/i)
    expect(document.body.textContent).not.toMatch(/you will lose/i)
  })

  it('completes a market-worry reduction and an accurate recap', async () => {
    const user = userEvent.setup()
    await startDecision(user, 'Market worry')
    await fillAmounts(user, '12000', '6000', '6')
    expect(screen.getByText('₹36,000')).toBeInTheDocument()
    expect(screen.getByText(DIFFERENCE_LABEL)).toBeInTheDocument()
    expect(screen.getByTestId('plan-headline')).toHaveTextContent('6 months of uninterrupted contribution stop')
    expect(screen.queryByText(/planned-contribution months/)).not.toBeInTheDocument()
    expect(screen.getByText(/units stay invested/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    const choices = screen.getAllByRole('radio')
    expect(choices).toHaveLength(3)
    for (const choice of choices) {
      expect(choice.closest('label')?.className).toContain('border-2')
      expect(choice.closest('label')?.className).not.toContain('bg-forest')
    }
    await user.click(screen.getByRole('radio', { name: /^Reduce/ }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await passCheck(user)
    expect(screen.getByRole('heading', { name: 'Decision card' })).toBeInTheDocument()
    expect(screen.getByText('Market worry')).toBeInTheDocument()
    expect(screen.getByText('Reduce')).toBeInTheDocument()
    expect(screen.getByText('₹12,000')).toBeInTheDocument()
    expect(screen.getByText('₹6,000')).toBeInTheDocument()
    expect(screen.getByText('6 months')).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Decision card' })).toHaveTextContent(/own investing app/i)
    expect(screen.getByRole('article', { name: 'Decision card' })).toHaveTextContent(/not an order/i)
    expect(JSON.stringify(getEvents())).not.toContain('12000')
    expect(informedChoiceRate(getEvents())).toEqual({ numerator: 1, denominator: 1, rate: 1 })
  })

  it('translates a stated target into planned-contribution months and a decision card', async () => {
    const user = userEvent.setup()
    await startDecision(user, 'Cash need')
    await user.type(screen.getByLabelText('Current monthly SIP'), '12000')
    await user.type(screen.getByLabelText('Monthly amount you are considering'), '6000')
    await user.type(screen.getByLabelText('Months to compare'), '6')
    await user.type(screen.getByLabelText(/Remaining contribution target/), '144000')
    await user.click(screen.getByRole('button', { name: 'See the plan' }))
    expect(screen.getByTestId('plan-headline')).toHaveTextContent('6 months of planned contributions')
    expect(screen.getByText(/24 months of planned contributions/)).toBeInTheDocument()
    expect(screen.getByText(/not wealth, returns, or units/)).toBeInTheDocument()
    expect(screen.getByText('₹36,000')).toBeInTheDocument()
    expect(screen.getByTestId('pause-aside')).toHaveTextContent('₹72,000')
    expect(screen.getByText('Full pause, shown separately')).toBeInTheDocument()
    expect(screen.getByText(/legitimate choice/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('radio', { name: /^Reduce/ }))
    await user.type(screen.getByLabelText(/Restart month/), 'June')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await passCheck(user)
    expect(screen.getByRole('heading', { name: 'Decision card' })).toBeInTheDocument()
    expect(screen.getByTestId('plan-headline')).toHaveTextContent('6 months of planned contributions')
    expect(screen.getByText('June')).toBeInTheDocument()
    expect(screen.getByText('Decision support. Not investment advice.')).toBeInTheDocument()
    const plain = screen.getByTestId('decision-plain-text') as HTMLTextAreaElement
    expect(plain.value).toContain('Contribution gap: ₹36,000')
    expect(plain.value).toContain('Restart month: June')
    expect(plain.value).toContain('Decision support. Not investment advice.')
    expect(document.body.textContent).not.toMatch(/you should/i)
  })

  it('does not divide a pause by zero when a target was stated', async () => {
    const user = userEvent.setup()
    await startDecision(user, 'Market worry')
    await user.type(screen.getByLabelText('Current monthly SIP'), '12000')
    await user.type(screen.getByLabelText('Monthly amount you are considering'), '0')
    await user.type(screen.getByLabelText('Months to compare'), '6')
    await user.type(screen.getByLabelText(/Remaining contribution target/), '144000')
    await user.click(screen.getByRole('button', { name: 'See the plan' }))
    expect(screen.getByText('₹72,000')).toBeInTheDocument()
    expect(screen.getByTestId('plan-headline')).toHaveTextContent('6 months of uninterrupted contribution stop')
    expect(screen.getByText(/not computed while the chosen monthly amount is ₹0/)).toBeInTheDocument()
    expect(screen.queryByText('24 months of planned contributions')).not.toBeInTheDocument()
  })

  it('lets a cash-need session pause without a restart month', async () => {
    const user = userEvent.setup()
    await startDecision(user, 'Cash need')
    await fillAmounts(user, '12000', '0', '6')
    expect(screen.getByText('₹72,000')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('radio', { name: /^Pause/ }))
    expect(screen.getByLabelText(/Restart month/)).toBeInTheDocument()
    expect(screen.getByText(/Skip Check will not restart it/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await passCheck(user)
    expect(screen.getByText('Cash need')).toBeInTheDocument()
    expect(screen.getByText('Pause')).toBeInTheDocument()
    expect(screen.getByText('₹72,000')).toBeInTheDocument()
    expect(screen.queryByText(/Restart month you noted/)).not.toBeInTheDocument()
  })

  it('records keep as a zero contribution difference', async () => {
    const user = userEvent.setup()
    await startDecision(user, /I'm not sure/)
    await fillAmounts(user, '12000', '12000', '6')
    expect(screen.getByText('₹0')).toBeInTheDocument()
    expect(screen.queryByText(/weigh that need|judge the market|replacement fund/)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('radio', { name: /^Keep/ }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await passCheck(user)
    expect(screen.getByText("I'm not sure")).toBeInTheDocument()
    expect(screen.getByText('Keep')).toBeInTheDocument()
    expect(screen.getByText('₹0')).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/you should/i)
  })

  it('shows a field error and then the corrected comparison', async () => {
    const user = userEvent.setup()
    await startDecision(user, 'Goal reached or near')
    await user.type(screen.getByLabelText('Current monthly SIP'), 'abc')
    await user.click(screen.getByRole('button', { name: 'See the plan' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/digits only/)
    expect(screen.queryByText(DIFFERENCE_LABEL)).not.toBeInTheDocument()
    await user.clear(screen.getByLabelText('Current monthly SIP'))
    await fillAmounts(user, '12000', '6000', '1')
    expect(screen.getByText('₹6,000')).toBeInTheDocument()
    expect(getEvents().some((event) => event.name === 'inputs_rejected')).toBe(true)
    expect(getEvents().filter((event) => event.name === 'valid_card_reached')).toHaveLength(1)
  })

  it('hides the result when a high amount is cancelled and shows it after confirmation', async () => {
    const user = userEvent.setup()
    await startDecision(user, 'Fund no longer fits')
    await fillAmounts(user, '1000001', '0', '6')
    expect(screen.getByRole('heading', { name: 'Check the digits' })).toBeInTheDocument()
    expect(screen.queryByText(DIFFERENCE_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByText('₹60,00,006')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Change the amounts' }))
    expect(screen.queryByText(DIFFERENCE_LABEL)).not.toBeInTheDocument()
    expect(screen.getByLabelText('Current monthly SIP')).toHaveValue('1000001')
    await user.click(screen.getByRole('button', { name: 'See the plan' }))
    await user.click(screen.getByRole('button', { name: 'These digits are right' }))
    expect(screen.getByText(DIFFERENCE_LABEL)).toBeInTheDocument()
    expect(screen.getByText('₹60,00,006')).toBeInTheDocument()
    expect(JSON.stringify(getEvents())).not.toContain('1000001')
  })

  it('edits an amount from the comparison and drops the stale figure', async () => {
    const user = userEvent.setup()
    await startDecision(user, 'Market worry')
    await fillAmounts(user, '12000', '6000', '6')
    expect(screen.getByText('₹36,000')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    const proposed = screen.getByLabelText('Monthly amount you are considering')
    await user.clear(proposed)
    await user.type(proposed, '8000')
    await user.click(screen.getByRole('button', { name: 'See the plan' }))
    expect(screen.getByText('₹24,000')).toBeInTheDocument()
    expect(screen.queryByText('₹36,000')).not.toBeInTheDocument()
  })

  it('keeps the illustrative sample out of the decision rate', async () => {
    const user = userEvent.setup()
    render(<FlowApp />)
    await user.click(screen.getByRole('button', { name: /I'm only reading/ }))
    expect(screen.getByRole('note')).toHaveTextContent(/Illustrative sample/)
    expect(screen.getByText('₹36,000')).toBeInTheDocument()
    expect(informedChoiceRate(getEvents())).toEqual({ numerator: 0, denominator: 0, rate: null })
    expect(getEvents().some((event) => event.name === 'sample_path_selected')).toBe(true)
    expect(getEvents().some((event) => event.name === 'decision_intent_selected')).toBe(false)
    expect(JSON.stringify(getEvents())).not.toContain('12000')
  })

  it('returns to the entry when the person leaves, and can note a restart month', async () => {
    const user = userEvent.setup()
    await startDecision(user, 'Cash need')
    await user.click(screen.getByRole('button', { name: 'Leave without choosing' }))
    expect(
      screen.getByRole('heading', { name: /Before you confirm a SIP change/ }),
    ).toBeInTheDocument()
    expect(getEvents().some((event) => event.name === 'flow_abandoned' && event.sessionKind === 'decision')).toBe(
      true,
    )

    await user.click(screen.getByRole('button', { name: /I'm about to change a SIP/ }))
    await user.click(screen.getByRole('radio', { name: 'Cash need' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await fillAmounts(user, '12000', '0', '24')
    expect(screen.getByText('₹2,88,000')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('radio', { name: /^Pause/ }))
    await user.type(screen.getByLabelText(/Restart month/), 'June')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await passCheck(user)
    expect(screen.getByText('June')).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Decision card' })).toHaveTextContent(
      /will not restart it unless that app says so/,
    )
  })

  it('explains a mismatched restatement and then accepts a correction', async () => {
    const user = userEvent.setup()
    await startDecision(user, /I'm not sure/)
    await fillAmounts(user, '8000', '4000', '2')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('radio', { name: /^Reduce/ }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('radio', { name: /a loss the change would cause/ }))
    await user.click(screen.getByRole('radio', { name: /sells the units/ }))
    await user.click(screen.getByRole('button', { name: 'Show the decision card' }))
    expect(screen.getByRole('status')).toHaveTextContent(/not a loss/)
    expect(screen.queryByRole('heading', { name: 'Decision card' })).not.toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/incorrect|wrong answer|you should/i)
    await passCheck(user)
    expect(screen.getByRole('heading', { name: 'Decision card' })).toBeInTheDocument()
    expect(screen.getByTestId('contribution-figure')).toHaveTextContent('₹8,000')
  })
})
