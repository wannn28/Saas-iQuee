import { Reveal } from '../lib/reveal'

const STEPS = [
  { n: '1', t: 'Connect your calendar', d: 'Import from your EHR, Google Calendar or a CSV. Practitioners, rooms and visit types come across in about fifteen minutes.', time: '15 min' },
  { n: '2', t: 'Switch on backfill', d: 'Choose who gets offers first (existing patients, the longest-waiting, the closest), how far ahead to offer, and the wording of the text.', time: '10 min' },
  { n: '3', t: 'Share one link', d: 'Put your booking page on your site and Google profile. Every new booking, cancellation and reply now runs through Gapless.', time: '5 min' },
]

export function How() {
  return (
    <section id="how" className="border-b border-ink" aria-labelledby="how-title">
      <div className="wrap grid gap-14 py-20 lg:grid-cols-12 lg:py-32">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">How it works</p>
            <h2 id="how-title" className="h2 mt-5">Live by lunch.</h2>
            <p className="mt-6 max-w-sm text-[18px] leading-relaxed text-ink-2">No migration project, no training day. A named human helps you set up on a 30-minute call if you want one.</p>
            <p className="mt-8 inline-flex items-baseline gap-3 border-t-[1.5px] border-ink pt-4">
              <span className="text-[44px] font-bold leading-none tracking-[-0.04em]">30 min</span>
              <span className="text-[15px] text-ink-2">median setup time</span>
            </p>
          </div>
        </div>
        <ol className="lg:col-span-8 lg:col-start-6">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={(i + 1) as 1 | 2 | 3} className="grid grid-cols-[72px_1fr] gap-5 border-t-[1.5px] border-ink py-10 sm:grid-cols-[140px_1fr] sm:gap-8 lg:py-14">
              <span className="text-[88px] font-bold leading-[0.75] tracking-[-0.06em] text-go sm:text-[150px]" style={{ WebkitTextStroke: '2px #111210' }} aria-hidden="true">{s.n}</span>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-[28px] font-bold tracking-tight sm:text-[34px]"><span className="sr-only">Step {s.n}: </span>{s.t}</h3>
                  <span className="rounded-full border border-ink/30 px-2.5 py-0.5 font-mono text-[12px]">~{s.time}</span>
                </div>
                <p className="mt-3 max-w-xl text-[17.5px] leading-relaxed text-ink-2">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
