# ADR-003 — Neon vs Supabase

# ADR-003 — Database Platform Decision: Neon vs Supabase

**Date**: 2025-09-17
**Status**: Accepted
**Context**: Story A (Landing + Onboarding) is moving into secure persistence. We need a Postgres-based system that aligns with IAM, audit, and BMAD guardrails.

---

## Options Considered

### Option A — Supabase
- ✅ Fully managed Postgres + batteries-included (auth, storage, APIs).
- ✅ Rich ecosystem, fast prototyping.
- ⚠️ Supabase Auth duplicates Clerk; we’d disable it.
- ⚠️ More “platform lock-in” (functions, triggers auto-managed).
- ⚠️ Scaling model is less granular; enterprise tenancy less transparent.

### Option B — Neon
- ✅ Serverless Postgres with branching (great for PR-based CI).
- ✅ Separation of **AuthN (Clerk)** and **DB as SoR** fits IAM plan.
- ✅ Easier to enforce RLS, RBAC, and audit immutability without vendor overlays.
- ✅ Lower overhead for append-only audit + hash-chain.
- ⚠️ Newer ecosystem (fewer one-click features than Supabase).
- ⚠️ Need to self-wire authz, storage, real-time if required.

---

## Decision

We choose **Neon** as the system of record database.
- It provides **raw Postgres control** → critical for **Row-Level Security**, **tamper-evident audit**, and **consent enforcement**.
- Branching allows **ephemeral environments per PR**, aligning with CI/CD.
- Clerk continues to be IdP-of-record; no feature overlap with Neon.
- Supabase’s value-adds (auth, storage, real-time) can be selectively re-introduced later if needed.

---

## Consequences

- Dev team must provision Neon projects and manage schema migrations (Prisma or SQL).
- Must implement RBAC, RLS, and consent logic manually (not via Supabase policy editor).
- Loss of Supabase real-time APIs — will revisit when we need push-based updates.
- Cleaner IAM compliance: single source of truth in Neon, no duplication with Clerk.

---

## References
- IAM Review (User Model) — tenancy, RBAC, audit chain recommendations.
- BMAD Guiding Principles — keep dev agents lean, architecture explicit:contentReference[oaicite:0]{index=0}.
- Core Architecture — ADRs stored under `docs/architecture/adr/`:contentReference[oaicite:1]{index=1}.
