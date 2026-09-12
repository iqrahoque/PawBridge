"use client";

import { useState } from "react";
import { Droplets, Siren, CheckCircle2, Clock, Phone, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  bloodDonors as seedDonors,
  bloodRequests,
  donorEligibility,
  clinics,
  fmtDate,
  type Screen,
} from "@/data/seed";
import { usePetCare } from "@/lib/store";
import { UrgencyBadge } from "./cards";
import { DonorRegDialog } from "./dialogs";
import { cn } from "@/lib/utils";
import type { MyDonor } from "@/lib/store";

export function BloodScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const myDonors = usePetCare((s) => s.donors);
  const [regOpen, setRegOpen] = useState(false);
  const [notified, setNotified] = useState<string[]>([]);

  const allDonors = [
    ...myDonors,
    ...seedDonors.map((d) => ({
      id: d.id,
      ownerName: d.ownerName,
      petName: d.petName,
      species: d.species,
      bloodType: d.bloodType,
      weightKg: d.weightKg,
      lastDonation: d.lastDonation,
      active: d.active,
    })),
  ];

  const openRequests = bloodRequests.filter((r) => r.status === "open");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight">
        <Droplets className="h-7 w-7 text-emred-600" /> Pet blood bank
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        The only registry of its kind for Dhaka: clinics post urgent transfusion requests, and we
        match them to eligible donor pets by species, blood type and donation-history window.
        (Dogs: 8-week gap · Cats: 4-week gap.)
      </p>

      {/* Open requests */}
      <section className="mt-8">
        <h2 className="text-xl font-extrabold tracking-tight">Urgent requests</h2>
        {openRequests.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-sage-600" />
              No open requests right now — the map is quiet.
            </CardContent>
          </Card>
        ) : (
          openRequests.map((r) => {
            const clinic = clinics.find((c) => c.id === r.clinicId)!;
            const matches = allDonors
              .filter((d) => d.active && d.species === r.species && d.bloodType === r.bloodType)
              .map((d) => ({ ...d, eligible: donorEligibility(d as never) }))
              .sort((a, b) => (a.eligible === b.eligible ? 0 : a.eligible === "eligible" ? -1 : 1));

            return (
              <Card key={r.id} className="mt-4 border-emred-200 shadow-soft">
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <UrgencyBadge urgency={r.urgency} />
                      <Badge variant="outline" className="font-mono">
                        {r.species} · {r.bloodType}
                      </Badge>
                      <Badge variant="outline">{r.units} unit{r.units > 1 ? "s" : ""}</Badge>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-emred-700">
                      <Siren className="h-3.5 w-3.5" /> Needed by {fmtDate(r.deadline)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-sagegray-700">{r.note}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Posted by {clinic.name} · {clinic.area} · <Phone className="inline h-3 w-3" /> {clinic.phone}
                  </p>

                  <div className="mt-4 rounded-xl border bg-white p-4">
                    <p className="text-sm font-bold">Matched donors ({matches.length})</p>
                    <div className="mt-3 space-y-2">
                      {matches.map((d) => (
                        <div
                          key={d.id}
                          className={cn(
                            "flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3",
                            d.eligible === "eligible" ? "border-sage-200 bg-sage-50/50" : "bg-sagegray-50"
                          )}
                        >
                          <div className="text-sm">
                            <span className="font-bold">{d.petName}</span>
                            <span className="text-muted-foreground">
                              {" "}· {d.species} · {d.bloodType} · {d.weightKg}kg
                            </span>
                            {d.lastDonation && (
                              <span className="block text-xs text-muted-foreground">
                                Last donated {fmtDate(d.lastDonation)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {d.eligible === "eligible" ? (
                              <Badge className="bg-sage-100 text-sage-800 border-sage-200" variant="outline">
                                <CheckCircle2 className="mr-1 h-3 w-3" /> Eligible now
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-sagegray-200 text-sagegray-500">
                                <Clock className="mr-1 h-3 w-3" /> Recently donated
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant={d.eligible === "eligible" ? "default" : "outline"}
                              className="rounded-lg"
                              disabled={notified.includes(`${r.id}-${d.id}`) || d.eligible !== "eligible"}
                              onClick={() => {
                                setNotified((n) => [...n, `${r.id}-${d.id}`]);
                                usePetCare.getState().earnKarma(
                                  `Responded to blood request with ${d.petName}`,
                                  120
                                );
                              }}
                            >
                              {notified.includes(`${r.id}-${d.id}`) ? "Contacted clinic" : "I can come in"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Info className="mt-0.5 h-3 w-3 shrink-0" />
                      This is the Q8 showcase query running live: JOIN donors on species + blood type
                      + active, filtered by the 56/28-day eligibility window.
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </section>

      {/* Registry */}
      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Donor registry</h2>
            <p className="text-sm text-muted-foreground">
              {allDonors.filter((d) => d.active).length} active donor pets standing by.
            </p>
          </div>
          <Button className="rounded-xl" onClick={() => setRegOpen(true)}>
            <Droplets className="h-4 w-4" /> Register my pet
          </Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allDonors
            .filter((d) => d.active)
            .map((d) => (
              <Card key={d.id} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{d.petName}</p>
                    <Badge variant="outline" className="border-emred-200 bg-emred-50 font-mono text-emred-700">
                      {d.bloodType}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {d.species} · {d.weightKg}kg · owner {d.ownerName}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {d.lastDonation ? `Last donated ${fmtDate(d.lastDonation)}` : "Never donated — ready when needed"}
                  </p>
                  {(() => {
                    const el = donorEligibility(d as never);
                    return (
                      <Badge
                        variant="outline"
                        className={cn(
                          "mt-2",
                          el === "eligible"
                            ? "border-sage-200 bg-sage-50 text-sage-800"
                            : "border-sagegray-200 text-sagegray-500"
                        )}
                      >
                        {el === "eligible" ? "Eligible now" : "Resting — not yet 8 weeks"}
                      </Badge>
                    );
                  })()}
                </CardContent>
              </Card>
            ))}
        </div>
      </section>

      {/* Safe haven teaser (U7) */}
      <section className="mt-10 mb-4">
        <Card className="border-sage-200 bg-sage-50/50 shadow-soft">
          <CardContent className="p-5">
            <p className="font-bold">Emergency Safe Haven Network</p>
            <p className="mt-1 text-sm text-muted-foreground">
              When a person flees domestic violence or is hospitalized, their pet often has nowhere
              to go — so they don&apos;t leave. Our crisis foster network gives that pet a safe,
              anonymous temporary home. Requests carry only an anonymous code, never an identity.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { code: "SH-2026-0042", pet: "Jhumka (cat)", status: "In crisis foster care · reunited with owner Oct 8" },
                { code: "SH-2026-0044", pet: "Laddu (dog)", status: "Awaiting crisis foster match" },
              ].map((s) => (
                <div key={s.code} className="rounded-xl border bg-white px-3 py-2 text-xs">
                  <span className="font-mono font-semibold text-sage-700">{s.code}</span> · {s.pet} —{" "}
                  <span className="text-muted-foreground">{s.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Button variant="ghost" className="mt-3 text-primary" onClick={() => onNavigate("dashboard")}>
          Manage these cases in the admin dashboard →
        </Button>
      </section>

      <DonorRegDialog open={regOpen} onClose={() => setRegOpen(false)} />
    </div>
  );
}
