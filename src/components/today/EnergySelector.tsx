'use client'

import type { EnergyLevel } from '@/types'
import { ENERGY_COLORS, ENERGY_LABELS } from '@/constants/colors'

interface EnergySelectorProps {
  selected: EnergyLevel | null
  onChange: (level: EnergyLevel) => void
}

const LEVELS: EnergyLevel[] = ['low', 'medium', 'high']

export default function EnergySelector({ selected, onChange }: EnergySelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">오늘의 에너지는?</p>
      <div className="flex gap-2">
        {LEVELS.map((level) => {
          const isSelected = selected === level
          const color = ENERGY_COLORS[level]
          return (
            <button
              key={level}
              onClick={() => onChange(level)}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: isSelected ? color : `${color}22`,
                color: isSelected ? 'white' : color,
                transform: isSelected ? 'scale(1.04)' : 'scale(1)',
              }}
              aria-pressed={isSelected}
            >
              {ENERGY_LABELS[level]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
