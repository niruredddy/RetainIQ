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
