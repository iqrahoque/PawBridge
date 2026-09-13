"use client";

import { useState } from "react";
import {
  PawPrint,
  Menu,
  House,
  Heart,
  HandCoins,
  Stethoscope,
  Droplets,
  Siren,
  Search,
  Coins,
  LayoutDashboard,
  Github,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Screen } from "@/data/seed";

const LINKS: { screen: Screen; label: string; icon: React.ComponentType<{ className?: string }>; alert?: boolean }[] = [
  { screen: "home", label: "Home", icon: House },
  { screen: "pets", label: "Adopt", icon: Heart },
  { screen: "campaigns", label: "Donate", icon: HandCoins },
  { screen: "vets", label: "Vets", icon: Stethoscope },
  { screen: "blood", label: "Blood Bank", icon: Droplets },
  { screen: "rescue", label: "Rescue", icon: Siren, alert: true },
  { screen: "lostfound", label: "Lost & Found", icon: Search },
  { screen: "karma", label: "Karma", icon: Coins },
];

export function Nav({
  screen,
  onNavigate,
}: {
  screen: Screen;
  onNavigate: (s: Screen) => void;
}) {
  const [open, setOpen] = useState(false);
  const go = (s: Screen) => {
    onNavigate(s);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/10 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2 cursor-pointer"
          aria-label="PawBridge home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <PawPrint className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-ink-800">PawBridge</span>
        </button>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {LINKS.map(({ screen: s, label, icon: Icon, alert }) => (
            <button
              key={s}
              onClick={() => go(s)}
              className={cn(
                "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all cursor-pointer",
                screen === s
                  ? "bg-primary text-white shadow-soft"
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground"
              )}
              aria-current={screen === s ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              {label}
              {alert && screen !== s && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-danger-500" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant={screen === "dashboard" ? "default" : "outline"}
            className="hidden rounded-xl lg:inline-flex"
            onClick={() => go("dashboard")}
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto">
              <SheetTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <PawPrint className="h-4 w-4 text-white" />
                </span>
                PawBridge
              </SheetTitle>
              <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile">
                {[...LINKS, { screen: "dashboard" as Screen, label: "Dashboard", icon: LayoutDashboard, alert: false }].map(
                  ({ screen: s, label, icon: Icon, alert }) => (
                    <button
                      key={s}
                      onClick={() => go(s)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                        screen === s ? "bg-primary text-white" : "hover:bg-secondary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                      {alert && screen !== s && <span className="ml-auto h-2 w-2 rounded-full bg-danger-500" />}
                    </button>
                  )
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-ink-800 text-white/70">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500">
                <PawPrint className="h-5 w-5 text-white" />
              </span>
              <p className="font-bold tracking-tight text-white">PawBridge</p>
            </div>
            <p className="mt-3 text-sm text-white/60">
              A pet welfare platform for Dhaka — adoption listings from verified shelters,
              campaign fundraising, a vet directory and an emergency rescue network.
            </p>
            <a
              href="https://github.com/iqrahoque/PetCare"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 hover:text-brand-200 hover:underline"
            >
              <Github className="h-4 w-4" /> github.com/iqrahoque/PetCare
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">For pets</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="text-white/75">Adoption portal</li>
              <li className="text-white/75">Pet blood bank</li>
              <li className="text-white/75">Emergency rescue network</li>
              <li className="text-white/75">Lost &amp; found matching</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">For people</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="text-white/75">Campaign fundraising</li>
              <li className="text-white/75">Shelter wish lists</li>
              <li className="text-white/75">Karma &amp; rewards</li>
              <li className="text-white/75">Safe Haven (crisis fostering)</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">Demo notes</p>
            <p className="mt-3 text-sm text-white/60">
              Data mirrors the MySQL seed in the repo. Your interactions (adoptions, donations,
              rescues, reports) are saved to your browser&apos;s localStorage — reset anytime from
              the Dashboard.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-5 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>© 2026 PawBridge — university database project demo by Iqra Hoque.</p>
          <p>Demo data mirrors the MySQL seed in the repository.</p>
        </div>
      </div>
    </footer>
  );
}
