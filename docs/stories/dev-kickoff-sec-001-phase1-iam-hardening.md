# Dev Kickoff — SEC-001 Phase 1 IAM Hardening

You are the **Dev Agent**. Implement Story **SEC-001** to deliver Tenancy (RLS), RBAC, Consent-on-reads, Tamper-evident Audit, and JWT/Webhook hardening.

---

## Context files to load
- docs/stories/story-sec-001-phase1-iam-hardening.md
- docs/qa/assessments/sec-001-risk-YYYYMMDD.md
- docs/qa/assessments/sec-001-test-design-YYYYMMDD.md
- docs/qa/assessments/sec-001-trace-YYYYMMDD.md
- docs/qa/assessments/sec-001-nfr-YYYYMMDD.md
- docs/qa/gates/review-sec-001-phase1-iam-hardening.md
- docs/architecture/ARCHITECTURE.md
- docs/architecture/adr/ADR-001-tech-decisions.md
- docs/architecture/adr/ADR-002-security-openapi.md
- docs/architecture/adr/ADR-003-neon-vs-supabase.md

---

## Objectives
1. **Tenancy + RLS**
   - Apply SQL migration `migrations/0001_init.sql` (see below).
   - Add per-request DB context: `SET app.user_id`, `SET app.org_id` after Clerk JWT verification.
   - Enable RLS and deny-by-default on tenant tables.

2. **RBAC (roles/permissions)**
   - Replace enum roles with `roles`, `permissions`, `role_permissions`.
   - Update `team_members` to `role_id`.
   - Enforce membership + role checks on `/teams/{id}` read/write routes.

3. **Consent on reads**
   - Use `has_active_consent(user_id, child_ref)` and consent-aware views for any child-linked reads.
   - Block reads when consent is missing or revoked.

4. **Tamper-evident audit**
   - Use append-only `audit_events` with hash chain (`prev_hash`, `self_hash`).
   - Write logs **only** via `SELECT log_audit(...)`.

5. **JWT & Webhook hardening**
   - Validate Clerk JWTs (iss, aud, exp, nonce, clock skew).
   - Verify webhook signatures; add secret rotation hooks.

---

## Deliverables
- `migrations/0001_init.sql` applied to Neon (Postgres).
- Backend middleware:
  - Clerk JWT verification → resolve db `user_id` → `SET app.user_id`, `SET app.org_id`.
  - Centralized deny-by-default authorization — membership + role check for `/teams/{id}`.
- API changes:
  - Use consent-aware views; use `log_audit()` for all mutating actions.
- Tests/CI:
  - **RLS Isolation**: cross-org read/write attempts → DENY (CI DB suite).
  - **RBAC**: admin/mentor/parent_viewer behavior tests.
  - **Consent**: with/without/revoked → 200/403.
  - **Audit**: UPDATE/DELETE blocked; hash chain continuity verified.
  - **JWT/Webhooks**: valid/invalid claim tests; signature verification tests.
- Docs: update traceability matrix with test IDs.

---

## Acceptance Criteria
- Cross-org access is blocked by RLS.
- `/teams/{id}` is inaccessible to non-members (even if authenticated).
- RBAC supports `admin` (all), `mentor` (read + session.write), `parent_viewer` (read-only).
- Consent revocation blocks reads.
- Audit rows are append-only; hash chain continuity validated in CI.
- JWT/webhook tests pass.

---

## Process
- Step 1: Apply migration; wire middleware; update routes.
- Step 2: Implement tests and CI job(s).
- Step 3: Produce evidence (logs/artifacts) and update traceability.
- Step 4: **STOP** and request QA review via `docs/qa/qa-kickoff-sec-001-phase1-iam-hardening.md`.

---

## Stop Condition
Do **not** merge. Stop when all tests pass locally and in CI, and hand off to Quinn (QA) to fill assessments and update the gate review.
