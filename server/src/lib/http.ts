import type { NextFunction, Request, Response, RequestHandler } from 'express'
import type { ZodTypeAny, z } from 'zod'

export class HttpError extends Error {
  constructor(public status: number, message: string, public details?: unknown) { super(message) }
}

export const ah = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => { fn(req, res, next).catch(next) }

export function parse<S extends ZodTypeAny>(schema: S, data: unknown): z.infer<S> {
  const r = schema.safeParse(data)
  if (!r.success) {
    const f = r.error.flatten()
    throw new HttpError(400, 'Validation failed', { fieldErrors: f.fieldErrors, formErrors: f.formErrors })
  }
  return r.data
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) { res.status(err.status).json({ error: err.message, ...(err.details ? { details: err.details } : {}) }); return }
  const e = err as { type?: string }
  if (e?.type === 'entity.parse.failed') { res.status(400).json({ error: 'Malformed JSON body' }); return }
  if (e?.type === 'entity.too.large') { res.status(413).json({ error: 'Request body too large' }); return }
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}

export const maskEmail = (e: string) => {
  const [u, d] = e.split('@')
  return `${u.slice(0, 1)}${'•'.repeat(Math.max(2, Math.min(6, u.length - 1)))}@${d ?? ''}`
}
