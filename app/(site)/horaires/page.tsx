import type { Metadata } from "next";
import { getPrayerDay } from "@/lib/prayer";
import { ACCESS, FACILITIES, LINKS, ROUTES, SITE } from "@/lib/site";
import { toFrenchTime } from "@/lib/format";
import { FunctionalHeader } from "@/components/PageHeader";
import PrayerTimeline from "@/components/PrayerTimeline";
import SectionHead from "@/components/SectionHead";
import { Icon } from "@/components/Icons";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Horaires de prière",
  description: `Horaires des cinq prières et de la Jumu'a à la Grande Mosquée de Creil — Essalam, ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}.`,
  alternates: { canonical: ROUTES.horaires },
};

export default async function HorairesPage() {
  const prayerDay = await getPrayerDay();

  return (
    <main id="contenu">
      <FunctionalHeader
        crumb="Horaires"
        kicker="Prier"
        title="Horaires de prière"
        intro="Les six repères de la journée, l’heure de la Jumu‘a et le calendrier complet de la mosquée."
        meta={
          prayerDay && (
            <div className="border border-[var(--rule-invert)] px-5 py-4">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-night-300">
                Aujourd’hui
              </p>
              <p className="mt-1.5 text-[15px] font-semibold capitalize text-sand-50">
                {prayerDay.gregorian}
              </p>
              {prayerDay.hijri && (
                <p className="text-[13.5px] text-terra-400">{prayerDay.hijri}</p>
              )}
            </div>
          )
        }
      />

      {/* Frise du jour */}
      <section className="section-tight bg-sand-100" aria-labelledby="h-jour">
        <div className="shell">
          <h2 id="h-jour" className="sr-only">
            Horaires du jour
          </h2>
          <PrayerTimeline prayerDay={prayerDay} compact />
        </div>
      </section>

      {/* Jumu'a — traitée à part, c'est le rendez-vous le plus recherché */}
      <section id="jumua" className="section" aria-labelledby="h-jumua">
        <div className="shell">
          <SectionHead
            num="01"
            kicker="Vendredi"
            title={<span id="h-jumua">La prière du vendredi</span>}
            intro="La Jumu‘a rassemble la communauté chaque semaine. Prévoyez d’arriver en avance : la salle se remplit vite."
          />

          <div className="mt-10 grid gap-3 md:grid-cols-3">
            <div className="bg-terra-600 p-7 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                Heure de la Jumu‘a
              </p>
              {prayerDay?.jumua ? (
                <p className="tabular mt-3 text-[52px] font-extrabold leading-none tracking-tightest">
                  {toFrenchTime(prayerDay.jumua)}
                </p>
              ) : (
                <p className="mt-3 text-[16px] leading-relaxed">
                  Horaire à confirmer sur Mawaqit ou sur place.
                </p>
              )}
              <p className="mt-4 text-[13.5px] leading-relaxed text-white">
                Horaire publié par la mosquée sur son calendrier officiel.
              </p>
            </div>

            <div className="border border-[var(--rule)] bg-white p-7 md:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-night-500">
                Bon à savoir
              </p>
              <ul className="mt-4 space-y-3.5">
                <li className="flex gap-3 text-[15px] leading-relaxed text-night-700">
                  <Icon.check width={17} height={17} className="mt-1 shrink-0 text-terra-600" />
                  {ACCESS.hoursNote}
                </li>
                <li className="flex gap-3 text-[15px] leading-relaxed text-night-700">
                  <Icon.check width={17} height={17} className="mt-1 shrink-0 text-terra-600" />
                  L’iqama est indiquée sur la frise lorsque la mosquée la publie&nbsp;: c’est
                  le moment où la prière commence en commun.
                </li>
                <li className="flex gap-3 text-[15px] leading-relaxed text-night-700">
                  <Icon.check width={17} height={17} className="mt-1 shrink-0 text-terra-600" />
                  Les prières de l’Aïd et les prières funéraires font l’objet d’annonces
                  spécifiques.
                </li>
              </ul>
              <Link href={ROUTES.annonces} className="link-arrow mt-6">
                Voir les annonces de la mosquée
                <Icon.arrow width={16} height={16} className="arw" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sur place */}
      <section className="section bg-night-100" aria-labelledby="h-place">
        <div className="shell">
          <SectionHead
            num="02"
            kicker="Sur place"
            title={<span id="h-place">Ce que vous trouverez à la mosquée</span>}
            intro="Équipements déclarés par l’association sur sa fiche officielle."
          />
          <ul className="mt-10 grid gap-px border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-4">
            {FACILITIES.map((f) => (
              <li key={f.label} className="bg-white p-5" data-reveal>
                <p className="text-[15.5px] font-bold tracking-tight text-night-900">
                  {f.label}
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-night-600">{f.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Calendrier complet */}
      <section className="section" aria-labelledby="h-calendrier">
        <div className="shell">
          <SectionHead
            num="03"
            kicker="Calendrier"
            title={<span id="h-calendrier">Le mois et l’année complets</span>}
            intro="Le calendrier annuel de la mosquée est publié sur Mawaqit, la plateforme utilisée par l’association. Il y reste consultable mois par mois et téléchargeable."
            action={
              <a
                href={LINKS.mawaqit}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Ouvrir le calendrier Mawaqit
                <Icon.arrowUpRight width={16} height={16} className="arw" />
              </a>
            }
          />
        </div>
      </section>
    </main>
  );
}
