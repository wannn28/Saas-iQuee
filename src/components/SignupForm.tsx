import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Arrow, Check } from './Icons'
import { ApiError, getWaitlistCount, joinWaitlist } from '../lib/api'

type Fields = { name: string; email: string; clinic: string; size: string }
type Errors = Partial<Record<keyof Fields, string>>

/** value = API enum (MySQL ENUM team_size), label = what visitors see */
const SIZES = [
  { value: 'solo', label: 'Just me' },
  { value: '2-8', label: '2–8' },
  { value: '9-25', label: '9–25' },
  { value: '26+', label: '26+ / several locations' },
]

// Client-side checks mirror the server's zod schema for instant feedback; the API re-validates everything.
function validate(v: Fields): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.'
  if (!v.email.trim()) e.email = 'We need an email to send your invite.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'That email doesn’t look right — check for typos.'
  if (v.clinic.trim().length < 2) e.clinic = 'Which clinic or practice is this for?'
  if (!v.size) e.size = 'Pick the closest team size.'
  return e
}

const EMPTY: Fields = { name: '', email: '', clinic: '', size: '' }

export function SignupForm() {
  const [v, setV] = useState<Fields>(EMPTY)
  const [hp, setHp] = useState('') // honeypot
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const [done, setDone] = useState<{ name: string; email: string; clinic: string; position: number } | null>(null)
  const [count, setCount] = useState<number | null>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => { if (done) successRef.current?.focus() }, [done])
  useEffect(() => {
    let alive = true
    getWaitlistCount().then((r) => alive && setCount(r.count)).catch(() => {})
    return () => { alive = false }
  }, [])

  const set = (k: keyof Fields, val: string) => {
    const next = { ...v, [k]: val }
    setV(next)
    if (touched[k]) setErrors(validate(next))
  }
  const blur = (k: string) => {
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors(validate(v))
  }
  const focusFirst = (errs: Errors) => {
    const first = Object.keys(errs)[0]
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(v)
    setErrors(errs)
    setFormError('')
    setTouched({ name: true, email: true, clinic: true, size: true })
    if (Object.keys(errs).length) { focusFirst(errs); return }
    setBusy(true)
    try {
      const r = await joinWaitlist({ name: v.name.trim(), email: v.email.trim(), clinic: v.clinic.trim(), teamSize: v.size, website: hp })
      setCount(r.count)
      setDone({ name: v.name.trim(), email: v.email.trim(), clinic: v.clinic.trim(), position: r.position })
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) {
        const fe = err.fieldErrors
        const mapped: Errors = {}
        if (fe.name) mapped.name = fe.name[0]
        if (fe.email) mapped.email = fe.email[0]
        if (fe.clinic) mapped.clinic = fe.clinic[0]
        if (fe.teamSize) mapped.size = fe.teamSize[0]
        setErrors(mapped)
        focusFirst(mapped)
        if (!Object.keys(mapped).length) setFormError(err.message)
      } else {
        setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  const reset = () => {
    setDone(null); setV(EMPTY); setTouched({}); setErrors({}); setFormError('')
  }

  if (done)
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="animate-pop rounded-2xl border-[1.5px] border-ink bg-white p-7 outline-none sm:p-9" data-testid="signup-success">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-go"><Check width={24} height={24} strokeWidth={2.5} /></span>
          <span className="font-mono text-[12px] uppercase tracking-wider text-ink-2">You’re on the list</span>
        </div>
        <p className="mt-6 text-[40px] font-bold leading-none tracking-[-0.04em] sm:text-[52px]" data-testid="signup-position">
          #{done.position.toLocaleString('en-US')}
        </p>
        <p className="mt-3 text-[18px] leading-snug">
          Thanks, {done.name.split(' ')[0]}. We’ll email <strong className="font-semibold">{done.email}</strong> when a spot opens for {done.clinic}.
        </p>
        <p className="mt-6 rounded-lg bg-chalk p-3 font-mono text-[12px] leading-relaxed text-ink-2">
          Demo only: your signup was validated and saved by the Gapless API in a MySQL database (that’s your real queue position).
          No email is sent and the data is only used to show this demo working.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={reset} className="btn-line h-10 px-5 text-[15px]">Add another clinic</button>
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
            {SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          {err('size')}
        </div>
      </div>
      {/* Honeypot: hidden from people and assistive tech; bots that fill it are silently ignored by the API */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="su-website">Website</label>
        <input id="su-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>
      {formError && <p role="alert" className="mt-5 rounded-lg border-[1.5px] border-miss bg-[#FFF3EC] px-3.5 py-2.5 text-[14px] font-medium text-[#A8350A]">{formError}</p>}
      <button type="submit" disabled={busy} className="btn-go mt-6 h-14 w-full text-[17px] disabled:opacity-70">
        {busy ? 'Saving…' : <>Join the beta waitlist <Arrow /></>}
      </button>
      <p className="mt-3 text-center font-mono text-[11.5px] text-ink-3" data-testid="waitlist-count">
        {count !== null ? <>{count.toLocaleString('en-US')} {count === 1 ? 'clinic' : 'clinics'} on the waitlist · </> : null}Demo form · stored in a demo database · no emails sent
      </p>
    </form>
  )
}
