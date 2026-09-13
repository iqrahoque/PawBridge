"use client";

import { Coins, Gift, Trophy, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { seedKarma, rewards, personaSeedKarma, PERSONA } from "@/data/seed";
import { usePetCare } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function KarmaScreen() {
  const karmaEarned = usePetCare((s) => s.karmaEarned);
  const karmaLog = usePetCare((s) => s.karmaLog);
  const spendKarma = usePetCare((s) => s.spendKarma);
  const { toast } = useToast();

  const myTotal = personaSeedKarma + karmaEarned;

  const leaderboard = (() => {
    const totals: Record<string, number> = {};
    for (const k of seedKarma) totals[k.userName] = (totals[k.userName] ?? 0) + k.points;
    totals[PERSONA] = (totals[PERSONA] ?? 0) + karmaEarned;
    return Object.entries(totals)
      .map(([name, pts]) => ({ name, pts }))
      .sort((a, b) => b.pts - a.pts);
  })();

  const redeem = (title: string, cost: number) => {
    if (spendKarma(title, cost)) {
      toast({
        title: "Reward redeemed!",
        description: `${title} — voucher PMC-${Math.random().toString(36).slice(2, 6).toUpperCase()} sent to your email. (-${cost} karma)`,
      });
    } else {
      toast({
        title: "Not enough Paw Points",
        description: `You need ${cost - myTotal} more points for "${title}".`,
      });
    }
  };

  return (
    <div>
      {/* Header band */}
      <section className="bg-tint-blue border-b border-brand2-100">
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-6">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-ink-800">
            <Coins className="h-7 w-7 text-brand-600" /> Paw Points ledger
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Donations, adoptions, fostering, transport legs and rescue cases all earn points.
            Redeem them with partner vets and stores, or convert them into shelter meals.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* My karma */}
        <Card className="bg-ink-900 shadow-soft lg:col-span-1">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-white/70">{PERSONA}&apos;s karma balance</p>
            <p className="mt-2 text-5xl font-bold tracking-tight text-white">{myTotal.toLocaleString("en-IN")}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <Badge variant="outline" className="border-white/30 bg-white/10 text-white">
                Adopter
              </Badge>
              <Badge variant="outline" className="border-white/30 bg-white/10 text-white">
                Blood donor family
              </Badge>
              <Badge variant="outline" className="border-white/30 bg-white/10 text-white">
                Found-reporter
              </Badge>
            </div>
            <p className="mt-4 text-xs text-white/60">
              Seeded from the MySQL karma_ledger ({personaSeedKarma} pts) + your demo activity, net
              of redemptions ({karmaEarned >= 0 ? "+" : ""}{karmaEarned} pts).
            </p>

            {karmaLog.length > 0 && (
              <div className="mt-4 max-h-44 space-y-1.5 overflow-y-auto rounded-xl bg-white/10 p-3 scroll-slim">
                {karmaLog.map((l, i) => (
                  <p key={i} className="flex items-center justify-between text-xs">
                    <span className="text-white/80">{l.action}</span>
                    <span className={cn("font-bold", l.points >= 0 ? "text-brand2-300" : "text-danger-300")}>
                      {l.points >= 0 ? "+" : ""}
                      {l.points}
                    </span>
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="shadow-soft lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <Trophy className="h-5 w-5 text-brand-600" /> Community leaderboard
            </h2>
            <div className="mt-4 space-y-2">
              {leaderboard.map((u, i) => (
                <div
                  key={u.name}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-3 transition-colors",
                    u.name === PERSONA ? "border-primary/40 bg-accent" : "bg-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                        i === 0
                          ? "bg-brand-500 text-white"
                          : i === 1
                            ? "bg-ink-300 text-ink-700"
                            : i === 2
                              ? "bg-brand2-200 text-brand2-900"
                              : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold">{u.name}</span>
                    {u.name === PERSONA && (
                      <Badge variant="outline" className="border-brand-300 text-brand-800">
                        you
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {u.pts.toLocaleString("en-IN")} pts
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              = SELECT full_name, SUM(points) FROM karma_ledger JOIN users … GROUP BY user_id
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rewards */}
      <section className="mt-10 mb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Gift className="h-5 w-5 text-primary" /> Rewards catalog
        </h2>
        <p className="text-sm text-muted-foreground">
          Real perks from partner vets and stores. You have {myTotal.toLocaleString("en-IN")} points.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rewards.map((r) => {
            const affordable = myTotal >= r.cost;
            return (
              <Card key={r.id} className="flex flex-col shadow-soft">
                <CardContent className="flex flex-1 flex-col p-5">
                  <p className="font-bold leading-snug">{r.title}</p>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">{r.description}</p>
                  <p className="mt-2 text-xs text-ink-500">{r.partner}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{r.cost} pts</span>
                    <Button
                      size="sm"
                      className="rounded-lg"
                      disabled={!affordable}
                      onClick={() => redeem(r.title, r.cost)}
                    >
                      {affordable ? "Redeem" : `Need ${r.cost - myTotal} more`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Full ledger */}
      <section className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <History className="h-5 w-5 text-primary" /> Impact ledger
        </h2>
        <Card className="mt-4 shadow-soft">
          <CardContent className="max-h-80 overflow-y-auto p-0 scroll-slim">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-secondary">
                <tr className="text-left text-xs uppercase tracking-wide text-ink-500">
                  <th className="px-4 py-2.5 font-semibold">Who</th>
                  <th className="px-4 py-2.5 font-semibold">Deed</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Points</th>
                </tr>
              </thead>
              <tbody>
                {[...karmaLog.map((l) => ({ name: PERSONA, action: l.action, points: l.points })),
                  ...seedKarma.map((k) => ({ name: k.userName, action: k.action, points: k.points }))].map((k, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2.5 font-medium">{k.name}</td>
                    <td className="px-4 py-2.5 text-ink-600">{k.action}</td>
                    <td className={cn("px-4 py-2.5 text-right font-bold", k.points >= 0 ? "text-leaf-700" : "text-danger-600")}>
                      {k.points >= 0 ? "+" : ""}
                      {k.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
      </div>
    </div>
  );
}
