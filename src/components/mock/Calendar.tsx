import type { Phase } from '../../lib/backfill'
import { Chip, Frame } from './Frame'

type Appt = { col: number; start: number; len: number; name: string; type: string; tone?: 'a' | 'b' | 'c' }
const PRAC = ['Dr. Raman', 'J. Okafor', 'S. Lindqvist', 'T. Byrne']
const TIMES = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30']
const APPTS: Appt[] = [
  { col: 0, start: 0, len: 2, name: 'Hannah Cole', type: 'Initial assessment', tone: 'a' },
  { col: 0, start: 4, len: 1, name: 'Omar Haddad', type: 'Follow-up' },
  { col: 0, start: 5, len: 2, name: 'Grace Liu', type: 'Sports rehab', tone: 'b' },
  { col: 0, start: 8, len: 1, name: 'Ben Achebe', type: 'Follow-up' },
  { col: 1, start: 0, len: 1, name: 'Sofia Marin', type: 'Follow-up' },
  { col: 1, start: 1, len: 2, name: 'Theo Park', type: 'Dry needling', tone: 'c' },
  { col: 1, start: 5, len: 1, name: 'Ana Reyes', type: 'Follow-up' },
  { col: 1, start: 6, len: 2, name: 'Luca Moretti', type: 'Initial assessment', tone: 'a' },
  { col: 2, start: 0, len: 1, name: 'Ivy Chen', type: 'Follow-up' },
  { col: 2, start: 3, len: 2, name: 'Noah Fischer', type: 'Post-op knee', tone: 'b' },
  { col: 2, start: 7, len: 2, name: 'Zara Idris', type: 'Initial assessment', tone: 'a' },
  { col: 3, start: 1, len: 1, name: 'Eli Brooks', type: 'Follow-up' },
  { col: 3, start: 2, len: 2, name: 'Mia Novak', type: 'Pelvic health', tone: 'c' },
  { col: 3, start: 5, len: 1, name: 'Sam Oduya', type: 'Follow-up' },
  { col: 3, start: 6, len: 2, name: 'Ruth Adler', type: 'Vestibular', tone: 'b' },
  { col: 3, start: 9, len: 1, name: 'Kai Tanaka', type: 'Follow-up' },
]
const TONE = { a: 'bg-[#EDEDE6]', b: 'bg-[#F4F1E8]', c: 'bg-[#EEF0EC]' }

const ROW = 30 // px per 30 min
/** The slot that gets cancelled then backfilled in the hero loop */
const SLOT = { col: 0, start: 2, len: 2 }


export function CalendarScreen({ phase = 'filled', compact = false }: { phase?: Phase; compact?: boolean }) {
  const cols = compact ? 3 : 4
  return (
    <Frame
      active="Calendar"
      title="Tuesday, Sep 29"
      right={
        <>
          <Chip tone="go">Utilization 96%</Chip>
          <span className="hidden rounded-md border border-line px-2 py-0.5 text-[11px] sm:inline">Day · Week</span>
        </>
      }
    >
      <div className="relative overflow-hidden px-3 pb-3 pt-2">
        <div className="grid text-[10.5px]" style={{ gridTemplateColumns: `40px repeat(${cols}, minmax(0,1fr))` }}>
          <div />
          {PRAC.slice(0, cols).map((p, i) => (
            <div key={p} className="flex items-center gap-1.5 truncate px-1.5 pb-1.5 font-semibold">
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-ink text-[8px] text-paper">{p.split(' ').pop()![0]}</span>
              <span className="truncate">{p}</span>
              {i === 0 && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-go" />}
            </div>
          ))}
        </div>
        <div className="relative grid" style={{ gridTemplateColumns: `40px repeat(${cols}, minmax(0,1fr))`, height: TIMES.length * ROW }}>
          <div className="relative">
            {TIMES.map((t, i) => (
              <div key={t} className="absolute right-2 -translate-y-1/2 font-mono text-[9.5px] text-ink-3" style={{ top: i * ROW }}>{i % 2 === 0 ? t : ''}</div>
            ))}
          </div>
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="relative border-l border-line">
              {TIMES.map((_, i) => (
                <div key={i} className={`absolute inset-x-0 border-t ${i % 2 ? 'border-dashed border-line/70' : 'border-line'}`} style={{ top: i * ROW }} />
              ))}
              {APPTS.filter((a) => a.col === c).map((a) => (
                <div key={a.name} className={`absolute inset-x-1 overflow-hidden rounded-md border border-ink/15 px-1.5 py-1 ${TONE[a.tone ?? 'c']}`} style={{ top: a.start * ROW + 2, height: a.len * ROW - 4 }}>
                  <div className="truncate text-[10.5px] font-semibold leading-tight">{a.name}</div>
                  {a.len > 1 && <div className="truncate text-[9.5px] text-ink-3">{a.type}</div>}
                </div>
              ))}
              {c === SLOT.col && <Slot phase={phase} />}
            </div>
          ))}
          {/* now line */}
          <div className="pointer-events-none absolute left-[36px] right-0 flex items-center" style={{ top: 2.3 * ROW }}>
            <span className="h-2 w-2 rounded-full bg-miss" />
            <span className="h-px flex-1 bg-miss" />
          </div>
        </div>
      </div>
    </Frame>
  )
}

function Slot({ phase }: { phase: Phase }) {
  const style = { top: SLOT.start * ROW + 2, height: SLOT.len * ROW - 4 }
  if (phase === 'booked')
    return (
      <div className="absolute inset-x-1 rounded-md border border-ink/15 bg-[#EDEDE6] px-1.5 py-1" style={style}>
        <div className="truncate text-[10.5px] font-semibold leading-tight">Derek Olsen</div>
        <div className="truncate text-[9.5px] text-ink-3">Initial assessment</div>
      </div>
    )
  if (phase === 'cancelled' || phase === 'offering')
    return (
      <div className="hatch absolute inset-x-1 rounded-md border border-dashed border-miss bg-white/60 px-1.5 py-1" style={style}>
        <div className="truncate text-[10.5px] font-semibold leading-tight text-[#8A2D06] line-through">Derek Olsen</div>
        <div className="truncate font-mono text-[9px] text-[#8A2D06]">{phase === 'cancelled' ? 'Cancelled 8:58' : 'Offering to 3…'}</div>
      </div>
    )
  return (
    <div key="filled" className="absolute inset-x-1 animate-pop rounded-md border-[1.5px] border-ink bg-go px-1.5 py-1" style={style}>
      <div className="truncate text-[10.5px] font-bold leading-tight">Maya Rosen</div>
      <div className="truncate font-mono text-[9px]">Backfilled · 4 min</div>
    </div>
  )
}
