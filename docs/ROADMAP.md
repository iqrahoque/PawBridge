# PetCare — Roadmap

Semester-friendly phased plan. Each phase ends with a demo-able artifact, so even a partial build presents well.

---

## Phase 0 — Research & Specification ✅
- [x] Problem statement & goals (`docs/PROJECT_SPEC.md`)
- [x] Roles, features, user stories, priorities frozen
- **DoD:** spec reviewed by team; feature list signed off.

## Phase 1 — Database Design & Implementation ✅
- [x] ER model, 29 tables, normalization notes (`docs/DATABASE_DESIGN.md`)
- [x] DDL with triggers & views (`database/schema.sql`)
- [x] Seed data + 10 showcase queries
- [ ] Load on team MySQL, run all showcase queries, screenshot results for the report
- **DoD:** `schema.sql` + `seed_data.sql` import cleanly on MySQL 8; every showcase query returns sane results.

## Phase 2 — Figma Prototype (≈1.5 weeks)
- [ ] Set up file: cover, styles from `FIGMA_DESIGN_GUIDE.md` tokens
- [ ] Build 14 components with variants
- [ ] Prototype golden flows: **Adopt** and **Donate** end-to-end
- [ ] User-test with 3–5 friends; note frictions
- **DoD:** clickable prototype of 14 screens; design-system page exported for the report.

## Phase 3 — Project Scaffold & Auth (≈1 week)
- [ ] Next.js + TypeScript + Tailwind + Prisma scaffold
- [ ] Prisma schema generated from `schema.sql` (MySQL provider)
- [ ] JWT auth: register/login/roles middleware
- **DoD:** deployable skeleton; role-protected routes return 403 correctly.

## Phase 4 — Core Modules M1–M4 (≈3 weeks)
- [ ] M1: pet listing + filters + detail + application flow
- [ ] M2: campaigns + donations (demo payment) + wish lists
- [ ] M3: vet directory + reviews + reminders
- [ ] M4: dashboards (shelter first — it's the demo star)
- **DoD:** all MVP user stories 1–6 pass manually against seeded data.

## Phase 5 — Differentiators U1–U3 (≈1.5 weeks)
- [ ] U1 Blood Bank: donor registry + request board + match query (Q8) as API + UI
- [ ] U2 Lost & Found: boards + match suggestions + admin confirm
- [ ] U3 Karma: ledger hook on actions + leaderboard + one redemption flow
- **DoD:** all three demoable live; karma increments visibly during the demo script.

## Phase 6 — Polish, Test & Present (≈1 week)
- [ ] Responsive pass (390px first), empty states, loading skeletons
- [ ] Seed demo script: a rehearsed 5-minute walkthrough (adopt → donate → blood match → karma)
- [ ] Report: ERD + normalization + screenshots + queries
- [ ] Deploy (Vercel + PlanetScale/TiDB free tier, or local XAMPP fallback for the viva machine)
- **DoD:** viva-ready build + report chapter drafts.

---

## Demo Script (5 minutes — rehearse this)

1. **Home** → hero search → filter "cats, good with kids" → open **Mishti**.
2. **Adopt flow** → application form → submit → shelter dashboard shows it (switch role!) → approve → pet flips to pending/adopted *(trigger magic)*.
3. **Donate flow** → Max's campaign → ৳1,000 → progress bar rises, karma toast appears.
4. **Blood bank** → critical DEA 1.1⁻ request → two eligible donors listed → call button.
5. **Karma leaderboard** → donor at top with deed types; redeem free vet checkup.
6. Close on the **safe haven** screen — "and this is the feature nobody else has."
