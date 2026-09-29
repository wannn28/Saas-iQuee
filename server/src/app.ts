import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { pool } from './db/client'
import { env, corsOrigins } from './env'
import { errorHandler } from './lib/http'
import { publicRoutes } from './routes/public'
import { admin } from './routes/admin'

const started = Date.now()

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', env.TRUST_PROXY)
  app.use(helmet())
  app.use(cors({
    origin: (origin, cb) => cb(null, !origin || corsOrigins.includes(origin)),
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
  }))
  app.use(express.json({ limit: '16kb' }))

  const api = express.Router()
  api.get('/health', async (_req, res) => {
    try {
      await pool.query('SELECT 1')
      res.json({ status: 'ok', db: 'up', service: 'gapless-waitlist-api', uptimeSec: Math.round((Date.now() - started) / 1000) })
    } catch {
      res.status(503).json({ status: 'degraded', db: 'down', service: 'gapless-waitlist-api' })
    }
  })
  api.use(rateLimit({ windowMs: 60 * 1000, limit: 240, standardHeaders: 'draft-7', legacyHeaders: false }))
  api.use(publicRoutes)
  api.use('/admin', admin)
  api.use((_req, res) => { res.status(404).json({ error: 'Not found' }) })

  app.use('/api', api)
  app.use((_req, res) => { res.status(404).json({ error: 'Not found' }) })
  app.use(errorHandler)
  return app
}
