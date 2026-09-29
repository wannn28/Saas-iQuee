import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3005),
  DATABASE_URL: z.string().startsWith('mysql://'),
  CORS_ORIGINS: z.string().default('http://localhost:5173,http://localhost:4175'),
  /** number of reverse proxies in front of the app (nginx + Cloudflare = 2) */
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),
  ADMIN_USER: z.string().min(3).default('demo'),
  ADMIN_PASSWORD: z.string().min(8),
  IP_HASH_SALT: z.string().min(16),
  /** requests per window for POST /api/waitlist and /api/contact, per IP */
  SIGNUP_RATE_LIMIT: z.coerce.number().int().positive().default(8),
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  console.error('Invalid environment:', parsed.error.flatten().fieldErrors)
  process.exit(1)
}
export const env = parsed.data
export const corsOrigins = env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
