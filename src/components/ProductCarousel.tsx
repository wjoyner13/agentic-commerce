import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import type { ProductItem } from '../types'

type ProductCarouselProps = {
  items: ProductItem[]
  onClose: () => void
}

const VISIBLE_STACK = 3
const SWIPE_THRESHOLD = 90

export function ProductCarousel({ items, onClose }: ProductCarouselProps) {
  const [order, setOrder] = useState<string[]>([])
  const [seenItemCount, setSeenItemCount] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)

  if (items.length !== seenItemCount) {
    if (items.length < seenItemCount) {
      // Item list was reset (e.g. a new upload started) rather than appended to.
      setOrder(items.map((item) => item.id))
    } else {
      const existingIds = new Set(order)
      const additions = items
        .map((item) => item.id)
        .filter((id) => !existingIds.has(id))
      setOrder([...order, ...additions])
    }
    setSeenItemCount(items.length)
  }

  const itemsById = new Map(items.map((item) => [item.id, item]))
  const stack = order.slice(0, VISIBLE_STACK)

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    setIsDragging(true)
    dragStartX.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDragging) return
    setDragX(event.clientX - dragStartX.current)
  }

  function endDrag() {
    if (!isDragging) return
    setIsDragging(false)
    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      setOrder((prev) => (prev.length > 1 ? [...prev.slice(1), prev[0]] : prev))
    }
    setDragX(0)
  }

  return (
    <aside className="flex h-screen w-[340px] shrink-0 flex-col gap-4 border-l border-[#e5e4e7] bg-[#f9f9fb] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-[#0b0a08]">
          Identified items
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-[#8b8b93] transition-colors hover:text-[#0b0a08]"
        >
          ✕
        </button>
      </div>

      <div className="relative h-[380px]">
        {stack.length === 0 && (
          <p className="text-[14px] text-[#8b8b93]">
            Items will appear here as they're identified.
          </p>
        )}
        {[...stack].reverse().map((id, reverseIndex) => {
          const position = stack.length - 1 - reverseIndex
          const item = itemsById.get(id)
          if (!item) return null
          const isTop = position === 0
          const translateY = position * 10
          const scale = 1 - position * 0.05
          const style: CSSProperties = isTop
            ? {
                transform: `translateX(${dragX}px) translateY(${translateY}px) rotate(${dragX / 20}deg)`,
                transition: isDragging ? 'none' : 'transform 0.25s ease',
                zIndex: 10,
              }
            : {
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity: 1 - position * 0.2,
                zIndex: 10 - position,
              }
          return (
            <div
              key={id}
              onPointerDown={isTop ? handlePointerDown : undefined}
              onPointerMove={isTop ? handlePointerMove : undefined}
              onPointerUp={isTop ? endDrag : undefined}
              onPointerCancel={isTop ? endDrag : undefined}
              className="absolute inset-x-0 top-0 flex h-[280px] cursor-grab touch-none select-none flex-col justify-between rounded-2xl border border-[#e5e4e7] bg-white p-5 shadow-md active:cursor-grabbing"
              style={style}
            >
              <div>
                <p className="text-[13px] font-medium uppercase tracking-wide text-[#8b8b93]">
                  {item.brand}
                </p>
                <p className="mt-1 text-[17px] font-semibold text-[#0b0a08]">
                  {item.name}
                </p>
              </div>
              <p className="text-[14px] text-[#4b4b55]">{item.description}</p>
            </div>
          )
        })}
      </div>

      <p className="text-center text-[13px] text-[#8b8b93]">
        Swipe to review each item
      </p>
    </aside>
  )
}
