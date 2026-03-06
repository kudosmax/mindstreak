import type { AppData, EnergyLevel, Habit } from '@/types'
import { ENERGY_ORDER } from '@/constants/colors'
import { getCurrentStreak } from '@/lib/streakCalculator'
import { format } from 'date-fns'

export function getActiveHabits(habits: Habit[]): Habit[] {
  return habits
    .filter((h) => !h.archivedAt)
    .sort((a, b) => a.order - b.order)
}

export function getHabitsForEnergy(habits: Habit[], energyLevel: EnergyLevel): Habit[] {
  const eligible = ENERGY_ORDER[energyLevel]
  return getActiveHabits(habits).filter((h) => eligible.includes(h.energyLevel))
}

export function getHabitsAboveEnergy(habits: Habit[], energyLevel: EnergyLevel): Habit[] {
  const eligible = ENERGY_ORDER[energyLevel]
  return getActiveHabits(habits).filter((h) => !eligible.includes(h.energyLevel))
}

export function selectCurrentStreak(data: AppData): number {
  const today = format(new Date(), 'yyyy-MM-dd')
  return getCurrentStreak(data.dailyLogs, data.habits, today)
}

export function selectTodayLog(data: AppData) {
  const today = format(new Date(), 'yyyy-MM-dd')
  return data.dailyLogs[today] ?? null
}
