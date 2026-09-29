/** Tiny fetch wrapper. Production: same-origin /api (Nginx -> Node API). Dev/preview: Vite proxies /api. */
const BASE = ((import.meta.env.VITE_API_BASE as string | undefined) ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(public status: number, message: string, public fieldErrors: Record<string, string[] | undefined> = {}) { super(message) }
}

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init
  let res: Response
  try {
    res = await fetch(`${BASE}/api${path}`, {
      ...rest,
      headers: { Accept: 'application/json', ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    })
  } catch {
    throw new ApiError(0, 'We couldn’t reach our server. Check your connection and try again.')
  }
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, body?.error ?? `Request failed (${res.status})`, body?.details?.fieldErrors ?? {})
  return body as T
}

export const getWaitlistCount = () => api<{ count: number }>('/waitlist/count')
export const joinWaitlist = (v: { name: string; email: string; clinic: string; teamSize: string; website: string }) =>
  api<{ position: number; count: number; firstName: string }>('/waitlist', { method: 'POST', json: v })
export const sendContact = (v: { name: string; email: string; company: string; topic: string; message: string; website: string }) =>
  api<{ ok: true }>('/contact', { method: 'POST', json: v })
