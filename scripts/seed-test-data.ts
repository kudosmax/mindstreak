import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { users, habits, dailyLogs } from '../src/lib/db/schema'

async function seed() {
  const sql = neon(process.env.DATABASE_URL!)
  const db = drizzle(sql)

  // 이름이 있는 유저 = 실제 로그인한 유저
  const allUsers = await db.select().from(users)
  const realUser = allUsers.find((u) => u.name !== null) ?? allUsers[0]
  console.log(`User: ${realUser.id} (${realUser.name})`)

  // 이 유저의 습관
  const userHabits = await db.select().from(habits).where(eq(habits.userId, realUser.id))
  const activeHabits = userHabits.filter((h) => !h.archivedAt)
  console.log(`Habits (${activeHabits.length}):`)
  for (const h of activeHabits) {
    console.log(`  ${h.emoji} ${h.name} (${h.energyLevel})`)
  }

  if (activeHabits.length === 0) {
    console.log('No habits. Add some first.')
    return
  }

  // 3/1 ~ 3/6
  const testDays: { date: string; energyLevel: 'high' | 'medium' | 'low'; ratio: number }[] = [
    { date: '2026-03-01', energyLevel: 'high', ratio: 1.0 },
    { date: '2026-03-02', energyLevel: 'medium', ratio: 0.75 },
    { date: '2026-03-03', energyLevel: 'low', ratio: 0.25 },
    { date: '2026-03-04', energyLevel: 'high', ratio: 0.75 },
    { date: '2026-03-05', energyLevel: 'low', ratio: 0.5 },
    { date: '2026-03-06', energyLevel: 'medium', ratio: 1.0 },
  ]

  for (const day of testDays) {
    const count = Math.max(1, Math.round(activeHabits.length * day.ratio))
    const shuffled = [...activeHabits].sort(() => Math.random() - 0.5)
    const completed = shuffled.slice(0, count).map((h) => h.id)

    await db.delete(dailyLogs)
      .where(and(eq(dailyLogs.userId, realUser.id), eq(dailyLogs.date, day.date)))

    await db.insert(dailyLogs).values({
      id: nanoid(),
      userId: realUser.id,
      date: day.date,
      energyLevel: day.energyLevel,
      completedHabitIds: JSON.stringify(completed),
    })

    console.log(`${day.date}: energy=${day.energyLevel}, completed=${count}/${activeHabits.length}`)
  }

  console.log('\nDone! Cmd+Shift+R')
}

seed().catch(console.error)
