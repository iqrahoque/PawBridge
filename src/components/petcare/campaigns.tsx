"use client";

import { useState } from "react";
import { Truck, Package, MapPin, Route, Clock, HandCoins, Heart, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { campaigns, wishItems, shelterName, transportMission, bdt, fmtDate, seedDonations, type Screen } from "@/data/seed";
import { usePetCare } from "@/lib/store";
import { CampaignCard } from "./cards";
import { DonateDialog } from "./dialogs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CampaignsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const myDonations = usePetCare((s) => s.donations);
  const [donateFor, setDonateFor] = useState<number | null>(null);

  const allDonations = [
    ...myDonations.map((d) => ({ name: d.anonymous ? null : d.donorName, amount: d.amount, message: d.message, date: d.date })),
    ...seedDonations.map((d) => ({ name: d.donorName, amount: d.amount, message: d.message ?? "", date: d.date })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  const totalRaised = allDonations.reduce((s, d) => s + d.amount, 0);
  const recent = allDonations.slice(0, 12);

  return (
    <div className="pb-4">
      {/* Header band */}
      <section className="bg-hero bg-paw-pattern border-b">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Transparent fundraising</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Small gifts. <span className="gradient-text">Big rescues.</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Fund a pet&apos;s surgery, stock a shelter&apos;s wish list, or fuel a rescue transport.
                Most of our donors give ৳100–৳1,000 — small amounts, stacked into surgeries.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="rounded-2xl border bg-white/85 px-5 py-3 text-center shadow-soft backdrop-blur">
                <p className="text-xl font-extrabold gradient-text">{bdt(totalRaised)}</p>
                <p className="text-[11px] font-medium text-muted-foreground">raised by {allDonations.length} donors</p>
              </div>
              <div className="rounded-2xl border bg-white/85 px-5 py-3 text-center shadow-soft backdrop-blur">
                <p className="text-xl font-extrabold text-primary">{bdt(Math.round(totalRaised / allDonations.length))}</p>
                <p className="text-[11px] font-medium text-muted-foreground">average gift</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Campaigns */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((c) => (
          <CampaignCard
            key={c.id}
            campaign={c}
            extraDonations={myDonations}
            onDonate={() => setDonateFor(c.id)}
          />
        ))}
      </div>

      {/* Donor wall */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <Users className="h-5 w-5 text-primary" /> Donor wall — latest gifts
        </h2>
        <p className="text-sm text-muted-foreground">
          Real people, real amounts. ৳100 from a student matters as much as ৳5,000 from a well-wisher.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((d, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border bg-white p-3.5 shadow-soft">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-extrabold text-primary">
                {(d.name ?? "?").charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{d.name ?? "Anonymous"}</p>
                <p className="truncate text-xs text-muted-foreground">{d.message || d.date}</p>
              </div>
              <span className="shrink-0 text-sm font-extrabold text-primary">{bdt(d.amount)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Campaign updates */}
      <section className="mt-12">
        <h2 className="text-xl font-extrabold tracking-tight">How your money was used</h2>
        <p className="text-sm text-muted-foreground">Shelter-posted outcome updates on past campaigns.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.flatMap((c) =>
            c.updates.map((u, i) => (
              <Card key={`${c.id}-${i}`} className="shadow-soft">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {c.title}
                  </p>
                  <p className="mt-1.5 text-sm">{u.text}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{fmtDate(u.date)}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Wish lists */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <Package className="h-5 w-5 text-primary" /> Shelter wish lists
        </h2>
        <p className="text-sm text-muted-foreground">Pledge goods instead of money.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {wishItems.map((w) => (
            <Card key={w.id} className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{w.item}</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      w.priority === "high"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-stone-200 bg-stone-50 text-stone-600"
                    )}
                  >
                    {w.priority} priority
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{shelterName(w.shelterId)}</p>
                <div className="mt-3">
                  <Progress value={(w.fulfilled / w.needed) * 100} className="h-2" />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {w.fulfilled}/{w.needed} pledged
                    {w.unitCost ? ` · ৳${w.unitCost.toLocaleString("en-IN")} per unit` : " · drop-off item"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Transport relay (U5) */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <Truck className="h-5 w-5 text-primary" /> Rescue transport relay
        </h2>
        <p className="text-sm text-muted-foreground">
          Volunteers each drive one leg of a long journey — like a relay race to a forever home.
        </p>
        <Card className="mt-4 shadow-soft">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold">{transportMission.title}</p>
              <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-800">
                <Clock className="mr-1 h-3 w-3" /> Departs {fmtDate(transportMission.neededOn)}
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              {transportMission.legs.map((l) => (
                <div
                  key={l.leg}
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 transition-colors",
                    l.status === "claimed" ? "border-violet-200 bg-violet-50/60" : "bg-white"
                  )}
                >
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Route className="h-4 w-4 text-primary" />
                    Leg {l.leg}: {l.from} → {l.to}
                    <span className="text-xs text-muted-foreground">({l.km} km)</span>
                  </p>
                  {l.status === "claimed" ? (
                    <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-800">
                      Driver: {l.driver}
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg"
                      onClick={() =>
                        usePetCare.getState().earnKarma(`Drove transport leg ${l.leg} (${l.from}→${l.to})`, 75)
                      }
                    >
                      Claim this leg (+75 karma)
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Virtual fostering (U6) */}
      <section className="mt-12 mb-4">
        <h2 className="text-xl font-extrabold tracking-tight">Virtual fostering</h2>
        <p className="text-sm text-muted-foreground">
          Can&apos;t adopt? Sponsor a long-stay pet monthly and get their updates.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { petId: 9, sponsor: "Farhana Yasmin", monthly: 300 },
            { petId: 7, sponsor: "Mitu Akter", monthly: 200 },
          ].map(({ petId, sponsor, monthly }) => {
            const pet = { name: petId === 9 ? "Kalu" : "Bagha", hue: petId === 9 ? 260 : 200, species: petId === 9 ? ("dog" as const) : ("cat" as const) };
            return (
              <Card key={petId} className="shadow-soft">
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl"
                    style={{ background: `hsl(${pet.hue} 70% 88%)` }}
                  >
                    🐾
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{pet.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Sponsored by {sponsor} · {bdt(monthly)}/month
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg"
                    onClick={() => usePetCare.getState().earnKarma(`Started virtual fostering ${pet.name}`, 60)}
                  >
                    Sponsor too
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
      </div>

      <DonateDialog campaignId={donateFor ?? 1} open={donateFor !== null} onClose={() => setDonateFor(null)} />
      {/* keep onNavigate referenced for future deep links */}
      <span className="hidden">{typeof onNavigate}</span>
      <span className="hidden"><MapPin className="h-3 w-3" /></span>
    </div>
  );
}
