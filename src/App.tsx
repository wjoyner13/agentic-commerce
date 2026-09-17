import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from 'react'
import { ConversationLog } from './components/ConversationLog'
import { ElicitationCard } from './components/ElicitationCard'
import { ArrowUpIcon, MicIcon, PaperclipIcon } from './components/icons'
import { ProcessingIndicator } from './components/ProcessingIndicator'
import { ProductCarousel } from './components/ProductCarousel'
import { TipBanner } from './components/TipBanner'
import { MOCK_ITEMS } from './mockData'
import type { ConversationMessage, ElicitationOption, ElicitationSelection, ProductItem } from './types'

type Step = 'scope' | 'source' | 'processing' | 'done'
type UploadKind = 'list' | 'photos'

const SCOPE_QUESTION = 'Where do you want to start?'
const SOURCE_QUESTION = 'How do you want to share what they can purchase?'
const MANUAL_TIP =
  'You can also describe the types of products you want, and I can bring back relevant matches from catalogs that I have access to for you to select from.'

const SCOPE_OPTIONS: ElicitationOption[] = [
  { id: 'define-purchasing', label: 'Define what my agents can buy' },
  { id: 'set-budget', label: 'Set a budget for my agents' },
  {
    id: 'scope-something-else',
    label: 'Something else',
    badge: 'edit',
    requiresText: true,
  },
]

const SOURCE_OPTIONS: ElicitationOption[] = [
  { id: 'manual', label: 'Manually enter' },
  {
    id: 'upload-list',
    label: 'Upload a list with brand names and product descriptions',
  },
  { id: 'photos', label: 'Drop pictures into the chat' },
  {
    id: 'mix',
    label: 'A mix or something else',
    requiresText: true,
    textPlaceholder: 'Describe what you have in mind…',
  },
]

function classifySourceIntent(text: string): 'upload-list' | 'photos' | 'manual' {
  const lower = text.toLowerCase()
  if (/(upload|spreadsheet|csv|file|list)/.test(lower)) return 'upload-list'
  if (/(picture|photo|image)/.test(lower)) return 'photos'
  return 'manual'
}

function App() {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [step, setStep] = useState<Step>('scope')
  const [showManualTip, setShowManualTip] = useState(false)
  const [message, setMessage] = useState('')
  const [showCarousel, setShowCarousel] = useState(false)
  const [carouselItems, setCarouselItems] = useState<ProductItem[]>([])
  const [pendingUploadKind, setPendingUploadKind] = useState<UploadKind | null>(
    null,
  )
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function appendMessage(role: ConversationMessage['role'], content: string) {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${prev.length}`, role, content },
    ])
  }

  function startProcessing() {
    setShowManualTip(false)
    setStep('processing')
    setShowCarousel(true)
    setCarouselItems([])

    window.setTimeout(() => {
      MOCK_ITEMS.forEach((item, index) => {
        window.setTimeout(() => {
          setCarouselItems((prev) => [...prev, item])
          if (index === MOCK_ITEMS.length - 1) {
            appendMessage(
              'assistant',
              `I found ${MOCK_ITEMS.length} items. Swipe through the cards on the right to review them.`,
            )
            setStep('done')
          }
        }, index * 320)
      })
    }, 1300)
  }

  function finishSourceStep(answer: string) {
    appendMessage('assistant', SOURCE_QUESTION)
    appendMessage('user', answer)
    appendMessage(
      'assistant',
      "Got it — I'll use that to help build your catalog.",
    )
    setShowManualTip(false)
    setStep('done')
  }

  function handleScopeSelect(selection: ElicitationSelection) {
    const answer =
      selection.type === 'text' ? selection.text : selection.option.label
    appendMessage('assistant', SCOPE_QUESTION)
    appendMessage('user', answer)

    if (selection.option.id === 'define-purchasing') {
      setStep('source')
    } else {
      appendMessage('assistant', "Got it — we'll pick this back up soon.")
      setStep('done')
    }
  }

  function handleSourceSelect(selection: ElicitationSelection) {
    const id = selection.option.id
    if (id === 'manual') {
      setShowManualTip(true)
      return
    }
    if (id === 'upload-list') {
      triggerFilePicker('list')
      return
    }
    if (id === 'photos') {
      triggerFilePicker('photos')
      return
    }
    if (selection.type === 'text') {
      finishSourceStep(selection.text)
    }
  }

  function triggerFilePicker(kind: UploadKind) {
    setPendingUploadKind(kind)
    const input = fileInputRef.current
    if (!input) return
    input.accept =
      kind === 'photos' ? 'image/*' : '.csv,.xlsx,.xls,.pdf,.doc,.docx,text/csv'
    input.click()
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    const kind = pendingUploadKind
    setPendingUploadKind(null)
    if (!files || files.length === 0 || !kind) {
      event.target.value = ''
      return
    }

    const label =
      kind === 'list'
        ? `Uploaded ${files.length === 1 ? files[0].name : `${files.length} files`}`
        : `Uploaded ${files.length} photo${files.length > 1 ? 's' : ''}`
    event.target.value = ''

    appendMessage('assistant', SOURCE_QUESTION)
    appendMessage('user', label)
    startProcessing()
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (step !== 'source') return
    const images = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/'),
    )
    if (images.length === 0) return

    appendMessage('assistant', SOURCE_QUESTION)
    appendMessage(
      'user',
      `Dropped ${images.length} photo${images.length > 1 ? 's' : ''} into the chat`,
    )
    startProcessing()
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (step === 'source') event.preventDefault()
  }

  function handleChatSubmit(event: FormEvent) {
    event.preventDefault()
    const text = message.trim()
    if (!text) return
    setMessage('')

    if (step !== 'source') return

    const intent = classifySourceIntent(text)
    if (intent === 'upload-list') {
      triggerFilePicker('list')
      return
    }
    if (intent === 'photos') {
      triggerFilePicker('photos')
      return
    }
    finishSourceStep(text)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-[#eceef1]">
      <div
        className="flex flex-1 flex-col items-center px-4 py-16"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h1 className="mb-10 text-center text-4xl font-semibold text-[#0b0a08] sm:text-5xl">
          Let&rsquo;s simplify your procurement process
        </h1>

        <div className="flex w-full max-w-[841px] flex-col gap-4">
          <ConversationLog messages={messages} />

          {step === 'scope' && (
            <ElicitationCard
              question={SCOPE_QUESTION}
              options={SCOPE_OPTIONS}
              onSelect={handleScopeSelect}
            />
          )}

          {step === 'source' && (
            <>
              {showManualTip && <TipBanner text={MANUAL_TIP} />}
              <ElicitationCard
                question={SOURCE_QUESTION}
                options={SOURCE_OPTIONS}
                onSelect={handleSourceSelect}
              />
            </>
          )}

          {step === 'processing' && <ProcessingIndicator />}

          <form
            onSubmit={handleChatSubmit}
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
              onClick={() => triggerFilePicker('list')}
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

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={
            pendingUploadKind === 'photos'
              ? 'image/*'
              : '.csv,.xlsx,.xls,.pdf,.doc,.docx,text/csv'
          }
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {showCarousel && (
        <ProductCarousel
          items={carouselItems}
          onClose={() => setShowCarousel(false)}
        />
      )}
    </div>
  )
}

export default App
