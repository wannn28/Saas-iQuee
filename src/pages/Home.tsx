import { Hero } from '../sections/Hero'
import { Logos } from '../sections/Logos'
import { Problem } from '../sections/Problem'
import { Features } from '../sections/Features'
import { How } from '../sections/How'
import { Integrations } from '../sections/Integrations'
import { PricingSection } from '../sections/PricingSection'
import { Stories } from '../sections/Stories'
import { FaqSection } from '../sections/FaqSection'
import { FinalCta } from '../sections/FinalCta'
import { useTitle } from '../lib/useTitle'

export default function Home() {
  useTitle('')
  return (
    <>
      <Hero />
      <Logos />
      <Problem />
      <Features />
      <How />
      <Integrations />
      <PricingSection />
      <Stories />
      <FaqSection />
      <FinalCta />
    </>
  )
}
