"use client";

import { PawPrint, Dog, Cat, MapPin, Heart, Users, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type Pet,
  type PetStatus,
  type Campaign,
  bdt,
  daysWaiting,
  ageLabel,
  shelterName,
} from "@/data/seed";
import { seedDonations } from "@/data/seed";
import type { MyDonation } from "@/lib/store";

/* ------------------------------------------------------------------ */
/* Status badge                                                        */
/* ------------------------------------------------------------------ */

const STATUS_META: Record<PetStatus, { label: string; cls: string }> = {
  available: { label: "Available", cls: "bg-green-100 text-green-800 border-green-200" },
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-800 border-amber-200" },
  adopted: { label: "Adopted", cls: "bg-stone-200 text-stone-700 border-stone-300" },
  medical_hold: { label: "Medical hold", cls: "bg-sky-100 text-sky-800 border-sky-200" },
  fostered: { label: "Fostered", cls: "bg-violet-100 text-violet-800 border-violet-200" },
};

export function StatusBadge({ status }: { status: PetStatus }) {
  const m = STATUS_META[status];
  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", m.cls)}>
      {m.label}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/* Placeholder pet art (offline-safe, deterministic per pet)           */
/* ------------------------------------------------------------------ */

export function PetArt({
  pet,
  className,
  big = false,
}: {
  pet: Pick<Pet, "name" | "species" | "hue">;
  className?: string;
  big?: boolean;
}) {
  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, hsl(${pet.hue} 72% 88%), hsl(${(pet.hue + 40) % 360} 65% 78%))`,
      }}
      aria-label={`Photo placeholder of ${pet.name}`}
      role="img"
    >
      <div
        className="absolute rounded-full bg-white/30"
        style={{ width: "45%", paddingBottom: "45%", left: "-8%", top: "-12%" }}
      />
      <div
        className="absolute rounded-full bg-white/20"
        style={{ width: "35%", paddingBottom: "35%", right: "-6%", bottom: "-10%" }}
      />
      {pet.species === "dog" ? (
        <Dog className={cn("text-white/70", big ? "h-28 w-28" : "h-14 w-14")} strokeWidth={1.5} />
      ) : (
        <Cat className={cn("text-white/70", big ? "h-28 w-28" : "h-14 w-14")} strokeWidth={1.5} />
      )}
      <span
        className={cn(
          "absolute bottom-2 right-3 font-bold text-white/80 tracking-tight",
          big ? "text-3xl" : "text-lg"
        )}
      >
        {pet.name}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pet card                                                            */
/* ------------------------------------------------------------------ */

export function PetCard({
  pet,
  isFavorite,
  onOpen,
  onFavorite,
}: {
  pet: Pet;
  isFavorite: boolean;
  onOpen: () => void;
  onFavorite: () => void;
}) {
  return (
    <Card className="group overflow-hidden pt-0 gap-0 shadow-soft hover:shadow-lift transition-all duration-300 hover:-translate-y-0.5">
      <button onClick={onOpen} className="text-left w-full cursor-pointer" aria-label={`Open ${pet.name}'s profile`}>
        <div className="relative">
          <PetArt pet={pet} className="h-44 w-full" />
          <div className="absolute top-3 left-3">
            <StatusBadge status={pet.status} />
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-lg leading-tight">{pet.name}</h3>
            <span className="text-xs text-muted-foreground">
              {ageLabel(pet.ageMonths)} · {pet.gender}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {pet.breed} · {pet.size} · {pet.energy} energy
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {pet.goodWith.kids && <MiniChip icon={Users} label="Kids" />}
            <MiniChip icon={PawPrint} label={pet.species === "dog" ? "Dogs ok" : "Cats ok"} />
            <MiniChip label={`${daysWaiting(pet)}d waiting`} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {shelterName(pet.shelterId)}
          </p>
        </CardContent>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavorite();
        }}
        className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-sm hover:scale-110 transition-transform cursor-pointer"
        aria-label={isFavorite ? `Remove ${pet.name} from favorites` : `Add ${pet.name} to favorites`}
      >
        <Heart
          className={cn("h-4 w-4", isFavorite ? "fill-orange-600 text-orange-600" : "text-stone-500")}
        />
      </button>
    </Card>
  );
}

function MiniChip({ icon: Icon, label }: { icon?: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Campaign card                                                       */
/* ------------------------------------------------------------------ */

export function CampaignCard({
  campaign,
  extraDonations,
  onDonate,
}: {
  campaign: Campaign;
  extraDonations: MyDonation[];
  onDonate: () => void;
}) {
  const seedRaised = seedDonations
    .filter((d) => d.campaignId === campaign.id)
    .reduce((s, d) => s + d.amount, 0);
  const myRaised = extraDonations
    .filter((d) => d.campaignId === campaign.id)
    .reduce((s, d) => s + d.amount, 0);
  const raised = seedRaised + myRaised;
  const pct = Math.min(100, Math.round((raised / campaign.goal) * 100));
  const donorCount =
    seedDonations.filter((d) => d.campaignId === campaign.id).length +
    extraDonations.filter((d) => d.campaignId === campaign.id).length;
  const done = raised >= campaign.goal;

  return (
    <Card className="shadow-soft hover:shadow-lift transition-shadow flex flex-col">
      <CardContent className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold leading-snug">{campaign.title}</h3>
          {done ? (
            <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
              Goal reached
            </Badge>
          ) : (
            <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-800">
              Active
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
        <div className="mt-auto space-y-2">
          <Progress value={pct} className="h-2.5" />
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{bdt(raised)}</span>
            <span className="text-muted-foreground">
              of {bdt(campaign.goal)} · {pct}%
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{donorCount} donors</span>
            <span>
              {campaign.status === "completed" ? "Completed" : `Ends ${campaign.endsAt.slice(0, 10)}`}
            </span>
          </div>
          <button
            onClick={onDonate}
            disabled={done}
            className={cn(
              "w-full rounded-xl py-2 text-sm font-semibold transition-colors cursor-pointer",
              done
                ? "bg-secondary text-secondary-foreground cursor-default"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {done ? "Fully funded" : "Donate now"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Clinic card                                                         */
/* ------------------------------------------------------------------ */

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn("h-3.5 w-3.5", i <= rating ? "fill-amber-400 text-amber-400" : "text-stone-300")}
        />
      ))}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: "critical" | "urgent" | "scheduled" }) {
  const map = {
    critical: "bg-red-100 text-red-800 border-red-200",
    urgent: "bg-amber-100 text-amber-800 border-amber-200",
    scheduled: "bg-stone-100 text-stone-700 border-stone-200",
  } as const;
  return (
    <Badge variant="outline" className={cn("gap-1", map[urgency])}>
      {urgency === "critical" && <AlertTriangle className="h-3 w-3" />}
      {urgency}
    </Badge>
  );
}
