export type ReplyPart = { kind: 'text' | 'bold'; text: string }

export type ReplyBlock =
  | { kind: 'paragraph'; parts: ReplyPart[] }
  | { kind: 'list'; items: ReplyPart[][] }

/** Turn model markdown into paragraphs, a numbered list, and bold spans. Asterisks are not left visible. */
export function formatReply(source: string): ReplyBlock[] {
  const prepared = prepareReply(source)
  if (!prepared) return []
  const blocks: ReplyBlock[] = []
  for (const chunk of prepared.split(/\n{2,}/)) {
    blocks.push(...blocksFromChunk(chunk))
  }
  return blocks
}

export function prepareReply(source: string): string {
  return source
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/(\S)\s+(\*\*[A-Z][^*\n]{0,60}:\*\*)/g, '$1\n\n$2')
    .replace(/(\S)\s+(\d{1,2})\.\s+/g, '$1\n$2. ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function blocksFromChunk(chunk: string): ReplyBlock[] {
  const lines = chunk.split('\n').map((line) => line.trim()).filter(Boolean)
  const blocks: ReplyBlock[] = []
  let prose: string[] = []
  let items: string[] = []

  function flushProse(): void {
    if (prose.length === 0) return
    blocks.push({ kind: 'paragraph', parts: inline(prose.join(' ')) })
    prose = []
  }

  function flushItems(): void {
    if (items.length === 0) return
    blocks.push({
      kind: 'list',
      items: items.map((item) => inline(item.replace(/^\d{1,2}\.\s+/, ''))),
    })
    items = []
  }

  for (const line of lines) {
    if (/^\d{1,2}\.\s+/.test(line)) {
      flushProse()
      items.push(line)
    } else {
      flushItems()
      prose.push(line)
    }
  }
  flushProse()
  flushItems()
  return blocks
}

function inline(text: string): ReplyPart[] {
  const parts: ReplyPart[] = []
  const pattern = /\*\*([^*\n]+?)\*\*|\*([^*\n]+?)\*/g
  let last = 0
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > last) parts.push({ kind: 'text', text: text.slice(last, index) })
    parts.push({ kind: 'bold', text: (match[1] ?? match[2] ?? '').trim() })
    last = index + match[0].length
  }
  if (last < text.length) parts.push({ kind: 'text', text: text.slice(last) })
  return parts.filter((part) => part.text.length > 0)
}
