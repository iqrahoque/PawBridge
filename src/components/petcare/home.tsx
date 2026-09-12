"use client";

import {
  Search,
  PawPrint,
  ArrowRight,
  Droplets,
  Sparkles,
  SearchCheck,
  HeartHandshake,
  Stethoscope,
  HandCoins,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { pets, campaigns, clinics, bloodDonors, bdt, seedDonations, type Screen } from "@/data/seed";
import { PetCard, CampaignCard } from "./cards";
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

  const featured = pets.filter((p) => [1, 2, 9].includes(p.id)).map((p) => p);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").slice(0, 3);

  const totalRaised =
    seedDonations.reduce((s, d) => s + d.amount, 0) + myDonations.reduce((s, d) => s + d.amount, 0);
  const availableCount = pets.filter(
    (p) => (petStatusOverrides[p.id] ?? p.status) === "available"
  ).length;

  const search = () => {
    const q = query.trim().toLowerCase();
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
      <section className="bg-hero bg-paw-pattern border-b">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white/70 px-3 py-1 text-xs font-semibold text-orange-800">
            <PawPrint className="h-3.5 w-3.5" /> Dhaka&apos;s pet welfare hub
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl text-balance">
            Find your best friend. <span className="text-primary">Change a life.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-stone-600 sm:text-lg">
            Adopt a dog or cat, fund urgent medical care, and find trusted vets — one platform
            connecting shelters, clinics and the people who care.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border bg-white p-2 shadow-soft">
            <Search className="ml-2 h-5 w-5 shrink-0 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Try “Mishti”, “deshi”, or “cat”…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
              aria-label="Search pets"
            />
            <Button onClick={search} className="shrink-0 rounded-xl">
              Search
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="rounded-xl" onClick={() => onNavigate("pets")}>
              Meet the pets <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl border-teal-600 text-teal-700 hover:bg-teal-50"
              onClick={() => onNavigate("campaigns")}
            >
              <HandCoins className="h-4 w-4" /> Donate
            </Button>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Pets waiting", value: String(availableCount) },
              { label: "Raised for care", value: bdt(totalRaised) },
              { label: "Partner clinics", value: String(clinics.length) },
              { label: "Blood donors", value: String(bloodDonors.filter((d) => d.active).length) },
            ].map((s) => (
              <Card key={s.label} className="shadow-soft">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-lg font-extrabold sm:text-2xl">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground sm:text-xs">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured pets */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Meet who&apos;s waiting</h2>
            <p className="text-sm text-muted-foreground">Longest waiters first — seniors need love too.</p>
          </div>
          <Button variant="ghost" className="text-primary" onClick={() => onNavigate("pets")}>
            See all <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      <section className="border-y bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Fund a life today</h2>
              <p className="text-sm text-muted-foreground">
                Every taka is tracked — watch the bar move, get outcome updates.
              </p>
            </div>
            <Button variant="ghost" className="text-primary" onClick={() => onNavigate("campaigns")}>
              All campaigns <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Unique modules */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Beyond adoption</h2>
        <p className="text-sm text-muted-foreground">
          Modules you won&apos;t find on any other pet platform.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ModuleCard
            icon={Droplets}
            tone="red"
            title="Pet Blood Bank"
            text="Urgent transfusion needs matched to eligible donor pets by species, blood type and eligibility window."
            action={() => onNavigate("blood")}
          />
          <ModuleCard
            icon={SearchCheck}
            tone="teal"
            title="Lost & Found"
            text="Lost and found reports auto-match on species, color and area — reunite pets with their humans."
            action={() => onNavigate("lostfound")}
          />
          <ModuleCard
            icon={Sparkles}
            tone="amber"
            title="Karma Ledger"
            text="Every donation, report and review earns points. Redeem for vet checkups or donate meals."
            action={() => onNavigate("karma")}
          />
          <ModuleCard
            icon={HeartHandshake}
            tone="orange"
            title="Safe Haven"
            text="Confidential temporary fostering for pets of people in crisis — privacy-first by design."
            action={() => onNavigate("dashboard")}
          />
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-extrabold tracking-tight">How PetCare works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
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
                text: "Applications go straight to the shelter; donations show live progress on every campaign.",
                Icon: HeartHandshake,
              },
              {
                n: "3",
                title: "Care continues",
                text: "Vet directory, blood bank, reminders and karma keep pets healthy long after adoption day.",
                Icon: Stethoscope,
              },
            ].map(({ n, title, text, Icon }) => (
              <Card key={n} className="shadow-soft">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-extrabold text-accent-foreground">
                      {n}
                    </span>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mt-3 font-bold">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ModuleCard({
  icon: Icon,
  tone,
  title,
  text,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: "red" | "teal" | "amber" | "orange";
  title: string;
  text: string;
  action: () => void;
}) {
  const tones = {
    red: "bg-red-50 text-red-700",
    teal: "bg-teal-50 text-teal-700",
    amber: "bg-amber-50 text-amber-700",
    orange: "bg-orange-50 text-orange-700",
  };
  return (
    <button onClick={action} className="cursor-pointer text-left">
      <Card className="h-full shadow-soft transition-all hover:shadow-lift hover:-translate-y-0.5">
        <CardContent className="p-5">
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </span>
          <p className="mt-3 font-bold">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Open <ArrowRight className="h-3.5 w-3.5" />
          </p>
        </CardContent>
      </Card>
    </button>
  );
}
