# 📑 Product Requirements Document (PRD)

**Product**: MentorIQ Desktop App (SaaS-first, AI-on-top)
**Version**: v0.1
**Date**: 2025-09-16

---

## 1. Overview

**Mission**: Empower every mentor to deliver world-class STEM experiences to every child, anywhere.

**Problem**:

* Mentors are overwhelmed by prep, lack structure, and have limited time.
* Parents want clarity and trust in how their children are being mentored.
* Students disengage when mentoring feels chaotic or unstructured.

**Goal**:
Deliver a **desktop browser app** that lowers barriers, builds mentor confidence through small wins, and provides transparent reporting for parents.

---

## 2. Users & Personas

### 🎓 Mentor

* Volunteer, parent, or STEM professional.
* Pain: Prep takes hours, lacks guidance.
* Need: Easy setup, structured session plans, visible team progress.

### 👩‍👩‍👧 Parent

* Guardian of FLL student.
* Pain: Hard to know what kids actually do in sessions.
* Need: Trust & transparency, simple weekly digest.

### 🧑‍🎓 Student (indirect user)

* Age 9–16, participates in FLL teams.
* Pain: Sessions chaotic, inconsistent.
* Need: Clear tasks, fun, engagement.

### 🛠️ Org Admin (school/club)

* Coordinator of multiple teams.
* Need: View all teams, confirm consents, ensure compliance.

---

## 3. Features & Requirements

### 3.1 Authentication & Access Control

* SSO via **Clerk** (Google, Microsoft).
* RBAC: roles = Mentor, Parent, Student (proxy), Org Admin.
* Consent gate required before any child-linked data is written.

### 3.2 Teams

* Create/join team.
* Invite members via email.
* Manage roles.

### 3.3 Sessions

* Create/edit sessions with agenda, goals, outcomes.
* View past sessions.
* Attach tasks.

### 3.4 Tasks

* Create/edit tasks (title, assignee, due date, status).
* Link tasks to sessions.
* Simple Kanban view for mentors.

### 3.5 Reports

* Weekly digest auto-generated from sessions & tasks.
* Shareable link or emailed to parents.

### 3.6 Consents

* Parents must verify consent for child participation.
* Track scope, method, timestamp.
* Revocation disables child-linked writes.

### 3.7 Audit

* Immutable event log for all mutating actions.
* Each log includes actor, action, resource, timestamp.

---

## 4. Non-Functional Requirements (NFRs)

* **Performance**:

  * p95 read < 400ms, write < 800ms.
* **Reliability**:

  * 99.9% uptime for core SaaS APIs.
* **Security**:

  * RBAC enforced server-side.
  * Rate limiting per user & IP.
  * All data encrypted at rest & in transit.
* **Accessibility**:

  * WCAG 2.1 AA compliance.
* **Compliance**:

  * COPPA/parental consent enforced.
  * Immutable audit trail.

---

## 5. Out of Scope (MVP)

* AI Copilot features (session planner, Q\&A, digest summarizer).
* Marketplace for mentor playbooks.
* Multi-team analytics dashboards.
* Advanced integrations (Teams/Slack/Calendar).

---

## 6. Success Metrics

* ≥70% activation (mentors create first session within 24h).
* ≥60% Weekly Active Mentor (WAM) retention by week 8.
* ≥65% parent digest open rate.
* Zero unauthorized writes.
* Accessibility Lighthouse score ≥90.

---

## 7. Risks & Mitigations

* **Mentor resistance to “another tool”** → keep MVP flow simple: sign-in → create team → create session.
* **AI overpromises** → defer AI to Phase 2, SaaS first.
* **Compliance gaps** → enforce consent + audit from day one.
* **Adoption churn** → measure WAM early, run mentor pilot council for feedback.
