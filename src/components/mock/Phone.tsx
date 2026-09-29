export type Bubble = { from: 'us' | 'them'; text: string; time: string }

export function Phone({ messages, contact = 'Northside Physio', className = '' }: { messages: Bubble[]; contact?: string; className?: string }) {
  return (
    <div className={`w-[228px] rounded-[30px] border-[1.5px] border-ink bg-ink p-[5px] shadow-[6px_6px_0_rgba(17,18,16,.18)] ${className}`}>
      <div className="overflow-hidden rounded-[25px] bg-white">
        <div className="flex flex-col items-center border-b border-line bg-chalk pb-2 pt-3">
          <div className="mb-2 h-[5px] w-14 rounded-full bg-ink/80" />
          <div className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[11px] font-bold text-paper">NP</div>
          <div className="mt-1 text-[10.5px] font-semibold">{contact}</div>
        </div>
        <div className="flex min-h-[210px] flex-col gap-1.5 px-2.5 py-3">
          {messages.map((m, i) => (
            <div key={i + m.text} className={`max-w-[84%] animate-pop ${m.from === 'us' ? 'self-start' : 'self-end'}`}>
              <div className={`rounded-2xl px-2.5 py-1.5 text-[11px] leading-snug ${m.from === 'us' ? 'rounded-bl-md bg-chalk' : 'rounded-br-md bg-go font-semibold'}`}>{m.text}</div>
              <div className={`mt-0.5 font-mono text-[8.5px] text-ink-3 ${m.from === 'us' ? '' : 'text-right'}`}>{m.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

