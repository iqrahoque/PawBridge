/**
 * PetCare — demo dataset.
 * TypeScript port of `database/seed_data.sql` (the MySQL source of truth).
 * The web demo reads this read-only data; user interactions are persisted
 * to localStorage via the zustand store (see src/lib/store.ts).
 *
 * "Today" for the demo = 2026-09-12 (matches the seed data timeline).
 */

export type Species = "dog" | "cat";
export type PetStatus = "available" | "pending" | "adopted" | "medical_hold" | "fostered";
export type Energy = "low" | "medium" | "high";
export type Size = "small" | "medium" | "large";
export type Screen =
  | "home"
  | "pets"
  | "campaigns"
  | "vets"
  | "blood"
  | "lostfound"
  | "karma"
  | "dashboard";

export const TODAY = new Date("2026-09-12T12:00:00");

/* ------------------------------------------------------------------ */
/* Shelters & clinics                                                  */
/* ------------------------------------------------------------------ */

export interface Shelter {
  id: number;
  name: string;
  area: string;
  city: string;
  capacity: number;
  verified: boolean;
  license: string;
}

export const shelters: Shelter[] = [
  {
    id: 1,
    name: "Pawfect Haven Rescue",
    area: "Dhanmondi",
    city: "Dhaka",
    capacity: 120,
    verified: true,
    license: "DAWSH-2019-0142",
  },
  {
    id: 2,
    name: "Dhaka Street Paws Foundation",
    area: "Uttara, Sector 7",
    city: "Dhaka",
    capacity: 200,
    verified: true,
    license: "DAWSH-2021-0311",
  },
];

export interface ClinicReview {
  by: string;
  rating: number;
  comment: string;
}

export interface Clinic {
  id: number;
  name: string;
  area: string;
  address: string;
  phone: string;
  hours: string;
  services: string[];
  emergency: boolean;
  lowCost: boolean;
  verified: boolean;
  reviews: ClinicReview[];
}

export const clinics: Clinic[] = [
  {
    id: 1,
    name: "Care & Cure Veterinary Clinic",
    area: "Gulshan 2",
    address: "Road 41, Gulshan 2, Dhaka",
    phone: "+880 2 900 0001",
    hours: "Sat–Thu 9:00–21:00 · Fri 15:00–20:00",
    services: ["surgery", "vaccination", "blood bank", "dental", "diagnostics"],
    emergency: true,
    lowCost: false,
    verified: true,
    reviews: [
      {
        by: "Sara Chowdhury",
        rating: 5,
        comment: "Dr. Fahim operated on Max — gave us updates at every step. Facility is spotless.",
      },
      {
        by: "Tanvir Ahmed",
        rating: 4,
        comment: "Excellent care, slightly long wait on Fridays. Blood bank on site is a lifesaver.",
      },
    ],
  },
  {
    id: 2,
    name: "Bangladesh Animal Hospital",
    area: "Banani",
    address: "House 11, Road 55, Banani, Dhaka",
    phone: "+880 2 900 0002",
    hours: "Daily 8:00–22:00 · 24h emergency",
    services: ["emergency care", "surgery", "x-ray", "vaccination", "microchipping"],
    emergency: true,
    lowCost: false,
    verified: true,
    reviews: [
      {
        by: "Mitu Akter",
        rating: 5,
        comment: "24h emergency actually means 24h. They saved Pihu at 3 AM.",
      },
    ],
  },
  {
    id: 3,
    name: "PetCare Plus Vet Clinic",
    area: "Mirpur 10",
    address: "Ring Road, Mirpur 10, Dhaka",
    phone: "+880 2 900 0003",
    hours: "Sat–Thu 10:00–19:00",
    services: ["vaccination", "low-cost spay/neuter", "general checkup"],
    emergency: false,
    lowCost: true,
    verified: false,
    reviews: [
      {
        by: "Jenny Fernandes",
        rating: 4,
        comment: "Low-cost neutering for streeties — they even do community animal discounts.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Pets                                                               */
/* ------------------------------------------------------------------ */

export interface Pet {
  id: number;
  shelterId: number;
  name: string;
  species: Species;
  breed: string;
  ageMonths: number;
  size: Size;
  gender: "male" | "female";
  vaccinated: boolean;
  neutered: boolean;
  goodWith: { kids: boolean; dogs: boolean; cats: boolean };
  energy: Energy;
  medicalHistory: string;
  story: string;
  status: PetStatus;
  admissionDate: string; // ISO date
  tags: string[];
  hue: number; // placeholder-art hue
}

export const pets: Pet[] = [
  {
    id: 1,
    shelterId: 1,
    name: "Max",
    species: "dog",
    breed: "Deshi mix",
    ageMonths: 24,
    size: "medium",
    gender: "male",
    vaccinated: true,
    neutered: true,
    goodWith: { kids: true, dogs: true, cats: true },
    energy: "high",
    medicalHistory:
      "Left hind leg fractured in a road accident (Nov 2025). Surgery completed Jan 2026 — fully healed, vet cleared.",
    story:
      "Rescued from the Airport Road median with a broken leg and a wagging tail. Max never stopped trusting people. He will zoom, then nap on your feet.",
    status: "available",
    admissionDate: "2025-11-02",
    tags: ["playful", "affectionate", "loyal"],
    hue: 24,
  },
  {
    id: 2,
    shelterId: 1,
    name: "Mishti",
    species: "cat",
    breed: "Persian mix",
    ageMonths: 12,
    size: "small",
    gender: "female",
    vaccinated: true,
    neutered: true,
    goodWith: { kids: true, dogs: true, cats: true },
    energy: "low",
    medicalHistory: "Healthy. Full vaccination course complete.",
    story:
      "Found as a kitten behind a Dhanmondi sweet shop, she decided humans exist to serve her. Gentle, quiet, occasionally dramatic.",
    status: "available",
    admissionDate: "2026-02-14",
    tags: ["shy", "gentle", "quiet"],
    hue: 330,
  },
  {
    id: 3,
    shelterId: 1,
    name: "Tommy",
    species: "dog",
    breed: "Golden Retriever mix",
    ageMonths: 36,
    size: "large",
    gender: "male",
    vaccinated: true,
    neutered: true,
    goodWith: { kids: true, dogs: true, cats: false },
    energy: "high",
    medicalHistory: "Healthy. Mild seasonal skin allergy — managed with diet.",
    story:
      "Surrendered by a family moving abroad. Tommy knows sit, paw and heartbreak. Best-friend material for an active family.",
    status: "available",
    admissionDate: "2026-03-01",
    tags: ["energetic", "playful", "trained"],
    hue: 40,
  },
  {
    id: 4,
    shelterId: 1,
    name: "Sheru",
    species: "dog",
    breed: "German Shepherd",
    ageMonths: 48,
    size: "large",
    gender: "male",
    vaccinated: true,
    neutered: true,
    goodWith: { kids: true, dogs: false, cats: false },
    energy: "high",
    medicalHistory: "Healthy. Hip x-rays clear.",
    story:
      "Ex-guard dog who decided guarding is overrated. Loyal, smart, needs a confident human. One application under review!",
    status: "pending",
    admissionDate: "2026-01-20",
    tags: ["protective", "smart", "loyal"],
    hue: 15,
  },
  {
    id: 5,
    shelterId: 1,
    name: "Minnie",
    species: "cat",
    breed: "Domestic Short Hair",
    ageMonths: 6,
    size: "small",
    gender: "female",
    vaccinated: true,
    neutered: false,
    goodWith: { kids: true, dogs: true, cats: true },
    energy: "medium",
    medicalHistory: "Healthy. Spay scheduled this month.",
    story: "Pocket-sized chaos gremlin. Will steal your hair ties and your heart.",
    status: "available",
    admissionDate: "2026-07-10",
    tags: ["playful", "curious"],
    hue: 280,
  },
  {
    id: 6,
    shelterId: 2,
    name: "Rani",
    species: "dog",
    breed: "Deshi",
    ageMonths: 18,
    size: "medium",
    gender: "female",
    vaccinated: true,
    neutered: true,
    goodWith: { kids: true, dogs: true, cats: false },
    energy: "medium",
    medicalHistory: "Treated for tick fever (Jun 2026), fully recovered.",
    story:
      "Street-smart and people-soft. Rani was fed daily by a tea-stall owner until she followed him to work one day too many. Currently on a foster trial!",
    status: "available",
    admissionDate: "2026-06-15",
    tags: ["gentle", "street-smart", "affectionate"],
    hue: 0,
  },
  {
    id: 7,
    shelterId: 2,
    name: "Bagha",
    species: "cat",
    breed: "Tabby",
    ageMonths: 30,
    size: "medium",
    gender: "male",
    vaccinated: true,
    neutered: true,
    goodWith: { kids: false, dogs: false, cats: true },
    energy: "low",
    medicalHistory: "Healthy senior-ish gentleman. Dental cleaned Feb 2026.",
    story:
      "The philosopher of the Shelter 2 rooftop. Not a lap cat — a companion cat. Sponsored virtually by his fan club.",
    status: "available",
    admissionDate: "2025-12-05",
    tags: ["independent", "calm", "philosophical"],
    hue: 200,
  },
  {
    id: 8,
    shelterId: 1,
    name: "Pihu",
    species: "cat",
    breed: "Siamese mix",
    ageMonths: 9,
    size: "small",
    gender: "female",
    vaccinated: true,
    neutered: false,
    goodWith: { kids: true, dogs: true, cats: true },
    energy: "medium",
    medicalHistory:
      "Recovered from panleukopenia (Feb 2026) — strong immunity now. On medical hold until final weight check.",
    story: "Fought panleukopenia like a tiger and won. Chatty, opinionated, worth the wait.",
    status: "medical_hold",
    admissionDate: "2026-02-01",
    tags: ["chatty", "resilient", "affectionate"],
    hue: 175,
  },
  {
    id: 9,
    shelterId: 2,
    name: "Kalu",
    species: "dog",
    breed: "Deshi",
    ageMonths: 60,
    size: "medium",
    gender: "male",
    vaccinated: true,
    neutered: true,
    goodWith: { kids: true, dogs: true, cats: true },
    energy: "low",
    medicalHistory:
      "Mild arthritis — managed with supplements. Senior health panels all green.",
    story:
      "Five years old and still waiting. Kalu is the shelter grandfather: calm, gentle, house-trained, endlessly kind with puppies and humans alike.",
    status: "available",
    admissionDate: "2025-09-30",
    tags: ["calm", "gentle", "senior-friendly", "house-trained"],
    hue: 260,
  },
  {
    id: 10,
    shelterId: 2,
    name: "Snowy",
    species: "dog",
    breed: "Samoyed mix",
    ageMonths: 15,
    size: "medium",
    gender: "female",
    vaccinated: true,
    neutered: false,
    goodWith: { kids: true, dogs: true, cats: true },
    energy: "high",
    medicalHistory: "Healthy. Spay appointment pending in Chattogram.",
    story:
      "Born at the shelter, adopted-in-spirit by a family in Chattogram. Now she just needs the ride — transport relay legs are open!",
    status: "available",
    admissionDate: "2025-08-12",
    tags: ["playful", "travel-ready"],
    hue: 215,
  },
];

export const shelterName = (id: number) =>
  shelters.find((s) => s.id === id)?.name ?? "Unknown shelter";

export const daysWaiting = (pet: Pet) =>
  Math.max(0, Math.floor((TODAY.getTime() - new Date(pet.admissionDate).getTime()) / 86400000));

export const ageLabel = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr${y > 1 ? "s" : ""}`;
  return `${y}y ${m}m`;
};

/* ------------------------------------------------------------------ */
/* Campaigns & donations (M2)                                          */
/* ------------------------------------------------------------------ */

export interface Campaign {
  id: number;
  shelterId: number;
  petId: number | null;
  title: string;
  description: string;
  goal: number; // BDT
  status: "active" | "completed";
  endsAt: string;
  updates: { date: string; text: string }[];
}

export const campaigns: Campaign[] = [
  {
    id: 1,
    shelterId: 1,
    petId: 1,
    title: "Max's Fracture Surgery Fund",
    description:
      "Max was hit by a car on Airport Road. Surgery, implants and physiotherapy cost ৳1,50,000. Every taka goes to the clinic directly.",
    goal: 150000,
    status: "active",
    endsAt: "2026-10-31",
    updates: [
      { date: "2026-01-18", text: "Surgery successful — Max is already weight-bearing!" },
      { date: "2026-03-02", text: "Physio round 2 complete. Implants stay in permanently, no more costs." },
    ],
  },
  {
    id: 2,
    shelterId: 1,
    petId: 8,
    title: "Emergency Treatment for Pihu",
    description:
      "Pihu contracted panleukopenia at 7 months old. ICU, IV fluids and round-the-clock care saved her life. Goal reached — thank you!",
    goal: 60000,
    status: "completed",
    endsAt: "2026-03-15",
    updates: [{ date: "2026-03-10", text: "Goal reached. Pihu tested negative and is gaining weight." }],
  },
  {
    id: 3,
    shelterId: 2,
    petId: null,
    title: "Winter Blanket Drive for 200 Streeties",
    description:
      "Dhaka winters are brutal for community animals. Help us buy 200 thermal blankets before December.",
    goal: 50000,
    status: "active",
    endsAt: "2026-11-30",
    updates: [],
  },
  {
    id: 4,
    shelterId: 2,
    petId: null,
    title: "Vaccination Drive — Ramna Park Strays",
    description:
      "Rabies vaccination + deworming for 150 community dogs around Ramna Park. ৳500 protects one life.",
    goal: 80000,
    status: "active",
    endsAt: "2026-12-15",
    updates: [{ date: "2026-09-10", text: "Drive kicked off — 40 dogs vaccinated on day one." }],
  },
];

export interface SeedDonation {
  id: number;
  campaignId: number;
  donorName: string | null; // null = anonymous
  amount: number;
  message?: string;
  method: "bkash" | "nagad" | "card" | "bank" | "cash";
  date: string;
}

export const seedDonations: SeedDonation[] = [
  { id: 1, campaignId: 1, donorName: "Tanvir Ahmed", amount: 25000, message: "For Max — get well soon buddy!", method: "bkash", date: "2025-11-06" },
  { id: 2, campaignId: 1, donorName: "Mitu Akter", amount: 10000, message: "Healing vibes from Mitu & Milky", method: "nagad", date: "2025-11-20" },
  { id: 3, campaignId: 1, donorName: null, amount: 5000, method: "card", date: "2025-12-02" },
  { id: 4, campaignId: 1, donorName: "Farhana Yasmin", amount: 42500, message: "Saw Max's story on the feed. Finish this, team!", method: "bank", date: "2026-01-10" },
  { id: 5, campaignId: 2, donorName: "Tanvir Ahmed", amount: 35000, message: "Save the little fighter!", method: "bkash", date: "2026-02-02" },
  { id: 6, campaignId: 2, donorName: "Mitu Akter", amount: 25000, message: "Pihu, you owe me nine lives.", method: "bkash", date: "2026-02-05" },
  { id: 7, campaignId: 3, donorName: "Mitu Akter", amount: 3000, message: "Ten blankets from me. Stay warm, streeties.", method: "bkash", date: "2026-09-02" },
  { id: 8, campaignId: 3, donorName: "Tanvir Ahmed", amount: 2000, method: "cash", date: "2026-09-04" },
  { id: 9, campaignId: 4, donorName: "Farhana Yasmin", amount: 15000, message: "In my father's memory.", method: "bkash", date: "2026-09-11" },
  { id: 10, campaignId: 4, donorName: "Tanvir Ahmed", amount: 2500, message: "Five lives vaccinated!", method: "bkash", date: "2026-09-11" },
];

export const wishItems = [
  { id: 1, shelterId: 1, item: "Dog food 30kg sacks", category: "food", needed: 20, fulfilled: 12, unitCost: 4500, priority: "high" },
  { id: 2, shelterId: 1, item: "Deworming tablets (strip)", category: "medical", needed: 100, fulfilled: 60, unitCost: 25, priority: "medium" },
  { id: 3, shelterId: 2, item: "Thermal blankets", category: "other", needed: 200, fulfilled: 145, unitCost: null as number | null, priority: "high" },
  { id: 4, shelterId: 2, item: "Puppy milk replacer tins", category: "food", needed: 40, fulfilled: 22, unitCost: 850, priority: "high" },
];

/* ------------------------------------------------------------------ */
/* U1 — Pet Blood Bank                                                 */
/* ------------------------------------------------------------------ */

export interface BloodDonor {
  id: number;
  ownerName: string;
  petName: string;
  species: Species;
  breed: string;
  bloodType: string;
  weightKg: number;
  lastDonation: string | null;
  active: boolean;
  clinicId: number;
}

export const bloodDonors: BloodDonor[] = [
  { id: 1, ownerName: "Tanvir Ahmed", petName: "Bruno", species: "dog", breed: "Deshi mix", bloodType: "DEA 1.1-", weightKg: 28.5, lastDonation: "2026-07-14", active: true, clinicId: 1 },
  { id: 2, ownerName: "Mitu Akter", petName: "Milky", species: "cat", breed: "Persian", bloodType: "A", weightKg: 4.5, lastDonation: "2026-08-02", active: true, clinicId: 1 },
  { id: 3, ownerName: "Jenny Fernandes", petName: "Rex", species: "dog", breed: "Labrador", bloodType: "DEA 1.1+", weightKg: 32, lastDonation: "2026-09-01", active: true, clinicId: 2 },
  { id: 4, ownerName: "Rashed Karim", petName: "Shiro", species: "dog", breed: "Husky mix", bloodType: "DEA 1.1-", weightKg: 30, lastDonation: "2026-06-20", active: true, clinicId: 1 },
  { id: 5, ownerName: "Sara Chowdhury", petName: "Coco", species: "dog", breed: "Cocker mix", bloodType: "DEA 1.1-", weightKg: 26, lastDonation: "2026-05-20", active: false, clinicId: 1 },
];

export interface BloodRequest {
  id: number;
  clinicId: number;
  species: Species;
  bloodType: string;
  urgency: "critical" | "urgent" | "scheduled";
  units: number;
  note: string;
  status: "open" | "fulfilled";
  deadline: string;
}

export const bloodRequests: BloodRequest[] = [
  {
    id: 1,
    clinicId: 1,
    species: "dog",
    bloodType: "DEA 1.1-",
    urgency: "critical",
    units: 2,
    note: "3-year-old deshi dog, post-op transfusion needed tonight. Patient stable but bleeding continues.",
    status: "open",
    deadline: "2026-09-12T23:59:00",
  },
];

/** Dogs eligible 8 weeks (56 days) after donating, cats 4 weeks (28). */
export function donorEligibility(d: BloodDonor): "eligible" | "recent" {
  if (!d.lastDonation) return "eligible";
  const gap = d.species === "dog" ? 56 : 28;
  const elapsed = Math.floor((TODAY.getTime() - new Date(d.lastDonation).getTime()) / 86400000);
  return elapsed >= gap ? "eligible" : "recent";
}

/* ------------------------------------------------------------------ */
/* U2 — Lost & Found                                                   */
/* ------------------------------------------------------------------ */

export interface LostReport {
  id: number;
  by: string | null;
  petName: string;
  species: Species;
  color: string;
  area: string;
  description: string;
  lostOn: string;
  status: "searching" | "reunited";
  hue: number;
}

export interface FoundReport {
  id: number;
  by: string | null;
  species: Species;
  color: string;
  area: string;
  description: string;
  foundOn: string;
  status: "with_finder" | "at_shelter" | "reunited";
  hue: number;
}

export const seedLostReports: LostReport[] = [
  {
    id: 1,
    by: "Sara Chowdhury",
    petName: "Simba",
    species: "cat",
    color: "orange tabby",
    area: "Dhanmondi Lake, Road 27",
    description: "Very friendly orange tabby with a notch on the left ear. Answers to Simba, loves chipped rice.",
    lostOn: "2026-08-28",
    status: "searching",
    hue: 30,
  },
];

export const seedFoundReports: FoundReport[] = [
  {
    id: 1,
    by: "Jenny Fernandes",
    species: "cat",
    color: "orange tabby",
    area: "Dhanmondi 27, near lake gate",
    description: "Sweet orange tabby found limping slightly. Possible notch on left ear. Very hungry, very cuddly.",
    foundOn: "2026-08-30",
    status: "with_finder",
    hue: 30,
  },
];

export const seedMatches = [{ lostId: 1, foundId: 1, score: 87.5, status: "suggested" as const }];

/* ------------------------------------------------------------------ */
/* U3 — Karma                                                          */
/* ------------------------------------------------------------------ */

export interface KarmaEntry {
  userName: string;
  action: string;
  points: number;
  date: string;
}

export const seedKarma: KarmaEntry[] = [
  { userName: "Tanvir Ahmed", action: "Donation — Max's surgery fund", points: 250, date: "2025-11-06" },
  { userName: "Tanvir Ahmed", action: "Donation — Pihu ICU fund", points: 350, date: "2026-02-02" },
  { userName: "Tanvir Ahmed", action: "Donations — blanket & vaccine drives", points: 45, date: "2026-09-11" },
  { userName: "Tanvir Ahmed", action: "Vet clinic review", points: 10, date: "2026-08-01" },
  { userName: "Farhana Yasmin", action: "Donation — Max's surgery fund", points: 425, date: "2026-01-10" },
  { userName: "Farhana Yasmin", action: "Donation — vaccine drive (memorial gift)", points: 150, date: "2026-09-11" },
  { userName: "Mitu Akter", action: "Donations — 3 campaigns", points: 380, date: "2026-09-04" },
  { userName: "Mitu Akter", action: "Registered Milky as blood donor", points: 50, date: "2026-06-01" },
  { userName: "Sara Chowdhury", action: "Adopted Mishti", points: 200, date: "2026-08-20" },
  { userName: "Sara Chowdhury", action: "Vet clinic review", points: 10, date: "2026-08-25" },
  { userName: "Jenny Fernandes", action: "Registered Rex as blood donor", points: 50, date: "2026-05-15" },
  { userName: "Jenny Fernandes", action: "Found & reported orange tabby", points: 100, date: "2026-08-30" },
];

export interface Reward {
  id: number;
  title: string;
  description: string;
  partner: string;
  category: "vet_discount" | "pet_store" | "meal_donation" | "merchandise";
  cost: number;
  stock: number | null; // null = unlimited
}

export const rewards: Reward[] = [
  { id: 1, title: "Free vet checkup", description: "One complete wellness checkup for any pet.", partner: "Care & Cure Veterinary Clinic", category: "vet_discount", cost: 300, stock: 50 },
  { id: 2, title: "15% off pet food", description: "One-time discount on any pet food purchase.", partner: "PawMart Dhanmondi", category: "pet_store", cost: 150, stock: null },
  { id: 3, title: "Donate 5 shelter meals", description: "We deliver 5 meals to a shelter pet in your name.", partner: "PetCare Network", category: "meal_donation", cost: 100, stock: null },
  { id: 4, title: "PetCare tote + sticker pack", description: "Official merch to show your rescue pride.", partner: "PetCare Network", category: "merchandise", cost: 500, stock: 20 },
];

/** Karma earned by the demo persona (Sara Chowdhury) from the seed ledger. */
export const PERSONA = "Sara Chowdhury";
export const personaSeedKarma = seedKarma
  .filter((k) => k.userName === PERSONA)
  .reduce((sum, k) => sum + k.points, 0); // 210

/* ------------------------------------------------------------------ */
/* U5 / U6 / U7 — Transport, virtual fostering, safe haven             */
/* ------------------------------------------------------------------ */

export const transportMission = {
  id: 1,
  title: "Snowy's ride home: Uttara → Chattogram",
  petId: 10,
  distanceKm: 264,
  neededOn: "2026-09-20",
  status: "legs_open",
  legs: [
    { leg: 1, from: "Uttara", to: "Gazipur", km: 40, status: "open", driver: null as string | null },
    { leg: 2, from: "Gazipur", to: "Comilla", km: 130, status: "claimed", driver: "Jenny Fernandes" as string | null },
    { leg: 3, from: "Comilla", to: "Chattogram", km: 95, status: "open", driver: null as string | null },
  ],
};

export interface VirtualFoster {
  sponsor: string;
  petId: number;
  monthly: number;
  since: string;
}

export const virtualFosters: VirtualFoster[] = [
  { sponsor: "Farhana Yasmin", petId: 9, monthly: 300, since: "2026-06-01" },
  { sponsor: "Mitu Akter", petId: 7, monthly: 200, since: "2026-07-15" },
];

export interface PetUpdate {
  petId: number;
  type: "photo" | "letter" | "medical" | "milestone";
  title: string;
  text: string;
  date: string;
}

export const petUpdates: PetUpdate[] = [
  {
    petId: 9,
    type: "letter",
    title: "Kalu wrote to Farhana",
    text: "Dear Farhana (my hero)! Today I supervised the puppy yard for two hours, then took my favorite sunbeam nap. My joints feel great with the new supplements. Come visit anytime — I will save you the shady bench. Love, Kalu.",
    date: "2026-09-06",
  },
  {
    petId: 9,
    type: "medical",
    title: "September health panel",
    text: "Arthritis stable. Weight 21.4 kg. Bloodwork perfect for a 5-year-old gentleman.",
    date: "2026-09-01",
  },
  {
    petId: 7,
    type: "photo",
    title: "Bagha's rooftop office",
    text: "Bagha reviewing the sunset from HQ. Sponsored by his fan club — thank you Mitu!",
    date: "2026-08-28",
  },
];

export interface SafeHavenRequest {
  code: string;
  species: Species;
  petName: string;
  crisisType: string;
  urgency: "critical" | "urgent" | "planned";
  days: number;
  status: "submitted" | "matched" | "in_care" | "reunited";
}

export const safeHavenRequests: SafeHavenRequest[] = [
  {
    code: "SH-2026-0042",
    species: "cat",
    petName: "Jhumka",
    crisisType: "Domestic violence — owner in safe house",
    urgency: "critical",
    days: 30,
    status: "in_care",
  },
  {
    code: "SH-2026-0044",
    species: "dog",
    petName: "Laddu",
    crisisType: "Owner hospitalized",
    urgency: "planned",
    days: 14,
    status: "submitted",
  },
];

/* ------------------------------------------------------------------ */
/* M3 — reminders & seed applications (for dashboards)                 */
/* ------------------------------------------------------------------ */

export const personaReminders = [
  { petName: "Mishti", type: "Vaccine", note: "Rabies booster — Care & Cure, ask for Dr. Fahim", due: "2026-10-05" },
  { petName: "Piya", type: "Vet visit", note: "Annual checkup + dental look", due: "2026-09-20" },
];

export interface SeedApplication {
  id: number;
  petId: number;
  applicant: string;
  status: "submitted" | "under_review" | "approved" | "rejected";
  message: string;
  homeType: string;
  experience: boolean;
  date: string;
  decisionNote?: string;
}

export const seedApplications: SeedApplication[] = [
  {
    id: 1,
    petId: 2,
    applicant: "Sara Chowdhury",
    status: "approved",
    message:
      "I have wanted a calm companion cat for two years. My apartment is fully cat-proofed and I work from home.",
    homeType: "Apartment",
    experience: true,
    date: "2026-08-12",
    decisionNote: "Wonderful match — home visit scheduled Saturday. Welcome, Mishti!",
  },
  {
    id: 2,
    petId: 4,
    applicant: "Rashed Karim",
    status: "under_review",
    message:
      "I grew up with German Shepherds and currently have a house with a large yard in Bashundhara.",
    homeType: "House with yard",
    experience: true,
    date: "2026-09-08",
  },
];

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

export const bdt = (n: number) => `৳${n.toLocaleString("en-IN")}`;

export const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export const daysUntil = (iso: string) =>
  Math.ceil((new Date(iso).getTime() - TODAY.getTime()) / 86400000);
