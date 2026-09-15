"use client";

/*
 * Rescue Guide v2 (audit P3 + #5):
 *  - RescueScenarios: three 10-second scenario cards (bleeding / road / trapped)
 *  - RescueDecisionTree: an interactive 4-question triage flow that ends in a
 *    concrete "do this now" card with CTAs (post alert, share location, call).
 * Both render inside the existing rescue screen, above the do & don't list.
 */

import { useState } from "react";
import {
  Droplet,
  CarTaxiFront,
  Construction,
  ShieldCheck,
  Siren,
  PhoneCall,
  MapPin,
  RotateCcw,
  ChevronLeft,
  Check,
  X,
  ArrowRight,
  Stethoscope,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Scenario cards — scannable in 10 seconds                            */
/* ------------------------------------------------------------------ */

const SCENARIOS = [
  {
    icon: Droplet,
    tone: "danger" as const,
    title: "Heavy bleeding",
    dos: ["Press a clean cloth firmly on the wound", "Keep the animal warm and calm"],
    donts: ["Don't use human medicine", "Don't wash the wound with alcohol"],
  },
  {
    icon: CarTaxiFront,
    tone: "warn" as const,
    title: "Road accident",
    dos: ["Keep traffic away from the animal", "Call rescue / the nearest vet"],
    donts: ["Don't drag the animal by the legs", "Don't let crowds surround it"],
  },
  {
    icon: Construction,
    tone: "info" as const,
    title: "Trapped animal",
    dos: ["Keep the area clear and quiet", "Call responders with the exact spot"],
    donts: ["Don't enter unsafe drains or wells", "Don't lower ropes without a rescuer"],
  },
];

const TONE_ICON: Record<"danger" | "warn" | "info", string> = {
  danger: "bg-danger-50 text-danger-600",
  warn: "bg-tint-yellow text-dog-yellow-deep",
  info: "bg-brand-50 text-brand-700",
};

export function RescueScenarios() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <ShieldCheck className="h-5 w-5 text-primary" /> The first 10 seconds
        </h3>
        <p className="text-xs text-muted-foreground">Find the scenario, follow the two lines, post the alert.</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {SCENARIOS.map((s) => (
          <div key={s.title} className="rounded-2xl border bg-white p-4 shadow-soft">
            <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-xl", TONE_ICON[s.tone])}>
              <s.icon className="h-4 w-4" />
            </span>
            <p className="mt-2.5 font-bold text-ink-800">{s.title}</p>
            <div className="mt-2.5 space-y-1.5 text-sm">
              {s.dos.map((d) => (
                <p key={d} className="flex items-start gap-1.5 text-ink-700">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-leaf-600" /> {d}
                </p>
              ))}
              {s.donts.map((d) => (
                <p key={d} className="flex items-start gap-1.5 text-ink-500">
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger-500" /> {d}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Interactive decision tree                                           */
/* ------------------------------------------------------------------ */

type Outcome = {
  kind: "outcome";
  severity: "critical" | "caution" | "guide";
  headline: string;
  sub: string;
  dos: string[];
  donts: string[];
};

type Question = {
  kind: "question";
  id: string;
  question: string;
  help: string;
  options: { label: string; next: string }[];
};

type Node = Question | Outcome;

const TREE: Record<string, Node> = {
  q1: {
    kind: "question",
    id: "q1",
    question: "Is the animal conscious?",
    help: "Talk softly from a few steps away — watch for head movement or a tail response.",
    options: [
      { label: "Yes — it reacts", next: "q2" },
      { label: "No / can't tell", next: "unconscious" },
    ],
  },
  q2: {
    kind: "question",
    id: "q2",
    question: "Is there heavy bleeding?",
    help: "Look for pooled blood or a wound that soaks through a cloth in under a minute.",
    options: [
      { label: "Yes — bleeding heavily", next: "bleeding" },
      { label: "No / minor", next: "q3" },
    ],
  },
  q3: {
    kind: "question",
    id: "q3",
    question: "Is it aggressive or terrified?",
    help: "Hissing, growling, snapping or frantic fleeing means fear — not a bad animal.",
    options: [
      { label: "Yes — won't let me close", next: "fearful" },
      { label: "No — approachable", next: "q4" },
    ],
  },
  q4: {
    kind: "question",
    id: "q4",
    question: "Can you stay until help arrives?",
    help: "Even 20 minutes of calm company keeps an injured streetie from running into traffic.",
    options: [
      { label: "Yes — I can wait", next: "stay" },
      { label: "No — I have to leave", next: "leave" },
    ],
  },

  unconscious: {
    kind: "outcome",
    severity: "critical",
    headline: "Treat this as an emergency",
    sub: "An unconscious animal needs a vet now — call while you post the alert.",
    dos: [
      "Call the nearest 24h emergency vet line immediately",
      "Slide a board or blanket under it to move it if traffic is a risk",
      "Keep the head and spine straight — no twisting",
      "Post the alert marked Critical so responders are pinged first",
    ],
    donts: [
      "Don't give water or food to an unconscious animal",
      "Don't shake it to 'wake it up'",
    ],
  },
  bleeding: {
    kind: "outcome",
    severity: "critical",
    headline: "Stop the bleeding, then call",
    sub: "Pressure is the first aid that matters — everything else can wait for the vet.",
    dos: [
      "Press a clean cloth firmly on the wound and keep pressing 5+ minutes",
      "Layer cloth on top if it soaks through — never remove the first layer",
      "Call the emergency vet line and post a Critical alert",
    ],
    donts: [
      "Don't use human medicine — many are toxic to cats and dogs",
      "Don't tie a tourniquet tightly around a limb",
    ],
  },
  fearful: {
    kind: "outcome",
    severity: "caution",
    headline: "Don't approach — route it to pros",
    sub: "A terrified animal can bite even when it desperately needs help. That's what the responder network is for.",
    dos: [
      "Keep a safe distance and speak calmly — no sudden moves",
      "Note the exact spot: gate numbers, signboards, landmarks",
      "Take a photo from where you stand",
      "Post the alert and tag it for experienced responders",
    ],
    donts: [
      "Don't chase or corner the animal",
      "Don't try to pull it out of a hiding spot yourself",
    ],
  },
  stay: {
    kind: "outcome",
    severity: "guide",
    headline: "You've already done the most important thing",
    sub: "Staying with the animal until responders arrive dramatically raises the odds.",
    dos: [
      "Post the alert and share your live location",
      "Offer water in a shallow bowl — never force it",
      "Keep traffic, crowds and other dogs away",
      "Photograph the animal and the spot for the alert",
    ],
    donts: [
      "Don't leave it unattended near a road",
      "Don't hand it to strangers claiming to be rescuers — responders show ID in the app",
    ],
  },
  leave: {
    kind: "outcome",
    severity: "guide",
    headline: "Pin it precisely, then hand it off",
    sub: "If you can't stay, the alert has to carry everything a responder needs to find the animal.",
    dos: [
      "Share your exact location when you post — pin, not just the area",
      "Upload a clear photo so responders recognise the animal",
      "Mention a landmark: 'behind the Mirpur 10 metro pillar 3'",
      "Call the vet line yourself if it looked critical",
    ],
    donts: [
      "Don't post without a location — 'somewhere in Uttara' wastes the first hour",
    ],
  },
};

const SEVERITY_STYLE: Record<Outcome["severity"], { ring: string; chip: string; label: string }> = {
  critical: {
    ring: "border-l-4 border-l-danger-500 border-danger-200",
    chip: "bg-danger-100 text-danger-800",
    label: "Emergency",
  },
  caution: {
    ring: "border-l-4 border-l-brand2-500 border-brand2-200",
    chip: "bg-tint-yellow text-dog-yellow-deep",
    label: "Caution",
  },
  guide: {
    ring: "border-l-4 border-l-leaf-500 border-leaf-200",
    chip: "bg-leaf-50 text-leaf-800",
    label: "You're doing great",
  },
};

const QUESTION_COUNT = 4;

export function RescueDecisionTree({ onPost }: { onPost: () => void }) {
  const [path, setPath] = useState<string[]>(["q1"]);
  const current = TREE[path[path.length - 1]];
  const [sharedLoc, setSharedLoc] = useState<string | null>(null);
  const [locError, setLocError] = useState(false);

  const answer = (next: string) => setPath((p) => [...p, next]);
  const back = () => setPath((p) => (p.length > 1 ? p.slice(0, -1) : p));
  const restart = () => {
    setPath(["q1"]);
    setSharedLoc(null);
    setLocError(false);
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setLocError(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocError(false);
        setSharedLoc(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      () => setLocError(true)
    );
  };

  return (
    <Card className={cn("shadow-soft", current.kind === "outcome" && SEVERITY_STYLE[current.severity].ring)}>
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-600">
            <Stethoscope className="h-4 w-4" /> Quick triage
          </p>
          <div className="flex items-center gap-2">
            {path.length > 1 && (
              <button
                onClick={back}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold text-ink-600 transition-colors hover:border-ink-400"
              >
                <ChevronLeft className="h-3 w-3" /> Back
              </button>
            )}
            {current.kind === "outcome" ? (
              <button
                onClick={restart}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold text-ink-600 transition-colors hover:border-ink-400"
              >
                <RotateCcw className="h-3 w-3" /> Start over
              </button>
            ) : (
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                Step {path.length} of {QUESTION_COUNT}
              </span>
            )}
          </div>
        </div>

        {current.kind === "question" && (
          <div>
            <div className="mt-4 flex items-center gap-1.5" aria-hidden>
              {Array.from({ length: QUESTION_COUNT }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    i < path.length ? "bg-primary" : "bg-ink-100"
                  )}
                />
              ))}
            </div>
            <h3 className="mt-4 text-xl font-bold tracking-tight text-ink-800">{current.question}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{current.help}</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {current.options.map((o) => (
                <button
                  key={o.label}
                  onClick={() => answer(o.next)}
                  className="cursor-pointer rounded-xl border bg-white p-3.5 text-left text-sm font-semibold text-ink-800 transition-all hover:border-primary hover:bg-accent/40"
                >
                  {o.label}
                  <ArrowRight className="float-right mt-0.5 h-4 w-4 text-ink-300" />
                </button>
              ))}
            </div>
          </div>
        )}

        {current.kind === "outcome" && (
          <div>
            <span
              className={cn(
                "mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
                SEVERITY_STYLE[current.severity].chip
              )}
            >
              {SEVERITY_STYLE[current.severity].label}
            </span>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-ink-800">{current.headline}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">{current.sub}</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-leaf-700">Do now</p>
                <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
                  {current.dos.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" /> {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-danger-700">Never</p>
                <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
                  {current.donts.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" /> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t pt-4">
              <Button
                onClick={onPost}
                className="rounded-xl bg-danger-500 text-white hover:bg-danger-600"
              >
                <Siren className="h-4 w-4" /> Post a rescue alert
              </Button>
              <a
                href="#rescue-contacts"
                className="inline-flex items-center gap-2 rounded-xl border border-danger-200 bg-white px-4 py-2.5 text-sm font-semibold text-danger-700 transition-colors hover:bg-danger-50"
              >
                <PhoneCall className="h-4 w-4" /> Emergency vet lines
              </a>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={shareLocation}
                disabled={!!sharedLoc}
              >
                <MapPin className="h-4 w-4" />
                {sharedLoc ? "Location attached" : "Share my location"}
              </Button>
            </div>
            {sharedLoc && (
              <p className="mt-2 text-xs font-medium text-leaf-700">
                📍 {sharedLoc} — this pin will be attached to your alert.
              </p>
            )}
            {locError && (
              <p className="mt-2 text-xs font-medium text-ink-500">
                Location unavailable — type the nearest landmark in the alert instead.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
