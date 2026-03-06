import { and, eq, gte, lte } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { dailyLogs } from '@/lib/db/schema'
import { getAuthenticatedUser, unauthorized, badRequest, success, serverError } from '@/lib/api-helpers'

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const url = new URL(req.url)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    if (!from || !to) return badRequest('from과 to 파라미터가 필요합니다.')

    const rows = await getDb()
      .select()
      .from(dailyLogs)
      .where(
        and(
          eq(dailyLogs.userId, user.id),
          gte(dailyLogs.date, from),
          lte(dailyLogs.date, to)
        )
      )

    return success(rows)
  } catch {
    return serverError()
  }
}
