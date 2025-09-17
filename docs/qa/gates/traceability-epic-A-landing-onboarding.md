# QA Gate — Traceability Matrix (epic-A-landing-onboarding)

**Story Reference**: `docs/stories/stories-epic-A-landing-onboarding.md`  
**Date**: [YYYY-MM-DD]  
**Owner**: QA  

---

## 1. Requirements → Tests Mapping

| Requirement (from story) | Test Case ID | Test Type (unit/integration/e2e) | Status |
|---------------------------|--------------|----------------------------------|--------|
| Landing fits 1366×768 no scroll | TC-A0-001 | e2e (Playwright viewport) | Updated |
| Split-screen layout (left/right panes) | TC-A0-001b | e2e (layout verification) | Pending |
| Single "Get Started" CTA opens Clerk | TC-A0-002 | e2e (Clerk modal) | Updated |
| Optional "Sign in" link works | TC-A0-002b | e2e (Clerk modal) | Pending |
| Redirects to /dashboard | TC-A0-003 | integration | Pending |
| AI-focused copy matches spec | TC-A0-004 | unit (snapshot) | Updated |
| 4 differentiators with icons displayed | TC-A0-004b | unit (component render) | Pending |
| Lighthouse Accessibility ≥ 90 | TC-A0-005 | automated (CI Lighthouse) | Pending |
| Analytics tracks "get-started" CTA | TC-A0-006 | unit (analytics spy) | Updated |
| Onboarding modal shows at first login | TC-A1-001 | e2e | Pending |
| Create team flow (1 click) | TC-A1-002 | e2e | Pending |
| Join team flow (invite code) | TC-A1-003 | e2e | Pending |
| First session setup card shows | TC-A2-001 | e2e | Pending |
| Session saved with agenda JSON | TC-A2-002 | integration | Pending |

---

## 2. Coverage
- 100% of story acceptance criteria mapped to at least one test case.  
- No orphan tests (all map to a requirement).  

---

## Result
- PASS = Full coverage mapped  
- CONCERNS = Partial mapping, gaps documented  
- FAIL = Missing coverage for critical requirements  
