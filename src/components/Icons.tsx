import type { SVGProps } from 'react'
type P = SVGProps<SVGSVGElement>
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }

export const Check = (p: P) => (<svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>)
export const Dash = (p: P) => (<svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}><path d="M7 12h10" /></svg>)
export const Arrow = (p: P) => (<svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>)
export const Plus = (p: P) => (<svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>)
export const Menu = (p: P) => (<svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}><path d="M4 7h16M4 12h16M4 17h10" /></svg>)
export const Close = (p: P) => (<svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>)
export const Bolt = (p: P) => (<svg viewBox="0 0 24 24" width="16" height="16" {...base} {...p}><path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" /></svg>)
export const Msg = (p: P) => (<svg viewBox="0 0 24 24" width="16" height="16" {...base} {...p}><path d="M4 5h16v11H9l-5 4V5z" /></svg>)
