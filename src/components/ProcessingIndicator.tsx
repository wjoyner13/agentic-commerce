import { useEffect, useState } from 'react'

const STEPS = [
  'Reading what you shared…',
  'Extracting brand names…',
  'Matching product descriptions…',
  'Organizing results…',
]

export function ProcessingIndicator() {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % STEPS.length)
    }, 450)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-[#e5e4e7] bg-white px-6 py-4">
      <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#dddee4] border-t-[#0b0a08]" />
      <p className="text-[15px] text-[#0b0a08]">{STEPS[stepIndex]}</p>
    </div>
  )
}
