import { Fragment, useId } from 'react'
import { Link } from 'react-router-dom'
import { COMPARE, PLANS, type Billing, type Cell } from '../data/content'
import { usd } from '../lib/format'
import { Check, Dash } from './Icons'

function yearlySaving(p: { monthly: number; yearly: number }) {
  return (p.monthly - p.yearly) * 12
}
const maxPct = Math.round(Math.max(...PLANS.map((p) => (1 - p.yearly / p.monthly) * 100)))

export function BillingToggle({ value, onChange }: { value: Billing; onChange: (b: Billing) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div role="radiogroup" aria-label="Billing period" className="inline-flex rounded-full border-[1.5px] border-ink bg-white p-1">
        {(['monthly', 'yearly'] as const).map((b) => (
          <button
            key={b}
            role="radio"
            aria-checked={value === b}
            onClick={() => onChange(b)}
            onKeyDown={(e) => {
              if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault()
                const next = value === 'monthly' ? 'yearly' : 'monthly'
                onChange(next)
                ;(e.currentTarget.parentElement?.querySelector(`[data-b="${next}"]`) as HTMLElement | null)?.focus()
              }
            }}
            tabIndex={value === b ? 0 : -1}
            data-b={b}
            className={`h-10 rounded-full px-5 text-[15px] font-semibold capitalize transition-colors ${value === b ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}
          >
            {b}
          </button>
        ))}
      </div>
      <span className={`rounded-full px-3 py-1 font-mono text-[12px] transition-colors ${value === 'yearly' ? 'bg-go text-ink' : 'bg-go-tint text-go-ink'}`}>
        {value === 'yearly' ? `Saving up to ${maxPct}% ✓` : `Save up to ${maxPct}% yearly`}
      </span>
    </div>
  )
}

/** Plans laid out as one ruled strip, not floating cards. */
export function PlanStrip({ billing, headingLevel = 3 }: { billing: Billing; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as 'h2' | 'h3'
  return (
    <div className="grid border-[1.5px] border-ink bg-white lg:grid-cols-[1fr_1.18fr_1fr]">
      {PLANS.map((p, i) => {
        const price = billing === 'yearly' ? p.yearly : p.monthly
        return (
          <div key={p.id} className={`relative flex flex-col p-7 sm:p-9 ${i > 0 ? 'border-t-[1.5px] border-ink lg:border-l-[1.5px] lg:border-t-0' : ''} ${p.featured ? 'bg-go-tint' : ''}`}>
            {p.featured && (
              <span className="absolute -top-px left-7 -translate-y-1/2 rounded-full border-[1.5px] border-ink bg-go px-3 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider sm:left-9">
                Most clinics pick this
              </span>
            )}
            <div className="flex items-baseline justify-between gap-3">
              <H className="text-[28px] font-bold tracking-tight">{p.name}</H>
              <span className="font-mono text-[12px] text-ink-2">{p.seats}</span>
            </div>
            <p className="mt-2 min-h-[48px] text-[16px] leading-snug text-ink-2">{p.blurb}</p>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-[64px] font-bold leading-[0.85] tracking-[-0.05em] tabular-nums" aria-live="polite">{usd(price)}</span>
              <span className="pb-1 text-[14px] leading-tight text-ink-2">per location<br />/ month</span>
            </div>
            <p className="mt-3 h-5 font-mono text-[12px] text-ink-2">
              {billing === 'yearly' ? (
                <>Billed {usd(price * 12)} yearly · <span className="font-medium text-go-deep">you save {usd(yearlySaving(p))}</span></>
              ) : (
                <>or {usd(p.yearly)}/mo billed yearly</>
              )}
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 border-t border-line pt-6 text-[15.5px]">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-2.5"><Check className="mt-0.5 shrink-0 text-go-deep" />{h}</li>
              ))}
            </ul>
            <Link to="/#signup" className={`${p.featured ? 'btn-ink' : 'btn-line'} mt-8 w-full`}>{p.cta}</Link>
          </div>
        )
      })}
    </div>
  )
}

function CellView({ v }: { v: Cell }) {
  if (v === true) return <><Check className="mx-auto text-go-deep" strokeWidth={2.5} /><span className="sr-only">Included</span></>
  if (v === false) return <><Dash className="mx-auto text-ink/30" /><span className="sr-only">Not included</span></>
  return <span className="font-mono text-[13px]">{v}</span>
}

export function CompareTable({ caption = 'Compare plans in detail' }: { caption?: string }) {
  const id = useId()
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-[15px]" aria-describedby={id}>
        <caption id={id} className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b-[1.5px] border-ink">
            <th scope="col" className="w-[40%] py-4 pr-4 font-mono text-[12px] font-normal uppercase tracking-wider text-ink-2">Feature</th>
            {PLANS.map((p) => (
              <th key={p.id} scope="col" className={`w-[20%] py-4 text-center text-[18px] font-bold tracking-tight ${p.featured ? 'bg-go-tint' : ''}`}>{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE.map((g) => (
            <Fragment key={g.group}>
              <tr>
                <th colSpan={4} scope="colgroup" className="pb-2 pt-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink">{g.group}</th>
              </tr>
              {g.rows.map((r) => (
                <tr key={r.label} className="border-t border-line">
                  <th scope="row" className="py-3 pr-4 font-normal">
                    {r.label}
                    {r.note && <span className="block text-[13px] text-ink-3">{r.note}</span>}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={i} className={`py-3 text-center ${PLANS[i].featured ? 'bg-go-tint/60' : ''}`}><CellView v={v} /></td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
