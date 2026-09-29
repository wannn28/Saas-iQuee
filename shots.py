import sys
from playwright.sync_api import sync_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4175'
OUT = '/workspace/demo-saas/'

def settle(pg, ms=600):
    pg.evaluate('document.fonts.ready.then(()=>1)'); pg.wait_for_timeout(ms)

def reveal_all(pg):
    # scroll through the page so every scroll-reveal fires, then back to top
    h = pg.evaluate('document.body.scrollHeight')
    y = 0
    while y < h:
        pg.evaluate(f'window.scrollTo(0,{y})'); pg.wait_for_timeout(90); y += 500
        h = pg.evaluate('document.body.scrollHeight')
    pg.wait_for_timeout(800); pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(300)

def at(pg, sel, offset=90):
    pg.evaluate(f"window.scrollTo(0, document.querySelector('{sel}').getBoundingClientRect().top + window.scrollY - {offset})"); pg.wait_for_timeout(700)

with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    ctx = br.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1, reduced_motion='no-preference')
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    pg.goto(BASE + '/'); settle(pg)
    # wait for the hero loop to land on the "filled" state
    pg.wait_for_selector('text=Offering to 3', timeout=15000); pg.wait_for_selector('text=Backfilled · 4 min', timeout=15000); pg.wait_for_timeout(1500)
    pg.screenshot(path=OUT + 'shot-hero.png')
    reveal_all(pg)
    pg.screenshot(path=OUT + 'shot-home.png', full_page=True)
    # features tabs: select "Text reminders"
    pg.get_by_role('tab', name='Text reminders').click(); at(pg, '#features', 20)
    pg.screenshot(path=OUT + 'shot-features.png')
    pg.get_by_role('tab', name='Waitlist backfill').click(); pg.wait_for_timeout(500)
    pg.screenshot(path=OUT + 'shot-features-backfill.png')
    # pricing yearly
    at(pg, '#pricing', 20); pg.locator('#pricing').get_by_role('radio', name='yearly').click(); pg.wait_for_timeout(400)
    pg.screenshot(path=OUT + 'shot-pricing-yearly.png')
    # FAQ open
    at(pg, '#faq', 20); pg.locator('#faq button[aria-expanded]').nth(1).click(); pg.wait_for_timeout(500)
    pg.screenshot(path=OUT + 'shot-faq.png')
    # signup: invalid first, then success
    at(pg, '#signup', 20)
    pg.click('button:has-text("Join the beta waitlist")'); pg.wait_for_timeout(300)
    pg.screenshot(path=OUT + 'shot-signup-errors.png')
    pg.fill('#su-name', 'Priya Raman'); pg.fill('#su-email', 'priya@northsidephysio.com'); pg.fill('#su-clinic', 'Northside Physio'); pg.select_option('#su-size', '2–8')
    pg.click('button:has-text("Join the beta waitlist")'); pg.wait_for_selector('text=You’re on the list'); pg.wait_for_timeout(700)
    at(pg, '#signup', 20)
    pg.screenshot(path=OUT + 'shot-signup-success.png')
    print('stored', pg.evaluate("localStorage.getItem('gapless.waitlist')"))
    for path, name in [('/pricing', 'pricing-page'), ('/changelog', 'changelog'), ('/privacy', 'privacy'), ('/nope', '404')]:
        pg.goto(BASE + path); settle(pg); reveal_all(pg); pg.screenshot(path=OUT + f'shot-{name}.png', full_page=True)
    m = br.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, device_scale_factor=2)
    mp = m.new_page(); mp.on('pageerror', lambda e: errs.append(str(e)))
    mp.goto(BASE + '/'); settle(mp); mp.wait_for_selector('text=Offering to 3 >> visible=true', timeout=15000); mp.wait_for_selector('text=Backfilled · 4 min >> visible=true', timeout=15000); reveal_all(mp)
    mp.screenshot(path=OUT + 'shot-mobile.png', full_page=True)
    print('mobile scrollWidth', mp.evaluate('document.documentElement.scrollWidth'))
    mp.click('[aria-label="Open menu"]'); mp.wait_for_timeout(300); mp.screenshot(path=OUT + 'shot-mobile-menu.png')
    print('errors', errs)
    br.close()
