import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { Close, Menu } from './Icons'

const NAV = [
  { to: '/#features', label: 'Product' },
  { to: '/#how', label: 'How it works' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/changelog', label: 'Changelog' },
]

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // wait a frame so the target page has rendered
      const id = decodeURIComponent(hash.slice(1))
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname, loc.hash])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])

  return (
    <>
      <ScrollManager />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <div className="bg-ink text-paper">
        <p className="wrap py-2 text-center font-mono text-[11.5px] tracking-wide sm:text-[12px]">
          <span className="mr-2 inline-block rounded-sm bg-go px-1.5 font-medium text-ink">DEMO</span>
          Gapless is a fictional product — a portfolio landing page by{' '}
          <a href="https://iquee.tech" className="underline underline-offset-2 hover:text-go">iQuee</a>. No real signups.
        </p>
      </div>
      <header className={`sticky top-0 z-50 border-b transition-colors ${scrolled || open ? 'border-line bg-paper/95 backdrop-blur' : 'border-transparent bg-paper'}`}>
        <nav className="wrap flex h-[68px] items-center justify-between gap-6" aria-label="Main">
          <Link to="/" aria-label="Gapless home"><Logo /></Link>
          <ul className="hidden items-center gap-8 text-[15.5px] font-medium md:flex">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} className={({ isActive }) => `py-2 hover:text-go-deep ${isActive && !n.to.includes('#') ? 'underline decoration-go decoration-[3px] underline-offset-[8px]' : ''}`}>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="hidden items-center gap-5 md:flex">
            <Link to="/#signup" className="text-[15.5px] font-medium hover:text-go-deep">Sign in</Link>
            <Link to="/#signup" className="btn-ink h-10 px-5 text-[15px]">Start free trial</Link>
          </div>
          <button className="-mr-2 grid h-11 w-11 place-items-center md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
            {open ? <Close /> : <Menu />}
          </button>
        </nav>
        {open && (
          <div id="mobile-nav" className="border-t border-line md:hidden">
            <ul className="wrap flex flex-col py-3 text-[22px] font-semibold tracking-tight">
              {NAV.map((n) => (
                <li key={n.to}><Link to={n.to} className="block border-b border-line py-3">{n.label}</Link></li>
              ))}
              <li className="pt-4 pb-2"><Link to="/#signup" className="btn-go w-full">Start free trial</Link></li>
            </ul>
          </div>
        )}
      </header>
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function Footer() {
  const cols = [
    { h: 'Product', l: [['Features', '/#features'], ['Pricing', '/pricing'], ['Integrations', '/#integrations'], ['Changelog', '/changelog']] },
    { h: 'Company', l: [['Customers', '/#stories'], ['FAQ', '/#faq'], ['Join the beta', '/#signup']] },
    { h: 'Legal', l: [['Privacy', '/privacy'], ['Terms (demo)', '/privacy#terms']] },
  ]
  return (
    <footer className="border-t border-ink bg-paper">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-sm text-[17px] leading-snug text-ink-2">Scheduling for small clinics that refills its own cancellations.</p>
        </div>
        {cols.map((c) => (
          <div key={c.h} className="md:col-span-2">
            <h2 className="eyebrow">{c.h}</h2>
            <ul className="mt-4 space-y-2.5 text-[15.5px]">
              {c.l.map(([t, to]) => (<li key={t}><Link className="hover:text-go-deep" to={to}>{t}</Link></li>))}
            </ul>
          </div>
        ))}
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-line py-6 font-mono text-[12px] text-ink-3 sm:flex-row sm:justify-between">
        <p>© 2026 Gapless Health, Inc. — fictional company. All names, clinics and figures are invented.</p>
        <p>Portfolio demo designed &amp; built by <a className="underline underline-offset-2 hover:text-ink" href="https://iquee.tech">iQuee</a></p>
      </div>
    </footer>
  )
}
