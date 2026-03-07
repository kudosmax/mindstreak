import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'

async function check() {
  const sql = neon(process.env.DATABASE_URL!)

  const users = await sql`SELECT id, name, email FROM users`
  console.log(`=== Users (${users.length}) ===`)
  for (const u of users) {
    console.log(`  ${u.id} - ${u.name} (${u.email})`)
  }

  const habits = await sql`SELECT user_id, id, name, energy_level FROM habits ORDER BY user_id, "order"`
  console.log(`\n=== Habits (${habits.length}) ===`)
  for (const h of habits) {
    console.log(`  [${(h.user_id as string).slice(0,8)}] ${h.name} (${h.energy_level})`)
  }

  const logs = await sql`SELECT user_id, date, energy_level, completed_habit_ids FROM daily_logs ORDER BY user_id, date`
  console.log(`\n=== Logs (${logs.length}) ===`)
  for (const l of logs) {
    const ids = JSON.parse(l.completed_habit_ids as string)
    console.log(`  [${(l.user_id as string).slice(0,8)}] ${l.date}: energy=${l.energy_level}, completed=${ids.length}`)
  }
}

check().catch(console.error)
