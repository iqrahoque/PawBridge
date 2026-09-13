"use client";

import { useMemo } from "react";
import Image from "next/image";
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
  Check,
  Circle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  asset,
} from "@/data/seed";
import { usePetCare } from "@/lib/store";
import { StatusBadge, PetPhoto } from "./cards";
import { cn } from "@/lib/utils";

export function DashboardScreen() {
  const myApplications = usePetCare((s) => s.applications);
  const myDonations = usePetCare((s) => s.donations);
  const favorites = usePetCare((s) => s.favorites);
  const overrides = usePetCare((s) => s.petStatusOverrides);
  const seedAppOverrides = usePetCare((s) => s.seedAppOverrides);
  const karmaEarned = usePetCare((s) => s.karmaEarned);
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
  const effStatus = (id: number, fallback: string) => seedAppOverrides[id] ?? fallback;
  const pendingInbox = [
    ...myApplications.map((a) => ({ ...a, petId: a.petId, applicant: a.applicant, date: a.date })),
    ...seedApplications.map((a) => ({ ...a, status: effStatus(a.id, a.status) })),
  ].filter((a) => a.status === "submitted" || a.status === "under_review");
  const raisedTotal =
    seedDonations.reduce((s, d) => s + d.amount, 0) + myDonations.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <LayoutDashboard className="h-7 w-7 text-primary" /> Dashboard
        </h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-lg text-ink-600">
              Reset demo data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset all demo data?</AlertDialogTitle>
              <AlertDialogDescription>
                This clears everything you did in this demo — applications, donations, rescue
                reports, Paw Points and favorites — and restores the original seed. It cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep my data</AlertDialogCancel>
              <AlertDialogAction
                className="bg-danger-500 text-white hover:bg-danger-600"
                onClick={resetDemo}
              >
                Reset everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatTile icon={ClipboardList} label="My applications" value={String(myApplications.length + 1)} hint="incl. Mishti (approved)" />
            <StatTile icon={HandCoins} label="My donations" value={bdt(myDonations.reduce((s, d) => s + d.amount, 0))} hint="this demo session" />
            <StatTile icon={TrendingUp} label="Paw Points balance" value={String(personaSeedKarma + karmaEarned)} hint="+25 per application, +1/৳100" />
          </div>

          {/* My Pets — the pets that joined your family through this platform */}
          {(() => {
            const approvedIds = new Set<number>([
              ...myApplications.filter((a) => a.status === "approved").map((a) => a.petId),
              ...seedApplications.filter((a) => effStatus(a.id, a.status) === "approved").map((a) => a.petId),
            ]);
            const myPets = [...approvedIds]
              .map((id) => seedPets.find((p) => p.id === id))
              .filter((p): p is (typeof seedPets)[number] => Boolean(p));
            const in48h = (d: number) => {
              const t = new Date();
              t.setDate(t.getDate() + d);
              return t.toISOString().slice(0, 10);
            };
            if (myPets.length === 0) return null;
            return (
              <Card className="shadow-soft">
                <CardContent className="p-5">
                  <h2 className="flex items-center gap-2 font-bold">
                    <PawPrint className="h-4 w-4 text-primary" /> My Pets
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Adopted through PawBridge — with their health timeline.
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {myPets.map((p) => (
                      <div key={p.id} className="flex gap-3 rounded-2xl border p-3">
                        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                          <Image src={asset(p.photo)} alt={`Photo of ${p.name}`} fill sizes="64px" className="object-cover" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold leading-tight">
                            {p.name} <span className="text-xs font-normal capitalize text-muted-foreground">· {p.species}</span>
                          </p>
                          <div className="mt-1.5 space-y-1 text-xs">
                            <p className="flex items-center gap-1.5 text-leaf-700">
                              <Check className="h-3 w-3" /> Rabies vaccination complete
                            </p>
                            <p className="flex items-center gap-1.5 text-leaf-700">
                              <Check className="h-3 w-3" /> Deworming up to date
                            </p>
                            <p className="flex items-center gap-1.5 text-brand2-700">
                              <Circle className="h-2.5 w-2.5 fill-current" /> Next vaccination — {fmtDate(in48h(30))}
                            </p>
                            <p className="flex items-center gap-1.5 text-muted-foreground">
                              <Circle className="h-2.5 w-2.5" /> Vet checkup — {fmtDate(in48h(14))}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })()}

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
                      status: effStatus(a.id, a.status),
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
                      {a.note && <p className="mt-1.5 text-xs text-brand-800">{a.note}</p>}
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
                          <Badge variant="outline" className="border-leaf-200 bg-leaf-50 text-leaf-800">
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
                        <Badge variant="outline" className="border-brand2-200 bg-brand2-50 text-brand2-800">
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
                        <PetPhoto pet={p} className="h-9 w-9 rounded-full" sizes="36px" />
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
                  <CheckCircle2 className="h-4 w-4 text-brand-600" /> Inbox zero. Try applying to a pet
                  from the Adopt screen, then refresh here.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {pendingInbox.map((a) => {
                    const pet = pets.find((p) => p.id === a.petId);
                    return (
                      <div key={`inbox-${a.id}`} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border p-4">
                        <div className="flex items-start gap-3">
                          {pet && <PetPhoto pet={pet} className="h-12 w-12 rounded-full" sizes="48px" />}
                          <div>
                            <p className="font-semibold">
                              {a.applicant} → {pet?.name}
                            </p>
                            <p className="max-w-xl text-xs text-muted-foreground">“{a.message}”</p>
                            <p className="mt-1 text-xs text-ink-500">
                              {a.homeType} · {a.experience ? "has pet experience" : "first-time owner"} ·{" "}
                              {fmtDate(a.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="rounded-lg bg-leaf-600 hover:bg-leaf-700"
                            onClick={() => decideApplication(a.id, "approved", a.petId)}
                          >
                            <CheckCircle2 className="h-4 w-4" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg border-danger-200 text-danger-700 hover:bg-danger-50"
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
              <div className="mt-3 max-h-96 overflow-x-auto overflow-y-auto rounded-xl border scroll-slim">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="sticky top-0 bg-secondary">
                    <tr className="text-left text-xs uppercase tracking-wide text-ink-500">
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
                        <td className="px-4 py-2.5 text-ink-600">{shelterName(p.shelterId)}</td>
                        <td className="px-4 py-2.5 text-ink-600">{ageLabel(p.ageMonths)}</td>
                        <td className="px-4 py-2.5 text-ink-600">{Math.max(0, Math.round((Date.parse("2026-09-12") - Date.parse(p.admissionDate)) / 86400000))}d</td>
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
          <Card className="border-brand-200 shadow-soft">
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 font-bold">
                <ShieldAlert className="h-4 w-4 text-brand-700" /> Admin — Safe Haven caseload
              </h2>
              <p className="text-xs text-muted-foreground">
                Restricted view: case managers only. Requester identities are never stored.
              </p>
              <div className="mt-3 space-y-2">
                {safeHavenRequests.map((r) => (
                  <div key={r.code} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 text-sm">
                    <p>
                      <span className="font-mono font-semibold text-brand-700">{r.code}</span> · {r.petName} (
                      {r.species}) — {r.crisisType}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        r.status === "in_care"
                          ? "border-ink-200 bg-ink-50 text-ink-800"
                          : "border-brand2-200 bg-brand2-50 text-brand2-800"
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
        <div className="flex items-center gap-2 text-ink-500">
          <Icon className="h-4 w-4" />
          <p className="text-xs font-medium">{label}</p>
        </div>
        <p className="mt-1.5 text-xl font-bold sm:text-2xl">{value}</p>
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function AppStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    submitted: "border-brand2-200 bg-brand2-50 text-brand2-800",
    under_review: "border-ink-200 bg-ink-50 text-ink-800",
    approved: "border-leaf-200 bg-leaf-50 text-leaf-800",
    rejected: "border-danger-200 bg-danger-50 text-danger-700",
  };
  return (
    <Badge variant="outline" className={map[status]}>
      {status.replace("_", " ")}
    </Badge>
  );
}