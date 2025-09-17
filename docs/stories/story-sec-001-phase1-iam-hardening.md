# Story SEC-001 — Phase 1 IAM Hardening

**Epic:** Security Foundations
**Date:** 2025-09-17
**Owner:** Security / IAM

---

## Context
The IAM review identified critical gaps in tenancy isolation, RBAC flexibility, consent enforcement, audit immutability, and webhook/token trust. These must be addressed before onboarding real users to ensure compliance (COPPA/FERPA) and prevent data leaks.

---

## Goals
- Establish **tenancy isolation** via Postgres Row-Level Security (RLS)
- Introduce **flexible RBAC model** (roles, permissions, role-permission map)
- Enforce **consent checks** on reads and writes
- Guarantee **tamper-evident audit logs**
- Harden **Clerk JWT/webhook validation**

---

## Functional Requirements
1. **Tenancy**
   - Add `orgs` table and `org_id` FK to `teams`, `team_members`, `audit_events`, `login_events`, `consents`
   - Enable RLS on all tables, deny-by-default
   - Session context: `SET app.org_id` and `SET app.user_id`

2. **RBAC**
   - Create `roles`, `permissions`, `role_permissions`
   - Update `team_members` to reference `role_id`
   - Remove enum-based roles

3. **Consent**
   - Add DB function `has_active_consent(user_id, child_ref)`
   - Views must enforce consent on all child-linked reads

4. **Audit**
   - Convert `audit_events` to append-only with trigger
   - Add `prev_hash`, `self_hash` chain for immutability
   - Expose logging only via `log_audit()` function

5. **AuthN / AuthZ Hardening**
   - Verify Clerk JWTs: issuer, audience, exp, nonce
   - Validate webhook signatures, consider mTLS
   - Rotate signing secrets regularly

---

## Non-Functional Requirements
- ✅ Must pass QA risk + design gate for Security (Quinn)
- ✅ CI job runs RLS isolation tests (cross-org read/write must fail)
- ✅ Audit append-only validated in CI with continuity check
- ✅ JWT validation unit tests present

---

## Out of Scope
- MFA, SCIM, anomaly detection (planned for Phase 2)
- UI updates (back-end only)

---

## Acceptance Criteria
- Cross-org access attempts return **DENY**
- RBAC supports at least: `mentor`, `parent`, `admin`
- Consent revocation blocks future reads
- Audit log entries cannot be modified/deleted
- JWT/webhook validation passes security tests
