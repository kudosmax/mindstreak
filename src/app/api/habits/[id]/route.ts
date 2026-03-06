import { and, eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { habits } from '@/lib/db/schema'
import { getAuthenticatedUser, unauthorized, badRequest, success, serverError } from '@/lib/api-helpers'
import { updateHabitSchema } from '@/lib/validations'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const { id } = await params
    const body = await req.json()
    const parsed = updateHabitSchema.safeParse(body)
    if (!parsed.success) return badRequest('잘못된 수정 데이터입니다.')

    await getDb()
      .update(habits)
      .set(parsed.data)
      .where(and(eq(habits.id, id), eq(habits.userId, user.id)))

    return success({ id })
  } catch {
    return serverError()
  }
}
