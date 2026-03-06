export type EnergyLevel = 'high' | 'medium' | 'low'

export interface Habit {
  id: string
  name: string
  emoji: string
  color: string
  energyLevel: EnergyLevel
  createdAt: string
  archivedAt?: string
  order: number
}

export interface DailyLog {
  date: string
  energyLevel: EnergyLevel
  completedHabitIds: string[]
  loggedAt: string
}

export interface AppData {
  habits: Habit[]
  dailyLogs: Record<string, DailyLog>
  version: number
}
