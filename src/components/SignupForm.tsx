import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Arrow, Check } from './Icons'

const KEY = 'gapless.waitlist'
type Entry = { name: string; email: string; clinic: string; size: string; at: string }
type Errors = Partial<Record<'name' | 'email' | 'clinic' | 'size', string>>

function load(): Entry[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

// Offset so the "queue position" looks plausible for a beta waitlist.
const BASE_POSITION = 1287

function validate(v: Omit<Entry, 'at'>, all: Entry[]): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.'
  if (!v.email.trim()) e.email = 'We need an email to send your invite.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'That email doesn’t look right — check for typos.'
  else if (all.some((x) => x.email.toLowerCase() === v.email.trim().toLowerCase())) e.email = 'This email is already on the waitlist.'
  if (v.clinic.trim().length < 2) e.clinic = 'Which clinic or practice is this for?'
  if (!v.size) e.size = 'Pick the closest team size.'
  return e
}

export function SignupForm() {
  const [v, setV] = useState({ name: '', email: '', clinic: '', size: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<{ entry: Entry; position: number } | null>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (done) successRef.current?.focus()
  }, [done])

  const set = (k: keyof typeof v, val: string) => {
    const next = { ...v, [k]: val }
    setV(next)
    if (touched[k]) setErrors(validate(next, load()))
  }
  const blur = (k: string) => {
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors(validate(v, load()))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const all = load()
    const errs = validate(v, all)
    setErrors(errs)
    setTouched({ name: true, email: true, clinic: true, size: true })
    const first = Object.keys(errs)[0]
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setBusy(true)
    // Simulated network latency — nothing leaves the browser.
    window.setTimeout(() => {
      const entry: Entry = { name: v.name.trim(), email: v.email.trim(), clinic: v.clinic.trim(), size: v.size, at: new Date().toISOString() }
      const list = [...all, entry]
      localStorage.setItem(KEY, JSON.stringify(list))
      setBusy(false)
      setDone({ entry, position: BASE_POSITION + list.length })
    }, 650)
  }

  const reset = () => {
    setDone(null)
    setV({ name: '', email: '', clinic: '', size: '' })
    setTouched({})
    setErrors({})
  }

  if (done)
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="animate-pop rounded-2xl border-[1.5px] border-ink bg-white p-7 outline-none sm:p-9">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-go"><Check width={24} height={24} strokeWidth={2.5} /></span>
          <span className="font-mono text-[12px] uppercase tracking-wider text-ink-2">You’re on the list</span>
        </div>
        <p className="mt-6 text-[40px] font-bold leading-none tracking-[-0.04em] sm:text-[52px]">
          #{done.position.toLocaleString('en-US')}
        </p>
        <p className="mt-3 text-[18px] leading-snug">
          Thanks, {done.entry.name.split(' ')[0]}. We’ll email <strong className="font-semibold">{done.entry.email}</strong> when a spot opens for {done.entry.clinic}.
        </p>
        <p className="mt-6 rounded-lg bg-chalk p-3 font-mono text-[12px] leading-relaxed text-ink-2">
          Demo only: no email was sent. Your entry is stored in this browser’s localStorage (<code>{KEY}</code>) and never leaves your device.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={reset} className="btn-line h-10 px-5 text-[15px]">Add another clinic</button>
          <button
            onClick={() => {
              localStorage.removeItem(KEY)
              reset()
            }}
            className="h-10 px-2 text-[14px] text-ink-2 underline underline-offset-4 hover:text-ink"
          >
            Clear demo data
          </button>
        </div>
      </div>
    )

  const field = (k: keyof Errors) => ({
    'aria-invalid': !!(touched[k] && errors[k]),
    'aria-describedby': touched[k] && errors[k] ? `err-${k}` : undefined,
    className: `h-12 w-full rounded-lg border-[1.5px] bg-white px-3.5 text-[16px] outline-none transition-colors placeholder:text-ink-3 focus:border-ink focus:ring-4 focus:ring-go/30 ${touched[k] && errors[k] ? 'border-miss' : 'border-ink/30'}`,
  })
  const err = (k: keyof Errors) =>
    touched[k] && errors[k] ? <p id={`err-${k}`} className="mt-1.5 text-[13.5px] font-medium text-[#A8350A]">{errors[k]}</p> : null

  return (
    <form ref={formRef} noValidate onSubmit={submit} className="rounded-2xl border-[1.5px] border-ink bg-white p-6 sm:p-8" aria-label="Join the Gapless beta waitlist">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="su-name" className="mb-1.5 block text-[14px] font-semibold">Full name</label>
          <input id="su-name" name="name" autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} onBlur={() => blur('name')} placeholder="Priya Raman" {...field('name')} />
          {err('name')}
        </div>
        <div>
          <label htmlFor="su-email" className="mb-1.5 block text-[14px] font-semibold">Work email</label>
          <input id="su-email" name="email" type="email" autoComplete="email" inputMode="email" value={v.email} onChange={(e) => set('email', e.target.value)} onBlur={() => blur('email')} placeholder="you@clinic.com" {...field('email')} />
          {err('email')}
        </div>
        <div>
          <label htmlFor="su-clinic" className="mb-1.5 block text-[14px] font-semibold">Clinic name</label>
          <input id="su-clinic" name="clinic" autoComplete="organization" value={v.clinic} onChange={(e) => set('clinic', e.target.value)} onBlur={() => blur('clinic')} placeholder="Northside Physio" {...field('clinic')} />
          {err('clinic')}
        </div>
        <div>
          <label htmlFor="su-size" className="mb-1.5 block text-[14px] font-semibold">Practitioners</label>
          <select id="su-size" name="size" value={v.size} onChange={(e) => set('size', e.target.value)} onBlur={() => blur('size')} {...field('size')}>
            <option value="">Select…</option>
            <option>Just me</option>
            <option>2–8</option>
            <option>9–25</option>
            <option>26+ / several locations</option>
          </select>
          {err('size')}
        </div>
      </div>
      <button type="submit" disabled={busy} className="btn-go mt-6 h-14 w-full text-[17px] disabled:opacity-70">
        {busy ? 'Saving…' : <>Join the beta waitlist <Arrow /></>}
      </button>
      <p className="mt-3 text-center font-mono text-[11.5px] text-ink-3">Demo form · stored only in your browser · no emails sent</p>
    </form>
  )
}
