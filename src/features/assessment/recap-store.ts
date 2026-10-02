import type { AssessmentReason } from '../../domain/assessment-reasons.ts'
import type { Choice } from '../../domain/sip-types.ts'

export type ReviewChoice = 'none' | '1' | '3' | '6' | 'date'

export type SavedRecap = {
  id: string
  savedAt: string
  reason: AssessmentReason
  current: string
  proposed: string
  months: string
  contributionDifference: string
  scenario: Choice
  immediateExpenses: boolean
  goalTimeline: string
  note: string
  knowledgeComplete: boolean
  reviewChoice: ReviewChoice
  reviewDate: string | null
}

const STORAGE_KEY = 'skip-check-recaps'

function canUseStorage(): boolean {
  return typeof localStorage !== 'undefined'
}

export function loadRecaps(): SavedRecap[] {
  if (!canUseStorage()) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isRecap)
  } catch {
    return []
  }
}

export function saveRecap(recap: SavedRecap): SavedRecap[] {
  const next = [recap, ...loadRecaps().filter((item) => item.id !== recap.id)]
  write(next)
  return next
}

export function updateRecap(id: string, patch: Partial<Pick<SavedRecap, 'note' | 'reviewChoice' | 'reviewDate'>>): SavedRecap[] {
  const next = loadRecaps().map((item) => (item.id === id ? { ...item, ...patch } : item))
  write(next)
  return next
}

export function deleteRecap(id: string): SavedRecap[] {
  const next = loadRecaps().filter((item) => item.id !== id)
  write(next)
  return next
}

export function reviewDateFor(choice: ReviewChoice, explicitDate: string, from = new Date()): string | null {
  if (choice === 'none') return null
  if (choice === 'date') return explicitDate.trim() || null
  const months = Number(choice)
  const copy = new Date(from.getTime())
  copy.setMonth(copy.getMonth() + months)
  return copy.toISOString().slice(0, 10)
}

export function dueRecaps(recaps: SavedRecap[], today = new Date()): SavedRecap[] {
  const stamp = today.toISOString().slice(0, 10)
  return recaps.filter((recap) => recap.reviewDate !== null && recap.reviewDate <= stamp)
}

function write(recaps: SavedRecap[]): void {
  if (!canUseStorage()) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recaps))
}

function isRecap(value: unknown): value is SavedRecap {
  if (!value || typeof value !== 'object') return false
  const recap = value as Partial<SavedRecap>
  return typeof recap.id === 'string' && typeof recap.contributionDifference === 'string'
}
