import Link from "next/link";
import type { Metadata } from "next";
import { getPublished } from "@/lib/announcements";
import { getPrayerDay } from "@/lib/prayer";
import { getSettings } from "@/lib/settings";
import { AID_SERVICE, LINKS, ROUTES, SITE } from "@/lib/site";
import HomeHero from "@/components/HomeHero";
import SectionHead from "@/components/SectionHead";
import PrayerTimeline from "@/components/PrayerTimeline";
import CommunityShortcuts from "@/components/CommunityShortcuts";
import EventsAgenda from "@/components/EventsAgenda";
import SchoolFeature from "@/components/SchoolFeature";
import VirtualTourSection from "@/components/VirtualTourSection";
import HeritageChapters from "@/components/HeritageChapters";
import DonationPanel from "@/components/DonationPanel";
import LocationSection from "@/components/LocationSection";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = {
  // `absolute` : la page d'accueil ne doit pas hériter du suffixe du gabarit.
  title: { absolute: "Grande Mosquée de Creil — Essalam (ACCMO) · Horaires, école, annonces" },
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [announcements, prayerDay, settings] = await Promise.all([
    getPublished(),
    getPrayerDay(),
    getSettings(),
  ]);

  const featured = announcements.find((a) => a.featured) ?? announcements[0];

  return (
    <main id="contenu">
      {/* Hero asymétrique — sans marqueur numéroté */}
      <HomeHero prayerDay={prayerDay} />

      {/* 01 — Vie de la mosquée : mise au premier plan, avant les horaires.
             La prochaine prière reste accessible plus haut, dans la barre
             d'information et dans l'encart du hero. */}
      <section id="annonces" className="section-tight bg-sand-100" aria-labelledby="h-agenda">
        <div className="shell">
          <SectionHead
            num="01"
            kicker="Vie de la mosquée"
            title={<span id="h-agenda">Annonces et rendez-vous</span>}
            intro="Ce qui se passe à Essalam : informations de l’association, enseignement, événements et actions solidaires."
            action={
              <Link href={ROUTES.annonces} className="btn btn-outline">
                Tout l’agenda
                <Icon.arrow width={16} height={16} className="arw" />
              </Link>
            }
          />
          <EventsAgenda items={announcements} featuredId={featured?.id} limit={5} />
        </div>
      </section>

      {/* 02 — Horaires du jour */}
      <section id="horaires" className="section-tight bg-night-100" aria-labelledby="h-horaires">
        <div className="shell">
          <SectionHead
            num="02"
            kicker="Prier à Essalam"
            title={<span id="h-horaires">Les horaires du jour</span>}
            intro="La journée de la mosquée, du Fajr à la ‘Icha, tenue à jour depuis le calendrier officiel de l’association."
            action={
              <Link href={ROUTES.horaires} className="btn btn-outline">
                Toute la page horaires
                <Icon.arrow width={16} height={16} className="arw" />
              </Link>
            }
          />
          <PrayerTimeline prayerDay={prayerDay} />
        </div>
      </section>

      {/* 03 — Accès rapides aux démarches */}
      <section className="section" aria-labelledby="h-demarches">
        <div className="shell">
          <SectionHead
            num="03"
            kicker="Accès rapides"
            title={<span id="h-demarches">Que venez-vous faire aujourd’hui&nbsp;?</span>}
            intro="Les démarches les plus demandées, accessibles en un geste."
          />
          <CommunityShortcuts />

          {/* Service saisonnier, activé une fois par an depuis l'administration. */}
          {settings.aidEnabled && (
            <a
              href={AID_SERVICE.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 flex flex-col gap-3 border border-terra-500 bg-terra-100 p-6 transition-colors hover:bg-terra-200 sm:flex-row sm:items-center sm:justify-between"
              data-reveal
            >
              <span>
                <span className="tag bg-terra-600 text-white">Service saisonnier</span>
                <span className="mt-2 block text-[20px] font-extrabold tracking-tight text-night-900">
                  {AID_SERVICE.title}
                </span>
                <span className="mt-1 block text-[14px] text-night-700">
                  {AID_SERVICE.desc}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-[14px] font-bold text-terra-700">
                {AID_SERVICE.cta}
                <Icon.arrowUpRight
                  width={17}
                  height={17}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </span>
            </a>
          )}
        </div>
      </section>

      {/* 04 — Visite virtuelle immersive.
          Placée avant l'école pour que les deux sections bleu nuit de la
          page — celle-ci et « Histoire & mission » — restent séparées par
          un fond clair. */}
      <section
        id="visite-virtuelle"
        className="on-dark section bg-night-900"
        aria-labelledby="h-visite"
      >
        <div className="shell">
          <SectionHead
            num="04"
            kicker="Visite 360°"
            invert
            title={<span id="h-visite">Voir la mosquée avant de venir</span>}
            intro="Un panorama interactif de la salle de prière, à parcourir depuis votre navigateur."
          />
          <VirtualTourSection />
        </div>
      </section>

      {/* 05 — École Al Ghazali */}
      <section id="ecole" className="section bg-sand-100" aria-labelledby="h-ecole">
        <div className="shell">
          <SectionHead
            num="05"
            kicker="Apprendre"
            title={<span id="h-ecole">Transmettre, dès le plus jeune âge</span>}
            intro="Le Coran, la langue arabe et les sciences islamiques, enseignés à la mosquée et prolongés par l’école Al Ghazali."
          />
          <SchoolFeature />
        </div>
      </section>

      {/* 06 — Histoire et mission.
          `apropos` : ancre héritée de l'ancienne page unique, conservée pour
          que les liens déjà partagés continuent d'atterrir au bon endroit. */}
      <span id="apropos" className="sr-only" aria-hidden />
      <section
        id="histoire"
        className="on-dark section bg-night-900"
        aria-labelledby="h-histoire"
      >
        <div className="shell">
          <SectionHead
            num="06"
            kicker="Histoire & mission"
            invert
            title={<span id="h-histoire">Ce que porte l’association</span>}
            intro="La Grande Mosquée de Creil est gérée par l’ACCMO. Voici, en quelques chapitres, ce qui structure son action."
            action={
              <Link href={ROUTES.mosquee} className="btn btn-outline-invert">
                Découvrir la mosquée
                <Icon.arrow width={16} height={16} className="arw" />
              </Link>
            }
          />
          <HeritageChapters invert />
        </div>
      </section>

      {/* 07 — Don et cotisation */}
      <section id="dons" className="section bg-sand-100" aria-labelledby="h-dons">
        <div className="shell">
          <p className="section-marker border-t border-[var(--rule)] pt-6" data-reveal>
            <span className="num">07</span>
            <span id="h-dons">Soutenir</span>
          </p>
          <DonationPanel />
          <p className="mt-8 text-[13.5px] text-night-600" data-reveal>
            Une question sur les contributions&nbsp;?{" "}
            <Link
              href={ROUTES.contact}
              className="font-semibold text-night-900 underline underline-offset-4 hover:text-terra-600"
            >
              Écrivez à l’association
            </Link>
            . Vous pouvez aussi ouvrir directement la{" "}
            <a
              href={LINKS.cotisation}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-night-900 underline underline-offset-4 hover:text-terra-600"
            >
              page de cotisation annuelle
            </a>
            .
          </p>
        </div>
      </section>

      {/* 08 — Localisation */}
      <section id="contact" className="section" aria-labelledby="h-contact">
        <div className="shell">
          <SectionHead
            num="08"
            kicker="Venir à la mosquée"
            title={
              <span id="h-contact">
                {SITE.address.street}, {SITE.address.city}
              </span>
            }
            intro="Tout ce qu’il faut pour arriver sans hésiter, en voiture comme à pied."
          />
          <LocationSection />
        </div>
      </section>
    </main>
  );
}
