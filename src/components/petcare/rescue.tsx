"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Siren,
  MapPin,
  Clock,
  Users,
  LifeBuoy,
  ShieldCheck,
  PhoneCall,
  Stethoscope,
  PawPrint,
  Dog,
  Cat,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  seedRescueAlerts,
  asset,
  rescueResponders as networkVolunteers,
  SITUATION_META,
  RESCUE_URGENCY_META,
  RESCUE_STATUS_META,
  fmtAgo,
  type RescueAlert,
  type RescueStatus,
} from "@/data/seed";
import { usePetCare, type MyRescueReport } from "@/lib/store";
import { RescueDialog } from "./dialogs";
import { RescueScenarios, RescueDecisionTree } from "./rescue-guide";
import { RescueNetworkMap, type MapCase } from "./rescue-map";
import { cn } from "@/lib/utils";

const URGENCY_ORDER = { critical: 0, urgent: 1, standard: 2 } as const;
const STATUS_ORDER = { reported: 0, responding: 1, rescued: 2, closed: 3 } as const;

type UnifiedAlert = RescueAlert | MyRescueReport;

function isMine(a: UnifiedAlert): a is MyRescueReport {
  return a.id >= 1000;
}

export function RescueScreen() {
  const rescueReports = usePetCare((s) => s.rescueReports);
  const rescuedAlerts = usePetCare((s) => s.rescuedAlerts);
  const extraResponders = usePetCare((s) => s.rescueResponders);
  const respondToRescue = usePetCare((s) => s.respondToRescue);
  const markRescueRescued = usePetCare((s) => s.markRescueRescued);
  const markRescueClosed = usePetCare((s) => s.markRescueClosed);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState("active");

  const alerts: UnifiedAlert[] = [
    ...rescueReports,
    ...seedRescueAlerts.map((a) => {
      const override = rescuedAlerts[a.id];
      return {
        ...a,
        responders: [...a.responders, ...(extraResponders[a.id] ?? [])],
        status: (override ?? a.status) as RescueStatus,
      };
    }),
  ].sort(
    (a, b) =>
      URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency] ||
      STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
      new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  );

  const active = alerts.filter((a) => a.status === "reported" || a.status === "responding");
  const resolved = alerts.filter((a) => a.status === "rescued" || a.status === "closed");
  const shown = tab === "active" ? active : resolved;
  const needsResponders = alerts.filter((a) => a.status === "reported").length;
  const rescuedCount = alerts.filter((a) => a.status === "rescued").length;
  const closedCount = alerts.filter((a) => a.status === "closed").length;

  // Map data (audit #22) — same unified alerts, reduced to what the map needs
  const mapCases: MapCase[] = alerts.map((a) => ({
    key: `${isMine(a) ? "m" : "s"}-${a.id}`,
    situation: SITUATION_META[a.situation as keyof typeof SITUATION_META]?.label ?? "Rescue",
    species: a.species,
    area: a.area,
    reportedAt: a.reportedAt,
    urgency: a.urgency,
    status: a.status,
    responders: a.responders.length,
    mine: isMine(a),
  }));

  return (
    <div className="pb-4">
      {/* Emergency hero */}
      <section className="bg-rescue border-b border-danger-200">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14 text-ink-800">
          <div className="grid items-center gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                See an animal in danger?
              </h1>
              <p className="mt-3 max-w-xl text-base text-ink-600 sm:text-lg">
                If an animal is injured, stuck, or abandoned, post an alert with the location.
                Shelters and volunteers near the area are notified and can claim the case.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  onClick={() => setDialogOpen(true)}
                  className="rounded-xl bg-danger-500 text-white hover:bg-danger-600"
                >
                  <Siren className="h-4 w-4" /> Post a rescue alert
                </Button>
                <a
                  href="#rescue-guide"
                  className="inline-flex items-center gap-2 rounded-xl border border-danger-300 bg-white px-4 py-2.5 text-sm font-semibold text-danger-700 transition-colors hover:bg-white"
                >
                  <ShieldCheck className="h-4 w-4" /> How to help safely
                </a>
              </div>
            </div>

            {/* Stat cards (computed from the data below) */}
            <div className="grid grid-cols-2 gap-3 lg:col-span-2">
              {[
                { label: "Open cases", value: String(active.length), sub: "reported or responding" },
                { label: "Waiting for responder", value: String(needsResponders), sub: "not claimed yet" },
                { label: "Rescued", value: String(rescuedCount), sub: "animal secured" },
                { label: "Cases closed", value: String(closedCount), sub: "outcome recorded" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-danger-200 bg-white p-4 shadow-soft">
                  <p className="text-2xl font-bold tracking-tight text-ink-800 sm:text-3xl">{s.value}</p>
                  <p className="text-xs font-semibold text-ink-700">{s.label}</p>
                  <p className="mt-0.5 text-[11px] text-ink-500">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Feed */}
        <div id="rescue-feed">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Rescue feed</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Critical alerts first. Claim a case to coordinate.
              </p>
            </div>
            <TabsList className="rounded-full bg-ink-100">
              <TabsTrigger value="active" className="rounded-full">
                Active ({active.length})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="rounded-full">
                Rescued ({resolved.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={tab} className="mt-5 grid gap-4 lg:grid-cols-2">
            {shown.length === 0 && (
              <Card className="shadow-soft lg:col-span-2">
                <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                  <LifeBuoy className="h-10 w-10 text-primary/50" />
                  <p className="font-bold">Nothing here right now</p>
                  <p className="text-sm text-muted-foreground">
                    {tab === "active"
                      ? "No active alerts right now."
                      : "Rescued cases will show up here with their outcomes."}
                  </p>
                </CardContent>
              </Card>
            )}
            {shown.map((a) => {
              const situation = SITUATION_META[a.situation as keyof typeof SITUATION_META];
              const urgency = RESCUE_URGENCY_META[a.urgency];
              const status = RESCUE_STATUS_META[a.status];
              const mine = isMine(a);
              const responding = a.status === "reported" || a.status === "responding";
              const urgentOpen = responding && (a.urgency === "critical" || a.urgency === "urgent");
              return (
                <Card
                  key={`${mine ? "m" : "s"}-${a.id}`}
                  className={cn(
                    "shadow-soft",
                    a.status === "closed" && "opacity-80",
                    urgentOpen && "border-l-4 border-l-danger-500"
                  )}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      {urgentOpen && (
                        <span className="absolute -left-4 top-4 hidden" aria-hidden />
                      )}
                      <div className="flex items-center gap-3">
                        {"photo" in a && a.photo ? (
                          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-ink-100">
                            <Image src={asset(a.photo)} alt="" fill sizes="44px" className="object-cover" />
                          </span>
                        ) : (
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
                            {a.species === "dog" ? (
                              <Dog className="h-5 w-5" />
                            ) : a.species === "cat" ? (
                              <Cat className="h-5 w-5" />
                            ) : (
                              <PawPrint className="h-5 w-5" />
                            )}
                          </span>
                        )}
                        <div>
                          <p className="font-bold leading-tight">
                            {situation?.label ?? "Rescue"} — <span className="capitalize">{a.species}</span>
                          </p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {a.area}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("shrink-0 gap-1.5", urgency.cls)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", urgency.dot)} />
                        {a.urgency}
                      </Badge>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-ink-700">{a.description}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
<Clock className="h-3 w-3" /> {fmtAgo(a.reportedAt)}
                              {urgentOpen && (
                                <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-danger-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                                  <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute h-full w-full animate-ping rounded-full bg-white opacity-80" />
                                    <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
                                  </span>
                                  Urgent
                                </span>
                              )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {a.responders.length > 0
                          ? `${a.responders.length} responding: ${a.responders.slice(0, 2).join(", ")}${a.responders.length > 2 ? "…" : ""}`
                          : "No responders yet"}
                      </span>
                      <span>
                        {mine ? "posted by you" : a.reporter ? `reported by ${a.reporter}` : "anonymous report"}
                      </span>
                    </div>

                    {a.resolution && (
                      <div className="mt-3 rounded-xl border border-leaf-200 bg-leaf-50/70 p-3 text-sm text-leaf-900">
                        <p className="flex items-center gap-1.5 font-semibold">
                          <ShieldCheck className="h-4 w-4 text-leaf-700" /> Outcome
                        </p>
                        <p className="mt-1 text-leaf-800">{a.resolution}</p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="outline" className={status.cls}>
                        {status.label}
                      </Badge>
                      {responding && (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            onClick={() => respondToRescue(a.id)}
                            disabled={a.responders.includes("Sara Chowdhury")}
                          >
                            {a.responders.includes("Sara Chowdhury")
                              ? "You're responding"
                              : "I can help respond (+40 karma)"}
                          </Button>
                          {a.status === "responding" && (
                            <Button
                              size="sm"
                              className="rounded-lg"
                              onClick={() => markRescueRescued(a.id)}
                            >
                              <LifeBuoy className="h-4 w-4" /> Secured (+80)
                            </Button>
                          )}
                        </div>
                      )}
                      {a.status === "rescued" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg"
                          onClick={() => markRescueClosed(a.id)}
                        >
                          Close case — animal safe (+40)
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
        </div>

        {/* Rescue Network map (audit #22) */}
        <section className="mt-12">
          <RescueNetworkMap cases={mapCases} />
          <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Stylized demo map. In production each alert pins the reporter&apos;s
            coordinates from the rescue_reports table; shelters and clinics come
            from their own tables.
          </p>
        </section>

        {/* Guide: triage tree + scenarios + do & don't + contacts (audit P3/#5) */}
        <section id="rescue-guide" className="mt-12 scroll-mt-20">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight">Rescue Guide</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Answer four questions and we&apos;ll tell you exactly what to do — or skim the
                scenario cards and the do &amp; don&apos;t list.
              </p>
            </div>
          </div>
          <div className="mt-5">
            <RescueDecisionTree onPost={() => setDialogOpen(true)} />
          </div>
          <div className="mt-8">
            <RescueScenarios />
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-5">
          <Card className="shadow-soft lg:col-span-3">
            <CardContent className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight">
                <ShieldCheck className="h-5 w-5 text-primary" /> While help arrives — do &amp; don&apos;t
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Do</p>
                  <ul className="mt-2 space-y-2 text-sm text-ink-700">
                    <li className="flex gap-2"><span className="text-brand-600">✓</span> Keep a safe distance — scared animals bite or scratch out of fear.</li>
                    <li className="flex gap-2"><span className="text-brand-600">✓</span> Offer water in a shallow bowl; never force-feed an injured animal.</li>
                    <li className="flex gap-2"><span className="text-brand-600">✓</span> Place a towel/box over a storm drain opening if the animal may fall deeper.</li>
                    <li className="flex gap-2"><span className="text-brand-600">✓</span> Photograph the spot and share landmarks in your alert.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-danger-700">Don&apos;t</p>
                  <ul className="mt-2 space-y-2 text-sm text-ink-700">
                    <li className="flex gap-2"><span className="text-danger-500">✕</span> Don&apos;t chase a road-accident animal — internal injuries worsen with stress.</li>
                    <li className="flex gap-2"><span className="text-danger-500">✕</span> Don&apos;t move a suspected spinal injury without a flat board.</li>
                    <li className="flex gap-2"><span className="text-danger-500">✕</span> Don&apos;t enter a confined drain or well alone — alert 2+ responders.</li>
                    <li className="flex gap-2"><span className="text-danger-500">✕</span> Don&apos;t give human painkillers — many are toxic to cats.</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 rounded-xl bg-secondary p-3 text-xs text-secondary-foreground">
                <strong>Paw Points:</strong> posting an alert +50 · responding +40 · securing the animal +80 ·
                closing a case +40. False alerts are removed by moderators and cost 100 points.
              </p>
            </CardContent>
          </Card>

          <Card id="rescue-contacts" className="scroll-mt-20 shadow-soft lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight">
                <PhoneCall className="h-5 w-5 text-danger-600" /> Emergency vet lines
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                For life-threatening cases, call while you post.
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { name: "Bangladesh Animal Hospital", meta: "24h emergency · Banani", phone: "+880 2 900 0002" },
                  { name: "Care & Cure Veterinary Clinic", meta: "blood bank on site · Gulshan 2", phone: "+880 2 900 0001" },
                  { name: "PawBridge Plus Vet Clinic", meta: "low-cost treatment · Mirpur 10", phone: "+880 2 900 0003" },
                ].map((c) => (
                  <div key={c.name} className="flex items-center justify-between gap-2 rounded-xl border p-3">
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-bold">
                        <Stethoscope className="h-3.5 w-3.5 text-primary" /> {c.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{c.meta}</p>
                    </div>
                    <a
                      href={`tel:${c.phone.replace(/\s/g, "")}`}
                      className="shrink-0 rounded-lg bg-danger-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-danger-700"
                    >
                      Call
                    </a>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> Responders
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {networkVolunteers.map((v) => (
                    <span key={v} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-12">
          <h3 className="text-lg font-bold tracking-tight">How a rescue works</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              { n: "1", t: "You post", d: "Species, what happened, and the exact location." },
              { n: "2", t: "A volunteer claims it", d: "Responders near the area pick up the case." },
              { n: "3", t: "On-site help", d: "They secure the animal and call the nearest vet if needed." },
              { n: "4", t: "Case closed", d: "The case closes with an outcome note: clinic, shelter or reunion." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border bg-white p-4 shadow-soft">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary font-bold text-white">
                  {s.n}
                </span>
                <p className="mt-2.5 font-bold">{s.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <PawPrint className="h-3.5 w-3.5 text-primary" />
            Backed by the rescue_reports + rescue_responders tables in the PawBridge MySQL schema.
          </p>
        </section>
      </div>

      <RescueDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
