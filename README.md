# 🐾 PetCare

> **Adopt. Donate. Heal.**
> A database-driven platform that connects adopters, shelters, veterinary clinics and donors — helping dogs & cats in Bangladesh find homes, funds and medical care.

**🌐 Live demo:** https://iqrahoque.github.io/PetCare/

---

## 📖 About

Every year thousands of street dogs and cats in Dhaka (and across Bangladesh) wait for a family, while shelters struggle with funding and people who *want* to help don't know where to start. **PetCare** is a one-stop hub that solves this with three connected services:

| Service | What it does |
|---|---|
| 🏠 **Adoption Portal** | Filterable listings of adoptable dogs & cats, rich pet profiles, online adoption applications tracked end-to-end |
| 💝 **Donation Services** | Medical funds for individual pets, shelter campaigns, wish lists, transparent progress tracking |
| 🩺 **Vet Directory** | Searchable clinic directory with ratings, emergency & low-cost tags, medical reminders |

Plus **unique differentiator modules** (see [PROJECT_SPEC.md](docs/PROJECT_SPEC.md)):
🩸 Pet Blood Bank · 🐾 Lost & Found Reunification · 🌱 Karma & Impact Ledger · 🏠 Foster-to-Adopt Bridge · 🚐 Rescue Transport Relay · 💌 Virtual Fostering · 🆘 Emergency Safe Haven · 📊 Shelter Pulse Analytics

---

## 🌐 Web Version (this repo, root)

A fully working single-page **Next.js 16 + TypeScript + Tailwind + shadcn/ui + Zustand** app that mirrors the database design 1:1. Because GitHub Pages serves static files only, the demo runs the same seed data client-side and persists interactions (applications, donations, karma, matches) to **localStorage** — every workflow of the real schema is simulated, including:

- Adoption application → pet auto-flips to **pending** (like `trg_application_after_insert`)
- Shelter approval → pet flips to **adopted**, dashboard counters update
- Donation → campaign `raised_amount` progress rises + karma accrues (1 pt / ৳100)
- Blood requests → donors matched by species + blood type + 56/28-day eligibility (live version of showcase query Q8)
- Lost & Found → match suggestion → confirm marks both reports **reunited**

```bash
npm install        # or: bun install
npm run dev        # local dev server on :3000
npm run build      # static export → out/ (basePath /PetCare, ready for GitHub Pages)
npm run lint       # ESLint
```

| Path | What it is |
|---|---|
| `src/data/seed.ts` | TypeScript port of `database/seed_data.sql` |
| `src/lib/store.ts` | Zustand store — the client-side "database" with trigger-like behavior |
| `src/components/petcare/` | All 8 screens (Home, Adopt, Donate, Vets, Blood Bank, Lost & Found, Karma, Dashboard) |
| `src/components/ui/` | shadcn/ui component library |
| `next.config.ts` | Dual mode: dev standalone ↔ `EXPORT_MODE=1` static export with `basePath: /PetCare` |

> Deploying: push the contents of `out/` to the `gh-pages` branch (kept in sync by this project). Pages deploys automatically — do not edit `gh-pages` by hand.

---

## 🗂 Repository Structure

```
PetCare/
├── README.md                    ← you are here
├── src/                         # 🌐 web app (Next.js 16, see above)
├── docs/
│   ├── PROJECT_SPEC.md          # Vision, user roles, features, user stories
│   ├── DATABASE_DESIGN.md       # ER diagram, table docs, normalization, indexes
│   ├── FIGMA_DESIGN_GUIDE.md    # Design system + all screens to prototype
│   ├── API_DESIGN.md            # REST API endpoints (real backend blueprint)
│   └── ROADMAP.md               # Phased build plan (semester-friendly)
├── database/
│   ├── schema.sql               # Full MySQL 8 DDL — 31 tables (incl. rescue network), triggers, views
│   ├── seed_data.sql            # Realistic demo data (Dhaka-flavored 🇧🇩)
│   └── queries/
│       └── showcase_queries.sql # 10 impressive SQL queries for demos & viva
├── package.json                 # web app deps & scripts
└── .gitignore
```

---

## 🗄 Database Quickstart

```bash
# 1. Create the database
mysql -u root -p -e "CREATE DATABASE petcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Load the schema (31 tables + triggers + views)
mysql -u root -p petcare_db < database/schema.sql

# 3. Load demo data
mysql -u root -p petcare_db < database/seed_data.sql

# 4. Try the showcase queries
mysql -u root -p petcare_db < database/queries/showcase_queries.sql
```

> Requires MySQL 8.0.16+ (CHECK constraints are enforced from this version).

---

## 🗓 Status

| Phase | Status |
|---|---|
| 0 — Research & Specification | ✅ Done ([spec](docs/PROJECT_SPEC.md)) |
| 1 — Database Design | ✅ Done — 31 tables incl. Rescue Network ([ERD](docs/DATABASE_DESIGN.md), [SQL](database/schema.sql)) |
| 2 — Figma Prototype | 🎨 Use the [design guide](docs/FIGMA_DESIGN_GUIDE.md) — v2 "Twilight Rescue" palette (violet/lavender) |
| 3 — Web App (demo build) | ✅ **Live** on GitHub Pages — 9 screens incl. Community Rescue Network, 162-donor realistic dataset |
| 4 — Real backend (API + MySQL) | 🔜 Next ([API design](docs/API_DESIGN.md) ready to implement) |

---

## ❤️ Who This Helps

- **People** — find the right pet, give transparently, locate trusted vet care
- **Dogs & Cats** — get adopted faster, funded medical care, emergency blood donors
- **Shelters** — free tools for listings, applications, campaigns and analytics
- **Vets** — visibility, new clients, urgent donor matching

---

*Made with 🧡 for the streeties of Dhaka.*
