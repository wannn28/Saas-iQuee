import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'
import * as schema from './schema'

export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 10,
  waitForConnections: true,
  timezone: 'Z',
  charset: 'utf8mb4',
})
export const db = drizzle(pool, { schema, mode: 'default' })
