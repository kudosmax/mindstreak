'use client'

import { useEffect, useRef } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md bg-background rounded-t-2xl shadow-xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="w-10 h-1 bg-muted rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          {title && <h2 className="text-base font-semibold mt-2">{title}</h2>}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 mt-2"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
        <div className="px-5 pb-8">{children}</div>
      </div>
    </div>
  )
}
