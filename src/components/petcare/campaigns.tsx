"use client";

import { useState } from "react";
import { Truck, Package, MapPin, Route, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { campaigns, wishItems, shelterName, transportMission, bdt, fmtDate, type Screen } from "@/data/seed";
import { usePetCare } from "@/lib/store";
import { CampaignCard } from "./cards";
import { DonateDialog } from "./dialogs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CampaignsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const myDonations = usePetCare((s) => s.donations);
  const [donateFor, setDonateFor] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Donate</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Fund a pet&apos;s surgery, stock a shelter&apos;s wish list, or fuel a rescue transport.
        Every page shows live totals — the demo writes to localStorage exactly like the MySQL
        trigger writes <code className="text-xs">raised_amount</code>.
      </p>

      {/* Campaigns */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((c) => (
          <CampaignCard
            key={c.id}
            campaign={c}
            extraDonations={myDonations}
            onDonate={() => setDonateFor(c.id)}
          />
        ))}
      </div>

      {/* Campaign updates */}
      <section className="mt-12">
        <h2 className="text-xl font-extrabold tracking-tight">How your money was used</h2>
        <p className="text-sm text-muted-foreground">Shelter-posted outcome updates on past campaigns.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.flatMap((c) =>
            c.updates.map((u, i) => (
              <Card key={`${c.id}-${i}`} className="shadow-soft">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
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
              <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-800">
                <Clock className="mr-1 h-3 w-3" /> Departs {fmtDate(transportMission.neededOn)}
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              {transportMission.legs.map((l) => (
                <div
                  key={l.leg}
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3",
                    l.status === "claimed" ? "border-teal-200 bg-teal-50/60" : "bg-white"
                  )}
                >
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Route className="h-4 w-4 text-primary" />
                    Leg {l.leg}: {l.from} → {l.to}
                    <span className="text-xs text-muted-foreground">({l.km} km)</span>
                  </p>
                  {l.status === "claimed" ? (
                    <Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-800">
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

      <DonateDialog campaignId={donateFor ?? 1} open={donateFor !== null} onClose={() => setDonateFor(null)} />
      {/* keep onNavigate referenced for future deep links */}
      <span className="hidden">{typeof onNavigate}</span>
      <span className="hidden"><MapPin className="h-3 w-3" /></span>
    </div>
  );
}
