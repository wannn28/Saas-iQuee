import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { desc, like, or, sql, count } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db/client'
import { contactMessages, waitlistSignups } from '../db/schema'
import { basicAuth } from '../lib/auth'
import { ah, parse, maskEmail } from '../lib/http'

export const admin = Router()

// brute-force protection: failed attempts count, successful ones don't
admin.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, skipSuccessfulRequests: true, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many failed logins, try again later.' } }))
admin.use(basicAuth)

/** The demo credentials are public, so personal data is masked in every admin response. */
const shortName = (n: string) => { const [f, ...r] = n.split(' '); return r.length ? `${f} ${r[r.length - 1][0]}.` : f }

admin.get('/me', (_req, res) => { res.json({ ok: true }) })

admin.get('/stats', ah(async (_req, res) => {
  const [[tot], bySize, byDay] = await Promise.all([
    db.select({
      total: count(),
      today: sql<number>`SUM(${waitlistSignups.createdAt} >= UTC_DATE())`,
      week: sql<number>`SUM(${waitlistSignups.createdAt} >= UTC_TIMESTAMP() - INTERVAL 7 DAY)`,
    }).from(waitlistSignups),
    db.select({ teamSize: waitlistSignups.teamSize, n: count() }).from(waitlistSignups).groupBy(waitlistSignups.teamSize),
    db.select({ day: sql<string>`DATE_FORMAT(${waitlistSignups.createdAt}, '%Y-%m-%d')`.as('day'), n: count() })
      .from(waitlistSignups)
      .where(sql`${waitlistSignups.createdAt} >= UTC_DATE() - INTERVAL 13 DAY`)
      .groupBy(sql`day`).orderBy(sql`day`),
  ])
  const [[contacts]] = await Promise.all([db.select({ n: count() }).from(contactMessages)])
  res.json({
    total: Number(tot.total), today: Number(tot.today ?? 0), last7Days: Number(tot.week ?? 0), contacts: Number(contacts.n),
    byTeamSize: Object.fromEntries(bySize.map((r) => [r.teamSize, Number(r.n)])),
    byDay: byDay.map((r) => ({ day: r.day, count: Number(r.n) })),
  })
}))

admin.get('/signups', ah(async (req, res) => {
  const q = parse(z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    q: z.string().trim().max(80).optional(),
  }), req.query)
  const where = q.q ? or(like(waitlistSignups.clinic, `%${q.q}%`), like(waitlistSignups.name, `%${q.q}%`), like(waitlistSignups.email, `%${q.q}%`)) : undefined
  const [[{ total }], rows] = await Promise.all([
    db.select({ total: count() }).from(waitlistSignups).where(where),
    db.select().from(waitlistSignups).where(where).orderBy(desc(waitlistSignups.id)).limit(q.pageSize).offset((q.page - 1) * q.pageSize),
  ])
  res.json({
    page: q.page, pageSize: q.pageSize, total: Number(total),
    items: rows.map((r) => ({
      id: r.id, name: shortName(r.name), email: maskEmail(r.email), clinic: r.clinic, teamSize: r.teamSize,
      source: r.source, createdAt: r.createdAt.toISOString(),
    })),
  })
}))

admin.get('/contacts', ah(async (req, res) => {
  const q = parse(z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20) }), req.query)
  const [[{ total }], rows] = await Promise.all([
    db.select({ total: count() }).from(contactMessages),
    db.select().from(contactMessages).orderBy(desc(contactMessages.id)).limit(q.pageSize).offset((q.page - 1) * q.pageSize),
  ])
  res.json({
    page: q.page, pageSize: q.pageSize, total: Number(total),
    items: rows.map((r) => ({
      id: r.id, name: shortName(r.name), email: maskEmail(r.email), company: r.company, topic: r.topic,
      message: r.message.length > 280 ? r.message.slice(0, 280) + '…' : r.message, createdAt: r.createdAt.toISOString(),
    })),
  })
}))
