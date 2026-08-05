import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Kufi_Arabic } from "next/font/google";
import { LOGO, SITE } from "@/lib/site";
import RevealEngine from "@/components/RevealEngine";
import "./globals.css";

// Racine minimale : polices, métadonnées globales et moteur de révélation.
// L'habillage public (en-tête, pied de page, barre d'accès rapide) vit dans
// le groupe de routes `(site)`, afin que l'espace d'administration conserve
// son propre cadre.

// Deux familles seulement : une sans-serif contemporaine pour le français,
// une kufique pour l'arabe. Rien de serif éditorial, rien de décoratif.
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const arabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#101b2d",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Grande Mosquée de Creil — Essalam (ACCMO)",
    template: "%s · Mosquée Essalam de Creil",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "mosquée Creil",
    "Essalam",
    "ACCMO",
    "horaires de prière Creil",
    "Jumu'a Creil",
    "école coranique Creil",
    "Al Ghazali",
    "mosquée Oise",
  ],
  authors: [{ name: SITE.legalName, url: SITE.url }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    siteName: SITE.name,
    title: "Grande Mosquée de Creil — Essalam (ACCMO)",
    description: SITE.description,
    // Pas de dimensions déclarées : la photographie est un cliché 4:3 et
    // annoncer un 1200×630 inexact induirait les aperçus en erreur.
    images: [
      {
        url: "/photos/mosquee-facade.jpg",
        alt: "La Grande Mosquée de Creil et son minaret",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grande Mosquée de Creil — Essalam (ACCMO)",
    description: SITE.description,
    images: ["/photos/mosquee-facade.jpg"],
  },
  icons: { icon: LOGO, apple: LOGO },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${arabic.variable}`}>
      <head>
        {/*
          Marque la page comme « JavaScript disponible » avant l'analyse du
          corps : c'est ce drapeau qui autorise l'état masqué des animations
          de révélation. Sans lui, tout le contenu reste visible.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <RevealEngine />
        {children}
      </body>
    </html>
  );
}
