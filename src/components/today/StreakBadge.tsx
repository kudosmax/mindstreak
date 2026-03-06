interface StreakBadgeProps {
  streak: number
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) return null

  return (
    <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950 px-3 py-1.5 rounded-full">
      <span className="text-lg leading-none">🔥</span>
      <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
        {streak}일 streak
      </span>
    </div>
  )
}
