import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { getDb } from '@/lib/db'
import { pushSubscriptions, dailyLogs } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

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
    const todayKST = format(toZonedTime(new Date(), 'Asia/Seoul'), 'yyyy-MM-dd')

    const subs = await db.select().from(pushSubscriptions)

    let sent = 0
    let skipped = 0

    await Promise.allSettled(
      subs.map(async (sub) => {
        const [log] = await db
          .select()
          .from(dailyLogs)
          .where(and(eq(dailyLogs.userId, sub.userId), eq(dailyLogs.date, todayKST)))
          .limit(1)

        if (log) {
          skipped++
          return
        }

        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({
            title: 'MindStreak 🔥',
            body: '오늘 습관을 아직 기록하지 않았어요!',
            url: '/',
          })
        )
        sent++
      })
    )

    return NextResponse.json({ ok: true, sent, skipped })
  } catch (error) {
    console.error('Push send failed:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
