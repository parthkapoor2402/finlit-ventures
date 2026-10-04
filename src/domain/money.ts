const RUPEE = '₹'

/** Indian grouping: last three digits, then pairs. Digit strings only. */
export function formatInrDigits(digits: string): string {
  if (!/^\d+$/.test(digits)) {
    throw new Error('formatInrDigits expects an unsigned digit string')
  }
  if (digits.length <= 3) {
    return `${RUPEE}${digits}`
  }
  const tail = digits.slice(-3)
  const head = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return `${RUPEE}${head},${tail}`
}
