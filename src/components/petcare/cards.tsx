"use client";

import Image from "next/image";
import { PawPrint, MapPin, Heart, Users, AlertTriangle, ArrowRight, Dog, Cat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type Pet,
  asset,
  type PetStatus,
  type Campaign,
  bdt,
  daysWaiting,
  ageLabel,
  shelterName,
  fmtDate,
} from "@/data/seed";
import { seedDonations } from "@/data/seed";
import type { MyDonation } from "@/lib/store";

/* ------------------------------------------------------------------ */
/* Status badge                                                        */
/* ------------------------------------------------------------------ */

const STATUS_META: Record<PetStatus, { label: string; cls: string }> = {
  available: { label: "Available", cls: "bg-leaf-100 text-leaf-800 border-leaf-200" },
  pending: { label: "Pending", cls: "bg-brand2-100 text-brand2-800 border-brand2-200" },
  adopted: { label: "Adopted", cls: "bg-ink-900 text-white border-ink-900" },
  medical_hold: { label: "Medical hold", cls: "bg-brand-100 text-brand-800 border-brand-200" },
  fostered: { label: "Fostered", cls: "bg-ink-100 text-ink-700 border-ink-200" },
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
/* Real pet photo (served from /public/images, basePath-aware)         */
/* ------------------------------------------------------------------ */

export function PetPhoto({
  pet,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
}: {
  pet: Pick<Pet, "name" | "photo">;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-ink-100", className)} role="img" aria-label={`Photo of ${pet.name}`}>
      <Image src={asset(pet.photo)} alt={`Photo of ${pet.name}`} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Species identity                                                    */
/* ------------------------------------------------------------------ */

export function SpeciesChip({ species }: { species: "dog" | "cat" }) {
  return species === "dog" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#26332c]/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-dog-yellow backdrop-blur-sm">
      <Dog className="h-3 w-3" /> Dog
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#26332c]/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#dcc8f2] backdrop-blur-sm">
      <Cat className="h-3 w-3" /> Cat
    </span>
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
  const trait = pet.tags.slice(0, 3).join(" · ");
  return (
    <Card className="group relative overflow-hidden pt-0 gap-0 shadow-soft">
      <button onClick={onOpen} className="text-left w-full cursor-pointer" aria-label={`Open ${pet.name}'s profile`}>
        <div className="relative">
          <PetPhoto pet={pet} className="h-48 w-full" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <SpeciesChip species={pet.species} />
            <StatusBadge status={pet.status} />
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-lg leading-tight">{pet.name}</h3>
            <span className="text-xs font-medium text-muted-foreground">
              {pet.gender === "male" ? "♂" : "♀"} {pet.gender} · {ageLabel(pet.ageMonths)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {shelterName(pet.shelterId)} · waiting {daysWaiting(pet)} days
          </p>
          <p className="mt-2 line-clamp-2 text-sm italic leading-relaxed text-ink-600">
            “{trait.charAt(0).toUpperCase() + trait.slice(1)}”
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {pet.goodWith.kids && <MiniChip icon={Users} label="Kids ok" />}
            <MiniChip icon={PawPrint} label={pet.species === "dog" ? "Dogs ok" : "Cats ok"} />
            {pet.vaccinated && <MiniChip icon={AlertTriangle} label="Vaccinated" />}
          </div>
          <span className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-500 py-2 text-sm font-semibold text-[#fff9f2] transition-colors group-hover:bg-brand-600">
            Meet {pet.name} <ArrowRight className="h-4 w-4" />
          </span>
        </CardContent>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavorite();
        }}
        className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-sm cursor-pointer hover:bg-white"
        aria-label={isFavorite ? `Remove ${pet.name} from favorites` : `Add ${pet.name} to favorites`}
      >
        <Heart
          className={cn("h-4 w-4 transition-colors", isFavorite ? "fill-danger-500 text-danger-500" : "text-ink-400")}
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
    <Card className="shadow-soft hover:shadow-lift transition-shadow flex flex-col overflow-hidden pt-0 gap-0">
      <div className="relative h-32 w-full bg-ink-100">
        <Image
          src={asset(campaign.photo)}
          alt={`Photo for ${campaign.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <CardContent className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold leading-snug">{campaign.title}</h3>
          {done ? (
            <Badge className="bg-leaf-100 text-leaf-800 border-leaf-200" variant="outline">
              Goal reached
            </Badge>
          ) : (
            <Badge variant="outline" className="border-brand-200 bg-brand-50 text-brand-800">
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
              of {bdt(campaign.goal)} ·{" "}
              {pct >= 85 ? (
                <span className="font-bold text-leaf-600">{pct}% funded</span>
              ) : (
                `${pct}%`
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{donorCount} donors</span>
            <span>
              {campaign.status === "completed" ? "Completed" : `Ends ${fmtDate(campaign.endsAt)}`}
            </span>
          </div>
          <button
            onClick={onDonate}
            disabled={done}
            className={cn(
              "w-full rounded-xl py-2 text-sm font-semibold transition-colors cursor-pointer",
              done
                ? "bg-secondary text-secondary-foreground cursor-default"
                : "bg-brand-500 text-white hover:bg-brand-600"
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
          className={cn("h-3.5 w-3.5", i <= rating ? "fill-leaf-400 text-leaf-400" : "text-ink-300")}
        />
      ))}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: "critical" | "urgent" | "scheduled" }) {
  const map = {
    critical: "bg-danger-100 text-danger-800 border-danger-200",
    urgent: "bg-brand2-100 text-brand2-800 border-brand2-200",
    scheduled: "bg-ink-100 text-ink-700 border-ink-200",
  } as const;
  return (
    <Badge variant="outline" className={cn("gap-1", map[urgency])}>
      {urgency === "critical" && <AlertTriangle className="h-3 w-3" />}
      {urgency}
    </Badge>
  );
}
