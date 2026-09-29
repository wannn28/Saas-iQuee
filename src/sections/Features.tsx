import { useRef, useState, type KeyboardEvent } from 'react'
import { CalendarScreen } from '../components/mock/Calendar'
import { IntakeScreen, ReportsScreen, RemindersScreen, WaitlistScreen } from '../components/mock/Screens'
import { Reveal } from '../lib/reveal'

const TABS = [
  { id: 'backfill', label: 'Waitlist backfill', title: 'Cancellations refill themselves.', body: 'A freed slot is matched against your waitlist by practitioner, visit type and preferred times, then offered to the best matches at once. First "Y" wins; the calendar updates itself.', Screen: WaitlistScreen },
  { id: 'calendar', label: 'Clinic calendar', title: 'One calendar for every room.', body: 'Day and week views per practitioner, drag-to-reschedule, colour by visit type, and a live utilization number so you always know how full today is.', Screen: () => <CalendarScreen phase="filled" /> },
  { id: 'reminders', label: 'Text reminders', title: 'Reminders patients answer.', body: 'Two-way SMS at 48 h and 2 h. Patients reply C, R or X — confirm, reschedule, cancel — and every X kicks off a backfill automatically.', Screen: RemindersScreen },
  { id: 'intake', label: 'Intake forms', title: 'The clipboard, retired.', body: 'Intake, history and consent forms go out with the booking confirmation. Answers and signatures land in the patient record before they walk in.', Screen: IntakeScreen },
  { id: 'reports', label: 'Utilization reports', title: 'See the money you got back.', body: 'Booked hours per practitioner, the slots that go empty most often and exactly how much revenue backfill recovered this month.', Screen: ReportsScreen },
]

const EXTRAS = [
  ['Branded booking page', 'Your logo, your URL, embeddable on any site.'],
  ['Deposits & no-show fees', 'Card-on-file for first visits via Stripe.'],
  ['Smart overbooking', 'One extra booking on slots that historically go empty.'],
  ['Shared SMS inbox', 'Every patient reply, threaded, next to the calendar.'],
  ['Multi-location', 'Route patients to the nearest clinic with an opening.'],
  ['Open API & webhooks', 'Pipe appointments into anything.'],
]

export function Features() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent) => {
    const k = e.key
    let n = active
    if (k === 'ArrowDown' || k === 'ArrowRight') n = (active + 1) % TABS.length
    else if (k === 'ArrowUp' || k === 'ArrowLeft') n = (active - 1 + TABS.length) % TABS.length
    else if (k === 'Home') n = 0
    else if (k === 'End') n = TABS.length - 1
    else return
    e.preventDefault()
    setActive(n)
    refs.current[n]?.focus()
  }
  const T = TABS[active]

  return (
    <section id="features" className="border-b border-ink" aria-labelledby="features-title">
      <div className="wrap py-20 lg:py-32">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-8">
            <p className="eyebrow">The product</p>
            <h2 id="features-title" className="h2 mt-5">One calendar.<br />Five fewer headaches.</h2>
          </div>
          <p className="max-w-sm text-[18px] leading-relaxed text-ink-2 lg:col-span-4 lg:justify-self-end">Pick a tab — each one is a real screen from the app, built for the front desk rather than the IT department.</p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div role="tablist" aria-label="Product features" aria-orientation="vertical" className="flex min-w-0 gap-2 overflow-x-auto pb-2 lg:col-span-4 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t-[1.5px] lg:border-ink lg:pb-0" onKeyDown={onKey}>
            {TABS.map((t, i) => {
              const on = i === active
              return (
                <button
                  key={t.id}
                  ref={(el) => { refs.current[i] = el }}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={on}
                  aria-controls={`panel-${t.id}`}
                  aria-labelledby={`tabl-${t.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`group relative shrink-0 rounded-full border-[1.5px] px-4 py-2 text-left transition-colors lg:rounded-none lg:border-0 lg:border-b lg:border-ink/20 lg:px-0 lg:py-5 ${on ? 'border-ink bg-ink text-paper lg:bg-transparent lg:text-ink' : 'border-ink/25 text-ink-2 hover:text-ink'}`}
                >
                  <span className="flex items-baseline gap-4">
                    <span className={`hidden font-mono text-[12px] lg:inline ${on ? 'text-go-deep' : 'text-ink-3'}`}>0{i + 1}</span>
                    <span id={`tabl-${t.id}`} className="whitespace-nowrap text-[15px] font-semibold tracking-tight lg:text-[24px]">{t.label}</span>
                  </span>
                  {on && <span className="absolute -left-5 top-5 bottom-5 hidden w-[5px] rounded-full bg-go lg:block" />}
                  <span className={`hidden overflow-hidden pl-9 text-[16px] leading-relaxed text-ink-2 transition-all lg:grid ${on ? 'mt-2 grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <span className="min-h-0">{t.body}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="min-w-0 lg:col-span-8">
            <div id={`panel-${T.id}`} role="tabpanel" aria-labelledby={`tab-${T.id}`} tabIndex={0} className="rounded-2xl bg-chalk p-4 sm:p-8 lg:p-10">
              <div className="mb-6 lg:hidden">
                <h3 className="text-[26px] font-bold tracking-tight">{T.title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{T.body}</p>
              </div>
              <h3 className="mb-6 hidden text-[30px] font-bold tracking-tight lg:block">{T.title}</h3>
              <div key={T.id} className="animate-pop" aria-hidden="true">
                <T.Screen />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h3 className="text-[32px] font-bold leading-tight tracking-tight">Also in the box</h3>
            <p className="mt-3 text-[16px] text-ink-2">The boring-but-essential stuff, included on every plan where it makes sense.</p>
          </Reveal>
          <dl className="grid sm:grid-cols-2 lg:col-span-8">
            {EXTRAS.map(([t, d], i) => (
              <Reveal key={t} delay={((i % 2) + 1) as 1 | 2} className="border-t border-ink/20 py-5 sm:pr-8">
                <dt className="flex items-center gap-3 text-[19px] font-semibold tracking-tight"><span className="font-mono text-[12px] font-normal text-go-deep">+</span>{t}</dt>
                <dd className="mt-1 pl-6 text-[15.5px] text-ink-2">{d}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
