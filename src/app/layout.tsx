import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const PAW_ICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#557A63"/><g fill="#fff"><ellipse cx="22" cy="22" rx="6" ry="8"/><ellipse cx="42" cy="22" rx="6" ry="8"/><ellipse cx="12" cy="34" rx="5" ry="7"/><ellipse cx="52" cy="34" rx="5" ry="7"/><path d="M32 30c8 0 14 6.5 14 13.5S40 54 32 54s-14-3.5-14-10.5S24 30 32 30z"/></g></svg>`
  );

export const metadata: Metadata = {
  title: "PetCare — pet adoption, donations and vet care in Dhaka",
  description:
    "A database-driven platform connecting adopters, shelters, vets and donors — helping dogs & cats find homes, funds and medical care.",
  keywords: ["pet adoption", "donations", "veterinary", "animal welfare", "Dhaka", "database project"],
  authors: [{ name: "Iqra Hoque" }],
  icons: { icon: PAW_ICON },
  openGraph: {
    title: "PetCare — pet adoption, donations and vet care in Dhaka",
    description: "Connect adopters, shelters, vets and donors. Help dogs & cats find homes, funds and care.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#34513F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
