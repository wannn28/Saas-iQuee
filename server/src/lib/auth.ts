import crypto from 'node:crypto'
import type { RequestHandler } from 'express'
import { env } from '../env'

const safeEqual = (a: string, b: string) =>
  crypto.timingSafeEqual(crypto.createHash('sha256').update(a).digest(), crypto.createHash('sha256').update(b).digest())

/** HTTP Basic auth for the demo admin endpoints. No WWW-Authenticate header, so browsers don't pop a dialog. */
export const basicAuth: RequestHandler = (req, res, next) => {
  const h = req.headers.authorization ?? ''
  if (h.startsWith('Basic ')) {
    const decoded = Buffer.from(h.slice(6), 'base64').toString()
    const i = decoded.indexOf(':')
    if (i > 0 && safeEqual(decoded.slice(0, i), env.ADMIN_USER) && safeEqual(decoded.slice(i + 1), env.ADMIN_PASSWORD)) {
      next(); return
    }
  }
  res.status(401).json({ error: 'Wrong username or password' })
}

export const hashIp = (ip: string | undefined) => (ip ? crypto.createHash('sha256').update(ip + env.IP_HASH_SALT).digest('hex') : null)
