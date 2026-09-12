"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Client-side "database" for the GitHub Pages demo.
 * Mirrors what the MySQL triggers + API would do server-side:
 *  - addDonation        ≈ INSERT INTO donations (trigger updates raised_amount)
 *  - addApplication     ≈ INSERT INTO adoption_applications (pet auto-pends)
 *  - decideApplication  ≈ PATCH /applications/:id (approve flips pet status)
 * All state persists to localStorage so the demo feels real.
 */

export interface MyApplication {
  id: number;
  petId: number;
  applicant: string;
  status: "submitted" | "under_review" | "approved" | "rejected";
  message: string;
  homeType: string;
  experience: boolean;
  date: string;
}

export interface MyDonation {
  id: number;
  campaignId: number;
  amount: number;
  donorName: string | null;
  anonymous: boolean;
  message: string;
  method: "bkash" | "nagad" | "card" | "bank" | "cash";
  date: string;
}

export interface MyFoundReport {
  id: number;
  by: string;
  species: "dog" | "cat";
  color: string;
  area: string;
  description: string;
  foundOn: string;
  hue: number;
}

export interface MyLostReport {
  id: number;
  by: string;
  petName: string;
  species: "dog" | "cat";
  color: string;
  area: string;
  description: string;
  lostOn: string;
  hue: number;
}

export interface MyDonor {
  id: number;
  ownerName: string;
  petName: string;
  species: "dog" | "cat";
  bloodType: string;
  weightKg: number;
  lastDonation: null;
  active: boolean;
}

export interface MyRescueReport {
  id: number;
  reporter: string;
  species: "dog" | "cat" | "other";
  situation: string; // RescueSituation
  urgency: "critical" | "urgent" | "standard";
  area: string;
  description: string;
  reportedAt: string; // ISO datetime
  status: "reported" | "responding" | "rescued" | "closed";
  responders: string[];
}

export interface MatchDecision {
  key: string; // `${lostId}-${foundId}`
  status: "confirmed" | "dismissed";
}

interface PetCareState {
  applications: MyApplication[];
  donations: MyDonation[];
  favorites: number[];
  foundReports: MyFoundReport[];
  lostReports: MyLostReport[];
  donors: MyDonor[];
  rescueReports: MyRescueReport[];
  rescuedAlerts: Record<number, "rescued" | "closed">; // overrides for seeded rescue alerts
  rescueResponders: Record<number, string[]>; // extra responders joined per alert id
  matchDecisions: Record<string, "confirmed" | "dismissed">;
  petStatusOverrides: Record<number, "available" | "pending" | "adopted" | "medical_hold" | "fostered">;
  karmaEarned: number; // session karma on top of the seeded persona total
  karmaLog: { action: string; points: number }[];

  addApplication: (a: Omit<MyApplication, "id" | "date" | "status">) => void;
  addDonation: (d: Omit<MyDonation, "id" | "date">) => void;
  toggleFavorite: (petId: number) => void;
  addFoundReport: (r: Omit<MyFoundReport, "id" | "hue">) => void;
  addLostReport: (r: Omit<MyLostReport, "id" | "hue">) => void;
  addDonor: (d: Omit<MyDonor, "id">) => void;
  addRescueReport: (r: Omit<MyRescueReport, "id" | "status" | "responders" | "reportedAt">) => void;
  respondToRescue: (id: number) => void;
  markRescueRescued: (id: number) => void;
  markRescueClosed: (id: number) => void;
  decideMatch: (lostId: number, foundId: number, decision: "confirmed" | "dismissed") => void;
  decideApplication: (id: number, decision: "approved" | "rejected", petId: number) => void;
  earnKarma: (action: string, points: number) => void;
  spendKarma: (rewardTitle: string, points: number) => boolean;
  resetDemo: () => void;
}

let nextId = 1000;
const uid = () => ++nextId;
const today = () => new Date().toISOString().slice(0, 10);
const PERSONA_NAME = "Sara Chowdhury";

export const usePetCare = create<PetCareState>()(
  persist(
    (set, get) => ({
      applications: [],
      donations: [],
      favorites: [],
      foundReports: [],
      lostReports: [],
      donors: [],
      rescueReports: [],
      rescuedAlerts: {},
      rescueResponders: {},
      matchDecisions: {},
      petStatusOverrides: {},
      karmaEarned: 0,
      karmaLog: [],

      addApplication: (a) => {
        const app: MyApplication = { ...a, id: uid(), date: today(), status: "submitted" };
        set((s) => ({
          applications: [app, ...s.applications],
          // MySQL trigger: first application on an available pet → 'pending'
          petStatusOverrides:
            (s.petStatusOverrides[a.petId] ?? "available") === "available"
              ? { ...s.petStatusOverrides, [a.petId]: "pending" as const }
              : s.petStatusOverrides,
        }));
        get().earnKarma("Adoption application submitted", 25);
      },

      addDonation: (d) => {
        const donation: MyDonation = { ...d, id: uid(), date: today() };
        set((s) => ({ donations: [donation, ...s.donations] }));
        // Karma rule: 1 point per ৳100 donated
        get().earnKarma(`Donation — ৳${d.amount.toLocaleString("en-IN")}`, Math.max(1, Math.round(d.amount / 100)));
      },

      toggleFavorite: (petId) =>
        set((s) => ({
          favorites: s.favorites.includes(petId)
            ? s.favorites.filter((f) => f !== petId)
            : [...s.favorites, petId],
        })),

      addFoundReport: (r) => {
        const report: MyFoundReport = { ...r, id: uid(), hue: Math.floor(Math.random() * 360) };
        set((s) => ({ foundReports: [report, ...s.foundReports] }));
        get().earnKarma("Filed a found-pet report", 100);
      },

      addLostReport: (r) => {
        const report: MyLostReport = { ...r, id: uid(), hue: Math.floor(Math.random() * 360) };
        set((s) => ({ lostReports: [report, ...s.lostReports] }));
        get().earnKarma("Filed a lost-pet report", 25);
      },

      addDonor: (d) => {
        const donor: MyDonor = { ...d, id: uid() };
        set((s) => ({ donors: [donor, ...s.donors] }));
        get().earnKarma(`Registered ${d.petName} as blood donor`, 50);
      },

      // Rescue network (U9) — mirrors the rescue_reports table + karma rules
      addRescueReport: (r) => {
        const report: MyRescueReport = {
          ...r,
          id: uid(),
          status: "reported",
          responders: [],
          reportedAt: new Date().toISOString(),
        };
        set((s) => ({ rescueReports: [report, ...s.rescueReports] }));
        get().earnKarma(`Posted a ${r.urgency} rescue alert`, 50);
      },

      respondToRescue: (id) => {
        // Seeded alerts get their responder recorded separately
        if (id < 1000) {
          set((s) => ({
            rescueResponders: {
              ...s.rescueResponders,
              [id]: [...(s.rescueResponders[id] ?? []), PERSONA_NAME],
            },
          }));
        }
        get().earnKarma("Responding to a rescue alert", 40);
      },

      markRescueRescued: (id) => {
        if (id < 1000) {
          set((s) => ({ rescuedAlerts: { ...s.rescuedAlerts, [id]: "rescued" } }));
        } else {
          set((s) => ({
            rescueReports: s.rescueReports.map((r) =>
              r.id === id ? { ...r, status: "rescued" as const } : r
            ),
          }));
        }
        get().earnKarma("Animal secured — rescue complete!", 80);
      },

      markRescueClosed: (id) => {
        if (id < 1000) {
          set((s) => ({ rescuedAlerts: { ...s.rescuedAlerts, [id]: "closed" } }));
        } else {
          set((s) => ({
            rescueReports: s.rescueReports.map((r) =>
              r.id === id ? { ...r, status: "closed" as const } : r
            ),
          }));
        }
        get().earnKarma("Rescue case closed — animal is safe", 40);
      },

      decideMatch: (lostId, foundId, decision) => {
        set((s) => ({
          matchDecisions: { ...s.matchDecisions, [`${lostId}-${foundId}`]: decision },
        }));
        if (decision === "confirmed") {
          get().earnKarma("Confirmed a lost & found match — reunited!", 150);
        }
      },

      decideApplication: (id, decision, petId) => {
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id ? { ...a, status: decision } : a
          ),
          petStatusOverrides: {
            ...s.petStatusOverrides,
            [petId]: decision === "approved" ? ("adopted" as const) : ("available" as const),
          },
        }));
        if (decision === "approved") {
          get().earnKarma("Application approved — new family day!", 200);
        }
      },

      earnKarma: (action, points) =>
        set((s) => ({
          karmaEarned: s.karmaEarned + points,
          karmaLog: [{ action, points }, ...s.karmaLog].slice(0, 30),
        })),

      spendKarma: (rewardTitle, points) => {
        if (get().karmaEarned < points) return false;
        set((s) => ({
          karmaEarned: s.karmaEarned - points,
          karmaLog: [{ action: `Redeemed: ${rewardTitle}`, points: -points }, ...s.karmaLog],
        }));
        return true;
      },

      resetDemo: () =>
        set({
          applications: [],
          donations: [],
          favorites: [],
          foundReports: [],
          lostReports: [],
          donors: [],
          rescueReports: [],
          rescuedAlerts: {},
          rescueResponders: {},
          matchDecisions: {},
          petStatusOverrides: {},
          karmaEarned: 0,
          karmaLog: [],
        }),
    }),
    { name: "petcare-demo-v2", storage: createJSONStorage(() => localStorage) }
  )
);
