'use client'

import { useState, useRef } from 'react'
import type { Habit, EnergyLevel } from '@/types'
import { DEFAULT_EMOJIS, ENERGY_LABELS } from '@/constants/colors'

interface HabitFormProps {
  initial?: Partial<Habit>
  onSubmit: (data: Omit<Habit, 'id' | 'createdAt' | 'order'>) => void
  onCancel: () => void
}

const ENERGY_LEVELS: EnergyLevel[] = ['low', 'medium', 'high']

export default function HabitForm({ initial, onSubmit, onCancel }: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [emoji, setEmoji] = useState(initial?.emoji ?? '✨')
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(initial?.energyLevel ?? 'medium')
  const emojiInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), emoji, color: '', energyLevel })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-2">
      {/* Emoji + Name */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">습관 이름</label>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="text-2xl w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0"
            aria-label="이모지 선택됨"
          >
            {emoji}
          </button>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 개발 공부"
            maxLength={20}
            className="flex-1 h-12 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Emoji Picker */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">이모지</label>
        <div className="relative mb-2">
          <input
            ref={emojiInputRef}
            type="text"
            value=""
            onChange={(e) => {
              const value = e.target.value
              if (!value) return
              const segments = [...new Intl.Segmenter().segment(value)]
              const last = segments[segments.length - 1]?.segment ?? ''
              if (last) setEmoji(last)
              e.target.value = ''
              e.target.blur()
            }}
            className="w-full h-12 rounded-xl border border-border bg-background px-3 text-sm text-center caret-transparent"
            placeholder="탭하여 이모지 직접 입력"
          />
        </div>
        <div className="grid grid-cols-10 gap-1">
          {DEFAULT_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`text-xl w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                emoji === e ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-muted'
              }`}
              aria-label={e}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Energy Level */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">에너지 레벨</label>
        <div className="flex gap-2">
          {ENERGY_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setEnergyLevel(level)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                energyLevel === level
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {ENERGY_LABELS[level]}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 transition-opacity"
        >
          {initial?.id ? '수정' : '추가'}
        </button>
      </div>
    </form>
  )
}
