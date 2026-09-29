import { Faq } from '../components/Faq'
import { FAQS } from '../data/content'
import { Reveal } from '../lib/reveal'

export function FaqSection() {
  return (
    <section id="faq" className="border-b border-ink" aria-labelledby="faq-title">
      <div className="wrap grid gap-12 py-20 lg:grid-cols-12 lg:py-32">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-title" className="h2 mt-5">Fair questions.</h2>
            <p className="mt-6 max-w-xs text-[17px] leading-relaxed text-ink-2">
              Anything else? Write to <span className="font-semibold text-ink">hello@gapless.demo</span> — a person answers, usually within the hour.
            </p>
          </div>
        </Reveal>
        <div className="lg:col-span-8">
          <Faq items={FAQS} />
        </div>
      </div>
    </section>
  )
}
