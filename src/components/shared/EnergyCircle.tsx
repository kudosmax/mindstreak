import type { Habit } from '@/types'
import type { EnergyLevel } from '@/types'
import { ENERGY_COLORS } from '@/constants/colors'
import { buildSectorPath } from '@/lib/svgUtils'

// 에너지 레벨 순서 (섹터 배치 순)
const LEVEL_ORDER: EnergyLevel[] = ['high', 'medium', 'low']

// 완료율(0~1)에 따른 색상 (흐림→연→기본→선명)
// 다크모드 기준: 더 완료될수록 더 선명하게 (어두워지면 배경에 묻힘)
const ENERGY_SHADE_FN: Record<EnergyLevel, (ratio: number) => string> = {
  high:   (r) => r === 0 ? '#FF6B6B20' : r < 0.5 ? '#FF9898' : r < 1 ? '#FF6B6B' : '#FF2D2D',
  medium: (r) => r === 0 ? '#1DD1A120' : r < 0.5 ? '#6EE7CC' : r < 1 ? '#1DD1A1' : '#00E5B0',
  low:    (r) => r === 0 ? '#54A0FF20' : r < 0.5 ? '#93C5FD' : r < 1 ? '#54A0FF' : '#1A7FFF',
}

interface EnergyCircleProps {
  habits: Habit[]
  completedIds: string[]
  energyLevel?: EnergyLevel
  size?: number
}

export default function EnergyCircle({
  habits,
  completedIds,
  energyLevel: _energyLevel,
  size = 32,
}: EnergyCircleProps) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 2
  const innerR = r * 0.45

  const n = habits.length

  if (n === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={ENERGY_COLORS.medium} strokeWidth="1.5" opacity={0.25} />
      </svg>
    )
  }

  // 에너지 레벨별 그룹 집계
  const groups = LEVEL_ORDER.map((level) => {
    const group = habits.filter((h) => h.energyLevel === level)
    const completed = group.filter((h) => completedIds.includes(h.id)).length
    return { level, count: group.length, completed }
  }).filter((g) => g.count > 0)

  // 섹터 각도: 균등 3등분
  let currentAngle = -90
  const sectors = groups.map((g) => {
    const angle = 360 / groups.length
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle
    const ratio = g.completed / g.count
    const fill = ENERGY_SHADE_FN[g.level](ratio)
    return { ...g, startAngle, endAngle, fill }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="에너지 서클">
      {sectors.map((s) => {
        const d = buildSectorPath(cx, cy, r, s.startAngle, s.endAngle, innerR)
        return (
          <path
            key={s.level}
            d={d}
            fill={s.fill}
            stroke="none"
            style={{ transition: 'fill 0.3s ease' }}
          />
        )
      })}
    </svg>
  )
}
