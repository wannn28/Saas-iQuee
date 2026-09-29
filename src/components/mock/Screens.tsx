import { Check } from '../Icons'
import { Chip, Frame } from './Frame'
import { Phone } from './Phone'

export function WaitlistScreen() {
  const rows = [
    { n: 'Maya Rosen', w: 'Mornings · Dr. Raman', m: 98, s: 'Booked 9:04', tone: 'go' as const },
    { n: 'Chris Albright', w: 'Tue/Thu before 11', m: 91, s: 'Too late', tone: 'plain' as const },
    { n: 'Nadia Farouk', w: 'Any time · any PT', m: 84, s: 'Too late', tone: 'plain' as const },
    { n: 'Jonah Weiss', w: 'Afternoons', m: 41, s: 'Not a match', tone: 'plain' as const },
  ]
  return (
    <Frame active="Waitlist" title="Backfill · 9:00 with Dr. Raman" right={<Chip tone="go">Filled in 4 min</Chip>}>
      <div className="grid gap-0 md:grid-cols-[1.25fr_1fr]">
        <div className="border-b border-line p-3 md:border-b-0 md:border-r">
          <div className="mb-2 grid grid-cols-[1fr_auto_auto] gap-3 px-1 font-mono text-[9.5px] uppercase tracking-wider text-ink-3">
            <span>Patient</span><span>Match</span><span>Status</span>
          </div>
          {rows.map((r) => (
            <div key={r.n} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-line px-1 py-2">
              <div className="min-w-0">
                <div className="truncate text-[12px] font-semibold">{r.n}</div>
                <div className="truncate text-[10.5px] text-ink-3">{r.w}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-12 overflow-hidden rounded-full bg-chalk"><span className="block h-full bg-ink" style={{ width: r.m + '%' }} /></span>
                <span className="w-6 font-mono text-[10px]">{r.m}</span>
              </div>
              <Chip tone={r.tone}>{r.s}</Chip>
            </div>
          ))}
        </div>
        <ol className="relative space-y-3 p-4 text-[11.5px]">
          {[
            ['8:58', 'Derek Olsen cancels by text (reply "X")', 'miss'],
            ['8:58', 'Slot matched against 14 waitlist entries', ''],
            ['9:00', 'Offer sent to top 3 matches at once', ''],
            ['9:03', 'Maya replies "Y" — first to confirm', 'go'],
            ['9:04', 'Calendar updated, others notified', 'go'],
          ].map(([t, txt, tone], i) => (
            <li key={i} className="flex gap-3">
              <span className="w-8 shrink-0 font-mono text-[10px] text-ink-3">{t}</span>
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-ink ${tone === 'go' ? 'bg-go' : tone === 'miss' ? 'bg-miss' : 'bg-white'}`} />
              <span className="leading-snug">{txt}</span>
            </li>
          ))}
        </ol>
      </div>
    </Frame>
  )
}

export function RemindersScreen() {
  return (
    <Frame active="Messages" title="Reminder rules" right={<Chip tone="go">92% confirm</Chip>}>
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-start">
        <div className="flex-1 space-y-2.5">
          {[
            ['48 h before', 'SMS', 'Reply C to confirm, R to reschedule, X to cancel', true],
            ['24 h before', 'Email', 'Intake form link if not completed', true],
            ['2 h before', 'SMS', 'Parking + door code for first visits', true],
            ['No reply at 24 h', 'Call task', 'Added to front-desk queue', false],
          ].map(([when, ch, what, on]) => (
            <div key={when as string} className="flex items-center gap-3 rounded-lg border border-line p-2.5">
              <div className="w-[88px] shrink-0">
                <div className="text-[12px] font-bold">{when}</div>
                <div className="font-mono text-[9.5px] text-ink-3">{ch}</div>
              </div>
              <div className="min-w-0 flex-1 text-[11px] leading-snug text-ink-2">{what}</div>
              <span className={`relative h-4 w-7 shrink-0 rounded-full ${on ? 'bg-go' : 'bg-chalk ring-1 ring-line'}`}>
                <span className={`absolute top-0.5 h-3 w-3 rounded-full border border-ink/30 bg-white ${on ? 'left-3.5' : 'left-0.5'}`} />
              </span>
            </div>
          ))}
        </div>
        <Phone
          className="mx-auto hidden shrink-0 scale-[.92] md:block md:-my-3"
          messages={[
            { from: 'us', time: 'Sun 9:00 AM', text: 'Reminder: Tue 9:00 with Dr. Raman. Reply C to confirm, R to reschedule.' },
            { from: 'them', time: 'Sun 9:12 AM', text: 'C' },
            { from: 'us', time: 'Sun 9:12 AM', text: 'Confirmed ✓ Your intake form: gpl.es/f/8Kq' },
          ]}
        />
      </div>
    </Frame>
  )
}

export function IntakeScreen() {
  return (
    <Frame active="Forms" title="New patient intake" right={<Chip>3 of 4 done</Chip>}>
      <div className="grid gap-4 p-4 md:grid-cols-[1fr_170px]">
        <div className="space-y-3">
          {[
            ['Reason for visit', 'Right knee pain after running, ~3 weeks'],
            ['Pain right now (0–10)', ''],
            ['Insurance provider', 'Evergreen Mutual · ID 88-2231-04'],
          ].map(([l, v], i) => (
            <div key={l}>
              <div className="mb-1 text-[11px] font-semibold">{l}</div>
              {i === 1 ? (
                <div className="flex gap-1">
                  {Array.from({ length: 11 }).map((_, n) => (
                    <span key={n} className={`grid h-6 flex-1 place-items-center rounded border text-[10px] ${n === 4 ? 'border-ink bg-ink text-paper' : 'border-line'}`}>{n}</span>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-line bg-paper px-2.5 py-2 text-[11.5px]">{v}</div>
              )}
            </div>
          ))}
          <div>
            <div className="mb-1 text-[11px] font-semibold">Consent signature</div>
            <div className="relative h-14 rounded-md border border-dashed border-ink/40 bg-paper">
              <svg viewBox="0 0 200 50" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <path d="M14 34c10-18 18-22 20-12s-4 16 4 8 12-18 16-10-2 14 8 6 14-10 20-6 8 8 18 2 20-8 28-4" fill="none" stroke="#111210" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-2 rounded-lg bg-chalk p-3">
          <div className="font-mono text-[9.5px] uppercase tracking-wider text-ink-3">Sent before visit</div>
          {['Contact details', 'Medical history', 'Insurance', 'Consent'].map((s, i) => (
            <div key={s} className="flex items-center gap-2 text-[11.5px]">
              <span className={`grid h-4 w-4 place-items-center rounded-full ${i < 3 ? 'bg-go' : 'border border-ink/40 bg-white'}`}>{i < 3 && <Check width={10} height={10} strokeWidth={3} />}</span>
              {s}
            </div>
          ))}
          <div className="pt-2 text-[10.5px] leading-snug text-ink-2">Answers flow into the patient record — nobody retypes a clipboard.</div>
        </div>
      </div>
    </Frame>
  )
}

export function ReportsScreen() {
  const bars = [
    { n: 'Dr. Raman', b: 96, r: 11 },
    { n: 'J. Okafor', b: 91, r: 8 },
    { n: 'S. Lindqvist', b: 88, r: 12 },
    { n: 'T. Byrne', b: 94, r: 6 },
  ]
  return (
    <Frame active="Reports" title="Utilization · September" right={<Chip>Export CSV</Chip>}>
      <div className="grid grid-cols-3 border-b border-line">
        {[
          ['92.3%', 'booked hours', '+14.1 pts'],
          ['37', 'slots backfilled', 'this month'],
          ['$4,810', 'recovered revenue', 'est. at $130/visit'],
        ].map(([v, l, d]) => (
          <div key={l} className="border-r border-line p-3 last:border-r-0">
            <div className="text-[20px] font-bold tracking-tight">{v}</div>
            <div className="text-[10.5px] text-ink-2">{l}</div>
            <div className="font-mono text-[9.5px] text-go-deep">{d}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2.5 p-4">
        {bars.map((b) => (
          <div key={b.n} className="grid grid-cols-[80px_1fr_44px] items-center gap-3 text-[11px]">
            <span className="truncate font-semibold">{b.n}</span>
            <span className="flex h-5 overflow-hidden rounded bg-chalk">
              <span className="h-full bg-ink" style={{ width: b.b - b.r + '%' }} />
              <span className="h-full border-l border-white bg-go" style={{ width: b.r + '%' }} />
            </span>
            <span className="text-right font-mono text-[10px]">{b.b}%</span>
          </div>
        ))}
        <div className="flex gap-4 pt-1 font-mono text-[9.5px] text-ink-3">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 bg-ink" />Booked directly</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 bg-go" />Recovered by backfill</span>
        </div>
      </div>
    </Frame>
  )
}
