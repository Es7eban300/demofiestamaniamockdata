import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FiestaMania — Tu Próxima Fiesta, Inolvidable",
    template: "%s | FiestaMania",
  },
  description:
    "Compra artículos de fiesta y piñatería para cada ocasión: cumpleaños, baby shower, graduación, aniversario y más.",
  keywords: [
    "artículos de fiesta",
    "piñatería",
    "globos",
    "decoración cumpleaños",
    "baby shower",
    "graduación",
    "aniversario",
  ],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "FiestaMania",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
