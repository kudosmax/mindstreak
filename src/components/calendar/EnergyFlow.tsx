'use client'

import type { DailyLog, EnergyLevel } from '@/types'
import { ENERGY_COLORS, ENERGY_LABELS } from '@/constants/colors'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isFuture,
} from 'date-fns'

interface EnergyFlowProps {
  dailyLogs: Record<string, DailyLog>
  year: number
  month: number
}

const ENERGY_Y: Record<EnergyLevel, number> = {
  high: 16,
  medium: 40,
  low: 64,
}

export default function EnergyFlow({ dailyLogs, year, month }: EnergyFlowProps) {
  const start = startOfMonth(new Date(year, month))
  const end = endOfMonth(start)
  const days = eachDayOfInterval({ start, end }).filter((d) => !isFuture(d))

  const points = days
    .map((d) => {
      const key = format(d, 'yyyy-MM-dd')
      const log = dailyLogs[key]
      if (!log) return null
      return { day: d.getDate(), energy: log.energyLevel }
    })
    .filter(Boolean) as { day: number; energy: EnergyLevel }[]

  if (points.length === 0) return null

  const totalDays = endOfMonth(start).getDate()
  const width = 280
  const height = 80
  const padX = 12

  const toX = (day: number) => padX + ((day - 1) / (totalDays - 1)) * (width - padX * 2)
  const toY = (energy: EnergyLevel) => ENERGY_Y[energy]

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.day)} ${toY(p.energy)}`)
    .join(' ')

  const energyCounts: Record<EnergyLevel, number> = { high: 0, medium: 0, low: 0 }
  points.forEach((p) => energyCounts[p.energy]++)

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">에너지 흐름</h3>
      <div className="rounded-xl bg-muted/40 p-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid lines */}
          {(['high', 'medium', 'low'] as EnergyLevel[]).map((level) => (
            <g key={level}>
              <line
                x1={padX}
                y1={ENERGY_Y[level]}
                x2={width - padX}
                y2={ENERGY_Y[level]}
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeDasharray="4 4"
              />
              <text
                x={4}
                y={ENERGY_Y[level] + 3}
                fill={ENERGY_COLORS[level]}
                fontSize="7"
                fontWeight="500"
              >
                {ENERGY_LABELS[level][0]}
              </text>
            </g>
          ))}

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="url(#energyGradient)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots */}
          {points.map((p) => (
            <circle
              key={p.day}
              cx={toX(p.day)}
              cy={toY(p.energy)}
              r={3}
              fill={ENERGY_COLORS[p.energy]}
            />
          ))}

          <defs>
            <linearGradient id="energyGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={ENERGY_COLORS.low} />
              <stop offset="50%" stopColor={ENERGY_COLORS.medium} />
              <stop offset="100%" stopColor={ENERGY_COLORS.high} />
            </linearGradient>
          </defs>
        </svg>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-2">
          {(['high', 'medium', 'low'] as EnergyLevel[]).map((level) => (
            <div key={level} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: ENERGY_COLORS[level] }}
              />
              <span className="text-[10px] text-muted-foreground">
                {ENERGY_LABELS[level]} {energyCounts[level]}일
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
