# ADR-002 — Security & Compliance + OpenAPI v1 Outline (MentorIQ)

**Status**: Accepted  
**Date**: 2025-09-16  
**Owner**: Architecture

---

## Part A — Security & Compliance Posture

### A1. Principles
- **Consent-first** for minors: no student-linked data creation without validated guardian consent.
- **Least privilege**: role+team scoping, deny-by-default, explicit allow.
- **Immutable audit**: every mutating call recorded with actor, resource, diff, time, origin.
- **PII minimization**: store only what’s necessary; redact from AI prompts and logs.
- **Contracts over prompts**: AI operates via API + schemas; no hidden write paths.
- **Reversibility**: two-phase writes + soft-delete (where lawful) with audit retention.

### A2. Roles & RBAC Matrix (initial)
| Action | Org Admin | Mentor | Parent (viewer) | Student (no-login) |
|---|---:|---:|---:|---:|
| Create Team | ✓ | (by invite) | ✗ | ✗ |
| Invite Members | ✓ | ✓ (to own team) | ✗ | ✗ |
| Create Session | ✓ | ✓ | ✗ | ✗ |
| Manage Tasks | ✓ | ✓ | ✗ | ✗ |
| View Weekly Reports | ✓ | ✓ | ✓ (their child’s team) | ✗ |
| Manage Consent | ✓ | ✗ | ✓ (for their child) | ✗ |
| Read Audit | ✓ (scoped) | ✗ | ✗ | ✗ |

### A3. Data Classes & Handling
- **Identity**: emails, Clerk IDs → hashed in logs; never in model contexts.
- **Minor data**: child_ref (pseudonymous), guardian linkage, consent scope/timestamp.
- **Operational**: sessions, tasks, progress, reports → retained per policy.
- **Derived AI outputs**: treated as *assistive content* until committed.

### A4. Consent Workflow (high level)
1. Guardian identity verified (email/SMS + explicit attestation).
2. Consent record created with **scope** (team, season), **method**, **timestamp**.
3. Any write referencing a child requires active consent; API enforces.
4. Consent revocation cascades to **freeze** child-linked writes and blocks new processing.

### A5. Audit & Monitoring
- **AuditEvent** fields: actor, action, resource, resource_id, before/after (redacted), ip, ua, timestamp, correlation_id.
- **Monitoring**: rate anomalies, authz failures, data egress, AI cost/latency budgets.
- **Alerts**: on failed consent checks, denied writes, unusual access patterns.

### A6. Data Retention & Deletion
- **Default**: operational data retained for current + 1 prior season; reports archived.
- **Right to deletion**: subject to legal constraints; minors’ data removable upon verified request; audit may be retained as legally required.

### A7. Transport & Storage
- TLS 1.2+; HSTS; strict CSP.  
- Encryption at rest for DB & object storage.  
- Secrets in managed vaults; key rotation policy.

---

## Part B — OpenAPI v1 Outline (contract-first)

### B1. Meta
- **OpenAPI**: 3.1  
- **Servers**: `/dev`, `/staging`, `/prod`  
- **SecuritySchemes**:  
  - `clerkSession`: HTTP Bearer (Clerk JWT)  
  - `serviceKey`: HTTP Bearer (internal service-to-service, for background jobs)  
- **Global headers**: `x-request-id`, `x-correlation-id`

### B2. Common Models
- `Problem` (RFC7807): `type`, `title`, `status`, `detail`, `instance`, `errors[]`
- `PageMeta`: `nextCursor`, `prevCursor`, `pageSize`
- `AuditEvent`: { actorUserId, action, resource, resourceId, diff, ip, ua, at }

### B3. Core Resources (schemas)
- `User`: { id, clerkId, email, displayName, roles[] }
- `Team`: { id, orgId?, name, season, createdAt }
- `TeamMember`: { teamId, userId, role, invitedBy?, createdAt }
- `Session`: { id, teamId, date, goals[], agendaJson, createdBy, createdAt }
- `Task`: { id, teamId, sessionId?, title, status, assigneeUserId?, dueAt?, tags[], createdAt }
- `Report`: { id, teamId, periodStart, periodEnd, url, deliveredAt }
- `Consent`: { childRef, guardianUserId, scope, method, verifiedAt }

### B4. Endpoints (paths)
- `GET /v1/me`
- `GET/POST /v1/teams` ; `GET /v1/teams/{teamId}`
- `GET/POST /v1/teams/{teamId}/sessions` ; `GET /v1/sessions/{sessionId}`
- `GET/POST /v1/teams/{teamId}/tasks` ; `PATCH /v1/tasks/{taskId}`
- `POST /v1/teams/{teamId}/reports/weekly` ; `GET /v1/reports/{reportId}`
- `POST /v1/consents` ; `GET /v1/consents/{childRef}`
- `GET /v1/audit?teamId=...`

### B5. Write Safety (AI-compatible)
- Idempotency: all POST/PATCH accept `Idempotency-Key`.
- Two-phase writes: `POST /v1/writes:propose` → validate; `POST /v1/writes:commit` → apply.

### B6. Pagination, Filtering, Sorting
- Cursor-based with `?cursor=`, `pageSize=25` default, max 100.

### B7. Rate Limiting
- Per-user + per-IP buckets. Response headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

### B8. Errors & Validation
- RFC7807 Problem JSON; field-level `errors[]`.

### B9. Security Notes in Contracts
- All paths declare `security: [{ clerkSession: [] }]` (or `serviceKey` for jobs).
- Consent checks explicitly listed in mutating endpoints.
- Audit required for all mutating paths (return `x-audit-id`).

### B10. Versioning & Deprecation
- URI versioning (`/v1`); sunset headers for deprecation.

---

## Part C — Deliverables Checklist
- [ ] Publish **OpenAPI v1** (YAML)
- [ ] Add **JSON Schemas** (`intent.v1`, `write.proposal.v1`, `write.commit.v1`)
- [ ] Create **SECURITY.md** with RBAC, consent, audit model
- [ ] Implement idempotency + rate-limit middleware
- [ ] Stand up observability (traces, error reporting, dashboards)

---

## Part D — Success Criteria
- 100% mutating calls audited with correlation IDs.
- 0 unauthorized writes in penetration tests.
- API SLOs: p95 read < 400 ms; p95 write < 800 ms.
- AI proposals: ≥ 95% pass validation; < 1% hallucination flags.
