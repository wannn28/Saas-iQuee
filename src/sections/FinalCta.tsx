import { SignupForm } from '../components/SignupForm'

export function FinalCta() {
  return (
    <section id="signup" className="border-b border-ink bg-go" aria-labelledby="cta-title">
      <div className="wrap grid gap-12 py-20 lg:grid-cols-12 lg:items-center lg:py-28">
        <div className="lg:col-span-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink">Private beta · onboarding 20 clinics a week</p>
          <h2 id="cta-title" className="display mt-5 text-[56px] sm:text-[84px] lg:text-[104px]">Stop paying for empty chairs.</h2>
          <p className="mt-7 max-w-md text-[19px] leading-relaxed text-ink">Join the waitlist and we’ll set up your first backfill rule with you on a 30-minute call. Free for 14 days, cancel by replying X.</p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <SignupForm />
        </div>
      </div>
    </section>
  )
}
