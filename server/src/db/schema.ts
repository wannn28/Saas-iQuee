import { sql } from 'drizzle-orm'
import { bigint, boolean, char, index, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'

export const TEAM_SIZES = ['solo', '2-8', '9-25', '26+'] as const
export const CONTACT_TOPICS = ['sales', 'support', 'partnership', 'other'] as const

export const waitlistSignups = mysqlTable('waitlist_signups', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  /** stored lower-cased; unique -> duplicate check enforced by MySQL */
  email: varchar('email', { length: 254 }).notNull(),
  clinic: varchar('clinic', { length: 160 }).notNull(),
  teamSize: mysqlEnum('team_size', TEAM_SIZES).notNull(),
  source: varchar('source', { length: 40 }).notNull().default('landing'),
  /** sha256(ip + salt): lets us spot abuse without storing raw IPs */
  ipHash: char('ip_hash', { length: 64 }),
  userAgent: varchar('user_agent', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [
  uniqueIndex('uq_waitlist_email').on(t.email),
  index('idx_waitlist_created').on(t.createdAt),
])

export const contactMessages = mysqlTable('contact_messages', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  email: varchar('email', { length: 254 }).notNull(),
  company: varchar('company', { length: 160 }),
  topic: mysqlEnum('topic', CONTACT_TOPICS).notNull().default('sales'),
  message: text('message').notNull(),
  handled: boolean('handled').notNull().default(false),
  ipHash: char('ip_hash', { length: 64 }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [index('idx_contact_created').on(t.createdAt)])

export type WaitlistSignup = typeof waitlistSignups.$inferSelect
