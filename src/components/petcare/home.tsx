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
  Siren,
  ShieldCheck,
  Users,
  Dog,
  Cat,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { pets, campaigns, clinics, bloodDonors, seedRescueAlerts, bdt, seedDonations, type Screen } from "@/data/seed";
import { PetCard, CampaignCard, PetArt } from "./cards";
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
  const openAlerts = seedRescueAlerts.filter((a) => a.status !== "closed").length;

  const totalRaised =
    seedDonations.reduce((s, d) => s + d.amount, 0) + myDonations.reduce((s, d) => s + d.amount, 0);
  const donorCount = seedDonations.length + myDonations.length;
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
      <section className="bg-hero bg-paw-pattern border-b overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pb-20 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-up text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs font-semibold text-primary shadow-soft">
                <PawPrint className="h-3.5 w-3.5" /> Dhaka&apos;s pet welfare hub
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl text-balance">
                Find your best friend.{" "}
                <span className="gradient-text">Change a life.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-base text-sagegray-600 sm:text-lg lg:mx-0">
                Adopt a dog or cat, fund urgent medical care, and rescue animals in danger —
                one platform connecting shelters, clinics and the people who care.
              </p>

              <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border bg-white/90 p-2 shadow-lift backdrop-blur lg:mx-0">
                <Search className="ml-2 h-5 w-5 shrink-0 text-sagegray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && search()}
                  placeholder="Try “Mishti”, “deshi”, or “cat”…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-sagegray-400"
                  aria-label="Search pets"
                />
                <Button onClick={search} className="shrink-0 rounded-xl">
                  Search
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Button size="lg" className="rounded-xl shadow-soft" onClick={() => onNavigate("pets")}>
                  Find Your Companion <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  className="rounded-xl bg-coral-500 text-white shadow-soft hover:bg-coral-600"
                  onClick={() => onNavigate("campaigns")}
                >
                  <HandCoins className="h-4 w-4" /> Help an Animal
                </Button>
              </div>

              {/* Live rescue status — clickable chip (moved out of the hero collage) */}
              <button
                onClick={() => onNavigate("rescue")}
                className="group mx-auto mt-4 flex cursor-pointer items-center gap-2 rounded-full border border-emred-200 bg-white py-1.5 pl-2.5 pr-3.5 shadow-soft transition-colors hover:border-emred-400 lg:mx-0"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emred-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emred-500" />
                </span>
                <p className="text-xs font-bold text-emred-700">{openAlerts} rescues need help now</p>
                <ArrowRight className="h-3.5 w-3.5 text-emred-500 transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* trust row */}
              <div className="mt-7 flex items-center justify-center gap-3 lg:justify-start">
                <div className="flex -space-x-2.5">
                  {["🐱", "🐶", "🩺", "🩸"].map((e, i) => (
                    <span
                      key={i}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-sage-100 to-coral-100 text-base shadow-soft"
                    >
                      {e}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-sagegray-600">
                  <strong>162 donors</strong> · <strong>120+ rescuers</strong> · 2 verified shelters{" "}
                  <br className="hidden sm:block" />
                  <span className="text-xs text-muted-foreground">already making a difference</span>
                </p>
              </div>
            </div>

            {/* Floating pet collage */}
            <div className="relative hidden h-[420px] lg:block">
              <div className="animate-float absolute left-2 top-6 w-56 rotate-[-4deg]">
                <MiniPetCard pet={collagePets[0]} onOpen={() => onOpenPet(collagePets[0].id)} />
              </div>
              <div className="animate-float-late absolute right-0 top-0 w-56 rotate-[3deg]">
                <MiniPetCard pet={collagePets[1]} onOpen={() => onOpenPet(collagePets[1].id)} />
              </div>
              <div className="animate-float absolute bottom-2 left-24 w-56 rotate-[2deg] [animation-delay:2s]">
                <MiniPetCard pet={collagePets[2]} onOpen={() => onOpenPet(collagePets[2].id)} />
              </div>
              {/* floating chips */}
              <div className="animate-float-late absolute right-8 bottom-24 rounded-2xl border bg-white/90 px-4 py-3 shadow-lift backdrop-blur [animation-delay:1s]">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Raised for care</p>
                <p className="text-xl font-extrabold gradient-text">{bdt(totalRaised)}</p>
              </div>
              {/* decorative blobs */}
              <div className="pointer-events-none absolute -right-10 top-1/3 h-40 w-40 rounded-full bg-coral-200/40 blur-2xl" />
              <div className="pointer-events-none absolute -left-6 bottom-0 h-36 w-36 rounded-full bg-gold-200/40 blur-2xl" />
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Pets waiting", value: String(availableCount), Icon: PawPrint },
              { label: "Raised for care", value: bdt(totalRaised), Icon: HandCoins },
              { label: "Rescue volunteers", value: "120+", Icon: Users },
              { label: "Blood donors", value: String(bloodDonors.filter((d) => d.active).length), Icon: Droplets },
            ].map((s) => (
              <Card key={s.label} className="border-primary/10 bg-white/80 shadow-soft backdrop-blur">
                <CardContent className="flex items-center gap-3 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent">
                    <s.Icon className="h-4 w-4 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-extrabold tracking-tight sm:text-xl">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rescue emergency strip */}
      <section className="mx-auto max-w-6xl px-4 -mt-7 sm:-mt-8">
        <button
          onClick={() => onNavigate("rescue")}
          className="group bg-rescue flex w-full cursor-pointer items-center gap-4 rounded-3xl border border-emred-200 p-5 text-left shadow-lift transition-transform hover:-translate-y-0.5 sm:p-6"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emred-500 text-white shadow-soft">
            <Siren className="h-6 w-6 animate-pulse" />
          </span>
          <span className="flex-1">
            <span className="block font-extrabold tracking-tight text-charcoal sm:text-lg">
              A cat stuck on a ledge. A kitten in a storm drain. You can help.
            </span>
            <span className="mt-0.5 block text-sm text-sagegray-600">
              Post an animal in danger — trained volunteers near you respond within minutes.
            </span>
          </span>
          <span className="hidden shrink-0 items-center gap-1.5 rounded-xl bg-emred-500 px-4 py-2.5 text-sm font-bold text-white transition-all group-hover:scale-105 group-hover:bg-emred-600 sm:inline-flex">
            Get help now <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      </section>

      {/* Featured pets */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHead
          eyebrow="Adoption portal"
          title="Meet who's waiting"
          sub="Longest waiters first — seniors need love too."
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
      <section className="border-y bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHead
            eyebrow="Transparent fundraising"
            title="Fund a life today"
            sub={`${donorCount} donors have given so far — every taka is tracked, with outcome updates on each campaign.`}
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

      {/* Unique modules */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHead
          eyebrow="One-of-a-kind modules"
          title="Beyond adoption"
          sub="Facilities you won't find on any other pet platform."
        />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ModuleCard
            icon={Siren}
            tone="red"
            title="Rescue Network"
            text="Report an animal in danger. Nearby volunteers respond and close the case safely."
            action={() => onNavigate("rescue")}
          />
          <ModuleCard
            icon={Droplets}
            tone="rose"
            title="Pet Blood Bank"
            text="Urgent transfusions matched to eligible donor pets by species, type and window."
            action={() => onNavigate("blood")}
          />
          <ModuleCard
            icon={SearchCheck}
            tone="gold"
            title="Lost & Found"
            text="Reports auto-match on species, color and area — reunite pets with their humans."
            action={() => onNavigate("lostfound")}
          />
          <ModuleCard
            icon={Sparkles}
            tone="coral"
            title="Karma Ledger"
            text="Every good deed earns points. Redeem for vet checkups or donate meals."
            action={() => onNavigate("karma")}
          />
          <ModuleCard
            icon={HeartHandshake}
            tone="sage"
            title="Safe Haven"
            text="Confidential temporary fostering for pets of people in crisis — privacy-first."
            action={() => onNavigate("dashboard")}
          />
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHead
            eyebrow="Simple by design"
            title="How PetCare works"
            sub="From listing to lifelong care — three steps, one database."
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
                text: "Applications go straight to the shelter; donations move the live progress bar.",
                Icon: HeartHandshake,
              },
              {
                n: "3",
                title: "Care continues",
                text: "Vet directory, blood bank, rescue network and karma keep pets safe long after adoption day.",
                Icon: Stethoscope,
              },
            ].map(({ n, title, text, Icon }) => (
              <Card key={n} className="relative overflow-hidden shadow-soft transition-shadow hover:shadow-lift">
                <CardContent className="p-6">
                  <span className="absolute -right-2 -top-3 select-none text-7xl font-black text-primary/5">
                    {n}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-coral-500 text-white shadow-soft">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3.5 font-bold">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="px-4 pb-14 pt-14">
        <div className="bg-cta relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-16 text-center text-white shadow-lift sm:px-12 sm:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            Every paw deserves a chance. <span className="text-gold-300">Yours can give it.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Adopt, donate five minutes or five taka — the ledger remembers every kind act.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="rounded-xl bg-white text-forest hover:bg-white/90" onClick={() => onNavigate("pets")}>
              <Dog className="h-4 w-4" /> Adopt a pet
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={() => onNavigate("campaigns")}>
              <Cat className="h-4 w-4" /> Fund a campaign
            </Button>
            <Button size="lg" variant="ghost" className="rounded-xl text-gold-300 hover:bg-white/10 hover:text-gold-200" onClick={() => onNavigate("rescue")}>
              <ShieldCheck className="h-4 w-4" /> Join the rescue network
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section header with eyebrow                                         */
/* ------------------------------------------------------------------ */

function SectionHead({
  eyebrow,
  title,
  sub,
  action,
  actionLabel,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
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

function MiniPetCard({ pet, onOpen }: { pet: (typeof pets)[number]; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="w-full cursor-pointer text-left">
      <Card className="overflow-hidden pt-0 shadow-lift ring-gradient transition-transform hover:scale-[1.03]">
        <PetArt pet={pet} className="h-32 w-full" />
        <CardContent className="p-3">
          <p className="font-bold leading-tight">{pet.name}</p>
          <p className="text-xs text-muted-foreground">
            {pet.breed} · {pet.status === "available" ? "waiting for you" : pet.status.replace("_", " ")}
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
    red: "bg-emred-50 text-emred-700",
    rose: "bg-medical-100 text-medical-700",
    gold: "bg-gold-50 text-gold-700",
    coral: "bg-coral-50 text-coral-700",
    sage: "bg-sage-50 text-sage-700",
  };
  return (
    <button onClick={action} className="cursor-pointer text-left">
      <Card className="group h-full shadow-soft transition-all hover:shadow-lift hover:-translate-y-1">
        <CardContent className="p-5">
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]} transition-transform group-hover:scale-110`}>
            <Icon className="h-5 w-5" />
          </span>
          <p className="mt-3 font-bold">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
          <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Open <ArrowRight className="h-3.5 w-3.5" />
          </p>
        </CardContent>
      </Card>
    </button>
  );
}
