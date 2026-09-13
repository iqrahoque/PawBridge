"use client";

import { useState, useSyncExternalStore } from "react";
import { Nav, Footer } from "@/components/petcare/nav";
import { HomeScreen } from "@/components/petcare/home";
import { PetsScreen } from "@/components/petcare/pets";
import { CampaignsScreen } from "@/components/petcare/campaigns";
import { VetsScreen } from "@/components/petcare/vets";
import { BloodScreen } from "@/components/petcare/blood";
import { RescueScreen } from "@/components/petcare/rescue";
import { LostFoundScreen } from "@/components/petcare/lostfound";
import { KarmaScreen } from "@/components/petcare/karma";
import { DashboardScreen } from "@/components/petcare/dashboard";
import { DonateDialog } from "@/components/petcare/dialogs";
import { EmergencyButton } from "@/components/petcare/emergency";
import type { Screen, Species } from "@/data/seed";

const subscribeNoop = () => () => {};

/**
 * PetCare — single-page demo app.
 * GitHub Pages serves static files only, so all "routing" is client-side
 * state and all writes persist to localStorage (zustand persist).
 */
export default function Page() {
  // Hydration-safe mount detection (SSR renders false, client true — no effect needed)
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [speciesFilter, setSpeciesFilter] = useState<Species | undefined>(undefined);
  const [donateFor, setDonateFor] = useState<number | null>(null);

  const navigate = (s: Screen, opts?: { species?: Species }) => {
    setScreen(s);
    // Opening the Adopt screen from the nav always shows the list — only an
    // explicit species jump (home hero chips) pre-sets the filter.
    if (s !== "pets" || !opts?.species) setSelectedPetId(null);
    if (opts?.species) setSpeciesFilter(opts.species);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const openPet = (petId: number) => {
    setScreen("pets");
    setSpeciesFilter(undefined);
    setSelectedPetId(petId);
    window.scrollTo({ top: 0 });
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="h-16 border-b bg-white/60" />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-primary/60">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            <p className="text-sm font-medium">Loading PawBridge…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Nav screen={screen} onNavigate={navigate} />
      <main className="flex-1">
        {screen === "home" && (
          <HomeScreen onNavigate={navigate} onOpenPet={openPet} onDonate={(id) => setDonateFor(id)} />
        )}
        {screen === "pets" && (
          <PetsScreen
            initialSpecies={speciesFilter}
            selectedPetId={selectedPetId}
            onSelectPet={setSelectedPetId}
            onNavigate={navigate}
          />
        )}
        {screen === "campaigns" && <CampaignsScreen />}
        {screen === "vets" && <VetsScreen onNavigate={navigate} />}
        {screen === "blood" && <BloodScreen onNavigate={navigate} />}
        {screen === "rescue" && <RescueScreen />}
        {screen === "lostfound" && <LostFoundScreen />}
        {screen === "karma" && <KarmaScreen />}
        {screen === "dashboard" && <DashboardScreen />}
      </main>
      <Footer />
      <DonateDialog campaignId={donateFor ?? 1} open={donateFor !== null} onClose={() => setDonateFor(null)} />
      <EmergencyButton onNavigate={navigate} />
    </div>
  );
}
