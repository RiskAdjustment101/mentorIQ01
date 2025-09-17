# ADR-001 — Core Tech Decisions
# ADR-001 — Tech Decisions for MentorIQ (SaaS-first, AI-on-top)

**Status**: Accepted
**Date**: 2025-09-16
**Owner**: Architecture

---

## 1. Context
MentorIQ will be built as a **static, API-first SaaS** (system of record) with **AI layered on top** as a strictly bounded consumer. We need durable choices that optimize developer velocity, compliance, and reliability while keeping AI optional and swappable.

---

## 2. Decision (TL;DR)
- **Frontend**: Next.js (App Router, TypeScript) with Tailwind + shadcn/ui.
- **Auth**: Clerk for authentication/SSO; app-level RBAC/tenancy.
- **API**: REST via Next Route Handlers; **OpenAPI** as contract source of truth.
- **DB**: Postgres on **Neon** (default) or **Supabase**; ORM = **Prisma**.
- **Caching/Ratelimits**: Upstash Redis (serverless).
- **Object Storage**: Supabase Storage or S3-compatible (reports/exports).
- **Observability**: OpenTelemetry (traces/metrics) + Sentry (errors) + PostHog (product analytics).
- **Feature Flags**: Unleash (OSS) or GrowthBook.
- **AI Plane (Phase 2)**: Python FastAPI `ai-gateway`, **pgvector** retrieval (in Postgres), models via **Azure OpenAI** (primary) with provider adapter.
- **AI Writes**: Two-phase commit (propose → confirm → commit) with idempotency keys and full audit.

---

## 3. Rationale
- **SaaS-first usefulness**: Platform must be valuable without AI; contracts enable future clients.
- **Operational clarity**: One writer to DB (Prisma). AI never writes directly; all writes go through API.
- **Compliance-by-design**: Consent, RBAC, and audit are enforced server-side, not in prompts.
- **Swap-ability**: OpenAPI + JSON Schemas + provider adapters allow changing AI vendors later.
- **Cost/complexity balance**: pgvector in Postgres defers external vector stores until scale demands.

---

## 4. Detailed Implications
- **Next.js + Route Handlers** keep a single deployable for UI + API, reduce infra blast radius.
- **Clerk** accelerates SSO/MFA and orgs; RBAC/tenancy rules remain in our code for portability.
- **Prisma** provides type-safe access + migrations; we avoid dual ORMs by blocking Python from the DB.
- **OpenAPI contracts** ensure AI outputs are schema-valid and human-reviewable before commits.
- **Upstash Redis** provides low-friction caching, ratelimits, and idempotency coordination.
- **Azure OpenAI first** aligns with enterprise data controls and predictable SLAs; adapters allow OpenAI/Anthropic fallback.

---

## 5. Alternatives Considered (and rejected for now)
- **GraphQL** instead of REST: richer querying but higher complexity and over-fetch risk; revisit if client diversity grows.
- **tRPC** for end-to-end types: tight coupling to TS; REST + OpenAPI is more language-agnostic for Python/AI.
- **Direct Python DB writes**: increases data integrity risk and dual-ORM drift; rejected.
- **Dedicated vector DB (Pinecone/Qdrant)** now: added ops/cost; defer until pgvector limits are hit.
- **Auth0/Cognito**: viable, but Clerk is faster to integrate in Next.js and fits current needs.

---

## 6. Risks & Mitigations
- **Vendor lock-in (Clerk/Azure OpenAI)** → Mitigate with abstraction layers and exportable data; model/provider adapters.
- **Serverless cold starts** → Prefer regional deploys, keep-hot strategies, and cache read models.
- **Cost drift (LLM usage)** → Per-org token budgets, caching, and cost dashboards; evals to prune low-value calls.
- **Prompt injection via docs** → Strict doc whitelists, content sanitization, output schema validation, and citation checks.

---

## 7. Security & Compliance Posture
- Consent-first for minors; immutable **AuditEvent** on all writes and AI proposals/commits.
- PII minimization; encryption at rest; least-privilege service accounts; rate limits + WAF/CSP headers.
- Redaction in prompts (use stable IDs/aliases); no child names in model contexts.

---

## 8. Rollback Plan
If AI features cause instability/cost spikes: disable with feature flags; SaaS remains fully functional. If Neon/Supabase issues arise: support failover via managed read replicas and snapshot restore runbooks.

---

## 9. Success Metrics
- SaaS p95 read < 400ms; error rate < 0.5%.
- 100% of mutating calls audited; 0 unauthorized writes.
- AI answers with valid citations ≥ 95%; hallucination flags < 1%.
- Mentor prep-time reduction ≥ 30% in pilot; ≥ 60% 8-week retention.

---

## 10. Follow-ups / Open Questions
- Decide Neon vs Supabase based on storage/report needs.
- Choose feature flag platform (Unleash vs GrowthBook) before Milestone B.
- Confirm Azure OpenAI tenancy/region and data handling.
- Define JSON Schemas: `intent.v1`, `write.proposal.v1`, `write.commit.v1` and publish with OpenAPI v1.
