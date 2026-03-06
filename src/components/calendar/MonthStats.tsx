import type { AppData } from '@/types'
import { ENERGY_COLORS, ENERGY_LABELS } from '@/constants/colors'
import type { EnergyLevel } from '@/types'
import { getMonthSuccessDays } from '@/lib/streakCalculator'
import { parseISO } from 'date-fns'

interface MonthStatsProps {
  data: AppData
  year: number
  month: number
}

export default function MonthStats({ data, year, month }: MonthStatsProps) {
  const successDays = getMonthSuccessDays(data.dailyLogs, data.habits, year, month)

  const energyCounts: Record<EnergyLevel, number> = { high: 0, medium: 0, low: 0 }
  Object.entries(data.dailyLogs).forEach(([date, log]) => {
    const d = parseISO(date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      energyCounts[log.energyLevel]++
    }
  })

  const total = Object.values(energyCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">이번 달 성공일</span>
        <span className="text-sm font-bold">{successDays}일 🎯</span>
      </div>

      {total > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">에너지 분포</p>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden">
            {(['high', 'medium', 'low'] as EnergyLevel[]).map((level) => {
              const pct = total > 0 ? (energyCounts[level] / total) * 100 : 0
              return (
                <div
                  key={level}
                  style={{ width: `${pct}%`, backgroundColor: ENERGY_COLORS[level] }}
                  title={`${ENERGY_LABELS[level]}: ${energyCounts[level]}일`}
                />
              )
            })}
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground">
            {(['high', 'medium', 'low'] as EnergyLevel[]).map((level) => (
              <span key={level} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: ENERGY_COLORS[level] }}
                />
                {ENERGY_LABELS[level]} {energyCounts[level]}일
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
