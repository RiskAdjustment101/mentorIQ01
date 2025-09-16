# QA Checklist — UI Theme (MentorIQ Dark Mode)

**Reference**: `docs/architecture/ui-theme.md`

---

## 1. Color & Background
- [ ] Background is dark gray (`#1C1C1C` or `#181818`), no unintended light backgrounds.
- [ ] Borders/dividers use `#2E2E2E` or equivalent neutral gray.
- [ ] Accent orange (`#FF6A2D`, hover `#E65C1F`) used consistently for CTAs, icons, and highlights.

## 2. Fonts & Typography
- [ ] Primary font is **Inter** (sans-serif).  
- [ ] Headings: `font-bold`, ~`text-4xl` for H1.  
- [ ] Subtext: `font-medium`, `text-lg`.  
- [ ] Body text: `text-base`.  
- [ ] Buttons: `font-semibold`.

## 3. Components (shadcn/ui)
- [ ] All buttons, dialogs, modals, inputs use **shadcn/ui** primitives.  
- [ ] Tailwind utilities applied only for spacing, layout, and responsive tweaks.  
- [ ] No custom raw HTML where a shadcn/ui component exists.

## 4. Accessibility
- [ ] Contrast ratios meet **WCAG AA**.  
- [ ] All interactive elements have **visible focus rings** (orange).  
- [ ] Headings use semantic tags (`h1`, `h2`, …).  
- [ ] Buttons/links have `aria-label` where text is not descriptive.

## 5. Performance
- [ ] Landing page loads with **LCP < 2.5s** on 1366×768 desktop profile.  
- [ ] Fonts loaded via Google Fonts/Inter with `display=swap`.  
- [ ] No blocking assets larger than 200KB.

---

## Pass/Fail
- PASS = All boxes checked, Lighthouse Accessibility ≥ 90, Performance ≥ 90.  
- CONCERNS = Minor issues found, ticket logged.  
- FAIL = Accessibility or performance thresholds not met.
