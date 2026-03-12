import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { getDb } from '@/lib/db'
import { pushSubscriptions } from '@/lib/db/schema'

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getDb()
    const subs = await db.select().from(pushSubscriptions)

    let sent = 0

    await Promise.allSettled(
      subs.map(async (sub) => {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({
            title: 'MindStreak 🔥',
            body: '오늘의 습관을 기록해 주세요',
            url: '/',
          })
        )
        sent++
      })
    )

    return NextResponse.json({ ok: true, sent })
  } catch (error) {
    console.error('Push send failed:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
