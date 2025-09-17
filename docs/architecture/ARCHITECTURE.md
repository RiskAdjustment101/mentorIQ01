# MentorIQ — System Architecture (SaaS-first, AI-on-top)

## 0. Purpose
Concise, implementation-ready outline of the platform architecture and the technology choices, following the philosophy: **design a static, API-first SaaS as the system of record; layer AI on top as a strictly bounded consumer**.

---

## 1. Architecture Principles
- **Separation of concerns**: SaaS owns facts, permissions, and workflows; AI consumes SaaS via contracts.
- **API-first**: Everything expressible through **versioned OpenAPI**; UI and AI are just clients.
- **Contracts over prompts**: AI I/O validated against **JSON Schemas**; writes use **two-phase commit** (propose→confirm→commit).
- **Compliance-by-design**: Consent, RBAC, audit, and PII handling live in the SaaS, not the model context.
- **Observability & governance**: Full tracing from user → AI tools → SaaS APIs → DB; immutable audit events.

---

## 2. High-Level System
- **Client (Desktop browser)**: Next.js App Router UI (TypeScript)
- **SaaS Core**: Next.js API routes + Prisma ORM → Postgres (Neon/Supabase)
- **Auth**: Clerk for identity; app-enforced RBAC/tenancy; consent + audit in DB
- **AI Plane (later)**: Python FastAPI `ai-gateway` (stateless) with retrieval & model adapters
- **Storage**: Object storage for reports/exports (Supabase Storage or S3-compatible)
- **Observability**: OpenTelemetry, structured logs, Sentry, product analytics

```mermaid
flowchart LR
  User[[Browser UI]] -->|HTTPS| Web[Next.js (UI+API)]
  Web -->|Prisma| DB[(Postgres: Neon/Supabase)]
  Web -->|Signed REST| AIGW[FastAPI ai-gateway]
  AIGW -->|RAG| Vec[(pgvector / vector store)]
  AIGW -.->|No direct DB writes| DB
  Web -->|Storage SDK| Obj[(Object Storage)]
  subgraph Security & Governance
    Clerk[(Clerk Auth)] --> Web
    Audit[(Audit Log)] --> DB
  end
```

---

## 3. Technology Choices Matrix

| Layer | Primary Choice | Why | Alternatives |
|---|---|---|---|
| UI framework | **Next.js (App Router, TS)** | Universal rendering, strong DX | Remix, SvelteKit |
| UI toolkit | **Tailwind + shadcn/ui** | Accessible, fast iteration | Chakra UI, MUI |
| Auth | **Clerk** | SSO, orgs, MFA | Auth0, Cognito |
| API style | **REST via Next Route Handlers** | Simpler, OpenAPI-friendly | tRPC, GraphQL |
| Validation | **Zod (web)** / **Pydantic (AI svc)** | End-to-end validation | Valibot, Marshmallow |
| DB | **Postgres (Neon)** | Serverless PG, RLS, audit control (ADR-003) | Supabase, RDS, Cloud SQL |
| ORM | **Prisma** | Type-safe, migrations | Drizzle, Knex |
| Cache | **Upstash Redis** | Serverless, edge-friendly | ElastiCache, MemoryStore |
| Storage | **Supabase Storage / S3** | Simple reports | R2, GCS |
| Observability | **OTel + Grafana/Datadog**, **Sentry** | Traces + errors | New Relic, Honeycomb |
| Analytics | **PostHog** | Open-core | Amplitude, Mixpanel |
| Feature flags | **Unleash / GrowthBook** | OSS, experiments | LaunchDarkly |
| Hosting | **Vercel (web)**, **Fly/Render (FastAPI)** | Simple deploys | AWS/GCP full-IaC |
| Search/RAG | **pgvector** | Simple start | Qdrant, Pinecone |
| Models | **Azure OpenAI / OpenAI** | Data controls | Anthropic, Mistral |
| CI/CD | **GitHub Actions** | Standard | CircleCI, Buildkite |
| Rate limiting | **Upstash Ratelimit** | Edge-friendly | API Gateway |

---

## 4. SaaS-First Scope (Phase 1)
**Domain (v1 minimal)**: Users, Teams, TeamMembers, Sessions, Tasks, Reports, Consents, AuditEvents

**Public API (OpenAPI v1)**:
- `GET /v1/me`
- `GET/POST /v1/teams` ; `GET /v1/teams/{teamId}`
- `GET/POST /v1/teams/{teamId}/sessions` ; `GET /v1/sessions/{sessionId}`
- `GET/POST /v1/teams/{teamId}/tasks` ; `PATCH /v1/tasks/{taskId}`
- `POST /v1/teams/{teamId}/reports/weekly` ; `GET /v1/reports/{reportId}`
- `POST /v1/consents` ; `GET /v1/consents/{childRef}`
- `GET /v1/audit?teamId=...`

**Security**: Clerk JWT → RBAC/tenancy checks; consent enforced; rate limits.

---

## 5. AI Layer (Phase 2, on top)
- **Service**: Python FastAPI `ai-gateway` (stateless).
- **Capabilities**:
  - Read tools (`get_team_state`, `get_docs`)
  - Generate (`generate_session_plan`)
  - Summarize (`summarize_for_parents`)
- **Writeback**: Two-phase commit (proposal → confirm → commit).
- **Retrieval**: pgvector index over approved docs.
- **Guardrails**: Schema outputs, citations required, prompt redaction.

---

## 6. Environments & Ops
- **Envs**: dev → staging → prod (feature flags for AI).
- **Secrets**: managed in Vercel/Fly vaults.
- **Backups**: scheduled snapshots; object lifecycle rules.
- **DR**: runbooks + RTO/RPO targets.

---

## 7. Delivery Plan
- **Milestone A (Weeks 1–2)** — SaaS skeleton
- **Milestone B (Weeks 3–4)** — Hardening (RBAC, rate limits, observability)
- **Milestone C (Weeks 5–6)** — AI read/generate (RAG + proposals)
- **Milestone D (Weeks 7–8)** — Summaries, telemetry, pilot rollout

---

## 8. Governance & Compliance
- **Consent-first architecture**.
- **Immutable audit** on all mutating calls.
- **Data minimization** in prompts.
- **Least privilege** service accounts.
- **Access reviews** as standard ops.

---

## 9. Open Questions
- Neon vs Supabase for storage needs?
- REST-only vs GraphQL/tRPC later?
- Azure OpenAI vs OpenAI (procurement)?
- Feature flag provider?
- Where to host ai-gateway (Fly vs Render)?

---

## 10. One-Page Summary
**Thesis**: Build a **contract-first SaaS** that is useful on its own; then expose typed, audited capabilities to an **AI overlay** that is constrained, cited, and reversible. This separates *facts & compliance* (SaaS) from *assistive intelligence* (AI), enabling speed without sacrificing trust.

---

## References
- ADR-001 — Core Tech Decisions
- ADR-002 — Security & OpenAPI Standards
- ADR-003 — Neon vs Supabase
