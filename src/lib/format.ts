export const usd = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
export const fmtDate = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
