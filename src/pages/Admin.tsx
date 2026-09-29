import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useTitle } from '../lib/useTitle'
import { api, ApiError } from '../lib/api'

/* Demo admin: lists waitlist signups + contact messages from MySQL via /api/admin/* (HTTP Basic auth). */
const DEMO_USER = 'demo'
const DEMO_PASS = 'gapless-admin-demo'
const KEY = 'gapless.admin.basic'
const SIZE_LABEL: Record<string, string> = { solo: 'Just me', '2-8': '2–8', '9-25': '9–25', '26+': '26+' }

interface Stats { total: number; today: number; last7Days: number; contacts: number; byTeamSize: Record<string, number>; byDay: { day: string; count: number }[] }
interface Signup { id: number; name: string; email: string; clinic: string; teamSize: string; source: string; createdAt: string }
interface Contact { id: number; name: string; email: string; company: string | null; topic: string; message: string; createdAt: string }

const fmt = (iso: string) => new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

export default function Admin() {
  useTitle('Admin')
  useEffect(() => {
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex'
    document.head.appendChild(m)
    return () => { m.remove() }
  }, [])
  const [auth, setAuth] = useState<string | null>(() => sessionStorage.getItem(KEY))
  const [u, setU] = useState(''); const [p, setP] = useState('')
  const [loginErr, setLoginErr] = useState(''); const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState<'signups' | 'contacts'>('signups')
  const [stats, setStats] = useState<Stats | null>(null)
  const [rows, setRows] = useState<Signup[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [err, setErr] = useState('')
  const pageSize = 20

  const logout = useCallback(() => { sessionStorage.removeItem(KEY); setAuth(null); setStats(null) }, [])
  const load = useCallback(async () => {
    if (!auth) return
    const headers = { Authorization: `Basic ${auth}` }
    try {
      setErr('')
      const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize), ...(q.trim() ? { q: q.trim() } : {}) })
      const [st, list] = await Promise.all([
        api<Stats>('/admin/stats', { headers }),
        tab === 'signups' ? api<{ items: Signup[]; total: number }>(`/admin/signups?${qs}`, { headers }) : api<{ items: Contact[]; total: number }>(`/admin/contacts?page=${page}&pageSize=${pageSize}`, { headers }),
      ])
      setStats(st); setTotal(list.total)
      if (tab === 'signups') setRows(list.items as Signup[]); else setContacts(list.items as Contact[])
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) { logout(); return }
      setErr(e instanceof Error ? e.message : 'Failed to load')
    }
  }, [auth, page, q, tab, logout])
  useEffect(() => { const t = setTimeout(load, q ? 250 : 0); return () => clearTimeout(t) }, [load, q])

  const login = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true); setLoginErr('')
    const token = btoa(`${u}:${p}`)
    try {
      await api('/admin/me', { headers: { Authorization: `Basic ${token}` } })
      sessionStorage.setItem(KEY, token); setAuth(token)
    } catch (e) { setLoginErr(e instanceof Error ? e.message : 'Login failed') } finally { setBusy(false) }
  }

  const input = 'h-12 w-full rounded-lg border-[1.5px] border-ink/30 bg-white px-3.5 text-[16px] outline-none focus:border-ink focus:ring-4 focus:ring-go/30'

  if (!auth)
    return (
      <div className="wrap max-w-md py-20">
        <p className="eyebrow">Back office · demo</p>
        <h1 className="display mt-5 text-[56px]">Admin.</h1>
        <p className="mt-4 text-[17px] text-ink-2">Waitlist signups and contact messages are stored in MySQL. Sign in to see them.</p>
        <p className="mt-6 rounded-lg bg-go-tint px-3.5 py-2.5 font-mono text-[13px] text-go-ink" data-testid="demo-creds">
          Demo login: <strong>{DEMO_USER}</strong> / <strong>{DEMO_PASS}</strong>{' '}
          <button type="button" className="underline underline-offset-2" onClick={() => { setU(DEMO_USER); setP(DEMO_PASS) }}>Fill in</button>
        </p>
        <form onSubmit={login} className="mt-6 space-y-4" aria-label="Admin sign in">
          <div><label htmlFor="a-u" className="mb-1.5 block text-[14px] font-semibold">Username</label><input id="a-u" className={input} autoComplete="username" value={u} onChange={(e) => setU(e.target.value)} required /></div>
          <div><label htmlFor="a-p" className="mb-1.5 block text-[14px] font-semibold">Password</label><input id="a-p" type="password" className={input} autoComplete="current-password" value={p} onChange={(e) => setP(e.target.value)} required /></div>
          {loginErr && <p role="alert" className="text-[14px] font-medium text-[#A8350A]">{loginErr}</p>}
          <button className="btn-ink h-12 w-full" disabled={busy} data-testid="admin-login">{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    )

  const pages = Math.max(1, Math.ceil(total / pageSize))
  const maxSize = stats ? Math.max(1, ...Object.values(stats.byTeamSize)) : 1

  return (
    <div className="wrap py-12" data-testid="admin-dashboard">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-[1.5px] border-ink pb-6">
        <div>
          <p className="eyebrow">Back office · demo</p>
          <h1 className="mt-3 text-[44px] font-bold tracking-[-0.03em]">Waitlist</h1>
          <p className="mt-1 text-[15px] text-ink-2">Live from MySQL 8 via the Gapless API. Emails are masked because this demo login is public.</p>
        </div>
        <div className="flex items-center gap-4 text-[15px]">
          <button onClick={load} className="underline underline-offset-4">Refresh</button>
          <button onClick={logout} className="btn-line h-10 px-5">Sign out</button>
        </div>
      </div>

      {stats && (
        <div className="mt-8 grid gap-4 md:grid-cols-12" data-testid="admin-stats">
          <dl className="grid grid-cols-2 gap-4 md:col-span-7">
            {[['Signups', stats.total], ['Today', stats.today], ['Last 7 days', stats.last7Days], ['Messages', stats.contacts]].map(([k, n]) => (
              <div key={k} className="rounded-xl border-[1.5px] border-ink bg-white p-4"><dt className="font-mono text-[11.5px] uppercase tracking-wider text-ink-3">{k}</dt><dd className="mt-2 text-[34px] font-bold leading-none tracking-tight">{Number(n).toLocaleString('en-US')}</dd></div>
            ))}
          </dl>
          <div className="rounded-xl border-[1.5px] border-ink bg-white p-4 md:col-span-5">
            <p className="font-mono text-[11.5px] uppercase tracking-wider text-ink-3">By team size</p>
            <ul className="mt-3 space-y-2">
              {Object.keys(SIZE_LABEL).map((s) => (
                <li key={s} className="flex items-center gap-3 text-[14px]">
                  <span className="w-16 shrink-0">{SIZE_LABEL[s]}</span>
                  <span className="h-3 rounded-sm bg-go" style={{ width: `${((stats.byTeamSize[s] ?? 0) / maxSize) * 70}%`, minWidth: 2 }} />
                  <span className="font-mono text-[12px] text-ink-2">{stats.byTeamSize[s] ?? 0}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2" role="tablist" aria-label="Data">
          {(['signups', 'contacts'] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => { setTab(t); setPage(1) }} className={`h-10 rounded-full border-[1.5px] px-5 text-[15px] font-medium ${tab === t ? 'border-ink bg-ink text-paper' : 'border-ink/30 hover:border-ink'}`}>
              {t === 'signups' ? 'Signups' : 'Contact messages'}
            </button>
          ))}
        </div>
        {tab === 'signups' && <input type="search" placeholder="Search name, email, clinic" aria-label="Search signups" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} className={`${input} h-10 w-72`} />}
      </div>

      {err && <p role="alert" className="mt-6 rounded-lg border-[1.5px] border-miss bg-[#FFF3EC] px-3.5 py-2.5 text-[14px]">{err}</p>}

      <div className="mt-5 overflow-x-auto rounded-xl border-[1.5px] border-ink bg-white">
        {tab === 'signups' ? (
          <table className="w-full min-w-[720px] text-left text-[14.5px]" data-testid="signups-table">
            <thead className="border-b border-line font-mono text-[11.5px] uppercase tracking-wider text-ink-3">
              <tr><th className="px-4 py-3 font-medium">#</th><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Clinic</th><th className="px-4 py-3 font-medium">Team</th><th className="px-4 py-3 font-medium">Source</th><th className="px-4 py-3 font-medium">Joined (local)</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-[12px] text-ink-3">{r.id}</td><td className="px-4 py-3 font-medium">{r.name}</td><td className="px-4 py-3 font-mono text-[13px]">{r.email}</td>
                  <td className="px-4 py-3">{r.clinic}</td><td className="px-4 py-3">{SIZE_LABEL[r.teamSize] ?? r.teamSize}</td>
                  <td className="px-4 py-3"><span className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${r.source === 'seed' ? 'bg-chalk text-ink-2' : 'bg-go-tint text-go-ink'}`}>{r.source}</span></td>
                  <td className="px-4 py-3 font-mono text-[12.5px] text-ink-2">{fmt(r.createdAt)}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-ink-2">No signups{q ? ' match that search' : ' yet'}.</td></tr>}
            </tbody>
          </table>
        ) : (
          <ul className="divide-y divide-line" data-testid="contacts-list">
            {contacts.map((c) => (
              <li key={c.id} className="px-5 py-4">
                <p className="flex flex-wrap gap-x-3 text-[14.5px]"><strong>{c.name}</strong><span className="font-mono text-[13px] text-ink-2">{c.email}</span>{c.company && <span className="text-ink-2">· {c.company}</span>}<span className="rounded bg-chalk px-1.5 font-mono text-[11px] leading-5">{c.topic}</span><span className="ml-auto font-mono text-[12px] text-ink-3">{fmt(c.createdAt)}</span></p>
                <p className="mt-1.5 text-[15px] text-ink-2">{c.message}</p>
              </li>
            ))}
            {!contacts.length && <li className="px-4 py-10 text-center text-ink-2">No messages yet.</li>}
          </ul>
        )}
      </div>
      <div className="mt-5 flex items-center justify-between text-[14px]">
        <span className="font-mono text-ink-2">{total} total · page {page} / {pages}</span>
        <div className="flex gap-2">
          <button className="btn-line h-9 px-4 disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((x) => x - 1)}>Previous</button>
          <button className="btn-line h-9 px-4 disabled:opacity-40" disabled={page >= pages} onClick={() => setPage((x) => x + 1)}>Next</button>
        </div>
      </div>
    </div>
  )
}
