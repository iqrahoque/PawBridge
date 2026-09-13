"use client";

import { useState } from "react";
import Image from "next/image";
import { SearchCheck, MapPin, Plus, PartyPopper, Cat, Dog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  asset,
  seedLostReports,
  seedFoundReports,
  seedMatches,
  fmtDate,
} from "@/data/seed";
import { usePetCare, type MyFoundReport, type MyLostReport } from "@/lib/store";
import { ReportDialog } from "./dialogs";
import { cn } from "@/lib/utils";

function ReportPhoto({ species, photo, size = "h-12 w-12" }: { species: "dog" | "cat"; photo?: string; size?: string }) {
  if (photo) {
    return (
      <span className={cn("relative shrink-0 overflow-hidden rounded-full bg-ink-100", size)}>
        <Image src={asset(photo)} alt="Reported pet" fill sizes="48px" className="object-cover" />
      </span>
    );
  }
  const Icon = species === "dog" ? Dog : Cat;
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500", size)}>
      <Icon className="h-5 w-5" />
    </span>
  );
}

export function LostFoundScreen() {
  const myLost = usePetCare((s) => s.lostReports);
  const myFound = usePetCare((s) => s.foundReports);
  const matchDecisions = usePetCare((s) => s.matchDecisions);
  const decideMatch = usePetCare((s) => s.decideMatch);
  const [reportKind, setReportKind] = useState<"lost" | "found" | null>(null);

  const lost = [...myLost.map((r: MyLostReport) => ({ ...r, status: "searching" as const, by: r.by })),
    ...seedLostReports.map((r) =>
      matchDecisions[`${r.id}-1`] === "confirmed" ? { ...r, status: "reunited" as const } : r
    )];
  const found = [...myFound.map((r: MyFoundReport) => ({ ...r, status: "with_finder" as const, by: r.by })),
    ...seedFoundReports.map((r) =>
      matchDecisions[`1-${r.id}`] === "confirmed" ? { ...r, status: "reunited" as const } : r
    )];

  const suggested = seedMatches.filter((m) => {
    const d = matchDecisions[`${m.lostId}-${m.foundId}`];
    return !d || d === "confirmed";
  });
  const confirmedMatch = seedMatches.find(
    (m) => matchDecisions[`${m.lostId}-${m.foundId}`] === "confirmed"
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <SearchCheck className="h-7 w-7 text-brand2-600" /> Lost &amp; Found
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            File a report; the matching engine compares species, color and area against the other
            board and suggests matches. Confirming a match marks both pets reunited.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => setReportKind("lost")}>
            <Plus className="h-4 w-4" /> I lost a pet
          </Button>
          <Button className="rounded-xl" onClick={() => setReportKind("found")}>
            <Plus className="h-4 w-4" /> I found a pet
          </Button>
        </div>
      </div>

      {/* Match suggestions */}
      {suggested.length > 0 && !confirmedMatch && (
        <Card className="mt-6 border-brand2-300 bg-brand2-50/70 shadow-soft">
          <CardContent className="p-5">
            <p className="flex items-center gap-2 font-bold">
              <SearchCheck className="h-5 w-5 text-brand2-600" /> Possible match found — {suggested[0].score}%
              confidence
            </p>
            <p className="mt-1 text-sm text-ink-700">
              Lost report <strong>Simba</strong> (orange tabby, Dhanmondi Lake) looks a lot like the
              found orange tabby from <strong>Dhanmondi 27, near lake gate</strong>. Same color,
              same area, 2 days apart. Is this Simba?
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                className="rounded-xl"
                onClick={() => {
                  decideMatch(suggested[0].lostId, suggested[0].foundId, "confirmed");
                }}
              >
                <PartyPopper className="h-4 w-4" /> Yes — it&apos;s a match!
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => decideMatch(suggested[0].lostId, suggested[0].foundId, "dismissed")}
              >
                Not the same pet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {confirmedMatch && (
        <Card className="mt-6 border-leaf-300 bg-leaf-50/70 shadow-soft">
          <CardContent className="flex items-center gap-3 p-5">
            <PartyPopper className="h-8 w-8 text-leaf-700" />
            <div>
              <p className="font-bold text-leaf-900">Reunited! Simba is going home.</p>
              <p className="text-sm text-leaf-800">
                Both reports are marked <strong>reunited</strong> and Jenny (the finder) has been
                notified to arrange the handover. +150 karma for confirming.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Boards */}
      <Tabs defaultValue="lost" className="mt-8">
        <TabsList className="rounded-full bg-ink-100">
          <TabsTrigger value="lost" className="rounded-full">
            Lost ({lost.filter((r) => r.status === "searching").length})
          </TabsTrigger>
          <TabsTrigger value="found" className="rounded-full">
            Found ({found.filter((r) => r.status !== "reunited").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lost" className="mt-4 grid gap-4 sm:grid-cols-2">
          {lost.map((r) => (
            <Card key={`l-${r.id}`} className={cn("shadow-soft", r.status === "reunited" && "opacity-70")}>
              <CardContent className="flex gap-4 p-4">
                <ReportPhoto species={r.species} photo={"photo" in r ? r.photo : undefined} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold">{r.petName}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        r.status === "searching"
                          ? "border-brand2-200 bg-brand2-50 text-brand2-800"
                          : "border-leaf-200 bg-leaf-50 text-leaf-800"
                      )}
                    >
                      {r.status === "searching" ? "Searching" : "Reunited"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {r.species} · {r.color}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm">{r.description}</p>
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {r.area} · lost {fmtDate(r.lostOn)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="found" className="mt-4 grid gap-4 sm:grid-cols-2">
          {found.map((r) => (
            <Card key={`f-${r.id}`} className={cn("shadow-soft", r.status === "reunited" && "opacity-70")}>
              <CardContent className="flex gap-4 p-4">
                <ReportPhoto species={r.species} photo={"photo" in r ? r.photo : undefined} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold capitalize">
                      {r.species} — {r.color}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        r.status === "with_finder"
                          ? "border-leaf-200 bg-leaf-50 text-leaf-800"
                          : "border-leaf-300 bg-leaf-200 text-leaf-900"
                      )}
                    >
                      {r.status === "with_finder" ? "With finder" : "Reunited"}
                    </Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm">{r.description}</p>
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {r.area} · found {fmtDate(r.foundOn)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <ReportDialog kind={reportKind ?? "lost"} open={reportKind !== null} onClose={() => setReportKind(null)} />
    </div>
  );
}
