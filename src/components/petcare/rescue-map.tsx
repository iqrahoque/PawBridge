"use client";

/*
 * Rescue Network map (audit #22 — the "wow" feature): a stylized, hand-drawn
 * map of Dhaka that shows the whole network at a glance — shelters, vet
 * clinics and every rescue case, colour-coded by state:
 *   red = life at risk · amber = act today · grey = this week · green = secured
 * Markers are interactive: click a case marker (or a row in the side list) to
 * inspect the case, then jump into the feed below. No external map tiles —
 * fully static, so it works on GitHub Pages.
 */

import { useMemo, useState } from "react";
import { MapPinned, ArrowUpRight, LifeBuoy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fmtAgo } from "@/data/seed";

export type MapCase = {
  key: string;
  situation: string;
  species: string;
  area: string;
  reportedAt: string;
  urgency: "critical" | "urgent" | "standard";
  status: "reported" | "responding" | "rescued" | "closed";
  responders: number;
  mine?: boolean;
};

/* Stylized coordinates (viewBox 420x300, north up) */
const AREA_POS: { match: string[]; x: number; y: number; label?: string; labelPos?: "l" | "r" }[] = [
  { match: ["uttara"], x: 205, y: 36, label: "Uttara", labelPos: "r" },
  { match: ["airport"], x: 218, y: 66, label: "Airport Rd", labelPos: "r" },
  { match: ["banani", "kakoli"], x: 228, y: 96, label: "Banani", labelPos: "r" },
  { match: ["gulshan"], x: 262, y: 108, label: "Gulshan", labelPos: "r" },
  { match: ["mohakhali"], x: 240, y: 118 },
  { match: ["mirpur"], x: 118, y: 102, label: "Mirpur", labelPos: "l" },
  { match: ["mohammadpur", "lalmatia"], x: 106, y: 156, label: "Mohammadpur", labelPos: "l" },
  { match: ["dhanmondi", "lake"], x: 152, y: 146, label: "Dhanmondi", labelPos: "l" },
  { match: ["farmgate", "tejgaon"], x: 194, y: 136, label: "Farmgate", labelPos: "r" },
  { match: ["ramna", "shahbag"], x: 232, y: 152 },
  { match: ["jatrabari", "sayedabad"], x: 226, y: 226, label: "Jatrabari", labelPos: "r" },
  { match: ["old dhaka", "lalbagh", "chalab"], x: 158, y: 220, label: "Old Dhaka", labelPos: "l" },
  { match: ["bashundhara", "baridhara"], x: 300, y: 70 },
];

const FALLBACK = { x: 200, y: 150 };

function locate(area: string) {
  const a = area.toLowerCase();
  for (const p of AREA_POS) if (p.match.some((m) => a.includes(m))) return p;
  return FALLBACK;
}

const URGENCY_COLOR: Record<MapCase["urgency"], string> = {
  critical: "#d95c5c",
  urgent: "#de9a5f",
  standard: "#a8a29e",
};

const OPEN: MapCase["status"][] = ["reported", "responding"];

export function RescueNetworkMap({ cases }: { cases: MapCase[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = cases.find((c) => c.key === selected) ?? null;

  const openCount = useMemo(() => cases.filter((c) => OPEN.includes(c.status)).length, [cases]);

  /* keep the chosen case visible when the feed updates underneath it */
  const keyed = cases.map((c) => ({ ...c, pos: locate(c.area) }));

  return (
    <Card className="overflow-hidden shadow-soft">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-100 px-5 py-4">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <MapPinned className="h-5 w-5 text-danger-600" /> Rescue network — Dhaka
            </h3>
            <p className="text-xs text-muted-foreground">
              {openCount} open case{openCount === 1 ? "" : "s"} across the city · shelters, vet clinics and responders, one map
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold">
            <LegendDot color="#d95c5c" label="Life at risk" />
            <LegendDot color="#de9a5f" label="Act today" />
            <LegendDot color="#a8a29e" label="This week" />
            <LegendDot color="#74995e" label="Secured" />
            <span className="mx-1 h-4 w-px bg-ink-200" />
            <LegendDot color="#7b5e3b" label="Shelter" square />
            <LegendDot color="#74995e" label="Vet clinic" cross />
          </div>
        </div>

        <div className="grid lg:grid-cols-5">
          {/* Map */}
          <div className="relative bg-[#fffdf9] lg:col-span-3">
            <svg viewBox="0 0 420 300" role="img" aria-label="Stylized map of Dhaka showing rescue cases" className="block h-auto w-full select-none">
              {/* water — Buriganga + Dhanmondi lake */}
              <path d="M0 258 C 80 244, 150 252, 210 246 S 340 232, 420 240 L 420 300 L 0 300 Z" fill="#d9e6ea" opacity="0.75" />
              <ellipse cx="140" cy="163" rx="17" ry="8" fill="#d9e6ea" transform="rotate(-18 140 163)" />

              {/* roads */}
              <g stroke="#eadfcd" fill="none" strokeLinecap="round">
                <path d="M118 90 C 128 120, 142 138, 150 168 C 156 190, 160 208, 164 224" strokeWidth="7" />
                <path d="M205 30 C 210 70, 222 96, 232 128 C 238 150, 232 196, 226 232" strokeWidth="7" />
                <path d="M60 130 C 130 146, 240 132, 372 120" strokeWidth="5" />
                <path d="M228 96 C 246 104, 258 110, 278 116" strokeWidth="4" />
                <path d="M104 156 C 140 162, 176 156, 214 142" strokeWidth="4" />
                <path d="M226 226 C 200 216, 176 224, 150 222" strokeWidth="4" />
              </g>

              {/* area labels */}
              <g fontSize="9.5" fill="#9b9285" fontWeight="600">
                {AREA_POS.filter((p) => p.label).map((p) => (
                  <text
                    key={p.label}
                    x={p.labelPos === "l" ? p.x - 10 : p.x + 11}
                    y={p.y + 3.5}
                    textAnchor={p.labelPos === "l" ? "end" : "start"}
                  >
                    {p.label}
                  </text>
                ))}
              </g>

              {/* network pins: shelters (squares) + vet clinics (crosses) */}
              <g>
                {[
                  { x: 150, y: 155, name: "Pawfect Haven Rescue — Dhanmondi" },
                  { x: 205, y: 30, name: "Dhaka Street Paws Foundation — Uttara" },
                ].map((s) => (
                  <g key={s.name} transform={`translate(${s.x},${s.y})`}>
                    <title>{s.name}</title>
                    <rect x="-4.5" y="-4.5" width="9" height="9" rx="2" fill="#7b5e3b" stroke="#fff" strokeWidth="1.5" />
                  </g>
                ))}
                {[
                  { x: 262, y: 118, name: "Care & Cure Veterinary Clinic — Gulshan 2" },
                  { x: 232, y: 86, name: "Bangladesh Animal Hospital — Banani (24h)" },
                  { x: 112, y: 116, name: "PawBridge Plus Vet Clinic — Mirpur 10" },
                ].map((c) => (
                  <g key={c.name} transform={`translate(${c.x},${c.y})`}>
                    <title>{c.name}</title>
                    <path d="M-1.6 -4.5 H1.6 V-1.6 H4.5 V1.6 H1.6 V4.5 H-1.6 V1.6 H-4.5 V-1.6 H-1.6 Z" fill="#74995e" stroke="#fff" strokeWidth="1" />
                  </g>
                ))}
              </g>

              {/* case markers */}
              {keyed.map((c) => {
                const open = OPEN.includes(c.status);
                const color = open ? URGENCY_COLOR[c.urgency] : "#74995e";
                const isSel = selected === c.key;
                return (
                  <g
                    key={c.key}
                    transform={`translate(${c.pos.x},${c.pos.y})`}
                    onClick={() => setSelected(c.key)}
                    className="cursor-pointer"
                  >
                    <title>{`${c.situation} — ${c.area}`}</title>
                    {open && c.urgency === "critical" && (
                      <circle r="8" fill="none" stroke={color} strokeWidth="2">
                        <animate attributeName="r" values="7;17" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.65;0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {isSel && <circle r="12" fill="none" stroke={color} strokeWidth="1.5" opacity="0.8" />}
                    <circle r={isSel ? 8 : 6.5} fill={color} stroke="#fff" strokeWidth="2" />
                    {!open && <path d="M-2.6 0.2 L-0.6 2.4 L2.8 -1.8" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Case list / detail */}
          <div className="border-t border-brand-100 lg:col-span-2 lg:border-l lg:border-t-0">
            {sel ? (
              <div className="flex h-full flex-col p-5">
                <button
                  onClick={() => setSelected(null)}
                  className="cursor-pointer self-start text-xs font-semibold text-ink-400 hover:text-ink-600"
                >
                  ← All cases
                </button>
                <p className="mt-2 text-lg font-bold leading-snug text-ink-800">
                  {sel.situation} — <span className="capitalize">{sel.species}</span>
                  {sel.mine && <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">yours</span>}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{sel.area}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className={cn("gap-1.5", openStatusCls(sel))}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: OPEN.includes(sel.status) ? URGENCY_COLOR[sel.urgency] : "#74995e" }} />
                    {sel.status === "reported" ? "Needs responders" : sel.status === "responding" ? "Responders on the way" : sel.status === "rescued" ? "Secured" : "Closed"}
                  </Badge>
                  <span>{fmtAgo(sel.reportedAt)}</span>
                  <span>{sel.responders} responding</span>
                </div>
                <a
                  href="#rescue-feed"
                  className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-danger-700 hover:underline"
                >
                  Open this case in the feed <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto p-2 lg:max-h-full">
                {keyed.map((c) => {
                  const open = OPEN.includes(c.status);
                  return (
                    <button
                      key={c.key}
                      onClick={() => setSelected(c.key)}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-secondary"
                    >
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        {open && c.urgency === "critical" && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: URGENCY_COLOR[c.urgency] }} />
                        )}
                        <span
                          className="relative inline-flex h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: open ? URGENCY_COLOR[c.urgency] : "#74995e" }}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink-800">
                          {c.situation} — <span className="capitalize">{c.species}</span>
                          {c.mine && <span className="ml-1.5 text-[10px] font-bold text-brand-600">YOURS</span>}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">{c.area} · {fmtAgo(c.reportedAt)}</span>
                      </span>
                      {!open && <LifeBuoy className="h-3.5 w-3.5 shrink-0 text-leaf-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function openStatusCls(c: MapCase) {
  if (c.status === "reported") return "border-danger-200 bg-danger-50 text-danger-700";
  if (c.status === "responding") return "border-brand2-200 bg-brand2-50 text-brand2-800";
  return "border-leaf-200 bg-leaf-50 text-leaf-800";
}

function LegendDot({
  color,
  label,
  square,
  cross,
}: {
  color: string;
  label: string;
  square?: boolean;
  cross?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-ink-600">
      {square ? (
        <span className="h-2 w-2 rounded-[3px]" style={{ backgroundColor: color }} />
      ) : cross ? (
        <span className="relative h-2 w-2">
          <span className="absolute left-1/2 top-0 h-2 w-[3px] -translate-x-1/2 rounded-sm" style={{ backgroundColor: color }} />
          <span className="absolute left-0 top-1/2 h-[3px] w-2 -translate-y-1/2 rounded-sm" style={{ backgroundColor: color }} />
        </span>
      ) : (
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      )}
      {label}
    </span>
  );
}
