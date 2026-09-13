# PetCare — Figma Design Guide

Everything you need to build the prototype in Figma: design tokens, component inventory, and the full screen list with what goes on each. Follow this in order and your Figma file will map 1:1 onto the Tailwind/CSS implementation.

---

## 1. Design Principles

1. **Warm, not clinical** — animal welfare is emotional; soft shapes and warm accents, but data (progress bars, ratings) stays crisp and trustworthy.
2. **Trust through transparency** — money-related UI always shows live numbers, not marketing claims.
3. **Accessible by default** — WCAG AA contrast, 44px minimum touch targets, never color-only status (icon + color + label).
4. **Mobile-first** — most users arrive from a phone share link; design the 390px frame first, then expand to 1440px.

## 2. Design Tokens

### Color Palette — v6 "Scholarships Corner" adaptation (current web theme)

Light, friendly, rounded: **white canvas · cyan `#06a2be` as the single dominant accent · Plus Jakarta Sans headings · pill buttons · big soft shadows.** Extracted from the reference design system and mapped onto PetCare's semantics: cyan = normal info/CTA · green = success/available · red breaks the pattern only for emergencies · blue = complementary highlights.

#### Brand
| Role | Token | Hex |
|---|---|---|
| Primary accent / CTA | `brand/500` | `#06A2BE` |
| Primary hover | `brand/600` | `#0587A0` |
| Complementary highlight | `brand2/500` | `#1DA1F2` |

#### Background & surfaces
| Role | Token | Hex |
|---|---|---|
| Page canvas | `background` | `#FFFFFF` |
| Alternate section band | `ink/50` | `#F7F7F7` |
| Light tint band — cyan (pets / campaigns headers, home "Fund a treatment") | `brand/50` | `#ECF9FC` |
| Light tint band — blue (karma header) | `brand2/50` | `#E9F6FE` |
| Light tint band — green (vets header) | `leaf/50` | `#F2F8EC` |
| Card surface | `card` | `#FFFFFF` |
| Dark CTA band / Adopted badge | `ink/900` | `#212623` |
| Footer | `ink/800` | `#333333` |

#### Text & neutrals
| Role | Token | Hex |
|---|---|---|
| Primary text | `ink/800` | `#333333` |
| Secondary/muted text | `ink/500` | `#666666` |
| Hairlines / input borders | `border` | `#E6E6E6` |

#### Functional
| Role | Token | Hex |
|---|---|---|
| Success / available / funded | `leaf/500` | `#6CB24C` |
| Emergency & rescue | `danger/500` | `#E83030` |
| Emergency surface | `danger/50` | `#FDEDED` |

**Where each colour is used**

- 🏠 **Homepage** — background white, navbar white, logo tile `#06A2BE` with ink wordmark. Primary CTA "Find Your Companion" in cyan `#06A2BE`; secondary CTA "Help an Animal" in dark ink `#333333` (the reference design's dark button). Rescue chip stays red-bordered.
- 🐕 **Adoption cards** — white with real photos; leaf-green "Available" chips, cyan info chips, red favourite heart (filled). Status badges: Available = leaf green, Pending = blue `#1DA1F2`, Fostered = neutral grey, Medical hold = cyan, Adopted = solid ink `#212623` + white text.
- 🆘 **Emergency (Rescue)** — the pattern-break surface: pale red `#FDEDED` hero, solid red `#E83030` buttons, critical badge red / urgent badge blue.
- 💰 **Donations** — Donate button cyan `#06A2BE`, progress bar cyan, "100% funded" milestone in leaf green `#6CB24C`; campaign cards open with a real photo banner.
- 🏥 **Vet directory** — clinical-calm: cyan icon chips, leaf-green star ratings, red "Emergency" outline badges, grey "Verified".
- 🐾 **Lost & Found** — match-suggestion card in pale blue `#E9F6FE` with blue "Searching" badges; reunited states flip to leaf green.
- 🪙 **Karma** — balance card solid ink `#212623` with white number, cyan rank-1 medal, blue rank-3 "you" highlight.

**Surfaces (all flat, no decorative gradients, no glass blur):** hero = white · alternate bands = `#F7F7F7` · rescue surfaces = `#FDEDED` · CTA band = `#212623` · footer = `#333333` with white/60 text.

**Light colour accents (v8):** to keep the white canvas from feeling sterile, a few pages use a full-width header band tinted with the palette's own 50-step: Adopt `#ECF9FC` (cyan) · Campaigns `#ECF9FC` · Vets `#F2F8EC` (green) · Karma `#E9F6FE` (blue) · Blood bank `#FDEDED` (red, shared with Rescue). White remains the dominant surface everywhere; tints never carry text colour changes.

**Photography (v8):** all photos are real street dogs and cats of Dhaka and South Asia (deshi dogs, street tabbies, community feeders) — no studio/purebred stock. Sources are Wikimedia Commons / Flickr under Creative Commons, credited in `public/images/CREDITS.md`. Pet breeds in the seed data were updated to match (Deshi mix, not Golden Retriever/Samoyed/Siamese).

<details>
<summary>Legacy v5 palette (Sage + Cream + Coral) — deprecated</summary>

| Token | Hex |
|---|---|
| `sage/500` | `#557A63` |
| `coral/500` | `#E58B78` |
| `cream` | `#F9F6EF` |

</details>

<details>
<summary>Legacy v3 palette (cat-colours "Pawfect": ginger / paw-pink) — deprecated</summary>

| Token | Hex |
|---|---|
| `ginger/600` | `#BC6517` |
| `pawpink/500` | `#D85479` |
| `canvas` | `#FFFBF4` |

</details>

<details>
<summary>Legacy v2 palette (violet "Twilight Rescue") — deprecated</summary>

| Token | Hex |
|---|---|
| `primary/600` | `#7C3AED` |
| `accent-fuchsia/500` | `#D946EF` |
| `canvas` | `#FBFAFF` |

</details>

<details>
<summary>Legacy v1 palette (orange/stone) — deprecated</summary>

| Token | Hex |
|---|---|
| `primary/600` | `#EA580C` |
| `secondary/700` | `#0F766E` |
| `canvas` | `#FAFAF9` |

</details>

### Typography

- **Headings:** Plus Jakarta Sans, weight **700** (reference type scale: H1 48px · H2 31px · H3 23px)
- **Body/UI:** Inter, weight 400/500, 16px base, 1.4 line height
- **Fallback for Bangla text:** Hind Siliguri

Scale: `48` hero (mobile 36) · `31` page title · `23` section · `16` card title · `14` body · `12` caption/badge

### Shape & Elevation

- Buttons, chips, badges, tabs, inputs: **pill** (radius 50px on standard heights; the reference's "rounded corners 50px+ feel")
- Cards: **28px** radius · dialogs 24px · photos on cards inherit the card radius
- Shadows (extracted system): cards `rgba(0,0,0,0.1) 0 10px 30px` · hero imagery `rgba(0,0,0,0.1) 0 0 60px` · hover/modal `rgba(0,0,0,0.2) 2px 8px 23px 3px`
- Spacing: 10px base grid (20/30/40/60 section rhythm) · page gutters 16px mobile / 64px desktop
- Touch targets: min 44px on mobile; max-width 1152px content container

## 3. Component Inventory (build these as Figma Components)

| Component | Variants |
|---|---|
| **Button** | primary / secondary / outline / ghost × sm,md,lg × enabled,hover,disabled,loading |
| **Chip (filter)** | unselected / selected / removable |
| **Pet Card** | listing (photo, name, chips, shelter) / compact list row / featured hero |
| **Status Badge** | available · pending · adopted · medical hold · fostered (icon+color+label) |
| **Campaign Card** | with progress bar, donor count, days left; completed state |
| **Progress Bar** | default / goal-reached (confetti moment!) |
| **Clinic Card** | rating, emergency flag 🔴, low-cost tag, hours |
| **Review Item** | stars, comment, author, date |
| **Form Field** | text / select / textarea / checkbox / radio-card (home type) × default,focus,error |
| **Nav Bar** | guest / logged-in / role-specific (shelter gets "＋ Add Pet") |
| **Stat Tile** | label, big number, delta arrow (dashboards) |
| **Karma Pill** | points balance, +N earned toast |
| **Empty State** | illustration, message, primary action |
| **Timeline Step** | application status tracker (submitted→review→decision) |

## 4. Screen List (14 screens — prototype in this order)

### 🔵 Auth & Onboarding
1. **Onboarding / Role Select** — 3 big illustrated cards: *I want to adopt · I'm a shelter/rescue · I'm a vet*. Karma explainer footer.
2. **Login / Register** — email+password, role pre-set from card 1; shelter/vet adds org name + license number field.

### 🟠 Discovery (public)
3. **Home** — hero search ("Find your best friend"), featured pets carousel, active campaigns strip, nearby vets teaser, karma banner for logged-in users.
4. **Pet Listing** — filter chips row (species, age, size, energy, good-with), sort dropdown, responsive grid of Pet Cards, result count, empty state.
5. **Pet Detail** — photo carousel with dots, name + status badge, quick facts grid (age/size/gender/energy/vaccinated/neutered), "good with" icons row, story section, medical history accordion, shelter card, sticky bottom bar: **Adopt Me** (primary) + ♡ Save + Donate.
6. **Adoption Application** — multi-step form: (1) about home — radio-cards apartment/house/farm, (2) experience & household checkboxes, (3) message + confirm. Progress dots on top.
7. **Campaign Detail** — cover photo, story, big progress block (raised / goal / % / donors), donor wall avatars (anonymous = paw icon), updates feed, donate sticky bar.
8. **Donation Flow (modal)** — amount quick-picks (৳500 / ৳1000 / ৳2500 / custom), optional name display + anonymous toggle, payment method radio (bKash/Nagad/Card), success screen with karma +N toast.

### 🟢 Vet & Safety
9. **Vet Directory** — search bar, map/list toggle, filter chips (open now · emergency · low-cost), Clinic Cards with ratings.
10. **Clinic Detail** — header with emergency badge, hours table, services chips, reviews list, "Register my pet as blood donor" cross-link, **Post blood request** (vet role).
11. **Blood Bank Board (U1)** — open requests as urgent cards (species, type, deadline countdown), matched eligible donors list, "I can come in" button → contact reveal.
12. **Lost & Found (U2)** — two-tab board (Lost / Found), report cards with photo + area + date, big "File a report" FAB, match suggestion banner: *"87% match found — is this Simba?"*

### 🟣 Dashboards (logged-in)
13. **Shelter Dashboard** — stat tiles row (residents, pending applications, active campaigns, funds raised this month), applications inbox with approve/reject, my pets table, add pet FAB.
14. **Donor/Adopter Dashboard** — my applications timeline, donation history rows with receipts, karma card (balance + redeem), reminders list, virtual foster updates feed (photos/letters).

## 5. Figma Workflow Tips

- **Start with a Cover page**: project name, mission line, palette swatches — looks great in the viva/demo.
- Create **local styles** named exactly like the tokens above (`primary/600`, `ink/900`…) so CSS/Tailwind maps 1:1.
- Build components with **Auto Layout** everywhere; use **Variants** for button/badge states.
- Prototype 2 golden flows end-to-end: **Adopt** (Screen 4→5→6→confirmation) and **Donate** (Screen 7→8→success). These two are your demo money shots.
- Use real seed data from `database/seed_data.sql` as sample content (Max, Mishti, Kalu…) — the prototype will match the web build exactly.
- Export the design-system page as PNG for the project report's design chapter.
