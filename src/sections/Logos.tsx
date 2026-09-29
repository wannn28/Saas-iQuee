import { LOGOS } from '../data/content'

function Mark({ kind }: { kind: string }) {
  const c = 'h-[1em] w-[1em] shrink-0'
  switch (kind) {
    case 'ring': return <svg viewBox="0 0 20 20" className={c}><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="3.5" /></svg>
    case 'wave': return <svg viewBox="0 0 24 20" className={c}><path d="M1 12c3-5 6-5 8 0s5 5 8 0 5-5 6-2" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg>
    case 'leaf': return <svg viewBox="0 0 20 20" className={c}><path d="M3 17C3 8 9 3 17 3c0 8-5 14-14 14z" fill="currentColor" /></svg>
    case 'bar': return <svg viewBox="0 0 20 20" className={c}><rect x="2" y="3" width="4" height="14" fill="currentColor" /><rect x="8" y="7" width="4" height="10" fill="currentColor" /><rect x="14" y="11" width="4" height="6" fill="currentColor" /></svg>
    case 'square': return <svg viewBox="0 0 20 20" className={c}><rect x="3" y="3" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" /><path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="2.5" /></svg>
    default: return null
  }
}

export function Logos() {
  return (
    <section className="border-b border-ink" aria-label="Clinics using Gapless (fictional)">
      <div className="wrap flex flex-col gap-6 py-9">
        <p className="font-mono text-[12.5px] leading-snug text-ink-2">Keeping 400+ independent clinics booked solid <span className="text-ink-3">(all fictional)</span></p>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between lg:gap-0">
          {LOGOS.map((l) => (
            <li key={l.name} className="flex min-w-0 items-center gap-2 text-[15px] text-ink/75 transition-colors hover:text-ink sm:text-[20px] lg:text-[19px] xl:text-[21px]">
              <Mark kind={l.mark} />
              <span className={`truncate lg:overflow-visible lg:whitespace-nowrap ${l.style}`}>{l.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
