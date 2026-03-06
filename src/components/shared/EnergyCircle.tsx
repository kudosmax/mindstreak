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
  const innerR = r * 0.4

  const n = habits.length

  if (n === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-muted"
        />
      </svg>
    )
  }

  const sectorAngle = 360 / n
  const borderColor = energyLevel ? ENERGY_COLORS[energyLevel] : 'transparent'

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label="에너지 서클"
    >
      {/* background ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={borderColor}
        strokeWidth="1.5"
        opacity="0.3"
      />

      {habits.map((habit, i) => {
        const startAngle = i * sectorAngle
        const endAngle = (i + 1) * sectorAngle
        const isCompleted = completedIds.includes(habit.id)
        const d = buildSectorPath(cx, cy, r, startAngle, endAngle, innerR)

        return (
          <path
            key={habit.id}
            d={d}
            fill={isCompleted ? habit.color : 'transparent'}
            stroke={habit.color}
            strokeWidth="0.5"
            opacity={isCompleted ? 1 : 0.35}
            style={{ transition: 'fill 0.3s ease, opacity 0.3s ease' }}
          />
        )
      })}
    </svg>
  )
}
