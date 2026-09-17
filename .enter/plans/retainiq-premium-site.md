# RetainIQ — Premium Marketing Site with WebGL 3D Background

## Context

The RetainIQ dashboard (previous task) is being **replaced entirely** by a premium marketing website for the same product (workforce mobility & retention intelligence). User requirements:
- **Premium, professional, visually striking** — explicitly "completely different from common AI-generated websites."
- **Real WebGL 3D background** (three.js): animated particle network / data globe.
- Elements that suit the project: risk radar, Qwen diagnostics, skill matching, retention workflows.

The forced `building-dashboard` skill covers Axiom dashboards via API (APL/MPL, deployment scripts) and does not map to a React marketing site; per its own "compute what's asked" principle I apply its decision-first, overview→drilldown, no-filler thinking to section hierarchy instead of its Axiom tooling.

**Aesthetic direction — "Autonomous Intelligence Command Center":** cinematic dark-only theme, live WebGL particle constellation + rotating wireframe data globe behind a full-viewport hero, glass panels, monospace telemetry readouts, electric blue + emerald accents, fine grid + film-grain texture, staggered load/scroll reveals. Distinctive typography: **Unbounded** (display) + **Sora** (body) + **JetBrains Mono** (data) — deliberately not Inter/Space Grotesk.

## Dependencies

- Add `three` + `@types/three` (plain three.js in a `useEffect` canvas — no react-three-fiber, avoids React 19 peer-dep risk and keeps the bundle lean).

## Files

### New
- `src/pages/landing.tsx` — composes the full page from the site components below.
- `src/components/site/three-background.tsx` — **lazy-loaded** (React.lazy + Suspense fallback gradient) WebGL canvas, fixed/absolute behind content. Scene: ~250-node particle constellation (static link pairs, slow sin-drift animation, additive blending, electric blue) + transparent wireframe icosahedron "data globe" with rotating emerald ring, slow auto-rotation, mouse parallax (camera lerp). Guards: `pixelRatio` capped at 2, rAF loop pauses on `document.hidden`, renders one static frame under `prefers-reduced-motion`, window-resize handled, canvas removed on unmount. Props: `variant: "hero" | "cta"` (intensity/density).
- `src/components/site/reveal.tsx` — framer-motion `whileInView` scroll-reveal wrapper (opacity + y, 300ms, optional delay).
- `src/components/site/navbar.tsx` — fixed glass nav: logo mark + "RetainIQ", anchor links (Product, Platform, Process), "Sign in" ghost + "Book a demo" gradient CTA; backdrop-blur on scroll.
- `src/components/site/hero.tsx` — full-viewport: ThreeBackground (variant hero), mono eyebrow ("AUTONOMOUS WORKFORCE INTELLIGENCE · v1.0"), Unbounded headline with gradient accent word, subcopy, dual CTAs, live mono telemetry ticker (marquee), scroll cue.
- `src/components/site/ticker.tsx` — CSS marquee of mono metric readouts (reuses dashboard data numbers).
- `src/components/site/logo-band.tsx` — "TRUSTED BY TEAMS THAT SHIP" + invented org names in mono (VERIDIA, ORIZON, HELIXSTONE, NAVA LABS, CORELIGHT, ASTERWIND).
- `src/components/site/stats.tsx` — 3–4 large mono stat cards (76% attrition predictable 90d out, 2.3× retention ROI, 14-day upskilling sprint, 247 employees monitored) with count-up.
- `src/components/site/features.tsx` — 4 product-pillar cards (Risk Radar, Deep-Dive Qwen, Mobility Matcher, Action Center) with lucide icons, hover glow + lift.
- `src/components/site/platform-preview.tsx` — split section: copy + glass "browser window" with compact live risk table (reuses `employees` from `src/data/dashboard.ts`) and mini area chart; mono caption bar.
- `src/components/site/process.tsx` — 3-step numbered timeline (Ingest multi-source telemetry → Qwen zero-hallucination diagnostic → Execute EnterPro workflow) with connector line.
- `src/components/site/cta.tsx` — gradient panel + subtle ThreeBackground (variant cta), headline, email input + "Request access" button.
- `src/components/site/footer.tsx` — logo, mono link columns, "v1.0" badge, © 2026.

### Modified
- `src/index.css` — full rewrite to dark-only premium tokens: bg `#050507` (`hsl(240 12% 2.5%)`), surface `#0B0C11`, elevated `#11131A`, border `white/8`, fg `#F4F5F7`, muted `#9CA3B0`; keep electric blue `#3B82F6`, emerald, rose, amber; gradient tokens (hero radial, text gradient, CTA blue→indigo), grid-lines + noise (SVG data-uri) utility classes, glass utility; keyframes: ticker marquee, float, pulse-glow, gradient-x, scanline, blink.
- `tailwind.config.ts` — fonts `display` (Unbounded) / `sans` (Sora) / `mono` (JetBrains Mono), new surface/elevated colors, boxShadow glows, backgroundImage grid/noise, new keyframes/animations.
- `index.html` — Google Fonts (Unbounded 600/700/800, Sora 400/500/600, JetBrains Mono 400/500/600/700), title/meta for RetainIQ.
- `src/router.tsx` — single route `/` → Landing; `*` → NotFound. Dashboard routes removed.
- `src/App.tsx` — minimal: `RouterProvider` only (drop ThemeProvider / Toaster / Sonner / TooltipProvider / SplashScreen — site is dark-only, no providers needed).

### Deleted (dashboard-only)
`app-shell.tsx`, `sidebar.tsx`, `top-header.tsx`, `command-palette.tsx`, `page-shell.tsx`, `risk-badge.tsx`, `splash-screen.tsx`, `theme-provider.tsx`, `lib/nav.ts`, `lib/diagnostic.ts`, `pages/Index.tsx`, `pages/risk-radar.tsx`, `pages/deep-dive.tsx`, `pages/mobility-matcher.tsx`, `pages/action-center.tsx`.

### Reused
- `src/data/dashboard.ts` (employees + metrics → hero ticker, stats, platform preview).
- `framer-motion`, `lucide-react`, shadcn `button`, `card`, `input` components.
- `src/pages/NotFound.tsx`.

## Implementation checklist

- [ ] Add `three` + `@types/three` deps via `add_dependency`.
- [ ] `index.html`: swap fonts to Unbounded + Sora + JetBrains Mono; update title/meta.
- [ ] `index.css`: dark-only token system, gradients, grid/noise utilities, ticker/float/scanline keyframes.
- [ ] `tailwind.config.ts`: display/sans/mono fonts, surface colors, glow shadows, animations.
- [ ] `three-background.tsx`: WebGL constellation + wireframe globe with rotation/parallax; perf guards (pixelRatio ≤2, pause on hidden, reduced-motion static frame, resize, cleanup); lazy-imported.
- [ ] `reveal.tsx` + staggered hero load-in (framer-motion).
- [ ] `navbar.tsx`: glass, scrollspy anchors, dual CTAs.
- [ ] `hero.tsx` + `ticker.tsx`: WebGL hero, Unbounded headline, mono telemetry marquee, scroll cue.
- [ ] `logo-band.tsx`, `stats.tsx` (count-up), `features.tsx` (4 pillars), `process.tsx` (3-step timeline).
- [ ] `platform-preview.tsx`: glass browser window with live risk table + chart from `dashboard.ts` data.
- [ ] `cta.tsx` (subtle 3D + email form), `footer.tsx`.
- [ ] `landing.tsx` composes all sections in order.
- [ ] `router.tsx`: `/` → Landing, `*` → NotFound.
- [ ] `App.tsx` minimal RouterProvider; delete all dashboard-only files listed above.
- [ ] `pnpm run check` (lint + tsc) and `pnpm run build` pass.

## Verification checklist

- [ ] `pnpm run build` and `pnpm lint` pass clean; no unused-import/lint errors from deleted files.
- [ ] `/` loads: WebGL canvas renders particle constellation + data globe behind hero; console shows no WebGL/three.js errors.
- [ ] Hero headline uses Unbounded (no Inter anywhere); mono readouts use JetBrains Mono.
- [ ] Dark-only theme: background `#050507`, cards `#0B0C11`, readable fg/muted contrast; no white-on-white.
- [ ] Telemetry ticker scrolls continuously (marquee); stats count up on scroll into view.
- [ ] Nav anchors scroll to Product/Platform/Process sections; navbar gains blur/border after scroll.
- [ ] 4 feature cards lift + glow on hover; platform preview renders table rows from demo data.
- [ ] CTA panel shows subtle 3D background + works at `desktop_1280`; email input + button aligned.
- [ ] Responsive: `/` at `mobile_390` (nav collapses to logo + CTA, hero text scales, grid stacks, no horizontal overflow) and `desktop_1280` via `website_screenshot`.
- [ ] `prefers-reduced-motion` users get a static 3D frame (no rAF loop); canvas pauses when tab hidden (code-level check).
- [ ] Page transition/hydration: no blank flash while three.js lazy-loads (Suspense fallback gradient behind hero).
