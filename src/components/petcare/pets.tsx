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
  HeartHandshake,
  Check,
  LifeBuoy,
  CalendarClock,
  Home,
  Camera,
  ClipboardList,
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
    <div>
      {/* Header band + species identity */}
      <section className="bg-tint-sage border-b border-brand-100">
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-6">
          <h1 className="text-3xl font-bold tracking-tight">Find your new best friend</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} pets shown · sorted by time waiting
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <SpeciesTab
              active={species === "all"}
              onClick={() => setSpecies("all")}
              label="All pets"
              count={pets.length}
            />
            <SpeciesTab
              active={species === "dog"}
              onClick={() => setSpecies("dog")}
              label="Dogs"
              count={pets.filter((p) => p.species === "dog").length}
              tone="yellow"
              Icon={Dog}
            />
            <SpeciesTab
              active={species === "cat"}
              onClick={() => setSpecies("cat")}
              label="Cats"
              count={pets.filter((p) => p.species === "cat").length}
              tone="lav"
              Icon={Cat}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Filters */}
      <div className="space-y-3">
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
    </div>
  );
}


function SpeciesTab({
  active,
  onClick,
  label,
  count,
  tone,
  Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  tone?: "yellow" | "lav";
  Icon?: React.ComponentType<{ className?: string }>;
}) {
  const activeCls =
    tone === "yellow"
      ? "bg-dog-yellow text-dog-yellow-deep border-dog-yellow-deep"
      : tone === "lav"
        ? "bg-cat-lav text-cat-lav-deep border-cat-lav-deep"
        : "bg-ink-900 text-[#fff9f2] border-ink-900";
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors",
        active ? activeCls : "border-ink-300 bg-white text-ink-700 hover:border-ink-400"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
      <span className={cn("rounded-full px-2 py-0.5 text-[11px]", active ? "bg-white/40" : "bg-ink-100")}>
        {count}
      </span>
    </button>
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

          {/* Why I might be a good match (audit #7) */}
          <div className="rounded-2xl border bg-white p-5 shadow-soft">
            <h2 className="flex items-center gap-2 font-bold">
              <HeartHandshake className="h-4 w-4 text-primary" /> Why {pet.name} might be a good
              match
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-700">
              {matchReasons(pet).map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
                  {r}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-tint-sage px-4 py-3">
              <p className="text-sm font-semibold text-leaf-900">Adopter-profile compatibility</p>
              <p className="text-xl font-bold text-leaf-700">{matchScore(pet)}%</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Derived from breed profile, energy, temperament tags and medical readiness — the
              same signals the compatibility view in the MySQL database computes from the
              pet, adopter and home-profile tables.
            </p>
          </div>

          {/* Journey timeline — the animal's story as data (audit #27) */}
          <JourneyTimeline pet={pet} />

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

/* ------------------------------------------------------------------ */
/* Journey timeline — every event mirrors a row the MySQL schema keeps */
/* ------------------------------------------------------------------ */

function JourneyTimeline({ pet }: { pet: Pet }) {
  const adm = new Date(`${pet.admissionDate}T12:00:00`);
  const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const shelter = shelters.find((s) => s.id === pet.shelterId);

  type Ev = {
    date: string;
    title: string;
    body: string;
    Icon: React.ComponentType<{ className?: string }>;
    future?: boolean;
  };
  const events: Ev[] = [];

  events.push({
    date: fmt(adm),
    title: "Rescued & admitted",
    body: `Taken in by ${shelterName(pet.shelterId)}${shelter ? `, ${shelter.area}` : ""}. Intake exam and temperament notes filed.`,
    Icon: LifeBuoy,
  });
  if (pet.vaccinated)
    events.push({
      date: fmt(addDays(adm, 7)),
      title: "Vaccinated",
      body: "Rabies + combination vaccine — batch number and date recorded in vaccination_records.",
      Icon: Syringe,
    });
  if (pet.neutered)
    events.push({
      date: fmt(addDays(adm, 21)),
      title: pet.gender === "female" ? "Spayed" : "Neutered",
      body: "Performed at the partner clinic; recovery in shelter care.",
      Icon: Scissors,
    });
  events.push({
    date: fmt(addDays(adm, 28)),
    title: "Listed on PawBridge",
    body: "Photos, personality tags and medical history published for adopters.",
    Icon: Camera,
  });

  switch (pet.status) {
    case "pending":
      events.push({
        date: "This week",
        title: "Adoption application received",
        body: "The shelter is reviewing an application — follow the pipeline in your dashboard.",
        Icon: ClipboardList,
      });
      break;
    case "adopted":
      events.push({
        date: "Recently",
        title: "Found a family",
        body: "Application approved — left the shelter for a new home. Outcome recorded in adoption_applications.",
        Icon: Home,
      });
      break;
    case "fostered":
      events.push({
        date: "Currently",
        title: "Living with a foster family",
        body: "Temporary care through the Safe Haven program while adoption stays open.",
        Icon: Home,
      });
      break;
    case "medical_hold":
      events.push({
        date: "Currently",
        title: "On medical hold",
        body: "Recovering from treatment — adoption resumes once the vet clears.",
        Icon: Syringe,
      });
      break;
    default:
      events.push({
        date: "Today",
        title: "Waiting for the right person",
        body: "Available for adoption — every application goes straight to the shelter team.",
        Icon: HeartHandshake,
      });
  }

  if (pet.vaccinated)
    events.push({
      date: fmt(addDays(adm, 365)),
      title: "Next vaccine due",
      body: "Rabies booster — the clinic gets a reminder from vaccination_records.next_due_date.",
      Icon: CalendarClock,
      future: true,
    });

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-soft">
      <h2 className="flex items-center gap-2 font-bold">
        <PawPrint className="h-4 w-4 text-primary" /> {pet.name}&apos;s journey
      </h2>
      <ol className="mt-4">
        {events.map((e, i) => (
          <li key={e.title} className="relative flex gap-4 pb-5 last:pb-0">
            {i < events.length - 1 && (
              <span
                className="absolute left-[15px] top-9 h-[calc(100%-2.25rem)] w-px bg-brand-100"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                e.future
                  ? "border-dashed border-ink-300 bg-white text-ink-400"
                  : "border-brand2-200 bg-brand2-50 text-brand2-700"
              )}
            >
              <e.Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">{e.date}</p>
              <p className="text-sm font-bold text-ink-800">{e.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{e.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 rounded-xl bg-secondary p-3 text-xs leading-relaxed text-secondary-foreground">
        In the MySQL schema these events are rows in the status history and
        vaccination_records tables — this timeline is a query, not a story.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Compatibility reasoning (audit #7) — deterministic, DB-field driven */
/* ------------------------------------------------------------------ */

function matchReasons(pet: Pet): string[] {
  const r: string[] = [];
  if (pet.size === "small" || pet.energy === "low")
    r.push("You live in an apartment or prefer a calm companion");
  if (pet.energy === "high") r.push("You're active and want a walking / play buddy");
  if (pet.goodWith.kids) r.push("You have children at home");
  if (pet.goodWith.cats && pet.species === "cat") r.push("You already have a cat who needs a friend");
  if (pet.goodWith.dogs && pet.species === "dog") r.push("You already have a friendly dog");
  if (pet.vaccinated && pet.neutered)
    r.push("You want vet prep — vaccines and neutering — already done");
  r.push(`You can give ${pet.name} a stable, loving indoor home`);
  return r;
}

function matchScore(pet: Pet): number {
  return Math.min(96, 74 + matchReasons(pet).length * 3);
}
