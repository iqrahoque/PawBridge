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
  LayoutDashboard,
  Github,
  ArrowUpRight,
  ClipboardList,
  BellRing,
  FileWarning,
  MapPinned,
  HeartPulse,
  Gift,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandMark, BrandTile } from "./brand";
import { NotificationsBell } from "./notifications";
import { cn } from "@/lib/utils";
import type { Screen } from "@/data/seed";

/* ------------------------------------------------------------------ */
/* Navigation model — 4 grouped menus (audit #18) + emergency CTA      */
/* ------------------------------------------------------------------ */

type NavItem = { screen: Screen; label: string; desc: string; icon: React.ComponentType<{ className?: string }> };
type NavGroup = { key: string; label: string; primary: Screen; icon: React.ComponentType<{ className?: string }>; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    key: "adopt",
    label: "Adopt",
    primary: "pets",
    icon: Heart,
    items: [
      { screen: "pets", label: "Find a Pet", desc: "Dogs & cats from verified shelters", icon: PawPrint },
      { screen: "dashboard", label: "Applications & favorites", desc: "Track your adoption pipeline", icon: ClipboardList },
      { screen: "dashboard", label: "My pets & reminders", desc: "Vaccines, meds and follow-ups", icon: BellRing },
    ],
  },
  {
    key: "rescue",
    label: "Rescue",
    primary: "rescue",
    icon: Siren,
    items: [
      { screen: "rescue", label: "Report an animal", desc: "Alert the volunteer network in minutes", icon: FileWarning },
      { screen: "rescue", label: "Live rescue feed", desc: "Follow every case from report to safety", icon: MapPinned },
      { screen: "lostfound", label: "Lost & Found", desc: "Community board with match suggestions", icon: Search },
    ],
  },
  {
    key: "care",
    label: "Care",
    primary: "vets",
    icon: Stethoscope,
    items: [
      { screen: "vets", label: "Find a vet", desc: "Verified clinics, open hours & emergencies", icon: Stethoscope },
      { screen: "blood", label: "Pet blood bank", desc: "Critical requests matched to donors", icon: Droplets },
      { screen: "blood", label: "Register a donor pet", desc: "Healthy pets can save another's life", icon: HeartPulse },
    ],
  },
  {
    key: "help",
    label: "Help",
    primary: "campaigns",
    icon: HandCoins,
    items: [
      { screen: "campaigns", label: "Fund a treatment", desc: "Surgery, vaccination & winter drives", icon: HandCoins },
      { screen: "campaigns", label: "Wish lists & fostering", desc: "Shelter needs, virtual fostering, transport", icon: Gift },
      { screen: "karma", label: "Paw Impact", desc: "See the difference your help made", icon: Sparkles },
    ],
  },
];

const GROUP_SCREENS = (g: NavGroup) => g.items.map((i) => i.screen);

/* ------------------------------------------------------------------ */
/* Desktop dropdown                                                    */
/* ------------------------------------------------------------------ */

function Dropdown({ group, screen, go }: { group: NavGroup; screen: Screen; go: (s: Screen) => void }) {
  const active = GROUP_SCREENS(group).includes(screen);
  const Icon = group.icon;
  return (
    <div className="group relative">
      <button
        onClick={() => go(group.primary)}
        className={cn(
          "relative flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
          active ? "bg-primary text-white shadow-soft" : "text-foreground/70 hover:bg-secondary hover:text-foreground"
        )}
        aria-haspopup="true"
        aria-expanded={active ? "true" : undefined}
      >
        <Icon className="h-4 w-4" />
        {group.label}
      </button>
      {/* Panel — opens on hover or keyboard focus */}
      <div
        className="invisible absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        <div className="overflow-hidden rounded-2xl border border-brand-100 bg-[#fffdf9] p-1.5 shadow-lift">
          {group.items.map((item) => (
            <button
              key={item.label}
              onClick={() => go(item.screen)}
              className="flex w-full cursor-pointer items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-secondary"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <item.icon className="h-4 w-4" />
              </span>
              <span>
                <span className="flex items-center gap-1 text-sm font-semibold text-ink-800">
                  {item.label}
                  {screen === item.screen && <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{item.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */

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
    <header className="sticky top-0 z-40 w-full border-b border-brand-100 bg-[#fffdf9]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2.5 cursor-pointer"
          aria-label="PawBridge home"
        >
          <BrandTile className="h-10 w-10 rounded-2xl" />
          <span className="flex flex-col items-start leading-none">
            <span className="text-lg font-bold tracking-tight text-ink-800">PawBridge</span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-500">
              Adopt · Rescue · Heal
            </span>
          </span>
        </button>

        {/* Desktop: grouped menus */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          <button
            onClick={() => go("home")}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
              screen === "home" ? "bg-primary text-white shadow-soft" : "text-foreground/70 hover:bg-secondary hover:text-foreground"
            )}
            aria-current={screen === "home" ? "page" : undefined}
          >
            <House className="h-4 w-4" /> Home
          </button>
          {NAV_GROUPS.map((g) => (
            <Dropdown key={g.key} group={g} screen={screen} go={go} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Notification center (audit #26) — bell + live event feed */}
          <NotificationsBell onNavigate={go} />

          {/* Emergency CTA — visually different from everything else (audit #4).
              Named "Emergency Rescue" so the promise is unambiguous (audit P2):
              broader help lives under the Help menu and the homepage action strip. */}
          <Button
            className={cn(
              "hidden rounded-full bg-danger-500 text-white hover:bg-danger-600 md:inline-flex",
              screen === "rescue" && "ring-2 ring-danger-300 ring-offset-1"
            )}
            onClick={() => go("rescue")}
          >
            <Siren className="h-4 w-4" /> Emergency Rescue
          </Button>

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
                <BrandTile className="h-8 w-8 rounded-lg" />
                PawBridge
              </SheetTitle>

              <Button
                className="mt-4 w-full rounded-xl bg-danger-500 text-white hover:bg-danger-600"
                onClick={() => go("rescue")}
              >
                <Siren className="h-4 w-4" /> Emergency Rescue Now
              </Button>

              <nav className="mt-5 flex flex-col gap-4" aria-label="Mobile">
                <button
                  onClick={() => go("home")}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    screen === "home" ? "bg-primary text-white" : "hover:bg-secondary"
                  )}
                >
                  <House className="h-4 w-4" /> Home
                </button>

                {NAV_GROUPS.map((g) => (
                  <div key={g.key}>
                    <p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-400">
                      {g.label}
                    </p>
                    <div className="mt-1 flex flex-col gap-0.5">
                      {g.items.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => go(item.screen)}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                            screen === item.screen ? "bg-primary text-white" : "hover:bg-secondary"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => go("dashboard")}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    screen === "dashboard" ? "bg-primary text-white" : "hover:bg-secondary"
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Footer — purposeful, clickable columns (audit #21)                  */
/* ------------------------------------------------------------------ */

export function Footer({ onNavigate }: { onNavigate?: (s: Screen) => void }) {
  const go = (s: Screen) => onNavigate?.(s);

  const cols: { title: string; links: { label: string; screen: Screen }[] }[] = [
    {
      title: "For animals",
      links: [
        { label: "Adopt a pet", screen: "pets" },
        { label: "Rescue network", screen: "rescue" },
        { label: "Lost & Found", screen: "lostfound" },
        { label: "Pet blood bank", screen: "blood" },
      ],
    },
    {
      title: "For helpers",
      links: [
        { label: "Fund a treatment", screen: "campaigns" },
        { label: "Wish lists & fostering", screen: "campaigns" },
        { label: "Paw Impact", screen: "karma" },
        { label: "Your dashboard", screen: "dashboard" },
      ],
    },
    {
      title: "For shelters & vets",
      links: [
        { label: "Vet directory", screen: "vets" },
        { label: "Partner shelters", screen: "pets" },
        { label: "Donor registry", screen: "blood" },
        { label: "Verification", screen: "dashboard" },
      ],
    },
  ];

  return (
    <footer className="mt-auto bg-ink-900 text-white/70">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-center text-xl font-bold tracking-tight text-white text-balance sm:text-2xl">
          Every paw deserves a safe place to call home.
        </p>
        <div className="mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <BrandTile className="h-9 w-9 rounded-xl" />
              <div className="flex flex-col leading-none">
                <p className="font-bold tracking-tight text-white">PawBridge</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-300">
                  Adopt · Rescue · Heal
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/60">
              Helping Dhaka&apos;s streeties find homes, treatment and safety — adoption from
              verified shelters, campaign fundraising, a vet directory and an emergency
              rescue network.
            </p>
            <a
              href="https://github.com/iqrahoque/PawBridge"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 hover:text-brand-200 hover:underline"
            >
              <Github className="h-4 w-4" /> github.com/iqrahoque/PawBridge
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-wider text-white/50">{col.title}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => go(l.screen)}
                      className="cursor-pointer text-white/75 transition-colors hover:text-white hover:underline"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-5 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>© 2026 PawBridge — university database project demo by Iqra Hoque.</p>
          <p className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> Made for the streeties of Bangladesh.
          </p>
        </div>
      </div>
    </footer>
  );
}
