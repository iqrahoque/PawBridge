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

const PAW_ICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#7b5e3b"/><g fill="#fff9f2"><path d="M32 54 C22.5 46 12 37.5 12 27 C12 19.5 17.8 14 25 14 C28.3 14 31 15.4 32.7 17.7 C34.4 15.4 37.1 14 40.4 14 C47.6 14 53.4 19.5 53.4 27 C53.4 37.5 41.5 46 32 54 Z"/><path d="M14.4 17.5 L12.4 6.5 L25 12.2 C20.9 12.4 17.2 14.4 14.4 17.5 Z"/><path d="M46.6 15 C51.7 10.3 57.7 11.8 58 17.6 C58.3 23.3 53.6 27.5 48.4 26.4 C50.8 22.8 49.7 18.2 46.6 15 Z"/></g></svg>`
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
