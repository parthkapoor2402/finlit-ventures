/**
 * One place for FinLit contact settings.
 * Leave the URLs empty until a real page exists. This file does not invent a phone number, email, WhatsApp link, or booking page.
 */
function readUrl(name: 'VITE_FINLIT_CONTACT_URL' | 'VITE_FINLIT_BOOKING_URL'): string {
  const env = import.meta.env as unknown as Record<string, string | undefined>
  const value = env[name]
  return typeof value === 'string' ? value.trim() : ''
}

export const finlitContact = {
  contactUrl: readUrl('VITE_FINLIT_CONTACT_URL'),
  bookingUrl: readUrl('VITE_FINLIT_BOOKING_URL'),
  reviewPrice: '₹99',
  supportNote:
    'A person at FinLit is not connected in this prototype. Nothing here claims that someone will reply.',
  reviewNote:
    'An optional FinLit review is listed at ₹99. This prototype does not take payment, does not book that review, and does not explain a paid session beyond that published list price. The calculator stays free.',
}

export function hasFinlitDestination(): boolean {
  return finlitContact.contactUrl.length > 0 || finlitContact.bookingUrl.length > 0
}
