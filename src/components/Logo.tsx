export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#111210" />
      <rect x="7" y="8" width="18" height="4" rx="2" fill="#FAFAF7" />
      <rect x="7" y="14" width="18" height="4" rx="2" fill="#16A34A" />
      <rect x="7" y="20" width="11" height="4" rx="2" fill="#FAFAF7" />
    </svg>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="text-[23px] font-bold tracking-[-0.04em] leading-none">gapless</span>
    </span>
  )
}
