'use client'

import { create } from 'zustand'
import { nanoid } from 'nanoid'
import { format } from 'date-fns'
import type { AppData, Habit, DailyLog, EnergyLevel } from '@/types'
import { apiGet, apiPost, apiPatch, apiPut } from '@/lib/api-client'

interface AppStore extends AppData {
  isHydrated: boolean

  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'order'>) => void
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void
  archiveHabit: (id: string) => void
  reorderHabits: (orderedIds: string[]) => void

  setEnergyLevel: (date: string, energyLevel: EnergyLevel) => void
  toggleHabit: (date: string, habitId: string) => void

  importData: (data: AppData) => void
  clearAllData: () => void
  hydrate: () => Promise<void>
}

export const useAppStore = create<AppStore>((set, get) => ({
  habits: [],
  dailyLogs: {},
  version: 1,
  isHydrated: false,

  hydrate: async () => {
    try {
      const data = await apiGet<AppData>('/api/sync')
      set({ ...data, isHydrated: true })
    } catch {
      set({ isHydrated: true })
    }
  },

  addHabit: (habit) => {
    const { habits } = get()
    const newHabit: Habit = {
      ...habit,
      id: nanoid(),
      createdAt: new Date().toISOString(),
      order: habits.length,
    }
    set({ habits: [...habits, newHabit] })
    apiPost('/api/habits', newHabit).catch(() => {
      set({ habits: get().habits.filter((h) => h.id !== newHabit.id) })
    })
  },

  updateHabit: (id, updates) => {
    const prevHabits = get().habits
    const habits = prevHabits.map((h) =>
      h.id === id ? { ...h, ...updates } : h
    )
    set({ habits })
    apiPatch(`/api/habits/${id}`, updates).catch(() => {
      set({ habits: prevHabits })
    })
  },

  archiveHabit: (id) => {
    const prevHabits = get().habits
    const archivedAt = new Date().toISOString()
    const habits = prevHabits.map((h) =>
      h.id === id ? { ...h, archivedAt } : h
    )
    set({ habits })
    apiPatch(`/api/habits/${id}`, { archivedAt }).catch(() => {
      set({ habits: prevHabits })
    })
  },

  reorderHabits: (orderedIds) => {
    const habitMap = new Map(get().habits.map((h) => [h.id, h]))
    const habits = orderedIds
      .map((id, order) => {
        const h = habitMap.get(id)
        return h ? { ...h, order } : null
      })
      .filter(Boolean) as Habit[]
    set({ habits })
    apiPost('/api/habits/reorder', { orderedIds }).catch(() => {
      get().hydrate()
    })
  },

  setEnergyLevel: (date, energyLevel) => {
    const { dailyLogs } = get()
    const existing = dailyLogs[date]
    const log: DailyLog = {
      date,
      energyLevel,
      completedHabitIds: existing?.completedHabitIds ?? [],
      loggedAt: new Date().toISOString(),
    }
    set({ dailyLogs: { ...dailyLogs, [date]: log } })
    apiPut(`/api/daily-logs/${date}`, {
      energyLevel,
      completedHabitIds: log.completedHabitIds,
    }).catch(() => {
      get().hydrate()
    })
  },

  toggleHabit: (date, habitId) => {
    const { dailyLogs } = get()
    const log = dailyLogs[date]
    if (!log) return

    const isCompleted = log.completedHabitIds.includes(habitId)
    const completedHabitIds = isCompleted
      ? log.completedHabitIds.filter((id) => id !== habitId)
      : [...log.completedHabitIds, habitId]

    const updatedLog: DailyLog = {
      ...log,
      completedHabitIds,
      loggedAt: new Date().toISOString(),
    }
    set({ dailyLogs: { ...dailyLogs, [date]: updatedLog } })
    apiPatch(`/api/daily-logs/${date}/toggle`, { habitId }).catch(() => {
      get().hydrate()
    })
  },

  importData: (data) => {
    set(data)
    apiPost('/api/import', data).catch(() => {
      get().hydrate()
    })
  },

  clearAllData: () => {
    set({ habits: [], dailyLogs: {}, version: 1 })
  },
}))

export function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd')
}
