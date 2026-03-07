'use client'

import type { Habit } from '@/types'
import { ENERGY_COLORS } from '@/constants/colors'
import EnergyBadge from '@/components/shared/EnergyBadge'

interface HabitCheckItemProps {
  habit: Habit
  isCompleted: boolean
  onToggle: (id: string) => void
}

export default function HabitCheckItem({ habit, isCompleted, onToggle }: HabitCheckItemProps) {
  const color = ENERGY_COLORS[habit.energyLevel]

  return (
    <button
      onClick={() => onToggle(habit.id)}
      className="w-full flex items-center gap-3 py-3 px-1 text-left group"
      aria-pressed={isCompleted}
      aria-label={`${habit.name} ${isCompleted ? '완료됨' : '미완료'}`}
    >
      {/* Checkbox */}
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
        style={{
          backgroundColor: isCompleted ? color : 'transparent',
          border: `2px solid ${color}`,
          transform: isCompleted ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {isCompleted && (
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path
              d="M1 4L4.5 7.5L11 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Emoji */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-opacity"
        style={{
          backgroundColor: `${color}22`,
          opacity: isCompleted ? 1 : 0.7,
        }}
      >
        {habit.emoji}
      </div>

      {/* Name + Badge */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium transition-all"
          style={{
            textDecoration: isCompleted ? 'line-through' : 'none',
            opacity: isCompleted ? 0.6 : 1,
          }}
        >
          {habit.name}
        </p>
      </div>

      <EnergyBadge level={habit.energyLevel} />
    </button>
  )
}
