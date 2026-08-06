import Image from "next/image";
import Link from "next/link";
import { FULL_ADDRESS, PHOTOS, ROUTES, SITE } from "@/lib/site";
import type { PrayerDay } from "@/lib/prayer";
import NextPrayerCard from "@/components/NextPrayerCard";
import { Icon } from "@/components/Icons";

// Hero asymétrique composé comme une couverture de magazine :
// 55 % de discours à gauche, 45 % de composition photographique à droite.
// Aucune photo plein écran, aucun titre posé au milieu d'une façade,
// aucune hauteur de 100vh.

export default function HomeHero({ prayerDay }: { prayerDay: PrayerDay | null }) {
  return (
    <section
      id="accueil"
      className="relative overflow-hidden bg-[var(--color-surface)]"
      aria-labelledby="hero-title"
    >
      <div className="shell relative grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[55fr_45fr] lg:gap-14 lg:pb-24 lg:pt-20">
        {/* ================= Discours ================= */}
        <div>
          <p
            className="flex items-center gap-3 text-[11.5px] font-bold uppercase tracking-[0.15em] text-night-600"
            data-reveal
          >
            <span className="h-px w-8 bg-terra-500" aria-hidden />
            {SITE.tagline} · {SITE.shortName}
          </p>

          <h1
            id="hero-title"
            className="title-xl mt-6 text-night-900"
            data-reveal
            style={{ ["--reveal-delay" as string]: "60ms" }}
          >
            Prier, apprendre
            <br />
            et grandir ensemble.
          </h1>

          <p
            className="mt-6 max-w-xl text-[17px] leading-relaxed text-night-600 sm:text-[18px]"
            data-reveal
            style={{ ["--reveal-delay" as string]: "120ms" }}
          >
            Un lieu de culte, de transmission et de solidarité ouvert à toute la
            communauté de Creil.
          </p>

          <div
            className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
            data-reveal
            style={{ ["--reveal-delay" as string]: "180ms" }}
          >
            <Link href={ROUTES.mosquee} className="btn btn-primary">
              Découvrir Essalam
              <Icon.arrow width={17} height={17} className="arw" />
            </Link>
            <a href="#horaires" className="link-arrow">
              Voir les horaires
              <Icon.arrow width={16} height={16} className="arw" />
            </a>
          </div>

          {/* Repères pratiques, en filet bas. */}
          <dl
            className="mt-11 grid max-w-xl grid-cols-2 border-t border-[var(--rule)] pt-5 text-[13.5px] sm:grid-cols-3"
            data-reveal
            style={{ ["--reveal-delay" as string]: "240ms" }}
          >
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-night-500">
                Adresse
              </dt>
              <dd className="mt-1 font-medium text-night-800">{FULL_ADDRESS}</dd>
            </div>
            <div className="border-l border-[var(--rule)] pl-5">
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-night-500">
                Association
              </dt>
              <dd className="mt-1 font-medium text-night-800">{SITE.association}</dd>
            </div>
            <div className="col-span-2 mt-4 border-t border-[var(--rule)] pt-4 sm:col-span-1 sm:mt-0 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-night-500">
                Ouvert à
              </dt>
              <dd className="mt-1 font-medium text-night-800">
                Hommes, femmes et enfants
              </dd>
            </div>
          </dl>
        </div>

        {/* ================= Composition photographique ================= */}
        <div className="relative" data-reveal style={{ ["--reveal-delay" as string]: "100ms" }}>
          {/* Détail typographique arabe, en filet au-dessus de la photographie. */}
          <div className="mb-3 hidden items-center gap-4 lg:flex">
            <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden />
            <p className="arabic text-[15px] leading-none text-night-600" lang="ar">
              مسجد السلام
            </p>
          </div>

          {/* Photographie verticale — cadrage architectural, découpe franche. */}
          <div className="frame aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]">
            {/*
              La source est un cliché 4:3 en paysage, le cadre du hero est
              vertical : object-cover rogne donc sur la largeur. Le point
              focal est décalé vers la droite pour garder le minaret dans
              le champ — c'est lui qui donne la verticale architecturale.
              Ajuster ce pourcentage si la photo est recadrée un jour.
            */}
            <Image
              src={PHOTOS.facade.src}
              alt={PHOTOS.facade.alt}
              fill
              priority
              quality={82}
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-cover object-[72%_center]"
            />
          </div>

          {/* Seconde image, carrée, en superposition maîtrisée. */}
          <div className="frame absolute -bottom-8 -left-4 hidden h-32 w-32 border-4 border-[var(--color-surface)] sm:block lg:-left-10 lg:h-40 lg:w-40">
            <Image
              src={PHOTOS.salle.src}
              alt={PHOTOS.salle.alt}
              fill
              quality={78}
              sizes="160px"
              className="object-cover"
            />
          </div>

          {/* Encart superposé : prochaine prière. */}
          <div className="relative -mt-10 ml-auto w-full max-w-[280px] sm:absolute sm:bottom-6 sm:right-0 sm:mt-0 sm:translate-x-4 lg:translate-x-8">
            <NextPrayerCard prayerDay={prayerDay} />
          </div>
        </div>
      </div>
    </section>
  );
}
