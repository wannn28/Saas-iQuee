import { Reveal } from '../lib/reveal'

type Block = { s: number; e: number; kind: 'appt' | 'gap' | 'fill' }
// hours from 8:00 (0) to 18:00 (10)
const BEFORE: Block[] = [
  { s: 0, e: 1, kind: 'appt' }, { s: 1, e: 1.5, kind: 'gap' }, { s: 1.5, e: 3, kind: 'appt' }, { s: 3, e: 4, kind: 'gap' },
  { s: 4, e: 5, kind: 'appt' }, { s: 6, e: 7.5, kind: 'appt' }, { s: 7.5, e: 8.5, kind: 'gap' }, { s: 8.5, e: 9.5, kind: 'appt' }, { s: 9.5, e: 10, kind: 'gap' },
]
const AFTER: Block[] = BEFORE.map((b) => (b.kind === 'gap' ? { ...b, kind: 'fill' } : b))

function Ribbon({ blocks, label, note }: { blocks: Block[]; label: string; note: string }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <span className="text-[17px] font-semibold tracking-tight">{label}</span>
        <span className="font-mono text-[12px] text-ink-2">{note}</span>
      </div>
      <div className="relative h-14 rounded-md border-[1.5px] border-ink bg-white">
        {blocks.map((b, i) => (
          <div
            key={i}
            className={`absolute inset-y-1.5 rounded-[5px] ${b.kind === 'appt' ? 'bg-ink' : b.kind === 'gap' ? 'hatch border border-dashed border-miss' : 'bg-go'}`}
            style={{ left: `calc(${(b.s / 10) * 100}% + 3px)`, width: `calc(${((b.e - b.s) / 10) * 100}% - 6px)` }}
          />
        ))}
      </div>
    </div>
  )
}

export function Problem() {
  return (
    <section className="border-b border-ink" aria-labelledby="problem-title">
      <div className="wrap grid gap-14 py-20 lg:grid-cols-12 lg:py-32">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">The leak</p>
          <h2 id="problem-title" className="h2 mt-5">Every clinic loses a day a week to empty chairs.</h2>
          <p className="mt-7 max-w-md text-[19px] leading-relaxed text-ink-2">
            Late cancellations and no-shows run 12–20% in most outpatient practices. The slots are gone before anyone can phone round the list — so you pay the practitioner, the rent and the lights for nothing.
          </p>
        </Reveal>

        <div className="lg:col-span-7 lg:pl-8">
          <Reveal delay={1} className="space-y-8 rounded-2xl bg-chalk p-6 sm:p-9">
            <div className="flex justify-between font-mono text-[11px] text-ink-3">
              {['8 AM', '10', '12 PM', '2', '4', '6 PM'].map((t) => <span key={t}>{t}</span>)}
            </div>
            <Ribbon blocks={BEFORE} label="A Tuesday, before" note="4 gaps · 3.5 h unbilled" />
            <Ribbon blocks={AFTER} label="Same Tuesday, with Gapless" note="4 slots backfilled by text" />
            <div className="flex flex-wrap gap-5 border-t border-ink/15 pt-5 font-mono text-[11.5px] text-ink-2">
              <span className="flex items-center gap-2"><span className="h-3 w-5 rounded-sm bg-ink" />Booked</span>
              <span className="flex items-center gap-2"><span className="hatch h-3 w-5 rounded-sm border border-dashed border-miss" />Cancelled / no-show</span>
              <span className="flex items-center gap-2"><span className="h-3 w-5 rounded-sm bg-go" />Refilled from waitlist</span>
            </div>
          </Reveal>

          <dl className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-0">
            {[
              ['1 in 7', 'appointments end as an empty slot without reminders'],
              ['$130', 'average revenue lost per empty physio slot'],
              ['4 min', 'median time for Gapless to refill a cancellation'],
            ].map(([n, l], i) => (
              <Reveal key={n} delay={(i + 1) as 1 | 2 | 3} className={`sm:px-6 ${i ? 'sm:border-l sm:border-ink/20' : 'sm:pl-0'}`}>
                <dt className="text-[52px] font-bold leading-none tracking-[-0.045em]">{n}</dt>
                <dd className="mt-3 text-[15.5px] leading-snug text-ink-2">{l}</dd>
              </Reveal>
            ))}
          </dl>
          <p className="mt-6 font-mono text-[11px] text-ink-3">Figures are illustrative for this demo.</p>
        </div>
      </div>
    </section>
  )
}
