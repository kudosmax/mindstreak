import { and, eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { dailyLogs } from '@/lib/db/schema'
import { getAuthenticatedUser, unauthorized, badRequest, success, serverError } from '@/lib/api-helpers'
import { toggleHabitSchema } from '@/lib/validations'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const { date } = await params
    const body = await req.json()
    const parsed = toggleHabitSchema.safeParse(body)
    if (!parsed.success) return badRequest('habitId가 필요합니다.')

    const rows = await getDb()
      .select()
      .from(dailyLogs)
      .where(and(eq(dailyLogs.userId, user.id), eq(dailyLogs.date, date)))
      .limit(1)

    if (rows.length === 0) return badRequest('해당 날짜의 로그가 없습니다.')

    const log = rows[0]
    const ids: string[] = JSON.parse(log.completedHabitIds)
    const habitId = parsed.data.habitId
    const isCompleted = ids.includes(habitId)

    const updatedIds = isCompleted
      ? ids.filter((id) => id !== habitId)
      : [...ids, habitId]

    await getDb()
      .update(dailyLogs)
      .set({
        completedHabitIds: JSON.stringify(updatedIds),
        loggedAt: new Date().toISOString(),
      })
      .where(and(eq(dailyLogs.userId, user.id), eq(dailyLogs.date, date)))

    return success({ date, completedHabitIds: updatedIds })
  } catch {
    return serverError()
  }
}
