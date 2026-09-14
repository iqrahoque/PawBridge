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

/* Favicon: PawBridge "Two Hearts, One Home" duo-heart mark (cream cat + peach
   dog forming a heart, mini red heart above) on the brand-brown tile — matches
   src/components/petcare/brand.tsx (Concept A) and the badge@512 asset. */
const PAW_ICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#7b5e3b"/><svg x="7.8" y="9.8" width="48.5" height="44.4" viewBox="0 0 120 110" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M60 94C46 82 24 68 20 46C18 34 22 25 29 21L24 4L38 17L48 1L54 17C57.5 20 59.5 26 60 32" stroke="#fff9f2" stroke-width="6"/><path d="M60 94C74 82 96 68 100 46C102 34 98 25 91 21C84 15 72 16 67 22C63 26.5 60.8 29 60 32" stroke="#F4C7A1" stroke-width="6"/><path d="M85 16C96 15 103 25 101 37C99.5 44 92 46 88 41C84.5 36 83.5 25 85 16Z" stroke="#F4C7A1" stroke-width="5.5"/><path d="M36 38Q40 43 44 38" stroke="#fff9f2" stroke-width="5"/><path d="M76 38Q80 43 84 38" stroke="#F4C7A1" stroke-width="5"/><path d="M52 44.5L52 49L56.5 46.75Z" fill="#fff9f2"/><path d="M68 44.5L68 49L63.5 46.75Z" fill="#F4C7A1"/><path d="M60 15.5C58 12.4 54.2 11.2 54.2 8.2C54.2 5.9 56.6 4.9 58.1 6.1C59.1 6.9 59.7 8 60 9C60.3 8 60.9 6.9 61.9 6.1C63.4 4.9 65.8 5.9 65.8 8.2C65.8 11.2 62 12.4 60 15.5Z" fill="#D95C5C"/></svg></svg>`
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
