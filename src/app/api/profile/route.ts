import { NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { getAuthenticatedUser, unauthorized, badRequest, success, serverError } from '@/lib/api-helpers'
import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().min(1).max(20),
})

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const body = await request.json()
    const parsed = updateProfileSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest('닉네임은 1~20자여야 합니다.')
    }

    const db = getDb()
    await db
      .update(users)
      .set({ name: parsed.data.name })
      .where(eq(users.id, user.id))

    return success({ name: parsed.data.name })
  } catch (error) {
    console.error('Profile update failed:', error)
    return serverError()
  }
}
