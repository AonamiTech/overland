# Overland — Project Handover

You are taking over **Overland**, a US freight-exchange marketing site + product dashboards. This doc is self-contained: read it, then continue the work.

## What it is
A React + Vite + TypeScript SPA. Originally an Indian "Truck Hai" freight template, it was (1) rebranded to a US brand **Overland**, (2) fully localized to the US market, (3) redesigned into a premium editorial "trading terminal" design system, and (4) deployed to Vercel. All data is mock/demo (in-component arrays + live-simulated tickers) — there is **no backend/API**.

## Locations
| | |
|---|---|
| Source folder | `~/Downloads/overland` |
| Live URL | https://overland-5c4.pages.dev |
| Vercel project | `overland` (account: `pratikkp24`) |

## Stack
Vite 5 · React 18 · TypeScript · React Router · Tailwind · shadcn/ui (Radix) · recharts · lucide-react · sharp (build-time image gen only).

**Fonts:** Newsreader (serif display), Manrope (UI/body), JetBrains Mono (all data/numbers). Loaded in `index.html` and `src/index.css`.

**Scripts:**
- `npm run dev` — Vite dev server (port 8080; see `.claude/launch.json`)
- `npm run build` — **`tsc -b && vite build`** (typecheck GATES the build)
- `npm run typecheck` — `tsc -b`
- `npm run preview` — serve the production build

> ⚠️ IMPORTANT: bare `tsc --noEmit` is **vacuous** here (root `tsconfig.json` has `files: []`). The only real typecheck is **`tsc -b`**. Always use that.

## Design system (read before touching UI)
Global `ov-*` utility classes live in `src/index.css` (search "Overland premium design layer"):
- `.ov-display` — Newsreader serif for titles · `.ov-ital` — blue italic serif accent
- `.ov-num` — JetBrains Mono tabular; put on ALL numbers/currency/IDs/timestamps
- `.ov-eyebrow` — small blue mono uppercase label (inner `<span class="dot">`)
- `.ov-card` / `.ov-card--hover` — white surface, warm hairline `#E7E3DC`, radius 18
- `.ov-btn` + `.ov-btn-ink` (primary, soft-black `#111217`) / `.ov-btn-outline` / `.ov-btn-ghost` / `.ov-btn-light`
- `.ov-tick` — blue-tint icon chip · `.ov-board` — dark terminal panel · `.ov-livedot` — pulsing live dot · `.ov-mkt-row` — market table row

**Palette (exact hex):** cream `#FBFAF8` page · white cards · hairline `#E7E3DC` · dividers `#ECE8E1` · ink `#14161A` · body `#3E3F46` · muted `#5B6470` · faint `#A9A29A`/`#8B857C` · accent blue `#0E32E8` (hover `#043EDB`) · positive `#0F7A4A` · warning `#B45309` · **danger/error `#DC2626`** · market down-tick rust `#A8412F`.

> ⚠️ Tailwind's `red` palette is **remapped to a blue ramp** in `tailwind.config.ts`, so legacy `bg-red-500` renders brand blue. For genuine danger/error use `#DC2626` explicitly — never rely on `red-*`.

**Brand assets:** `src/components/ui/BrandLogo.tsx` (SVG wave lockup; `tone="light"` for dark backgrounds) · `src/components/ui/Plate.tsx` (US license plate).

## Structure
- `src/pages/Index.tsx` — homepage = Navigation, Hero, **LiveMarket**, HowItWorks, InsurancePreview, PricingSection, Testimonials, SupportSection, Footer.
- `src/App.tsx` — router (32 routes). Dashboards are wrapped in `DashboardLayout` (shell = `dashboard/NavigationBar` + `dashboard/Sidebar`).
- Dashboard content: `BrokerDashboard`, `FleetDashboard`, `CorporateDashboard`, `bidding/*`, `fleet/*`, `broker/*`, `commission/*`, `corporate/*`, `insurance/*`, plus pages (`FleetManagementPage`, `GPSTrackingPage`, `ReportsAnalyticsPage`, `SettingsPage`, …).
- Onboarding: `LoginModal`/`AuthModal` + `registration/*` + `verification/**` (KYC steps).

## Generated assets
- `public/favicon.svg` · `favicon.png` · `apple-touch-icon.png` · `favicon.ico` (Overland wave mark)
- `public/og.png` — 1200×630 social card; source SVG at `scripts/og.svg` (rasterize with `sharp`)

## Status
**Done:** US rebrand + localization (USD, US lanes/cities, CDL/EIN/USDOT/MC) · premium redesign of homepage + all dashboards + onboarding funnel · typecheck-gated build · branded favicon + OG · deployed to Vercel.

**Open TODO (nice-to-have, not done):**
1. Route-level code-splitting — currently one ~1.5 MB JS chunk; use `React.lazy` on dashboard routes.
2. Per-route `<title>` tags (all 32 routes share the homepage title).
3. Warm the dashboard notification/profile dropdown greys in `dashboard/NavigationBar.tsx` (still cool `gray-*`).
4. Remove the dev-only `lovable-tagger` plugin from `vite.config.ts` + devDeps.
5. A11y: add `focus-visible` rings to nav/buttons.
6. Real mobile-device QA (structure is responsive but unverified on-device).
7. Optional: custom domain (e.g. `overland.com`) in Vercel → Project → Domains.

## Run it
```bash
cd overland      # the extracted folder
npm install
npm run dev
```
Deploy: `vercel --prod` (already linked to the `overland` project; needs Vercel auth as `pratikkp24`).
