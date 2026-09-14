import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

/* Design system v6: Plus Jakarta Sans (headings) + Inter (body), self-hosted at build. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Favicon: PawBridge "Paw Face" mark (cat ear lavender + dog ear butter) on the
   brand-brown tile — matches src/components/petcare/brand.tsx (Concept B). */
const PAW_ICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#7b5e3b"/><g transform="translate(6.1 9.3) scale(0.432)" fill="none" stroke="#fff9f2" stroke-linecap="round" stroke-linejoin="round"><path d="M27 40C21 29 21 16 26 7C34 11 41 18 45 27C39 32 33 36 27 40Z" fill="#E9E1F3" stroke-width="4.5"/><path d="M93 40C99 29 99 16 94 7C86 11 79 18 75 27C81 32 87 36 93 40Z" fill="#F9E7A0" stroke-width="4.5"/><ellipse cx="35" cy="53" rx="7" ry="9.5" transform="rotate(-18 35 53)" stroke-width="6"/><ellipse cx="49" cy="45" rx="7.2" ry="10" transform="rotate(-6 49 45)" stroke-width="6"/><ellipse cx="71" cy="45" rx="7.2" ry="10" transform="rotate(6 71 45)" stroke-width="6"/><ellipse cx="85" cy="53" rx="7" ry="9.5" transform="rotate(18 85 53)" stroke-width="6"/><path d="M60 58C70 58 80 63 80 71C80 79.5 71 85.5 60 85.5C49 85.5 40 79.5 40 71C40 63 50 58 60 58Z" stroke-width="6"/></g></svg>`
  );

export const metadata: Metadata = {
  title: "PawBridge — pet adoption, donations and vet care in Dhaka",
  description:
    "Helping Dhaka's streeties find homes, treatment and safety — adoption from verified shelters, a pet blood bank, an emergency rescue network and Paw Points for good deeds.",
  keywords: ["pet adoption", "donations", "veterinary", "animal welfare", "Dhaka", "database project"],
  authors: [{ name: "Iqra Hoque" }],
  icons: { icon: PAW_ICON },
  openGraph: {
    title: "PawBridge — pet adoption, donations and vet care in Dhaka",
    description: "Connect adopters, shelters, vets and donors. Help dogs & cats find homes, funds and care.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#7b5e3b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
