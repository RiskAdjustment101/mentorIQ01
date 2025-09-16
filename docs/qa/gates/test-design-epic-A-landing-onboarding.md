# QA Gate — Test Design (epic-A-landing-onboarding)

**Story Reference**: `docs/stories/stories-epic-A-landing-onboarding.md`  
**Date**: [YYYY-MM-DD]  
**Owner**: QA  

---

## 1. Test Scope
- Unit tests for UI components (buttons, dialogs, inputs).  
- Integration tests for Clerk auth flows (sign-in, sign-up).  
- e2e tests for onboarding flow (create/join team).  
- Accessibility tests (axe, keyboard nav).  
- Performance tests (Lighthouse, bundle size).  

## 2. Test Types & Tools
- Unit → Jest + React Testing Library.  
- Integration → Playwright (Clerk modals, API responses).  
- e2e → Playwright (flows: landing → auth → onboarding → team dashboard).  
- Accessibility → axe-core, Lighthouse CI.  
- Performance → Lighthouse, Web Vitals.  

## 3. Pass Criteria
- 100% of acceptance criteria from story covered.  
- Accessibility score ≥ 90.  
- Performance score ≥ 90.  
- All functional flows succeed without errors.  

---

## Result
- PASS = Tests designed and mapped to story requirements  
- CONCERNS = Gaps documented, mitigation planned  
- FAIL = Critical flows untested  
