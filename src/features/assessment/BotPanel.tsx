import { useEffect, useState } from 'react'
import { BOT_OPENING, type BotContext } from '../../domain/bot-copy.ts'
import { trackAssessment } from '../../analytics/assessment-events.ts'
import { ReplyText } from './ReplyText.tsx'

type ChatTurn = { role: 'user' | 'assistant'; content: string }

const STARTERS = [
  'Explain the contribution difference.',
  'What happens to my existing units?',
  'Explain reducing versus pausing.',
  'Help me understand this scenario.',
  'I want to talk to FinLit Ventures.',
]

export function BotPanel({
  context,
  sessionId,
  sessionKind,
  opened = false,
}: {
  context: BotContext
  sessionId: string
  sessionKind: 'decision' | 'sample'
  opened?: boolean
}) {
  const [open, setOpen] = useState(opened)
  useEffect(() => {
    if (opened) setOpen(true)
  }, [opened])
  const [draft, setDraft] = useState('')
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [helpful, setHelpful] = useState<'yes' | 'no' | null>(null)

  async function send(text: string) {
    const content = text.trim()
    if (!content || pending) return
    const nextTurns: ChatTurn[] = [...turns, { role: 'user', content }]
    setTurns(nextTurns)
    setDraft('')
    setPending(true)
    setError(null)
    trackAssessment({ name: 'bot_message_sent', sessionId, sessionKind })
    try {
      const response = await fetch('/api/sip-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextTurns.map((turn) => ({ role: turn.role, content: turn.content })),
          context,
        }),
      })
      const payload = (await response.json()) as { reply?: string; message?: string }
      if (!response.ok || !payload.reply) {
        setError(payload.message ?? 'SIP Check could not reply just now.')
        return
      }
      setTurns((current) => [...current, { role: 'assistant', content: payload.reply ?? '' }])
    } catch {
      setError('SIP Check is unavailable right now. The numbers on this page still stand, and your SIP has not been changed.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-line bg-card p-4" aria-label="SIP Check Bot">
      <h2 className="font-serif text-2xl">SIP Check Bot</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        This assistant explains the numbers the app already calculated. A key starting with gsk_ is answered by Groq. A key starting with xai- is answered by Grok. It does not choose for you, and it does not change your SIP. FinLit is not registered with SEBI or AMFI.
      </p>
      {!open ? (
        <button
          type="button"
          className="mt-4 min-h-12 rounded-full bg-forest px-5 text-card"
          onClick={() => {
            setOpen(true)
            trackAssessment({ name: 'bot_opened', sessionId, sessionKind })
          }}
        >
          Chat with SIP Check Bot
        </button>
      ) : (
        <div className="mt-4">
          <p className="leading-relaxed">{BOT_OPENING}</p>
          <ul className="mt-4 flex flex-col gap-2">
            {STARTERS.map((starter) => (
              <li key={starter}>
                <button
                  type="button"
                  className="min-h-12 w-full rounded-2xl border border-line bg-paper px-3 text-left text-sm"
                  onClick={() => void send(starter)}
                >
                  {starter}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-3" aria-live="polite">
            {turns.map((turn, index) =>
              turn.role === 'user' ? (
                <p key={`${turn.role}-${index}`} className="leading-relaxed">
                  <span className="font-semibold">You: </span>
                  {turn.content}
                </p>
              ) : (
                <div key={`${turn.role}-${index}`} className="rounded-2xl bg-paper px-3 py-3">
                  <p className="font-semibold">SIP Check</p>
                  <div className="mt-2">
                    <ReplyText text={turn.content} />
                  </div>
                </div>
              ),
            )}
            {pending ? <p className="text-sm text-muted">SIP Check is writing…</p> : null}
            {error ? (
              <p role="alert" className="text-sm text-error">
                {error}
              </p>
            ) : null}
          </div>
          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault()
              void send(draft)
            }}
          >
            <label className="sr-only" htmlFor="bot-draft">
              Message SIP Check
            </label>
            <input
              id="bot-draft"
              className="min-h-12 flex-1 border-2 border-line bg-paper px-3"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={2000}
            />
            <button type="submit" className="min-h-12 rounded-full bg-forest px-5 text-card" disabled={pending}>
              Send
            </button>
          </form>
          <fieldset className="mt-4">
            <legend className="text-sm text-muted">Was this explanation useful?</legend>
            <div className="mt-2 flex gap-3">
              {(['yes', 'no'] as const).map((answer) => (
                <button
                  key={answer}
                  type="button"
                  className="min-h-12 rounded-full border border-line px-4"
                  aria-pressed={helpful === answer}
                  onClick={() => {
                    setHelpful(answer)
                    trackAssessment({
                      name: 'bot_helpfulness_submitted',
                      sessionId,
                      sessionKind,
                      helpful: answer,
                    })
                  }}
                >
                  {answer === 'yes' ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </section>
  )
}
