'use client'

import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  subMonths,
  addMonths,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Habit, DailyLog } from '@/types'
import CalendarDay from './CalendarDay'

const DOW = ['일', '월', '화', '수', '목', '금', '토']

interface CalendarGridProps {
  dailyLogs: Record<string, DailyLog>
  habits: Habit[]
  onDaySelect: (date: Date) => void
  selectedDate: Date | null
}

export default function CalendarGrid({
  dailyLogs,
  habits,
  onDaySelect,
  selectedDate,
}: CalendarGridProps) {
  const [viewDate, setViewDate] = useState(new Date())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDow = getDay(monthStart) // 0=Sun

  return (
    <div>
      {/* Month Nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewDate((d) => subMonths(d, 1))}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          aria-label="이전 달"
        >
          ‹
        </button>
        <h2 className="text-base font-bold">
          {format(viewDate, 'yyyy년 M월', { locale: ko })}
        </h2>
        <button
          onClick={() => setViewDate((d) => addMonths(d, 1))}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      {/* DOW header */}
      <div className="grid grid-cols-7 mb-1">
        {DOW.map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* Empty leading cells */}
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((date) => {
          const key = format(date, 'yyyy-MM-dd')
          return (
            <CalendarDay
              key={key}
              date={date}
              log={dailyLogs[key]}
              habits={habits}
              isSelected={selectedDate ? format(selectedDate, 'yyyy-MM-dd') === key : false}
              onClick={onDaySelect}
            />
          )
        })}
      </div>

      {/* Pass viewDate info upward if needed */}
      <input type="hidden" value={`${year}-${month}`} />
    </div>
  )
}
