import type { Metadata } from "next";
import { LINKS, ROUTES } from "@/lib/site";
import { EditorialHeader } from "@/components/PageHeader";
import SectionHead from "@/components/SectionHead";
import SchoolFeature from "@/components/SchoolFeature";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "École et inscriptions",
  description:
    "Cours de Coran, de langue arabe et de sciences islamiques pour enfants et adultes à la Mosquée Essalam de Creil. Inscriptions 2026 / 2027 et école Al Ghazali.",
  alternates: { canonical: ROUTES.ecole },
};

const FAQ = [
  {
    q: "Qui peut s’inscrire ?",
    a: "La mosquée propose des cours pour les enfants et des cours pour les adultes. Le formulaire d’inscription en ligne précise les créneaux disponibles pour l’année en cours.",
  },
  {
    q: "Comment se déroule l’inscription ?",
    a: "Tout se fait depuis le formulaire en ligne de la madrassah. Une fois le dossier transmis, l’équipe pédagogique revient vers vous pour confirmer la place et le créneau.",
  },
  {
    q: "Quelle est la différence avec l’école Al Ghazali ?",
    a: "La madrassah de la mosquée assure l’enseignement religieux et l’arabe sur des créneaux dédiés. L’école Al Ghazali est un établissement à part entière, avec son propre site et ses propres modalités d’inscription.",
  },
  {
    q: "Une question qui n’est pas ici ?",
    a: "Écrivez à l’association depuis la page contact : les demandes liées aux cours sont transmises à l’équipe pédagogique.",
  },
];

export default function EcolePage() {
  return (
    <main id="contenu">
      <EditorialHeader
        crumb="École et inscriptions"
        kicker="Apprendre"
        title={
          <>
            Apprendre le Coran,
            <br />
            la langue et le sens.
          </>
        }
        intro="L’enseignement est le second pilier de la mosquée, après la prière. Il s’adresse aux enfants comme aux adultes, tout au long de l’année scolaire."
        aside={
          <a
            href={LINKS.inscriptionCours}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent"
          >
            Inscriptions 2026 / 2027
            <Icon.arrowUpRight width={16} height={16} className="arw" />
          </a>
        }
      />

      <section className="section-tight bg-night-100" aria-labelledby="h-enseignement">
        <div className="shell">
          <h2 id="h-enseignement" className="sr-only">
            L’enseignement à la mosquée
          </h2>
          <SchoolFeature />
        </div>
      </section>

      {/* Questions fréquentes */}
      <section className="section" aria-labelledby="h-faq">
        <div className="shell">
          <SectionHead
            num="01"
            kicker="Questions fréquentes"
            title={<span id="h-faq">Avant de vous inscrire</span>}
          />
          <dl className="mt-10 border-t border-[var(--rule-strong)]">
            {FAQ.map((f) => (
              <div
                key={f.q}
                className="grid grid-cols-1 gap-2 border-b border-[var(--rule)] py-6 md:grid-cols-[minmax(0,340px)_1fr] md:gap-10"
                data-reveal
              >
                <dt className="text-[17px] font-extrabold leading-snug tracking-tight text-night-900">
                  {f.q}
                </dt>
                <dd className="text-[15.5px] leading-relaxed text-night-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Passage à l'action */}
      <section className="section-tight bg-sand-100">
        <div className="shell grid grid-cols-1 gap-3 md:grid-cols-2">
          <a
            href={LINKS.inscriptionCours}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between bg-night-900 p-8 text-sand-50 transition-colors hover:bg-night-800"
            data-reveal
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-terra-300">
              Madrassah de la mosquée
            </span>
            <span className="mt-8 block text-[26px] font-extrabold leading-tight tracking-tightest">
              Inscrire un enfant
            </span>
            <span className="mt-2 block text-[14.5px] text-night-200">
              Formulaire en ligne pour l’année 2026 / 2027.
            </span>
            <span className="mt-6 flex items-center gap-2 text-[13.5px] font-semibold">
              Ouvrir le formulaire
              <Icon.arrowUpRight
                width={16}
                height={16}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </span>
          </a>

          <a
            href={LINKS.ecole}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between border border-[var(--rule)] bg-white p-8 transition-colors hover:border-night-900"
            data-reveal
            style={{ ["--reveal-delay" as string]: "70ms" }}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-night-500">
              Établissement partenaire
            </span>
            <span className="mt-8 block text-[26px] font-extrabold leading-tight tracking-tightest text-night-900">
              École Al Ghazali
            </span>
            <span className="mt-2 block text-[14.5px] text-night-600">
              Le projet éducatif porté par l’association, sur son propre site.
            </span>
            <span className="mt-6 flex items-center gap-2 text-[13.5px] font-semibold text-night-800">
              alghazali.org
              <Icon.arrowUpRight
                width={16}
                height={16}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </span>
          </a>
        </div>
      </section>
    </main>
  );
}
