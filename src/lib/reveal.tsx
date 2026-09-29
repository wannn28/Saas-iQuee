import { useEffect, useRef, type ElementType, type ReactNode, type HTMLAttributes } from 'react'

let io: IntersectionObserver | null = null
function observer() {
  if (!io && typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io?.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
  }
  return io
}

type Props = HTMLAttributes<HTMLElement> & { as?: ElementType; delay?: 0 | 1 | 2 | 3; children: ReactNode }

/** Fades/slides children in once when scrolled into view. Disabled by prefers-reduced-motion (see index.css). */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    const o = observer()
    if (!el || !o) return
    o.observe(el)
    return () => o.unobserve(el)
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${delay ? 'd' + delay : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
