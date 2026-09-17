# RetainIQ — Autonomous Workforce Mobility & Retention Engine

## Context

The user wants a **frontend-only** enterprise dashboard UI ("RetainIQ") modeled after Vercel/Codex/Linear: high-density, data-forward, NOT a chatbot. All data and AI output will be **simulated locally with hardcoded demo data** (confirmed by user). No backend, no AI capability needed.

**Future-proofing (user requirement):** the diagnostic is mock *for now*, but the user will later connect a real AI agent (Qwen) via the backend. The simulated diagnostic will therefore live behind a small async service (`src/lib/diagnostic.ts` exporting `runDiagnostic(employeeId) → Promise<DiagnosticResult>`) so the UI only consumes a promise — later it can be re-implemented as a backend-function call (Enter Cloud + AI capability) with zero UI changes. Same pattern for any orchestration action if needed.

The template already ships everything needed: `framer-motion`, `recharts`, `lucide-react`, `next-themes`, and shadcn components (`button`, `badge`, `card`, `skeleton`, `avatar`, `dialog`, `command`, `dropdown-menu`, `tooltip`, `separator`).

## Architecture

Single-page shell under existing `react-router-dom`. Routes:

| Route | Screen |
|---|---|
| `/` | Redirect → `/risk-radar` |
| `/risk-radar` | Screen 1: Cross-Vector Attrition Radar |
| `/deep-dive` | Screen 2: Qwen Reasoning Engine |
| `/mobility-matcher` | Screen 3: Dynamic Skill Graph Gap Matcher |
| `/action-center` | Screen 4: EnterPro Orchestration |

Layout: fixed left sidebar (240px, collapsible to 64px) + 64px top header + content area. Page transitions via `framer-motion` `AnimatePresence` keyed on pathname (300ms fade + slide-up).

## Files

### New files
- `src/components/theme-provider.tsx` — `next-themes` `ThemeProvider` (attribute="class", defaultTheme="dark", enableSystem=false).
- `src/components/splash-screen.tsx` — full-screen overlay: typewriter "RetainIQ" logo, mono subtitle "Autonomous Workforce Mobility & Retention Engine", 3-dot pulsing loader. `onDone` callback fires after 2.5s; parent unmounts with fade-out + slide-up (600ms).
- `src/components/app-shell.tsx` — sidebar + header + `<Outlet/>` + `AnimatePresence` transition wrapper. Holds sidebar collapse state and Cmd+K command palette.
- `src/components/page-shell.tsx` — shared page wrapper (max-width, 24px padding, section headers) + page fade/slide motion.
- `src/components/sidebar.tsx` — 240px↔64px collapsible; logo + "v1.0" badge; nav items (Radar, ScanSearch, GitBranch, Zap); active state = 2px electric-blue left border + lighter bg; `NavLink`-driven.
- `src/components/top-header.tsx` — breadcrumb ("Dashboard / {tab}"), global search button (Cmd+K, opens Command dialog), Sun/Moon theme toggle (`useTheme`), Bell with dot, avatar.
- `src/components/command-palette.tsx` — shadcn `Command` inside `Dialog`, navigates to the 4 screens, `⌘K`/`Ctrl+K` shortcut + `/` shortcut.
- `src/components/risk-badge.tsx` — pill badge: 0–30% emerald, 31–70% amber, 71–100% rose + subtle pulse; mono font.
- `src/pages/risk-radar.tsx` — 3 metric cards (Total Monitored 247 / Critical Attrition Risk 18 w/ rose glow / Active Workflows 7 w/ emerald) + data table (Employee avatar+name+role, Overtime Spike hrs mono, Sentiment Drop mono, Risk Badge, Status). Row hover: slight lift + border highlight (200ms).
- `src/pages/deep-dive.tsx` — 60/40 grid. Left: employee header + 3 mini-cards (Attendance = `recharts` LineChart, Peer Sentiment = SVG radial gauge, Skill Matrix = tag cloud) + glowing "Run Qwen Diagnostic" button. Right: "Qwen Reasoning Engine" header + Copy JSON button; always-dark code block; hand-rolled syntax highlighter (keys blue / strings green / numbers orange, mono); placeholder text before run; skeleton shimmer during simulated 1.8s loading.
- `src/pages/mobility-matcher.tsx` — 3 columns: Current Competencies (muted blue/gray tags), Target Requisition (card, animated count-up 78% "Alignment"), Skill Delta (missing skills with glowing blue borders). Bottom: "Upskilling Roadmap" horizontal 14-day timeline, 3 phases (Fundamentals / Advanced / Capstone) with connectors.
- `src/pages/action-center.tsx` — centered (max-w-2xl). Summary card (employee, risk level, recommended action). Full-width gradient (blue→indigo, max 400px) "Execute EnterPro Workflow" button. Vertical 4-node timeline; on click nodes sequentially animate gray→emerald + Check icon (~600ms stagger via framer-motion).
- `src/data/dashboard.ts` — all demo data: 8 employees (initials, avatar gradient, role, overtime, sentiment, riskScore, status), competencies, target role, skill delta, roadmap phases, workflow nodes, and the diagnostic JSON payload.
- `src/lib/diagnostic.ts` — async `runDiagnostic(employeeId): Promise<DiagnosticResult>`; currently resolves the mock payload after ~1.8s simulated delay (used by the skeleton shimmer). Defines `DiagnosticResult` type. **Swap point for the future real Qwen backend call** — the Deep-Dive UI consumes only this promise.

### Modified files
- `src/index.css` — RetainIQ design tokens + keyframes (below).
- `tailwind.config.ts` — extend: fonts (`sans` = Inter, `mono` = JetBrains Mono), tokens `success`/`warning`/`info`, `boxShadow` glow variants, keyframes `fade-in-up`, `shimmer`, `pulse-glow`, `gradient-x`.
- `src/router.tsx` — add the 5 routes above with `AppShell` as layout route.
- `src/App.tsx` — wrap with `ThemeProvider`; render `SplashScreen` with `AnimatePresence` above router; mount RouterProvider inside theme provider.
- `index.html` — Google Fonts: Inter + JetBrains Mono; set `<html class="dark">`.

## Design tokens (index.css)

- **Dark (default):** bg `#09090B`, card `#121214`, border `rgba(255,255,255,0.08)`, foreground `#FAFAFA`, muted `#A1A1AA`.
- **Light:** bg `#FAFAFA`, card `#FFFFFF`, border `rgba(0,0,0,0.08)`, foreground `#18181B`, muted `#52525B`.
- **Accents:** primary electric blue `#3B82F6`, success emerald `#10B981`, destructive rose `#F43F5E`, warning amber `#F59E0B` (all as HSL in tokens).
- Gradients: `--gradient-primary` (blue→indigo), `--gradient-subtle`; shadows `--shadow-glow` (blue glow), `--shadow-rose` (risk glow).
- Border radius 8px; cards 1px border; glassmorphism `backdrop-blur` on header/floating elements; 8px grid padding (24px inside cards).
- Keyframes: shimmer (skeleton), pulse-glow (high-risk badge), fade-in-up (page transitions).

## Implementation checklist

- [ ] `src/index.css`: replace token blocks (dark default + light) with RetainIQ palette; add gradients/glow shadows/keyframes.
- [ ] `tailwind.config.ts`: add `success`/`warning` colors, Inter/JetBrains Mono fonts, new keyframes/animations/boxShadows.
- [ ] `index.html`: add Inter + JetBrains Mono font links; default `class="dark"` on `<html>`.
- [ ] `src/components/theme-provider.tsx` created; `src/App.tsx` wraps app in `ThemeProvider` and renders `SplashScreen` overlay.
- [ ] `src/components/splash-screen.tsx`: typewriter logo, mono subtitle, 3-dot loader, 2.5s auto-transition with fade-out/slide-up exit.
- [ ] `src/data/dashboard.ts`: all demo data exported (employees, risk statuses, competencies, delta, roadmap, workflow nodes, diagnostic JSON payload).
- [ ] `src/lib/diagnostic.ts`: `runDiagnostic()` async service returning `DiagnosticResult` promise (mock, ~1.8s delay); Deep-Dive UI consumes the promise only, so a future backend swap touches only this file.
- [ ] `src/components/sidebar.tsx`: collapsible 240↔64px, logo + v1.0 badge, 4 nav items, blue left-border active state.
- [ ] `src/components/top-header.tsx`: 64px breadcrumb, Cmd+K search trigger, theme toggle (Sun/Moon), bell + dot, avatar.
- [ ] `src/components/command-palette.tsx`: ⌘K/Ctrl+K + `/` open Command dialog navigating to 4 screens.
- [ ] `src/pages/risk-radar.tsx`: 3 metric cards (247/18 rose-glow/7 emerald) + full data table with `RiskBadge` and hover lift rows.
- [ ] `src/components/risk-badge.tsx`: color thresholds (emerald/amber/rose+pulse) per spec.
- [ ] `src/pages/deep-dive.tsx`: 60/40 layout, 3 telemetry mini-cards (recharts line, SVG gauge, skill tags), glowing diagnostic button, loading shimmer, syntax-highlighted always-dark JSON block + Copy JSON.
- [ ] `src/pages/mobility-matcher.tsx`: 3-column layout, 78% alignment count-up, glowing gap tags, 14-day 3-phase roadmap timeline.
- [ ] `src/pages/action-center.tsx`: summary card, gradient execute button, vertical 4-node timeline animating gray→emerald with Check icons on click.
- [ ] `src/router.tsx`: layout route `AppShell` + 4 child routes; `/` redirects to `/risk-radar`.
- [ ] Page transitions: 300ms fade + slide-up between tabs via `AnimatePresence` keyed on pathname.
- [ ] All buttons: 200ms ease-in-out hover (scale + shadow); mono font used for all numbers/risk scores/JSON/telemetry.

## Verification checklist

- [ ] `pnpm run build` and `pnpm lint` pass clean.
- [ ] Splash: shows on load, typewriter + loader render, auto-dismisses ~2.5s into dashboard.
- [ ] Dark mode is default; theme toggle switches to light and back; both palettes match spec hex values and contrast is readable (no white-on-white / black-on-black).
- [ ] Sidebar collapses to 64px and back; active nav item shows blue left accent; nav switches screens.
- [ ] Risk Radar: badges color by threshold; >70% shows pulse; rows lift on hover.
- [ ] Deep-Dive: placeholder text before run; clicking button shows shimmer skeleton then highlighted JSON; Copy JSON copies to clipboard.
- [ ] Mobility Matcher: 3 columns align; count-up reaches 78%; gap tags glow blue.
- [ ] Action Center: clicking Execute animates all 4 nodes to emerald sequentially with checkmarks.
- [ ] Cmd+K palette opens and navigates to each screen.
- [ ] Responsive: verify `/risk-radar` at `mobile_390` and `desktop_1280` via `website_screenshot`; grid stacks on mobile, no horizontal overflow.
