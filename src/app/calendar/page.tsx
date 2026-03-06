'use client'

import { useState } from 'react'
import { format, getMonth, getYear } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useAppStore } from '@/store/useAppStore'
import { getHabitsForEnergy, getActiveHabits } from '@/store/selectors'
import CalendarGrid from '@/components/calendar/CalendarGrid'
import MonthStats from '@/components/calendar/MonthStats'
import EnergyBadge from '@/components/shared/EnergyBadge'
import EnergyCircle from '@/components/shared/EnergyCircle'
import BottomSheet from '@/components/shared/BottomSheet'

export default function CalendarPage() {
  const store = useAppStore()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMonth, setViewMonth] = useState(new Date())

  const selectedKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null
  const selectedLog = selectedKey ? store.dailyLogs[selectedKey] : null

  const eligibleHabits = selectedLog
    ? getHabitsForEnergy(store.habits, selectedLog.energyLevel)
    : []
  const allActive = getActiveHabits(store.habits)

  return (
    <div className="px-4 pt-6 space-y-6">
      <h1 className="text-2xl font-bold">캘린더</h1>

      <CalendarGrid
        dailyLogs={store.dailyLogs}
        habits={store.habits}
        onDaySelect={(date) => {
          setSelectedDate(date)
          setViewMonth(date)
        }}
        selectedDate={selectedDate}
      />

      {/* Month Stats */}
      <div className="rounded-2xl bg-muted/40 p-4">
        <MonthStats
          data={store}
          year={getYear(viewMonth)}
          month={getMonth(viewMonth)}
        />
      </div>

      {/* Day Detail Bottom Sheet */}
      <BottomSheet
        isOpen={!!selectedDate && !!selectedLog}
        onClose={() => setSelectedDate(null)}
        title={selectedDate ? format(selectedDate, 'M월 d일 EEEE', { locale: ko }) : ''}
      >
        {selectedLog && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <EnergyCircle
                habits={eligibleHabits.length > 0 ? eligibleHabits : allActive}
                completedIds={selectedLog.completedHabitIds}
                energyLevel={selectedLog.energyLevel}
                size={60}
              />
              <div>
                <p className="text-sm font-medium">에너지</p>
                <EnergyBadge level={selectedLog.energyLevel} size="md" />
              </div>
            </div>

            <div className="divide-y divide-border">
              {(eligibleHabits.length > 0 ? eligibleHabits : allActive).map((habit) => {
                const done = selectedLog.completedHabitIds.includes(habit.id)
                return (
                  <div key={habit.id} className="flex items-center gap-3 py-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{ backgroundColor: `${habit.color}22` }}
                    >
                      {habit.emoji}
                    </div>
                    <span
                      className="flex-1 text-sm"
                      style={{
                        textDecoration: done ? 'line-through' : 'none',
                        opacity: done ? 0.5 : 1,
                      }}
                    >
                      {habit.name}
                    </span>
                    <span className="text-base">{done ? '✅' : '○'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
