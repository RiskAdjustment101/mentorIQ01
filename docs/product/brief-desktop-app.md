# 📄 MentorIQ Desktop App — Product Brief (Draft v0.1)

## 1. Context

MentorIQ is being designed as a **desktop browser-based app** to help mentors structure, manage, and grow STEM/FLL teams. The app must reduce friction, increase mentor confidence, and ensure parent trust. It will be SaaS-first (stable, structured system of record) with AI layered on top as a copilot.

## 2. Problem

* Mentors face high barriers to entry: session prep is overwhelming, resources scattered, and volunteer time is limited.
* Parents want clarity on what their children are doing and whether mentoring time is valuable.
* Students disengage if sessions are chaotic or unstructured.

## 3. Goal

Build a **desktop app that makes mentoring simple, transparent, and confidence-building** by:

* Providing a structured SaaS foundation (teams, sessions, tasks, reports, consent).
* Giving mentors small, early wins that build confidence.
* Offering parents trusted visibility.
* Creating a path for mentors to grow from beginners to experts.

## 4. Scope (MVP)

* **Authentication**: Clerk SSO (Google, Microsoft).
* **Core SaaS Modules**:

  * Teams (create, join, manage members).
  * Sessions (agenda, goals, progress).
  * Tasks (assign, track, update).
  * Reports (weekly digest for parents).
  * Consents (parental approval for minors).
  * Audit (immutable log of all actions).
* **Desktop Web UI**: Next.js app with a mentor-first dashboard.
* **Metrics foundation**: WAM (Weekly Active Mentors), activation rates, parent digest engagement.

*(AI copilot out of scope for MVP — will come in PRD “future phases”)*

## 5. Success Measures

* 70%+ of mentors create their **first session within 24h of signup**.
* ≥60% **Weekly Active Mentor retention** by week 8.
* ≥65% of parents open digest reports.
* Zero unauthorized writes (audit compliance).
* Accessibility: WCAG 2.1 AA baseline achieved.

---

# 📑 Next: PRD (Outline to Expand)

The PRD will formalize requirements from this brief. **Structure** (BMAD template):

1. **Overview** (Mission, Problem, Goals)
2. **Users & Personas** (Mentor, Parent, Student, Org Admin)
3. **Features & Requirements** (Auth, Teams, Sessions, Tasks, Reports, Consents, Audit)
4. **Non-Functional Requirements** (Performance, Security, Accessibility, Compliance)
5. **Out of Scope (MVP)** (AI copilot, marketplace, advanced analytics)
6. **Success Metrics** (same as brief, with thresholds)
7. **Risks & Mitigations**

---
