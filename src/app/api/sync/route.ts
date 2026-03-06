import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { habits, dailyLogs } from '@/lib/db/schema'
import { getAuthenticatedUser, unauthorized, success, serverError } from '@/lib/api-helpers'
import type { DailyLog } from '@/types'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const [habitsRows, logsRows] = await Promise.all([
      getDb().select().from(habits).where(eq(habits.userId, user.id)),
      getDb().select().from(dailyLogs).where(eq(dailyLogs.userId, user.id)),
    ])

    const dailyLogsMap: Record<string, DailyLog> = {}
    for (const row of logsRows) {
      dailyLogsMap[row.date] = {
        date: row.date,
        energyLevel: row.energyLevel as DailyLog['energyLevel'],
        completedHabitIds: JSON.parse(row.completedHabitIds),
        loggedAt: row.loggedAt as string,
      }
    }

    return success({
      habits: habitsRows.map((h) => ({
        id: h.id,
        name: h.name,
        emoji: h.emoji,
        color: h.color,
        energyLevel: h.energyLevel,
        order: h.order,
        createdAt: h.createdAt,
        archivedAt: h.archivedAt ?? undefined,
      })),
      dailyLogs: dailyLogsMap,
      version: 1,
    })
  } catch {
    return serverError()
  }
}
