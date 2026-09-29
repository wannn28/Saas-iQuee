import { useEffect } from 'react'
export function useTitle(t: string) {
  useEffect(() => {
    document.title = t ? `${t} · Gapless` : 'Gapless — Clinic scheduling that refills cancellations (demo)'
  }, [t])
}
