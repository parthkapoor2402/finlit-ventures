import { describe, expect, it } from 'vitest'
import { buildScenarios, defaultExploreAmount } from './scenarios.ts'

describe('buildScenarios', () => {
  it('prices keep, reduce, and pause from the calculator', () => {
    const result = buildScenarios('12000', '6000', '6')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.scenarios.keep).toMatchObject({
      monthly: '12000',
      totalPlanned: '72000',
      contributionDifference: '0',
    })
    expect(result.scenarios.reduce).toMatchObject({
      monthly: '6000',
      totalPlanned: '36000',
      contributionDifference: '36000',
    })
    expect(result.scenarios.pause).toMatchObject({
      monthly: '0',
      totalPlanned: '0',
      contributionDifference: '72000',
    })
    expect(result.scenarios.explored).toBe('reduce')
  })

  it('rejects an increase', () => {
    const result = buildScenarios('12000', '13000', '6')
    expect(result.ok).toBe(false)
  })

  it('leaves the reduce card empty when the explored amount is a pause or a keep', () => {
    const pause = buildScenarios('12000', '0', '6')
    const keep = buildScenarios('12000', '12000', '6')
    expect(pause.ok && pause.scenarios.reduce).toBeNull()
    expect(keep.ok && keep.scenarios.reduce).toBeNull()
    expect(pause.ok && pause.scenarios.explored).toBe('pause')
    expect(keep.ok && keep.scenarios.explored).toBe('keep')
  })
})

describe('defaultExploreAmount', () => {
  it('uses half of a typical SIP', () => {
    expect(defaultExploreAmount('12000')).toBe('6000')
  })
})
