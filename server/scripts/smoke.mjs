// API smoke test. Usage: API_BASE=http://localhost:3005 ADMIN_USER=demo ADMIN_PASSWORD=... node scripts/smoke.mjs
const BASE = process.env.API_BASE ?? 'http://localhost:3005'
let fails = 0
const check = (name, cond, extra = '') => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${name} ${extra}`); if (!cond) fails++ }
const j = async (path, init = {}) => { const r = await fetch(BASE + path, { ...init, headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) } }); let b = null; try { b = await r.json() } catch {} return { s: r.status, b } }
const post = (path, body) => j(path, { method: 'POST', body: JSON.stringify(body) })

check('health', (await j('/api/health')).b?.db === 'up')
const before = (await j('/api/waitlist/count')).b.count
check('count', Number.isInteger(before), `(${before})`)
const email = `smoke+${Date.now()}@example.com`
const bad = await post('/api/waitlist', { name: 'X', email: 'nope', clinic: '', teamSize: 'huge' })
check('validation 400 w/ field errors', bad.s === 400 && bad.b.details.fieldErrors.email && bad.b.details.fieldErrors.teamSize)
const ok = await post('/api/waitlist', { name: 'Smoke Tester', email, clinic: 'Smoke Clinic', teamSize: '2-8' })
check('signup 201 + position', ok.s === 201 && ok.b.position === before + 1, JSON.stringify(ok.b))
const dup = await post('/api/waitlist', { name: 'Smoke Tester', email: email.toUpperCase(), clinic: 'Smoke Clinic', teamSize: '2-8' })
check('duplicate (case-insensitive) 409', dup.s === 409, JSON.stringify(dup.b))
const hp = await post('/api/waitlist', { name: 'Bot', email: `bot${Date.now()}@example.com`, clinic: 'Bots', teamSize: 'solo', website: 'http://spam' })
check('honeypot fakes success', hp.s === 201)
check('honeypot not stored', (await j('/api/waitlist/count')).b.count === before + 1)
check('contact 201', (await post('/api/contact', { name: 'Smoke', email, topic: 'sales', message: 'Hello from the smoke test' })).s === 201)
check('contact validation', (await post('/api/contact', { name: 'S', email, message: 'short' })).s === 400)
check('admin 401 without auth', (await j('/api/admin/signups')).s === 401)
check('admin 401 bad pass', (await j('/api/admin/signups', { headers: { Authorization: 'Basic ' + Buffer.from('demo:wrong').toString('base64') } })).s === 401)
if (process.env.ADMIN_PASSWORD) {
  const auth = { Authorization: 'Basic ' + Buffer.from(`${process.env.ADMIN_USER ?? 'demo'}:${process.env.ADMIN_PASSWORD}`).toString('base64') }
  const l = await j('/api/admin/signups?q=Smoke', { headers: auth })
  check('admin lists signup (masked)', l.s === 200 && l.b.items.some((x) => x.clinic === 'Smoke Clinic' && x.email.startsWith('s•')), `(total ${l.b.total})`)
  const st = await j('/api/admin/stats', { headers: auth })
  check('admin stats', st.s === 200 && st.b.total >= 1 && st.b.today >= 1, JSON.stringify(st.b))
  check('admin contacts', (await j('/api/admin/contacts', { headers: auth })).b.total >= 1)
}
console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED')
process.exit(fails ? 1 : 0)
