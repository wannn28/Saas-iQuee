# Gapless — SaaS marketing site demo by iQuee

A marketing landing site for **Gapless**, a fictional scheduling product for small physio, dental and chiropractic
clinics. Its one big promise: when a patient cancels, the freed slot is automatically texted to the clinic's
waitlist and the first person to reply "Y" gets it — *"Cancelled at 8:58. Refilled by 9:04."*
**Demo only — the product, company, clinics, people, prices and statistics are all invented. There is no backend;
nothing you type leaves your browser.**

- Live: https://saas.iquee.tech
- Repo: https://github.com/wannn28/Saas-iQuee

Built as a portfolio piece for the classic "landing page for my SaaS / startup" brief: a bold light editorial design
(warm white, near-black ink, one signal-green accent, Bricolage Grotesque display type), asymmetric ruled layouts
instead of rows of rounded cards, and product screens built in HTML/CSS rather than stock illustrations.

## What's inside

- **Home (`/`)** — sticky nav with mobile menu · hero with an animated HTML/CSS product mockup (a clinic day calendar
  where a cancelled slot is backfilled, plus an SMS phone thread) and primary CTA · fictional clinic logo strip (text + inline SVG) ·
  problem/solution with a "before vs. after" day-ribbon chart and key figures · **features** with accessible tabs
  (arrow-key navigation) switching between five product screens (waitlist backfill, calendar, reminders, intake forms,
  utilization report) plus an "also in the box" list · how it works (3 steps) · integrations + webhook payload sample ·
  **pricing** with monthly/yearly toggle (per-plan savings shown) and full feature comparison table · testimonials
  (one lead quote + two with stats) · FAQ accordion · final CTA with **waitlist form** · footer.
- **`/pricing`** — plan strip with billing toggle (defaults to yearly), interactive savings/ROI calculator (sliders),
  comparison table, billing FAQ.
- **`/changelog`** — release notes list with versions, dates and New / Improved / Fixed tags.
- **`/privacy`** — placeholder privacy page explaining what the demo stores; `/privacy#terms` placeholder terms.
- 404 page.
- **Waitlist form** — inline validation on blur and on submit (name, email format, duplicate email, clinic, team size),
  focus moves to the first invalid field, simulated latency, success state with a queue number, entries saved to
  `localStorage` (`gapless.waitlist`), "Clear demo data" button. Clearly labelled as a demo.
- **Motion** — scroll-reveal via a single shared `IntersectionObserver`, hero backfill loop, tab/accordion transitions.
  All of it is disabled under `prefers-reduced-motion` (content is never hidden without JS).
- **Accessibility** — skip link, semantic landmarks and headings, ARIA tabs / radiogroup / accordion patterns,
  visible focus rings, labelled form fields with `aria-invalid` + `aria-describedby`, decorative mockups `aria-hidden`
  with a text description, AA contrast for text (the green is used as a fill behind ink text, deep green for text).
- **Performance** — no UI or animation libraries, no images on the page (mockups are DOM/CSS, icons inline SVG),
  self-hosted subsetted variable font, ~23 kB gzip app JS + ~53 kB gzip React vendor chunk.

## Tech Stack

| Area | Technology (version from `package.json` / installed) |
| --- | --- |
| Frontend framework / language | React 18.3.1 + React DOM 18.3.1, TypeScript 5.6.3 (strict mode) |
| Styling | Tailwind CSS 3.4.19, PostCSS 8.5.28, Autoprefixer 10.6.1; fonts self-hosted via Fontsource — Bricolage Grotesque Variable 5.3.0, IBM Plex Mono 5.3.0 |
| Routing | React Router DOM 6.30.6 (`BrowserRouter`, nested layout route, hash-anchor scrolling) |
| Animation | Plain CSS transitions/keyframes (Tailwind) + native `IntersectionObserver` scroll reveal; no animation library; respects `prefers-reduced-motion` |
| State / data storage | React component state only. **No backend, no database.** Waitlist signups are stored in the visitor's browser `localStorage` (demo) |
| Forms / validation | Hand-written controlled form + validation logic (no form library); client-side only |
| Product mockups & icons | HTML/CSS components and inline SVG (no images, no icon library) |
| Build tooling | Vite 5.4.21 with @vitejs/plugin-react 4.7.0; `tsc -b` type-check before build; Node 20 |
| Linting | ESLint 9.39.5 (flat config), typescript-eslint 8.71.0, @eslint/js 9.39.5, eslint-plugin-react-hooks 5.2.0, eslint-plugin-react-refresh 0.5.7, globals 15.15.0 |
| Screenshots / QA | Playwright (Python) driving Google Chrome — `shots.py` |
| Hosting / deploy (target) | Static `dist/` served by Nginx on an Ubuntu VPS behind Cloudflare, Let's Encrypt SSL, SPA fallback to `index.html` at https://saas.iquee.tech (same setup as the other iQuee demos) |

### Production-ready path

This is a front-end demo. A real launch would add (none of this exists in the repo):
a small API (e.g. Node/Express or a serverless function) that validates signups server-side and stores them in
**PostgreSQL**; a transactional email service (e.g. Postmark, Resend or SES) for confirmation emails with double opt-in;
bot protection (Turnstile/hCaptcha) and rate limiting on the form; privacy-friendly analytics; a real privacy policy
and terms; and optionally a headless CMS for the changelog/blog.

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build -> dist/ (static; serve at domain root with SPA fallback)
npm run lint
npx vite preview --port 4175 &
/workspace/.venv-pw/bin/python shots.py   # screenshots -> shot-*.png
```

Nginx SPA fallback: `location / { try_files $uri $uri/ /index.html; }`

## Project layout

```
src/
  components/      Layout (nav, demo banner, footer), Pricing (toggle, plan strip, compare table), Faq, SignupForm, Logo, Icons
  components/mock/ HTML/CSS product screens: Frame, Calendar, Phone, Screens (waitlist, reminders, intake, reports)
  sections/        Home page sections (Hero, Logos, Problem, Features, How, Integrations, PricingSection, Stories, FaqSection, FinalCta)
  pages/           Home, PricingPage, Changelog, Privacy, NotFound
  data/content.ts  Plans, comparison rows, FAQ, testimonials, integrations, changelog
  lib/             reveal (scroll animation), backfill (hero loop), format, useTitle
tools/             og-image / favicon renderer
```

## Screenshots

| Hero | Feature tabs |
| --- | --- |
| ![Hero with animated product mockup](docs/hero.png) | ![Feature tabs showing the reminders screen](docs/features.png) |
| **Pricing (yearly)** | **Waitlist signup success** |
| ![Pricing with yearly billing selected](docs/pricing-yearly.png) | ![Waitlist form success state](docs/signup-success.png) |
| **FAQ** | **Mobile** |
| ![FAQ accordion open](docs/faq.png) | ![Mobile home, top](docs/mobile.png) |

---

Designed and built by [iQuee](https://iquee.tech). Gapless is fictional; see [CREDITS.md](CREDITS.md).
