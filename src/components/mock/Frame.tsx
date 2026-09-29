import type { ReactNode } from 'react'
import { LogoMark } from '../Logo'

const SIDE = ['Calendar', 'Waitlist', 'Messages', 'Forms', 'Reports'] as const
export type Side = (typeof SIDE)[number]

/** Light app chrome used by every product screen mockup. Purely decorative (aria-hidden by callers). */
export function Frame({ active, title, right, children, className = '' }: { active: Side; title: string; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[14px] border border-ink bg-white text-ink shadow-[8px_8px_0_#111210] ${className}`}>
      <div className="flex h-9 items-center gap-2 border-b border-line bg-chalk px-3">
        <span className="h-2.5 w-2.5 rounded-full border border-ink/40" />
        <span className="h-2.5 w-2.5 rounded-full border border-ink/40" />
        <span className="h-2.5 w-2.5 rounded-full border border-ink/40" />
        <span className="ml-3 truncate rounded-md bg-white px-3 py-0.5 font-mono text-[10.5px] text-ink-3">app.gapless.demo/northside-physio</span>
      </div>
      <div className="flex">
        <aside className="hidden w-[132px] shrink-0 border-r border-line bg-paper p-2.5 sm:block">
          <div className="mb-3 flex items-center gap-1.5 px-1.5 pt-1">
            <LogoMark className="h-4 w-4" />
            <span className="text-[12px] font-bold tracking-tight">Northside</span>
          </div>
          {SIDE.map((s) => (
            <div key={s} className={`mb-0.5 flex items-center justify-between rounded-md px-2 py-1.5 text-[11.5px] ${s === active ? 'bg-ink font-semibold text-paper' : 'text-ink-2'}`}>
              {s}
              {s === 'Waitlist' && <span className={`rounded px-1 font-mono text-[9.5px] ${s === active ? 'bg-go text-ink' : 'bg-go-tint text-go-ink'}`}>14</span>}
              {s === 'Messages' && <span className="h-1.5 w-1.5 rounded-full bg-miss" />}
            </div>
          ))}
        </aside>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
            <div className="truncate text-[14px] font-bold tracking-tight">{title}</div>
            <div className="flex shrink-0 items-center gap-2">{right}</div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Chip({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'go' | 'miss' | 'ink' }) {
  const t = { plain: 'border border-line text-ink-2', go: 'bg-go-tint text-go-ink', miss: 'bg-[#FDE6DB] text-[#8A2D06]', ink: 'bg-ink text-paper' }[tone]
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 font-mono text-[10px] ${t}`}>{children}</span>
}
