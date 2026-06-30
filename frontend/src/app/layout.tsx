import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const ibmPlexSansHeading = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "News Foundry",
  description:
    "News Foundry permet de créer des revues de presse en quelques secondes avec l'IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn(
        "h-full",
        "overflow-hidden",
        "antialiased",
        "font-sans",
        inter.variable,
        ibmPlexSansHeading.variable,
      )}
    >
      <body className="h-full overflow-hidden flex flex-col">{children}</body>
    </html>
  );
}
