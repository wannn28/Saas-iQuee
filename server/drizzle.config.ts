import { defineConfig } from 'drizzle-kit'

// `npm run db:generate` diffs src/db/schema.ts and writes versioned SQL migrations to ./drizzle
export default defineConfig({
  dialect: 'mysql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: { url: process.env.DATABASE_URL ?? 'mysql://gapless:localdev@localhost:3306/gapless' },
})
