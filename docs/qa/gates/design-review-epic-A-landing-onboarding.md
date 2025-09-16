# QA Gate — Design Review Checklist (epic-A-landing-onboarding)

**Reference**: `docs/stories/stories-epic-A-landing-onboarding.md`  
**Purpose**: Validate that the implementation aligns with design system and brand guidelines.

---

## 1. Design System
- [ ] All UI built with **shadcn/ui** components.  
- [ ] Tailwind utilities only used for spacing, layout, and responsive tweaks.  
- [ ] No custom raw HTML where a shadcn/ui primitive exists.  

## 2. Theme & Branding
- [ ] Dark background colors (`#1C1C1C`, `#181818`) applied.  
- [ ] Text uses Inter font (white/gray variants).  
- [ ] Accent orange (`#FF6A2D` / hover `#E65C1F`) applied consistently to CTAs/icons.  
- [ ] Copy matches product brief & story requirements exactly.  

## 3. Layout & UX
- [ ] Landing page is **single screen, no scroll** at 1366×768 resolution.  
- [ ] Clear visual hierarchy: logo → headline → bullets → CTAs.  
- [ ] Buttons styled with rounded corners, hover/active states visible.  
- [ ] Inputs/dialogs styled per theme (dark mode, orange focus).  

## 4. Accessibility
- [ ] Color contrast ≥ WCAG AA.  
- [ ] Focus rings visible (orange).  
- [ ] Semantic heading structure (`h1`, `h2`, etc.).  
- [ ] Buttons/links have descriptive text or aria-labels.  

---

## Result
- PASS = All boxes checked  
- CONCERNS = Minor visual issues logged  
- FAIL = Story cannot merge until fixed  
