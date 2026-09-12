"use client";

import { useState } from "react";
import { SearchCheck, MapPin, Plus, PartyPopper, Cat, Dog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  seedLostReports,
  seedFoundReports,
  seedMatches,
  fmtDate,
} from "@/data/seed";
import { usePetCare, type MyFoundReport, type MyLostReport } from "@/lib/store";
import { ReportDialog } from "./dialogs";
import { cn } from "@/lib/utils";

function ArtBadge({ species, hue, size = "h-12 w-12" }: { species: "dog" | "cat"; hue: number; size?: string }) {
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-xl", size)}
      style={{ background: `hsl(${hue} 70% 88%)` }}
    >
      {species === "dog" ? <Dog className="h-5 w-5 text-white/80" /> : <Cat className="h-5 w-5 text-white/80" />}
    </div>
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
          <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight">
            <SearchCheck className="h-7 w-7 text-teal-700" /> Lost &amp; Found
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
        <Card className="mt-6 border-amber-300 bg-amber-50/70 shadow-soft">
          <CardContent className="p-5">
            <p className="flex items-center gap-2 font-bold">
              <SearchCheck className="h-5 w-5 text-amber-600" /> Possible match found — {suggested[0].score}%
              confidence
            </p>
            <p className="mt-1 text-sm text-stone-700">
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
        <Card className="mt-6 border-green-300 bg-green-50/70 shadow-soft">
          <CardContent className="flex items-center gap-3 p-5">
            <PartyPopper className="h-8 w-8 text-green-700" />
            <div>
              <p className="font-bold text-green-900">Reunited! Simba is going home.</p>
              <p className="text-sm text-green-800">
                Both reports are marked <strong>reunited</strong> and Jenny (the finder) has been
                notified to arrange the handover. +150 karma for confirming.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Boards */}
      <Tabs defaultValue="lost" className="mt-8">
        <TabsList className="rounded-xl bg-secondary">
          <TabsTrigger value="lost" className="rounded-lg">
            Lost ({lost.filter((r) => r.status === "searching").length})
          </TabsTrigger>
          <TabsTrigger value="found" className="rounded-lg">
            Found ({found.filter((r) => r.status !== "reunited").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lost" className="mt-4 grid gap-4 sm:grid-cols-2">
          {lost.map((r) => (
            <Card key={`l-${r.id}`} className={cn("shadow-soft", r.status === "reunited" && "opacity-70")}>
              <CardContent className="flex gap-4 p-4">
                <ArtBadge species={r.species} hue={r.hue} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold">{r.petName}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        r.status === "searching"
                          ? "border-amber-200 bg-amber-50 text-amber-800"
                          : "border-green-200 bg-green-50 text-green-800"
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
                <ArtBadge species={r.species} hue={r.hue} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold capitalize">
                      {r.species} — {r.color}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        r.status === "with_finder"
                          ? "border-teal-200 bg-teal-50 text-teal-800"
                          : "border-green-200 bg-green-50 text-green-800"
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
