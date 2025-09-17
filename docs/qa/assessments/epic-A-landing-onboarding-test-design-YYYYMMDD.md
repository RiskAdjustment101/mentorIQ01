# QA Test Design — Epic A (Landing + Onboarding)

**Date:** YYYY-MM-DD
**Owner:** QA Agent (Quinn)

---

## Test Scope
- Unit tests for UI components (shadcn buttons, dialog).
- e2e for landing (no-scroll, CTA → Clerk, redirect).
- e2e for onboarding (create/join team).
- Integration test for first session creation.
- Accessibility tests (axe, Lighthouse).
- Performance tests (Lighthouse, Web Vitals).

## Tools
- Jest + React Testing Library.
- Playwright for e2e.
- axe-core + Lighthouse CI for accessibility/performance.

## Pass Criteria
- All story acceptance criteria covered.
- Accessibility ≥ 90, Performance ≥ 90.
- Tests run green in CI.

---

## Status
PASS / CONCERNS / FAIL
