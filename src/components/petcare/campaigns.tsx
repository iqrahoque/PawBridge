"use client";

import { useState } from "react";
import { Truck, Package, MapPin, Route, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { campaigns, pets, wishItems, shelterName, transportMission, bdt, fmtDate, seedDonations } from "@/data/seed";
import { usePetCare } from "@/lib/store";
import { CampaignCard, PetPhoto } from "./cards";
import { DonateDialog } from "./dialogs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CampaignsScreen() {
  const myDonations = usePetCare((s) => s.donations);
  const claimedLegs = usePetCare((s) => s.claimedLegs);
  const sponsoredPets = usePetCare((s) => s.sponsoredPets);
  const claimTransportLeg = usePetCare((s) => s.claimTransportLeg);
  const sponsorPet = usePetCare((s) => s.sponsorPet);
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
      <section className="bg-tint-cyan border-b border-brand-100">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight text-ink-800 sm:text-4xl">
                Fund a treatment
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Cover a pet&apos;s surgery, stock a shelter&apos;s wish list, or fund a rescue
                transport. Most gifts are ৳100–৳1,000.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="rounded-2xl border bg-white px-5 py-3 text-center shadow-soft">
                <p className="text-xl font-bold text-ink-800">{bdt(totalRaised)}</p>
                <p className="text-[11px] font-medium text-muted-foreground">raised by {allDonations.length} donors</p>
              </div>
              <div className="rounded-2xl border bg-white px-5 py-3 text-center shadow-soft">
                <p className="text-xl font-bold text-primary">{bdt(Math.round(totalRaised / allDonations.length))}</p>
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
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Users className="h-5 w-5 text-primary" /> Latest donations
        </h2>
        <p className="text-sm text-muted-foreground">
          Newest first. Names are hidden for anonymous gifts.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((d, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border bg-white p-3.5 shadow-soft">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary">
                {(d.name ?? "?").charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{d.name ?? "Anonymous"}</p>
                <p className="truncate text-xs text-muted-foreground">{d.message || d.date}</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-primary">{bdt(d.amount)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Campaign updates */}
      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight">How your money was used</h2>
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
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
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
                        ? "border-danger-200 bg-danger-50 text-danger-700"
                        : "border-ink-200 bg-ink-50 text-ink-600"
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
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Truck className="h-5 w-5 text-primary" /> Rescue transport relay
        </h2>
        <p className="text-sm text-muted-foreground">
          For long-distance transfers, volunteers each drive one leg of the route.
        </p>
        <Card className="mt-4 shadow-soft">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold">{transportMission.title}</p>
              <Badge variant="outline" className="border-leaf-200 bg-leaf-50 text-leaf-800">
                <Clock className="mr-1 h-3 w-3" /> Departs {fmtDate(transportMission.neededOn)}
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              {transportMission.legs.map((l) => {
                const claimed = l.status === "claimed" || claimedLegs.includes(l.leg);
                return (
                  <div
                    key={l.leg}
                    className={cn(
                      "flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 transition-colors",
                      claimed ? "border-leaf-200 bg-leaf-50/60" : "bg-white"
                    )}
                  >
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <Route className="h-4 w-4 text-primary" />
                      Leg {l.leg}: {l.from} → {l.to}
                      <span className="text-xs text-muted-foreground">({l.km} km)</span>
                    </p>
                    {claimed ? (
                      <Badge variant="outline" className="border-leaf-200 bg-leaf-50 text-leaf-800">
                        Driver: {l.status === "claimed" ? l.driver : "Sara Chowdhury (you)"}
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg"
                        onClick={() => claimTransportLeg(l.leg)}
                      >
                        Claim this leg (+75 karma)
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Virtual fostering (U6) */}
      <section className="mt-12 mb-4">
        <h2 className="text-xl font-bold tracking-tight">Virtual fostering</h2>
        <p className="text-sm text-muted-foreground">
          Can&apos;t adopt? Sponsor a long-stay pet monthly and get their updates.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { petId: 9, sponsor: "Farhana Yasmin", monthly: 300 },
            { petId: 7, sponsor: "Mitu Akter", monthly: 200 },
          ].map(({ petId, sponsor, monthly }) => {
            const pet = pets.find((p) => p.id === petId);
            if (!pet) return null;
            const sponsoring = sponsoredPets.includes(petId);
            return (
              <Card key={petId} className="shadow-soft">
                <CardContent className="flex items-center gap-4 p-4">
                  <PetPhoto pet={pet} className="h-16 w-16 shrink-0 rounded-full" sizes="64px" />
                  <div className="flex-1">
                    <p className="font-bold">{pet.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Sponsored by {sponsor} · {bdt(monthly)}/month
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={sponsoring ? "default" : "outline"}
                    className="rounded-lg"
                    disabled={sponsoring}
                    onClick={() => sponsorPet(petId, pet.name)}
                  >
                    {sponsoring ? "You're a sponsor" : "Sponsor too"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
      </div>

      <DonateDialog campaignId={donateFor ?? 1} open={donateFor !== null} onClose={() => setDonateFor(null)} />
    </div>
  );
}
