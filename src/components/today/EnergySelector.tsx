'use client'

import type { EnergyLevel } from '@/types'
import { ENERGY_COLORS, ENERGY_LABELS } from '@/constants/colors'

interface EnergySelectorProps {
  selected: EnergyLevel | null
  onChange: (level: EnergyLevel) => void
}

const LEVELS: { level: EnergyLevel; desc: string }[] = [
  { level: 'low', desc: '피곤하거나 쉬고 싶은 날' },
  { level: 'medium', desc: '평소 컨디션인 날' },
  { level: 'high', desc: '활력이 넘치는 날' },
]

export default function EnergySelector({ selected, onChange }: EnergySelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">오늘의 에너지는?</p>
      <div className="flex gap-2">
        {LEVELS.map(({ level, desc }) => {
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
              title={desc}
            >
              {ENERGY_LABELS[level]}
            </button>
          )
        })}
      </div>
      {selected && (
        <p className="text-xs text-muted-foreground">
          {LEVELS.find((l) => l.level === selected)?.desc}
        </p>
      )}
    </div>
  )
}
