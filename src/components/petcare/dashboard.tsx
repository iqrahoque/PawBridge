"use client";

import { useMemo } from "react";
import {
  LayoutDashboard,
  PawPrint,
  ClipboardList,
  HandCoins,
  BellRing,
  Heart,
  CheckCircle2,
  XCircle,
  Eye,
  TrendingUp,
  Building2,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  pets as seedPets,
  seedApplications,
  seedDonations,
  shelters,
  bdt,
  fmtDate,
  ageLabel,
  shelterName,
  personaReminders,
  personaSeedKarma,
  safeHavenRequests,
} from "@/data/seed";
import { usePetCare } from "@/lib/store";
import { StatusBadge, PetArt } from "./cards";
import { cn } from "@/lib/utils";

export function DashboardScreen() {
  const myApplications = usePetCare((s) => s.applications);
  const myDonations = usePetCare((s) => s.donations);
  const favorites = usePetCare((s) => s.favorites);
  const overrides = usePetCare((s) => s.petStatusOverrides);
  const decideApplication = usePetCare((s) => s.decideApplication);
  const resetDemo = usePetCare((s) => s.resetDemo);

  const pets = useMemo(
    () => seedPets.map((p) => ({ ...p, status: overrides[p.id] ?? p.status })),
    [overrides]
  );

  /* Shelter metrics (Q10-style) */
  const residents = pets.filter((p) => p.status !== "adopted").length;
  const capacity = shelters.reduce((s, sh) => s + sh.capacity, 0);
  const utilization = Math.round((residents / capacity) * 100);
  const pendingInbox = [...myApplications.map((a) => ({ ...a, petId: a.petId, applicant: a.applicant, date: a.date })),
    ...seedApplications].filter((a) => a.status === "submitted" || a.status === "under_review");
  const raisedTotal =
    seedDonations.reduce((s, d) => s + d.amount, 0) + myDonations.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight">
          <LayoutDashboard className="h-7 w-7 text-primary" /> Dashboard
        </h1>
        <Button variant="outline" size="sm" className="rounded-lg text-stone-600" onClick={resetDemo}>
          Reset demo data
        </Button>
      </div>

      <Tabs defaultValue="adopter" className="mt-6">
        <TabsList className="rounded-xl bg-secondary">
          <TabsTrigger value="adopter" className="rounded-lg">
            Adopter — Sara
          </TabsTrigger>
          <TabsTrigger value="shelter" className="rounded-lg">
            Shelter — Pawfect Haven
          </TabsTrigger>
        </TabsList>

        {/* ------------------------------ ADOPTER ------------------------------ */}
        <TabsContent value="adopter" className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatTile icon={ClipboardList} label="My applications" value={String(myApplications.length + 1)} hint="incl. Mishti (approved)" />
            <StatTile icon={HandCoins} label="My donations" value={bdt(myDonations.reduce((s, d) => s + d.amount, 0))} hint="this demo session" />
            <StatTile icon={SparkleIcon} label="Karma balance" value={String(personaSeedKarma + usePetCare.getState().karmaEarned)} hint="+25 per application, +1/৳100" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Applications */}
            <Card className="shadow-soft">
              <CardContent className="p-5">
                <h2 className="font-bold">Application tracker</h2>
                <div className="mt-3 space-y-3">
                  {[
                    ...myApplications.map((a) => ({
                      id: a.id,
                      petId: a.petId,
                      petName: seedPets.find((p) => p.id === a.petId)?.name ?? "Pet",
                      status: a.status,
                      date: a.date,
                      note: undefined as string | undefined,
                    })),
                    ...seedApplications.map((a) => ({
                      id: a.id,
                      petId: a.petId,
                      petName: seedPets.find((p) => p.id === a.petId)?.name ?? "Pet",
                      status: a.status,
                      date: a.date,
                      note: a.decisionNote,
                    })),
                  ].map((a) => (
                    <div key={`app-${a.id}`} className="rounded-xl border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold">
                          {a.petName} <span className="font-normal text-muted-foreground">· applied {fmtDate(a.date)}</span>
                        </p>
                        <AppStatusBadge status={a.status} />
                      </div>
                      {a.note && <p className="mt-1.5 text-xs text-violet-800">{a.note}</p>}
                      {a.status === "submitted" && (
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          Shelter has 7 days to respond — you&apos;ll get a notification.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Donations */}
              <Card className="shadow-soft">
                <CardContent className="p-5">
                  <h2 className="font-bold">My donations</h2>
                  {myDonations.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Nothing yet this session — try the Donate flow and watch this fill up.
                    </p>
                  ) : (
                    <div className="mt-3 max-h-40 space-y-2 overflow-y-auto scroll-slim">
                      {myDonations.map((d) => (
                        <div key={d.id} className="flex items-center justify-between rounded-xl border p-2.5 text-sm">
                          <div>
                            <p className="font-semibold">{bdt(d.amount)}</p>
                            <p className="text-xs text-muted-foreground">
                              {d.anonymous ? "Anonymous" : d.donorName} · {d.method}
                            </p>
                          </div>
                          <Badge variant="outline" className="border-green-200 bg-green-50 text-green-800">
                            receipt ready
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reminders */}
              <Card className="shadow-soft">
                <CardContent className="p-5">
                  <h2 className="flex items-center gap-2 font-bold">
                    <BellRing className="h-4 w-4 text-primary" /> Medical reminders
                  </h2>
                  <div className="mt-3 space-y-2">
                    {personaReminders.map((r, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                        <div>
                          <p className="font-semibold">
                            {r.petName} — {r.type}
                          </p>
                          <p className="text-xs text-muted-foreground">{r.note}</p>
                        </div>
                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
                          due {fmtDate(r.due)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Favorites */}
          <Card className="shadow-soft">
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 font-bold">
                <Heart className="h-4 w-4 text-primary" /> Favorites
              </h2>
              {favorites.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Tap the heart on any pet card to bookmark them here.
                </p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-3">
                  {favorites.map((id) => {
                    const p = pets.find((x) => x.id === id);
                    if (!p) return null;
                    return (
                      <div key={id} className="flex items-center gap-2 rounded-xl border p-2 pr-3">
                        <PetArt pet={p} className="h-9 w-9 rounded-lg" />
                        <span className="text-sm font-semibold">{p.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------ SHELTER ------------------------------ */}
        <TabsContent value="shelter" className="mt-6 space-y-6">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatTile icon={PawPrint} label="Residents" value={`${residents}/${capacity}`} hint={`${utilization}% capacity used`} />
            <StatTile icon={ClipboardList} label="Pending applications" value={String(pendingInbox.length)} hint="needs your review" />
            <StatTile icon={TrendingUp} label="Raised (all campaigns)" value={bdt(raisedTotal)} hint="live totals" />
            <StatTile icon={Building2} label="Verified status" value="Licensed" hint="DAWSH-2019-0142" />
          </div>

          {/* Application inbox */}
          <Card className="shadow-soft">
            <CardContent className="p-5">
              <h2 className="font-bold">Application inbox</h2>
              <p className="text-xs text-muted-foreground">
                Approving flips the pet to <strong>adopted</strong>; rejecting reopens{" "}
                <strong>available</strong> — just like the real status workflow.
              </p>
              {pendingInbox.length === 0 ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> Inbox zero. Try applying to a pet
                  from the Adopt screen, then refresh here.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {pendingInbox.map((a) => {
                    const pet = pets.find((p) => p.id === a.petId);
                    return (
                      <div key={`inbox-${a.id}`} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border p-4">
                        <div className="flex items-start gap-3">
                          {pet && <PetArt pet={pet} className="h-12 w-12 rounded-xl" />}
                          <div>
                            <p className="font-semibold">
                              {a.applicant} → {pet?.name}
                            </p>
                            <p className="max-w-xl text-xs text-muted-foreground">“{a.message}”</p>
                            <p className="mt-1 text-xs text-stone-500">
                              {a.homeType} · {a.experience ? "has pet experience" : "first-time owner"} ·{" "}
                              {fmtDate(a.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="rounded-lg bg-green-700 hover:bg-green-800"
                            onClick={() => decideApplication(a.id, "approved", a.petId)}
                          >
                            <CheckCircle2 className="h-4 w-4" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => decideApplication(a.id, "rejected", a.petId)}
                          >
                            <XCircle className="h-4 w-4" /> Reject
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pets table */}
          <Card className="shadow-soft">
            <CardContent className="p-5">
              <h2 className="font-bold">My pets ({pets.length})</h2>
              <div className="mt-3 max-h-96 overflow-y-auto rounded-xl border scroll-slim">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-secondary/90 backdrop-blur">
                    <tr className="text-left text-xs uppercase tracking-wide text-stone-500">
                      <th className="px-4 py-2.5 font-semibold">Pet</th>
                      <th className="px-4 py-2.5 font-semibold">Shelter</th>
                      <th className="px-4 py-2.5 font-semibold">Age</th>
                      <th className="px-4 py-2.5 font-semibold">Waiting</th>
                      <th className="px-4 py-2.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pets.map((p) => (
                      <tr key={p.id} className="border-t bg-white">
                        <td className="px-4 py-2.5 font-semibold">{p.name}</td>
                        <td className="px-4 py-2.5 text-stone-600">{shelterName(p.shelterId)}</td>
                        <td className="px-4 py-2.5 text-stone-600">{ageLabel(p.ageMonths)}</td>
                        <td className="px-4 py-2.5 text-stone-600">{Math.max(0, Math.round((Date.parse("2026-09-12") - Date.parse(p.admissionDate)) / 86400000))}d</td>
                        <td className="px-4 py-2.5">
                          <StatusBadge status={p.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Admin / safe haven */}
          <Card className="border-violet-200 shadow-soft">
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 font-bold">
                <ShieldAlert className="h-4 w-4 text-violet-700" /> Admin — Safe Haven caseload
              </h2>
              <p className="text-xs text-muted-foreground">
                Restricted view: case managers only. Requester identities are never stored.
              </p>
              <div className="mt-3 space-y-2">
                {safeHavenRequests.map((r) => (
                  <div key={r.code} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 text-sm">
                    <p>
                      <span className="font-mono font-semibold text-violet-700">{r.code}</span> · {r.petName} (
                      {r.species}) — {r.crisisType}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        r.status === "in_care"
                          ? "border-sky-200 bg-sky-50 text-sky-800"
                          : "border-amber-200 bg-amber-50 text-amber-800"
                      )}
                    >
                      <Eye className="mr-1 h-3 w-3" /> {r.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="shadow-soft">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-stone-500">
          <Icon className="h-4 w-4" />
          <p className="text-xs font-medium">{label}</p>
        </div>
        <p className="mt-1.5 text-xl font-extrabold sm:text-2xl">{value}</p>
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function AppStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    submitted: "border-amber-200 bg-amber-50 text-amber-800",
    under_review: "border-sky-200 bg-sky-50 text-sky-800",
    approved: "border-green-200 bg-green-50 text-green-800",
    rejected: "border-red-200 bg-red-50 text-red-700",
  };
  return (
    <Badge variant="outline" className={map[status]}>
      {status.replace("_", " ")}
    </Badge>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return <TrendingUp className={className} />;
}
