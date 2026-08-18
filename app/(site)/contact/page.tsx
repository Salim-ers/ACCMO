import type { Metadata } from "next";
import Link from "next/link";
import { LINKS, PHONE_HREF, ROUTES, SITE } from "@/lib/site";
import { FunctionalHeader } from "@/components/PageHeader";
import SectionHead from "@/components/SectionHead";
import LocationSection from "@/components/LocationSection";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact et accès",
  description: `Adresse, itinéraire et contact de la Grande Mosquée de Creil — Essalam (ACCMO) : ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}.`,
  alternates: { canonical: ROUTES.contact },
};

// Chaque demande est orientée vers le bon canal plutôt que noyée dans un
// formulaire unique : l'association n'a qu'une adresse e-mail publique.
const REQUESTS = [
  {
    title: "Préparer une prière funéraire (Janaza)",
    desc: "Précisez le nom de la personne, la date souhaitée et un numéro où vous joindre. L’association revient vers vous rapidement.",
    subject: "Demande de prière funéraire (Janaza)",
  },
  {
    title: "Une question sur les cours",
    desc: "Créneaux, niveaux, dossier d’inscription : les demandes sont transmises à l’équipe pédagogique.",
    subject: "Question sur les cours de la madrassah",
  },
  {
    title: "Proposer un coup de main",
    desc: "Bénévolat, compétences, dons matériels : dites en quelques lignes ce que vous souhaitez apporter.",
    subject: "Proposition d’aide bénévole",
  },
  {
    title: "Toute autre demande",
    desc: "Information, partenariat, demande de rendez-vous avec l’association.",
    subject: "Demande d’information",
  },
];

export default function ContactPage() {
  return (
    <main id="contenu">
      <FunctionalHeader
        crumb="Nous contacter"
        kicker="Nous contacter"
        title="Venir, écrire, demander"
        intro="L’association répond par e-mail. Choisissez ci-dessous le motif de votre demande : le message part avec le bon objet."
        meta={
          <div className="flex flex-col gap-2 sm:flex-row">
            {SITE.phone && PHONE_HREF && (
              <a href={PHONE_HREF} className="btn btn-accent">
                <Icon.phone width={17} height={17} />
                {SITE.phone}
              </a>
            )}
            <a href={`mailto:${SITE.email}`} className="btn btn-outline-invert">
              <Icon.mail width={17} height={17} />
              {SITE.email}
            </a>
          </div>
        }
      />

      {/* Motifs de contact */}
      <section className="section-tight" aria-labelledby="h-demandes">
        <div className="shell">
          <SectionHead
            num="01"
            kicker="Écrire à l’association"
            title={<span id="h-demandes">Quel est l’objet de votre demande&nbsp;?</span>}
            intro="Un seul e-mail de contact, mais des objets distincts pour que votre message arrive au bon interlocuteur."
          />

          <ul className="mt-10 grid grid-cols-1 gap-px border border-[var(--rule)] bg-[var(--rule)] md:grid-cols-2">
            {REQUESTS.map((r) => (
              <li key={r.subject} data-reveal>
                <a
                  href={`mailto:${SITE.email}?subject=${encodeURIComponent(r.subject)}`}
                  className="group flex h-full flex-col justify-between bg-white p-6 transition-colors hover:bg-sand-100"
                >
                  <span>
                    <span className="block text-[18px] font-extrabold leading-snug tracking-tight text-night-900">
                      {r.title}
                    </span>
                    <span className="mt-2 block text-[14.5px] leading-relaxed text-night-600">
                      {r.desc}
                    </span>
                  </span>
                  <span className="mt-5 flex items-center gap-2 text-[13.5px] font-semibold text-night-800">
                    Écrire à l’association
                    <Icon.arrow
                      width={16}
                      height={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-[13.5px] leading-relaxed text-night-600">
            Les liens ci-dessus ouvrent votre logiciel de messagerie avec l’adresse{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex min-h-[26px] items-center font-semibold text-night-900 underline underline-offset-4 hover:text-terra-600"
            >
              {SITE.email}
            </a>
            . Aucune donnée n’est enregistrée par ce site.
          </p>
        </div>
      </section>

      {/* Accès */}
      <section className="section bg-sand-100" aria-labelledby="h-acces">
        <div className="shell">
          <SectionHead
            num="02"
            kicker="Accès"
            title={<span id="h-acces">Se rendre à la mosquée</span>}
          />
          <LocationSection />
        </div>
      </section>

      {/* Démarches directes */}
      <section className="section-tight" aria-labelledby="h-directes">
        <div className="shell">
          <h2 id="h-directes" className="title-md text-night-900">
            Ces démarches se font en ligne
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "Inscriptions aux cours", href: LINKS.inscriptionCours, external: true },
              { label: "Faire un don", href: ROUTES.don, external: false },
              { label: "Visite virtuelle 360°", href: ROUTES.visite, external: false },
            ].map((l) => (
              <li key={l.label} data-reveal>
                {l.external ? (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 border border-[var(--rule)] bg-white px-5 py-4 text-[15.5px] font-bold text-night-900 transition-colors hover:border-night-900"
                  >
                    {l.label}
                    <Icon.arrowUpRight
                      width={17}
                      height={17}
                      className="text-night-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ) : (
                  <Link
                    href={l.href}
                    className="group flex items-center justify-between gap-4 border border-[var(--rule)] bg-white px-5 py-4 text-[15.5px] font-bold text-night-900 transition-colors hover:border-night-900"
                  >
                    {l.label}
                    <Icon.arrow
                      width={17}
                      height={17}
                      className="text-night-500 transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
