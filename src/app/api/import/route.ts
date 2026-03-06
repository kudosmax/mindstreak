import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { getDb } from '@/lib/db'
import { habits, dailyLogs } from '@/lib/db/schema'
import { getAuthenticatedUser, unauthorized, badRequest, success, serverError } from '@/lib/api-helpers'
import { importDataSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const body = await req.json()
    const parsed = importDataSchema.safeParse(body)
    if (!parsed.success) return badRequest('올바른 백업 데이터가 아닙니다.')

    const data = parsed.data

    // 기존 데이터 삭제 후 새 데이터 삽입
    await Promise.all([
      getDb().delete(habits).where(eq(habits.userId, user.id)),
      getDb().delete(dailyLogs).where(eq(dailyLogs.userId, user.id)),
    ])

    // 습관 삽입
    if (data.habits.length > 0) {
      await getDb().insert(habits).values(
        data.habits.map((h) => ({
          id: h.id,
          userId: user.id,
          name: h.name,
          emoji: h.emoji,
          color: h.color,
          energyLevel: h.energyLevel,
          order: h.order,
          createdAt: h.createdAt,
          archivedAt: h.archivedAt ?? null,
        }))
      )
    }

    // 로그 삽입
    const logEntries = Object.values(data.dailyLogs)
    if (logEntries.length > 0) {
      await getDb().insert(dailyLogs).values(
        logEntries.map((log) => ({
          id: nanoid(),
          userId: user.id,
          date: log.date,
          energyLevel: log.energyLevel,
          completedHabitIds: JSON.stringify(log.completedHabitIds),
          loggedAt: log.loggedAt,
        }))
      )
    }

    return success({ imported: true })
  } catch {
    return serverError()
  }
}
