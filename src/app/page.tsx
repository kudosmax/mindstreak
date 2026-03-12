'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { EnergyLevel } from '@/types'
import { useAppStore, todayKey } from '@/store/useAppStore'
import {
  selectCurrentStreak,
  selectTodayLog,
  getActiveHabits,
} from '@/store/selectors'
import EnergySelector from '@/components/today/EnergySelector'
import HabitCheckItem from '@/components/today/HabitCheckItem'
import StreakBadge from '@/components/today/StreakBadge'
import EnergyCircle from '@/components/shared/EnergyCircle'
import { getEnergySuggestion } from '@/lib/energySuggestion'
import BottomSheet from '@/components/shared/BottomSheet'
import HabitForm from '@/components/habits/HabitForm'

export default function TodayPage() {
  const store = useAppStore()
  const todayLog = selectTodayLog(store)
  const streak = selectCurrentStreak(store)
  const today = todayKey()
  const [showAddForm, setShowAddForm] = useState(false)

  const todayDate = format(new Date(), 'M월 d일 EEEE', { locale: ko })

  const handleEnergyChange = (level: EnergyLevel) => {
    store.setEnergyLevel(today, level)
  }

  const handleToggle = (habitId: string) => {
    store.toggleHabit(today, habitId)
  }

  const activeHabits = getActiveHabits(store.habits)
  const hasHabits = activeHabits.length > 0
  const completedIds = todayLog?.completedHabitIds ?? []
  const completedCount = activeHabits.filter((h) => completedIds.includes(h.id)).length
  const suggestion = todayLog
    ? getEnergySuggestion(todayLog.energyLevel, store.dailyLogs, store.habits)
    : null

  return (
    <div className="px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{todayDate}</p>
          <h1 className="text-2xl font-bold mt-0.5">오늘</h1>
        </div>
        <StreakBadge streak={streak} />
      </div>

      {/* No Habits State */}
      {!hasHabits && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-4">🌱</div>
          <p className="font-semibold text-base mb-1">아직 습관이 없어요</p>
          <p className="text-sm text-muted-foreground mb-6">
            습관을 추가하고 Day 1을 시작해 보세요
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
          >
            습관 추가하기
          </button>
        </div>
      )}

      {/* Energy Selector */}
      {hasHabits && (
        <EnergySelector
          selected={todayLog?.energyLevel ?? null}
          onChange={handleEnergyChange}
        />
      )}

      {/* Habit List */}
      {todayLog && (
        <>
          {/* Today circle summary */}
          {activeHabits.length > 0 && (
            <div className="flex items-center gap-4 bg-muted/40 rounded-2xl p-4">
              <EnergyCircle
                habits={activeHabits}
                completedIds={completedIds}
                energyLevel={todayLog.energyLevel}
                size={72}
              />
              <div>
                <p className="text-sm font-semibold">
                  {completedCount === activeHabits.length && completedCount > 0
                    ? '오늘 목표 완료! 🎉'
                    : `${completedCount} / ${activeHabits.length} 완료`}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {completedCount === 0
                    ? '하나씩 체크해 나가 보세요'
                    : completedCount === activeHabits.length
                    ? '오늘도 완료! 🔥'
                    : '잘 하고 있어요!'}
                </p>
              </div>
            </div>
          )}

          {/* Energy suggestion */}
          {suggestion && completedCount === 0 && (
            <p className="text-xs text-muted-foreground text-center px-2 -mt-2">
              💡 {suggestion}
            </p>
          )}

          {/* All habits */}
          <div className="divide-y divide-border">
            {activeHabits.map((habit) => (
              <HabitCheckItem
                key={habit.id}
                habit={habit}
                isCompleted={completedIds.includes(habit.id)}
                onToggle={handleToggle}
              />
            ))}
          </div>

          {/* 습관 추가 바로가기 */}
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            <span>+</span>
            <span>습관 추가</span>
          </button>
        </>
      )}

      {/* 습관 추가 BottomSheet */}
      <BottomSheet isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="새 습관">
        <HabitForm
          onSubmit={(data) => {
            store.addHabit(data)
            setShowAddForm(false)
          }}
          onCancel={() => setShowAddForm(false)}
        />
      </BottomSheet>
    </div>
  )
}
