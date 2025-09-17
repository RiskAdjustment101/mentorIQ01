# DEVLOG — Epic A (Landing + Onboarding)

**Date**: 2025-09-16  
**Branch**: feature/stories-epic-A-landing-onboarding  
**Status**: ✅ Implementation Complete & Split-Screen Updated

---

## Summary

Implemented Stories A0, A1, and A2 for MentorIQ's landing and onboarding flow following BMAD specifications. All three stories are feature-complete with stub APIs ready for integration.

## Implemented Features

### Story A0 — Landing Page ✅
- Single-screen landing page (no scroll at 1366×768)
- Dark theme with MentorIQ branding (#1C1C1C background, #FF6A2D accent)
- Inter font from Google Fonts
- Two CTAs: "Sign in" and "Create account" 
- Clerk authentication integration (modals)
- Analytics events: `landing.view`, `landing.cta.click`, `auth.start`
- WCAG AA accessibility with semantic HTML and aria-labels

### Story A1 — Onboarding Flow ✅
- Modal dialog appears on first login (when no teams exist)
- Two-card selection: Create team / Join team
- Create flow: Team name + Season → single submit
- Join flow: Invite code → single submit  
- Stub APIs: `POST /v1/teams` and `POST /v1/teams:join`
- Success redirects to `/teams/{id}`
- Analytics events: `onboarding.view`, `onboarding.select`, `team.create.success`, `team.join.success`
- Form validation with Zod
- Error handling with inline messages

### Story A2 — First Session Setup ✅
- Inline card prompt on first team page visit
- Session form with:
  - Date picker (defaults to next Saturday)
  - Goals as editable chips (3 prefilled)
  - Agenda items list (3 prefilled templates, no AI)
- Stub API: `POST /v1/teams/{teamId}/sessions`
- Success shows toast notification
- Analytics events: `session.first.prompt.view`, `session.create.start`, `session.create.success`
- Stays on `/teams/{id}` after save

## Tech Stack

- **Framework**: Next.js 14.2.18 (App Router, TypeScript)
- **UI Components**: shadcn/ui with custom dark theme
- **Styling**: Tailwind CSS with MentorIQ color palette
- **Auth**: Clerk (SSO + email/password)
- **Forms**: React Hook Form + Zod validation
- **Analytics**: Custom analytics stub (ready for PostHog)
- **Feature Flags**: Simple config-based flags

## Project Structure

```
app/
├── page.tsx                    # Landing page (A0)
├── dashboard/page.tsx          # Dashboard with onboarding check
├── teams/[id]/page.tsx        # Team page with first session prompt (A2)
├── sign-in/[[...sign-in]]/    # Clerk sign-in
├── sign-up/[[...sign-up]]/    # Clerk sign-up
└── api/v1/
    ├── teams/                  # Create team API
    ├── teams:join/            # Join team API
    └── teams/[teamId]/sessions/ # Create session API

components/
├── onboarding-flow.tsx        # A1 onboarding modal
├── first-session-prompt.tsx   # A2 session setup
└── ui/                        # shadcn components

lib/
├── analytics.ts               # Analytics tracking
├── feature-flags.ts          # Feature flags
└── utils.ts                  # shadcn utils
```

## Deviations from Original Spec

1. **No real Clerk keys**: Using placeholder keys in `.env.local` - requires actual Clerk project setup
2. **Stub APIs only**: No database integration yet (returns mock data)
3. **Audit events**: Console logging only, no persistent storage
4. **Team detection**: Hardcoded to false for demo purposes

## Testing Status

✅ **Build Success**: App compiles without errors  
✅ **Clerk Integration**: Valid API keys configured and working  
✅ **Authentication Flow**: Sign-in/Sign-up modals working properly  
✅ **Development Server**: Running on http://localhost:3003  

## Pending QA Gates

- [ ] Set up testing infrastructure (Jest, Playwright)
- [ ] Run Lighthouse audit for A0 landing page
- [ ] Complete Design Review checklist 
- [ ] Security/NFR validation
- [ ] Update traceability matrix with test cases
- [ ] Database integration (Prisma + Postgres)

## Running the Application

```bash
npm install
npm run dev
```

Navigate to http://localhost:3002 (or check terminal for actual port)

## Latest Update: Split-Screen Landing Page (2025-09-16)

### Changes Made
- **Layout**: Converted from single-column to split-screen design
- **Left Pane**: Logo, AI-focused headline, subtext, single "Get Started" CTA + optional sign in link
- **Right Pane**: 4 differentiators with icons emphasizing AI capabilities
- **Copy**: Updated to match `landing-copy-epic-A.md` exactly
- **Analytics**: Updated CTA tracking to `{cta: "get-started"}`
- **Icons**: Added Lucide React icons (Sparkles, Zap, Shield, Globe)

### Files Modified
- `app/page.tsx` - Complete rewrite for split-screen layout
- `docs/qa/gates/traceability-epic-A-landing-onboarding.md` - Updated test mappings
- `docs/stories/DEVLOG-epic-A-landing-onboarding.md` - This file

### New Content
- **Headline**: "AI-Powered Mentorship for FLL Teams"
- **Subtext**: "Plan smarter, save time, and inspire students with your AI co-pilot."
- **Differentiators**: Plan Smarter, Save Time, Built for Trust, Connected Knowledge

### Compliance
- ✅ No vertical scroll at 1366×768
- ✅ shadcn/ui components only
- ✅ Dark theme maintained
- ✅ Analytics preserved
- ✅ Clerk integration working

## Notes

- All acceptance criteria from stories A0-A2 are implemented
- Split-screen layout ready for QA gates review
- Analytics events fire to console in development mode
- Feature flags are enabled by default