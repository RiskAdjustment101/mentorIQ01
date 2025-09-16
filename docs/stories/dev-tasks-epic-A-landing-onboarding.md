# Dev Tasks — Epic A (Landing + Onboarding)

**Stories**: A0 (Landing), A1 (Onboarding Create/Join), A2 (First Session Setup)  
**Stack**: Next.js (App Router, TS), shadcn/ui, Tailwind, Clerk, Prisma (stub), Postgres (stub), PostHog (analytics placeholder)

---

## 0) One-time Project Setup
- [ ] Initialize Next.js (App Router, TS).  
- [ ] Install Tailwind + configure `globals.css`.  
- [ ] Install **shadcn/ui** and init components.  
- [ ] Install **Clerk**; set env keys; wrap root layout with ClerkProvider.  
- [ ] Add **Inter** via Google Fonts; set as global font.  
- [ ] Add **ui-theme** tokens (dark palette + orange) to `tailwind.config.js` and CSS vars.  
- [ ] Create feature flags registry (simple config file).  
- [ ] Add basic analytics stub (PostHog or console placeholders).  
- [ ] Add Lighthouse CI config for perf/a11y checks in CI.  

---

## A0 — Landing Page (No Scroll)
**Goal**: Single-screen landing communicating value + CTAs to start auth.

### Build
- [ ] Route: `/` (public).  
- [ ] Layout: logo, H1, subtext, three bullets, two CTAs (Sign in / Create account).  
- [ ] Use shadcn **Button**, **Card/Text**, **Separator** as needed.  
- [ ] Apply **dark theme** colors + Inter font.  
- [ ] Ensure **no vertical scroll** at 1366×768 (adjust spacing, font-size if needed).  
- [ ] CTAs trigger Clerk **SignIn** / **SignUp** modals.  
- [ ] Successful auth redirects to `/dashboard`.  

### Analytics
- [ ] `landing.view` on mount.  
- [ ] `landing.cta.click` with `{ cta: "signin"|"create" }`.  
- [ ] `auth.start` + `auth.success` with `{ method }`.  

### Tests
- [ ] e2e: viewport 1366×768 → no scrollbars.  
- [ ] e2e: CTAs open Clerk modals and complete auth → redirect `/dashboard`.  
- [ ] a11y: axe + Lighthouse ≥ 90.  
- [ ] snapshot: headline/subtext/bullets exact text.  

---

## A1 — Onboarding: Create or Join Team (≤2 Clicks)
**Goal**: After first login, modal asks to **Create** or **Join** a team.

### Build
- [ ] Detect first login & zero-team state (API stub or in-memory mock initially).  
- [ ] Show shadcn **Dialog** with two large **Card** options: Create / Join.  
- [ ] **Create**: inline name input + season dropdown → **Create** button (1 submit).  
- [ ] **Join**: invite code input → **Join** button (1 submit).  
- [ ] On success, route to `/teams/{id}` (stub page).  
- [ ] Persist role rules: creator = Mentor; join uses role from invite.  
- [ ] Error states: invalid invite → inline error.  

### API (stub for now; real in later stories)
- [ ] `POST /v1/teams` → returns `{ id }`.  
- [ ] `POST /v1/teams:join` with `{ code }` → returns `{ id }`.  

### Analytics
- [ ] `onboarding.view` when modal appears.  
- [ ] `onboarding.select` with `{ option: "create"|"join" }`.  
- [ ] `team.create.success` / `team.join.success` with `{ teamId }`.  

### Tests
- [ ] e2e: first login shows modal; returning users with team do **not** see it.  
- [ ] e2e: create flow → navigates to `/teams/{id}`.  
- [ ] e2e: join flow (valid/invalid code).  
- [ ] perf: p95 action latency < 800ms (mock).  
- [ ] a11y: keyboard focus trapped in modal; labels connected to inputs.  

---

## A2 — “Your First Session” Guided Setup
**Goal**: Quick win — create first session skeleton on the team page (no AI).

### Build
- [ ] On first visit to `/teams/{id}`, show inline **Card**: “Create your first session.”  
- [ ] Form: Date (default this week), Goals (chips), Agenda items (3 prefilled editable).  
- [ ] Save → `POST /v1/teams/{id}/sessions` → add to list; toast success; stay on page.  
- [ ] Use shadcn **Form**, **Input**, **Badge/Chips**, **Button**.  

### Prefill Agenda (non-AI)
- [ ] “Kickoff & roles”  
- [ ] “Mission overview”  
- [ ] “Hands-on build time”  

### Analytics
- [ ] `session.first.prompt.view`  
- [ ] `session.create.start`  
- [ ] `session.create.success` with `{ sessionId }`  

### Tests
- [ ] e2e: prompt visible for new team; hidden when at least one session exists.  
- [ ] integration: submit creates session and renders in list.  
- [ ] a11y: form labels, error messages, focus management.  

---

## Cross-cutting: Security/Compliance
- [ ] Clerk session validated server-side on protected routes.  
- [ ] Deny-by-default: no access to `/teams/{id}` without membership.  
- [ ] Immutable audit events (stub) for team create/join/session create (record actor/action/id).  
- [ ] PII minimization in logs; correlation IDs on requests.  

---

## Cross-cutting: Performance & Accessibility
- [ ] Lighthouse ≥ 90 for Performance & Accessibility on `/` and `/teams/{id}`.  
- [ ] LCP < 2.5s (optimize images/fonts; `display=swap`).  
- [ ] Ensure contrast ratios meet WCAG AA.  
- [ ] Visible orange focus rings on all interactive elements.  

---

## Definition of Done (for Story A0–A2)
- [ ] All acceptance criteria in the story document are met.  
- [ ] All QA gates completed: Design, NFR, Risk, Test Design, Traceability, Security.  
- [ ] `review-epic-A-landing-onboarding.md` marked **PASS**.  
- [ ] Analytics events verified in dev tools / logs.  
- [ ] Feature flags toggles documented.  
