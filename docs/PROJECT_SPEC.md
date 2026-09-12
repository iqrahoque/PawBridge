# PetCare — Project Specification

**Product:** PetCare — *Adopt. Donate. Heal.*
**Type:** Database-centric full-stack web project (+ Figma prototype)
**Version:** 1.0 · September 2026

---

## 1. Problem Statement

In Dhaka alone, estimates suggest **over 1.5 million street dogs and cats** live without stable care. Animal welfare is fragmented: shelters run on Facebook posts and word of mouth, donors never learn whether their money helped, veterinary clinics are hard to discover and compare, and urgent needs (blood transfusions, emergency surgery, crisis fostering) rely on luck.

Meanwhile, thousands of people *want* to help — they just lack a trusted, organized way to do it.

**PetCare** unites these scattered efforts into one database-driven platform with clean roles, verifiable data and transparent tracking.

## 2. Vision & Goals

> Become the trusted bridge between people who care and animals who need — from adoption to donation to veterinary care.

| # | Goal | Success Metric |
|---|---|---|
| G1 | Make adoptable pets discoverable | 100% of partner shelters list pets; <3 clicks to apply |
| G2 | Make donations transparent | Every campaign shows live progress + outcome updates |
| G3 | Make vet care findable | ≥20 clinics listed with ratings & emergency tags |
| G4 | Prove a well-designed relational DB | 3NF schema, 29 tables, integrity via FKs/triggers/views |
| G5 | Offer differentiators competitors lack | ≥2 unique modules fully implemented |

## 3. User Roles & Permissions

| Capability | Guest | Adopter/Donor | Shelter | Vet | Admin |
|---|---|---|---|---|---|
| Browse pets, campaigns, clinics | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit adoption application | — | ✅ | — | ✅ | — |
| Donate / wish-list pledge | ✅ (guest w/ contact) | ✅ | — | ✅ | — |
| Create pet listings / campaigns | — | — | ✅ | — | — |
| Review applications (approve/reject) | — | — | ✅ | — | — |
| Manage clinic profile, reply to reviews | — | — | — | ✅ | — |
| Post urgent blood request | — | — | ✅ | ✅ | — |
| Moderate users, verify shelters/clinics | — | — | — | — | ✅ |
| Access safe-haven case data | — | — | — | — | ✅ (case manager only) |

## 4. Feature Set

### 4.1 Core Modules (MVP)

**M1 — Adoption Portal**
- Pet listings with filter chips: species, breed, age range, size, gender, energy level, good-with kids/dogs/cats, city.
- Rich pet profile: photo gallery, story, medical history, vaccination/neutering flags, shelter contact.
- Adoption application form (home type, experience, message) → status tracked: `submitted → under_review → approved/rejected/withdrawn`.
- Favorites (bookmark pets) and share links.

**M2 — Donation Services**
- Campaigns: shelter-level or pet-specific ("Max needs fracture surgery — ৳1,50,000 goal").
- Live progress bar, donor count, donor wall (anonymous option), updates posted by shelter.
- Shelter wish lists: items (food, blankets, medicine) with quantity needed/fulfilled.
- Payment abstraction: bKash / Nagad / card / cash (demo mode — no live gateway in v1).

**M3 — Vet Directory**
- Clinic cards: address, hours, phone, services, emergency flag, low-cost flag, rating.
- Search + filter by area and service; clinic detail page with reviews.
- Personal medical reminders: vaccines, deworming, vet visits (per user's own pets).

**M4 — Dashboards**
- **Adopter:** application status timeline, favorited pets, reminders, karma balance.
- **Donor:** donation history, campaign updates feed, downloadable receipt rows.
- **Shelter:** pets CRUD, applications inbox, campaigns, wish lists, metrics (views, applications, funds).
- **Vet:** clinic profile, reviews, blood requests posted, donor responses.
- **Admin:** verify shelters/clinics, moderate content, manage karma catalog, safe-haven caseload.

### 4.2 Differentiator Modules (unique selling points)

| ID | Module | One-liner | Priority |
|---|---|---|---|
| U1 | 🩸 **Pet Blood Bank** | Registry of donor pets (species + blood type + eligibility) matched to urgent clinic requests | **P1 — build in v1** |
| U2 | 🐾 **Lost & Found** | Lost/found reports with area matching; admin/moderator confirms matches; (AI image matching = future scope) | **P1 — build in v1** |
| U3 | 🌱 **Karma & Impact Ledger** | Every good deed earns points; redeem for vet discounts / donate-a-meal; public leaderboard | **P1 — build in v1** |
| U4 | 🏠 **Foster-to-Adopt Bridge** | Lifestyle compatibility quiz + 7–30 day foster trial before final adoption | P2 |
| U5 | 🚐 **Rescue Transport Relay** | Multi-leg volunteer transport missions (e.g., Uttara → Chattogram) | P2 |
| U6 | 💌 **Virtual Fostering** | Sponsor a long-stay pet monthly; receive photo/letter/video updates | P2 |
| U7 | 🆘 **Emergency Safe Haven** | Confidential temporary fostering for pets of people in crisis (privacy-first, anonymous codes) | P2 — sensitive, needs admin workflow |
| U8 | 📊 **Shelter Pulse** | Predictive dashboard: intake trends, length-of-stay, capacity alerts | P3 — stretch |

> **Scope decision for v1:** ship M1–M4 + U1, U2, U3. The database schema already models **all** modules (see `database/schema.sql`) so later phases only need UI + API work.

## 5. Key User Stories

1. *As an adopter, I can filter available cats under 1 year that are good with kids, so I find a safe match for my family.*
2. *As an adopter, I can submit an application with my home details, and track its status in my dashboard.*
3. *As a shelter, I can publish a pet in under 2 minutes with photos, story and medical flags.*
4. *As a shelter, I can approve/reject applications and the pet's status updates automatically (trigger).*
5. *As a donor, I can donate ৳500 to Max's surgery fund and instantly see the progress bar rise.*
6. *As a donor, I can pledge 5kg rice to a wish list and mark it fulfilled on delivery.*
7. *As a pet owner, I can register my healthy dog as a blood donor with blood type and weight.*
8. *As a vet, I can post a critical DEA 1.1⁻ blood request and see matched, eligible donors nearby.*
9. *As a pet owner, I can file a lost report; when a matching found report appears, I get notified.*
10. *As a helper, I earn karma points for donating/driving/reviewing, and redeem them for a free vet checkup.*
11. *As a supporter, I can virtually foster Kalu (senior dog) for ৳300/month and receive his weekly updates.*
12. *As an admin, I verify a shelter's license before their campaigns go public.*
13. *As a person in crisis, I can request temporary care for my cat using only an anonymous code.*

## 6. Non-Functional Requirements

- **Security:** bcrypt password hashing, JWT sessions, role-based access control (RBAC) on every endpoint.
- **Privacy:** Safe Haven requests store an anonymous code, never direct identity; case-manager-only visibility.
- **Integrity:** FK constraints with deliberate `ON DELETE` behavior, CHECK constraints, triggers for derived values (`raised_amount`, pet status), transactions for money operations.
- **Performance:** composite indexes on hot paths (pet search, campaign listing, karma leaderboard); views for dashboards.
- **Accessibility (mirrors Figma guide):** WCAG AA contrast, keyboard navigable, min 44px touch targets.
- **i18n-ready:** UTF-8 (`utf8mb4`) throughout — Bangla text supported end-to-end.

## 7. Out of Scope (v1)

- Live payment gateway (Stripe/bKash production keys) — demo mode only
- AI image matching for Lost & Found (schema is ready: match_score field exists)
- Native mobile apps (responsive web only)
- Multi-language UI switching (English first, Bangla-ready)

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Scope creep from 8 unique modules | Delayed viva/demo | P1/P2/P3 priorities frozen in this spec |
| Fake donations in demo | Confusing metrics | Seed script includes verified demo history; demo-mode payments clearly labeled |
| Privacy breach in Safe Haven | Serious harm | No user_id stored; anonymous codes; admin-only access path |
| Team new to Prisma/Next.js | Slower build | ROADMAP.md schedules learning spikes; SQL-first design keeps DB deliverable safe |
