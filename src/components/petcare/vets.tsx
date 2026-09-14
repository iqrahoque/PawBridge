"use client";

import { useState } from "react";
import {
  Stethoscope,
  MapPin,
  Clock,
  Phone,
  Siren,
  BadgeCheck,
  Droplets,
  Star,
  Syringe,
  Bone,
  ShieldPlus,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clinics, TODAY, type Clinic, type Screen } from "@/data/seed";
import { usePetCare } from "@/lib/store";
import { Stars } from "./cards";
import { DonorRegDialog } from "./dialogs";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* "What does your pet need?" need-first flow (audit #14)              */
/* ------------------------------------------------------------------ */

const NEEDS: {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  match: (c: Clinic) => boolean;
}[] = [
  { key: "checkup", label: "General checkup", icon: Stethoscope, match: (c) => c.services.some((s) => /checkup/i.test(s)) },
  { key: "vaccination", label: "Vaccination", icon: Syringe, match: (c) => c.services.includes("vaccination") },
  { key: "emergency", label: "Emergency", icon: Siren, match: (c) => c.emergency },
  { key: "surgery", label: "Surgery", icon: Bone, match: (c) => c.services.some((s) => /surgery|neuter/i.test(s)) },
  { key: "deworming", label: "Deworming", icon: ShieldPlus, match: (c) => c.services.some((s) => /deworm/i.test(s)) },
  { key: "skin", label: "Skin problems", icon: Sparkles, match: (c) => c.services.some((s) => /skin/i.test(s)) },
  { key: "blood", label: "Blood transfusion", icon: Droplets, match: (c) => c.services.some((s) => /blood/i.test(s)) },
];

/**
 * Open/closed from the clinic's hours string, evaluated against the demo
 * clock (seed TODAY = Saturday 12:00). Handles "Sat–Thu 9:00–21:00 ·
 * Fri 15:00–20:00", "Daily 8:00–22:00 · 24h emergency" style strings.
 */
function openState(hours: string): { open: boolean; detail: string } {
  const day = TODAY.getDay(); // 6 = Saturday
  const hour = TODAY.getHours() + TODAY.getMinutes() / 60; // 12.0
  for (const clause of hours.split("·")) {
    const c = clause.trim();
    const time = c.match(/(\d{1,2})(:\d{2})?\s*[–-]\s*(\d{1,2})(:\d{2})?/);
    if (!time) continue;
    const openH = parseInt(time[1], 10);
    const closeH = parseInt(time[3], 10);
    let dayOk = false;
    if (/daily/i.test(c)) dayOk = true;
    else if (/sat[–-]thu/i.test(c)) dayOk = day >= 6 || day <= 4;
    else if (/fri/i.test(c)) dayOk = day === 5;
    else dayOk = true;
    if (dayOk) {
      const open = hour >= openH && hour < closeH;
      return { open, detail: open ? `Open until ${closeH}:00` : `Opens ${openH}:00` };
    }
  }
  return { open: false, detail: "" };
}

export function VetsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [need, setNeed] = useState<string | null>(null);
  const [lowCostOnly, setLowCostOnly] = useState(false);
  const [regOpen, setRegOpen] = useState(false);

  const activeNeed = NEEDS.find((n) => n.key === need);
  const filtered = clinics
    .filter((c) => (activeNeed ? activeNeed.match(c) : true))
    .filter((c) => (lowCostOnly ? c.lowCost : true));

  const avgRating = (clinicId: number) => {
    const rs = clinics.find((c) => c.id === clinicId)!.reviews;
    return rs.length ? rs.reduce((s, r) => s + r.rating, 0) / rs.length : 0;
  };

  return (
    <div>
      {/* Header band */}
      <section className="bg-tint-lavender border-b border-leaf-100">
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-6">
          <h1 className="text-3xl font-bold tracking-tight">Vet directory</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Verified clinics around Dhaka with ratings, hours and emergency tags. Low-cost clinics
            offer subsidized spay/neuter for community animals.
          </p>
          <p className="mt-5 text-sm font-bold text-ink-800">What does your pet need?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {NEEDS.map((n) => (
              <button
                key={n.key}
                onClick={() => setNeed(need === n.key ? null : n.key)}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  need === n.key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-ink-200 bg-white text-ink-700 hover:border-ink-400"
                )}
                aria-pressed={need === n.key}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </button>
            ))}
            <button
              onClick={() => setLowCostOnly(!lowCostOnly)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                lowCostOnly
                  ? "border-leaf-500 bg-leaf-500 text-white"
                  : "border-ink-200 bg-white text-ink-700 hover:border-ink-400"
              )}
              aria-pressed={lowCostOnly}
            >
              Low-cost care
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {filtered.length} clinic{filtered.length === 1 ? "" : "s"}
            {activeNeed ? ` offering ${activeNeed.label.toLowerCase()}` : " shown"}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {filtered.map((c) => {
          const rating = avgRating(c.id);
          const open = openState(c.hours);
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
                    {/* Open now (audit #15) */}
                    <Badge
                      variant="outline"
                      className={cn(
                        open.open
                          ? "border-leaf-200 bg-leaf-50 text-leaf-800"
                          : "border-ink-200 bg-ink-50 text-ink-500"
                      )}
                    >
                      <span
                        className={cn(
                          "mr-1 h-2 w-2 rounded-full",
                          open.open ? "bg-leaf-500" : "bg-ink-300"
                        )}
                      />
                      {open.open ? "Open now" : open.detail || "Closed"}
                    </Badge>
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
                      <Badge variant="outline" className="border-brand-200 bg-brand-50 text-brand-700">
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
    </div>
  );
}
