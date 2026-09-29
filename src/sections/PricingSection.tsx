import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BillingToggle, CompareTable, PlanStrip } from '../components/Pricing'
import type { Billing } from '../data/content'
import { Reveal } from '../lib/reveal'

export function PricingSection() {
  const [billing, setBilling] = useState<Billing>('monthly')
  return (
    <section id="pricing" className="border-b border-ink" aria-labelledby="pricing-title">
      <div className="wrap py-20 lg:py-32">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">Pricing</p>
            <h2 id="pricing-title" className="h2 mt-5">Priced per location, not per chair.</h2>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <p className="mb-5 max-w-sm text-[17px] leading-relaxed text-ink-2">14 days free on every plan. One refilled slot a month usually covers Solo.</p>
            <BillingToggle value={billing} onChange={setBilling} />
          </div>
        </Reveal>
        <div className="mt-14"><PlanStrip billing={billing} /></div>

        <div className="mt-20 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h3 className="text-[28px] font-bold leading-tight tracking-tight">Every feature, side by side.</h3>
            <Link to="/pricing" className="link-u mt-4 inline-block text-[16px] font-medium">Full pricing &amp; savings calculator →</Link>
          </div>
          <div className="min-w-0 lg:col-span-9"><CompareTable /></div>
        </div>
      </div>
    </section>
  )
}
