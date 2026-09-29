import { INTEGRATIONS } from '../data/content'
import { Reveal } from '../lib/reveal'

export function Integrations() {
  return (
    <section id="integrations" className="border-b border-ink bg-chalk" aria-labelledby="int-title">
      <div className="wrap grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Integrations</p>
          <h2 id="int-title" className="h2 mt-5">Plays nice with what you already pay for.</h2>
          <p className="mt-6 max-w-md text-[18px] leading-relaxed text-ink-2">Two-way sync means you keep your notes, billing and payments where they are. Gapless only owns the schedule.</p>
          <pre className="mt-10 overflow-x-auto rounded-xl border-[1.5px] border-ink bg-white p-5 font-mono text-[12.5px] leading-relaxed" aria-label="Example webhook payload">
{`POST /webhooks/your-endpoint
{
  "event": "slot.backfilled",
  "practitioner": "dr-raman",
  "starts_at": "2026-09-29T09:00:00-07:00",
  "patient": "maya-rosen",
  `}<span className="bg-go-tint">{`"minutes_to_fill": 4`}</span>{`
}`}
          </pre>
        </Reveal>
        <div className="lg:col-span-7 lg:pl-6">
          <ul className="border-t-[1.5px] border-ink">
            {INTEGRATIONS.map((g, i) => (
              <Reveal as="li" key={g.cat} delay={((i % 3) + 1) as 1 | 2 | 3} className="grid gap-3 border-b border-ink/20 py-5 sm:grid-cols-[170px_1fr] sm:items-center">
                <span className="font-mono text-[12px] uppercase tracking-wider text-ink-2">{g.cat}</span>
                <span className="flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <span key={it} className="rounded-full border-[1.5px] border-ink bg-white px-4 py-1.5 text-[16px] font-semibold tracking-tight">{it}</span>
                  ))}
                </span>
              </Reveal>
            ))}
          </ul>
          <p className="mt-5 font-mono text-[11px] text-ink-3">Third-party names are shown as plain text for illustration only; this fictional product has no affiliation with them.</p>
        </div>
      </div>
    </section>
  )
}
