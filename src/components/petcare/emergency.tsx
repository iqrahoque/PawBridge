"use client";

import { useState } from "react";
import { Siren, Stethoscope, Droplets, X, HeartPulse } from "lucide-react";
import type { Screen } from "@/data/seed";

/**
 * Persistent Pet Emergency button — routes a crisis to the right module
 * (rescue network, blood bank, vet directory) in one tap.
 */
export function EmergencyButton({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [open, setOpen] = useState(false);

  const options: { icon: React.ComponentType<{ className?: string }>; label: string; screen: Screen }[] = [
    { icon: Siren, label: "I found an injured animal", screen: "rescue" },
    { icon: HeartPulse, label: "My pet is sick", screen: "vets" },
    { icon: Droplets, label: "My pet needs blood", screen: "blood" },
    { icon: Stethoscope, label: "I need an emergency vet", screen: "vets" },
  ];

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {open && (
        <div className="w-64 overflow-hidden rounded-2xl border border-brand-100 bg-[#fffdf9] shadow-lift">
          <p className="border-b border-brand-100 bg-danger-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-danger-700">
            Pet emergency — where do you need help?
          </p>
          <div className="p-1.5">
            {options.map(({ icon: Icon, label, screen }) => (
              <button
                key={label}
                onClick={() => {
                  setOpen(false);
                  onNavigate(screen);
                }}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink-800 transition-colors hover:bg-brand-50"
              >
                <Icon className="h-4 w-4 shrink-0 text-danger-600" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Pet emergency"
        className={`flex h-auto cursor-pointer items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lift transition-colors ${
          open ? "bg-ink-900" : "bg-danger-500 hover:bg-danger-600"
        }`}
      >
        {open ? <X className="h-5 w-5" /> : <Siren className="h-5 w-5" />}
        {open ? "Close" : "Pet Emergency"}
      </button>
    </div>
  );
}
