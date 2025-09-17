# Remediation Tracker — SEC-001 Phase 1 IAM Hardening

**Story:** docs/stories/story-sec-001-phase1-iam-hardening.md
**Owner:** Security / QA / Dev
**Date:** YYYY-MM-DD

---

## 🔴 Critical Must-Fix Items
- [ ] **RLS Misconfiguration**
  - Verify `org_id` present on all tenant tables.
  - Ensure RLS policies applied; cross-org reads/writes DENY by default.
  - CI test: attempt cross-org access → blocked.

- [ ] **RBAC Bypass**
  - Replace enum roles with `roles`, `permissions`, `role_permissions`.
  - Update `team_members` to use `role_id`.
  - API middleware enforces deny-by-default.

- [ ] **Consent Enforcement**
  - Function `has_active_consent(user_id, child_ref)` implemented.
  - Views enforce consent on reads.
  - Test: revoked consent → 403 or empty.

- [ ] **Audit Tampering**
  - `audit_events` append-only (triggers prevent UPDATE/DELETE).
  - `prev_hash`, `self_hash` hash chain in place.
  - CI check: hash chain continuity validated.

- [ ] **JWT/Webhook Forgery**
  - Strict Clerk JWT validation (iss/aud/exp/nonce).
  - Webhook signature verification; key rotation documented.
  - Tests for expired, bad audience, unsigned tokens.

---

## 🟡 High Priority
- [ ] **Performance**
  - Indexes on `org_id`, join keys, `occurred_at`.
  - RLS overhead <10% (EXPLAIN ANALYZE proof).
  - CI performance budget enforced.

- [ ] **Observability**
  - Alerts on JWT/webhook validation failures.
  - Metrics for audit event rate, login failures.

- [ ] **Retention & Privacy**
  - Audit logs retention policy separate from user PII.
  - Purge job for `login_events`; tombstone user deletions.

---

## 🟠 Medium Priority
- [ ] **Failed Login Telemetry**
  - Record failed auth attempts (no sensitive info).
  - Dashboard for anomalies (brute force/stuffing).

- [ ] **Network Resilience**
  - Retry/backoff for API failures.
  - Graceful error handling + offline state messaging.

- [ ] **Docs Gaps**
  - Update API doc (OpenAPI/Prisma).
  - Add test guide + developer onboarding notes.

---

## ✅ Definition of Done
- All 🔴 critical items closed and verified by QA.
- Gate review in `docs/qa/gates/review-sec-001-phase1-iam-hardening.md` updated to **PASS**.
- CI artifacts show:
  - RLS isolation tests passing.
  - JWT/webhook negative tests passing.
  - Audit immutability and hash chain continuity validated.
- Performance budget + retention jobs in place.

---

## Notes
- Any **CONCERNS** from Quinn must be logged here until resolved.
- Once all are checked, Story SEC-001 is merge-ready.
