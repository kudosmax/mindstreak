'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { EnergyLevel } from '@/types'
import { useAppStore, todayKey } from '@/store/useAppStore'
import {
  selectCurrentStreak,
  selectTodayLog,
  getHabitsForEnergy,
  getHabitsAboveEnergy,
  getActiveHabits,
} from '@/store/selectors'
import EnergySelector from '@/components/today/EnergySelector'
import HabitCheckItem from '@/components/today/HabitCheckItem'
import StreakBadge from '@/components/today/StreakBadge'
import EnergyCircle from '@/components/shared/EnergyCircle'
import Link from 'next/link'

export default function TodayPage() {
  const store = useAppStore()
  const todayLog = selectTodayLog(store)
  const streak = selectCurrentStreak(store)
  const today = todayKey()
  const [showAbove, setShowAbove] = useState(false)

  const todayDate = format(new Date(), 'M월 d일 EEEE', { locale: ko })

  const handleEnergyChange = (level: EnergyLevel) => {
    store.setEnergyLevel(today, level)
  }

  const handleToggle = (habitId: string) => {
    store.toggleHabit(today, habitId)
  }

  const hasHabits = getActiveHabits(store.habits).length > 0
  const eligibleHabits = todayLog ? getHabitsForEnergy(store.habits, todayLog.energyLevel) : []
  const aboveHabits = todayLog ? getHabitsAboveEnergy(store.habits, todayLog.energyLevel) : []
  const completedIds = todayLog?.completedHabitIds ?? []
  const completedCount = eligibleHabits.filter((h) => completedIds.includes(h.id)).length

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
            습관을 추가하고 streak를 시작해 보세요
          </p>
          <Link
            href="/habits"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
          >
            습관 추가하러 가기
          </Link>
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
          {eligibleHabits.length > 0 && (
            <div className="flex items-center gap-4 bg-muted/40 rounded-2xl p-4">
              <EnergyCircle
                habits={eligibleHabits}
                completedIds={completedIds}
                energyLevel={todayLog.energyLevel}
                size={72}
              />
              <div>
                <p className="text-sm font-semibold">
                  {completedCount === eligibleHabits.length
                    ? '오늘 목표 완료! 🎉'
                    : `${completedCount} / ${eligibleHabits.length} 완료`}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {completedCount === 0
                    ? '하나씩 체크해 나가 보세요'
                    : completedCount === eligibleHabits.length
                    ? 'streak 유지 중 🔥'
                    : '잘 하고 있어요!'}
                </p>
              </div>
            </div>
          )}

          {/* Eligible habits */}
          {eligibleHabits.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              선택한 에너지 레벨에 해당하는 습관이 없어요
            </div>
          ) : (
            <div className="divide-y divide-border">
              {eligibleHabits.map((habit) => (
                <HabitCheckItem
                  key={habit.id}
                  habit={habit}
                  isCompleted={completedIds.includes(habit.id)}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}

          {/* Above energy habits (optional) */}
          {aboveHabits.length > 0 && (
            <div>
              <button
                onClick={() => setShowAbove((v) => !v)}
                className="w-full text-sm text-muted-foreground flex items-center gap-1 py-1"
              >
                <span>{showAbove ? '▾' : '▸'}</span>
                <span>더 할 수 있다면? ({aboveHabits.length}개)</span>
              </button>
              {showAbove && (
                <div className="divide-y divide-border mt-1 opacity-70">
                  {aboveHabits.map((habit) => (
                    <HabitCheckItem
                      key={habit.id}
                      habit={habit}
                      isCompleted={completedIds.includes(habit.id)}
                      onToggle={handleToggle}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
