# RetainIQ: distinctive 3D design and credible product behavior

## Context
You want a professional, attractive workforce-retention product, with a signup background that is visibly different from the dashboard, and an experienced engineering review—not just cosmetic changes. The recommendation is to improve the existing product rather than add unrelated screens. No design can guarantee a competition win; credible evidence and reliable behavior matter as much as presentation.

Reviewed: authentication, dashboard, Risk Radar, Deep-Dive, Mobility Matcher, Action Center, navigation, search, notifications, realtime hooks, custom-agent proxy, database schema and relevant access policies. Visually inspected `/auth` at desktop 1280px and mobile 390px. Authenticated browser behavior has not yet been verified.

### Most important findings
- Signup currently uses the same ambient background as the app; it lacks a distinct visual story.
- Authentication can remain in a submitting state after signup without a session. Password visibility/recovery and safe return-to-route handling are missing. The SOC 2 certification claim is not substantiated.
- Risk Radar hardcodes workflow and record counts. Notifications have no click action; search advertises employee search but only searches pages. Sidebar navigation drops employee selection.
- Deep-Dive can show the previous employee's diagnostic after selection changes. Failed AI calls produce fabricated output labeled cached AI; the proxy cancels its stream early and does not verify thread ownership before polling.
- Action Center declares operational completion using timers, even when database writes fail. Duplicate prevention is not atomic.
- Mobility Matcher can load forever when there is no plan and ignores stored roadmap phases in favor of hardcoded content/progress.
- Database updates and genuine HR-system ingestion are different: existing seeded records are not evidence of connected HR telemetry. Current policies allow all signed-in users to read employee records and update workflows; this is not proven organization-level isolation.
- Dashboard mounts two WebGL scenes. Router construction occurs inside render, and a timed splash unnecessarily blocks access.

## Recommended design
**Direction: Talent in Motion.** Retain the RetainIQ name, Sora/Manrope typography, blue identity, emerald growth accents, and light/dark themes.

**Sign in / signup:** a premium split layout, with a sculptural 3D network of talent nodes and ascending career-path ribbons on the left and a stable, high-contrast form on the right. This is explicitly not another globe or random particle field. Use a concise workforce-growth headline and three explanatory labels: Understand signals, Find opportunities, Coordinate action—no invented metrics. Mobile keeps the form prominent and uses a compact dimensional illustration rather than hiding the requested visual entirely.

**Dashboard and modules:** preserve the dashboard globe identity but use only one active scene. Add restrained layered surfaces, inset highlights, consistent status treatments and small hover lifts. Keep tables, charts and reading surfaces flat enough to scan. Avoid animated backgrounds behind dense data and avoid tilting input forms.

Implement colors, elevations, focus styles and motion through semantic HSL tokens in `src/index.css` and `tailwind.config.ts`; reuse existing Card, Button, Input, Sheet/Dialog and EmployeeSelect components. Contrast must be tested, not assumed from palette names.

## Implementation checklist
### 1. Visual foundation and authentication
- [ ] Add a dedicated auth scene/component with career-path geometry, independent of the dashboard composition.
- [ ] Provide an immediate CSS/SVG dimensional fallback; load decorative WebGL after the form is usable. Handle missing WebGL, context loss, resize and cleanup.
- [ ] Cap rendering resolution, pause hidden/offscreen scenes, and respect reduced motion without removing essential content.
- [ ] Recompose `src/pages/auth.tsx` into the split experience with visible field labels, password visibility, accessible errors, and a theme toggle.
- [ ] Handle submission exceptions and email-confirmation success without endless loading; preserve safe same-app return destinations.
- [ ] Add a real password-reset/request-and-update flow using existing authentication, with accurate confirmation/error states.
- [ ] Remove unverified certification and zero-hallucination claims; use factual product copy instead.
- [ ] Apply reusable surface/button/status recipes to the existing five app pages and themed 404 screen without changing their purpose.

### 2. Navigation, data and usability
- [ ] Preserve the selected employee across sidebar, module links and command navigation; show an explicit invalid-employee state instead of silently substituting someone else.
- [ ] Add employee search using the existing `useEmployees` cache, plus Risk Radar name/role search and risk filtering.
- [ ] Make the notification button open current critical signals with employee-specific links; do not invent unread notifications.
- [ ] Replace the custom mobile drawer with the existing accessible dialog/sheet pattern; close on navigation and restore focus.
- [ ] Replace hardcoded counts with database queries, keeping total workflow counts independent of the paginated execution list.
- [ ] Expose loading, empty, error/retry and last-fetched states across modules; distinguish database connection status from HR-source freshness.
- [ ] Subscribe to employee, workflow, mobility-plan and workflow-node changes with matching query invalidation and cleanup; show disconnected/reconnecting status honestly.
- [ ] Fetch mobility plans only after employee resolution, render missing-plan states, and use stored roadmap phases/progress. Missing milestones remain unconfigured, not fabricated.
- [ ] Normalize/deduplicate skills for transparent overlap calculations; describe alignment as skill overlap, not a guaranteed career outcome.

### 3. Diagnostic and workflow credibility
- [ ] Remove fabricated cached diagnostic generation. Keep bounded loading, cancellation and actionable failure/retry states; suppress stale results after employee changes.
- [ ] Load the custom-agent integration guidance, repair ownership-checked thread/run handling and supported streaming/event parsing, and validate diagnostic payloads before presenting success.
- [ ] Show a readable evidence/recommendation summary alongside optional raw JSON, employee identity and generation time. Label recommendations as requiring human review.
- [ ] Attempt an authenticated end-to-end agent run. If the upstream serving endpoint remains blocked, report that blocker and keep the UI truthful—do not substitute simulated AI or switch providers silently.
- [ ] Replace timer-driven execution with **human-reviewed retention case tracking**: explicit task updates with recorded actor, timestamp and evidence/note; external dispatch/enrollment stays “not connected.”
- [ ] Make case creation idempotent on the server under concurrent requests. Inspect existing records first; preserve historical cases rather than deleting or silently resetting them.
- [ ] Persist case/task transitions and show success only after confirmed writes; reject invalid/unauthorized changes and preserve state after refresh.
- [ ] Derive case completion from recorded task state, distinguish human-recorded completion from external confirmation, and do not treat older timer-completed records as verified evidence.

### 4. Access safety and performance
- [ ] Load Enter Cloud guidance before backend changes; inspect existing RetainIQ ownership and policy relationships. Preserve existing profiles, roles, records and unrelated tables.
- [ ] Audit profile role-write permissions and workflow mutation authorization. Do not expose sensitive real employee data publicly or claim multi-organization isolation without implementing and testing it.
- [ ] Keep router/provider instances stable; remove the forced timed splash and retain visible session-restoration states.
- [ ] Keep `/auth` content in its initial dependency path, split noninitial app routes, and defer decorative Three.js without blanking critical content. Preserve editor, analytics and i18n contracts.
- [ ] Update RetainIQ social metadata and enable production build-manifest evidence while preserving platform plugins.

## Boundaries and external dependencies
This work preserves the current route structure and business purpose. It does not add billing, a marketing-site rebuild, arbitrary HR integrations, or invented employee data.

**Real workforce ingestion needs an authorized source and a confirmed access model.** Existing seeded rows must remain clearly identified as sample data until replaced through an approved import/integration. Choosing the source, organization membership rules and any HRIS/LMS/email service requires your input before connecting them. No secrets in frontend code.

**Human case tracking is not automated execution.** The proposed workflow is functional internal tracking; actual manager dispatch, course enrollment and HRIS updates require configured services and confirmation from those services. Production readiness remains conditional on real source access, security validation and a successful live AI run.

## Critical implementation paths
- Design/auth: `src/pages/auth.tsx`, new focused components under `src/components/auth/`, `src/components/site/three-background.tsx`, `src/index.css`, `tailwind.config.ts`, `src/hooks/use-auth.tsx`.
- Shell/navigation: `src/App.tsx`, `src/router.tsx`, `src/components/{app-shell,sidebar,top-header,command-palette}.tsx`, `src/hooks/use-employee-param.ts`.
- Existing modules: `src/pages/{dashboard,risk-radar,deep-dive,mobility-matcher,action-center}.tsx`; reuse `useEmployees`, `useMobilityPlan`, `useWorkflows`, `useRealtimeInvalidate`, `EmployeeSelect` and `PageHeader`.
- Diagnostics/backend: `src/lib/diagnostic.ts`, `supabase/functions/custom-agent/index.ts`, narrowly scoped RetainIQ migrations and workflow mutations after ownership review.
- Build/metadata: `vite.config.ts`, `index.html`.

## Verification checklist
- [ ] Validate auth sign-in/signup, confirmation-required signup, invalid credentials, recovery, restored sessions, safe return links and sign-out/cache clearing.
- [ ] Check auth layout at `mobile_390` and `desktop_1280`, including create-account mode; verify light/dark, keyboard focus, reduced motion and WebGL fallback. Inspect only representative affected routes, not a screenshot sweep.
- [ ] Follow Risk Radar → Deep-Dive → Mobility Matcher → Action Center with the same employee; test refresh, back navigation, no selection and an invalid employee code.
- [ ] Test employee switching during a delayed diagnostic; verify late responses cannot replace the current employee's result. Test timeout, malformed output, cancellation and unauthorized thread access.
- [ ] Test no employees, missing mobility plan, zero required skills, zero gaps, query failure and more than 20 workflows; no endless skeletons or false counts.
- [ ] Test workflow double-click/concurrent creation, failed writes, unauthorized updates, refresh and task completion; no timer can produce completion.
- [ ] Verify realtime updates using authorized test records without changing operational employee data; confirm reconnect status and no duplicated subscriptions.
- [ ] Run `pnpm lint`, `pnpm exec tsc --noEmit`, relevant regression tests, `pnpm run build`, and `pnpm run build:prod`. Capture production manifest/bundle audit; the performance skill's audit reference was unavailable during planning and must be resolved or reported as a tooling blocker.
- [ ] Report build audit, browser performance, functional regression and deployed HTTP verification separately as passed, failed, exempted or unverified. Screenshots/build success alone do not establish performance or end-to-end correctness.
