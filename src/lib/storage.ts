import type { AppData } from '@/types'

const STORAGE_KEY = 'mindstreak_data'

const DEFAULT_DATA: AppData = {
  habits: [],
  dailyLogs: {},
  version: 1,
}

export function loadData(): AppData {
  if (typeof window === 'undefined') return DEFAULT_DATA

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_DATA
    const parsed = JSON.parse(raw) as AppData
    return { ...DEFAULT_DATA, ...parsed }
  } catch {
    return DEFAULT_DATA
  }
}

export function saveData(data: AppData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function clearData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
