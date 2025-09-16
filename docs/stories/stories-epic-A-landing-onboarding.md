# Stories — Epic A: First Impressions (Landing + Onboarding)
**Principles**: shadcn/ui components, Tailwind, minimalism, **single-screen (no scroll)** landing; clear value prop; immediate SSO or email/password entry via Clerk.

---

## Story A0 — Landing Page (Single-screen, No Scroll)
**Goal**: Communicate “what MentorIQ solves” in one glance and drive Sign In / Create Account.

### Scope
- Single, above-the-fold layout; **no vertical scrolling** on common desktop resolutions (≥1366×768).
- Elements (top→bottom): Logo/Brand, 1-liner value prop, 3 short bullets, CTAs: **Sign in** / **Create account**, footer with minimal legal links.
- Visuals: shadcn/ui components; neutral palette; high contrast; responsive to laptops and large desktops.

### Requirements
- **Content**:
  - H1: “Mentoring, made simple.”
  - Subtext: “Plan sessions, track progress, and keep parents in the loop — all in minutes.”
  - Bullets (≤8 words each): “Plan weekly sessions”, “Assign & track tasks”, “Share parent digests”
- **CTAs** (shadcn buttons): Primary = “Sign in”; Secondary = “Create account”
- **Auth entry**: Clicking CTAs opens Clerk modal/sheet with SSO (Google, Microsoft) + email/password.
- **Accessibility**: WCAG AA; focus indicators; semantic headings; aria-labels for CTAs.
- **Performance**: LCP target <2.5s on cable desktop profile.
- **No marketing scroll**: if content exceeds viewport, compress spacing / reduce font sizes; do not add sections.

### Acceptance Criteria
- [ ] At 1366×768, entire landing content fits without vertical scrollbars.
- [ ] Both CTAs open Clerk flows (SSO + email/password) and return to `/dashboard` on success.
- [ ] Lighthouse Accessibility ≥ 90, Performance ≥ 90.
- [ ] Copy matches exactly (H1/subtext/bullets) and is editable via config file.

### Analytics
- `landing.view`
- `landing.cta.click` {cta: "signin" | "create"}
- `auth.start` {method: "google"|"microsoft"|"email"}
- `auth.success` {method}

### Flags
- `ui.landing.v1` (default ON)

### Dependencies
- Clerk configured; routes for `/sign-in`, `/sign-up`, post-auth redirect to `/dashboard`.

## Alignment Requirements
- Must follow `docs/architecture/ARCHITECTURE.md` (SaaS-first, Clerk, API contracts)
- Must use `docs/architecture/ui-theme.md` (dark background, Inter font, orange accent, shadcn/ui components)
- Must respect QA gates in `docs/qa/` (accessibility ≥ AA, performance targets, audit/compliance)

---

## Story A1 — Onboarding: Create or Join Team (≤2 Clicks)
**Goal**: After auth, get mentors into a team with minimal friction.

### Scope
- **Welcome dialog** (shadcn dialog/sheet) immediately after first login.
- Two big cards: **Create a team** / **Join a team**; short helper text below each.
- If Create → inline name input + season dropdown → **Create** (1 click).
- If Join → invite code input → **Join** (1 click).
- Success routes to `/teams/{id}` dashboard.

### Requirements
- **Flow**:
  - First login detection (no teams) triggers modal.
  - Create = single form (Team name, Season), defaults provided; submit creates team and adds current user as Mentor.
  - Join = invite code validates; on success, user added to team with role from invite.
- **Accessibility & UX**: keyboard-first; labels tied to inputs; error text under fields.
- **Performance**: Actions complete <800ms p95 (excluding network variance).
- **Resilience**: Invalid code shows inline actionable error; retry allowed.

### Acceptance Criteria
- [ ] New users see onboarding modal automatically; returning users with ≥1 team do not.
- [ ] Create flow completes with 1 submit action; Join flow completes with 1 submit action.
- [ ] On success, user lands in `/teams/{id}` with team header visible.
- [ ] p95 latency for create/join API < 800ms in staging.

### Analytics
- `onboarding.view`
- `onboarding.select` {option: "create"|"join"}
- `team.create.success` {teamId}
- `team.join.success` {teamId}

### Flags
- `onboarding.v1` (default ON)

### Dependencies
- Teams API (`POST /v1/teams`, join via invite), Clerk session, redirect handler.

---

## Story A2 — “Your First Session” Guided Setup
**Goal**: Give mentors a quick win by drafting their first session skeleton (manual, no AI in MVP).

### Scope
- Within `/teams/{id}` on first visit: a small inline card prompt “Create your first session” with **Start** button.
- Simple session form: Date (default this week), Goals (chips), Agenda items (3 prefilled suggestions the user can edit).
- On save, session appears in list and sets homepage context for the team.

### Requirements
- Prefill 3 agenda items with generic templates (non-AI): “Kickoff & roles”, “Mission overview”, “Hands-on build time”.
- Allow add/remove/reorder with shadcn primitives (input, badge/chips, drag optional later).
- Accessibility AA; form validation with clear inline errors.
- Performance: save < 800ms p95.
- Copy concise; no modals after save (land back on Sessions list).

### Acceptance Criteria
- [ ] First-time team view shows “Create your first session” card.
- [ ] Saving creates a `Session` with agenda JSON and appears in list immediately.
- [ ] Post-save redirect remains on `/teams/{id}` with success toast (shadcn).
- [ ] Lighthouse Accessibility ≥ 90.

### Analytics
- `session.first.prompt.view`
- `session.create.start`
- `session.create.success` {sessionId}

### Flags
- `sessions.first.v1` (default ON)

### Dependencies
- Sessions API (`POST /v1/teams/{teamId}/sessions`), team context loader, toasts.
