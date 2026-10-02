import type { Connect, Plugin, PreviewServer, ViteDevServer } from 'vite'
import { loadEnv, type Connect as ConnectTypes } from 'vite'
import { handleChatRequest, resetRateLimit } from './sip-check-bot.ts'

type Middleware = Connect.NextHandleFunction

let apiKey: string | undefined
let model: string | undefined

function attach(middlewares: Connect.Server): void {
  middlewares.use(createMiddleware())
}

export function sipCheckApiPlugin(): Plugin {
  return {
    name: 'sip-check-api',
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, '')
      apiKey = env.XAI_API_KEY || process.env.XAI_API_KEY || undefined
      model = env.XAI_MODEL || process.env.XAI_MODEL || 'grok-4.7'
      if (apiKey === '') apiKey = undefined
    },
    configureServer(server: ViteDevServer) {
      attach(server.middlewares)
    },
    configurePreviewServer(server: PreviewServer) {
      attach(server.middlewares)
    },
  }
}

export function createMiddleware(): Middleware {
  return (req, res, next) => {
    const url = req.url?.split('?')[0]
    if (url !== '/api/sip-check') {
      next()
      return
    }
    if (req.method !== 'POST') {
      send(res, 405, { message: 'Use POST for SIP Check.' })
      return
    }
    readBody(req)
      .then(async (raw) => {
        let parsed: unknown
        try {
          parsed = JSON.parse(raw)
        } catch {
          send(res, 400, { message: 'Send the question as JSON.' })
          return
        }
        const ip = req.socket.remoteAddress ?? 'local'
        const result = await handleChatRequest(parsed, ip, { apiKey, model })
        send(res, result.status, result.body)
      })
      .catch(() => {
        send(res, 400, { message: 'SIP Check could not read that request.' })
      })
  }
}

function readBody(req: ConnectTypes.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > 32_000) {
        reject(new Error('too large'))
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function send(
  res: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: string) => void },
  status: number,
  body: { reply?: string; message?: string },
): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

export function __setApiKeyForTests(key: string | undefined): void {
  apiKey = key
  resetRateLimit()
}
