import { afterEach, describe, expect, it } from 'vitest'
import {
  MISSING_KEY_MESSAGE,
  SIP_CHECK_SYSTEM_PROMPT,
  contextAppendix,
  extractReply,
  handleChatRequest,
  resetRateLimit,
  validateChatRequest,
} from './sip-check-bot.ts'

const context = {
  reason: 'cash_need' as const,
  current: '12000',
  proposed: '6000',
  months: '6',
  contributionDifference: '36000',
  scenario: 'reduce' as const,
  misconceptions: [],
}

describe('SIP Check request checks', () => {
  afterEach(() => resetRateLimit())

  it('rejects a missing key without echoing a secret', async () => {
    const result = await handleChatRequest(
      { messages: [{ role: 'user', content: 'What should I do?' }], context },
      '127.0.0.1',
      { apiKey: undefined, fetchImpl: fetch },
    )
    expect(result.status).toBe(503)
    expect(result.body.message).toBe(MISSING_KEY_MESSAGE)
    expect(JSON.stringify(result.body)).not.toMatch(/xai-|sk-|Bearer/)
  })

  it('puts the calculator figures in the model context and keeps the safety rules', () => {
    const appendix = contextAppendix(context)
    expect(appendix).toContain('36000')
    expect(appendix).toContain('12000')
    expect(SIP_CHECK_SYSTEM_PROMPT).toMatch(/must not/i)
    expect(SIP_CHECK_SYSTEM_PROMPT).toMatch(/from an investment loss/i)
    const parsed = validateChatRequest({
      messages: [{ role: 'user', content: 'Recommend a mutual fund' }],
      context,
    })
    expect(parsed.ok).toBe(true)
  })

  it('returns the model text and does not call another provider', async () => {
    const calls: string[] = []
    const fetchImpl: typeof fetch = async (input) => {
      calls.push(String(input))
      return new Response(JSON.stringify({ output_text: 'Existing units generally stay invested unless you redeem them.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const result = await handleChatRequest(
      { messages: [{ role: 'user', content: 'What happens to units I already own?' }], context },
      '10.0.0.8',
      { apiKey: 'test-key-not-real', fetchImpl },
    )
    expect(result.status).toBe(200)
    expect(result.body.reply).toMatch(/stay invested/i)
    expect(calls).toEqual(['https://api.x.ai/v1/responses'])
    expect(JSON.stringify(result.body)).not.toContain('test-key-not-real')
  })

  it('reports a timeout without claiming the SIP changed', async () => {
    const fetchImpl: typeof fetch = async () => {
      throw new Error('aborted')
    }
    const result = await handleChatRequest(
      { messages: [{ role: 'user', content: 'Has my SIP already been paused?' }], context },
      '10.0.0.9',
      { apiKey: 'test-key-not-real', fetchImpl },
    )
    expect(result.status).toBe(504)
    expect(result.body.message).toMatch(/has not been changed/i)
  })

  it('reads a responses payload', () => {
    expect(
      extractReply({
        output: [{ content: [{ type: 'output_text', text: 'The difference is ₹36,000.' }] }],
      }),
    ).toBe('The difference is ₹36,000.')
  })
})
