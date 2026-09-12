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
  | "rescue"
  | "lostfound"
  | "karma"
  | "dashboard";

export const TODAY = new Date("2026-09-12T12:00:00");

/* ------------------------------------------------------------------ */
/* U9 — Community Rescue Network (report an animal in danger)          */
/* ------------------------------------------------------------------ */

export type RescueStatus = "reported" | "responding" | "rescued" | "closed";
export type RescueUrgency = "critical" | "urgent" | "standard";
export type RescueSituation =
  | "stuck_trapped"
  | "injured"
  | "road_accident"
  | "drowning_risk"
  | "abandoned"
  | "abuse_neglect"
  | "other";

export const SITUATION_META: Record<RescueSituation, { label: string; icon: string }> = {
  stuck_trapped: { label: "Stuck / trapped", icon: "🪤" },
  injured: { label: "Injured / sick", icon: "🩹" },
  road_accident: { label: "Road accident", icon: "🚗" },
  drowning_risk: { label: "Drowning risk", icon: "🌊" },
  abandoned: { label: "Abandoned litter", icon: "📦" },
  abuse_neglect: { label: "Abuse / neglect", icon: "⚠️" },
  other: { label: "Other danger", icon: "❓" },
};

export const RESCUE_URGENCY_META: Record<RescueUrgency, { label: string; cls: string; dot: string }> = {
  critical: { label: "Critical — life at risk", cls: "border-emred-200 bg-emred-50 text-emred-800", dot: "bg-emred-500" },
  urgent: { label: "Urgent — act today", cls: "border-gold-200 bg-gold-50 text-gold-800", dot: "bg-gold-500" },
  standard: { label: "Standard — this week", cls: "border-sagegray-200 bg-sagegray-50 text-sagegray-800", dot: "bg-sagegray-500" },
};

export const RESCUE_STATUS_META: Record<RescueStatus, { label: string; cls: string }> = {
  reported: { label: "Reported — needs responders", cls: "border-emred-200 bg-emred-50 text-emred-700" },
  responding: { label: "Responders on the way", cls: "border-gold-200 bg-gold-50 text-gold-800" },
  rescued: { label: "Animal secured", cls: "border-sage-200 bg-sage-50 text-sage-800" },
  closed: { label: "Safe — case closed", cls: "border-sage-200 bg-sage-50 text-sage-800" },
};

export interface RescueAlert {
  id: number;
  reporter: string | null; // null = anonymous
  species: Species | "other";
  situation: RescueSituation;
  urgency: RescueUrgency;
  area: string;
  description: string;
  reportedAt: string; // ISO datetime
  status: RescueStatus;
  responders: string[];
  resolution?: string;
  hue: number;
}

export const seedRescueAlerts: RescueAlert[] = [
  {
    id: 1,
    reporter: "Mitu Akter",
    species: "cat",
    situation: "stuck_trapped",
    urgency: "critical",
    area: "Dhanmondi 27, near Lake Gate",
    description:
      "Kitten fell into an open storm drain beside the footpath. Crying loudly, water level rising. We can hear it but can't reach — the grate is too heavy for us.",
    reportedAt: "2026-09-12T09:42:00",
    status: "responding",
    responders: ["Rashed Karim", "Nafis Rahman"],
    hue: 348,
  },
  {
    id: 2,
    reporter: null,
    species: "cat",
    situation: "stuck_trapped",
    urgency: "urgent",
    area: "Mirpur 10, Ambala complex roof",
    description:
      "A cat has been sitting on the AC cornice of the 6th floor for two days. Meows when callers come. Possibly stuck, can't climb down the smooth wall.",
    reportedAt: "2026-09-11T18:20:00",
    status: "reported",
    responders: [],
    hue: 14,
  },
  {
    id: 3,
    reporter: "Jenny Fernandes",
    species: "dog",
    situation: "road_accident",
    urgency: "critical",
    area: "Airport Road, opposite HTD",
    description:
      "Deshi dog hit by a CNG, limping badly with a bleeding hind leg. Traffic is heavy — he has crawled to the roadside median. Currently wrapped in a blanket, needs urgent vet pickup.",
    reportedAt: "2026-09-10T14:05:00",
    status: "rescued",
    responders: ["Tanvir Ahmed", "Nusrat Jahan", "Sajid Bappi"],
    hue: 14,
  },
  {
    id: 4,
    reporter: "Anika Tabassum",
    species: "cat",
    situation: "abandoned",
    urgency: "standard",
    area: "Banani, Kakoli park corner",
    description:
      "Box of 4 newborn kittens left near the park bench. Mother nowhere in sight. Eyes still closed — they need bottle feeding every 2 hours.",
    reportedAt: "2026-09-08T08:15:00",
    status: "closed",
    responders: ["Mitu Akter", "Lubna Mariam"],
    resolution:
      "All 4 kittens hand-fed by volunteers and moved to Pawfect Haven's neonatal unit. One already has an adopter lined up!",
    hue: 42,
  },
];

/** Volunteers shown as part of the demo responder network. */
export const rescueResponders = [
  "Rashed Karim", "Nafis Rahman", "Sajid Bappi", "Lubna Mariam",
  "Tahsin Khan", "Priya Das", "Anika Tabassum", "Zubair Rahman",
];

export const fmtAgo = (iso: string) => {
  const mins = Math.max(1, Math.floor((TODAY.getTime() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
};

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
    hue: 145,
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
    hue: 15,
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
    hue: 42,
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
    hue: 185,
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
    hue: 350,
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
    hue: 130,
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
    hue: 32,
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
    hue: 12,
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
    hue: 205,
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
    hue: 190,
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
  { id: 1, campaignId: 1, donorName: "Rashed Karim", amount: 50, message: "Max deserves the best", method: "nagad", date: "2025-11-06" },
  { id: 2, campaignId: 1, donorName: "Jenny Fernandes", amount: 100, message: "For Max's surgery — go buddy!", method: "bkash", date: "2025-11-08" },
  { id: 3, campaignId: 1, donorName: "Tanvir Ahmed", amount: 600, message: "In memory of my late Tommy", method: "card", date: "2025-11-10" },
  { id: 4, campaignId: 1, donorName: "Mitu Akter", amount: 150, message: "For Max's surgery — go buddy!", method: "bank", date: "2025-11-11" },
  { id: 5, campaignId: 1, donorName: "Farhana Yasmin", amount: 7500, method: "nagad", date: "2025-11-12" },
  { id: 6, campaignId: 1, donorName: "Chowdhury family", amount: 1500, method: "nagad", date: "2025-11-15" },
  { id: 7, campaignId: 1, donorName: null, amount: 3000, message: "Get well soon, Max!", method: "bkash", date: "2025-11-18" },
  { id: 8, campaignId: 1, donorName: null, amount: 3000, message: "Every little bit counts", method: "bkash", date: "2025-11-21" },
  { id: 9, campaignId: 1, donorName: "Lubna Mariam", amount: 1250, method: "nagad", date: "2025-12-03" },
  { id: 10, campaignId: 1, donorName: "Shakib Al Hasan", amount: 300, message: "Max deserves the best", method: "bkash", date: "2025-12-05" },
  { id: 11, campaignId: 1, donorName: "Tanvir Ahmed", amount: 600, message: "For Max's surgery — go buddy!", method: "nagad", date: "2025-12-07" },
  { id: 12, campaignId: 1, donorName: "Mitu Akter", amount: 3000, message: "In memory of my late Tommy", method: "nagad", date: "2025-12-12" },
  { id: 13, campaignId: 1, donorName: "Farhana Yasmin", amount: 800, message: "Salute to the volunteers", method: "bank", date: "2025-12-23" },
  { id: 14, campaignId: 1, donorName: "PawMart Dhanmondi", amount: 500, method: "card", date: "2025-12-24" },
  { id: 15, campaignId: 1, donorName: "Tanvir Ahmed", amount: 100, method: "nagad", date: "2026-01-09" },
  { id: 16, campaignId: 1, donorName: "Mitu Akter", amount: 900, method: "nagad", date: "2026-01-09" },
  { id: 17, campaignId: 1, donorName: "Nusrat Ema", amount: 3000, message: "Go team PetCare!", method: "bank", date: "2026-01-12" },
  { id: 18, campaignId: 1, donorName: "Nafis Rahman", amount: 850, message: "Keep up the amazing work", method: "bank", date: "2026-01-14" },
  { id: 19, campaignId: 1, donorName: "Mehjabin Karim", amount: 1900, message: "Get well soon, Max!", method: "cash", date: "2026-01-14" },
  { id: 20, campaignId: 1, donorName: "Rashed Karim", amount: 2500, message: "This platform is a blessing", method: "bank", date: "2026-01-18" },
  { id: 21, campaignId: 1, donorName: "Jenny Fernandes", amount: 5000, message: "Every little bit counts", method: "bkash", date: "2026-01-23" },
  { id: 22, campaignId: 1, donorName: "Shakib Al Hasan", amount: 250, message: "In memory of my late Tommy", method: "bkash", date: "2026-02-01" },
  { id: 23, campaignId: 1, donorName: "Gulshan Book Club", amount: 300, message: "Max deserves the best", method: "nagad", date: "2026-02-01" },
  { id: 24, campaignId: 1, donorName: "Tanvir Ahmed", amount: 600, message: "Shared with my office group chat", method: "bkash", date: "2026-02-02" },
  { id: 25, campaignId: 1, donorName: "Farhana Yasmin", amount: 400, message: "Keep up the amazing work", method: "bkash", date: "2026-02-03" },
  { id: 26, campaignId: 2, donorName: "Farhana Yasmin", amount: 2400, message: "ICU bills are brutal — hang in there", method: "cash", date: "2026-02-04" },
  { id: 27, campaignId: 2, donorName: "Mitu Akter", amount: 400, message: "Prayers and taka, both sent", method: "bkash", date: "2026-02-05" },
  { id: 28, campaignId: 2, donorName: "Jenny Fernandes", amount: 500, method: "bkash", date: "2026-02-05" },
  { id: 29, campaignId: 2, donorName: "Tanvir Ahmed", amount: 400, message: "Save the little fighter!", method: "bank", date: "2026-02-07" },
  { id: 30, campaignId: 2, donorName: "Arif Chowdhury", amount: 3000, message: "ICU bills are brutal — hang in there", method: "bkash", date: "2026-02-07" },
  { id: 31, campaignId: 2, donorName: "Shakib Al Hasan", amount: 100, message: "For Pihu's ICU bill", method: "card", date: "2026-02-08" },
  { id: 32, campaignId: 2, donorName: "Kabir Andalib", amount: 300, method: "card", date: "2026-02-09" },
  { id: 33, campaignId: 2, donorName: "Rashed Karim", amount: 3000, message: "Healing vibes", method: "nagad", date: "2026-02-09" },
  { id: 34, campaignId: 1, donorName: "Nafis Rahman", amount: 5000, method: "card", date: "2026-02-09" },
  { id: 35, campaignId: 2, donorName: "PawMart Dhanmondi", amount: 100, message: "Pihu, you owe me nine lives", method: "bkash", date: "2026-02-10" },
  { id: 36, campaignId: 2, donorName: null, amount: 400, message: "Please post more updates", method: "card", date: "2026-02-10" },
  { id: 37, campaignId: 2, donorName: "Kabir Andalib", amount: 3000, message: "Pihu, you owe me nine lives", method: "cash", date: "2026-02-12" },
  { id: 38, campaignId: 2, donorName: "Gulshan Book Club", amount: 300, method: "bkash", date: "2026-02-13" },
  { id: 39, campaignId: 2, donorName: "Priya Das", amount: 150, message: "From me and my cat Milo", method: "bkash", date: "2026-02-13" },
  { id: 40, campaignId: 1, donorName: "Mitu Akter", amount: 1150, message: "Get well soon, Max!", method: "nagad", date: "2026-02-14" },
  { id: 41, campaignId: 2, donorName: "Arif Chowdhury", amount: 1500, message: "ICU bills are brutal — hang in there", method: "bkash", date: "2026-02-15" },
  { id: 42, campaignId: 2, donorName: "Rumana Malik", amount: 3000, method: "bkash", date: "2026-02-16" },
  { id: 43, campaignId: 1, donorName: "Nafis Rahman", amount: 350, method: "cash", date: "2026-02-18" },
  { id: 44, campaignId: 1, donorName: "Tahsin Khan", amount: 50, message: "Get well soon, Max!", method: "bkash", date: "2026-02-19" },
  { id: 45, campaignId: 2, donorName: "Kabir Andalib", amount: 3000, message: "ICU bills are brutal — hang in there", method: "bkash", date: "2026-02-20" },
  { id: 46, campaignId: 2, donorName: "Sumaiya Haque", amount: 2350, message: "Shared with my office group chat", method: "bkash", date: "2026-02-21" },
  { id: 47, campaignId: 1, donorName: "Zubair Rahman", amount: 3000, message: "My family's monthly pledge", method: "bkash", date: "2026-02-21" },
  { id: 48, campaignId: 2, donorName: "Rumana Malik", amount: 600, message: "Found you through the Insta page", method: "bkash", date: "2026-02-22" },
  { id: 49, campaignId: 2, donorName: "Kabir Andalib", amount: 1500, message: "Donated on behalf of my students", method: "nagad", date: "2026-02-23" },
  { id: 50, campaignId: 2, donorName: "Chowdhury family", amount: 250, message: "Save the little fighter!", method: "bank", date: "2026-02-23" },
  { id: 51, campaignId: 2, donorName: "Priya Das", amount: 3000, message: "ICU bills are brutal — hang in there", method: "bkash", date: "2026-02-24" },
  { id: 52, campaignId: 2, donorName: "Rumana Malik", amount: 700, message: "Small help from a student", method: "card", date: "2026-02-24" },
  { id: 53, campaignId: 1, donorName: "Tanvir Ahmed", amount: 200, message: "Get well soon, Max!", method: "nagad", date: "2026-02-26" },
  { id: 54, campaignId: 2, donorName: "Sumaiya Haque", amount: 7500, message: "This platform is a blessing", method: "cash", date: "2026-02-26" },
  { id: 55, campaignId: 2, donorName: null, amount: 1500, message: "This platform is a blessing", method: "bkash", date: "2026-02-27" },
  { id: 56, campaignId: 2, donorName: "Lubna Mariam", amount: 300, method: "cash", date: "2026-02-28" },
  { id: 57, campaignId: 2, donorName: "Rumana Malik", amount: 3000, message: "For Pihu's ICU bill", method: "bkash", date: "2026-03-03" },
  { id: 58, campaignId: 2, donorName: "Tanvir Ahmed", amount: 2250, method: "bkash", date: "2026-03-04" },
  { id: 59, campaignId: 2, donorName: "Tahsin Khan", amount: 250, message: "Small help from a student", method: "bkash", date: "2026-03-04" },
  { id: 60, campaignId: 2, donorName: "Nusrat Ema", amount: 250, message: "Every little bit counts", method: "bank", date: "2026-03-04" },
  { id: 61, campaignId: 2, donorName: "Nafis Rahman", amount: 3000, message: "Found you through the Insta page", method: "card", date: "2026-03-05" },
  { id: 62, campaignId: 2, donorName: null, amount: 450, message: "Shared with my office group chat", method: "cash", date: "2026-03-06" },
  { id: 63, campaignId: 2, donorName: "Mehjabin Karim", amount: 3000, message: "Donated on behalf of my students", method: "bkash", date: "2026-03-07" },
  { id: 64, campaignId: 2, donorName: "Sajid Bappi", amount: 750, message: "ICU bills are brutal — hang in there", method: "bank", date: "2026-03-07" },
  { id: 65, campaignId: 2, donorName: "Zubair Rahman", amount: 1200, method: "bkash", date: "2026-03-09" },
  { id: 66, campaignId: 2, donorName: "Mitu Akter", amount: 600, method: "bank", date: "2026-03-09" },
  { id: 67, campaignId: 2, donorName: null, amount: 200, message: "Sorry I can't give more this month", method: "bkash", date: "2026-03-10" },
  { id: 68, campaignId: 2, donorName: "Anika Tabassum", amount: 200, message: "Prayers and taka, both sent", method: "card", date: "2026-03-11" },
  { id: 69, campaignId: 2, donorName: null, amount: 1050, message: "Found you through the Insta page", method: "bkash", date: "2026-03-12" },
  { id: 70, campaignId: 2, donorName: "Mehjabin Karim", amount: 3000, message: "ICU bills are brutal — hang in there", method: "bkash", date: "2026-03-13" },
  { id: 71, campaignId: 2, donorName: "Imran Hossain", amount: 750, method: "card", date: "2026-03-14" },
  { id: 72, campaignId: 2, donorName: "Mehjabin Karim", amount: 300, method: "bkash", date: "2026-03-14" },
  { id: 73, campaignId: 2, donorName: null, amount: 1550, message: "Save the little fighter!", method: "bkash", date: "2026-03-15" },
  { id: 74, campaignId: 1, donorName: "Farhana Yasmin", amount: 4000, method: "bank", date: "2026-03-17" },
  { id: 75, campaignId: 1, donorName: "Mitu Akter", amount: 200, message: "Max deserves the best", method: "cash", date: "2026-03-19" },
  { id: 76, campaignId: 1, donorName: "Tanvir Ahmed", amount: 600, message: "Sorry I can't give more this month", method: "bkash", date: "2026-04-01" },
  { id: 77, campaignId: 1, donorName: "Rashed Karim", amount: 2500, message: "In memory of my late Tommy", method: "nagad", date: "2026-04-03" },
  { id: 78, campaignId: 1, donorName: "Jenny Fernandes", amount: 750, message: "For Max's surgery — go buddy!", method: "bkash", date: "2026-04-07" },
  { id: 79, campaignId: 1, donorName: "Sajid Bappi", amount: 800, message: "Found you through the Insta page", method: "bkash", date: "2026-04-08" },
  { id: 80, campaignId: 1, donorName: "Priya Das", amount: 500, message: "In memory of my late Tommy", method: "bkash", date: "2026-04-11" },
  { id: 81, campaignId: 1, donorName: "Nusrat Ema", amount: 2800, message: "Sorry I can't give more this month", method: "card", date: "2026-04-12" },
  { id: 82, campaignId: 1, donorName: "Sumaiya Haque", amount: 100, method: "card", date: "2026-04-16" },
  { id: 83, campaignId: 1, donorName: "Priya Das", amount: 3000, method: "nagad", date: "2026-04-17" },
  { id: 84, campaignId: 1, donorName: "Arif Chowdhury", amount: 1500, message: "Get well soon, Max!", method: "bank", date: "2026-04-18" },
  { id: 85, campaignId: 1, donorName: "Rumana Malik", amount: 3000, message: "Every little bit counts", method: "card", date: "2026-04-21" },
  { id: 86, campaignId: 1, donorName: "Farhana Yasmin", amount: 150, message: "Max deserves the best", method: "bkash", date: "2026-04-21" },
  { id: 87, campaignId: 1, donorName: "Mitu Akter", amount: 250, method: "bkash", date: "2026-04-22" },
  { id: 88, campaignId: 1, donorName: null, amount: 200, message: "Every little bit counts", method: "card", date: "2026-04-29" },
  { id: 89, campaignId: 1, donorName: null, amount: 500, message: "For Max's surgery — go buddy!", method: "card", date: "2026-04-30" },
  { id: 90, campaignId: 1, donorName: "Tanvir Ahmed", amount: 400, message: "Max deserves the best", method: "nagad", date: "2026-05-02" },
  { id: 91, campaignId: 1, donorName: "Sumaiya Haque", amount: 3000, method: "card", date: "2026-05-02" },
  { id: 92, campaignId: 1, donorName: null, amount: 3000, message: "In memory of my late Tommy", method: "card", date: "2026-05-03" },
  { id: 93, campaignId: 1, donorName: "Kabir Andalib", amount: 200, message: "For Max's surgery — go buddy!", method: "nagad", date: "2026-05-08" },
  { id: 94, campaignId: 1, donorName: "Shakib Al Hasan", amount: 3000, method: "nagad", date: "2026-05-15" },
  { id: 95, campaignId: 1, donorName: "Mitu Akter", amount: 300, message: "Get well soon, Max!", method: "nagad", date: "2026-05-18" },
  { id: 96, campaignId: 1, donorName: "Farhana Yasmin", amount: 3200, message: "In memory of my late Tommy", method: "bank", date: "2026-06-01" },
  { id: 97, campaignId: 1, donorName: "Tanvir Ahmed", amount: 1150, message: "Max deserves the best", method: "bkash", date: "2026-06-04" },
  { id: 98, campaignId: 1, donorName: "Lubna Mariam", amount: 50, message: "For Max's surgery — go buddy!", method: "bkash", date: "2026-06-11" },
  { id: 99, campaignId: 1, donorName: "UIU Rotaract Club", amount: 750, message: "For Max's surgery — go buddy!", method: "card", date: "2026-06-16" },
  { id: 100, campaignId: 1, donorName: "Mitu Akter", amount: 900, message: "This platform is a blessing", method: "bank", date: "2026-06-19" },
  { id: 101, campaignId: 1, donorName: "Jenny Fernandes", amount: 600, message: "Small help from a student", method: "nagad", date: "2026-06-19" },
  { id: 102, campaignId: 1, donorName: "Rashed Karim", amount: 150, message: "This platform is a blessing", method: "nagad", date: "2026-06-21" },
  { id: 103, campaignId: 1, donorName: "Tanvir Ahmed", amount: 550, message: "Donated on behalf of my students", method: "card", date: "2026-06-28" },
  { id: 104, campaignId: 1, donorName: null, amount: 3000, message: "Get well soon, Max!", method: "cash", date: "2026-07-01" },
  { id: 105, campaignId: 1, donorName: null, amount: 3000, message: "Every little bit counts", method: "bkash", date: "2026-07-01" },
  { id: 106, campaignId: 1, donorName: "Rumana Malik", amount: 750, message: "Get well soon, Max!", method: "bkash", date: "2026-07-03" },
  { id: 107, campaignId: 1, donorName: null, amount: 3000, method: "card", date: "2026-07-10" },
  { id: 108, campaignId: 1, donorName: "Farhana Yasmin", amount: 800, message: "Small help from a student", method: "nagad", date: "2026-07-11" },
  { id: 109, campaignId: 1, donorName: "Mitu Akter", amount: 150, method: "nagad", date: "2026-07-17" },
  { id: 110, campaignId: 1, donorName: null, amount: 3000, message: "Donated on behalf of my students", method: "bkash", date: "2026-07-26" },
  { id: 111, campaignId: 1, donorName: "Tanvir Ahmed", amount: 2250, message: "Max deserves the best", method: "bkash", date: "2026-07-27" },
  { id: 112, campaignId: 1, donorName: "Mehjabin Karim", amount: 800, message: "Shared with my office group chat", method: "nagad", date: "2026-08-02" },
  { id: 113, campaignId: 1, donorName: null, amount: 300, message: "Keep up the amazing work", method: "bkash", date: "2026-08-03" },
  { id: 114, campaignId: 1, donorName: "Lubna Mariam", amount: 3000, message: "In memory of my late Tommy", method: "bank", date: "2026-08-06" },
  { id: 115, campaignId: 1, donorName: "Anika Tabassum", amount: 300, message: "Go team PetCare!", method: "nagad", date: "2026-08-10" },
  { id: 116, campaignId: 1, donorName: "Mitu Akter", amount: 400, message: "In memory of my late Tommy", method: "bkash", date: "2026-08-12" },
  { id: 117, campaignId: 1, donorName: "Lubna Mariam", amount: 3000, message: "From me and my cat Milo", method: "nagad", date: "2026-08-12" },
  { id: 118, campaignId: 1, donorName: "Rumana Malik", amount: 3000, message: "Sorry I can't give more this month", method: "bkash", date: "2026-08-13" },
  { id: 119, campaignId: 1, donorName: "Farhana Yasmin", amount: 800, method: "nagad", date: "2026-08-15" },
  { id: 120, campaignId: 1, donorName: "Tanvir Ahmed", amount: 750, method: "bkash", date: "2026-08-26" },
  { id: 121, campaignId: 1, donorName: "Zubair Rahman", amount: 1500, message: "Healing vibes", method: "bkash", date: "2026-08-26" },
  { id: 122, campaignId: 1, donorName: "Jenny Fernandes", amount: 200, message: "In memory of my late Tommy", method: "bkash", date: "2026-08-30" },
  { id: 123, campaignId: 3, donorName: null, amount: 50, method: "nagad", date: "2026-09-01" },
  { id: 124, campaignId: 3, donorName: "Tahsin Khan", amount: 1500, method: "bkash", date: "2026-09-02" },
  { id: 125, campaignId: 3, donorName: "Imran Hossain", amount: 600, method: "nagad", date: "2026-09-02" },
  { id: 126, campaignId: 3, donorName: "Farhana Yasmin", amount: 100, message: "Long-time lurker, first-time donor", method: "cash", date: "2026-09-02" },
  { id: 127, campaignId: 3, donorName: "Jenny Fernandes", amount: 2000, message: "Salute to the volunteers", method: "bkash", date: "2026-09-03" },
  { id: 128, campaignId: 3, donorName: "Mitu Akter", amount: 50, message: "For the streeties this winter", method: "bkash", date: "2026-09-04" },
  { id: 129, campaignId: 3, donorName: "Sajid Bappi", amount: 300, method: "bkash", date: "2026-09-04" },
  { id: 130, campaignId: 3, donorName: "Shakib Al Hasan", amount: 2000, method: "bkash", date: "2026-09-05" },
  { id: 131, campaignId: 3, donorName: "Mehjabin Karim", amount: 2000, message: "The blanket drive is such a good idea", method: "nagad", date: "2026-09-06" },
  { id: 132, campaignId: 3, donorName: "Kabir Andalib", amount: 200, message: "This platform is a blessing", method: "card", date: "2026-09-06" },
  { id: 133, campaignId: 3, donorName: "Rashed Karim", amount: 300, message: "Stay warm, streeties", method: "nagad", date: "2026-09-07" },
  { id: 134, campaignId: 3, donorName: "Nusrat Ema", amount: 750, message: "Sorry I can't give more this month", method: "nagad", date: "2026-09-07" },
  { id: 135, campaignId: 3, donorName: "Priya Das", amount: 100, method: "bkash", date: "2026-09-07" },
  { id: 136, campaignId: 3, donorName: "PawMart Dhanmondi", amount: 1500, message: "Salute to the volunteers", method: "cash", date: "2026-09-08" },
  { id: 137, campaignId: 1, donorName: "Rashed Karim", amount: 1000, message: "In memory of my late Tommy", method: "bkash", date: "2026-09-08" },
  { id: 138, campaignId: 3, donorName: "Tanvir Ahmed", amount: 50, message: "The blanket drive is such a good idea", method: "bkash", date: "2026-09-08" },
  { id: 139, campaignId: 3, donorName: "Gulshan Book Club", amount: 200, message: "For the streeties this winter", method: "bkash", date: "2026-09-08" },
  { id: 140, campaignId: 3, donorName: "Chowdhury family", amount: 800, message: "For the streeties this winter", method: "bkash", date: "2026-09-08" },
  { id: 141, campaignId: 3, donorName: null, amount: 50, message: "From me and my cat Milo", method: "bkash", date: "2026-09-09" },
  { id: 142, campaignId: 3, donorName: null, amount: 1200, message: "Wish I could adopt right now — here's something instead", method: "bkash", date: "2026-09-09" },
  { id: 143, campaignId: 3, donorName: "UIU Rotaract Club", amount: 250, message: "Stay warm, streeties", method: "cash", date: "2026-09-09" },
  { id: 144, campaignId: 1, donorName: null, amount: 550, message: "Sorry I can't give more this month", method: "cash", date: "2026-09-10" },
  { id: 145, campaignId: 4, donorName: "Tahsin Khan", amount: 500, method: "bank", date: "2026-09-10" },
  { id: 146, campaignId: 4, donorName: "Priya Das", amount: 500, message: "Salute to the volunteers", method: "nagad", date: "2026-09-10" },
  { id: 147, campaignId: 3, donorName: "Anika Tabassum", amount: 500, message: "Long-time lurker, first-time donor", method: "bkash", date: "2026-09-10" },
  { id: 148, campaignId: 4, donorName: "Nusrat Ema", amount: 100, message: "Happy birthday Rani!", method: "bkash", date: "2026-09-10" },
  { id: 149, campaignId: 4, donorName: "Shakib Al Hasan", amount: 400, message: "Five dogs vaccinated with this!", method: "cash", date: "2026-09-11" },
  { id: 150, campaignId: 4, donorName: "Nafis Rahman", amount: 1100, method: "cash", date: "2026-09-11" },
  { id: 151, campaignId: 4, donorName: "Farhana Yasmin", amount: 1600, method: "nagad", date: "2026-09-11" },
  { id: 152, campaignId: 4, donorName: "Mehjabin Karim", amount: 150, message: "Shared with my office group chat", method: "bkash", date: "2026-09-11" },
  { id: 153, campaignId: 3, donorName: "Sumaiya Haque", amount: 1500, method: "bkash", date: "2026-09-11" },
  { id: 154, campaignId: 3, donorName: "Nafis Rahman", amount: 200, message: "The blanket drive is such a good idea", method: "bkash", date: "2026-09-11" },
  { id: 155, campaignId: 3, donorName: "Zubair Rahman", amount: 100, message: "Ten blankets from me", method: "nagad", date: "2026-09-11" },
  { id: 156, campaignId: 4, donorName: "Imran Hossain", amount: 1000, message: "Five dogs vaccinated with this!", method: "nagad", date: "2026-09-11" },
  { id: 157, campaignId: 4, donorName: "Kabir Andalib", amount: 200, message: "Prayers and taka, both sent", method: "bank", date: "2026-09-12" },
  { id: 158, campaignId: 4, donorName: "Chowdhury family", amount: 1000, message: "Donated on behalf of my students", method: "cash", date: "2026-09-12" },
  { id: 159, campaignId: 4, donorName: "Jenny Fernandes", amount: 1200, method: "card", date: "2026-09-12" },
  { id: 160, campaignId: 4, donorName: "Rashed Karim", amount: 500, message: "This platform is a blessing", method: "card", date: "2026-09-12" },
  { id: 161, campaignId: 4, donorName: null, amount: 100, message: "For the vaccine drive — protect them all", method: "cash", date: "2026-09-12" },
  { id: 162, campaignId: 4, donorName: "Sajid Bappi", amount: 1500, message: "Happy birthday Rani!", method: "bank", date: "2026-09-12" },
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
    hue: 145,
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
    hue: 185,
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
  { userName: "Rashed Karim", action: "Donation — Max's surgery fund", points: 1, date: "2025-11-06" },
  { userName: "Jenny Fernandes", action: "Donation — Max's surgery fund", points: 1, date: "2025-11-08" },
  { userName: "Tanvir Ahmed", action: "Donation — Max's surgery fund", points: 6, date: "2025-11-10" },
  { userName: "Mitu Akter", action: "Donation — Max's surgery fund", points: 2, date: "2025-11-11" },
  { userName: "Farhana Yasmin", action: "Donation — Max's surgery fund", points: 75, date: "2025-11-12" },
  { userName: "Chowdhury family", action: "Donation — Max's surgery fund", points: 15, date: "2025-11-15" },
  { userName: "Lubna Mariam", action: "Donation — Max's surgery fund", points: 13, date: "2025-12-03" },
  { userName: "Shakib Al Hasan", action: "Donation — Max's surgery fund", points: 3, date: "2025-12-05" },
  { userName: "Tanvir Ahmed", action: "Donation — Max's surgery fund", points: 6, date: "2025-12-07" },
  { userName: "Mitu Akter", action: "Donation — Max's surgery fund", points: 30, date: "2025-12-12" },
  { userName: "Farhana Yasmin", action: "Donation — Max's surgery fund", points: 8, date: "2025-12-23" },
  { userName: "PawMart Dhanmondi", action: "Donation — Max's surgery fund", points: 5, date: "2025-12-24" },
  { userName: "Tanvir Ahmed", action: "Donation — Max's surgery fund", points: 1, date: "2026-01-09" },
  { userName: "Mitu Akter", action: "Donation — Max's surgery fund", points: 9, date: "2026-01-09" },
  { userName: "Nusrat Ema", action: "Donation — Max's surgery fund", points: 30, date: "2026-01-12" },
  { userName: "Nafis Rahman", action: "Donation — Max's surgery fund", points: 9, date: "2026-01-14" },
  { userName: "Mehjabin Karim", action: "Donation — Max's surgery fund", points: 19, date: "2026-01-14" },
  { userName: "Rashed Karim", action: "Donation — Max's surgery fund", points: 25, date: "2026-01-18" },
  { userName: "Jenny Fernandes", action: "Donation — Max's surgery fund", points: 50, date: "2026-01-23" },
  { userName: "Shakib Al Hasan", action: "Donation — Max's surgery fund", points: 3, date: "2026-02-01" },
  { userName: "Gulshan Book Club", action: "Donation — Max's surgery fund", points: 3, date: "2026-02-01" },
  { userName: "Tanvir Ahmed", action: "Donation — Max's surgery fund", points: 6, date: "2026-02-02" },
  { userName: "Farhana Yasmin", action: "Donation — Max's surgery fund", points: 4, date: "2026-02-03" },
  { userName: "Farhana Yasmin", action: "Donation — Pihu ICU fund", points: 24, date: "2026-02-04" },
  { userName: "Mitu Akter", action: "Donation — Pihu ICU fund", points: 4, date: "2026-02-05" },
  { userName: "Jenny Fernandes", action: "Donation — Pihu ICU fund", points: 5, date: "2026-02-05" },
  { userName: "Tanvir Ahmed", action: "Donation — Pihu ICU fund", points: 4, date: "2026-02-07" },
  { userName: "Arif Chowdhury", action: "Donation — Pihu ICU fund", points: 30, date: "2026-02-07" },
  { userName: "Shakib Al Hasan", action: "Donation — Pihu ICU fund", points: 1, date: "2026-02-08" },
  { userName: "Kabir Andalib", action: "Donation — Pihu ICU fund", points: 3, date: "2026-02-09" },
  { userName: "Rashed Karim", action: "Donation — Pihu ICU fund", points: 30, date: "2026-02-09" },
  { userName: "Nafis Rahman", action: "Donation — Max's surgery fund", points: 50, date: "2026-02-09" },
  { userName: "PawMart Dhanmondi", action: "Donation — Pihu ICU fund", points: 1, date: "2026-02-10" },
  { userName: "Kabir Andalib", action: "Donation — Pihu ICU fund", points: 30, date: "2026-02-12" },
  { userName: "Gulshan Book Club", action: "Donation — Pihu ICU fund", points: 3, date: "2026-02-13" },
  { userName: "Priya Das", action: "Donation — Pihu ICU fund", points: 2, date: "2026-02-13" },
  { userName: "Mitu Akter", action: "Donation — Max's surgery fund", points: 12, date: "2026-02-14" },
  { userName: "Arif Chowdhury", action: "Donation — Pihu ICU fund", points: 15, date: "2026-02-15" },
  { userName: "Rumana Malik", action: "Donation — Pihu ICU fund", points: 30, date: "2026-02-16" },
  { userName: "Nafis Rahman", action: "Donation — Max's surgery fund", points: 4, date: "2026-02-18" },
  { userName: "Tahsin Khan", action: "Donation — Max's surgery fund", points: 1, date: "2026-02-19" },
  { userName: "Kabir Andalib", action: "Donation — Pihu ICU fund", points: 30, date: "2026-02-20" },
  { userName: "Sumaiya Haque", action: "Donation — Pihu ICU fund", points: 24, date: "2026-02-21" },
  { userName: "Zubair Rahman", action: "Donation — Max's surgery fund", points: 30, date: "2026-02-21" },
  { userName: "Rumana Malik", action: "Donation — Pihu ICU fund", points: 6, date: "2026-02-22" },
  { userName: "Kabir Andalib", action: "Donation — Pihu ICU fund", points: 15, date: "2026-02-23" },
  { userName: "Chowdhury family", action: "Donation — Pihu ICU fund", points: 3, date: "2026-02-23" },
  { userName: "Priya Das", action: "Donation — Pihu ICU fund", points: 30, date: "2026-02-24" },
  { userName: "Rumana Malik", action: "Donation — Pihu ICU fund", points: 7, date: "2026-02-24" },
  { userName: "Tanvir Ahmed", action: "Donation — Max's surgery fund", points: 2, date: "2026-02-26" },
  { userName: "Sumaiya Haque", action: "Donation — Pihu ICU fund", points: 75, date: "2026-02-26" },
  { userName: "Lubna Mariam", action: "Donation — Pihu ICU fund", points: 3, date: "2026-02-28" },
  { userName: "Rumana Malik", action: "Donation — Pihu ICU fund", points: 30, date: "2026-03-03" },
  { userName: "Tanvir Ahmed", action: "Donation — Pihu ICU fund", points: 23, date: "2026-03-04" },
  { userName: "Tahsin Khan", action: "Donation — Pihu ICU fund", points: 3, date: "2026-03-04" },
  { userName: "Nusrat Ema", action: "Donation — Pihu ICU fund", points: 3, date: "2026-03-04" },
  { userName: "Nafis Rahman", action: "Donation — Pihu ICU fund", points: 30, date: "2026-03-05" },
  { userName: "Mehjabin Karim", action: "Donation — Pihu ICU fund", points: 30, date: "2026-03-07" },
  { userName: "Sajid Bappi", action: "Donation — Pihu ICU fund", points: 8, date: "2026-03-07" },
  { userName: "Zubair Rahman", action: "Donation — Pihu ICU fund", points: 12, date: "2026-03-09" },
  { userName: "Mitu Akter", action: "Donation — Pihu ICU fund", points: 6, date: "2026-03-09" },
  { userName: "Anika Tabassum", action: "Donation — Pihu ICU fund", points: 2, date: "2026-03-11" },
  { userName: "Mehjabin Karim", action: "Donation — Pihu ICU fund", points: 30, date: "2026-03-13" },
  { userName: "Imran Hossain", action: "Donation — Pihu ICU fund", points: 8, date: "2026-03-14" },
  { userName: "Mehjabin Karim", action: "Donation — Pihu ICU fund", points: 3, date: "2026-03-14" },
  { userName: "Farhana Yasmin", action: "Donation — Max's surgery fund", points: 40, date: "2026-03-17" },
  { userName: "Mitu Akter", action: "Donation — Max's surgery fund", points: 2, date: "2026-03-19" },
  { userName: "Tanvir Ahmed", action: "Donation — Max's surgery fund", points: 6, date: "2026-04-01" },
  { userName: "Rashed Karim", action: "Donation — Max's surgery fund", points: 25, date: "2026-04-03" },
  { userName: "Jenny Fernandes", action: "Donation — Max's surgery fund", points: 8, date: "2026-04-07" },
  { userName: "Sajid Bappi", action: "Donation — Max's surgery fund", points: 8, date: "2026-04-08" },
  { userName: "Priya Das", action: "Donation — Max's surgery fund", points: 5, date: "2026-04-11" },
  { userName: "Nusrat Ema", action: "Donation — Max's surgery fund", points: 28, date: "2026-04-12" },
  { userName: "Sumaiya Haque", action: "Donation — Max's surgery fund", points: 1, date: "2026-04-16" },
  { userName: "Priya Das", action: "Donation — Max's surgery fund", points: 30, date: "2026-04-17" },
  { userName: "Arif Chowdhury", action: "Donation — Max's surgery fund", points: 15, date: "2026-04-18" },
  { userName: "Rumana Malik", action: "Donation — Max's surgery fund", points: 30, date: "2026-04-21" },
  { userName: "Farhana Yasmin", action: "Donation — Max's surgery fund", points: 2, date: "2026-04-21" },
  { userName: "Mitu Akter", action: "Donation — Max's surgery fund", points: 3, date: "2026-04-22" },
  { userName: "Tanvir Ahmed", action: "Donation — Max's surgery fund", points: 4, date: "2026-05-02" },
  { userName: "Sumaiya Haque", action: "Donation — Max's surgery fund", points: 30, date: "2026-05-02" },
  { userName: "Kabir Andalib", action: "Donation — Max's surgery fund", points: 2, date: "2026-05-08" },
  { userName: "Shakib Al Hasan", action: "Donation — Max's surgery fund", points: 30, date: "2026-05-15" },
  { userName: "Mitu Akter", action: "Donation — Max's surgery fund", points: 3, date: "2026-05-18" },
  { userName: "Farhana Yasmin", action: "Donation — Max's surgery fund", points: 32, date: "2026-06-01" },
  { userName: "Tanvir Ahmed", action: "Donation — Max's surgery fund", points: 12, date: "2026-06-04" },
  { userName: "Lubna Mariam", action: "Donation — Max's surgery fund", points: 1, date: "2026-06-11" },
  { userName: "UIU Rotaract Club", action: "Donation — Max's surgery fund", points: 8, date: "2026-06-16" },
  { userName: "Mitu Akter", action: "Donation — Max's surgery fund", points: 9, date: "2026-06-19" },
  { userName: "Jenny Fernandes", action: "Donation — Max's surgery fund", points: 6, date: "2026-06-19" },
  { userName: "Rashed Karim", action: "Donation — Max's surgery fund", points: 2, date: "2026-06-21" },
  { userName: "Tanvir Ahmed", action: "Donation — Max's surgery fund", points: 6, date: "2026-06-28" },
  { userName: "Rumana Malik", action: "Donation — Max's surgery fund", points: 8, date: "2026-07-03" },
  { userName: "Farhana Yasmin", action: "Donation — Max's surgery fund", points: 8, date: "2026-07-11" },
  { userName: "Mitu Akter", action: "Donation — Max's surgery fund", points: 2, date: "2026-07-17" },
  { userName: "Tanvir Ahmed", action: "Donation — Max's surgery fund", points: 23, date: "2026-07-27" },
  { userName: "Mehjabin Karim", action: "Donation — Max's surgery fund", points: 8, date: "2026-08-02" },
  { userName: "Lubna Mariam", action: "Donation — Max's surgery fund", points: 30, date: "2026-08-06" },
  { userName: "Anika Tabassum", action: "Donation — Max's surgery fund", points: 3, date: "2026-08-10" },
  { userName: "Mitu Akter", action: "Donation — Max's surgery fund", points: 4, date: "2026-08-12" },
  { userName: "Lubna Mariam", action: "Donation — Max's surgery fund", points: 30, date: "2026-08-12" },
  { userName: "Rumana Malik", action: "Donation — Max's surgery fund", points: 30, date: "2026-08-13" },
  { userName: "Farhana Yasmin", action: "Donation — Max's surgery fund", points: 8, date: "2026-08-15" },
  { userName: "Tanvir Ahmed", action: "Donation — Max's surgery fund", points: 8, date: "2026-08-26" },
  { userName: "Zubair Rahman", action: "Donation — Max's surgery fund", points: 15, date: "2026-08-26" },
  { userName: "Jenny Fernandes", action: "Donation — Max's surgery fund", points: 2, date: "2026-08-30" },
  { userName: "Tahsin Khan", action: "Donation — Winter blanket drive", points: 15, date: "2026-09-02" },
  { userName: "Imran Hossain", action: "Donation — Winter blanket drive", points: 6, date: "2026-09-02" },
  { userName: "Farhana Yasmin", action: "Donation — Winter blanket drive", points: 1, date: "2026-09-02" },
  { userName: "Jenny Fernandes", action: "Donation — Winter blanket drive", points: 20, date: "2026-09-03" },
  { userName: "Mitu Akter", action: "Donation — Winter blanket drive", points: 1, date: "2026-09-04" },
  { userName: "Sajid Bappi", action: "Donation — Winter blanket drive", points: 3, date: "2026-09-04" },
  { userName: "Shakib Al Hasan", action: "Donation — Winter blanket drive", points: 20, date: "2026-09-05" },
  { userName: "Mehjabin Karim", action: "Donation — Winter blanket drive", points: 20, date: "2026-09-06" },
  { userName: "Kabir Andalib", action: "Donation — Winter blanket drive", points: 2, date: "2026-09-06" },
  { userName: "Rashed Karim", action: "Donation — Winter blanket drive", points: 3, date: "2026-09-07" },
  { userName: "Nusrat Ema", action: "Donation — Winter blanket drive", points: 8, date: "2026-09-07" },
  { userName: "Priya Das", action: "Donation — Winter blanket drive", points: 1, date: "2026-09-07" },
  { userName: "PawMart Dhanmondi", action: "Donation — Winter blanket drive", points: 15, date: "2026-09-08" },
  { userName: "Rashed Karim", action: "Donation — Max's surgery fund", points: 10, date: "2026-09-08" },
  { userName: "Tanvir Ahmed", action: "Donation — Winter blanket drive", points: 1, date: "2026-09-08" },
  { userName: "Gulshan Book Club", action: "Donation — Winter blanket drive", points: 2, date: "2026-09-08" },
  { userName: "Chowdhury family", action: "Donation — Winter blanket drive", points: 8, date: "2026-09-08" },
  { userName: "UIU Rotaract Club", action: "Donation — Winter blanket drive", points: 3, date: "2026-09-09" },
  { userName: "Tahsin Khan", action: "Donation — Ramna vaccine drive", points: 5, date: "2026-09-10" },
  { userName: "Priya Das", action: "Donation — Ramna vaccine drive", points: 5, date: "2026-09-10" },
  { userName: "Anika Tabassum", action: "Donation — Winter blanket drive", points: 5, date: "2026-09-10" },
  { userName: "Nusrat Ema", action: "Donation — Ramna vaccine drive", points: 1, date: "2026-09-10" },
  { userName: "Shakib Al Hasan", action: "Donation — Ramna vaccine drive", points: 4, date: "2026-09-11" },
  { userName: "Nafis Rahman", action: "Donation — Ramna vaccine drive", points: 11, date: "2026-09-11" },
  { userName: "Farhana Yasmin", action: "Donation — Ramna vaccine drive", points: 16, date: "2026-09-11" },
  { userName: "Mehjabin Karim", action: "Donation — Ramna vaccine drive", points: 2, date: "2026-09-11" },
  { userName: "Sumaiya Haque", action: "Donation — Winter blanket drive", points: 15, date: "2026-09-11" },
  { userName: "Nafis Rahman", action: "Donation — Winter blanket drive", points: 2, date: "2026-09-11" },
  { userName: "Zubair Rahman", action: "Donation — Winter blanket drive", points: 1, date: "2026-09-11" },
  { userName: "Imran Hossain", action: "Donation — Ramna vaccine drive", points: 10, date: "2026-09-11" },
  { userName: "Kabir Andalib", action: "Donation — Ramna vaccine drive", points: 2, date: "2026-09-12" },
  { userName: "Chowdhury family", action: "Donation — Ramna vaccine drive", points: 10, date: "2026-09-12" },
  { userName: "Jenny Fernandes", action: "Donation — Ramna vaccine drive", points: 12, date: "2026-09-12" },
  { userName: "Rashed Karim", action: "Donation — Ramna vaccine drive", points: 5, date: "2026-09-12" },
  { userName: "Sajid Bappi", action: "Donation — Ramna vaccine drive", points: 15, date: "2026-09-12" },
  { userName: "Tanvir Ahmed", action: "Vet clinic review", points: 10, date: "2026-08-01" },
  { userName: "Mitu Akter", action: "Registered Milky as blood donor", points: 50, date: "2026-06-01" },
  { userName: "Jenny Fernandes", action: "Registered Rex as blood donor", points: 50, date: "2026-05-15" },
  { userName: "Jenny Fernandes", action: "Found & reported orange tabby", points: 100, date: "2026-08-30" },
  { userName: "Sara Chowdhury", action: "Adopted Mishti", points: 200, date: "2026-08-20" },
  { userName: "Sara Chowdhury", action: "Vet clinic review", points: 10, date: "2026-08-25" },
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
