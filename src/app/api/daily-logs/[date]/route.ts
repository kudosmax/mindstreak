import { and, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { getDb } from '@/lib/db'
import { dailyLogs } from '@/lib/db/schema'
import { getAuthenticatedUser, unauthorized, badRequest, success, serverError } from '@/lib/api-helpers'
import { upsertDailyLogSchema } from '@/lib/validations'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const { date } = await params
    const body = await req.json()
    const parsed = upsertDailyLogSchema.safeParse(body)
    if (!parsed.success) return badRequest('잘못된 로그 데이터입니다.')

    const existing = await getDb()
      .select()
      .from(dailyLogs)
      .where(and(eq(dailyLogs.userId, user.id), eq(dailyLogs.date, date)))
      .limit(1)

    const completedJson = JSON.stringify(parsed.data.completedHabitIds)
    const now = new Date().toISOString()

    if (existing.length > 0) {
      await getDb()
        .update(dailyLogs)
        .set({
          energyLevel: parsed.data.energyLevel,
          completedHabitIds: completedJson,
          loggedAt: now,
        })
        .where(and(eq(dailyLogs.userId, user.id), eq(dailyLogs.date, date)))
    } else {
      await getDb().insert(dailyLogs).values({
        id: nanoid(),
        userId: user.id,
        date,
        energyLevel: parsed.data.energyLevel,
        completedHabitIds: completedJson,
        loggedAt: now,
      })
    }

    return success({ date })
  } catch {
    return serverError()
  }
}
