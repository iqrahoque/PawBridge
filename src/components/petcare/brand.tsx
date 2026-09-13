/*
 * PawBridge brand mark — a heart formed by a cat ear (pointed, left)
 * and a dog ear (floppy, right). Single-colour (currentColor) so it
 * works on tiles, footers and the favicon.
 */

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden="true">
      {/* heart */}
      <path d="M32 56 C21 47 9 37 9 25.5 C9 17 15.5 11 23.5 11 C27.2 11 30.2 12.5 32 15 C33.8 12.5 36.8 11 40.5 11 C48.5 11 55 17 55 25.5 C55 37 43 47 32 56 Z" />
      {/* cat ear — pointed, left lobe */}
      <path d="M12.8 16.2 L10.5 4 L24.5 10.2 C20 10.4 15.9 12.6 12.8 16.2 Z" />
      {/* dog ear — floppy, right lobe */}
      <path d="M48.2 13.4 C53.8 8.2 60.4 9.8 60.8 16.2 C61.2 22.4 56 27 50.2 25.8 C52.8 21.8 51.6 16.8 48.2 13.4 Z" />
    </svg>
  );
}

export function BrandTile({ className }: { className?: string }) {
  return (
    <span
      className={`flex items-center justify-center rounded-2xl bg-brand-500 ${className ?? "h-9 w-9"}`}
    >
      <BrandMark className="h-[62%] w-[62%] text-[#fff9f2]" />
    </span>
  );
}
