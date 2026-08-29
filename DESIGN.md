# Overland — design system

How this codebase is styled, why it is styled twice, and the specific things that
have broken before.

Read the [Two layers](#two-layers) section before writing any UI. Mixing the two
layers on one screen is the single most common visual bug in this repo and has
happened more than once.

---

## Two layers

There are **two complete, unrelated design systems** in `src/index.css`. They do not
share fonts, colours, radii or naming. A screen belongs to one or the other, never
both.

| | `.aon-*` | `.ov-*` |
|---|---|---|
| **Status** | Current. All new work. | Legacy. Do not extend. |
| **Origin** | Aonami identity (aonamitech.com) | Original TruckHai build |
| **Display type** | Archivo 300 | Newsreader 500 (serif) |
| **Body type** | Poppins | Manrope |
| **Ground** | `#FAF9F7` | `#FBFAF8` |
| **Accent** | `#1E4D6B` slate blue | `#0E32E8` electric blue |
| **Card radius** | `9px` | `18px` |
| **Button shape** | pill, `999px` | rounded rect |

Both are live in production. `.ov-*` is not dead code — roughly 100 components and
24 routes still use it.

### Which layer applies where

| Route | Layer | Notes |
|---|---|---|
| `/` | `.aon-*` | Marketing homepage |
| `/board` | `.aon-*` | The product |
| `/lane/:slug` | `.aon-*` | Public lane pages |
| `/terms` | `.aon-*` | |
| `/broker-dashboard`, `/fleet-dashboard`, `/corporate-*`, `/post-loads`, `/hire-trucks`, `/settings`, and ~18 more | `.ov-*` | Legacy TruckHai surfaces |

Everything under `src/components/overland/` is `.aon-*`. Everything else is
generally `.ov-*`.

### Three components never converted

These sit in the current product but still carry `.ov-*` classes. Leave them unless
you are converting them properly — they work, and a half-conversion is what caused
the mixed-theme bug:

- `ScrollStory.tsx` — `.ov-story-track`, `.ov-story-stage`
- `RateTicker.tsx` — `.ov-ticker-*`
- `BoardPage.tsx` — a few `.ov-*` utilities

---

## The `.aon-*` system

### Colour

```
Ink          #111111        text, dark buttons
Ground       #FAF9F7        page background, text on dark
Card         #FFFFFF        raised surfaces
Accent       #1E4D6B        links, eyebrow accents, active states
Hairline     rgba(17,17,17,.08)   card borders
Body text    rgba(17,17,17,.60)
Muted text   rgba(17,17,17,.45)   eyebrows
Error        #DC2626        see the red footgun below
Positive     #0F7A4A        rate increases, confirmed states
```

Opacities of ink are used instead of grey values, so text sits correctly on both the
cream ground and white cards without a second palette.

### Type

Three families, each with one job. Never substitute.

| Class | Family | Use |
|---|---|---|
| `.aon-display` | Archivo 300, `-0.03em`, `lh 1.05` | Headlines. `--light` modifier for `#FAF9F7` on dark. |
| `.aon-body` | Poppins 400 | Running text |
| `.aon-eyebrow` | Poppins 500, 10.5px, `.14em`, uppercase | Labels above headings. `--accent` modifier. |
| `.aon-num` | JetBrains Mono, `tabular-nums` | **Every** rate, mileage, MC/USDOT, ID, money |

`.aon-num` is not optional for figures. Rates and identifiers appear in columns
throughout the board and must align; proportional numerals break the alignment and
make a rate table unreadable.

### Components

```css
.aon-card         /* #FFFFFF · 1px rgba(17,17,17,.08) · radius 9px */
.aon-cta          /* pill: Poppins 500 10.5px · 7.5px/15px · radius 999px · white on ink */
.aon-cta--dark    /* #111111 ground, #FAF9F7 label */
.aon-cta--ghost   /* transparent, inset 1px border */
.aon-plate        /* scene imagery: cover on desktop, contain on mobile */
```

The pill is the site's only button shape. Do not introduce a second one.

**Centre the CTA in dialogs.** Panel actions use `w-full justify-center`; a
left-aligned button under centred prose reads as a mistake.

---

## Footguns

Each of these has caused a real bug in this repo.

### Tailwind's `red` palette is not red

`tailwind.config.ts` remaps the entire `red` scale to a **blue** ramp
(`red-500` = `#0E32E8`). This was done so legacy TruckHai markup would re-skin to
Aonami blue without touching every file.

**Consequence:** `text-red-500` renders blue. Every error state must use the literal
hex.

```jsx
<p style={{ color: '#DC2626' }}>Enter a valid phone number.</p>   ✅
<p className="text-red-500">Enter a valid phone number.</p>        ❌ renders blue
```

### `overflow-x: clip`, never `hidden`

`overflow-x: hidden` on `html/body` forces `overflow-y` to compute as `auto`, which
turns the body into its own scroll container and **breaks `position: sticky` for
every descendant.** The pinned ScrollStory stage released early and left a band of
empty page below it.

```css
html, body { overflow-x: clip; max-width: 100vw; }
```

### Pinned sections need `svh` and `lvh`, not `vh`

A phone's viewport changes height as the address bar retracts. Mixing units across a
pinned section makes the pin release at the wrong point and exposes the track
background as a white band.

- **Track height** → `svh` (stable; scroll length must not change mid-scroll)
- **Pinned stage** → `lvh` (largest the viewport gets, so it always covers)
- **Scroll progress denominator** → measure the stage element, never `window.innerHeight`

Always ship a `vh` fallback behind `@supports`; an unsupported unit in an inline
style collapses the element rather than degrading.

### `ov-` is also an element-id prefix

`ov-name`, `ov-email`, `ov-password` are DOM **ids** on form fields, unrelated to the
`.ov-*` CSS layer. `grep ov-` over `AuthDialog.tsx` returns 27 hits and **none of
them are CSS classes.** Check `className=` versus `id=` before concluding a component
is on the legacy layer.

### Screen-only breakpoints must say `screen`

A Letter page lays out at roughly **733 CSS px**, below most mobile breakpoints. An
unscoped `@media (max-width: 820px)` fires when printing and collapses every
multi-column layout.

```css
@media screen and (max-width: 820px) { … }   ✅
@media (max-width: 820px) { … }              ❌ also applies to print
```

---

## Charts and data

Charts use **emphasis encoding**, not a categorical palette: one highlighted entity
against a recessive set. Identity is carried by direct labels, never colour alone.

| | Light | Dark |
|---|---|---|
| Overland / highlighted | `#186594` | `#5CB0E8` |
| Everything else | `#7E7E78` | `#767B79` |

Both pairs are validated for colour-vision separation and contrast against their own
surface. Dark mode has **its own steps** — a naive inversion of the light pair scores
ΔE 7.3, far below the readable floor.

Rules:

- Never a dual-axis chart. Two measures of different scale → two charts.
- Every mark gets a direct label or a `<title>`; colour is never the only cue.
- Figures use `.aon-num` / `tabular-nums`.
- Wide tables and charts scroll inside their own `overflow-x: auto` container. The
  page body never scrolls sideways.

---

## Theme and print

The marketing pages are light-only. Report and artifact pages built from this system
are theme-aware and must define the **complete light palette on bare `:root`**, then
redefine only the tokens under both `@media (prefers-color-scheme: dark)` — guarded
as `:root:not([data-theme="light"])` — and `:root[data-theme="dark"]`.

A colour whose only definition sits inside a media or `[data-theme]` block never
applies in the default un-stamped state, and the page renders one theme's text on the
other theme's ground.

For print: pin the light palette, restate the type scale in points, set
`print-color-adjust: exact` so tinted panels survive, and mark cards, callouts and
table rows `break-inside: avoid`.

---

## Accessibility

- Focus is always visible — `:focus-visible` with a 2px accent outline.
- `prefers-reduced-motion: reduce` disables the ticker animation and swaps the
  scroll-scrubbed story for stacked stills.
- Error text is `#DC2626` **and** carries `role="alert"`, so it is announced rather
  than only coloured.
- Icon-only controls carry `aria-label`; the mobile tab bar sets
  `aria-current="page"`.

---

## Adding a screen

1. New work is `.aon-*`. Do not add to `.ov-*`.
2. Ground `#FAF9F7`, cards `#FFFFFF` at 9px, hairlines at 8% ink.
3. Headlines `.aon-display`, labels `.aon-eyebrow`, prose `.aon-body`, **all figures
   `.aon-num`**.
4. One button shape: the pill. Centre it in dialogs.
5. Errors `#DC2626` with `role="alert"` — never `text-red-*`.
6. Run `npm run typecheck` (which is `tsc -b`; bare `tsc --noEmit` is vacuous here
   because the root tsconfig has `files: []`).
