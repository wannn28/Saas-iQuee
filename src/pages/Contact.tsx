import { useState, type FormEvent } from 'react'
import { useTitle } from '../lib/useTitle'
import { ApiError, sendContact } from '../lib/api'
import { Check } from '../components/Icons'

const TOPICS = [
  { value: 'sales', label: 'Pricing & demo' },
  { value: 'support', label: 'Support' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Something else' },
]
const input = 'h-12 w-full rounded-lg border-[1.5px] border-ink/30 bg-white px-3.5 text-[16px] outline-none placeholder:text-ink-3 focus:border-ink focus:ring-4 focus:ring-go/30 aria-[invalid=true]:border-miss'

export default function Contact() {
  useTitle('Contact sales')
  const [v, setV] = useState({ name: '', email: '', company: '', topic: 'sales', message: '' })
  const [hp, setHp] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV((s) => ({ ...s, [k]: e.target.value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (v.name.trim().length < 2) errs.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) errs.email = 'That email doesn’t look right.'
    if (v.message.trim().length < 10) errs.message = 'Tell us a little more (10+ characters).'
    setErrors(errs); setFormError('')
    if (Object.keys(errs).length) return
    setBusy(true)
    try {
      await sendContact({ ...v, website: hp })
      setSent(true)
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) {
        setErrors(Object.fromEntries(Object.entries(err.fieldErrors).map(([k, m]) => [k, m?.[0] ?? 'Invalid'])))
      } else setFormError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally { setBusy(false) }
  }
  const msg = (k: string) => errors[k] ? <p className="mt-1.5 text-[13.5px] font-medium text-[#A8350A]" id={`c-err-${k}`}>{errors[k]}</p> : null

  return (
    <div className="wrap grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
      <header className="lg:col-span-5">
        <p className="eyebrow">Contact</p>
        <h1 className="display mt-5 text-[56px] sm:text-[80px]">Talk to <span className="mark-go">us</span>.</h1>
        <p className="mt-6 max-w-md text-[19px] leading-relaxed text-ink-2">Questions about pricing, migrating from your current calendar, or running several locations? Send a note.</p>
        <p className="mt-6 inline-block rounded-md bg-go-tint px-3 py-2 text-[14px] text-go-ink">Demo: messages are stored in the demo MySQL database; nobody replies.</p>
      </header>
      <div className="lg:col-span-6 lg:col-start-7">
        {sent ? (
          <div role="status" className="rounded-2xl border-[1.5px] border-ink bg-white p-8" data-testid="contact-success">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-go"><Check width={24} height={24} strokeWidth={2.5} /></span>
            <p className="mt-5 text-[28px] font-bold tracking-tight">Message received.</p>
            <p className="mt-2 text-[17px] text-ink-2">Thanks, {v.name.split(' ')[0]}. In a real product we’d reply within one business day.</p>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="space-y-4 rounded-2xl border-[1.5px] border-ink bg-white p-6 sm:p-8" aria-label="Contact form">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="c-name" className="mb-1.5 block text-[14px] font-semibold">Name</label><input id="c-name" name="name" autoComplete="name" className={input} value={v.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'c-err-name' : undefined} />{msg('name')}</div>
              <div><label htmlFor="c-email" className="mb-1.5 block text-[14px] font-semibold">Work email</label><input id="c-email" name="email" type="email" autoComplete="email" className={input} value={v.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'c-err-email' : undefined} />{msg('email')}</div>
              <div><label htmlFor="c-company" className="mb-1.5 block text-[14px] font-semibold">Clinic <span className="font-normal text-ink-3">(optional)</span></label><input id="c-company" name="company" autoComplete="organization" className={input} value={v.company} onChange={set('company')} /></div>
              <div><label htmlFor="c-topic" className="mb-1.5 block text-[14px] font-semibold">Topic</label><select id="c-topic" name="topic" className={input} value={v.topic} onChange={set('topic')}>{TOPICS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
            </div>
            <div><label htmlFor="c-message" className="mb-1.5 block text-[14px] font-semibold">Message</label><textarea id="c-message" name="message" rows={5} className={`${input} h-auto py-3`} value={v.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'c-err-message' : undefined} />{msg('message')}</div>
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden"><label htmlFor="c-website">Website</label><input id="c-website" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} /></div>
            {formError && <p role="alert" className="rounded-lg border-[1.5px] border-miss bg-[#FFF3EC] px-3.5 py-2.5 text-[14px] font-medium text-[#A8350A]">{formError}</p>}
            <button type="submit" disabled={busy} className="btn-ink h-12 w-full text-[16px] disabled:opacity-70">{busy ? 'Sending…' : 'Send message'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
