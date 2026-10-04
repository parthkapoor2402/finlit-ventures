import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { formatReply } from './format-reply.ts'
import { ReplyText } from './ReplyText.tsx'

const messy =
  'Hello. **Current Monthly SIP:** ₹50,000 **Proposed Monthly SIP:** ₹25,000. The difference is **₹1,50,000** and it is *not* a loss. 1. **Cash flow:** expenses may come first. 2. **Time:** six months is the period you entered.'

describe('bot reply formatting', () => {
  it('turns asterisks into bold paragraphs and a numbered list', () => {
    const blocks = formatReply(messy)
    const text = JSON.stringify(blocks)
    expect(text).not.toContain('**')
    expect(text).not.toMatch(/\*[^*]/)
    expect(blocks.filter((block) => block.kind === 'paragraph').length).toBeGreaterThan(1)
    const list = blocks.find((block) => block.kind === 'list')
    expect(list?.kind).toBe('list')
    if (list?.kind === 'list') expect(list.items).toHaveLength(2)
  })

  it('renders the rupee figure in bold and hides the asterisks', () => {
    render(<ReplyText text="The difference is **₹36,000** less in planned contributions.\n\nExisting units stay invested." />)
    const figure = screen.getByText('₹36,000')
    expect(figure.tagName).toBe('STRONG')
    expect(screen.getByText(/Existing units stay invested/)).toBeVisible()
    expect(document.body.textContent).not.toContain('**')
  })
})
