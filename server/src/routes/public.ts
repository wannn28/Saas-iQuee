import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { sql, lte } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db/client'
import { CONTACT_TOPICS, TEAM_SIZES, contactMessages, waitlistSignups } from '../db/schema'
import { env } from '../env'
import { ah, parse, HttpError } from '../lib/http'
import { hashIp } from '../lib/auth'

export const publicRoutes = Router()

const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: env.SIGNUP_RATE_LIMIT,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many submissions from your network. Please try again in a few minutes.' },
})

const email = z.string().trim().toLowerCase().max(254).regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'That email doesn’t look right — check for typos.')
/** honeypot: a visually hidden "website" field real users never fill in */
const honeypot = z.string().max(200).optional()

const waitlistSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(120),
  email,
  clinic: z.string().trim().min(2, 'Which clinic or practice is this for?').max(160),
  teamSize: z.enum(TEAM_SIZES, { errorMap: () => ({ message: 'Pick the closest team size.' }) }),
  website: honeypot,
})

async function countSignups() {
  const [{ n }] = await db.select({ n: sql<number>`count(*)` }).from(waitlistSignups)
  return Number(n)
}

/** GET /api/waitlist/count */
publicRoutes.get('/waitlist/count', ah(async (_req, res) => {
  res.set('Cache-Control', 'public, max-age=15')
  res.json({ count: await countSignups() })
}))

/** POST /api/waitlist -> { position, count } ; 409 on duplicate email */
publicRoutes.post('/waitlist', writeLimiter, ah(async (req, res) => {
  const body = parse(waitlistSchema, req.body)
  if (body.website) {
    // bot filled the honeypot: pretend success, store nothing
    const count = await countSignups()
    res.status(201).json({ position: count + 1, count: count + 1, firstName: body.name.split(' ')[0] })
    return
  }
  let id: number
  try {
    const [result] = await db.insert(waitlistSignups).values({
      name: body.name, email: body.email, clinic: body.clinic, teamSize: body.teamSize,
      source: 'landing', ipHash: hashIp(req.ip), userAgent: (req.get('user-agent') ?? '').slice(0, 255) || null,
    })
    id = Number(result.insertId)
  } catch (e) {
    const err = e as { code?: string; cause?: { code?: string } }
    if (err.code === 'ER_DUP_ENTRY' || err.cause?.code === 'ER_DUP_ENTRY') {
      throw new HttpError(409, 'This email is already on the waitlist.', { fieldErrors: { email: ['This email is already on the waitlist.'] } })
    }
    throw e
  }
  // position = how many signups were created up to and including this one
  const [{ pos }] = await db.select({ pos: sql<number>`count(*)` }).from(waitlistSignups).where(lte(waitlistSignups.id, id))
  res.status(201).json({ position: Number(pos), count: await countSignups(), firstName: body.name.split(' ')[0] })
}))

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  email,
  company: z.string().trim().max(160).optional(),
  topic: z.enum(CONTACT_TOPICS).default('sales'),
  message: z.string().trim().min(10, 'Tell us a little more (10+ characters).').max(4000),
  website: honeypot,
})

/** POST /api/contact */
publicRoutes.post('/contact', writeLimiter, ah(async (req, res) => {
  const body = parse(contactSchema, req.body)
  if (!body.website) {
    await db.insert(contactMessages).values({
      name: body.name, email: body.email, company: body.company || null, topic: body.topic, message: body.message, ipHash: hashIp(req.ip),
    })
  }
  res.status(201).json({ ok: true })
}))
