import type { DailyLog, Habit, EnergyLevel } from '@/types'
import { ENERGY_ORDER } from '@/constants/colors'
import { subDays, format, parseISO } from 'date-fns'

export function getEligibleHabits(habits: Habit[], energyLevel: EnergyLevel): Habit[] {
  const eligible = ENERGY_ORDER[energyLevel]
  return habits.filter(
    (h) => !h.archivedAt && eligible.includes(h.energyLevel)
  )
}

export function isDaySuccessful(log: DailyLog, habits: Habit[]): boolean {
  const eligible = getEligibleHabits(habits, log.energyLevel)
  return eligible.some((h) => log.completedHabitIds.includes(h.id))
}

export function getCurrentStreak(
  dailyLogs: Record<string, DailyLog>,
  habits: Habit[],
  today: string
): number {
  let streak = 0
  let current = parseISO(today)

  while (true) {
    const dateKey = format(current, 'yyyy-MM-dd')
    const log = dailyLogs[dateKey]

    if (!log) break

    if (isDaySuccessful(log, habits)) {
      streak++
      current = subDays(current, 1)
    } else {
      break
    }
  }

  return streak
}

export function getMonthSuccessDays(
  dailyLogs: Record<string, DailyLog>,
  habits: Habit[],
  year: number,
  month: number
): number {
  let count = 0
  Object.entries(dailyLogs).forEach(([date, log]) => {
    const d = parseISO(date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      if (isDaySuccessful(log, habits)) count++
    }
  })
  return count
}
