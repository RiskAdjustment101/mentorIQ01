# QA Gate — Traceability Matrix (epic-A-landing-onboarding)

**Story Reference**: `docs/stories/stories-epic-A-landing-onboarding.md`  
**Date**: [YYYY-MM-DD]  
**Owner**: QA  

---

## 1. Requirements → Tests Mapping

| Requirement (from story) | Test Case ID | Test Type (unit/integration/e2e) | Status |
|---------------------------|--------------|----------------------------------|--------|
| Landing fits 1366×768 no scroll | TC-A0-001 | e2e (Playwright viewport) | Pending |
| CTA opens Clerk sign-in/sign-up | TC-A0-002 | e2e (Clerk modal) | Pending |
| Redirects to /dashboard | TC-A0-003 | integration | Pending |
| Copy matches (H1, subtext, bullets) | TC-A0-004 | unit (snapshot) | Pending |
| Lighthouse Accessibility ≥ 90 | TC-A0-005 | automated (CI Lighthouse) | Pending |
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
