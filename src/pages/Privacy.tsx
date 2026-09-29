import { useTitle } from '../lib/useTitle'

const SECTIONS = [
  ['This is a demo', 'Gapless is a fictional product created as a portfolio piece by iQuee. There is no company, no service and no data processing behind this website. This page is placeholder text showing where a real privacy policy would live.'],
  ['What this site stores', 'If you use the waitlist form, the details you type (name, email, clinic, team size) are saved in your own browser’s localStorage under the key “gapless.waitlist”. They are never sent to a server. You can remove them with the “Clear demo data” button or by clearing site data in your browser.'],
  ['Cookies & analytics', 'This demo sets no cookies and loads no analytics, advertising or tracking scripts. Fonts are self-hosted.'],
  ['Third parties', 'No data is shared with anyone. Product and company names mentioned on the site (for example calendar or payment providers) are used as plain text for illustration only.'],
  ['In a real product', 'A production policy would cover: the legal entity and contact details; categories of personal and health data processed; legal bases; retention periods; sub-processors and hosting regions; security measures; HIPAA/GDPR roles (e.g. business associate / processor); and how patients and clinics can exercise their rights.'],
]

export default function Privacy() {
  useTitle('Privacy (demo)')
  return (
    <div className="wrap grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
      <header className="lg:col-span-4">
        <p className="eyebrow">Legal · placeholder</p>
        <h1 className="display mt-5 text-[56px] sm:text-[80px]">Privacy.</h1>
        <p className="mt-6 font-mono text-[12.5px] text-ink-2">Last updated: September 29, 2026</p>
        <p className="mt-6 inline-block rounded-md bg-go-tint px-3 py-2 text-[14px] text-go-ink">Demo placeholder — not a real legal document.</p>
      </header>
      <div className="lg:col-span-7 lg:col-start-6">
        {SECTIONS.map(([h, p], i) => (
          <section key={h} className="border-t-[1.5px] border-ink py-8">
            <h2 className="flex gap-4 text-[26px] font-bold tracking-tight"><span className="pt-2 font-mono text-[12px] font-normal text-ink-3">0{i + 1}</span>{h}</h2>
            <p className="mt-3 pl-9 text-[17px] leading-relaxed text-ink-2">{p}</p>
          </section>
        ))}
        <section id="terms" className="border-t-[1.5px] border-ink py-8">
          <h2 className="flex gap-4 text-[26px] font-bold tracking-tight"><span className="pt-2 font-mono text-[12px] font-normal text-ink-3">0{SECTIONS.length + 1}</span>Terms</h2>
          <p className="mt-3 pl-9 text-[17px] leading-relaxed text-ink-2">Nothing on this site is for sale. Prices, plans, testimonials and statistics are invented for demonstration purposes and do not constitute an offer.</p>
        </section>
      </div>
    </div>
  )
}
