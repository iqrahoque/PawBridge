"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Heart, Droplets, MapPin, Smartphone, CreditCard, Banknote, Siren } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePetCare } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { bdt, campaigns, type Pet, type Species, type RescueSituation } from "@/data/seed";
import { seedDonations } from "@/data/seed";
import { PetPhoto } from "./cards";

/* ------------------------------------------------------------------ */
/* Adopt dialog (M1)                                                   */
/* ------------------------------------------------------------------ */

export function AdoptDialog({ pet, open, onClose }: { pet: Pet; open: boolean; onClose: () => void }) {
  const addApplication = usePetCare((s) => s.addApplication);
  const { toast } = useToast();
  const [name, setName] = useState("Sara Chowdhury");
  const [homeType, setHomeType] = useState("apartment");
  const [experience, setExperience] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  // Fresh form every time the dialog opens (component itself stays mounted).
  // Render-time state adjustment — the pattern recommended over useEffect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDone(false);
  }

  const submit = () => {
    if (!name.trim() || !message.trim()) {
      toast({ title: "Almost there", description: "Please add your name and a short message to the shelter." });
      return;
    }
    addApplication({
      petId: pet.id,
      applicant: name.trim(),
      homeType: homeType === "apartment" ? "Apartment" : homeType === "house" ? "House with yard" : "Farm",
      experience,
      message: message.trim(),
    });
    setDone(true);
    toast({
      title: "Application submitted",
      description: `${pet.name}'s shelter will review it. Track the status in your Dashboard. (+25 karma)`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" /> Adoption application — {pet.name}
          </DialogTitle>
          <DialogDescription>
            Goes straight to {pet.name}&apos;s shelter. You can track its status in your dashboard.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-leaf-600" />
            <p className="font-semibold">Application sent!</p>
            <p className="text-sm text-muted-foreground">
              {pet.name} is now marked <strong>pending</strong> while the shelter reviews your
              application — exactly what the <code className="text-xs">trg_application_after_insert</code>{" "}
              trigger does in MySQL.
            </p>
            <Button onClick={onClose}>Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-secondary p-3">
              <PetPhoto pet={pet} className="h-16 w-16 shrink-0 rounded-full" sizes="64px" />
              <div>
                <p className="font-semibold">{pet.name}</p>
                <p className="text-xs text-muted-foreground">{pet.breed}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adopt-name">Your name</Label>
              <Input id="adopt-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            </div>

            <div className="space-y-1.5">
              <Label>Your home</Label>
              <RadioGroup value={homeType} onValueChange={setHomeType} className="flex gap-2">
                {[
                  { v: "apartment", l: "Apartment" },
                  { v: "house", l: "House + yard" },
                  { v: "farm", l: "Farm" },
                ].map((o) => (
                  <Label
                    key={o.v}
                    className={cn(
                      "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors",
                      homeType === o.v ? "border-primary bg-accent text-accent-foreground" : "hover:bg-secondary"
                    )}
                  >
                    <RadioGroupItem value={o.v} className="sr-only" />
                    {o.l}
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={experience}
                onChange={(e) => setExperience(e.target.checked)}
                className="h-4 w-4 accent-[#06a2be]"
              />
              I have experience caring for pets
            </label>

            <div className="space-y-1.5">
              <Label htmlFor="adopt-msg">Why {pet.name}?</Label>
              <Textarea
                id="adopt-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell the shelter about your home, routine and family…"
                rows={3}
              />
            </div>

            <Button onClick={submit} className="w-full">
              Submit application
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Donate dialog (M2)                                                  */
/* ------------------------------------------------------------------ */

const QUICK = [500, 1000, 2500, 5000];

export function DonateDialog({
  campaignId,
  open,
  onClose,
}: {
  campaignId: number;
  open: boolean;
  onClose: () => void;
}) {
  const campaign = campaigns.find((c) => c.id === campaignId)!;
  const addDonation = usePetCare((s) => s.addDonation);
  const myDonations = usePetCare((s) => s.donations);
  const { toast } = useToast();

  const [amount, setAmount] = useState<number>(1000);
  const [custom, setCustom] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [method, setMethod] = useState<"bkash" | "nagad" | "card" | "bank" | "cash">("bkash");
  const [done, setDone] = useState(false);

  // Fresh form every time the dialog opens (component itself stays mounted)
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDone(false);
  }

  const seedRaised = useMemo(
    () => seedDonations.filter((d) => d.campaignId === campaignId).reduce((s, d) => s + d.amount, 0),
    [campaignId]
  );
  const myRaised = myDonations
    .filter((d) => d.campaignId === campaignId)
    .reduce((s, d) => s + d.amount, 0);
  const raised = seedRaised + myRaised; // store already includes the new donation
  const pct = Math.min(100, Math.round((raised / campaign.goal) * 100));

  const submit = () => {
    const value = custom ? Number(custom) : amount;
    if (!value || value < 10) {
      toast({ title: "Enter an amount", description: "Minimum donation is ৳10." });
      return;
    }
    addDonation({
      campaignId,
      amount: value,
      donorName: anonymous ? null : "Sara Chowdhury",
      anonymous,
      message: message.trim(),
      method,
    });
    setAmount(value);
    setDone(true);
    toast({
      title: `৳${value.toLocaleString("en-IN")} donated — thank you!`,
      description: `+${Math.max(1, Math.round(value / 100))} karma points added to your ledger.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{done ? "You did it!" : `Donate to ${campaign.title}`}</DialogTitle>
          <DialogDescription>
            {done
              ? "Your donation is recorded and the progress bar just moved — that's the trigger updating raised_amount."
              : "Demo payment — no real money moves. Progress updates live."}
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="space-y-4 py-2">
            <div className="flex flex-col items-center gap-2 text-center">
              <CheckCircle2 className="h-12 w-12 text-leaf-600" />
              <p className="text-sm text-muted-foreground">{campaign.title}</p>
            </div>
            <Progress value={pct} className="h-3" />
            <p className="text-center text-sm font-semibold">
              {bdt(raised)} <span className="text-muted-foreground">of {bdt(campaign.goal)} · {pct}%</span>
            </p>
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setAmount(q);
                    setCustom("");
                  }}
                  className={cn(
                    "rounded-xl border py-2 text-sm font-semibold transition-colors cursor-pointer",
                    amount === q && !custom
                      ? "border-primary bg-accent text-accent-foreground"
                      : "hover:bg-secondary"
                  )}
                >
                  ৳{q.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="don-custom">Custom amount (৳)</Label>
              <Input
                id="don-custom"
                type="number"
                min={10}
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="e.g. 750"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Payment method</Label>
              <RadioGroup
                value={method}
                onValueChange={(v) => setMethod(v as typeof method)}
                className="grid grid-cols-2 gap-2"
              >
                {[
                  { v: "bkash", l: "bKash", Icon: Smartphone },
                  { v: "nagad", l: "Nagad", Icon: Smartphone },
                  { v: "card", l: "Card", Icon: CreditCard },
                  { v: "cash", l: "Cash", Icon: Banknote },
                ].map(({ v, l, Icon }) => (
                  <Label
                    key={v}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors",
                      method === v ? "border-primary bg-accent text-accent-foreground" : "hover:bg-secondary"
                    )}
                  >
                    <RadioGroupItem value={v} className="sr-only" />
                    <Icon className="h-4 w-4" /> {l}
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="don-msg">Message (optional)</Label>
              <Input
                id="don-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="A few words on the donor wall…"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="don-anon" className="text-sm">
                Donate anonymously
              </Label>
              <Switch id="don-anon" checked={anonymous} onCheckedChange={setAnonymous} />
            </div>
            <Button onClick={submit} className="w-full">
              Give {bdt(custom ? Number(custom) || 0 : amount)}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Blood donor registration (U1)                                       */
/* ------------------------------------------------------------------ */

const DOG_TYPES = ["DEA 1.1+", "DEA 1.1-"];
const CAT_TYPES = ["A", "B", "AB"];

export function DonorRegDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addDonor = usePetCare((s) => s.addDonor);
  const { toast } = useToast();
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState<Species>("dog");
  const [bloodType, setBloodType] = useState("DEA 1.1-");
  const [weight, setWeight] = useState("");

  const submit = () => {
    const w = Number(weight);
    if (!petName.trim() || !w) {
      toast({ title: "Missing details", description: "Pet name and weight are required." });
      return;
    }
    const minW = species === "dog" ? 20 : 4;
    if (w < minW) {
      toast({
        title: "Below donor weight",
        description: `${species === "dog" ? "Dogs" : "Cats"} need at least ${minW}kg to donate safely.`,
      });
      return;
    }
    addDonor({
      ownerName: "Sara Chowdhury",
      petName: petName.trim(),
      species,
      bloodType,
      weightKg: w,
      lastDonation: null,
      active: true,
    });
    toast({
      title: `${petName} is on the donor list!`,
      description: "Nearby clinics can now see them for urgent requests. (+50 karma)",
    });
    setPetName("");
    setWeight("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-danger-600" /> Register a blood donor
          </DialogTitle>
          <DialogDescription>
            Healthy, vaccinated pets can save lives. Dogs: min 20kg · Cats: min 4kg.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bd-name">Pet name</Label>
            <Input id="bd-name" value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="e.g. Bruno" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Species</Label>
              <RadioGroup
                value={species}
                onValueChange={(v) => {
                  setSpecies(v as Species);
                  setBloodType(v === "dog" ? "DEA 1.1-" : "A");
                }}
                className="flex gap-2"
              >
                {["dog", "cat"].map((s) => (
                  <Label
                    key={s}
                    className={cn(
                      "flex flex-1 cursor-pointer items-center justify-center rounded-xl border p-2.5 text-sm font-medium capitalize transition-colors",
                      species === s ? "border-primary bg-accent text-accent-foreground" : "hover:bg-secondary"
                    )}
                  >
                    <RadioGroupItem value={s} className="sr-only" />
                    {s}
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bd-weight">Weight (kg)</Label>
              <Input
                id="bd-weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="28"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Blood type</Label>
            <RadioGroup value={bloodType} onValueChange={setBloodType} className="flex flex-wrap gap-2">
              {(species === "dog" ? DOG_TYPES : CAT_TYPES).map((t) => (
                <Label
                  key={t}
                  className={cn(
                    "cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                    bloodType === t ? "border-primary bg-accent text-accent-foreground" : "hover:bg-secondary"
                  )}
                >
                  <RadioGroupItem value={t} className="sr-only" />
                  {t}
                </Label>
              ))}
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              {species === "dog"
                ? "Dogs have DEA blood types — DEA 1.1− is the universal donor."
                : "Cats have A, B and AB types — type A is most common."}
            </p>
          </div>
          <Button onClick={submit} className="w-full">
            Join the donor registry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Lost / Found report (U2)                                            */
/* ------------------------------------------------------------------ */

export function ReportDialog({
  kind,
  open,
  onClose,
}: {
  kind: "lost" | "found";
  open: boolean;
  onClose: () => void;
}) {
  const addLost = usePetCare((s) => s.addLostReport);
  const addFound = usePetCare((s) => s.addFoundReport);
  const { toast } = useToast();
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState<Species>("dog");
  const [color, setColor] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");

  const submit = () => {
    if (!area.trim() || !color.trim()) {
      toast({ title: "Missing details", description: "Area and color help matching — please fill them." });
      return;
    }
    if (kind === "lost") {
      addLost({
        by: "Sara Chowdhury",
        petName: petName.trim() || "Unknown",
        species,
        color: color.trim(),
        area: area.trim(),
        description: description.trim(),
        lostOn: new Date().toISOString().slice(0, 10),
      });
      toast({ title: "Lost report filed", description: "We'll alert you when a matching found report appears." });
    } else {
      addFound({
        by: "Sara Chowdhury",
        species,
        color: color.trim(),
        area: area.trim(),
        description: description.trim(),
        foundOn: new Date().toISOString().slice(0, 10),
      });
      toast({ title: "Found report filed", description: "The matching engine will compare it with lost pets. (+100 karma)" });
    }
    setPetName("");
    setColor("");
    setArea("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> {kind === "lost" ? "File a lost report" : "File a found report"}
          </DialogTitle>
          <DialogDescription>
            {kind === "lost"
              ? "More detail = better automatic matching against found reports."
              : "Thanks for helping! Anywhere reports are matched against lost pets automatically."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rf-name">{kind === "lost" ? "Pet name" : "Pet name (if known)"}</Label>
              <Input id="rf-name" value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="e.g. Simba" />
            </div>
            <div className="space-y-1.5">
              <Label>Species</Label>
              <RadioGroup value={species} onValueChange={(v) => setSpecies(v as Species)} className="flex gap-2">
                {["dog", "cat"].map((s) => (
                  <Label
                    key={s}
                    className={cn(
                      "flex flex-1 cursor-pointer items-center justify-center rounded-xl border p-2.5 text-sm font-medium capitalize transition-colors",
                      species === s ? "border-primary bg-accent text-accent-foreground" : "hover:bg-secondary"
                    )}
                  >
                    <RadioGroupItem value={s} className="sr-only" />
                    {s}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rf-color">Color / markings</Label>
              <Input id="rf-color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="orange tabby" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rf-area">{kind === "lost" ? "Last seen area" : "Found area"}</Label>
              <Input id="rf-area" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Dhanmondi 27" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rf-desc">Description</Label>
            <Textarea
              id="rf-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Collar? Microchip? Personality? Anything helps."
            />
          </div>
          <Button onClick={submit} className="w-full">
            {kind === "lost" ? "File lost report" : "File found report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Rescue alert (U9 — Community Rescue Network)                        */
/* ------------------------------------------------------------------ */

const RESCUE_SITUATIONS: { v: RescueSituation; label: string }[] = [
  { v: "stuck_trapped", label: "Stuck / trapped" },
  { v: "injured", label: "Injured / sick" },
  { v: "road_accident", label: "Road accident" },
  { v: "drowning_risk", label: "Drowning risk" },
  { v: "abandoned", label: "Abandoned litter" },
  { v: "abuse_neglect", label: "Abuse / neglect" },
  { v: "other", label: "Other" },
];

export function RescueDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addRescueReport = usePetCare((s) => s.addRescueReport);
  const { toast } = useToast();
  const [species, setSpecies] = useState<"dog" | "cat" | "other">("cat");
  const [situation, setSituation] = useState<RescueSituation>("stuck_trapped");
  const [urgency, setUrgency] = useState<"critical" | "urgent" | "standard">("urgent");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");

  const submit = () => {
    if (!area.trim() || description.trim().length < 10) {
      toast({
        title: "A bit more detail needed",
        description: "Location and a clear description (10+ chars) help responders find the animal fast.",
      });
      return;
    }
    addRescueReport({
      reporter: "Sara Chowdhury",
      species,
      situation,
      urgency,
      area: area.trim(),
      description: description.trim(),
    });
    toast({
      title: "Rescue alert posted",
      description:
        "Volunteers near the area have been notified. You'll get karma as the case progresses.",
    });
    setArea("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Siren className="h-5 w-5 text-danger-600" /> Report an animal in danger
          </DialogTitle>
          <DialogDescription>
            Be as precise as you can — exact spot, landmark and what you see. Responders will
            coordinate through the alert.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {(["cat", "dog", "other"] as const).map((s) => (
              <Label
                key={s}
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border p-2.5 text-sm font-medium capitalize transition-colors",
                  species === s ? "border-primary bg-accent text-accent-foreground" : "hover:bg-secondary"
                )}
              >
                <input
                  type="radio"
                  className="sr-only"
                  checked={species === s}
                  onChange={() => setSpecies(s)}
                />
                {s === "cat" ? "Cat" : s === "dog" ? "Dog" : "Other"}
              </Label>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label>What&apos;s happening?</Label>
            <div className="grid grid-cols-2 gap-2">
              {RESCUE_SITUATIONS.map((s) => (
                <Label
                  key={s.v}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 text-sm font-medium transition-colors",
                    situation === s.v ? "border-primary bg-accent text-accent-foreground" : "hover:bg-secondary"
                  )}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={situation === s.v}
                    onChange={() => setSituation(s.v)}
                  />
                  {s.label}
                </Label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>How urgent is it?</Label>
            <RadioGroup
              value={urgency}
              onValueChange={(v) => setUrgency(v as typeof urgency)}
              className="grid grid-cols-3 gap-2"
            >
              {[
                { v: "critical", l: "Critical", d: "life at risk now" },
                { v: "urgent", l: "Urgent", d: "needs help today" },
                { v: "standard", l: "Standard", d: "this week" },
              ].map((o) => (
                <Label
                  key={o.v}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-0.5 rounded-xl border p-2.5 text-center transition-colors",
                    urgency === o.v
                      ? o.v === "critical"
                        ? "border-danger-400 bg-danger-50 text-danger-800"
                        : "border-primary bg-accent text-accent-foreground"
                      : "hover:bg-secondary"
                  )}
                >
                  <RadioGroupItem value={o.v} className="sr-only" />
                  <span className="text-sm font-bold">{o.l}</span>
                  <span className="text-[10px] text-muted-foreground">{o.d}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="res-area">Exact location / landmark</Label>
            <Input
              id="res-area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Mirpur 10 roundabout, beside Burger King, 3rd storm drain"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="res-desc">Describe what you see</Label>
            <Textarea
              id="res-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Colour, size, condition, is it reachable, is water rising, anything that helps…"
            />
          </div>

          <div className="rounded-xl bg-brand2-50 border border-brand2-200 p-3 text-xs text-brand2-900">
            In a life-threatening emergency also call the 24h vet line:{" "}
            <strong>+880 2 900 0002</strong>. Never put yourself in danger — responders have the gear.
          </div>

          <Button onClick={submit} className="w-full">
            <Siren className="h-4 w-4" /> Post rescue alert (+50 karma)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
