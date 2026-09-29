import { Link } from 'react-router-dom'
import { CHANGELOG } from '../data/content'
import { fmtDate } from '../lib/format'
import { useTitle } from '../lib/useTitle'
import { Reveal } from '../lib/reveal'

const TAG = { New: 'bg-go text-ink', Improved: 'border border-ink', Fixed: 'bg-chalk text-ink-2' }

export default function Changelog() {
  useTitle('Changelog')
  return (
    <>
      <section className="border-b border-ink">
        <div className="wrap grid gap-8 pb-14 pt-14 lg:grid-cols-12 lg:items-end lg:pt-20">
          <div className="lg:col-span-8">
            <p className="eyebrow">Changelog</p>
            <h1 className="display mt-5 text-[64px] sm:text-[96px] lg:text-[120px]">What’s new.</h1>
          </div>
          <p className="max-w-sm text-[17px] leading-relaxed text-ink-2 lg:col-span-4 lg:justify-self-end">We ship every couple of weeks. Here’s what changed, in plain English. <span className="font-mono text-[12px] text-ink-3">(Fictional release notes.)</span></p>
        </div>
      </section>
      <div className="wrap py-16 lg:py-24">
        <ol className="relative">
          {CHANGELOG.map((r) => (
            <Reveal as="li" key={r.version} className="grid gap-6 border-t-[1.5px] border-ink py-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-3">
                <div className="text-[56px] font-bold leading-none tracking-[-0.05em]">v{r.version}</div>
                <time dateTime={r.date} className="mt-3 block font-mono text-[13px] text-ink-2">{fmtDate(r.date)}</time>
              </div>
              <article className="lg:col-span-7">
                <h2 className="text-[30px] font-bold leading-tight tracking-tight sm:text-[36px]">{r.title}</h2>
                <p className="mt-4 max-w-[62ch] text-[17.5px] leading-relaxed text-ink-2">{r.body}</p>
                <ul className="mt-6 space-y-3">
                  {r.items.map((it) => (
                    <li key={it.text} className="flex items-start gap-3 text-[16px]">
                      <span className={`mt-0.5 w-[74px] shrink-0 rounded-full py-0.5 text-center font-mono text-[11px] ${TAG[it.tag]}`}>{it.tag}</span>
                      <span>{it.text}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ol>
        <div className="border-t-[1.5px] border-ink pt-10">
          <p className="text-[17px] text-ink-2">Older releases are archived. Want these in your inbox? <Link to="/#signup" className="link-u font-medium text-ink">Join the waitlist</Link>.</p>
        </div>
      </div>
    </>
  )
}
