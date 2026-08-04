import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES, SITE } from "@/lib/site";
import { CompactHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Données personnelles et services tiers sur le site de la Grande Mosquée de Creil — Essalam (ACCMO).",
  alternates: { canonical: ROUTES.confidentialite },
};

const SECTIONS = [
  {
    title: "Ce site ne collecte pas vos données",
    body: "Le site public ne contient ni formulaire de collecte, ni compte visiteur, ni traceur publicitaire. Aucun cookie n’est déposé pour vous suivre d’une page à l’autre.",
  },
  {
    title: "Ce que voit l’hébergeur",
    body: "Comme tout site, l’hébergeur enregistre des journaux techniques (adresse IP, page consultée, date) nécessaires au fonctionnement et à la sécurité du service. Ces journaux ne sont pas exploités à des fins d’analyse d’audience par l’association.",
  },
  {
    title: "Les services tiers intégrés",
    body: "Certaines pages affichent des contenus fournis par d’autres services : le plan d’accès (Google Maps), la visite virtuelle et le calendrier des prières. Ces services peuvent déposer leurs propres cookies au moment où le contenu se charge. La visite virtuelle, en particulier, ne se charge qu’après une action explicite de votre part.",
  },
  {
    title: "Les paiements",
    body: "Les dons et cotisations sont traités par Stripe, sur ses propres pages. Vos coordonnées bancaires ne transitent jamais par ce site et n’y sont jamais enregistrées. Les informations que vous transmettez lors du paiement relèvent de la politique de confidentialité de Stripe.",
  },
  {
    title: "Les e-mails que vous envoyez",
    body: "Lorsque vous écrivez à l’association, votre message et votre adresse sont conservés dans sa messagerie le temps de traiter votre demande. Ils ne sont ni revendus, ni transmis à des tiers.",
  },
  {
    title: "Vos droits",
    body: "Vous pouvez demander l’accès, la rectification ou la suppression des informations vous concernant détenues par l’association, en écrivant à l’adresse de contact.",
  },
];

export default function ConfidentialitePage() {
  return (
    <main id="contenu">
      <CompactHeader
        crumb="Confidentialité"
        kicker="Données personnelles"
        title="Politique de confidentialité"
        intro="Ce que ce site fait — et surtout ne fait pas — de vos données."
      />

      <section className="section-tight">
        <div className="shell max-w-3xl">
          {SECTIONS.map((s, i) => (
            <article
              key={s.title}
              className="border-b border-[var(--rule)] py-6 first:border-t first:border-[var(--rule-strong)]"
              data-reveal
            >
              <h2 className="flex gap-4 text-[18px] font-extrabold tracking-tight text-night-900">
                <span className="tabular text-terra-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
              </h2>
              <p className="mt-2.5 pl-[calc(1.5rem+1ch)] text-[15.5px] leading-relaxed text-night-700">
                {s.body}
              </p>
            </article>
          ))}

          <p className="mt-8 text-[15px] leading-relaxed text-night-700">
            Pour toute demande relative à vos données, écrivez à{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-semibold text-night-900 underline underline-offset-4 hover:text-terra-600"
            >
              {SITE.email}
            </a>{" "}
            ou passez par la{" "}
            <Link
              href={ROUTES.contact}
              className="font-semibold text-night-900 underline underline-offset-4 hover:text-terra-600"
            >
              page contact
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
