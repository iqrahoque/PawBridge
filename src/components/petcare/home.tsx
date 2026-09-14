"use client";

import {
  PawPrint,
  House,
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
import { PetCard, CampaignCard, PetPhoto, SpeciesChip } from "./cards";
import { daysWaiting } from "@/data/seed";
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
  const heroDog = pets.find((p) => p.id === 1) ?? pets[0];
  const heroCat = pets.find((p) => p.id === 5) ?? pets[1];
  const streeties = [...pets].sort((a, b) => daysWaiting(b) - daysWaiting(a)).slice(0, 3);
  const openAlerts = seedRescueAlerts.filter((a) => a.status === "reported" || a.status === "responding").length;

  const totalRaised =
    seedDonations.reduce((s, d) => s + d.amount, 0) + myDonations.reduce((s, d) => s + d.amount, 0);
  const donorCount = seedDonations.length + myDonations.length;
  const available = pets.filter((p) => (petStatusOverrides[p.id] ?? p.status) === "available");
  const availableCount = available.length;
  const dogCount = available.filter((p) => p.species === "dog").length;
  const catCount = available.filter((p) => p.species === "cat").length;
  const donorOnRecord = bloodDonors.filter((d) => d.active).length;

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
      <section className="bg-hero paw-wallpaper border-b border-brand-100">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pb-20 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-up text-center lg:text-left">
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-ink-800 sm:text-5xl text-balance">
                Give a streetie a second chance.
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-base text-ink-600 sm:text-lg lg:mx-0">
                Find a loving companion, help an animal in danger, or get emergency care —
                Dhaka&apos;s dogs and cats, all in one place.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <button
                  onClick={() => onNavigate("pets", { species: "dog" })}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-brand-200 bg-tint-yellow px-4 py-2 text-sm font-semibold text-ink-800 transition-colors hover:border-dog-yellow-deep"
                >
                  <Dog className="h-4 w-4 text-dog-yellow-deep" /> {dogCount} dogs waiting
                </button>
                <button
                  onClick={() => onNavigate("pets", { species: "cat" })}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-brand-200 bg-cat-lav px-4 py-2 text-sm font-semibold text-ink-800 transition-colors hover:border-cat-lav-deep"
                >
                  <Cat className="h-4 w-4 text-cat-lav-deep" /> {catCount} cats waiting
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Button size="lg" className="rounded-full" onClick={() => onNavigate("pets")}>
                  Find a Pet <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  className="rounded-full bg-ink-900 text-[#fff9f2] hover:bg-ink-800"
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
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-danger-500" />
                  </span>
                  <p className="text-xs font-semibold text-danger-700">
                    {openAlerts} animals need help right now
                  </p>
                  <ArrowRight className="h-3.5 w-3.5 text-danger-500" />
                </button>
              )}
            </div>

            {/* Organic photo composition — real Dhaka streeties */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <button
                onClick={() => onOpenPet(heroDog.id)}
                className="blob-a relative block h-64 w-full cursor-pointer overflow-hidden shadow-deep sm:h-80"
                aria-label={`Open ${heroDog.name}'s profile`}
              >
                <PetPhoto pet={heroDog} className="absolute inset-0 h-full w-full" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              </button>
              <button
                onClick={() => onOpenPet(heroCat.id)}
                className="blob-b absolute -bottom-4 -left-2 h-36 w-36 cursor-pointer overflow-hidden border-4 border-[#fff9f2] shadow-lift sm:-left-6 sm:h-44 sm:w-44"
                aria-label={`Open ${heroCat.name}'s profile`}
              >
                <PetPhoto pet={heroCat} className="absolute inset-0 h-full w-full" sizes="180px" />
              </button>
              <div className="absolute -right-1 top-6 flex flex-col items-end gap-2 sm:right-2">
                <span className="rounded-full bg-white/95 px-3.5 py-2 text-xs font-bold text-ink-800 shadow-soft">
                  🐾 {availableCount} pets waiting
                </span>
                <span className="rounded-full bg-white/95 px-3.5 py-2 text-xs font-bold text-danger-700 shadow-soft">
                  🚨 {openAlerts} urgent rescues
                </span>
                <span className="rounded-full bg-white/95 px-3.5 py-2 text-xs font-bold text-ink-800 shadow-soft">
                  🩸 {donorOnRecord} blood donors nearby
                </span>
              </div>
              <p className="mt-8 px-16 text-center text-sm font-semibold italic text-brand-500 sm:px-24 lg:hidden">
                Every paw matters.
              </p>
            </div>
          </div>

          {/* Impact */}
          <div className="mx-auto mt-14 max-w-4xl">
            <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-brand-500">
              PawBridge impact
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Pets waiting for homes", value: String(availableCount), Icon: PawPrint },
                { label: "Raised for treatment", value: bdt(totalRaised), Icon: HeartHandshake },
                { label: "Shelters & partners", value: String(shelters.length + clinics.length), Icon: House },
                { label: "Active blood donors", value: String(donorOnRecord), Icon: Droplets },
              ].map((s) => (
                <Card key={s.label} className="border-brand-100 bg-[#fffdf9] shadow-soft">
                  <CardContent className="flex items-center gap-3 p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-brand-50">
                      <s.Icon className="h-4 w-4 text-brand-500" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-bold tracking-tight sm:text-xl">{s.value}</p>
                      <p className="text-[11px] text-muted-foreground">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Together, {donorCount} donors have made treatment possible for streeties like Max.
            </p>
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

      {/* Streeties of Dhaka */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <SectionHead
          title="Meet the streeties of Dhaka"
          sub="Real animals from around the city who have been waiting the longest for someone to notice them."
        />
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {streeties.map((p) => (
            <button key={p.id} onClick={() => onOpenPet(p.id)} className="cursor-pointer text-left">
              <Card className="overflow-hidden pt-0 shadow-soft transition-shadow hover:shadow-lift">
                <div className="relative">
                  <PetPhoto pet={p} className="h-40 w-full" />
                  <span className="absolute left-3 top-3">
                    <SpeciesChip species={p.species} />
                  </span>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{p.name}</p>
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">
                      {daysWaiting(p)} days waiting
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.story.split(".")[0]}.</p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </section>

      {/* Featured pets */}
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-14">
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
      <section className="bg-tint-peach border-y border-brand-100">
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

      {/* Situations */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHead
          title="What do you need right now?"
          sub="Real situations, one tap away — no forms, no jargon."
        />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <SituationCard
            icon={Siren}
            tone="red"
            question="I found an animal in danger"
            title="Rescue Network"
            action={() => onNavigate("rescue")}
          />
          <SituationCard
            icon={Droplets}
            tone="rose"
            question="A pet needs blood"
            title="Pet Blood Bank"
            action={() => onNavigate("blood")}
          />
          <SituationCard
            icon={SearchCheck}
            tone="gold"
            question="My pet is missing"
            title="Lost & Found"
            action={() => onNavigate("lostfound")}
          />
          <SituationCard
            icon={HeartHandshake}
            tone="lav"
            question="I need temporary foster care"
            title="Safe Haven"
            action={() => onNavigate("dashboard")}
          />
          <SituationCard
            icon={PawPrint}
            tone="brown"
            question="I want to help"
            title="Donate & Paw Points"
            action={() => onNavigate("campaigns")}
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
/* Module card                                                         */
/* ------------------------------------------------------------------ */

function SituationCard({
  icon: Icon,
  tone,
  question,
  title,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: "red" | "rose" | "gold" | "lav" | "brown";
  question: string;
  title: string;
  action: () => void;
}) {
  const tones = {
    red: "bg-danger-50 text-danger-600",
    rose: "bg-brand2-50 text-brand2-600",
    gold: "bg-tint-yellow text-dog-yellow-deep",
    lav: "bg-tint-lavender text-cat-lav-deep",
    brown: "bg-brand-50 text-brand-700",
  };
  return (
    <button onClick={action} className="cursor-pointer text-left">
      <Card className="h-full shadow-soft transition-shadow hover:shadow-lift">
        <CardContent className="p-5">
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink-800">{question}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-brand-600">
            {title} <ArrowRight className="h-3 w-3" />
          </p>
        </CardContent>
      </Card>
    </button>
  );
}
