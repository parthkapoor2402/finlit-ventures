import { handleChatRequest } from '../src/server/sip-check-bot.ts'

type HeaderValue = string | string[] | undefined

type RequestLike = {
  method?: string
  body?: unknown
  headers: Record<string, HeaderValue>
}

type ResponseLike = {
  status: (code: number) => ResponseLike
  json: (body: unknown) => void
}

export default async function handler(req: RequestLike, res: ResponseLike): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Use POST for SIP Check.' })
    return
  }
  const forwarded = req.headers['x-forwarded-for']
  const headerIp = Array.isArray(forwarded) ? forwarded[0] : forwarded
  const ip = headerIp?.split(',')[0]?.trim() || 'vercel'
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body) as unknown
    } catch {
      res.status(400).json({ message: 'Send the question as JSON.' })
      return
    }
  }
  const apiKey = firstSet(process.env.GROQ_API_KEY, process.env.XAI_API_KEY)
  const model = firstSet(process.env.GROQ_MODEL, process.env.XAI_MODEL)
  const result = await handleChatRequest(body, ip, { apiKey, model })
  res.status(result.status).json(result.body)
}

function firstSet(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value.trim()
  }
  return undefined
}
