import type { Metadata } from "next";
import Link from "next/link";
import { FULL_ADDRESS, ROUTES, SITE } from "@/lib/site";
import { CompactHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site de la Grande Mosquée de Creil — Essalam, édité par ${SITE.legalName}.`,
  alternates: { canonical: ROUTES.mentions },
  robots: { index: true, follow: true },
};

export default function MentionsPage() {
  return (
    <main id="contenu">
      <CompactHeader
        crumb="Mentions légales"
        kicker="Informations légales"
        title="Mentions légales"
        intro="Éditeur, hébergeur et conditions d’utilisation du présent site."
      />

      <section className="section-tight">
        <div className="shell max-w-3xl">
          <dl className="border-t border-[var(--rule-strong)]">
            {[
              { t: "Éditeur du site", d: `${SITE.legalName} (${SITE.association})` },
              { t: "Forme juridique", d: SITE.legal.form },
              { t: "Lieu de culte", d: SITE.name },
              { t: "Adresse du siège", d: FULL_ADDRESS },
              { t: "Téléphone", d: SITE.phone ?? "—" },
              { t: "Contact", d: SITE.email },
              { t: "Directeur de la publication", d: SITE.legal.publisher },
              { t: "SIREN", d: SITE.legal.siren },
              { t: "SIRET (siège social)", d: SITE.legal.siret },
              { t: "Numéro de TVA intracommunautaire", d: SITE.legal.tva },
              {
                t: "Hébergeur",
                d: "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — vercel.com",
              },
            ].map((row) => (
              <div
                key={row.t}
                className="grid grid-cols-1 gap-1 border-b border-[var(--rule)] py-4 sm:grid-cols-[minmax(0,260px)_1fr] sm:gap-8"
              >
                <dt className="text-[14px] font-bold text-night-900">{row.t}</dt>
                <dd className="text-[15px] leading-relaxed text-night-700">{row.d}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-night-700">
            <div>
              <h2 className="text-[17px] font-extrabold tracking-tight text-night-900">
                Propriété intellectuelle
              </h2>
              <p className="mt-2">
                Les textes et les photographies présentés sur ce site sont la propriété de
                l’association, sauf mention contraire. Toute reproduction sans autorisation
                préalable est interdite.
              </p>
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold tracking-tight text-night-900">
                Services tiers
              </h2>
              <p className="mt-2">
                Les horaires de prière proviennent du calendrier officiel publié par la
                mosquée sur Mawaqit. Les paiements sont traités par Stripe. Le plan d’accès
                est fourni par Google Maps. La visite virtuelle et le formulaire
                d’inscription aux cours sont hébergés sur des services distincts, dont les
                conditions leur sont propres.
              </p>
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold tracking-tight text-night-900">
                Signaler une erreur
              </h2>
              <p className="mt-2">
                Une information vous semble inexacte&nbsp;? Écrivez à l’association depuis la{" "}
                <Link
                  href={ROUTES.contact}
                  className="font-semibold text-night-900 underline underline-offset-4 hover:text-terra-600"
                >
                  page contact
                </Link>
                , la correction sera apportée.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
