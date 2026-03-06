'use client'

import type { DailyLog, Habit } from '@/types'
import { getHabitsForEnergy } from '@/store/selectors'
import EnergyCircle from '@/components/shared/EnergyCircle'
import { format, isToday, isFuture } from 'date-fns'

interface CalendarDayProps {
  date: Date
  log?: DailyLog
  habits: Habit[]
  isSelected: boolean
  onClick: (date: Date) => void
}

export default function CalendarDay({ date, log, habits, isSelected, onClick }: CalendarDayProps) {
  const dayNum = format(date, 'd')
  const future = isFuture(date) && !isToday(date)

  const eligibleHabits = log ? getHabitsForEnergy(habits, log.energyLevel) : []
  const allHabits = habits.filter((h) => !h.archivedAt)

  return (
    <button
      onClick={() => !future && onClick(date)}
      disabled={future}
      className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition-colors ${
        isSelected ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted/60'
      } ${future ? 'opacity-30 cursor-default' : ''}`}
      aria-label={`${format(date, 'yyyy년 M월 d일')}`}
    >
      <span
        className={`text-xs font-medium leading-none ${
          isToday(date)
            ? 'bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center'
            : 'text-foreground'
        }`}
      >
        {dayNum}
      </span>
      <div className="w-7 h-7 flex items-center justify-center">
        {log ? (
          <EnergyCircle
            habits={eligibleHabits.length > 0 ? eligibleHabits : allHabits}
            completedIds={log.completedHabitIds}
            energyLevel={log.energyLevel}
            size={28}
          />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-muted" />
        )}
      </div>
    </button>
  )
}
