"use client";

import { useState } from "react";
import { Stethoscope, MapPin, Clock, Phone, Siren, BadgeCheck, Droplets, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clinics, type Screen } from "@/data/seed";
import { usePetCare } from "@/lib/store";
import { Stars } from "./cards";
import { DonorRegDialog } from "./dialogs";
import { cn } from "@/lib/utils";

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

export function VetsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [lowCostOnly, setLowCostOnly] = useState(false);
  const [regOpen, setRegOpen] = useState(false);

  const filtered = clinics
    .filter((c) => (emergencyOnly ? c.emergency : true))
    .filter((c) => (lowCostOnly ? c.lowCost : true));

  const avgRating = (clinicId: number) => {
    const rs = clinics.find((c) => c.id === clinicId)!.reviews;
    return rs.length ? rs.reduce((s, r) => s + r.rating, 0) / rs.length : 0;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Vet directory</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Verified clinics around Dhaka with ratings, hours and emergency tags. Low-cost clinics
        offer subsidized spay/neuter for community animals.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <FilterChip active={emergencyOnly} onClick={() => setEmergencyOnly(!emergencyOnly)}>
          24h emergency
        </FilterChip>
        <FilterChip active={lowCostOnly} onClick={() => setLowCostOnly(!lowCostOnly)}>
          Low-cost care
        </FilterChip>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {filtered.map((c) => {
          const rating = avgRating(c.id);
          return (
            <Card key={c.id} className="shadow-soft hover:shadow-lift transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                        <Stethoscope className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-bold leading-tight">{c.name}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <Stars rating={Math.round(rating)} />
                          <span className="text-xs text-muted-foreground">
                            {rating.toFixed(1)} · {c.reviews.length} reviews
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {c.emergency && (
                      <Badge variant="outline" className="border-danger-200 bg-danger-50 text-danger-700">
                        <Siren className="mr-1 h-3 w-3" /> Emergency
                      </Badge>
                    )}
                    {c.lowCost && (
                      <Badge variant="outline" className="border-leaf-200 bg-leaf-50 text-leaf-800">
                        Low-cost
                      </Badge>
                    )}
                    {c.verified && (
                      <Badge variant="outline" className="border-ink-200 text-ink-600">
                        <BadgeCheck className="mr-1 h-3 w-3" /> Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {c.address}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {c.hours}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {c.phone}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-4 space-y-2 border-t pt-3">
                  {c.reviews.map((r, i) => (
                    <div key={i} className="text-sm">
                      <p className="flex items-center gap-2 font-medium">
                        <Star className="h-3 w-3 fill-leaf-400 text-leaf-400" />
                        {r.by}
                      </p>
                      <p className="text-muted-foreground">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Blood bank cross-link */}
      <Card className="mt-8 border-danger-200 bg-danger-50/50 shadow-soft">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger-100 text-danger-700">
              <Droplets className="h-6 w-6" />
            </span>
            <div>
              <p className="font-bold">Vet in urgent need of blood?</p>
              <p className="text-sm text-muted-foreground">
                Check the pet blood bank for eligible donors near the clinic.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <Button variant="outline" className="flex-1 rounded-xl sm:flex-none" onClick={() => onNavigate("blood")}>
              Open blood bank
            </Button>
            <Button className="flex-1 rounded-xl sm:flex-none" onClick={() => setRegOpen(true)}>
              Register my donor pet
            </Button>
          </div>
        </CardContent>
      </Card>

      <DonorRegDialog open={regOpen} onClose={() => setRegOpen(false)} />
    </div>
  );
}
