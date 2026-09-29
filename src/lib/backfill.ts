import { useEffect, useState } from 'react'
import type { Bubble } from '../components/mock/Phone'

export type Phase = 'booked' | 'cancelled' | 'offering' | 'filled'

export function useBackfillLoop(enabled: boolean): Phase {
  const [phase, setPhase] = useState<Phase>('filled')
  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const seq: Phase[] = ['booked', 'cancelled', 'offering', 'filled']
    const dur = { booked: 1800, cancelled: 1700, offering: 2000, filled: 4200 }
    let i = 0
    let t: number
    const step = () => {
      setPhase(seq[i])
      t = window.setTimeout(step, dur[seq[i]])
      i = (i + 1) % seq.length
    }
    t = window.setTimeout(step, 1600)
    return () => clearTimeout(t)
  }, [enabled])
  return phase
}

export function heroMessages(phase: Phase): Bubble[] {
  const offer: Bubble = { from: 'us', time: '9:00 AM', text: 'Hi Maya — a 9:00 slot with Dr. Raman opened up today. Reply Y to grab it.' }
  const earlier: Bubble = { from: 'us', time: 'Yesterday', text: "You're on the waitlist for Dr. Raman (mornings). We'll text you the moment a slot opens." }
  if (phase === 'booked' || phase === 'cancelled') return [earlier]
  if (phase === 'offering') return [offer]
  return [offer, { from: 'them', time: '9:03 AM', text: 'Y!!' }, { from: 'us', time: '9:04 AM', text: "You're booked ✓ See you at 9:00. Reply R to reschedule." }]
}
