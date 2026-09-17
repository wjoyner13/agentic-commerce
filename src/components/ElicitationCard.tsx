import { useState } from 'react'
import { PencilIcon } from './icons'

export type ElicitationOption = {
  id: string
  label: string
}

export type ElicitationSelection =
  | { type: 'option'; optionId: string }
  | { type: 'custom'; text: string }

export type ElicitationCardProps = {
  question: string
  options: ElicitationOption[]
  customOptionLabel?: string
  secondaryLabel?: string
  primaryLabel?: string
  onSecondary?: () => void
  onPrimary?: (selection: ElicitationSelection) => void
  className?: string
}

export function ElicitationCard({
  question,
  options,
  customOptionLabel = 'Something else',
  secondaryLabel = 'Back',
  primaryLabel = 'Continue',
  onSecondary,
  onPrimary,
  className = '',
}: ElicitationCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isCustom, setIsCustom] = useState(false)
  const [customText, setCustomText] = useState('')

  const canContinue = isCustom
    ? customText.trim().length > 0
    : selectedId !== null

  function selectOption(id: string) {
    setIsCustom(false)
    setSelectedId(id)
  }

  function selectCustom() {
    setSelectedId(null)
    setIsCustom(true)
  }

  function handlePrimary() {
    if (isCustom && customText.trim()) {
      onPrimary?.({ type: 'custom', text: customText.trim() })
    } else if (selectedId) {
      onPrimary?.({ type: 'option', optionId: selectedId })
    }
  }

  return (
    <div
      className={`w-full overflow-hidden rounded-[20px] border border-[#ebbf0b] bg-white ${className}`}
    >
      <div className="bg-[#191a19] px-[38px] py-[21px]">
        <p className="text-[16px] font-medium text-[#f6f7f8]">{question}</p>
      </div>

      <div className="flex flex-col gap-[17px] px-[24px] py-[24px] sm:px-[35px]">
        <div className="flex flex-col gap-[10px]">
          {options.map((option, index) => {
            const selected = selectedId === option.id
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => selectOption(option.id)}
                className="flex w-full items-center gap-[20px] rounded-lg p-1 text-left transition-colors hover:bg-[#f6f7f8]"
              >
                <span
                  className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[5px] border text-[15px] text-[#0b0a08] ${
                    selected
                      ? 'border-[#ebbf0b] bg-[#fdf3d0]'
                      : 'border-[#dddee4] bg-[#f6f7f8]'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-[15px] text-[#0b0a08]">
                  {option.label}
                </span>
              </button>
            )
          })}

          <button
            type="button"
            aria-pressed={isCustom}
            onClick={selectCustom}
            className="flex w-full items-center gap-[20px] rounded-lg p-1 text-left transition-colors hover:bg-[#f6f7f8]"
          >
            <span
              className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[5px] border ${
                isCustom
                  ? 'border-[#ebbf0b] bg-[#fdf3d0]'
                  : 'border-[#dddee4] bg-[#f6f7f8]'
              }`}
            >
              <PencilIcon className="h-[13px] w-[13px] text-[#0b0a08]" />
            </span>
            <span className="text-[15px] text-[#0b0a08]">
              {customOptionLabel}
            </span>
          </button>

          {isCustom && (
            <input
              autoFocus
              value={customText}
              onChange={(event) => setCustomText(event.target.value)}
              placeholder="Tell us more..."
              className="ml-[42px] rounded-lg border border-[#dddee4] px-3 py-2 text-[15px] text-[#0b0a08] outline-none focus:border-[#ebbf0b]"
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-[17px]">
          <button
            type="button"
            onClick={onSecondary}
            className="rounded-[12px] px-[16px] py-[8px] text-[16px] font-medium text-[#363644] transition-colors hover:bg-[#f6f7f8]"
          >
            {secondaryLabel}
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={handlePrimary}
            className="rounded-[18px] bg-[#fcda5d] px-[24px] py-[8px] text-[16px] font-medium text-[#363644] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
