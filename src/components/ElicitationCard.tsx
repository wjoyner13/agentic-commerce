import { useState } from 'react'
import { ArrowUpIcon, PencilIcon } from './icons'
import type { ElicitationOption, ElicitationSelection } from '../types'

export type ElicitationCardProps = {
  question: string
  options: ElicitationOption[]
  onSelect: (selection: ElicitationSelection) => void
  className?: string
}

export function ElicitationCard({
  question,
  options,
  onSelect,
  className = '',
}: ElicitationCardProps) {
  const [activeTextOptionId, setActiveTextOptionId] = useState<string | null>(
    null,
  )
  const [textValue, setTextValue] = useState('')

  function handleOptionClick(option: ElicitationOption) {
    if (option.requiresText) {
      setActiveTextOptionId((current) =>
        current === option.id ? null : option.id,
      )
      setTextValue('')
      return
    }
    onSelect({ type: 'option', option })
  }

  function submitText(option: ElicitationOption) {
    const text = textValue.trim()
    if (!text) return
    onSelect({ type: 'text', option, text })
    setActiveTextOptionId(null)
    setTextValue('')
  }

  return (
    <div
      className={`w-full overflow-hidden rounded-[20px] border border-[#ebbf0b] bg-white ${className}`}
    >
      <div className="bg-[#191a19] px-[38px] py-[21px]">
        <p className="text-[16px] font-medium text-[#f6f7f8]">{question}</p>
      </div>

      <div className="flex flex-col gap-[10px] px-[24px] py-[24px] sm:px-[35px]">
        {options.map((option, index) => {
          const badge = option.badge ?? index + 1
          const isActive = activeTextOptionId === option.id
          return (
            <div key={option.id} className="flex flex-col gap-2">
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => handleOptionClick(option)}
                className="flex w-full items-center gap-[20px] rounded-lg p-1 text-left transition-colors hover:bg-[#f6f7f8]"
              >
                <span
                  className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[5px] border text-[15px] text-[#0b0a08] ${
                    isActive
                      ? 'border-[#ebbf0b] bg-[#fdf3d0]'
                      : 'border-[#dddee4] bg-[#f6f7f8]'
                  }`}
                >
                  {badge === 'edit' ? (
                    <PencilIcon className="h-[13px] w-[13px]" />
                  ) : (
                    badge
                  )}
                </span>
                <span className="text-[15px] text-[#0b0a08]">
                  {option.label}
                </span>
              </button>

              {isActive && (
                <div className="ml-[42px] flex items-center gap-2 rounded-lg border border-[#dddee4] pr-1 focus-within:border-[#ebbf0b]">
                  <input
                    autoFocus
                    value={textValue}
                    onChange={(event) => setTextValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') submitText(option)
                    }}
                    placeholder={option.textPlaceholder ?? 'Tell us more…'}
                    className="flex-1 rounded-lg px-3 py-2 text-[15px] text-[#0b0a08] outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Submit"
                    onClick={() => submitText(option)}
                    disabled={!textValue.trim()}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#191a19] text-white transition-opacity disabled:opacity-30"
                  >
                    <ArrowUpIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
