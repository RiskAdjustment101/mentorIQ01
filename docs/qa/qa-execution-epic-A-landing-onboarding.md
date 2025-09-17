# QA Execution Checklist — Epic A (Landing + Onboarding)

**Story Reference:** docs/stories/stories-epic-A-landing-onboarding.md
**Date:** YYYY-MM-DD
**Owner:** QA Agent (Quinn)

---

## 1. Preparation
- [ ] Confirm all Dev deliverables are complete (landing split-screen, onboarding modal, first session setup).
- [ ] Ensure acceptance criteria in the story doc are implemented.
- [ ] Verify analytics events are firing in dev logs (landing.view, cta.click, auth.start/success, onboarding.*, session.*).

---

## 2. Risk Analysis
- [ ] Open `docs/qa/assessments/epic-A-landing-onboarding-risk-YYYYMMDD.md`.
- [ ] Evaluate functional, non-functional, and security/compliance risks.
- [ ] Fill mitigation notes (e.g., accessibility fallback, Clerk edge cases).
- [ ] Mark overall status: PASS / CONCERNS / FAIL.

---

## 3. Design Review
- [ ] Use `docs/qa/gates/design-review-epic-A-landing-onboarding.md`.
- [ ] Confirm shadcn/ui usage, dark theme (#1C1C1C), Inter font, orange accents (#FF6A2D).
- [ ] Ensure no vertical scroll at 1366×768.
- [ ] Verify copy matches `landing-copy-epic-A.md`.
- [ ] Mark status.

---

## 4. Test Design
- [ ] Open `docs/qa/assessments/epic-A-landing-onboarding-test-design-YYYYMMDD.md`.
- [ ] Ensure test coverage across unit, integration, e2e, a11y, performance.
- [ ] Verify tools (Jest, Playwright, axe, Lighthouse) specified.
- [ ] Mark status.

---

## 5. Traceability
- [ ] Open `docs/qa/assessments/epic-A-landing-onboarding-trace-YYYYMMDD.md`.
- [ ] Map every story acceptance criterion → one or more test cases.
- [ ] Ensure no orphan tests and no missing coverage.
- [ ] Mark status.

---

## 6. NFR Validation
- [ ] Open `docs/qa/assessments/epic-A-landing-onboarding-nfr-YYYYMMDD.md`.
- [ ] Run Lighthouse (≥90 Accessibility/Performance).
- [ ] Check API p95 latency < 800ms (mock/stub acceptable).
- [ ] Confirm bundle size < 250KB.
- [ ] Validate Clerk session, RBAC, audit events.
- [ ] Mark status.

---

## 7. Security/Compliance
- [ ] Use `docs/qa/gates/security-epic-A-landing-onboarding.md`.
- [ ] Validate Clerk token verification and deny-by-default RBAC.
- [ ] Confirm immutable audit stubs for login/team/session actions.
- [ ] Mark status.

---

## 8. Final Gate Review
- [ ] Update `docs/qa/gates/review-epic-A-landing-onboarding.md`.
- [ ] Summarize results of all gates (Risk, Design, Test Design, Traceability, NFR, Security).
- [ ] Give overall verdict: PASS / CONCERNS / FAIL.
- [ ] If CONCERNS → log tickets. If FAIL → block merge until fixed.

---

## ✅ Definition of Done (QA)
- All assessment docs completed and statuses recorded.
- Gate review updated with overall verdict.
- Story A0–A2 considered QA-complete and ready for merge/release if **PASS**.
