'use client'

import { useState } from 'react'
import { format, getMonth, getYear, isFuture, isToday } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { EnergyLevel } from '@/types'
import { useAppStore } from '@/store/useAppStore'
import { getActiveHabits } from '@/store/selectors'
import { ENERGY_COLORS } from '@/constants/colors'
import CalendarGrid from '@/components/calendar/CalendarGrid'
import MonthStats from '@/components/calendar/MonthStats'
import EnergySelector from '@/components/today/EnergySelector'
import BottomSheet from '@/components/shared/BottomSheet'

export default function CalendarPage() {
  const store = useAppStore()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMonth, setViewMonth] = useState(new Date())

  const selectedKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null
  const selectedLog = selectedKey ? store.dailyLogs[selectedKey] : null
  const activeHabits = getActiveHabits(store.habits)

  const canEdit = !!selectedDate && (!isFuture(selectedDate) || isToday(selectedDate))

  const handleToggle = (habitId: string) => {
    if (!selectedKey || !canEdit || !selectedLog) return
    store.toggleHabit(selectedKey, habitId)
  }

  const handleEnergySelect = (level: EnergyLevel) => {
    if (!selectedKey || !canEdit) return
    store.setEnergyLevel(selectedKey, level)
  }

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
        isOpen={!!selectedDate && canEdit}
        onClose={() => setSelectedDate(null)}
        title={selectedDate ? format(selectedDate, 'M월 d일 EEEE', { locale: ko }) : ''}
      >
        {/* 에너지 미선택 → 선택하게 */}
        {!selectedLog && (
          <div className="space-y-3 pt-2">
            <EnergySelector
              selected={null}
              onChange={handleEnergySelect}
            />
          </div>
        )}

        {/* 에너지 선택됨 → 습관 체크 가능 */}
        {selectedLog && (
          <div className="space-y-4 pt-2">
            <EnergySelector
              selected={selectedLog.energyLevel}
              onChange={handleEnergySelect}
            />

            <div className="divide-y divide-border">
              {activeHabits.map((habit) => {
                const done = selectedLog.completedHabitIds.includes(habit.id)
                const color = ENERGY_COLORS[habit.energyLevel]
                return (
                  <button
                    key={habit.id}
                    onClick={() => handleToggle(habit.id)}
                    className="w-full flex items-center gap-3 py-2.5 text-left"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{ backgroundColor: `${color}22` }}
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
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
