import type { EnergyLevel } from '@/types'

export const HABIT_COLORS = [
  '#FF6B6B', // coral red
  '#FF9F43', // orange
  '#FECA57', // yellow
  '#48DBFB', // sky blue
  '#1DD1A1', // mint green
  '#54A0FF', // blue
  '#A29BFE', // lavender
  '#FD79A8', // pink
] as const

export const ENERGY_COLORS: Record<EnergyLevel, string> = {
  high: '#FECA57',   // gold
  medium: '#1DD1A1', // green
  low: '#54A0FF',    // blue
}

export const ENERGY_LABELS: Record<EnergyLevel, string> = {
  high: '높음',
  medium: '보통',
  low: '낮음',
}

export const ENERGY_ORDER: Record<EnergyLevel, EnergyLevel[]> = {
  high: ['high', 'medium', 'low'],
  medium: ['medium', 'low'],
  low: ['low'],
}

export const DEFAULT_EMOJIS = [
  '💪', '📚', '📔', '🧘', '🎨', '🎵', '🏃', '🚴',
  '🍳', '🌱', '✍️', '🎯', '💻', '📖', '🏋️', '🧗',
  '🎸', '🧩', '🌊', '⚽',
]
