"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Syringe,
  Scissors,
  Users,
  PawPrint,
  Dog,
  Cat,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { usePetCare } from "@/lib/store";
import {
  pets as seedPets,
  shelters,
  type Pet,
  type Species,
  type Energy,
  type Screen,
  ageLabel,
  daysWaiting,
  shelterName,
} from "@/data/seed";
import { PetCard, PetPhoto, StatusBadge } from "./cards";
import { AdoptDialog } from "./dialogs";

type SpeciesFilter = Species | "all";

export function PetsScreen({
  initialSpecies,
  selectedPetId,
  onSelectPet,
  onNavigate,
}: {
  initialSpecies?: Species;
  selectedPetId: number | null;
  onSelectPet: (id: number | null) => void;
  onNavigate: (s: Screen) => void;
}) {
  const overrides = usePetCare((s) => s.petStatusOverrides);
  const pets = useMemo(
    () => seedPets.map((p) => ({ ...p, status: overrides[p.id] ?? p.status })),
    [overrides]
  );
  const pet = pets.find((p) => p.id === selectedPetId) ?? null;

  if (pet) {
    return <PetDetail pet={pet} onBack={() => onSelectPet(null)} onNavigate={onNavigate} />;
  }
  return <PetList pets={pets} initialSpecies={initialSpecies} onSelect={onSelectPet} />;
}

/* ------------------------------------------------------------------ */
/* Listing                                                             */
/* ------------------------------------------------------------------ */

function PetList({
  pets,
  initialSpecies,
  onSelect,
}: {
  pets: Pet[];
  initialSpecies?: Species;
  onSelect: (id: number) => void;
}) {
  const [species, setSpecies] = useState<SpeciesFilter>(initialSpecies ?? "all");
  const [energy, setEnergy] = useState<Energy | "all">("all");
  const [kidsOnly, setKidsOnly] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = pets
    .filter((p) => (species === "all" ? true : p.species === species))
    .filter((p) => (energy === "all" ? true : p.energy === energy))
    .filter((p) => (kidsOnly ? p.goodWith.kids : true))
    .filter((p) =>
      query.trim()
        ? (p.name + " " + p.breed + " " + p.tags.join(" ")).toLowerCase().includes(query.trim().toLowerCase())
        : true
    )
    .sort((a, b) => daysWaiting(b) - daysWaiting(a)); // longest waiters first

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Adopt a pet</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {filtered.length} pets shown · sorted by time waiting
      </p>

      {/* Filters */}
      <div className="mt-6 space-y-3">
        <div className="relative max-w-md">
          {/* search field */}
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, breed or tag…"
            className="w-full rounded-xl border bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            aria-label="Search pets"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip active={species === "all"} onClick={() => setSpecies("all")}>
            All
          </FilterChip>
          <FilterChip active={species === "dog"} onClick={() => setSpecies("dog")}>
            <span className="inline-flex items-center gap-1.5">
              <Dog className="h-4 w-4" /> Dogs
            </span>
          </FilterChip>
          <FilterChip active={species === "cat"} onClick={() => setSpecies("cat")}>
            <span className="inline-flex items-center gap-1.5">
              <Cat className="h-4 w-4" /> Cats
            </span>
          </FilterChip>
          <span className="mx-1 hidden h-5 w-px bg-ink-300 sm:block" />
          {(["low", "medium", "high"] as Energy[]).map((e) => (
            <FilterChip key={e} active={energy === e} onClick={() => setEnergy(energy === e ? "all" : e)}>
              {e} energy
            </FilterChip>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-ink-300 sm:block" />
          <FilterChip active={kidsOnly} onClick={() => setKidsOnly(!kidsOnly)}>
            Good with kids
          </FilterChip>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <PawPrint className="h-12 w-12 text-ink-300" />
          <p className="font-semibold">No pets match those filters</p>
          <p className="text-sm text-muted-foreground">Try clearing a filter or two.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ConnectedPetCard key={p.id} pet={p} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-white text-ink-600 hover:border-ink-400"
      )}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function ConnectedPetCard({ pet, onSelect }: { pet: Pet; onSelect: (id: number) => void }) {
  const favorites = usePetCare((s) => s.favorites);
  const toggleFavorite = usePetCare((s) => s.toggleFavorite);
  return (
    <PetCard
      pet={pet}
      isFavorite={favorites.includes(pet.id)}
      onOpen={() => onSelect(pet.id)}
      onFavorite={() => toggleFavorite(pet.id)}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Detail                                                              */
/* ------------------------------------------------------------------ */

function PetDetail({
  pet,
  onBack,
  onNavigate,
}: {
  pet: Pet;
  onBack: () => void;
  onNavigate: (s: Screen) => void;
}) {
  const favorites = usePetCare((s) => s.favorites);
  const toggleFavorite = usePetCare((s) => s.toggleFavorite);
  const [adoptOpen, setAdoptOpen] = useState(false);
  const shelter = shelters.find((s) => s.id === pet.shelterId);
  const fav = favorites.includes(pet.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <Button variant="ghost" onClick={onBack} className="mb-4 -ml-2 text-ink-600">
        <ArrowLeft className="h-4 w-4" /> All pets
      </Button>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: art + facts */}
        <div className="space-y-4 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl shadow-soft">
            <PetPhoto pet={pet} className="h-64 w-full sm:h-72" sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Fact label="Age" value={ageLabel(pet.ageMonths)} />
            <Fact label="Size" value={pet.size} />
            <Fact label="Gender" value={pet.gender} />
            <Fact label="Energy" value={`${pet.energy}`} />
            <Fact label="Waiting" value={`${daysWaiting(pet)} days`} />
            <Fact label="Admitted" value={pet.admissionDate} />
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1", pet.vaccinated ? "bg-leaf-100 text-leaf-800" : "bg-ink-100 text-ink-600")}>
              <Syringe className="h-3.5 w-3.5" /> {pet.vaccinated ? "Vaccinated" : "Vaccines pending"}
            </span>
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1", pet.neutered ? "bg-leaf-100 text-leaf-800" : "bg-ink-100 text-ink-600")}>
              <Scissors className="h-3.5 w-3.5" /> {pet.neutered ? "Neutered" : "Not neutered"}
            </span>
            {pet.goodWith.kids && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-brand-800">
                <Users className="h-3.5 w-3.5" /> Good with kids
              </span>
            )}
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Shelter</p>
            <p className="mt-1 font-bold">{shelterName(pet.shelterId)}</p>
            <p className="mt-0.5 text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {shelter?.area}, {shelter?.city}
            </p>
            {shelter?.verified && (
              <Badge variant="outline" className="mt-2 border-leaf-200 bg-leaf-50 text-leaf-800">
                License verified · {shelter.license}
              </Badge>
            )}
          </div>
        </div>

        {/* Right: story */}
        <div className="space-y-5 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{pet.name}</h1>
                <StatusBadge status={pet.status} />
              </div>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                {pet.species === "dog" ? <Dog className="h-4 w-4" /> : <Cat className="h-4 w-4" />}
                {pet.breed} · {pet.tags.join(" · ")}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className={cn("rounded-full", fav && "border-danger-300 bg-danger-50")}
              onClick={() => toggleFavorite(pet.id)}
              aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn("h-4 w-4", fav && "fill-danger-500 text-danger-500")} />
            </Button>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-soft">
            <h2 className="flex items-center gap-2 font-bold">
              <PawPrint className="h-4 w-4 text-primary" /> {pet.name}&apos;s story
            </h2>
            <p className="mt-2 leading-relaxed text-ink-700">{pet.story}</p>
          </div>

          <Accordion type="single" collapsible className="rounded-2xl border bg-white px-5">
            <AccordionItem value="medical" className="border-none">
              <AccordionTrigger className="text-sm font-bold">Medical history</AccordionTrigger>
              <AccordionContent className="text-sm text-ink-600">{pet.medicalHistory}</AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Sticky-ish action bar */}
          <div className="sticky bottom-4 rounded-2xl border bg-white p-3 shadow-soft sm:flex sm:items-center sm:gap-3">
            <div className="mb-2.5 sm:mb-0 sm:flex-1 sm:pl-1">
              <p className="text-sm font-semibold">Ready to meet {pet.name}?</p>
              <p className="text-xs text-muted-foreground">Applications go straight to the shelter.</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-primary/30 text-primary hover:bg-accent sm:flex-none"
                onClick={() => onNavigate("campaigns")}
              >
                Donate instead
              </Button>
              <Button
                className="flex-1 rounded-xl sm:flex-none"
                onClick={() => setAdoptOpen(true)}
                disabled={pet.status === "adopted"}
              >
                <Heart className="h-4 w-4" />
                {pet.status === "adopted" ? "Already adopted" : "Adopt me"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AdoptDialog pet={pet} open={adoptOpen} onClose={() => setAdoptOpen(false)} />
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-3">
      <p className="text-[11px] uppercase tracking-wide text-ink-400">{label}</p>
      <p className="font-semibold capitalize">{value}</p>
    </div>
  );
}
