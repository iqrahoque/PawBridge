"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  seedRescueAlerts,
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
import { cn } from "@/lib/utils";

const URGENCY_ORDER = { critical: 0, urgent: 1, standard: 2 } as const;
const STATUS_ORDER = { reported: 0, responding: 1, rescued: 2, closed: 3 } as const;

type UnifiedAlert = RescueAlert | (MyRescueReport & { hue: number; resolution?: string });

function isMine(a: UnifiedAlert): a is MyRescueReport & { hue: number } {
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
    ...rescueReports.map((r) => ({ ...r, hue: 320 })),
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

  return (
    <div className="pb-4">
      {/* Emergency hero */}
      <section className="bg-rescue border-b border-emred-200">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14 text-charcoal">
          <div className="grid items-center gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emred-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-emred-700">
                <Siren className="h-3.5 w-3.5 animate-pulse" /> Community rescue network
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                See an animal in danger?
              </h1>
              <p className="mt-3 max-w-xl text-base text-sagegray-600 sm:text-lg">
                A cat stuck on a ledge, a kitten in a storm drain, a dog hit by a car —
                post it here. Verified shelters and trained volunteers near you get alerted
                instantly and respond together.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  onClick={() => setDialogOpen(true)}
                  className="rounded-xl bg-emred-500 text-white hover:bg-emred-600 shadow-lift"
                >
                  <Siren className="h-4 w-4" /> Post a rescue alert
                </Button>
                <a
                  href="#rescue-guide"
                  className="inline-flex items-center gap-2 rounded-xl border border-emred-300 bg-white/60 px-4 py-2.5 text-sm font-semibold text-emred-700 transition-colors hover:bg-white"
                >
                  <ShieldCheck className="h-4 w-4" /> How to help safely
                </a>
              </div>
            </div>

            {/* Live stat cards */}
            <div className="grid grid-cols-2 gap-3 lg:col-span-2">
              {[
                { label: "Active alerts", value: String(active.length), sub: needsResponders > 0 ? `${needsResponders} waiting for responders` : "all covered" },
                { label: "Rescue volunteers", value: "120+", sub: "across 18 Dhaka zones" },
                { label: "Closed this month", value: "18", sub: "safe endings" },
                { label: "Avg. response", value: "35 min", sub: "report → responder on site" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-emred-200 bg-white/80 p-4 shadow-soft backdrop-blur">
                  <p className="text-2xl font-extrabold tracking-tight text-charcoal sm:text-3xl">{s.value}</p>
                  <p className="text-xs font-semibold text-sagegray-700">{s.label}</p>
                  <p className="mt-0.5 text-[11px] text-sagegray-500">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Feed */}
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Live rescue feed</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Critical alerts sort first. Claim a case to coordinate in the alert thread.
              </p>
            </div>
            <TabsList className="rounded-xl bg-secondary">
              <TabsTrigger value="active" className="rounded-lg">
                Active ({active.length})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="rounded-lg">
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
                      ? "No active alerts — a quiet day is a good day."
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
              return (
                <Card
                  key={`${mine ? "m" : "s"}-${a.id}`}
                  className={cn(
                    "shadow-soft transition-shadow hover:shadow-lift",
                    a.status === "closed" && "opacity-80"
                  )}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl"
                          style={{ background: `hsl(${a.hue} 70% 90%)` }}
                        >
                          {a.species === "dog" ? "🐶" : a.species === "cat" ? "🐱" : "🐾"}
                        </span>
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

                    <p className="mt-3 text-sm leading-relaxed text-sagegray-700">{a.description}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {fmtAgo(a.reportedAt)}
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
                      <div className="mt-3 rounded-xl border border-sage-200 bg-sage-50/70 p-3 text-sm text-sage-900">
                        <p className="flex items-center gap-1.5 font-semibold">
                          <ShieldCheck className="h-4 w-4 text-sage-700" /> Outcome
                        </p>
                        <p className="mt-1 text-sage-800">{a.resolution}</p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="outline" className={status.cls}>
                        {status.label}
                      </Badge>
                      {responding && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            onClick={() => respondToRescue(a.id)}
                            disabled={a.responders.includes("Sara Chowdhury")}
                          >
                            {a.responders.includes("Sara Chowdhury")
                              ? "You're responding ✓"
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

        {/* Guide + emergency contacts */}
        <section id="rescue-guide" className="mt-12 grid gap-4 lg:grid-cols-5">
          <Card className="shadow-soft lg:col-span-3">
            <CardContent className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
                <ShieldCheck className="h-5 w-5 text-primary" /> While help arrives — do &amp; don&apos;t
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sage-700">Do</p>
                  <ul className="mt-2 space-y-2 text-sm text-sagegray-700">
                    <li className="flex gap-2"><span className="text-sage-600">✓</span> Keep a safe distance — scared animals bite or scratch out of fear.</li>
                    <li className="flex gap-2"><span className="text-sage-600">✓</span> Offer water in a shallow bowl; never force-feed an injured animal.</li>
                    <li className="flex gap-2"><span className="text-sage-600">✓</span> Place a towel/box over a storm drain opening if the animal may fall deeper.</li>
                    <li className="flex gap-2"><span className="text-sage-600">✓</span> Photograph the spot and share landmarks in your alert.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emred-700">Don&apos;t</p>
                  <ul className="mt-2 space-y-2 text-sm text-sagegray-700">
                    <li className="flex gap-2"><span className="text-emred-500">✕</span> Don&apos;t chase a road-accident animal — internal injuries worsen with stress.</li>
                    <li className="flex gap-2"><span className="text-emred-500">✕</span> Don&apos;t move a suspected spinal injury without a flat board.</li>
                    <li className="flex gap-2"><span className="text-emred-500">✕</span> Don&apos;t enter a confined drain or well alone — alert 2+ responders.</li>
                    <li className="flex gap-2"><span className="text-emred-500">✕</span> Don&apos;t give human painkillers — many are toxic to cats.</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 rounded-xl bg-secondary p-3 text-xs text-secondary-foreground">
                <strong>Karma rewards:</strong> posting an alert +50 · responding +40 · securing the animal +80 ·
                closing a case +40. False alerts are removed by moderators and cost 100 points.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
                <PhoneCall className="h-5 w-5 text-emred-600" /> Emergency vet lines
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                For life-threatening cases, call while you post.
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { name: "Bangladesh Animal Hospital", meta: "24h emergency · Banani", phone: "+880 2 900 0002" },
                  { name: "Care & Cure Veterinary Clinic", meta: "blood bank on site · Gulshan 2", phone: "+880 2 900 0001" },
                  { name: "PetCare Plus Vet Clinic", meta: "low-cost treatment · Mirpur 10", phone: "+880 2 900 0003" },
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
                      className="shrink-0 rounded-lg bg-emred-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emred-700"
                    >
                      Call
                    </a>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> Your zone&apos;s responder network
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {networkVolunteers.slice(0, 6).map((v) => (
                    <span key={v} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
                      {v}
                    </span>
                  ))}
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                    +112 more
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How it works */}
        <section className="mt-12">
          <h3 className="text-lg font-extrabold tracking-tight">How a rescue works</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              { n: "1", t: "You post", d: "Species, what happened, where exactly. 60 seconds." },
              { n: "2", t: "Volunteers ping", d: "Nearby responders get the alert and claim the case." },
              { n: "3", t: "On-site help", d: "They secure the animal and call the nearest vet if needed." },
              { n: "4", t: "Safe ending", d: "Case closes with an outcome note — clinic, shelter or reunion." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border bg-white p-4 shadow-soft">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary font-extrabold text-white">
                  {s.n}
                </span>
                <p className="mt-2.5 font-bold">{s.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <PawPrint className="h-3.5 w-3.5 text-primary" />
            Backed by the rescue_reports + rescue_responders tables in the PetCare MySQL schema.
          </p>
        </section>
      </div>

      <RescueDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
