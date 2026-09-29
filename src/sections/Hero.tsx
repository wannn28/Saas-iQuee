import { Link } from 'react-router-dom'
import { Arrow } from '../components/Icons'
import { CalendarScreen } from '../components/mock/Calendar'
import { Phone } from '../components/mock/Phone'
import { heroMessages, useBackfillLoop } from '../lib/backfill'

export function Hero() {
  const phase = useBackfillLoop(true)
  const status = { booked: '8:57 — fully booked', cancelled: '8:58 — Derek cancelled by text', offering: '9:00 — offer sent to 3 waitlisted patients', filled: '9:04 — Maya booked the slot' }[phase]
  return (
    <section className="relative overflow-hidden border-b border-ink" aria-labelledby="hero-title">
      <div className="wrap pb-16 pt-10 sm:pt-14 lg:pb-24">
        <p className="eyebrow flex items-center gap-2">
          <span className="h-2 w-2 animate-blink rounded-full bg-go" /> Scheduling for physio, dental &amp; chiro clinics
        </p>
        <h1 id="hero-title" className="display mt-6 text-[54px] sm:text-[88px] lg:text-[124px] xl:text-[136px]">
          Cancelled at 8:58.
          <br />
          <span className="mark-go">Refilled</span> by 9:04.
        </h1>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4 lg:pt-4">
            <p className="max-w-md text-[20px] leading-[1.4] text-ink-2 sm:text-[22px]">
              Gapless is the clinic calendar that <strong className="font-semibold text-ink">refills its own cancellations</strong>. When a patient drops out, the slot is offered to your waitlist by text — first to reply gets it. Your front desk never picks up the phone.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/#signup" className="btn-go h-14 px-7 text-[17px]">Start 14-day free trial <Arrow /></Link>
              <Link to="/#features" className="link-u text-[16px] font-medium">See it work</Link>
            </div>
            <ul className="mt-8 space-y-1.5 font-mono text-[12.5px] text-ink-2">
              <li>— No credit card, no contract</li>
              <li>— Syncs with your EHR &amp; Google Calendar</li>
              <li>— Most clinics are live in one afternoon</li>
            </ul>
          </div>

          <div className="relative lg:col-span-8" aria-hidden="true">
            <div className="mb-3 flex items-center gap-2 font-mono text-[12px]">
              <span className={`h-2 w-2 rounded-full ${phase === 'filled' ? 'bg-go' : phase === 'booked' ? 'bg-ink/40' : 'bg-miss'}`} />
              <span className="text-ink-2">{status}</span>
            </div>
            <div className="lg:mr-[-60px] xl:mr-[-120px]">
              <div className="hidden sm:block"><CalendarScreen phase={phase} /></div>
              <div className="sm:hidden"><CalendarScreen phase={phase} compact /></div>
            </div>
            <Phone className="absolute -bottom-16 right-6 hidden md:block xl:right-0" messages={heroMessages(phase)} contact="Northside Physio" />
          </div>
        </div>
      </div>
      <p className="sr-only">Illustration: a clinic day calendar where a cancelled 9:00 appointment is automatically offered to waitlisted patients by SMS and rebooked four minutes later.</p>
    </section>
  )
}
