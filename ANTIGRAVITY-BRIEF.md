# Antigravity work package — Overland auth layer

**Repo:** `~/Downloads/overland`
**Live:** https://overland-5c4.pages.dev · Cloudflare Pages project `overland`
**Goal:** ship today.

## Context

Overland is a US freight exchange being positioned as an **open, AI-enabled marketplace**:
individuals, corporates and US carriers transact directly on FTL and PTL freight, with no
broker sitting in the spread. React + Vite + TS + React Router + Tailwind + shadcn/ui.

**There is currently no auth of any kind.** Confirmed by inspection:
- No `AuthContext`, no provider, no session storage anywhere in `src/`.
- `AuthModal`, `LoginModal`, `BrokerLoginModal`, `FleetOwnerModal`,
  `CorporateRegistrationModal`, `VerificationModal`, `registration/*`, `verification/**`
  all exist but are **pure UI** — `handleLoginSuccess` only `console.log`s.
- **All 32 routes in `src/App.tsx` are unprotected.** Anyone can load
  `/broker-dashboard` directly.

Your job is the whole auth layer, end to end.

## Division of work — read this first

Another agent (Claude) is working in the **same repo at the same time** on homepage
positioning and copy.

| | Files |
|---|---|
| **YOURS** | `src/auth/**` (new), `src/App.tsx`, `src/components/AuthModal.tsx`, `LoginModal.tsx`, `BrokerLoginModal.tsx`, `FleetOwnerModal.tsx`, `CorporateRegistrationModal.tsx`, `VerificationModal.tsx`, `registration/**`, `verification/**`, `.env*` |
| **NOT YOURS — do not edit** | `src/pages/Index.tsx`, `src/components/overland/**`, `src/index.css`, `src/components/ScrollStory.tsx` |

Need something in a "not yours" file? Write it in `ANTIGRAVITY-NOTES.md` at repo root.

## Hard rules

1. **The only real typecheck is `npm run typecheck` (`tsc -b`).** Bare `tsc --noEmit` is
   vacuous — root `tsconfig.json` has `files: []`. `npm run build` runs
   `tsc -b && vite build`, so typecheck gates the build. Never claim a green build
   without running `npm run build`.
2. **Do not change the UI theme.** No new fonts, colours, radii or spacing.
3. Design system = `.ov-*` in `src/index.css`. Fonts: Newsreader (titles), Manrope (UI),
   JetBrains Mono (**all** numbers — MC/USDOT/EIN/phone included). Palette: cream
   `#FBFAF8`, ink `#14161A`, accent `#0E32E8`, danger `#DC2626`.
4. **Tailwind's `red` palette is remapped to blue** in `tailwind.config.ts`. For real
   errors use `#DC2626` explicitly — never `red-*`. Auth is full of error states, so
   this will bite you if you forget.
5. Reuse the existing modal components. Do not build new UI shells.

---

## THE PUBLIC CONTRACT — build this first, exactly as specified

Claude is wiring the homepage nav against this. Ship the file with stub internals in
your first commit so nothing is blocked, then fill it in.

```ts
// src/auth/AuthContext.tsx
export type Role = 'shipper' | 'carrier' | 'broker';

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  orgName?: string;      // corporates only
  mcNumber?: string;     // carriers only
  usdotNumber?: string;  // carriers only
  verified: boolean;     // completed the verification funnel
};

export function useAuth(): {
  user: User | null;
  loading: boolean;                                  // true until session restored
  signIn(email: string, password: string): Promise<void>;
  signUp(input: SignUpInput): Promise<void>;
  signOut(): Promise<void>;
  openAuth(mode?: 'signin' | 'signup', role?: Role): void;  // opens the modal
};

export function AuthProvider(props: { children: React.ReactNode }): JSX.Element;
```

Mount `<AuthProvider>` inside `src/App.tsx`, wrapping `<BrowserRouter>`.

---

## Tasks, in priority order

### 1. Auth backend decision

There is no backend. Two acceptable paths — **pick one and say which in your notes**:

- **Supabase Auth (implemented).** Email+password, magic-link, and Google sessions use
  the public client configuration in `src/auth/supabaseConfig.ts`. Store `role`,
  `mcNumber`, and `usdotNumber` in `user_metadata`; never put a `service_role`
  key in browser code.
- **Local-only mock.** `localStorage` session, seeded demo accounts. Faster, but nobody
  can actually register.

If you cannot obtain Supabase keys, build the mock behind the same `useAuth` interface
so swapping later is a one-file change.

### 2. Session persistence
Restore the session on boot. `loading` must be `true` until that resolves, so protected
routes never flash the login screen for an already-authenticated user.

### 3. Protected + role-aware routes
In `src/App.tsx`, add a `<RequireAuth role="...">` wrapper.

- Unauthenticated → redirect to `/`, open the sign-in modal, and **return the user to
  the route they wanted after login**.
- Wrong role → send to their own dashboard, do not 404.
- Role → landing route: `carrier` → `/fleet-dashboard`, `broker` → `/broker-dashboard`,
  `shipper` → `/corporate-dashboard`.
- Protect every dashboard, post-load, hire-truck, insurance, settings, reports and
  bidding route. Leave `/` and `NotFound` public.

### 4. Wire the existing modals to real auth
Replace every `console.log` success handler with real `signIn` / `signUp`. Sign-up must
capture role, and for carriers capture **MC number and USDOT number** — these are
genuine FMCSA identifiers and the exchange is meaningless without them.

Validation to enforce:
- USDOT: digits only, 5–8 characters.
- MC: digits only, up to 7 characters, optional `MC-` prefix stripped before storing.
- Email: standard. Password: minimum 8 characters.
- Render all identifiers in `.ov-num` (JetBrains Mono).
- Error text in `#DC2626`, never `red-*`.

### 5. Real error and loading states
Wrong password, duplicate email, network failure — each needs a visible, specific
message. Disable the submit button and show a pending state while in flight. No silent
failures and no `alert()`.

### 6. Signed-in surface
- `DashboardLayout` (`dashboard/NavigationBar`) shows the real user's name, role and a
  working **Sign out**.
- Carriers with `verified: false` see a persistent prompt to finish the existing
  verification funnel (`verification/**`). Do not rebuild that funnel — just gate on the
  flag and link into it.

---

## Definition of done

```bash
npm run typecheck   # tsc -b, must exit 0
npm run build       # must succeed
npm run preview
```

Then verify by hand and record the result in `ANTIGRAVITY-NOTES.md`:

1. Visit `/broker-dashboard` signed out → redirected home, sign-in modal opens.
2. Sign up as a carrier with MC + USDOT → lands on `/fleet-dashboard`.
3. Hard-refresh → still signed in, no login flash.
4. As a carrier, visit `/broker-dashboard` → redirected to `/fleet-dashboard`.
5. Sign out → protected routes locked again.
6. Wrong password → visible `#DC2626` error, form still usable.

State clearly which auth backend you chose, and anything you deliberately skipped.
