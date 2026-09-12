# PetCare — Figma Design Guide

Everything you need to build the prototype in Figma: design tokens, component inventory, and the full screen list with what goes on each. Follow this in order and your Figma file will map 1:1 onto the Tailwind/CSS implementation.

---

## 1. Design Principles

1. **Warm, not clinical** — animal welfare is emotional; soft shapes and warm accents, but data (progress bars, ratings) stays crisp and trustworthy.
2. **Trust through transparency** — money-related UI always shows live numbers, not marketing claims.
3. **Accessible by default** — WCAG AA contrast, 44px minimum touch targets, never color-only status (icon + color + label).
4. **Mobile-first** — most users arrive from a phone share link; design the 390px frame first, then expand to 1440px.

## 2. Design Tokens

### Color Palette — v3 "Pawfect" (current web theme)

Every hue comes straight off a cat: ginger fur, paw-pink beans, white-cat cream, grey-fur neutrals, tuxedo black.

| Token | Hex | Usage |
|---|---|---|
| `ginger/600` | `#BC6517` | Primary CTAs: Adopt Me, Donate, Apply, active nav |
| `ginger/500` | `#D67D28` | Hover, brand moments, logo paw |
| `ginger/50` | `#FDF6EC` | Soft section backgrounds, highlighted cards |
| `pawpink/500` | `#D85479` | Gradient pair with primary (logo, hero text), favourites |
| `pawpink/50` | `#FDF3F6` | Rescue surfaces, pink-paw accents |
| `rescue/600` | `#E11D48` | Rescue network, emergency badges, blood bank |
| `warmth/500` | `#F59E0B` | Karma points (cat-eye gold), badges, awards |
| `greyfur/700` | `#585250` | Lost & Found, info surfaces, neutral chips |
| `emerald/600` | `#059669` | Verified badges, low-cost, success |
| `ink/900` | `#241E1A` | Tuxedo black — primary text, CTA band, footer |
| `ink/500` | `#8A827A` | Secondary text, captions (greyfur/500) |
| `surface` | `#FFFFFF` | Cards, sheets |
| `canvas` | `#FFFBF4` | Page background (white-cat cream) |
| `success` | `#16A34A` | Approved, goal reached |
| `warning` | `#F59E0B` | Pending, near-capacity |
| `error` | `#DC2626` | Rejected, critical urgency |

**Gradients:** hero = ginger blush → paw-pink glow → peach over cream canvas · rescue band = deep paw-pink → warm red · CTA band = tuxedo black with ginger glow. Cards use warm grey-fur shadows and glass (`rgba(255,255,255,0.72)` + blur) on the nav.

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

- **Headings:** Plus Jakarta Sans (SemiBold/Bold) — warm geometric, friendly authority
- **Body/UI:** Inter (Regular/Medium) — dense data stays legible
- **Fallback for Bangla text:** Hind Siliguri

Scale: `40/32` hero · `24` page title · `20` section · `16` card title · `14` body · `12` caption/badge

### Shape & Elevation

- Radius: `16px` cards · `12px` inputs · `999px` chips & pills
- Shadow: `0 2px 8px rgba(28,25,23,0.08)` (cards) · `0 8px 24px rgba(28,25,23,0.12)` (modals)
- Grid: 8pt spacing (4 for micro) · Page gutters 24px mobile / 64px desktop

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
