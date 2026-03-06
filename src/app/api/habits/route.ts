import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { habits } from '@/lib/db/schema'
import { getAuthenticatedUser, unauthorized, badRequest, success, serverError } from '@/lib/api-helpers'
import { createHabitSchema } from '@/lib/validations'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const rows = await getDb()
      .select()
      .from(habits)
      .where(eq(habits.userId, user.id))

    return success(rows)
  } catch {
    return serverError()
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const body = await req.json()
    const parsed = createHabitSchema.safeParse(body)
    if (!parsed.success) return badRequest('잘못된 습관 데이터입니다.')

    const data = parsed.data

    await getDb().insert(habits).values({
      id: data.id,
      userId: user.id,
      name: data.name,
      emoji: data.emoji,
      color: data.color,
      energyLevel: data.energyLevel,
      order: data.order,
      createdAt: data.createdAt,
    })

    return success({ id: data.id })
  } catch {
    return serverError()
  }
}
