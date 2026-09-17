import type { ConversationMessage } from '../types'

export function ConversationLog({
  messages,
}: {
  messages: ConversationMessage[]
}) {
  if (messages.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2 text-[15px] ${
              message.role === 'user'
                ? 'bg-[#191a19] text-white'
                : 'bg-[#f6f7f8] text-[#0b0a08]'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  )
}
