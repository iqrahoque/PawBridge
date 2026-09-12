/**
 * Generates realistic donation + karma seed data for PetCare.
 * Replaces the "2 donors giving 60k" dataset with ~150 small,
 * believable donations from many donors across all 4 campaigns.
 *
 * Outputs:
 *   scripts/out/donations.ts  → spliced into src/data/seed.ts
 *   scripts/out/karma.ts      → spliced into src/data/seed.ts
 *   scripts/out/donations.sql.detail → spliced into database/seed_data.sql
 *
 * Deterministic: mulberry32 PRNG with fixed seed.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = fileURLToPath(new URL(".", import.meta.url));

/* ---------------- PRNG ---------------- */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(42);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const randInt = (min, max) => min + Math.floor(rnd() * (max - min + 1));

/* ---------------- Config ---------------- */
const TODAY = "2026-09-12";

// Campaign windows + realistic targets (BDT)
const CAMPAIGNS = {
  1: { start: "2025-11-05", end: TODAY, target: 117850, count: 66 },       // Max surgery — 78%
  2: { start: "2026-02-01", end: "2026-03-15", target: 61450, count: 45 }, // Pihu ICU — 102% completed
  3: { start: "2026-09-01", end: TODAY, target: 16300, count: 24 },        // Blanket drive — 33% (12 days in)
  4: { start: "2026-09-10", end: TODAY, target: 9850, count: 14 },         // Vaccine drive — 12% (2 days in)
};

// Registered donors (web name ↔ SQL user id). SQL users 7–12 already exist.
const REGISTERED = [
  { name: "Tanvir Ahmed", uid: 8, style: "monthly" },
  { name: "Mitu Akter", uid: 9, style: "monthly" },
  { name: "Jenny Fernandes", uid: 10, style: "occasional" },
  { name: "Rashed Karim", uid: 11, style: "occasional" },
  { name: "Farhana Yasmin", uid: 12, style: "generous" },
  // NOTE: Sara Chowdhury (uid 7) = demo persona → excluded, she adopted instead
];
// New community donors → SQL users 13–28 (adopter role)
const COMMUNITY = [
  "Nafis Rahman", "Priya Das", "Shakib Al Hasan", "Nusrat Ema", "Imran Hossain",
  "Tahsin Khan", "Rumana Malik", "Arif Chowdhury", "Sumaiya Haque", "Kabir Andalib",
  "Lubna Mariam", "Zubair Rahman", "Anika Tabassum", "Sajid Bappi", "Mehjabin Karim",
  "Chowdhury family",
];
// org-style one-offs mapped to a community donor in SQL (kept as named donor on web)
const ORGS = ["PawMart Dhanmondi", "UIU Rotaract Club", "Gulshan Book Club"];

const AMOUNT_BUCKETS = [
  { amounts: [50, 100, 100, 150, 200, 200, 250, 300], w: 34 },          // everyday kindness
  { amounts: [300, 400, 500, 500, 500, 600, 750, 800, 1000], w: 34 },   // the standard gift
  { amounts: [1000, 1200, 1500, 1500, 2000, 2500], w: 22 },             // engaged supporters
  { amounts: [3000, 4000, 5000], w: 8 },                                // deeper pockets
  { amounts: [5000, 7500], w: 2 },                                      // rare large gift
];
function amountFor(style) {
  const bias = { monthly: 0.75, occasional: 1, generous: 1.6 }[style] ?? 1;
  const total = AMOUNT_BUCKETS.reduce((s, b) => s + b.w, 0);
  let r = rnd() * total;
  for (const b of AMOUNT_BUCKETS) {
    r -= b.w;
    if (r <= 0) {
      let a = pick(b.amounts);
      if (bias !== 1) a = Math.round((a * bias) / 50) * 50;
      return Math.min(7500, Math.max(50, a));
    }
  }
  return 500;
}

const METHODS = ["bkash", "bkash", "bkash", "bkash", "nagad", "nagad", "card", "bank", "cash"];
const GENERIC_MSGS = [
  "Sorry I can't give more this month",
  "Keep up the amazing work", "Wish I could adopt right now — here's something instead",
  "From me and my cat Milo", "Shared with my office group chat", "Small help from a student",
  "Every little bit counts", "Go team PetCare!",
  "Healing vibes", "My family's monthly pledge",
  "Prayers and taka, both sent", "Found you through the Insta page", "Long-time lurker, first-time donor",
  "Please post more updates", "This platform is a blessing",
  "Salute to the volunteers",
  "Donated on behalf of my students",
];
const CAMPAIGN_MSGS = {
  1: ["Get well soon, Max!", "Max deserves the best", "In memory of my late Tommy", "For Max's surgery — go buddy!"],
  2: ["For Pihu's ICU bill", "Save the little fighter!", "Pihu, you owe me nine lives", "ICU bills are brutal — hang in there"],
  3: ["For the streeties this winter", "The blanket drive is such a good idea", "Ten blankets from me", "Stay warm, streeties"],
  4: ["For the vaccine drive — protect them all", "Rabies shots save lives", "Five dogs vaccinated with this!", "Happy birthday Rani!"],
};
const pickMsg = (cid) => (rnd() < 0.35 && CAMPAIGN_MSGS[cid] ? pick(CAMPAIGN_MSGS[cid]) : rnd() < 0.55 ? pick(GENERIC_MSGS) : "");

function randomDateBetween(start, end) {
  const s = new Date(start + "T10:00:00").getTime();
  const e = new Date(end + "T20:00:00").getTime();
  return new Date(s + rnd() * (e - s));
}
const isoDate = (d) => d.toISOString().slice(0, 10);

/* ---------------- Generate ---------------- */
const donations = [];

for (const [cidStr, cfg] of Object.entries(CAMPAIGNS)) {
  const cid = Number(cidStr);
  const gifts = [];

  // Repeat donors: monthly donors give across the whole window
  for (const reg of REGISTERED) {
    let d = new Date(cfg.start + "T10:00:00");
    d.setDate(d.getDate() + randInt(1, 8));
    const freq = reg.style === "monthly" ? 30 : reg.style === "generous" ? 40 : 75;
    while (d <= new Date(cfg.end + "T20:00:00")) {
      gifts.push({
        donorName: reg.name, uid: reg.uid, anonymous: false,
        amount: amountFor(reg.style),
        method: pick(METHODS), ts: new Date(d),
        message: pickMsg(cid),
      });
      d.setDate(d.getDate() + freq + randInt(-6, 6));
    }
  }

  // One-time community donors to fill up to count
  const pool = [...COMMUNITY, ...ORGS, ...COMMUNITY];
  let oneTimers = cfg.count - gifts.length;
  const used = new Set();
  let guard = 0;
  while (oneTimers > 0 && guard < 300) {
    guard++;
    const name = pick(pool);
    if (used.has(name)) continue;
    used.add(name);
    oneTimers--;
    gifts.push({
      donorName: name, uid: null, anonymous: rnd() < 0.14,
      amount: amountFor("occasional"),
      method: pick(METHODS), ts: randomDateBetween(cfg.start, cfg.end),
      message: pickMsg(cid),
    });
  }

  // Top-up to hit the target
  let sum = gifts.reduce((s, g) => s + g.amount, 0);
  let extraId = 0;
  while (sum < cfg.target - 400) {
    const gap = cfg.target - sum;
    const a = Math.min(gap, 3000, Math.max(200, Math.round(gap / 3 / 50) * 50));
    const anon = rnd() < 0.3;
    gifts.push({
      donorName: anon ? null : pick(COMMUNITY),
      uid: null, anonymous: anon,
      amount: a, method: pick(METHODS),
      ts: randomDateBetween(cfg.start, cfg.end),
      message: pickMsg(cid),
    });
    sum += a;
    extraId++;
  }
  if (sum > cfg.target + 400) {
    gifts.sort((a, b) => b.amount - a.amount);
    for (const g of gifts) {
      if (sum <= cfg.target + 400) break;
      const cut = Math.min(g.amount - 50, sum - cfg.target);
      if (cut > 0) { g.amount -= Math.floor(cut / 50) * 50; sum = gifts.reduce((s, x) => s + x.amount, 0); }
    }
  }

  for (const g of gifts) {
    donations.push({
      campaignId: cid, donorName: g.anonymous ? null : g.donorName,
      uid: g.anonymous ? null : g.uid, anonymous: g.anonymous,
      amount: g.amount, message: (g.message ?? "").trim(),
      method: g.method, ts: g.ts, date: isoDate(g.ts),
    });
  }
}

// sort by date, assign ids (SQL insert order = chronological)
donations.sort((a, b) => a.ts - b.ts);
donations.forEach((d, i) => (d.id = i + 1));

/* ---------------- Karma ---------------- */
const CAMPAIGN_SHORT = { 1: "Max's surgery fund", 2: "Pihu ICU fund", 3: "Winter blanket drive", 4: "Ramna vaccine drive" };
const SPECIAL_KARMA = [
  { name: "Tanvir Ahmed", action: "Vet clinic review", points: 10, date: "2026-08-01" },
  { name: "Mitu Akter", action: "Registered Milky as blood donor", points: 50, date: "2026-06-01" },
  { name: "Jenny Fernandes", action: "Registered Rex as blood donor", points: 50, date: "2026-05-15" },
  { name: "Jenny Fernandes", action: "Found & reported orange tabby", points: 100, date: "2026-08-30" },
  { name: "Sara Chowdhury", action: "Adopted Mishti", points: 200, date: "2026-08-20" },
  { name: "Sara Chowdhury", action: "Vet clinic review", points: 10, date: "2026-08-25" },
];

const seedKarma = donations
  .filter((d) => d.donorName) // anonymous gifts stay anonymous in the ledger
  .map((d) => ({
    name: d.donorName, campaignId: d.campaignId, points: Math.max(1, Math.round(d.amount / 100)), date: d.date,
  }))
  .concat(SPECIAL_KARMA.map((k) => ({ ...k, campaignId: null })));

/* ---------------- Emit TS ---------------- */
const tsDonations = donations.map((d) =>
  `  { id: ${d.id}, campaignId: ${d.campaignId}, donorName: ${d.donorName ? JSON.stringify(d.donorName) : "null"}, amount: ${d.amount},${d.message ? ` message: ${JSON.stringify(d.message)},` : ""} method: ${JSON.stringify(d.method)}, date: ${JSON.stringify(d.date)} },`
).join("\n");

const tsKarma = seedKarma.map((k) =>
  `  { userName: ${JSON.stringify(k.name)}, action: ${JSON.stringify(k.campaignId ? `Donation — ${CAMPAIGN_SHORT[k.campaignId]}` : k.action)}, points: ${k.points}, date: ${JSON.stringify(k.date)} },`
).join("\n");

mkdirSync(join(DIR, "out"), { recursive: true });
writeFileSync(join(DIR, "out", "donations.ts"), `\nexport const seedDonations: SeedDonation[] = [\n${tsDonations}\n];\n`);
writeFileSync(join(DIR, "out", "karma.ts"), `\nexport const seedKarma: KarmaEntry[] = [\n${tsKarma}\n];\n`);

/* ---------------- Emit SQL ---------------- */
const allNames = [...COMMUNITY, ...ORGS];
const sqlUsers = allNames.map((name, i) => {
  const uid = 13 + i;
  const email = name.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "").slice(0, 28) + "@gmail.com";
  return `(${uid}, '${email}', '$2y$10$ChangeMeViaAppRegistration', 'adopter', '${name.replace(/'/g, "''")}', '+88018${String(10000000 + uid).slice(0, 8)}', 'Dhaka')`;
}).join(",\n");

const sqlDonations = donations.map((d) => {
  let uid = null;
  if (d.donorName) {
    const reg = REGISTERED.find((r) => r.name === d.donorName);
    uid = reg ? reg.uid : 13 + allNames.indexOf(d.donorName);
  }
  const ts = d.date + " " + String(randInt(8, 21)).padStart(2, "0") + ":" + String(randInt(0, 59)).padStart(2, "0") + ":00";
  return `(${d.campaignId}, ${uid ?? "NULL"}, ${d.amount.toFixed(2)}, ${d.message ? `'${d.message.replace(/'/g, "''")}'` : "NULL"}, ${d.anonymous ? "TRUE" : "FALSE"}, '${d.method}')${""}, -- #${d.id} ${d.date}${d.anonymous ? " anon" : " · " + d.donorName}`;
}).join("\n");

const sqlKarma =
  seedKarma
    .filter((k) => k.campaignId !== null)
    .map((k) => {
      const reg = REGISTERED.find((r) => r.name === k.name);
      const uid = reg ? reg.uid : 13 + allNames.indexOf(k.name);
      return `(${uid}, 'donation', 'donations', NULL, ${k.points}, '${CAMPAIGN_SHORT[k.campaignId]}'), -- ${k.name} ${k.date}`;
    })
    .join("\n") +
  "\n" +
  SPECIAL_KARMA.map((k) => {
    const reg = REGISTERED.find((r) => r.name === k.name);
    const uid = reg ? reg.uid : 7;
    const type = k.action.includes("review") ? "review" : k.action.includes("blood") ? "blood_donation" : k.action.includes("found") ? "lost_found_help" : "adoption";
    return `(${uid}, '${type}', NULL, NULL, ${k.points}, '${k.action}') -- ${k.date}`;
  }).join(",\n") + ";";

writeFileSync(
  join(DIR, "out", "donations.sql.detail"),
  `INSERT_USERS\n${sqlUsers}\n\nINSERT_DONATIONS\n${sqlDonations}\n\nINSERT_KARMA\n${sqlKarma}\n`
);

/* ---------------- Summary ---------------- */
const sum = (cid) => donations.filter((d) => d.campaignId === cid).reduce((s, d) => s + d.amount, 0);
const cnt = (cid) => donations.filter((d) => d.campaignId === cid).length;
const goals = { 1: 150000, 2: 60000, 3: 50000, 4: 80000 };
console.log("Generated", donations.length, "donations, total ৳" + donations.reduce((s, d) => s + d.amount, 0).toLocaleString("en-IN"));
for (const cid of [1, 2, 3, 4]) {
  console.log(`  C${cid}: ${cnt(cid)} donors · ৳${sum(cid).toLocaleString("en-IN")} / ৳${goals[cid].toLocaleString("en-IN")} (${Math.round((sum(cid) / goals[cid]) * 100)}%)`);
}
console.log("  Largest single gift: ৳" + Math.max(...donations.map((d) => d.amount)).toLocaleString("en-IN"));
console.log("  Unique named donors:", new Set(donations.filter((d) => d.donorName).map((d) => d.donorName)).size);
console.log("  Karma ledger rows:", seedKarma.length);
