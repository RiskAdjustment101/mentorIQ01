# QA Gate — Security & Compliance Checklist (epic-A-landing-onboarding)

**Story Reference**: `docs/stories/stories-epic-A-landing-onboarding.md`  
**Date**: [YYYY-MM-DD]  
**Owner**: Security/Compliance Lead  

---

## 1. Authentication
- [ ] Clerk session tokens validated server-side.  
- [ ] Sign-in options restricted to Google, Microsoft, email/password (as per story).  
- [ ] No bypass routes for auth flows.  
- [ ] Session expiration + refresh tested.  

## 2. RBAC & Authorization
- [ ] Roles correctly assigned on team creation (Mentor as default).  
- [ ] Invite flow assigns roles based on invite.  
- [ ] No access to `/teams/{id}` without membership.  
- [ ] Deny-by-default checks confirmed on backend.  

## 3. Consent (future-proofing)
- [ ] Story does not yet handle child data, but consent enforcement hooks are present.  
- [ ] Consent model integrated with API contracts (`/v1/consents`).  
- [ ] Revocation rules documented for next epics.  

## 4. Audit Logging
- [ ] All mutating actions (`create team`, `join team`, `create session`) generate immutable audit events.  
- [ ] AuditEvent includes: actor, action, resource, resourceId, timestamp, correlationId.  
- [ ] Audit logs stored in Postgres, append-only.  

## 5. Compliance Controls
- [ ] TLS enforced end-to-end.  
- [ ] PII minimization in logs (no emails/child names).  
- [ ] Feature flags allow disabling risky features.  
- [ ] Secrets managed in Vercel/Fly vaults.  

---

## Result
- PASS = All checks validated.  
- CONCERNS = Minor issues logged.  
- FAIL = Critical auth/RBAC/audit gaps.  
