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
  Search,
  Sparkles,
  LayoutDashboard,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Screen } from "@/data/seed";

const LINKS: { screen: Screen; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { screen: "home", label: "Home", icon: House },
  { screen: "pets", label: "Adopt", icon: Heart },
  { screen: "campaigns", label: "Donate", icon: HandCoins },
  { screen: "vets", label: "Vets", icon: Stethoscope },
  { screen: "blood", label: "Blood Bank", icon: Droplets },
  { screen: "lostfound", label: "Lost & Found", icon: Search },
  { screen: "karma", label: "Karma", icon: Sparkles },
  { screen: "dashboard", label: "Dashboard", icon: LayoutDashboard },
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
    <header className="sticky top-0 z-40 w-full border-b bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2 cursor-pointer"
          aria-label="PetCare home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-soft">
            <PawPrint className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Pet<span className="text-primary">Care</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {LINKS.map(({ screen: s, label, icon: Icon }) => (
            <button
              key={s}
              onClick={() => go(s)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                screen === s
                  ? "bg-accent text-accent-foreground"
                  : "text-stone-600 hover:bg-secondary hover:text-foreground"
              )}
              aria-current={screen === s ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <PawPrint className="h-4 w-4 text-white" />
              </span>
              PetCare
            </SheetTitle>
            <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile">
              {LINKS.map(({ screen: s, label, icon: Icon }) => (
                <button
                  key={s}
                  onClick={() => go(s)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                    screen === s ? "bg-accent text-accent-foreground" : "hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 pb-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <PawPrint className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="font-extrabold tracking-tight">
                Pet<span className="text-primary">Care</span>
              </p>
              <p className="text-xs text-muted-foreground">Adopt. Donate. Heal.</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground space-y-1 sm:text-right">
            <p>
              Demo web version — data mirrors the MySQL seed in the repo. Interactions are saved to
              your browser (localStorage).
            </p>
            <a
              href="https://github.com/iqrahoque/PetCare"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-teal-700 hover:underline"
            >
              <Github className="h-3.5 w-3.5" /> github.com/iqrahoque/PetCare
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
