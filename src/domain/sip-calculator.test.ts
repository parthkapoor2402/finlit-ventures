import { describe, expect, it } from 'vitest'
import { calculateContributionDifference, contributionForChoice } from './sip-calculator.ts'
import type { ContributionInput } from './sip-types.ts'

function calc(current: string, proposed: string, months: string) {
  return calculateContributionDifference({
    currentMonthlyAmount: current,
    proposedMonthlyAmount: proposed,
    months,
  })
}

describe('calculateContributionDifference', () => {
  it('reduces ₹12,000 to ₹6,000 over six months to ₹36,000', () => {
    const result = calc('12000', '6000', '6')
    expect(result).toMatchObject({
      ok: true,
      contributionDifference: '36000',
      monthlyDifference: '6000',
      mode: 'reduce',
      confirmationRequired: false,
    })
  })

  it('keeps ₹12,000 for six months at ₹0', () => {
    expect(calc('12000', '12000', '6')).toMatchObject({
      ok: true,
      contributionDifference: '0',
      mode: 'keep',
    })
  })

  it('pauses a ₹12,000 SIP for six months at ₹72,000', () => {
    expect(calc('12000', '0', '6')).toMatchObject({
      ok: true,
      contributionDifference: '72000',
      mode: 'pause',
    })
  })

  it('reduces a SIP to ₹1', () => {
    expect(calc('12000', '1', '6')).toMatchObject({
      ok: true,
      contributionDifference: '71994',
      mode: 'reduce',
    })
  })

  it('rejects a zero current amount', () => {
    expect(calc('0', '0', '6')).toMatchObject({ ok: false, code: 'zero_current', field: 'current' })
  })

  it('rejects a negative current amount', () => {
    expect(calc('-12000', '0', '6')).toMatchObject({ ok: false, code: 'negative', field: 'current' })
  })

  it('rejects a negative proposed amount', () => {
    expect(calc('12000', '-1', '6')).toMatchObject({ ok: false, code: 'negative', field: 'proposed' })
  })

  it('rejects non-numeric input', () => {
    expect(calc('12abc', '0', '6')).toMatchObject({ ok: false, code: 'non_numeric' })
    expect(calc('12000', '12.5', '6')).toMatchObject({ ok: false, code: 'non_numeric', field: 'proposed' })
    expect(calc('12000', '0', '6m')).toMatchObject({ ok: false, code: 'non_numeric', field: 'months' })
  })

  it('rejects empty input and does not treat a blank as zero', () => {
    expect(calc('   ', '0', '6')).toMatchObject({ ok: false, code: 'blank', field: 'current' })
    expect(calc('12000', '', '6')).toMatchObject({ ok: false, code: 'blank', field: 'proposed' })
    expect(calc('12000', '0', '')).toMatchObject({ ok: false, code: 'blank', field: 'months' })
  })

  it('accepts a proposed amount equal to the current amount as Keep', () => {
    expect(calc('5000', '5000', '3')).toMatchObject({ ok: true, mode: 'keep', contributionDifference: '0' })
  })

  it('rejects a proposed amount greater than the current amount', () => {
    expect(calc('5000', '5001', '3')).toMatchObject({ ok: false, code: 'increase', field: 'proposed' })
  })

  it('accepts one month and twenty-four months', () => {
    expect(calc('1000', '0', '1')).toMatchObject({ ok: true, contributionDifference: '1000', months: '1' })
    expect(calc('1000', '0', '24')).toMatchObject({
      ok: true,
      contributionDifference: '24000',
      months: '24',
    })
  })

  it('rejects zero months and twenty-five months', () => {
    expect(calc('1000', '0', '0')).toMatchObject({ ok: false, code: 'months_range' })
    expect(calc('1000', '0', '25')).toMatchObject({ ok: false, code: 'months_range' })
    expect(calc('1000', '0', '-3')).toMatchObject({ ok: false, code: 'months_range' })
  })

  it('does not silently overflow very large valid integers', () => {
    const result = calc('9007199254740993', '0', '2')
    expect(result).toMatchObject({
      ok: true,
      contributionDifference: '18014398509481986',
    })
  })

  it('rejects more than 18 digits', () => {
    expect(calc('1'.repeat(19), '0', '1')).toMatchObject({ ok: false, code: 'too_large' })
  })

  it('flags amounts above ₹10,00,000 and not the threshold itself', () => {
    expect(calc('1000000', '0', '1')).toMatchObject({ ok: true, confirmationRequired: false })
    expect(calc('1000001', '0', '6')).toMatchObject({
      ok: true,
      confirmationRequired: true,
      contributionDifference: '6000006',
    })
    expect(calc('2000000', '1000000', '1')).toMatchObject({ ok: true, confirmationRequired: true })
  })

  it('returns identical output for identical input and does not mutate the input', () => {
    const input: ContributionInput = {
      currentMonthlyAmount: '12,000',
      proposedMonthlyAmount: '₹6,000',
      months: '6',
    }
    const first = calculateContributionDifference(input)
    const second = calculateContributionDifference(input)
    expect(first).toEqual(second)
    expect(first).toMatchObject({ ok: true, contributionDifference: '36000' })
    expect(input).toEqual({
      currentMonthlyAmount: '12,000',
      proposedMonthlyAmount: '₹6,000',
      months: '6',
    })
  })
})

describe('contributionForChoice', () => {
  it('recomputes keep and pause from the current amount', () => {
    expect(contributionForChoice('12000', '6000', '6', 'keep')).toMatchObject({
      ok: true,
      mode: 'keep',
      contributionDifference: '0',
    })
    expect(contributionForChoice('12000', '12000', '6', 'pause')).toMatchObject({
      ok: true,
      mode: 'pause',
      contributionDifference: '72000',
    })
  })

  it('rejects reduce when the proposed amount is not lower', () => {
    expect(contributionForChoice('12000', '12000', '6', 'reduce')).toMatchObject({
      ok: false,
      code: 'reduce_needs_lower_amount',
    })
    expect(contributionForChoice('12000', '0', '6', 'reduce')).toMatchObject({
      ok: false,
      code: 'reduce_needs_lower_amount',
    })
  })
})
