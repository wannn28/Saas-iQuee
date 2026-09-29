"""End-to-end flow against a running site (default: vite preview on :4175 with the API on :3005).
Usage: /workspace/.venv-pw/bin/python flow.py [BASE_URL]"""
import sys, re, time
from playwright.sync_api import sync_playwright, expect
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4175'
ok = lambda m: print('PASS', m)
stamp = int(time.time())
with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    for label, vp, mobile in [('desktop', {'width': 1280, 'height': 860}, False), ('mobile', {'width': 390, 'height': 844}, True)]:
        print(f'--- {label} ---')
        ctx = br.new_context(viewport=vp, is_mobile=mobile, has_touch=mobile)
        pg = ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
        pg.goto(BASE + '/#signup')
        expect(pg.get_by_test_id('waitlist-count')).to_contain_text(re.compile(r'\d+ clinics? on the waitlist')); ok('count from API: ' + pg.get_by_test_id('waitlist-count').inner_text())
        form = pg.get_by_role('form', name='Join the Gapless beta waitlist')
        form.get_by_role('button', name=re.compile('Join the beta waitlist')).click()
        expect(pg.locator('#err-name')).to_be_visible(); expect(pg.locator('#err-size')).to_be_visible(); ok('client validation')
        assert pg.evaluate('document.activeElement.id') == 'su-name'; ok('focus first invalid')
        email = f'playwright+{label}{stamp}@example.com'
        pg.fill('#su-name', 'Maya Hartono'); pg.fill('#su-email', email); pg.fill('#su-clinic', f'PW {label.title()} Physio {stamp}'); pg.select_option('#su-size', '2-8')
        form.get_by_role('button', name=re.compile('Join the beta waitlist')).click()
        expect(pg.get_by_test_id('signup-success')).to_be_visible(timeout=8000)
        pos = pg.get_by_test_id('signup-position').inner_text(); ok('signup stored, position ' + pos)
        pg.goto(BASE + '/contact')
        pg.fill('#c-name', 'Maya Hartono'); pg.fill('#c-email', email); pg.fill('#c-message', f'Playwright {label} contact test — please ignore.')
        pg.get_by_role('button', name='Send message').click(); expect(pg.get_by_test_id('contact-success')).to_be_visible(); ok('contact message stored')
        pg.goto(BASE + '/admin'); pg.get_by_role('button', name='Fill in').click(); pg.get_by_test_id('admin-login').click()
        expect(pg.get_by_test_id('signups-table')).to_contain_text(f'PW {label.title()} Physio {stamp}'); ok('admin lists new signup')
        expect(pg.get_by_test_id('signups-table')).to_contain_text('p•'); ok('email masked in admin')
        pg.wait_for_timeout(300); pg.screenshot(path=f'shot-admin-{label}.png', full_page=True)
        pg.get_by_role('tab', name='Contact messages').click(); expect(pg.get_by_test_id('contacts-list')).to_contain_text(f'Playwright {label} contact test'); ok('admin lists contact')
        pg.screenshot(path=f'shot-admin-contacts-{label}.png', full_page=True)
        pg.get_by_role('button', name='Sign out').click(); expect(pg.get_by_test_id('demo-creds')).to_be_visible()
        pg.screenshot(path=f'shot-admin-login-{label}.png'); ok('sign out')
        for path in ['/', '/pricing', '/changelog', '/privacy']:
            pg.goto(BASE + path); pg.wait_for_timeout(200)
        sw = pg.evaluate('document.documentElement.scrollWidth'); assert sw <= vp['width'], sw; ok(f'no horizontal overflow ({sw})')
        print('console errors:', errs); assert not errs, errs
        ctx.close()
    br.close()
print('ALL FLOW TESTS PASSED')
