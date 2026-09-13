"use client";

import {
  Search,
  PawPrint,
  ArrowRight,
  Droplets,
  SearchCheck,
  HeartHandshake,
  Stethoscope,
  HandCoins,
  Siren,
  ShieldCheck,
  Dog,
  Cat,
  Coins,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  pets,
  campaigns,
  clinics,
  shelters,
  bloodDonors,
  seedRescueAlerts,
  bdt,
  seedDonations,
  type Screen,
} from "@/data/seed";
import { PetCard, CampaignCard, PetPhoto } from "./cards";
import type { MyDonation } from "@/lib/store";
import { usePetCare } from "@/lib/store";

export function HomeScreen({
  onNavigate,
  onOpenPet,
  onDonate,
}: {
  onNavigate: (s: Screen, opts?: { species?: "dog" | "cat" }) => void;
  onOpenPet: (petId: number) => void;
  onDonate: (campaignId: number) => void;
}) {
  const [query, setQuery] = useState("");
  const favorites = usePetCare((s) => s.favorites);
  const toggleFavorite = usePetCare((s) => s.toggleFavorite);
  const myDonations = usePetCare((s) => s.donations);
  const petStatusOverrides = usePetCare((s) => s.petStatusOverrides);

  const featured = pets.filter((p) => [1, 2, 9].includes(p.id));
  const activeCampaigns = campaigns.filter((c) => c.status === "active").slice(0, 3);
  const collagePets = pets.filter((p) => [2, 1, 10].includes(p.id));
  const openAlerts = seedRescueAlerts.filter((a) => a.status === "reported" || a.status === "responding").length;

  const totalRaised =
    seedDonations.reduce((s, d) => s + d.amount, 0) + myDonations.reduce((s, d) => s + d.amount, 0);
  const donorCount = seedDonations.length + myDonations.length;
  const availableCount = pets.filter(
    (p) => (petStatusOverrides[p.id] ?? p.status) === "available"
  ).length;

  const search = () => {
    const q = query.trim().toLowerCase();
    if (!q) {
      onNavigate("pets");
      return;
    }
    const match = pets.find(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.breed.toLowerCase().includes(q) ||
        p.species === q
    );
    if (match) onOpenPet(match.id);
    else onNavigate("pets");
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pb-20 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-up text-center lg:text-left">
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-ink-800 sm:text-5xl text-balance">
                Adopt a dog or cat in Dhaka
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-base text-ink-600 sm:text-lg lg:mx-0">
                Listings from verified shelters, fundraising for veterinary treatment, and a
                rescue network for animals in danger.
              </p>

              <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border bg-white p-2 shadow-soft lg:mx-0">
                <Search className="ml-2 h-5 w-5 shrink-0 text-ink-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && search()}
                  placeholder="Search by name or breed"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-ink-400"
                  aria-label="Search pets"
                />
                <Button onClick={search} className="shrink-0 rounded-xl">
                  Search
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Button size="lg" className="rounded-xl" onClick={() => onNavigate("pets")}>
                  Find Your Companion <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  className="rounded-full bg-ink-800 text-white hover:bg-ink-900"
                  onClick={() => onNavigate("campaigns")}
                >
                  <HandCoins className="h-4 w-4" /> Help an Animal
                </Button>
              </div>

              {openAlerts > 0 && (
                <button
                  onClick={() => onNavigate("rescue")}
                  className="mx-auto mt-4 flex cursor-pointer items-center gap-2 rounded-full border border-danger-200 bg-white py-1.5 pl-2.5 pr-3.5 transition-colors hover:border-danger-400 lg:mx-0"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-danger-500" />
                  <p className="text-xs font-semibold text-danger-700">
                    {openAlerts} open rescue {openAlerts === 1 ? "alert" : "alerts"}
                  </p>
                  <ArrowRight className="h-3.5 w-3.5 text-danger-500" />
                </button>
              )}
            </div>

            {/* Static pet preview */}
            <div className="hidden gap-5 lg:grid">
              <div className="grid grid-cols-2 gap-5">
                <MiniPetCard pet={collagePets[0]} onOpen={() => onOpenPet(collagePets[0].id)} priority />
                <MiniPetCard pet={collagePets[1]} onOpen={() => onOpenPet(collagePets[1].id)} priority />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <MiniPetCard pet={collagePets[2]} onOpen={() => onOpenPet(collagePets[2].id)} />
                <button
                  onClick={() => onNavigate("pets")}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 p-4 text-center transition-colors hover:bg-accent"
                >
                  <PawPrint className="h-6 w-6 text-primary" />
                  <p className="text-sm font-semibold text-primary">See all {pets.length} pets</p>
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Pets available", value: String(availableCount), Icon: PawPrint },
              { label: "Raised for treatment", value: bdt(totalRaised), Icon: HandCoins },
              { label: "Shelter & clinic partners", value: String(shelters.length + clinics.length), Icon: HeartHandshake },
              { label: "Blood donors on record", value: String(bloodDonors.filter((d) => d.active).length), Icon: Droplets },
            ].map((s) => (
              <Card key={s.label} className="border-primary/10 bg-white shadow-soft">
                <CardContent className="flex items-center gap-3 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent">
                    <s.Icon className="h-4 w-4 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold tracking-tight sm:text-xl">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rescue strip */}
      <section className="mx-auto max-w-6xl px-4 -mt-7 sm:-mt-8">
        <button
          onClick={() => onNavigate("rescue")}
          className="bg-rescue flex w-full cursor-pointer items-center gap-4 rounded-3xl border border-danger-200 p-5 text-left sm:p-6"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-danger-500 text-white">
            <Siren className="h-6 w-6" />
          </span>
          <span className="flex-1">
            <span className="block font-bold tracking-tight text-ink-800 sm:text-lg">
              See an animal in danger?
            </span>
            <span className="mt-0.5 block text-sm text-ink-600">
              Post an alert — nearby shelters and volunteers are notified and can take the case.
            </span>
          </span>
          <span className="hidden shrink-0 items-center gap-1.5 rounded-xl bg-danger-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-danger-600 sm:inline-flex">
            Open Rescue Network <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      </section>

      {/* Featured pets */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHead
          title="Pets ready for adoption"
          sub="From verified shelters, sorted by time waiting."
          action={() => onNavigate("pets")}
          actionLabel="See all"
        />
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PetCard
              key={p.id}
              pet={p}
              isFavorite={favorites.includes(p.id)}
              onOpen={() => onOpenPet(p.id)}
              onFavorite={() => toggleFavorite(p.id)}
            />
          ))}
        </div>
      </section>

      {/* Campaigns */}
      <section className="bg-tint-cyan border-y border-brand-100">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHead
            title="Fund a treatment"
            sub={`${donorCount} donors have contributed so far. Each campaign shows its total, donor list and outcome updates.`}
            action={() => onNavigate("campaigns")}
            actionLabel="All campaigns"
          />
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activeCampaigns.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                extraDonations={myDonations}
                onDonate={() => onDonate(c.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Other modules */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHead
          title="Other modules"
          sub="Blood bank, rescue network, lost &amp; found, karma rewards and crisis fostering."
        />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ModuleCard
            icon={Siren}
            tone="red"
            title="Rescue Network"
            text="Report an animal in danger. Volunteers claim the case and close it with an outcome note."
            action={() => onNavigate("rescue")}
          />
          <ModuleCard
            icon={Droplets}
            tone="rose"
            title="Pet Blood Bank"
            text="Urgent transfusions matched to eligible donor pets by species, blood type and donation window."
            action={() => onNavigate("blood")}
          />
          <ModuleCard
            icon={SearchCheck}
            tone="gold"
            title="Lost & Found"
            text="Lost and found reports are matched on species, colour and area."
            action={() => onNavigate("lostfound")}
          />
          <ModuleCard
            icon={Coins}
            tone="coral"
            title="Karma Ledger"
            text="Donations, adoptions and rescues earn points. Redeem them for vet checkups or shelter meals."
            action={() => onNavigate("karma")}
          />
          <ModuleCard
            icon={HeartHandshake}
            tone="sage"
            title="Safe Haven"
            text="Confidential temporary fostering for the pets of people in crisis."
            action={() => onNavigate("dashboard")}
          />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-paper border-t">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHead
            title="How PawBridge works"
            sub="From listing to adoption to follow-up care."
          />
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {[
              {
                n: "1",
                title: "Shelters list pets",
                text: "Verified shelters publish profiles with medical history, personality tags and photos.",
                Icon: PawPrint,
              },
              {
                n: "2",
                title: "You apply or give",
                text: "Applications go to the shelter for review. Donations update each campaign's progress.",
                Icon: HeartHandshake,
              },
              {
                n: "3",
                title: "Care continues",
                text: "The vet directory, blood bank and rescue network cover care after adoption.",
                Icon: Stethoscope,
              },
            ].map(({ n, title, text, Icon }) => (
              <Card key={n} className="shadow-soft">
                <CardContent className="p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-ink-800">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3.5 font-bold">
                    {n}. {title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="px-4 pb-14 pt-14">
        <div className="bg-cta mx-auto max-w-6xl rounded-3xl px-6 py-16 text-center text-white sm:px-12">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Ready to help?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Adopt a pet, fund a treatment, or report an animal in danger.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="rounded-xl bg-white text-ink-800 hover:bg-white/90" onClick={() => onNavigate("pets")}>
              <Dog className="h-4 w-4" /> Adopt a pet
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={() => onNavigate("campaigns")}>
              <Cat className="h-4 w-4" /> Fund a campaign
            </Button>
            <Button size="lg" variant="ghost" className="rounded-xl text-white/90 hover:bg-white/10 hover:text-white" onClick={() => onNavigate("rescue")}>
              <ShieldCheck className="h-4 w-4" /> Report a rescue
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section header                                                      */
/* ------------------------------------------------------------------ */

function SectionHead({
  title,
  sub,
  action,
  actionLabel,
}: {
  title: string;
  sub?: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="max-w-xl">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {sub && <p className="mt-1.5 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action && actionLabel && (
        <Button variant="ghost" className="text-primary hover:bg-accent hover:text-primary" onClick={action}>
          {actionLabel} <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero mini pet card                                                  */
/* ------------------------------------------------------------------ */

function MiniPetCard({ pet, onOpen, priority }: { pet: (typeof pets)[number]; onOpen: () => void; priority?: boolean }) {
  return (
    <button onClick={onOpen} className="w-full cursor-pointer text-left">
      <Card className="overflow-hidden pt-0 shadow-soft">
        <PetPhoto pet={pet} className="h-32 w-full" sizes="(max-width: 1024px) 50vw, 25vw" priority={priority} />
        <CardContent className="p-3">
          <p className="font-bold leading-tight">{pet.name}</p>
          <p className="text-xs capitalize text-muted-foreground">
            {pet.breed} · {pet.status.replace("_", " ")}
          </p>
        </CardContent>
      </Card>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Module card                                                         */
/* ------------------------------------------------------------------ */

function ModuleCard({
  icon: Icon,
  tone,
  title,
  text,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: "red" | "rose" | "gold" | "coral" | "sage";
  title: string;
  text: string;
  action: () => void;
}) {
  const tones = {
    red: "bg-danger-50 text-danger-600",
    rose: "bg-brand2-50 text-brand2-600",
    gold: "bg-ink-100 text-ink-700",
    coral: "bg-brand-50 text-brand-700",
    sage: "bg-leaf-50 text-leaf-700",
  };
  return (
    <button onClick={action} className="cursor-pointer text-left">
      <Card className="h-full shadow-soft">
        <CardContent className="p-5">
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </span>
          <p className="mt-3 font-bold">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
        </CardContent>
      </Card>
    </button>
  );
}
