# Claude Code — Dev Kickoff Prompt (Story A: Landing + Onboarding)

Copy–paste the block below into Claude Code to start implementation. It assumes the repo already contains the referenced docs.

---

You are the **Dev Agent** for MentorIQ. Implement **Story A (Landing + Onboarding)** strictly following our BMAD docs. Use ONLY the files below as sources of truth and treat them as requirements:

**Context files to load (read carefully):**
- docs/stories/stories-epic-A-landing-onboarding.md
- docs/stories/dev-tasks-epic-A-landing-onboarding.md
- docs/architecture/ARCHITECTURE.md
- docs/architecture/ui-theme.md
- docs/qa/gates/design-review-epic-A-landing-onboarding.md
- docs/qa/gates/risk-analysis-epic-A-landing-onboarding.md
- docs/qa/gates/test-design-epic-A-landing-onboarding.md
- docs/qa/gates/traceability-epic-A-landing-onboarding.md
- docs/qa/gates/security-epic-A-landing-onboarding.md
- docs/qa/gates/nfr-checklist.md
- docs/qa/qa-epic-A-landing-onboarding.md

**Objectives:**
1) A0 Landing (route `/`): single‑screen (no scroll @ 1366×768), shadcn/ui components, dark theme (ui-theme.md), Inter font, orange CTA (#FF6A2D). CTAs open Clerk SignIn/SignUp modals; on success redirect to `/dashboard`.
2) A1 Onboarding (first login): shadcn Dialog with two cards → **Create team** (name + season) or **Join team** (invite code) in ≤2 clicks; stub APIs: `POST /v1/teams`, `POST /v1/teams:join`; on success go to `/teams/{id}`.
3) A2 First Session setup (on `/teams/{id}`): inline card → simple form with date, goals chips, and 3 prefilled agenda items (no AI). Save → create session, toast success, stay on page.

**Constraints & Non‑functionals:**
- Use **shadcn/ui** for all interactive elements; Tailwind only for layout/spacing.
- Apply theme from `ui-theme.md` (dark bg #1C1C1C/#181818, text white, accent #FF6A2D; hover #E65C1F).
- Accessibility: WCAG AA, visible orange focus rings, semantic headings.
- Performance: Lighthouse ≥ 90 for `/` and `/teams/{id}`; LCP < 2.5s.
- Security: validate Clerk session server‑side on protected routes; deny‑by‑default access to `/teams/{id}`; write immutable audit stubs for team create/join/session create.
- Analytics events: `landing.view`, `landing.cta.click`, `auth.start`, `auth.success`, `onboarding.view`, `onboarding.select`, `team.create.success`, `team.join.success`, `session.first.prompt.view`, `session.create.start`, `session.create.success`.

**Deliverables:**
- Next.js (App Router, TS) pages/components and minimal API stubs for the above.
- Playwright e2e tests (landing no‑scroll, Clerk modals, onboarding flows, first session).
- Jest/RTL unit tests for key components; Lighthouse CI config.
- `docs/stories/DEVLOG-epic-A-landing-onboarding.md` summarizing changes and any deviations.

**Process (do not skip):**
- Implement **A0 → run tests + Lighthouse → pause for Design Review** using `design-review-epic-A-landing-onboarding.md`.
- Implement **A1 → run tests → pause for Security/NFR checks** using `security-...` and `nfr-checklist.md`.
- Implement **A2 → run tests → compile evidence (screens, reports)**.
- Update `traceability-epic-A-landing-onboarding.md` with test mappings.
- Do **NOT** merge. Stop and request QA to fill `review-epic-A-landing-onboarding.md` with PASS/CONCERNS/FAIL.

**Definition of Done (for Dev Agent):**
- All acceptance criteria in `stories-epic-A-landing-onboarding.md` are satisfied.
- All gates prepared and evidence attached: Design, Risk, Test Design, Traceability, NFR, Security, Theme.
- `review-epic-A-landing-onboarding.md` is ready for QA sign‑off.
- Code is lint‑clean and tests green.

Begin now. If any requirement conflicts, ask for clarification referencing the exact file/line and stop execution.
