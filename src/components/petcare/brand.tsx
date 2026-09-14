/*
 * PawBridge brand mark — "The Paw Face" (Concept B, butter-yellow edition).
 * One lavender cat ear + one butter-yellow dog ear around a line-art paw.
 *
 * tone="light" → strokes follow currentColor (recolor with text-* utilities)
 * tone="dark"  → cream strokes, for the brown brand tile / footer / dark surfaces
 * Pastel ear fills stay constant in both tones. Echoes the favicon in
 * src/app/layout.tsx and the badge in download/pawbridge-logos/.
 */

const EAR_CAT = "M27 40C21 29 21 16 26 7C34 11 41 18 45 27C39 32 33 36 27 40Z";
const EAR_DOG = "M93 40C99 29 99 16 94 7C86 11 79 18 75 27C81 32 87 36 93 40Z";
const PAD =
  "M60 58C70 58 80 63 80 71C80 79.5 71 85.5 60 85.5C49 85.5 40 79.5 40 71C40 63 50 58 60 58Z";
const TOES = [
  { cx: 35, cy: 53, rx: 7, ry: 9.5, rot: -18 },
  { cx: 49, cy: 45, rx: 7.2, ry: 10, rot: -6 },
  { cx: 71, cy: 45, rx: 7.2, ry: 10, rot: 6 },
  { cx: 85, cy: 53, rx: 7, ry: 9.5, rot: 18 },
];
const LAVENDER = "#E9E1F3"; // cat ear
const BUTTER = "#F9E7A0"; // dog ear — butter yellow (user-selected)

export function BrandMark({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <svg
      viewBox="0 0 120 105"
      fill="none"
      stroke={tone === "dark" ? "#FFF9F2" : "currentColor"}
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={EAR_CAT} fill={LAVENDER} />
      <path d={EAR_DOG} fill={BUTTER} />
      {TOES.map((t, i) => (
        <ellipse
          key={i}
          cx={t.cx}
          cy={t.cy}
          rx={t.rx}
          ry={t.ry}
          transform={`rotate(${t.rot} ${t.cx} ${t.cy})`}
        />
      ))}
      <path d={PAD} />
    </svg>
  );
}

export function BrandTile({ className }: { className?: string }) {
  return (
    <span
      className={`flex items-center justify-center rounded-2xl bg-brand-500 ${className ?? "h-9 w-9"}`}
    >
      <BrandMark tone="dark" className="h-[68%] w-[68%]" />
    </span>
  );
}
