import type { EnergyLevel } from '@/types'
import { ENERGY_COLORS, ENERGY_LABELS } from '@/constants/colors'

interface EnergyBadgeProps {
  level: EnergyLevel
  size?: 'sm' | 'md'
}

export default function EnergyBadge({ level, size = 'sm' }: EnergyBadgeProps) {
  const color = ENERGY_COLORS[level]
  const label = ENERGY_LABELS[level]

  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1'

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClass}`}
      style={{ backgroundColor: `${color}33`, color }}
    >
      {label}
    </span>
  )
}
