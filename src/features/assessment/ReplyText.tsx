import { formatReply, type ReplyPart } from './format-reply.ts'

export function ReplyText({ text }: { text: string }) {
  const blocks = formatReply(text)
  if (blocks.length === 0) return null
  return (
    <div className="space-y-3">
      {blocks.map((block, index) =>
        block.kind === 'paragraph' ? (
          <p key={index} className="leading-relaxed">
            <Parts parts={block.parts} />
          </p>
        ) : (
          <ol key={index} className="list-decimal space-y-2 pl-5 leading-relaxed">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <Parts parts={item} />
              </li>
            ))}
          </ol>
        ),
      )}
    </div>
  )
}

function Parts({ parts }: { parts: ReplyPart[] }) {
  return parts.map((part, index) =>
    part.kind === 'bold' ? (
      <strong key={index} className="font-semibold">
        {part.text}
      </strong>
    ) : (
      <span key={index}>{part.text}</span>
    ),
  )
}
