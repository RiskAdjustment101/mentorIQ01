# QA Checklist — Epic A (Landing + Onboarding)

**Reference**: `docs/stories/stories-epic-A-landing-onboarding.md`  
**Alignment**: Architecture, UI Theme, QA Gates

---

## Story A0 — Landing Page
- [ ] Entire page fits on 1366×768 without vertical scroll.  
- [ ] CTAs open Clerk sign-in/sign-up modals (Google, Microsoft, email/password).  
- [ ] Redirect returns to `/dashboard` on success.  
- [ ] Copy matches exactly (H1, subtext, bullets).  
- [ ] Lighthouse Accessibility ≥ 90, Performance ≥ 90.  
- [ ] Analytics events (`landing.view`, `landing.cta.click`, `auth.start`, `auth.success`) logged.

## Story A1 — Onboarding (Create or Join Team)
- [ ] First login without team shows onboarding modal.  
- [ ] Create flow: 1 form (name, season) → creates team → Mentor role assigned.  
- [ ] Join flow: invite code accepted → user joins team.  
- [ ] Errors visible inline; retry allowed.  
- [ ] Redirect to `/teams/{id}` on success.  
- [ ] p95 latency for create/join API < 800ms.  
- [ ] Analytics events (`onboarding.view`, `onboarding.select`, `team.create.success`, `team.join.success`) logged.

## Story A2 — First Session Setup
- [ ] First-time team view shows “Create your first session” card.  
- [ ] Saving creates a session with prefilled agenda JSON.  
- [ ] Redirect stays on `/teams/{id}`, success toast shown.  
- [ ] Lighthouse Accessibility ≥ 90.  
- [ ] Analytics events (`session.first.prompt.view`, `session.create.start`, `session.create.success`) logged.

---

## QA Result
- PASS = All boxes checked + analytics firing + accessibility/performance thresholds met.  
- CONCERNS = Minor issues logged.  
- FAIL = Any acceptance criteria unmet.
