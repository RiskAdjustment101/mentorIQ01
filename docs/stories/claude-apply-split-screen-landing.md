# Claude Code — Apply Split-Screen Landing & AI Messaging (Story A0)

You are the Dev Agent. Update the landing page per the split-screen spec and copy. Use ONLY the docs below as source of truth.

## Context Files to Load
- docs/stories/stories-epic-A-landing-onboarding.md
- docs/stories/dev-tasks-epic-A-landing-onboarding.md
- docs/architecture/ARCHITECTURE.md
- docs/architecture/ui-theme.md
- docs/product/landing-copy-epic-A.md    ← (new copy to apply)
- docs/qa/gates/design-review-epic-A-landing-onboarding.md
- docs/qa/gates/nfr-checklist.md
- docs/qa/gates/security-epic-A-landing-onboarding.md
- docs/qa/qa-epic-A-landing-onboarding.md
- docs/qa/gates/traceability-epic-A-landing-onboarding.md
- docs/qa/gates/review-epic-A-landing-onboarding.md

## Objectives
1) Convert the landing page to a **split-screen layout**:
   - **Left pane (Action)**: logo, Hero headline, subtext, **single CTA “Get Started”** that opens Clerk SSO (Google/Microsoft/email). Optional tiny link: “Already have an account? Sign in”.
   - **Right pane (Marketing)**: 3–4 bullet differentiators emphasizing **AI**: Plan Smarter (AI agendas), Save Time, Built for Trust (consent/compliance), Connected Knowledge (optional).

2) Keep **no-scroll** requirement at 1366×768. Adjust spacing/typography to fit without truncation.

3) Enforce **theme & components**:
   - shadcn/ui for all primitives (Button, Card, Separator, Dialog if used)
   - Dark theme (bg #1C1C1C/#181818), text white/gray, accent orange #FF6A2D (hover #E65C1F)
   - Inter font

4) Preserve analytics from Story A0:
   - `landing.view`, `landing.cta.click` {cta: "get-started"}, `auth.start`, `auth.success`

5) Update tests/docs:
   - e2e test still asserts **no vertical scroll** and correct **CTA triggers Clerk**.
   - Update `traceability-epic-A-landing-onboarding.md` to map new copy/layout to test cases.
   - Add a short **DEVLOG** entry: docs/stories/DEVLOG-epic-A-landing-onboarding.md

## Acceptance Criteria
- Entire layout fits within 1366×768 without vertical scrollbars.
- CTA text = **“Get Started”**; opens Clerk SSO; success redirects `/dashboard`.
- Right pane shows 3 (or 4) differentiators that match `landing-copy-epic-A.md` exactly.
- Lighthouse Accessibility ≥ 90; Performance ≥ 90.
- Design Review and NFR gates pass.

## Constraints
- Do not introduce additional sections or scrolling.
- Use shadcn/ui components; Tailwind for layout/spacing only.
- Keep copy exactly as in `landing-copy-epic-A.md` (subject to responsive tweaks).

## Deliverables
- Updated landing route and components.
- Updated Playwright tests for layout and Clerk modal.
- Updated traceability matrix rows for A0 requirements.
- DEVLOG entry listing files changed and screenshots (if your tool supports).

## Stop Condition
When all acceptance criteria are met and gates pass, STOP and request QA to record the final decision in `docs/qa/gates/review-epic-A-landing-onboarding.md`.
