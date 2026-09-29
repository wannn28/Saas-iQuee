import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { BillingToggle, CompareTable, PlanStrip } from '../components/Pricing'
import { Faq } from '../components/Faq'
import { PLANS, type Billing } from '../data/content'
import { usd } from '../lib/format'
import { useTitle } from '../lib/useTitle'
import { Reveal } from '../lib/reveal'

const BILLING_FAQ = [
  { q: 'What counts as a location?', a: 'One physical address with its own schedule. Home visits and telehealth are included in the location they are booked from.' },
  { q: 'Can I switch between monthly and yearly?', a: 'Any time. Moving to yearly credits the unused part of your month; moving to monthly takes effect at renewal.' },
  { q: 'Do you offer discounts for non-profits or teaching clinics?', a: 'Yes — 40% off any plan for registered non-profits and university clinics. (In this demo, nothing is actually for sale.)' },
  { q: 'What happens to my data if I leave?', a: 'Export everything as CSV at any time, and we delete your account data 30 days after cancellation.' },
]

function Slider({ label, value, min, max, step = 1, onChange, fmt }: { label: string; value: number; min: number; max: number; step?: number; onChange: (n: number) => void; fmt: (n: number) => string }) {
  const id = useId()
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[15.5px] font-semibold">{label}</label>
        <output htmlFor={id} className="font-mono text-[15px] tabular-nums">{fmt(value)}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-3 w-full accent-[#111210]" />
    </div>
  )
}

function Calculator({ billing }: { billing: Billing }) {
  const [prac, setPrac] = useState(4)
  const [perDay, setPerDay] = useState(12)
  const [rate, setRate] = useState(12)
  const [value, setValue] = useState(120)
  const empty = Math.round(prac * perDay * 21 * (rate / 100))
  const recovered = Math.round(empty * 0.62)
  const revenue = recovered * value
  const plan = prac === 1 ? PLANS[0] : prac <= 8 ? PLANS[1] : PLANS[2]
  const cost = billing === 'yearly' ? plan.yearly : plan.monthly
  const roi = Math.max(0, Math.round(revenue / cost))
  return (
    <div className="grid border-[1.5px] border-ink bg-white lg:grid-cols-2">
      <div className="space-y-7 p-7 sm:p-10">
        <Slider label="Practitioners" value={prac} min={1} max={20} onChange={setPrac} fmt={(n) => String(n)} />
        <Slider label="Appointments per practitioner / day" value={perDay} min={4} max={24} onChange={setPerDay} fmt={(n) => String(n)} />
        <Slider label="Cancellation & no-show rate" value={rate} min={2} max={30} onChange={setRate} fmt={(n) => n + '%'} />
        <Slider label="Average visit value" value={value} min={40} max={300} step={5} onChange={setValue} fmt={usd} />
      </div>
      <div className="flex flex-col justify-between gap-8 border-t-[1.5px] border-ink bg-go p-7 sm:p-10 lg:border-l-[1.5px] lg:border-t-0" aria-live="polite">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-wider">Estimated recovered revenue</p>
          <p className="mt-3 text-[64px] font-bold leading-none tracking-[-0.05em] tabular-nums sm:text-[84px]">{usd(revenue)}<span className="text-[24px] tracking-tight">/mo</span></p>
        </div>
        <dl className="grid grid-cols-2 gap-5 border-t border-ink/30 pt-6 text-[15px]">
          <div><dt className="text-ink/80">Empty slots / month</dt><dd className="text-[26px] font-bold tabular-nums">{empty}</dd></div>
          <div><dt className="text-ink/80">Refilled by Gapless*</dt><dd className="text-[26px] font-bold tabular-nums">{recovered}</dd></div>
          <div><dt className="text-ink/80">Suggested plan</dt><dd className="text-[26px] font-bold">{plan.name} · {usd(cost)}</dd></div>
          <div><dt className="text-ink/80">Return on plan</dt><dd className="text-[26px] font-bold tabular-nums">{roi}×</dd></div>
        </dl>
        <p className="font-mono text-[11px] leading-relaxed">*Assumes a 62% backfill rate and 21 working days. Illustrative demo maths, not a promise.</p>
      </div>
    </div>
  )
}

export default function PricingPage() {
  useTitle('Pricing')
  const [billing, setBilling] = useState<Billing>('yearly')
  return (
    <>
      <section className="border-b border-ink">
        <div className="wrap pb-16 pt-14 lg:pb-20 lg:pt-20">
          <p className="eyebrow">Pricing</p>
          <div className="mt-5 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="display text-[56px] sm:text-[88px] lg:col-span-8 lg:text-[112px]">One refilled slot pays for the month.</h1>
            <div className="lg:col-span-4 lg:justify-self-end">
              <p className="mb-5 max-w-sm text-[17px] leading-relaxed text-ink-2">Flat price per location. Every plan starts with a 14-day trial and no card.</p>
              <BillingToggle value={billing} onChange={setBilling} />
            </div>
          </div>
          <div className="mt-14"><PlanStrip billing={billing} headingLevel={2} /></div>
        </div>
      </section>

      <section className="border-b border-ink bg-chalk" aria-labelledby="calc-title">
        <div className="wrap py-20 lg:py-28">
          <Reveal className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2 id="calc-title" className="h2 lg:col-span-7">What are empty chairs costing you?</h2>
            <p className="max-w-md text-[17px] leading-relaxed text-ink-2 lg:col-span-5 lg:justify-self-end">Drag the sliders. The plan and billing period follow what you pick above.</p>
          </Reveal>
          <Calculator billing={billing} />
        </div>
      </section>

      <section className="border-b border-ink" aria-labelledby="compare-title">
        <div className="wrap py-20 lg:py-28">
          <h2 id="compare-title" className="h2 mb-10">Compare plans.</h2>
          <CompareTable caption="Feature comparison of the Solo, Clinic and Group plans" />
        </div>
      </section>

      <section className="border-b border-ink" aria-labelledby="bfaq-title">
        <div className="wrap grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-4">
            <h2 id="bfaq-title" className="h2">Billing questions.</h2>
            <Link to="/#signup" className="btn-go mt-8">Join the beta waitlist</Link>
          </div>
          <div className="lg:col-span-8"><Faq items={BILLING_FAQ} /></div>
        </div>
      </section>
    </>
  )
}
