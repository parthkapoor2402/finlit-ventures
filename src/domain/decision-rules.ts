import type { Reason } from './sip-types.ts'

export const REASON_LABELS: Record<Reason, string> = {
  cash_need: 'Cash need',
  market_worry: 'Market worry',
  goal_reached: 'Goal reached or near',
  fund_no_longer_fits: 'Fund no longer fits',
  not_sure: "I'm not sure",
}

export const ADVICE_LINE = 'Decision support. Not investment advice.'

export const PAUSE_SEPARATE_LABEL = 'Full pause, shown separately'

/**
 * The sentence a reason pulls forward. Reasons are not scored.
 * The contribution formula does not change.
 */
export function reasonEmphasis(reason: Reason): string {
  switch (reason) {
    case 'cash_need':
      return 'A cash need can make a pause a legitimate choice. The restart month you name stays on the decision card. Skip Check does not restart the SIP.'
    case 'market_worry':
      return 'This number is not a loss. Existing units stay invested unless you redeem them in your own app.'
    case 'goal_reached':
      return 'A change in the goal is recorded as the plan you stated. It is not scored. A blank contribution target stays blank.'
    case 'fund_no_longer_fits':
      return 'This reason is not scored, and Skip Check does not name a replacement fund.'
    case 'not_sure':
      return 'No reason is inferred. The card records the comparison and the choice only.'
  }
}

/** Extra sentence for a reason. "I'm not sure" stays empty so the page does not infer a next step. */
export function reasonNote(reason: Reason): string | null {
  switch (reason) {
    case 'cash_need':
      return 'A cash need can be a sound reason to change a SIP. This page does not weigh that need for you.'
    case 'market_worry':
      return 'You selected market worry. This page only compares contributions. It does not judge the market.'
    case 'goal_reached':
      return 'A goal that has arrived, or is close, can be a reason to stop adding money. This page does not tell you which.'
    case 'fund_no_longer_fits':
      return 'This check does not name a replacement fund.'
    case 'not_sure':
      return null
  }
}

export const UNITS_STAY =
  'Changing future contributions does not itself redeem units you already hold. Those units stay invested unless you redeem them in your own app.'

export const UNITS_UNKNOWN =
  'How many units those contributions would have bought is unknown. This page does not estimate future units or NAV.'

export const NOT_A_LOSS =
  'This figure is a comparison of contributions under the amounts you entered. It is not a loss, a return, or a portfolio value.'

/** Lines that stay on the page. Market worry already says the loss and units lines, so they are not repeated. */
export function standingLines(reason: Reason | null): string[] {
  if (reason === 'market_worry') {
    return [UNITS_UNKNOWN, DOES_NOT_CHANGE, HANDOFF]
  }
  return [NOT_A_LOSS, UNITS_STAY, UNITS_UNKNOWN, DOES_NOT_CHANGE, HANDOFF]
}

export const DOES_NOT_CHANGE =
  'Skip Check does not skip, reduce, pause, restart, or cancel your SIP.'

export const HANDOFF = 'Any change has to be finished in your own investing app.'

export const RESTART_COPY =
  'A month you might start the SIP again. Skip Check will not restart it. Your investing app will not restart it unless that app says so.'

export const DIFFERENCE_LABEL =
  'Contributions that would not be invested over this period under these inputs.'

export const REGISTRATION_LINE =
  'FinLit states that it is not registered with SEBI or AMFI. A compliance review of this prototype has not been completed. This is not a recommendation to buy, hold, sell, continue, reduce, or stop an investment.'

export const REVIEW_LINE =
  'An optional FinLit review starts at ₹99. This prototype does not take payment.'

export const SAMPLE_BANNER =
  'Illustrative sample, using Ananya’s ₹12,000 SIP as an example. Ananya has not been interviewed. This is not your SIP, and this session is not counted as a decision.'

export const CHOICE_COPY = {
  keep: {
    title: 'Keep',
    body: 'The monthly amount stays the same. The contribution difference for that choice is ₹0.',
  },
  reduce: {
    title: 'Reduce',
    body: 'The monthly amount is above ₹0 and below the current SIP.',
  },
  pause: {
    title: 'Pause',
    body: 'The monthly amount for this comparison is ₹0.',
  },
} as const
