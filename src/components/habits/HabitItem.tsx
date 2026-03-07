'use client'

import type { Habit } from '@/types'
import { ENERGY_COLORS } from '@/constants/colors'
import EnergyBadge from '@/components/shared/EnergyBadge'

interface HabitItemProps {
  habit: Habit
  onEdit: (habit: Habit) => void
  onArchive: (id: string) => void
}

export default function HabitItem({ habit, onEdit, onArchive }: HabitItemProps) {
  return (
    <div className="flex items-center gap-3 py-3 px-1">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: `${ENERGY_COLORS[habit.energyLevel]}22` }}
      >
        {habit.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{habit.name}</p>
        <EnergyBadge level={habit.energyLevel} />
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onEdit(habit)}
          className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          aria-label={`${habit.name} 수정`}
        >
          ✏️
        </button>
        <button
          onClick={() => onArchive(habit.id)}
          className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
          aria-label={`${habit.name} 삭제`}
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
