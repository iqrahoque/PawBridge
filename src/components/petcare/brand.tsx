/*
 * PawBridge brand mark — "Two Hearts, One Home" (Concept A, duo-heart).
 * A line-art cat (left lobe, pointed ears) and a line-art dog (right lobe,
 * round dome + floppy ear) are drawn so their heads form the two halves of
 * a heart, with a mini rescue-red heart floating in the notch above.
 * Vector source of truth: download/pawbridge-logos/concept-a-duo-heart*.svg
 *
 * tone="light" → forest cat + brown dog, for cream/white surfaces
 * tone="dark"  → cream cat + peach dog, for the brown brand tile / footer /
 *                dark surfaces. The rescue-red heart stays constant in both.
 * Echoes the favicon in src/app/layout.tsx and public/logo.svg.
 */

const CAT_HEAD =
  "M60 94C46 82 24 68 20 46C18 34 22 25 29 21L24 4L38 17L48 1L54 17C57.5 20 59.5 26 60 32";
const DOG_HEAD =
  "M60 94C74 82 96 68 100 46C102 34 98 25 91 21C84 15 72 16 67 22C63 26.5 60.8 29 60 32";
const DOG_EAR = "M85 16C96 15 103 25 101 37C99.5 44 92 46 88 41C84.5 36 83.5 25 85 16Z";
const CAT_EYE = "M36 38Q40 43 44 38";
const DOG_EYE = "M76 38Q80 43 84 38";
const CAT_NOSE = "M52 44.5L52 49L56.5 46.75Z";
const DOG_NOSE = "M68 44.5L68 49L63.5 46.75Z";
const MINI_HEART =
  "M60 15.5C58 12.4 54.2 11.2 54.2 8.2C54.2 5.9 56.6 4.9 58.1 6.1C59.1 6.9 59.7 8 60 9C60.3 8 60.9 6.9 61.9 6.1C63.4 4.9 65.8 5.9 65.8 8.2C65.8 11.2 62 12.4 60 15.5Z";

const INKS = {
  light: { cat: "#26332C", dog: "#7B5E3B" }, // forest / brown
  dark: { cat: "#FFF9F2", dog: "#F4C7A1" }, // cream / peach
} as const;
const RED = "#D95C5C";

export function BrandMark({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const ink = INKS[tone];
  return (
    <svg
      viewBox="0 0 120 110"
      fill="none"
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={CAT_HEAD} stroke={ink.cat} />
      <path d={DOG_HEAD} stroke={ink.dog} />
      <path d={DOG_EAR} stroke={ink.dog} />
      <path d={CAT_EYE} stroke={ink.cat} />
      <path d={DOG_EYE} stroke={ink.dog} />
      <path d={CAT_NOSE} fill={ink.cat} />
      <path d={DOG_NOSE} fill={ink.dog} />
      <path d={MINI_HEART} fill={RED} />
    </svg>
  );
}

export function BrandTile({ className }: { className?: string }) {
  // The original Duo Heart badge (Concept A, the one the user approved):
  // cream tile + a hairline warm border so it also reads on the cream canvas,
  // with the full-colour mark (forest cat + brown dog + red heart).
  return (
    <span
      className={`flex items-center justify-center rounded-2xl border border-brand2-200 bg-[#fff9f2] shadow-soft ${className ?? "h-9 w-9"}`}
    >
      <BrandMark tone="light" className="h-[68%] w-[68%]" />
    </span>
  );
}
