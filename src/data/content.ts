export type Billing = 'monthly' | 'yearly'

export interface Plan {
  id: 'solo' | 'clinic' | 'group'
  name: string
  blurb: string
  monthly: number
  /** per-month price when billed yearly */
  yearly: number
  seats: string
  highlights: string[]
  cta: string
  featured?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'solo',
    name: 'Solo',
    blurb: 'One practitioner, one room, zero admin staff.',
    monthly: 24,
    yearly: 19,
    seats: '1 practitioner',
    highlights: ['Online booking page', 'SMS + email reminders (300/mo)', 'Waitlist backfill', 'Intake forms'],
    cta: 'Start free trial',
  },
  {
    id: 'clinic',
    name: 'Clinic',
    blurb: 'For the front desk that answers the phone all day.',
    monthly: 69,
    yearly: 55,
    seats: 'Up to 8 practitioners',
    highlights: ['Everything in Solo', 'Unlimited reminders', 'Deposits & no-show fees', 'Utilization reports', 'Two-way SMS inbox'],
    cta: 'Start free trial',
    featured: true,
  },
  {
    id: 'group',
    name: 'Group',
    blurb: 'Several locations, shared patients, one calendar.',
    monthly: 149,
    yearly: 119,
    seats: 'Unlimited practitioners',
    highlights: ['Everything in Clinic', 'Multi-location routing', 'SSO & audit log', 'Dedicated onboarding'],
    cta: 'Talk to sales',
  },
]

export type Cell = boolean | string
export interface CompareGroup {
  group: string
  rows: { label: string; values: [Cell, Cell, Cell]; note?: string }[]
}

export const COMPARE: CompareGroup[] = [
  {
    group: 'Booking',
    rows: [
      { label: 'Practitioners', values: ['1', 'Up to 8', 'Unlimited'] },
      { label: 'Branded booking page', values: [true, true, true] },
      { label: 'Embeddable booking widget', values: [true, true, true] },
      { label: 'Multi-location routing', values: [false, false, true] },
      { label: 'Recurring appointment series', values: [false, true, true] },
    ],
  },
  {
    group: 'Filling gaps',
    rows: [
      { label: 'Waitlist backfill', values: [true, true, true], note: 'Offers freed slots to matching patients, first to confirm wins.' },
      { label: 'Backfill offers per day', values: ['10', 'Unlimited', 'Unlimited'] },
      { label: 'Smart overbooking for high-risk slots', values: [false, true, true] },
      { label: 'Deposits & no-show fees (Stripe)', values: [false, true, true] },
    ],
  },
  {
    group: 'Patient messaging',
    rows: [
      { label: 'SMS + email reminders', values: ['300 / mo', 'Unlimited', 'Unlimited'] },
      { label: 'Confirm / reschedule by reply', values: [true, true, true] },
      { label: 'Two-way SMS inbox', values: [false, true, true] },
      { label: 'Custom sender name', values: [false, true, true] },
    ],
  },
  {
    group: 'Admin & security',
    rows: [
      { label: 'Intake & consent forms', values: ['3 forms', 'Unlimited', 'Unlimited'] },
      { label: 'Utilization reports', values: [false, true, true] },
      { label: 'Role-based permissions', values: [false, true, true] },
      { label: 'SSO (Google, Microsoft)', values: [false, false, true] },
      { label: 'Audit log & data export', values: [false, false, true] },
      { label: 'Support', values: ['Email', 'Email + chat', 'Named manager'] },
    ],
  },
]

export const LOGOS = [
  { name: 'Northside Physio', style: 'font-extrabold tracking-tight', mark: 'ring' },
  { name: 'HARBOR DENTAL', style: 'font-semibold tracking-[0.22em] text-[0.8em]', mark: 'wave' },
  { name: 'kin&bone', style: 'font-light italic lowercase text-[1.15em]', mark: 'none' },
  { name: 'Oakline Pediatrics', style: 'font-medium', mark: 'leaf' },
  { name: 'FERNWOOD', style: 'font-black tracking-tight', mark: 'bar' },
  { name: 'Pier 9 Sports Med', style: 'font-mono text-[0.8em] uppercase', mark: 'square' },
] as const

export const TESTIMONIALS = [
  {
    quote:
      'We used to lose three or four slots every Monday to people who "forgot". Now the cancellation text goes out, somebody on the waitlist grabs it, and I find out when I look at the schedule. It just refills.',
    name: 'Dr. Priya Raman',
    role: 'Owner, Northside Physio · 6 practitioners',
    stat: '31 → 6',
    statLabel: 'empty slots per month',
  },
  {
    quote: 'Our front desk stopped doing the Friday phone-tree. That alone paid for it in the first week.',
    name: 'Marcus Oyelaran',
    role: 'Practice manager, Harbor Dental',
    stat: '9 hrs',
    statLabel: 'saved weekly',
  },
  {
    quote: 'Patients actually reply to the reminders. "C" to confirm is the most genius dumb feature ever.',
    name: 'Leah Tomasz, DC',
    role: 'kin&bone chiropractic',
    stat: '92%',
    statLabel: 'confirm rate',
  },
]

export const FAQS = [
  {
    q: 'How does waitlist backfill actually work?',
    a: 'When a patient cancels or reschedules, Gapless looks at your waitlist for people who want that practitioner, that appointment type and that time window. It texts the top matches at once; the first person to reply "Y" gets the slot and the calendar updates itself. Everyone else gets a polite "already taken" message.',
  },
  {
    q: 'Can I keep my existing practice-management / EHR system?',
    a: 'Yes. Gapless sits on top of your existing system and syncs appointments both ways with the integrations listed above. Clinical notes stay where they are; we only handle the schedule, reminders and intake forms.',
  },
  {
    q: 'Is patient data stored securely?',
    a: 'In the real product this would be the place to describe encryption, hosting region and compliance (HIPAA, GDPR, etc.). This is a portfolio demo — no data is collected, and nothing you type on this site leaves your browser.',
  },
  {
    q: 'What happens after the 14-day trial?',
    a: 'You pick a plan or your account quietly pauses. No card is needed to start, and we never auto-charge a trial.',
  },
  {
    q: 'Do SMS messages cost extra?',
    a: 'Solo includes 300 reminder messages a month; Clinic and Group include unlimited reminders to US and Canadian numbers. International SMS is billed at cost.',
  },
  {
    q: 'Can patients book without creating an account?',
    a: 'Yes. Patients book with a name, phone number and email. Returning patients are recognised by phone number, so there are no passwords to forget.',
  },
]

export const INTEGRATIONS = [
  { cat: 'Calendars', items: ['Google Calendar', 'Microsoft 365', 'Apple iCloud'] },
  { cat: 'Payments', items: ['Stripe', 'Square'] },
  { cat: 'Practice systems', items: ['Charta EHR', 'PracticeBase', 'Clinicore'] },
  { cat: 'Messaging', items: ['Twilio SMS', 'WhatsApp Business'] },
  { cat: 'Video visits', items: ['Zoom', 'Google Meet'] },
  { cat: 'Automation', items: ['Zapier', 'Webhooks', 'REST API'] },
]

export interface Release {
  version: string
  date: string
  title: string
  body: string
  items: { tag: 'New' | 'Improved' | 'Fixed'; text: string }[]
}

export const CHANGELOG: Release[] = [
  {
    version: '3.8',
    date: '2026-09-22',
    title: 'Smart overbooking for high-risk slots',
    body: 'Gapless now scores every booking for no-show risk (lead time, history, time of day) and can suggest a single overbook on slots that historically go empty.',
    items: [
      { tag: 'New', text: 'No-show risk badge on appointments (Clinic & Group).' },
      { tag: 'New', text: 'Overbooking suggestions with one-click accept.' },
      { tag: 'Improved', text: 'Week view renders 40% faster with 10+ practitioners.' },
    ],
  },
  {
    version: '3.7',
    date: '2026-08-28',
    title: 'Two-way SMS inbox',
    body: 'Replies that are not "C", "R" or "Y" used to land in email. They now arrive in a shared inbox next to the calendar, threaded by patient.',
    items: [
      { tag: 'New', text: 'Shared SMS inbox with assignment and read receipts.' },
      { tag: 'Improved', text: 'Reminder templates support {{practitioner_first_name}}.' },
      { tag: 'Fixed', text: 'Daylight-saving shift no longer duplicates 1 AM reminders.' },
    ],
  },
  {
    version: '3.6',
    date: '2026-07-30',
    title: 'Deposits for new patients',
    body: 'Require a card on file — or a refundable deposit — only for first-time patients or for appointment types you choose.',
    items: [
      { tag: 'New', text: 'Per-appointment-type deposit rules (Stripe).' },
      { tag: 'Improved', text: 'Booking page loads in under 1 s on 3G.' },
    ],
  },
  {
    version: '3.5',
    date: '2026-06-18',
    title: 'Backfill windows',
    body: 'Waitlist patients can now say "any Tuesday afternoon" instead of picking exact dates, which roughly doubled the fill rate in beta clinics.',
    items: [
      { tag: 'New', text: 'Recurring availability windows on waitlist entries.' },
      { tag: 'Fixed', text: 'Intake form uploads over 8 MB now resume after a dropped connection.' },
    ],
  },
  {
    version: '3.4',
    date: '2026-05-06',
    title: 'Utilization report, rebuilt',
    body: 'See booked vs. available hours per practitioner, the slots that go empty most often and how much backfill recovered.',
    items: [
      { tag: 'New', text: 'Recovered-revenue estimate on the weekly digest.' },
      { tag: 'Improved', text: 'CSV export includes appointment type and source.' },
    ],
  },
]
