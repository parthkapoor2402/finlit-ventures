import { describe, expect, it } from 'vitest'
import { KNOWLEDGE_QUESTIONS, allKnowledgeCorrect, gradeAnswer } from './knowledge-check.ts'

describe('knowledge check', () => {
  it('marks the three teaching answers and allows a miss to be retried', () => {
    const units = KNOWLEDGE_QUESTIONS[0]
    expect(units).toBeDefined()
    if (!units) return
    expect(gradeAnswer(units, 'redeemed').correct).toBe(false)
    expect(gradeAnswer(units, 'remain').correct).toBe(true)
    expect(gradeAnswer(units, 'remain').explanation).toMatch(/remain invested/i)
  })

  it('is complete only when every question matches', () => {
    expect(
      allKnowledgeCorrect({ units: 'remain', difference: '36000', portfolio: 'no' }),
    ).toBe(true)
    expect(allKnowledgeCorrect({ units: 'remain', difference: '6000', portfolio: 'no' })).toBe(
      false,
    )
  })
})
