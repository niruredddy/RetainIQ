# RetainIQ — Premium Marketing Site with WebGL 3D Background

## Context

The RetainIQ dashboard (previous task) is being **replaced entirely** by a premium marketing website for the same product (workforce mobility & retention intelligence). User requirements:
- **Premium, professional, NEAT and clean** — explicitly "completely different from common AI-generated websites," but refined, not heavily textured (no grain overlays, dense grids, or scanlines).
- **Real WebGL 3D background** (three.js): animated particle network / data globe.
- **KEEP the existing splash/logo screen** (RetainIQ typewriter splash) on app load.
- **KEEP the light/dark theme toggle** — both themes fully designed.
- Elements that suit the project: risk radar, Qwen diagnostics, skill matching, retention workflows.

The forced `building-dashboard` skill covers Axiom dashboards via API and does not map to a React marketing site; per its own "compute what's asked" principle I apply its decision-first, no-filler thinking to the section hierarchy instead of its Axiom tooling.

**Aesthetic direction — "Refined Intelligence Command Center":** cinematic but clean. Full-viewport WebGL particle constellation + rotating wireframe data globe (subtle, theme-aware colors), glass panels with generous whitespace, monospace telemetry accents, electric blue primary + emerald success. Restrained palette, consistent 8px spacing, 200ms micro-interactions. Typography: **Sora** (display) + **Manrope** (body) + **JetBrains Mono** (data) — clean and professional, deliberately not Inter/Space Grotesk.

## Dependencies

- Add `three` + `@types/three` (plain three.js in a `useEffect` canvas — no react-three-fiber, avoids React 19 peer-dep risk, leaner bundle).

## Files

### New
- `src/pages/landing.tsx` — composes the full page from the site components below.
- `src/components/site/three-background.tsx` — **lazy-loaded** (React.lazy + Suspense with clean gradient fallback) WebGL canvas, fixed behind content. Scene: ~250-node particle constellation (static link pairs, slow drift, additive blending) + transparent wireframe icosahedron "data globe" with a rotating ring, slow auto-rotation, mouse parallax. **Theme-aware:** reads `useTheme` and adjusts particle/globe colors + opacity for light vs dark (deep blue on light, electric blue on dark). Guards: `pixelRatio` ≤ 2, rAF pauses on `document.hidden`, static frame under `prefers-reduced-motion`, resize handled, cleanup on unmount. Props: `variant: "hero" | "cta"`.
- `src/components/site/reveal.tsx` — framer-motion `whileInView` reveal wrapper (opacity + y, 300ms, optional delay).
- `src/components/site/navbar.tsx` — fixed glass nav: RetainIQ logo, anchor links (Product, Platform, Process), **Sun/Moon theme toggle**, "Sign in" ghost + "Book a demo" gradient CTA; backdrop-blur + border after scroll.
- `src/components/site/hero.tsx` — full-viewport WebGL hero, mono eyebrow ("AUTONOMOUS WORKFORCE INTELLIGENCE · v1.0"), Sora headline with gradient accent word, subcopy, dual CTAs, mono telemetry ticker, scroll cue.
- `src/components/site/ticker.tsx` — CSS marquee of mono metric readouts (numbers from `dashboard.ts`).
- `src/components/site/logo-band.tsx` — "TRUSTED BY TEAMS THAT SHIP" + invented org names in mono.
- `src/components/site/stats.tsx` — 3–4 clean mono stat cards with count-up (76% predictable attrition, 2.3× retention ROI, 14-day sprint, 247 monitored).
- `src/components/site/features.tsx` — 4 product-pillar cards (Risk Radar, Deep-Dive Qwen, Mobility Matcher, Action Center), lucide icons, subtle hover lift + glow.
- `src/components/site/platform-preview.tsx` — split section: copy + glass "browser window" with compact risk table (reuses `employees`) and mini area chart; mono caption bar.
- `src/components/site/process.tsx` — 3-step numbered timeline (Ingest → Qwen diagnostic → Execute EnterPro workflow) with connector line.
- `src/components/site/cta.tsx` — gradient panel with subtle WebGL (variant cta), headline, email input + "Request access" button.
- `src/components/site/footer.tsx` — logo, mono link columns, "v1.0" badge, © 2026.

### Modified
- `src/index.css` — keep both verified token palettes from the dashboard (dark default: `#09090B` bg / `#121214` card / fg `#FAFAFA` / muted `#A1A1AA`; light: `#FAFAFA` / `#FFFFFF` / `#18181B` / `#52525B`; accents blue `#3B82F6`, emerald `#10B981`, rose, amber). **Clean treatment**: gradient tokens (hero radial, text gradient, CTA blue→indigo), glass utility, soft shadows — **no film grain / grid overlay / scanlines**. Keyframes: ticker, float, pulse-glow, gradient-x, blink.
- `tailwind.config.ts` — fonts `display` (Sora) / `sans` (Manrope) / `mono` (JetBrains Mono); glow shadows; new keyframes/animations; keep existing color tokens.
- `index.html` — Google Fonts (Sora 600/700, Manrope 400/500/600, JetBrains Mono 400/500/600/700); title/meta for RetainIQ.
- `src/router.tsx` — `/` → Landing; `*` → NotFound. Dashboard routes removed.
- `src/App.tsx` — keep `ThemeProvider` (dark default, both themes) + existing `SplashScreen` on load (AnimatePresence); wrap `RouterProvider`.

### Kept (not deleted)
- `src/components/splash-screen.tsx` (existing logo screen), `src/components/theme-provider.tsx`.

### Deleted (dashboard-only)
`app-shell.tsx`, `sidebar.tsx`, `top-header.tsx`, `command-palette.tsx`, `page-shell.tsx`, `risk-badge.tsx`, `lib/nav.ts`, `lib/diagnostic.ts`, `pages/Index.tsx`, `pages/risk-radar.tsx`, `pages/deep-dive.tsx`, `pages/mobility-matcher.tsx`, `pages/action-center.tsx`.

### Reused
- `src/data/dashboard.ts` (employees + metrics → ticker, stats, platform preview), `framer-motion`, `lucide-react`, shadcn `button`/`card`/`input`, `src/pages/NotFound.tsx`.

## Implementation checklist

- [ ] Add `three` + `@types/three` via `add_dependency`.
- [ ] `index.html`: fonts (Sora + Manrope + JetBrains Mono), title/meta.
- [ ] `index.css`: keep light+dark token pairs; clean gradients/glass/soft shadows; ticker/float/pulse keyframes; no texture overlays.
- [ ] `tailwind.config.ts`: display/sans/mono fonts, glow shadows, new animations.
- [ ] `three-background.tsx`: WebGL constellation + data globe, theme-aware colors, perf guards, lazy import, Suspense fallback.
- [ ] `reveal.tsx` + staggered hero load-in.
- [ ] `navbar.tsx`: glass, scrollspy, **theme toggle**, CTAs.
- [ ] `hero.tsx` + `ticker.tsx`: WebGL hero, Sora headline, mono marquee, scroll cue.
- [ ] `logo-band.tsx`, `stats.tsx` (count-up), `features.tsx` (4 pillars), `process.tsx` (3-step timeline).
- [ ] `platform-preview.tsx`: glass browser window with risk table + chart from `dashboard.ts`.
- [ ] `cta.tsx` (subtle 3D + email form), `footer.tsx`.
- [ ] `landing.tsx` composes all sections.
- [ ] `router.tsx` `/` → Landing; `App.tsx` keeps ThemeProvider + SplashScreen; delete dashboard-only files.
- [ ] `pnpm run check` and `pnpm run build` pass.

## Verification checklist

- [ ] `pnpm run build` and `pnpm lint` pass clean.
- [ ] Splash logo screen appears on load (both themes) and fades into the landing page.
- [ ] `/` renders WebGL constellation + data globe behind hero; no WebGL/three.js console errors.
- [ ] Theme toggle switches dark ↔ light; BOTH themes: bg/card/fg match spec hexes, contrast readable, no white-on-white; WebGL colors adapt to theme.
- [ ] Display font is Sora (no Inter); mono data uses JetBrains Mono.
- [ ] Ticker marquee runs; stats count up on scroll.
- [ ] Nav scrollspy works; navbar gains blur+border on scroll; mobile nav shows logo + toggle + CTA only.
- [ ] 4 feature cards lift/glow on hover; platform preview renders table from demo data.
- [ ] CTA panel + email input aligned at `desktop_1280`.
- [ ] Responsive: `/` at `mobile_390` and `desktop_1280` via `website_screenshot`; no horizontal overflow, hero text scales, sections stack.
- [ ] Reduced-motion: static 3D frame; rAF pauses on tab hidden (code-level check).
- [ ] No blank flash while three.js lazy-loads (Suspense fallback renders).
