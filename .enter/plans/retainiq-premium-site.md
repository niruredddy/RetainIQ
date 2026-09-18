<<<<<<< HEAD
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
=======
# RetainIQ: distinctive 3D design and credible product behavior

## Context
The approved direction is a professional workforce-retention app with a distinct, theme-related 3D signup experience, improved existing modules, and truthful operational behavior. Preserve existing employee records and the site's business purpose. No design or test suite guarantees a competition win or production readiness.

Reviewed all existing routes and their principal controls: authentication, dashboard, Risk Radar, Deep-Dive, Mobility Matcher, Action Center, navigation/search/notifications, database policies, realtime subscriptions and the custom-agent proxy.

## Design delivered
**Talent in Motion:** a blue/emerald career-path sculpture with connected talent nodes, separate from the dashboard's globe. Desktop uses a split composition; mobile retains a compact dimensional visual above the form. Existing Sora/Manrope typography and light/dark themes remain. Cards, navigation, status treatments and forms share semantic HSL tokens. Dense data remains readable rather than continuously tilted or animated.

## Implementation checklist
### Authentication and visual foundation
- [x] Dedicated auth 3D career-path scene, with immediate SVG fallback and deferred WebGL.
- [x] WebGL failure/context-loss handling, bounded rendering resolution, hidden/offscreen pause, cleanup and reduced-motion behavior for the auth scene.
- [x] Rebuilt sign-in/signup forms with theme toggle, persistent labels, show/hide password, submission exception handling and confirmation messaging.
- [x] Password reset request/update UI and safe return-to-route handling implemented; actual email delivery remains unverified below.
- [x] Removed unsupported certification and zero-hallucination claims.
- [x] Updated shared cards, sidebar/header, data modules and themed 404; removed duplicate dashboard WebGL background.
- [x] Stable router and auth-context identity, visible route fallback, no forced timed splash.

### Navigation and data
- [x] Employee selection carried across sidebar, command and module navigation; initial selection is pinned in the URL.
- [x] Invalid employee codes show an explicit empty state instead of silently selecting another person.
- [x] Command search includes employees/roles; Risk Radar supports name/role search and risk filters.
- [x] Notifications open employee-specific critical signals instead of acting as a dead button.
- [x] Accessible mobile navigation sheet closes on navigation and restores trigger focus.
- [x] Removed static record/workflow counts. Active-case count uses an exact database count, independent of the 20-row history page.
- [x] Loading/error/retry/empty states added across modules; stored employee and mobility JSON is validated before rendering.
- [x] Employee, workflow, mobility-plan and workflow-node subscriptions updated, with connection status and cleanup. New task changes invalidate history and counts.
- [x] Mobility queries wait for employee resolution; no-plan state is finite; saved roadmap phases/progress replace invented timelines.
- [x] Skill overlap normalizes and deduplicates skills; zero requirements are not a fabricated match.
- [x] Added a last-fetched timestamp to the shared data-status strip, distinguished from source freshness, with snapshot failure/loading states.

### Diagnostics and case tracking
- [x] Removed fabricated cached AI results and false confidence/root-cause output.
- [x] Added SDK-based AG-UI runtime, cancel/retry, bounded requests, employee-keyed panel lifecycle and strict output/employee validation.
- [x] Replaced early stream cancellation with a lossless streaming proxy; added ownership checks for run/history/resume/cancel/tool-answer routes.
- [x] Agent ownership mappings are server-recorded; users cannot forge a verified mapping. Existing mappings are retained but not implicitly trusted.
- [x] Added structured observation/hypothesis/action/limitation presentation with optional JSON and real SDK activity.
- [x] Attempted an authenticated live diagnostic and made it work: discovered the real serving host (`https://api.enter.pro` from the agent's public-site bundle) instead of the marketing site, fixed service-role thread persistence, and received a validated diagnostic in an authenticated run.
- [ ] Serving-host/format reliability: the upstream host was corrected, but Qwen's output format varies between runs (validated JSON in some runs, non-conforming JSON or slow first runs in others). Connection is proven; deterministic formatting and latency are controlled by the published agent, not this app. Further retries consume model credits.
- [x] Email signup: enabled auto-confirmation so account creation completes immediately without a verification mail round-trip.
- [x] Replaced timer-driven completion with persisted human-reviewed cases and supporting evidence notes.
- [x] Atomic case creation prevents duplicate manual cases for the same employee **within the requesting user's case ownership**. Historical records are preserved separately and marked unverified.
- [x] Task updates record actor, time and evidence with append-only history. Server derives case completion; direct client completion writes are denied.
- [x] Reopening tasks requires a note. Refresh restores recorded progress; repeated case creation does not reset tasks or add new task snapshots.
- [x] UI explicitly distinguishes human-recorded actions from disconnected external dispatch/enrollment/HRIS integrations.

### Security, build and platform boundaries
- [x] Inspected existing RetainIQ rows, schema and policies before compatible migrations; preserved profiles, role values, employee records and historical workflow records.
- [x] New task/event tables have verified RLS and ownership-scoped reads; mutations run through authenticated server-side database functions.
- [x] Fixed self-service profile-role escalation without changing existing users or roles.
- [x] Preserved platform plugins, analytics/i18n contracts and generated client ownership; framework regenerated database types.
- [x] Split noninitial module routes, updated social metadata, enabled production manifest and ran the strict route-classified bundle audit.
- [x] Removed framer-motion from the initial bundle in favor of CSS staggered animations (auth route −20KB brotli; mobile auth LCP median improved from ≈2.58s to ≈2.31s, now under the 2.5s lab target; CLS ≈0.01).
- [ ] Reduce initial bundle cost further and resolve performance audit warnings. Default size budgets remain exceeded (≈226KB brotli on `/auth`, ≈339KB on `/`); the remaining weight is framework/platform dependencies, not app code. Budgets were not raised to hide this.
- [x] Verified the published preview over plain HTTP: status 200 with the correct title and description. Caching/compression headers on the deployed artifact remain unverified.

## Verification checklist and evidence
- [x] `pnpm lint`.
- [x] `pnpm exec tsc -p tsconfig.app.json --noEmit` and `pnpm exec tsc -p tsconfig.node.json --noEmit`.
- [x] `pnpm run build` and `pnpm run build:prod`.
- [x] `pnpm exec playwright test`: **6 passed** on the final tested source tree.
- [x] Browser coverage: sign-in with a generated QA account, signup form/mode controls, password visibility, recovery entry, route protection, sign-out, employee navigation, search, invalid selection, saved mobility target, case creation, task evidence and refresh persistence.
- [x] Database coverage: four concurrent case requests return the same case ID, direct completion denied, insufficient evidence rejected, self-role promotion denied, forged verified thread mapping denied.
- [x] Realtime coverage: a separate authenticated database client updates a sample employee's QA task; the open browser receives the updated task state.
- [x] Auth artwork visually inspected at `mobile_390` and `desktop_1280` (assumed target sizes). Mobile headline wrapping fixed. Both-theme key text contrast checks pass AA; reduced-motion/WebGL-unavailable form tests pass.
- [x] Five cold-start `/auth` samples under mobile 390×844/DPR2, 4× CPU, 150ms RTT, 200KB/s download: LCP 2564–2616ms, median 2576ms; CLS 0 for all; two long tasks per sample. Local production evidence only, not deployed-user metrics.
- [ ] Performance acceptance: LCP narrowly misses the suggested 2.5s target. No pre-change browser baseline exists, so improvement is unverified. Other routes and critical-interaction latency were not performance-profiled.
- [ ] Complete remaining negative/boundary browser coverage: email delivery and confirmation-required signup, absent mobility plan/empty dataset, more than 20 cases, denied cross-user case access, delayed successful diagnostic switching/cancellation and full light/mobile app-route visual review.
- [ ] Verify deployed HTTP/cache/compression behavior; no published production URL was available for that check.

### Explicit quality status
| Area | Status |
|---|---|
| Lint, type checks and both builds | Passed |
| Six implemented regression tests | Passed; not exhaustive |
| Strict static build-performance audit | Default budget exceeded, but improved (−20KB brotli, LCP 2.31s median); platform-framework weight remains |
| Browser performance | Measured auth only; LCP now meets lab target, broader acceptance unverified |
| Deployed HTTP verification | Preview returns 200 with correct title/description; caching headers unverified |
| Live Qwen diagnostic | Connected (real validated response received); model output format varies by run |
| Genuine HR telemetry / external actions | Not connected |

The audit ran from an isolated ignored copy under `.enter/performance-audit/` because the mounted skill lacked parser dependencies. Platform-injected external font CSS remains in the build; platform plugins were preserved rather than removed. Auth is an application access screen, not a new marketing/SSG site.

## Remaining external decisions
Existing data remains visibly identified as a sample workforce dataset. Genuine ingestion needs an authorized HR source and confirmed organization/access model. New signups currently share access to the sample employee dataset; multi-organization isolation is not implemented and must precede sensitive real employee ingestion. External manager communication, LMS enrollment and HRIS updates require separately chosen/configured services. Human case tracking does not perform those external actions.

## Critical files
- `src/components/auth/{auth-artwork,talent-scene}.tsx`, `src/pages/auth.tsx`, `src/index.css`, `tailwind.config.ts`.
- `src/lib/auth-context.ts`, `src/hooks/use-auth.tsx`, `src/components/app-shell.tsx`, `src/router.tsx`.
- Existing module pages and `src/hooks/{use-employees,use-employee-param,use-mobility-plan,use-realtime,use-workflows}.ts`.
- `src/lib/diagnostic.ts`, `src/components/diagnostic-panel.tsx`, `supabase/functions/custom-agent/index.ts` (deployed version 9).
- `src/components/retention-task.tsx`, compatible migrations under `supabase/migrations/`, `tests/*.spec.ts`, `playwright.config.ts`.
>>>>>>> origin/enter-main
