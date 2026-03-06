import { and, eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { habits } from '@/lib/db/schema'
import { getAuthenticatedUser, unauthorized, badRequest, success, serverError } from '@/lib/api-helpers'
import { reorderHabitsSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const body = await req.json()
    const parsed = reorderHabitsSchema.safeParse(body)
    if (!parsed.success) return badRequest('잘못된 순서 데이터입니다.')

    const updates = parsed.data.orderedIds.map((id, order) =>
      getDb()
        .update(habits)
        .set({ order })
        .where(and(eq(habits.id, id), eq(habits.userId, user.id)))
    )

    await Promise.all(updates)

    return success({ reordered: true })
  } catch {
    return serverError()
  }
}
