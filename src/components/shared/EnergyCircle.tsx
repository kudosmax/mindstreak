import type { Habit } from '@/types'
import type { EnergyLevel } from '@/types'
import { ENERGY_COLORS } from '@/constants/colors'
import { buildSectorPath } from '@/lib/svgUtils'

interface EnergyCircleProps {
  habits: Habit[]
  completedIds: string[]
  energyLevel?: EnergyLevel
  size?: number
}

export default function EnergyCircle({
  habits,
  completedIds,
  energyLevel,
  size = 32,
}: EnergyCircleProps) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 2
  const innerR = r * 0.45

  const n = habits.length

  if (n === 0) {
    const borderColor = energyLevel ? ENERGY_COLORS[energyLevel] : 'currentColor'
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={borderColor}
          strokeWidth="1.5"
          opacity={0.25}
        />
      </svg>
    )
  }

  const sectorAngle = 360 / n

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label="에너지 서클"
    >
      {habits.map((habit, i) => {
        const startAngle = i * sectorAngle
        const endAngle = (i + 1) * sectorAngle
        const isCompleted = completedIds.includes(habit.id)
        const d = buildSectorPath(cx, cy, r, startAngle, endAngle, innerR)
        const color = ENERGY_COLORS[habit.energyLevel]

        return (
          <path
            key={habit.id}
            d={d}
            fill={isCompleted ? color : `${color}20`}
            stroke="none"
            style={{ transition: 'fill 0.3s ease' }}
          />
        )
      })}
    </svg>
  )
}
