import { useState } from 'react'
import { ElicitationCard, type ElicitationSelection } from './components/ElicitationCard'
import { ArrowUpIcon, MicIcon, PaperclipIcon } from './components/icons'

function App() {
  const [message, setMessage] = useState('')

  function handleSelection(selection: ElicitationSelection) {
    if (selection.type === 'option') {
      console.log('Selected option:', selection.optionId)
    } else {
      console.log('Custom answer:', selection.text)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-[#eceef1] px-4 py-16">
      <h1 className="mb-10 text-center text-4xl font-semibold text-[#0b0a08] sm:text-5xl">
        Let&rsquo;s simplify your procurement process
      </h1>

      <div className="flex w-full max-w-[841px] flex-col gap-4">
        <ElicitationCard
          question="Where do you want to start?"
          options={[
            { id: 'define-purchasing', label: 'Define what my agents can buy' },
            { id: 'set-budget', label: 'Set a budget for my agents' },
          ]}
          onSecondary={() => console.log('Back clicked')}
          onPrimary={handleSelection}
        />

        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex items-center gap-3 rounded-full border border-[#e5e4e7] bg-white px-5 py-3 shadow-sm"
        >
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ask anything"
            className="flex-1 text-[15px] text-[#0b0a08] outline-none placeholder:text-[#8b8b93]"
          />
          <button
            type="button"
            aria-label="Attach a file"
            className="text-[#0b0a08] transition-opacity hover:opacity-70"
          >
            <PaperclipIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Use voice input"
            className="text-[#0b0a08] transition-opacity hover:opacity-70"
          >
            <MicIcon className="h-5 w-5" />
          </button>
          <button
            type="submit"
            aria-label="Send message"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f0f2] text-[#0b0a08] transition-colors hover:bg-[#e5e4e7]"
          >
            <ArrowUpIcon className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
