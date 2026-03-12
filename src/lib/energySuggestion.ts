import type { DailyLog, Habit, EnergyLevel } from '@/types'

export function getEnergySuggestion(
  energyLevel: EnergyLevel,
  dailyLogs: Record<string, DailyLog>,
  habits: Habit[]
): string | null {
  const activeHabits = habits.filter((h) => !h.archivedAt)
  if (activeHabits.length === 0) return null

  const habitMap = new Map(activeHabits.map((h) => [h.id, h]))

  const completionCounts: Record<string, number> = {}

  const logsForEnergy = Object.values(dailyLogs).filter(
    (log) => log.energyLevel === energyLevel
  )

  if (logsForEnergy.length < 3) return null

  for (const log of logsForEnergy) {
    for (const id of log.completedHabitIds) {
      if (habitMap.has(id)) {
        completionCounts[id] = (completionCounts[id] ?? 0) + 1
      }
    }
  }

  const entries = Object.entries(completionCounts)
  if (entries.length === 0) return null

  entries.sort((a, b) => b[1] - a[1])
  const [topId, topCount] = entries[0]
  const topHabit = habitMap.get(topId)
  if (!topHabit) return null

  const rate = Math.round((topCount / logsForEnergy.length) * 100)

  return `비슷한 에너지일 때 ${topHabit.emoji} ${topHabit.name}을 ${rate}% 했어요`
}
