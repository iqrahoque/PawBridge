"use client";

/*
 * Notification center (audit #26) — a bell in the navbar that surfaces the
 * events the MySQL database would push: critical rescues nearby, open blood
 * requests, lost & found match suggestions, campaign milestones, application
 * status changes and care reminders. Everything is derived live from the
 * seed data + the zustand store, so actions you take in the demo (applying,
 * posting a rescue, donating) appear here too. Read state persists to
 * localStorage alongside the rest of the demo "database".
 */

import { useMemo } from "react";
import {
  Bell,
  Siren,
  Droplets,
  SearchCheck,
  HandCoins,
  ClipboardList,
  Syringe,
  BellRing,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePetCare } from "@/lib/store";
import {
  seedRescueAlerts,
  bloodRequests,
  clinics,
  seedLostReports,
  seedFoundReports,
  seedMatches,
  campaigns,
  seedDonations,
  personaReminders,
  daysUntil,
  fmtAgo,
  bdt,
  shelterName,
  type Screen,
} from "@/data/seed";

type Tone = "danger" | "warn" | "good" | "info";

interface PetNotification {
  id: string;
  title: string;
  body: string;
  at: string; // ISO datetime (or date) for the "x ago" line
  screen: Screen;
  tone: Tone;
  icon: React.ComponentType<{ className?: string }>;
}

const TONES: Record<Tone, string> = {
  danger: "bg-danger-50 text-danger-600",
  warn: "bg-tint-yellow text-dog-yellow-deep",
  good: "bg-leaf-50 text-leaf-700",
  info: "bg-brand-50 text-brand-700",
};

export function useNotifications(): PetNotification[] {
  const applications = usePetCare((s) => s.applications);
  const rescueReports = usePetCare((s) => s.rescueReports);
  const donations = usePetCare((s) => s.donations);

  return useMemo(() => {
    const notes: PetNotification[] = [];

    // 1 — critical rescue near you
    const critical = seedRescueAlerts.find(
      (a) =>
        a.urgency === "critical" &&
        (a.status === "reported" || a.status === "responding")
    );
    if (critical) {
      notes.push({
        id: "rescue-critical-1",
        title: `Critical rescue — ${critical.area.split(",")[0]}`,
        body: `${critical.description.split(".")[0]}. Responders so far: ${critical.responders.length}.`,
        at: critical.reportedAt,
        screen: "rescue",
        tone: "danger",
        icon: Siren,
      });
    }

    // 2 — open blood request
    const req = bloodRequests.find((r) => r.status === "open");
    if (req) {
      const clinic = clinics.find((c) => c.id === req.clinicId);
      notes.push({
        id: "blood-open-1",
        title: `${req.bloodType} blood needed ${req.urgency === "critical" ? "tonight" : "soon"}`,
        body: `${req.units} unit${req.units > 1 ? "s" : ""} for a ${req.species} at ${clinic?.name ?? "the clinic"} — ${clinic?.area ?? "Dhaka"}. If your dog or cat matches, you could save a life.`,
        at: req.deadline,
        screen: "blood",
        tone: "danger",
        icon: Droplets,
      });
    }

    // 3 — lost & found match suggestion
    const match = seedMatches[0];
    const lost = seedLostReports.find((l) => l.id === match?.lostId);
    const found = seedFoundReports.find((f) => f.id === match?.foundId);
    if (match && lost && found && lost.status === "searching") {
      notes.push({
        id: "match-simba",
        title: `Possible match for ${lost.petName} — ${Math.round(match.score)}%`,
        body: `A ${found.color} ${found.species} was found near ${found.area}. Review the match and confirm if it's ${lost.petName}.`,
        at: found.foundOn,
        screen: "lostfound",
        tone: "warn",
        icon: SearchCheck,
      });
    }

    // 4 — campaign milestone (live %, includes your donations)
    const camp = campaigns.find((c) => c.id === 1) ?? campaigns[0];
    if (camp) {
      const raised =
        seedDonations.filter((d) => d.campaignId === camp.id).reduce((s, d) => s + d.amount, 0) +
        donations.filter((d) => d.campaignId === camp.id).reduce((s, d) => s + d.amount, 0);
      const pct = Math.min(100, Math.round((raised / camp.goal) * 100));
      notes.push({
        id: `campaign-${camp.id}`,
        title: `${camp.title} is ${pct}% funded`,
        body: `${bdt(Math.max(0, camp.goal - raised))} still needed. Every ৳100 earns Paw Points and goes straight to treatment.`,
        at: "2026-09-11T16:30:00",
        screen: "campaigns",
        tone: "info",
        icon: HandCoins,
      });
    }

    // 5 — your own applications (dynamic)
    const latestApp = applications[0];
    if (latestApp) {
      const petName = latestApp.petId === 2 ? "Mishti" : `pet #${latestApp.petId}`;
      notes.push({
        id: `my-app-${latestApp.id}`,
        title:
          latestApp.status === "submitted"
            ? `Application received — ${petName}`
            : `Application update — ${petName}`,
        body:
          latestApp.status === "submitted"
            ? `${shelterName(2)} will review your application and get back to you within 48 hours. You can follow every step in your dashboard.`
            : `Status: ${latestApp.status.replace("_", " ")}. Open the dashboard to see the full timeline.`,
        at: `${latestApp.date}T10:00:00`,
        screen: "dashboard",
        tone: "good",
        icon: ClipboardList,
      });
    }

    // 6 — your own rescue reports (dynamic)
    const myReport = rescueReports[0];
    if (myReport) {
      notes.push({
        id: `my-rescue-${myReport.id}`,
        title: "Your rescue alert is live",
        body: `Volunteers within 3 km of ${myReport.area} have been notified. You'll earn Paw Points as responders claim the case.`,
        at: myReport.reportedAt,
        screen: "rescue",
        tone: "good",
        icon: Siren,
      });
    }

    // 7 — care reminders
    const rem = personaReminders[0];
    if (rem) {
      notes.push({
        id: "reminder-vax",
        title: `${rem.petName}: ${rem.type.toLowerCase()} due in ${daysUntil(rem.due)} days`,
        body: `${rem.note}. Vaccination records and due dates live in the vaccination_records table of the MySQL schema.`,
        at: "2026-09-10T09:00:00",
        screen: "dashboard",
        tone: "info",
        icon: Syringe,
      });
    }

    return notes;
  }, [applications, rescueReports, donations]);
}

/* ------------------------------------------------------------------ */
/* Bell + popover panel                                                */
/* ------------------------------------------------------------------ */

export function NotificationsBell({
  onNavigate,
}: {
  onNavigate: (s: Screen) => void;
}) {
  const notes = useNotifications();
  const readIds = usePetCare((s) => s.readNotifications);
  const markRead = usePetCare((s) => s.markNotificationsRead);
  const unread = notes.filter((n) => !readIds.includes(n.id)).length;

  return (
    <Popover onOpenChange={(open) => open && markRead(notes.map((n) => n.id))}>
      <PopoverTrigger asChild>
        <button
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-brand-100 bg-white text-ink-600 transition-colors hover:border-brand2-300 hover:text-ink-800"
          aria-label={`Notifications${unread ? ` — ${unread} unread` : ""}`}
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[9px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 max-w-[calc(100vw-2rem)] rounded-2xl border-brand-100 p-0 shadow-lift">
        <div className="flex items-center justify-between border-b border-brand-100 px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-bold">
            <BellRing className="h-4 w-4 text-brand-500" /> Notifications
          </p>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
            {notes.length} updates
          </span>
        </div>
        <div className="max-h-96 overflow-y-auto p-1.5">
          {notes.map((n) => {
            const Icon = n.icon;
            const isUnread = !readIds.includes(n.id);
            return (
              <button
                key={n.id}
                onClick={() => onNavigate(n.screen)}
                className={cn(
                  "flex w-full cursor-pointer items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-secondary",
                  isUnread && "bg-brand-50/50"
                )}
              >
                <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", TONES[n.tone])}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-sm font-semibold leading-snug text-ink-800">
                    {n.title}
                    {isUnread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger-500" aria-hidden />}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{n.body}</span>
                  <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-ink-400">
                    {fmtAgo(n.at)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="border-t border-brand-100 px-4 py-2.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto w-full justify-center rounded-lg py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50 hover:text-brand-700"
            onClick={() => onNavigate("dashboard")}
          >
            Open dashboard to act on these
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
