import { describe, expect, it } from 'vitest'
import { formatInrDigits } from './money.ts'

describe('formatInrDigits', () => {
  it('formats the worked example and neighbouring amounts', () => {
    expect(formatInrDigits('36000')).toBe('₹36,000')
    expect(formatInrDigits('12000')).toBe('₹12,000')
    expect(formatInrDigits('72000')).toBe('₹72,000')
    expect(formatInrDigits('1000000')).toBe('₹10,00,000')
    expect(formatInrDigits('0')).toBe('₹0')
    expect(formatInrDigits('71994')).toBe('₹71,994')
    expect(formatInrDigits('144000')).toBe('₹1,44,000')
    expect(formatInrDigits('6000006')).toBe('₹60,00,006')
  })

  it('rejects strings that are not unsigned digits', () => {
    expect(() => formatInrDigits('12,000')).toThrow(/unsigned digit string/)
    expect(() => formatInrDigits('-1')).toThrow(/unsigned digit string/)
  })
})
