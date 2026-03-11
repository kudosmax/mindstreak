import { NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { pushSubscriptions } from '@/lib/db/schema'
import { getAuthenticatedUser, unauthorized, badRequest, success, serverError } from '@/lib/api-helpers'
import { z } from 'zod'

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const body = await request.json()
    const parsed = subscribeSchema.safeParse(body)
    if (!parsed.success) return badRequest('잘못된 구독 데이터입니다.')

    const { endpoint, keys } = parsed.data
    const db = getDb()

    await db
      .insert(pushSubscriptions)
      .values({ userId: user.id, endpoint, p256dh: keys.p256dh, auth: keys.auth })
      .onConflictDoUpdate({
        target: pushSubscriptions.endpoint,
        set: { p256dh: keys.p256dh, auth: keys.auth, userId: user.id },
      })

    return success({ ok: true })
  } catch {
    return serverError()
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const body = await request.json()
    const { endpoint } = body
    if (!endpoint) return badRequest('endpoint가 필요합니다.')

    const db = getDb()
    await db
      .delete(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, endpoint))

    return success({ ok: true })
  } catch {
    return serverError()
  }
}
