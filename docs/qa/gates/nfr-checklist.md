# QA Gate — NFR Review Checklist

**Reference**: `docs/qa/`  
**Purpose**: Validate that each story meets performance, security, accessibility, and reliability baselines.

---

## 1. Performance
- [ ] p95 read API latency < 400ms  
- [ ] p95 write API latency < 800ms  
- [ ] LCP < 2.5s on desktop (1366×768, cable profile)  
- [ ] JS bundle < 250KB per route (excluding fonts)  

## 2. Accessibility
- [ ] Lighthouse Accessibility ≥ 90  
- [ ] Contrast ratios meet WCAG 2.1 AA  
- [ ] Focus rings visible on all interactive elements  
- [ ] Semantic headings (`h1`, `h2`, …)  

## 3. Reliability
- [ ] Error rate < 0.5% in staging load test  
- [ ] Graceful error handling (user-facing messages)  
- [ ] Retry logic for network/API calls  

## 4. Security & Compliance
- [ ] Clerk session tokens validated server-side  
- [ ] RBAC enforced (no unauthorized access)  
- [ ] Consent enforced before child-linked writes  
- [ ] All mutating calls audited (immutable event log)  

---

## Result
- PASS = All boxes checked  
- CONCERNS = Minor gaps logged as tickets  
- FAIL = Major gaps; story cannot merge  
