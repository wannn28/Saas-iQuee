import { env } from './env'
import { createApp } from './app'
import { pool } from './db/client'

const server = createApp().listen(env.PORT, () => {
  console.log(`gapless-waitlist-api listening on :${env.PORT} (${env.NODE_ENV})`)
})

const shutdown = (sig: string) => {
  console.log(`${sig} received, shutting down`)
  server.close(() => { pool.end().finally(() => process.exit(0)) })
  setTimeout(() => process.exit(1), 10_000).unref()
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
