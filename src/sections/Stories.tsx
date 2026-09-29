import { TESTIMONIALS } from '../data/content'
import { Reveal } from '../lib/reveal'

function Initials({ name, big = false }: { name: string; big?: boolean }) {
  const ini = name.replace(/^Dr\.\s*/, '').split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('')
  return <span className={`grid shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-go font-bold ${big ? 'h-14 w-14 text-[18px]' : 'h-11 w-11 text-[14px]'}`} aria-hidden="true">{ini}</span>
}

export function Stories() {
  const [lead, ...rest] = TESTIMONIALS
  return (
    <section id="stories" className="border-b border-ink" aria-labelledby="stories-title">
      <div className="wrap py-20 lg:py-32">
        <p className="eyebrow">Customer stories</p>
        <h2 id="stories-title" className="sr-only">What clinics say</h2>
        <div className="mt-8 grid gap-14 lg:grid-cols-12 lg:gap-12">
          <Reveal as="figure" className="lg:col-span-7">
            <span className="block text-[140px] font-bold leading-[0.6] text-go" aria-hidden="true">“</span>
            <blockquote className="mt-2 text-[30px] font-semibold leading-[1.18] tracking-[-0.02em] sm:text-[40px]">
              {lead.quote}
            </blockquote>
            <figcaption className="mt-10 flex flex-wrap items-center gap-5">
              <Initials name={lead.name} big />
              <div>
                <div className="text-[18px] font-bold">{lead.name}</div>
                <div className="text-[15px] text-ink-2">{lead.role}</div>
              </div>
              <div className="ml-auto border-l-[1.5px] border-ink pl-5">
                <div className="text-[40px] font-bold leading-none tracking-[-0.04em]">{lead.stat}</div>
                <div className="mt-1 font-mono text-[12px] text-ink-2">{lead.statLabel}</div>
              </div>
            </figcaption>
          </Reveal>
          <div className="flex flex-col gap-10 lg:col-span-5 lg:border-l-[1.5px] lg:border-ink lg:pl-12 lg:pt-16">
            {rest.map((t, i) => (
              <Reveal as="figure" key={t.name} delay={(i + 1) as 1 | 2} className={i ? 'border-t border-ink/20 pt-10' : ''}>
                <div className="flex items-baseline gap-3">
                  <span className="text-[48px] font-bold leading-none tracking-[-0.045em]">{t.stat}</span>
                  <span className="font-mono text-[12px] text-ink-2">{t.statLabel}</span>
                </div>
                <blockquote className="mt-4 text-[20px] leading-snug tracking-tight">“{t.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Initials name={t.name} />
                  <div>
                    <div className="text-[15.5px] font-bold">{t.name}</div>
                    <div className="text-[14px] text-ink-2">{t.role}</div>
                  </div>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
        <p className="mt-14 font-mono text-[11px] text-ink-3">People and clinics are fictional; quotes were written for this demo.</p>
      </div>
    </section>
  )
}
