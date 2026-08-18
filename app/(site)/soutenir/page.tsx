import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES, SITE } from "@/lib/site";
import { FunctionalHeader } from "@/components/PageHeader";
import SectionHead from "@/components/SectionHead";
import DonationPanel from "@/components/DonationPanel";
import CommunityActions from "@/components/CommunityActions";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Soutenir la mosquée",
  description:
    "Don ponctuel ou cotisation annuelle : soutenez le fonctionnement, l’entretien, l’enseignement et les actions solidaires de la Grande Mosquée de Creil — Essalam (ACCMO).",
  alternates: { canonical: ROUTES.don },
};

export default function SoutenirPage() {
  return (
    <main id="contenu">
      <FunctionalHeader
        crumb="Soutenir"
        kicker="Soutenir"
        title="Votre contribution fait tourner la maison"
        intro="Le fonctionnement quotidien de la mosquée repose sur les contributions de celles et ceux qui la fréquentent."
      />

      <section className="section-tight" aria-labelledby="h-contribuer">
        <div className="shell">
          <h2 id="h-contribuer" className="sr-only">
            Contribuer
          </h2>
          <DonationPanel />
        </div>
      </section>

      {/* Ce que la contribution rend possible */}
      <section className="on-dark section bg-night-900" aria-labelledby="h-effets">
        <div className="shell">
          <SectionHead
            num="01"
            kicker="Ce que cela permet"
            invert
            title={<span id="h-effets">Quatre engagements, toute l’année</span>}
            intro="Votre soutien alimente directement ces quatre chantiers."
          />
          <CommunityActions />
        </div>
      </section>

      {/* Transparence */}
      <section className="section-tight bg-sand-100" aria-labelledby="h-transparence">
        <div className="shell grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,380px)_1fr] md:gap-14">
          <h2 id="h-transparence" className="title-md text-night-900">
            Ce que nous pouvons vous garantir
          </h2>
          <div>
            <ul className="border-t border-[var(--rule-strong)]">
              {[
                "Le paiement est traité par Stripe : aucune coordonnée bancaire ne transite par ce site, ni n’y est stockée.",
                "Le montant et la fréquence se choisissent librement sur la page de paiement.",
                "La cotisation annuelle correspond à l’adhésion à l’association ; le don ponctuel en est indépendant.",
                "Pour toute question sur l’usage des fonds, l’association répond par e-mail.",
              ].map((t) => (
                <li
                  key={t}
                  className="flex gap-3 border-b border-[var(--rule)] py-4 text-[15px] leading-relaxed text-night-700"
                  data-reveal
                >
                  <Icon.check width={17} height={17} className="mt-0.5 shrink-0 text-terra-600" />
                  {t}
                </li>
              ))}
            </ul>
            <Link href={ROUTES.contact} className="link-arrow mt-6">
              Poser une question à {SITE.association}
              <Icon.arrow width={16} height={16} className="arw" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
