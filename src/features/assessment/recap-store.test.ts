import { describe, expect, it } from 'vitest'
import { deleteRecap, dueRecaps, reviewDateFor, saveRecap, type SavedRecap } from './recap-store.ts'

const recap: SavedRecap = {
  id: 'recap-1',
  savedAt: '2026-10-02T00:00:00.000Z',
  reason: 'cash_need',
  current: '12000',
  proposed: '6000',
  months: '6',
  contributionDifference: '36000',
  scenario: 'reduce',
  immediateExpenses: true,
  goalTimeline: '',
  note: '',
  knowledgeComplete: true,
  reviewChoice: '1',
  reviewDate: '2026-09-01',
}

describe('recap store', () => {
  it('saves and deletes only with an explicit write', () => {
    localStorage.clear()
    expect(saveRecap(recap)).toHaveLength(1)
    expect(deleteRecap(recap.id)).toHaveLength(0)
  })

  it('treats a past review date as due and does not invent delivery', () => {
    expect(dueRecaps([recap], new Date('2026-10-02T00:00:00.000Z'))).toHaveLength(1)
    expect(reviewDateFor('none', '')).toBeNull()
    expect(reviewDateFor('date', '2027-01-15')).toBe('2027-01-15')
  })
})
