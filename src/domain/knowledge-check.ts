export type KnowledgeQuestion = {
  id: 'units' | 'difference' | 'portfolio'
  prompt: string
  options: { id: string; label: string }[]
  correctId: string
  explanation: string
}

export const KNOWLEDGE_QUESTIONS: KnowledgeQuestion[] = [
  {
    id: 'units',
    prompt: 'If you pause future SIP contributions, what happens to the units you already own?',
    options: [
      { id: 'redeemed', label: 'They are automatically redeemed.' },
      { id: 'remain', label: 'They generally remain invested unless separately redeemed.' },
      { id: 'guaranteed', label: 'They are guaranteed to increase in value.' },
    ],
    correctId: 'remain',
    explanation:
      'Pausing future contributions does not itself sell units you already hold. Those units generally remain invested unless you redeem them separately in your own app.',
  },
  {
    id: 'difference',
    prompt:
      'If you reduce a ₹12,000 SIP to ₹6,000 for six months, what is the contribution difference?',
    options: [
      { id: '6000', label: '₹6,000' },
      { id: '36000', label: '₹36,000' },
      { id: '72000', label: '₹72,000' },
    ],
    correctId: '36000',
    explanation:
      'The monthly difference is ₹6,000. Over six months, that is ₹36,000 less in planned contributions.',
  },
  {
    id: 'portfolio',
    prompt: 'Does this contribution difference tell you how much your portfolio will gain or lose?',
    options: [
      { id: 'yes', label: 'Yes, exactly.' },
      { id: 'no', label: 'No, it only compares planned contributions under the selected inputs.' },
    ],
    correctId: 'no',
    explanation:
      'Investment performance depends on many factors. This calculator does not predict future returns or portfolio value.',
  },
]

export function gradeAnswer(
  question: KnowledgeQuestion,
  answerId: string,
): { correct: boolean; explanation: string } {
  return {
    correct: answerId === question.correctId,
    explanation: question.explanation,
  }
}

export function allKnowledgeCorrect(answers: Record<string, string>): boolean {
  return KNOWLEDGE_QUESTIONS.every((question) => answers[question.id] === question.correctId)
}
