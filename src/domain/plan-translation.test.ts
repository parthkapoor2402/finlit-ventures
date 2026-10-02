import { describe, expect, it } from 'vitest'
import { reasonEmphasis } from './decision-rules.ts'
import { calculateContributionDifference } from './sip-calculator.ts'
import {
  buildDecisionCard,
  continuityCopy,
  decisionCardPlainText,
  divideExactly,
  formatPlannedContributionMonths,
  goalShiftCopy,
  separatePauseComparison,
  translatePlan,
  type GoalTimeShift,
} from './plan-translation.ts'

function result(current: string, proposed: string, months: string) {
  const calculated = calculateContributionDifference({
    currentMonthlyAmount: current,
    proposedMonthlyAmount: proposed,
    months,
  })
  if (!calculated.ok) throw new Error(calculated.message)
  return calculated
}

function asShift(
  translation: { ok: true; translation: GoalTimeShift | { kind: 'continuity' } } | { ok: false },
): GoalTimeShift {
  expect(translation.ok).toBe(true)
  if (!translation.ok || translation.translation.kind !== 'goal-time-shift') {
    throw new Error('expected a goal-time shift')
  }
  return translation.translation
}

describe('plan translation', () => {
  it('turns the ₹12,000 to ₹6,000 hero gap into 6 planned-contribution months', () => {
    const calculated = result('12000', '6000', '6')
    expect(calculated.contributionDifference).toBe('36000')
    const shift = asShift(
      translatePlan({ result: calculated, remainingTargetRaw: '1,44,000', restartMonth: '' }),
    )
    expect(shift.gapSpan).toEqual({ wholeMonths: '6', remainderRupees: '0' })
    expect(shift.targetSpan).toEqual({ wholeMonths: '24', remainderRupees: '0' })
    expect(shift.remainingTarget).toBe('144000')
    const copy = goalShiftCopy(shift)
    expect(copy.headline).toBe('6 months of planned contributions')
    expect(copy.gapLine).toContain('planned-contribution months, not wealth, returns, or units')
    expect(copy.targetLine).toBe(
      'At ₹6,000 a month, the remaining contribution target of ₹1,44,000 is 24 months of planned contributions.',
    )
  })

  it('keeps a remainder in rupees instead of a rounded month', () => {
    const calculated = result('10000', '3000', '2')
    expect(calculated.contributionDifference).toBe('14000')
    const shift = asShift(
      translatePlan({ result: calculated, remainingTargetRaw: '10000', restartMonth: '' }),
    )
    expect(shift.gapSpan).toEqual({ wholeMonths: '4', remainderRupees: '2000' })
    expect(shift.targetSpan).toEqual({ wholeMonths: '3', remainderRupees: '1000' })
    expect(formatPlannedContributionMonths(shift.gapSpan)).toBe(
      '4 months and ₹2,000 of planned contributions',
    )
    expect(formatPlannedContributionMonths({ wholeMonths: '0', remainderRupees: '500' })).toBe(
      '₹500 toward the next month of planned contributions',
    )
    expect(formatPlannedContributionMonths({ wholeMonths: '1', remainderRupees: '0' })).toBe(
      '1 month of planned contributions',
    )
  })

  it('does not invent a goal when the target is blank', () => {
    const calculated = result('12000', '6000', '6')
    const plan = translatePlan({ result: calculated, remainingTargetRaw: '   ', restartMonth: '' })
    expect(plan.ok && plan.translation.kind).toBe('continuity')
    if (!plan.ok || plan.translation.kind !== 'continuity') return
    expect(plan.translation.habit).toBe('reduced')
    expect(plan.translation.monthsUninterruptedThatStop).toBe('6')
    expect(plan.translation.statedTargetNotDivided).toBeNull()
    expect(continuityCopy(plan.translation).headline).toBe('6 months of uninterrupted contribution stop')
    expect(continuityCopy(plan.translation).detail).toContain('₹6,000 would continue')
  })

  it('labels a full pause of ₹12,000 for 6 months as ₹72,000 and does not divide by zero', () => {
    const pause = result('12000', '0', '6')
    expect(pause.contributionDifference).toBe('72000')
    const plan = translatePlan({
      result: pause,
      remainingTargetRaw: '144000',
      restartMonth: 'June',
    })
    expect(plan.ok && plan.translation.kind).toBe('continuity')
    if (!plan.ok || plan.translation.kind !== 'continuity') return
    expect(plan.translation.habit).toBe('stops')
    expect(plan.translation.statedTargetNotDivided).toBe('144000')
    expect(plan.translation.restartMonth).toBe('June')
    const detail = continuityCopy(plan.translation).detail
    expect(detail).toContain('not computed')
    expect(detail).toContain('June')
    expect(detail).not.toMatch(/months of planned contributions are 0/i)

    const reduction = result('12000', '6000', '6')
    const separate = separatePauseComparison(reduction)
    expect(separate?.contributionDifference).toBe('72000')
    expect(separate?.mode).toBe('pause')
    expect(separatePauseComparison(pause)).toBeNull()
  })

  it('treats the same rupee gap as different habits for a reduction and a pause', () => {
    const reduced = result('8000', '2000', '6')
    const paused = result('6000', '0', '6')
    expect(reduced.contributionDifference).toBe('36000')
    expect(paused.contributionDifference).toBe('36000')
    const reducePlan = translatePlan({ result: reduced, remainingTargetRaw: '', restartMonth: '' })
    const pausePlan = translatePlan({ result: paused, remainingTargetRaw: '', restartMonth: '' })
    expect(reducePlan.ok && reducePlan.translation.kind === 'continuity' && reducePlan.translation.habit).toBe(
      'reduced',
    )
    expect(pausePlan.ok && pausePlan.translation.kind === 'continuity' && pausePlan.translation.habit).toBe(
      'stops',
    )
  })

  it('shows a zero shift when the person keeps a stated target', () => {
    const kept = result('12000', '12000', '6')
    const shift = asShift(
      translatePlan({ result: kept, remainingTargetRaw: '144000', restartMonth: 'June' }),
    )
    expect(shift.gapSpan).toEqual({ wholeMonths: '0', remainderRupees: '0' })
    expect(shift.targetSpan).toEqual({ wholeMonths: '12', remainderRupees: '0' })
    expect(goalShiftCopy(shift).headline).toBe('0 months of planned contributions')
  })

  it('rejects a target that is not a positive whole-rupee figure and accepts a blank', () => {
    expect(translatePlan({ result: result('12000', '6000', '6'), remainingTargetRaw: '12.5', restartMonth: '' })).toMatchObject({
      ok: false,
    })
    expect(translatePlan({ result: result('12000', '6000', '6'), remainingTargetRaw: '0', restartMonth: '' })).toMatchObject({
      ok: false,
    })
    expect(translatePlan({ result: result('12000', '6000', '6'), remainingTargetRaw: '-5', restartMonth: '' })).toMatchObject({
      ok: false,
    })
    expect(
      translatePlan({ result: result('12000', '6000', '6'), remainingTargetRaw: '', restartMonth: '' }).ok,
    ).toBe(true)
  })

  it('divides large integers exactly', () => {
    const calculated = result('9007199254740993', '6000', '1')
    const gap = BigInt(calculated.contributionDifference)
    const shift = asShift(
      translatePlan({ result: calculated, remainingTargetRaw: '9007199254740993', restartMonth: '' }),
    )
    const whole = BigInt(shift.gapSpan.wholeMonths)
    const remainder = BigInt(shift.gapSpan.remainderRupees)
    expect(whole * 6000n + remainder).toBe(gap)
    expect(shift.gapSpan.wholeMonths).not.toContain('.')
    const direct = divideExactly(gap, 6000n)
    expect(direct).toEqual(shift.gapSpan)
  })

  it('changes the emphasized sentence with the reason and leaves the gap alone', () => {
    const calculated = result('12000', '6000', '6')
    const cash = asShift(
      translatePlan({ result: calculated, remainingTargetRaw: '144000', restartMonth: '' }),
    )
    const market = asShift(
      translatePlan({ result: calculated, remainingTargetRaw: '144000', restartMonth: '' }),
    )
    expect(cash.gapSpan).toEqual(market.gapSpan)
    expect(reasonEmphasis('cash_need')).toMatch(/legitimate choice/)
    expect(reasonEmphasis('cash_need')).toMatch(/restart/i)
    expect(reasonEmphasis('market_worry')).toMatch(/not a loss/)
    expect(reasonEmphasis('market_worry')).toMatch(/units stay invested/i)
    expect(reasonEmphasis('goal_reached')).toMatch(/not scored/)
    for (const reason of ['cash_need', 'market_worry', 'goal_reached', 'fund_no_longer_fits', 'not_sure'] as const) {
      expect(reasonEmphasis(reason).toLowerCase()).not.toMatch(/you should|good reason|bad reason/)
    }
    expect(reasonEmphasis('cash_need')).not.toBe(reasonEmphasis('market_worry'))
  })

  it('writes a decision card the person can copy, including a named restart', () => {
    const calculated = result('12000', '6000', '6')
    const plan = translatePlan({
      result: calculated,
      remainingTargetRaw: '144000',
      restartMonth: 'June',
    })
    if (!plan.ok) throw new Error(plan.message)
    const card = buildDecisionCard({
      reason: 'cash_need',
      choice: 'reduce',
      result: calculated,
      translation: plan.translation,
      restartMonth: 'June',
    })
    const text = decisionCardPlainText(card)
    expect(text).toContain('Reason: Cash need')
    expect(text).toContain('Choice: Reduce')
    expect(text).toContain('Current monthly SIP: ₹12,000')
    expect(text).toContain('Proposed monthly SIP: ₹6,000')
    expect(text).toContain('Months: 6 months')
    expect(text).toContain('Contribution gap: ₹36,000')
    expect(text).toContain('6 months of planned contributions')
    expect(text).toContain('24 months of planned contributions')
    expect(text).toContain('Restart month: June')
    expect(text).toContain('Full pause, shown separately')
    expect(text).toContain('₹72,000')
    expect(text).toContain('Decision support. Not investment advice.')
    expect(text.toLowerCase()).not.toMatch(/you should|guaranteed return|you will lose/)
    expect(card.emphasis).toMatch(/legitimate choice/)
  })
})
