/* Idempotent seed: a few fictional sample signups (example.com) so the admin view isn't empty on a fresh DB. */
import { sql } from 'drizzle-orm'
import { db, pool } from './db/client'
import { waitlistSignups } from './db/schema'

const SAMPLES = [
  { name: 'Priya Raman', email: 'priya@northside-physio.example.com', clinic: 'Northside Physio', teamSize: '2-8' as const },
  { name: 'Tom Okafor', email: 'tom@brightsmile-dental.example.com', clinic: 'Brightsmile Dental', teamSize: '9-25' as const },
  { name: 'Lena Fischer', email: 'lena@spine-and-joint.example.com', clinic: 'Spine & Joint Chiro', teamSize: 'solo' as const },
]

async function main() {
  for (const s of SAMPLES) {
    await db.insert(waitlistSignups).values({ ...s, source: 'seed' }).onDuplicateKeyUpdate({ set: { name: sql`name` } })
  }
  const [{ n }] = await db.select({ n: sql<number>`count(*)` }).from(waitlistSignups)
  console.log(`seed ok (${SAMPLES.length} sample signups ensured, ${n} total)`)
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => pool.end())
