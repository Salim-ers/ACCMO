import type { Metadata } from "next";
import Link from "next/link";
import { LINKS, ROUTES } from "@/lib/site";
import { FunctionalHeader } from "@/components/PageHeader";
import VirtualTourSection from "@/components/VirtualTourSection";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Visite virtuelle 360°",
  description:
    "Parcourez la salle de prière et les espaces de la Grande Mosquée de Creil — Essalam en visite panoramique 360°, depuis votre navigateur.",
  alternates: { canonical: ROUTES.visite },
};

export default function VisitePage() {
  return (
    <main id="contenu">
      <FunctionalHeader
        crumb="Visite virtuelle"
        kicker="Expérience 360°"
        title="Entrez dans Essalam"
        intro="Un panorama interactif des espaces de la mosquée. L’expérience ne se charge qu’à votre demande."
        meta={
          <a
            href={LINKS.visiteVirtuelle}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-invert"
          >
            Ouvrir dans un nouvel onglet
            <Icon.arrowUpRight width={16} height={16} className="arw" />
          </a>
        }
      />

      <section className="on-dark bg-night-900 pb-14 pt-10 sm:pb-20" aria-label="Visite 360°">
        <div className="shell">
          <VirtualTourSection />
        </div>
      </section>

      <section className="section-tight" aria-labelledby="h-conseils">
        <div className="shell grid gap-8 md:grid-cols-[minmax(0,420px)_1fr] md:gap-14">
          <h2 id="h-conseils" className="title-md text-night-900">
            Comment se déplacer dans la visite
          </h2>
          <div>
            <ul className="border-t border-[var(--rule-strong)]">
              {[
                "Faites glisser l’image pour regarder autour de vous.",
                "Utilisez les points d’accès au sol pour passer d’un espace à l’autre.",
                "Le plein écran offre le meilleur confort de lecture sur ordinateur.",
                "Sur téléphone, tournez l’appareil à l’horizontale pour un panorama plus large.",
              ].map((t) => (
                <li
                  key={t}
                  className="flex gap-3 border-b border-[var(--rule)] py-3.5 text-[15px] leading-relaxed text-night-700"
                  data-reveal
                >
                  <Icon.check width={17} height={17} className="mt-0.5 shrink-0 text-terra-600" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[14.5px] leading-relaxed text-night-600">
              La visite virtuelle ne remplace pas le passage sur place : la mosquée est
              ouverte pour les cinq prières quotidiennes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={ROUTES.horaires} className="btn btn-primary">
                Voir les horaires
                <Icon.arrow width={16} height={16} className="arw" />
              </Link>
              <Link href={ROUTES.contact} className="btn btn-outline">
                Nous rendre visite
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
