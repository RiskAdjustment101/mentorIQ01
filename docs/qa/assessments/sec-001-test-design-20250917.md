# QA Test Design — SEC-001 Phase 1 IAM Hardening

**Date:** 2025-09-17
**Owner:** QA Agent (Quinn)
**Story:** docs/stories/story-sec-001-phase1-iam-hardening.md

---

## Scope
- **RLS Isolation Tests**: cross-org read/write attempts (expect DENY).
- **RBAC Authorization Tests**: admin/mentor/parent_viewer behaviors on team/session endpoints.
- **Consent Enforcement Tests**: with consent, without consent, post-revocation.
- **Audit Immutability Tests**: prevent UPDATE/DELETE; verify hash chain continuity across inserts.
- **JWT/Webhook Validation Tests**: valid + malformed tokens; expired/clock-skew; bad audience/issuer; unsigned or wrong-key webhooks.

## Tooling
- **DB**: psql scripts or Prisma + Node test harness.
- **API**: Playwright (APIRequestContext) or supertest for server routes.
- **Security**: custom test fixtures to craft JWTs/webhooks with invalid claims/signatures.
- **CI**: GitHub Actions job matrix (Neon branch per run), artifacts for logs.

## Pass Criteria
- 100% of acceptance criteria covered with positive + negative tests.
- All isolation/authorization/security tests pass in CI.
- Evidence artifacts (logs, explain analyze, screenshots if applicable) attached to run.

---

## Status
PASS / CONCERNS / FAIL
