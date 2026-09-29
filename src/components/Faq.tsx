import { useId, useState } from 'react'
import { Plus } from './Icons'

export function Faq({ items, defaultOpen = -1 }: { items: { q: string; a: string }[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number>(defaultOpen)
  const uid = useId()
  return (
    <div className="border-t-[1.5px] border-ink">
      {items.map((f, i) => {
        const isOpen = open === i
        return (
          <div key={f.q} className="border-b border-ink/25">
            <h3>
              <button
                id={`${uid}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-a${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left text-[20px] font-semibold tracking-tight sm:text-[23px]"
              >
                <span className="group-hover:text-go-deep">{f.q}</span>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-[1.5px] border-ink transition-transform duration-300 ${isOpen ? 'rotate-45 bg-go' : ''}`}>
                  <Plus />
                </span>
              </button>
            </h3>
            <div
              id={`${uid}-a${i}`}
              role="region"
              aria-labelledby={`${uid}-q${i}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <p className={`max-w-[62ch] pb-7 pr-12 text-[17px] leading-relaxed text-ink-2 ${isOpen ? '' : 'invisible'}`}>{f.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
