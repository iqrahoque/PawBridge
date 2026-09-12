# 🐾 PetCare

> **Adopt. Donate. Heal.**
> A database-driven platform that connects adopters, shelters, veterinary clinics and donors — helping dogs & cats in Bangladesh find homes, funds and medical care.

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

## 🗂 Repository Structure

```
PetCare/
├── README.md                    ← you are here
├── docs/
│   ├── PROJECT_SPEC.md          # Vision, user roles, features, user stories
│   ├── DATABASE_DESIGN.md       # ER diagram, table docs, normalization, indexes
│   ├── FIGMA_DESIGN_GUIDE.md    # Design system + all screens to prototype
│   ├── API_DESIGN.md            # REST API endpoints
│   └── ROADMAP.md               # Phased build plan (semester-friendly)
├── database/
│   ├── schema.sql               # Full MySQL 8 DDL — 29 tables, triggers, views
│   ├── seed_data.sql            # Realistic demo data (Dhaka-flavored 🇧🇩)
│   └── queries/
│       └── showcase_queries.sql # 9 impressive SQL queries for demos & viva
└── .gitignore
```

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| 🎨 Design | **Figma** | UI/UX prototype, design system, developer handoff |
| 🖥 Frontend | **Next.js (React) + Tailwind CSS** | Fast to build, SEO-friendly, matches Figma tokens |
| ⚙️ Backend | **Next.js API Routes / Node.js** | One language across the stack, JWT auth |
| 🗄 Database | **MySQL 8** | Battle-tested relational DB — ideal for a DB course project |
| 🔷 ORM | **Prisma** | Type-safe queries, migrations generated from schema |

---

## 🚀 Database Quickstart

```bash
# 1. Create the database
mysql -u root -p -e "CREATE DATABASE petcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Load the schema (29 tables + triggers + views)
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
| 1 — Database Design | ✅ Done ([ERD](docs/DATABASE_DESIGN.md), [SQL](database/schema.sql)) |
| 2 — Figma Prototype | 🔜 In progress ([design guide](docs/FIGMA_DESIGN_GUIDE.md)) |
| 3 — Backend & API | 🔜 Next ([API design](docs/API_DESIGN.md)) |
| 4 — Web Frontend | 🔜 Planned ([roadmap](docs/ROADMAP.md)) |

---

## ❤️ Who This Helps

- **People** — find the right pet, give transparently, locate trusted vet care
- **Dogs & Cats** — get adopted faster, funded medical care, emergency blood donors
- **Shelters** — free tools for listings, applications, campaigns and analytics
- **Vets** — visibility, new clients, urgent donor matching

---

*Made with 🧡 for the streeties of Dhaka.*
