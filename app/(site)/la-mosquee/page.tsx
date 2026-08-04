import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FACILITIES, PHOTOS, ROUTES, SITE } from "@/lib/site";
import { EditorialHeader } from "@/components/PageHeader";
import SectionHead from "@/components/SectionHead";
import HeritageChapters from "@/components/HeritageChapters";
import CommunityActions from "@/components/CommunityActions";
import LocationSection from "@/components/LocationSection";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "La mosquée",
  description:
    "La Grande Mosquée de Creil — Essalam : son histoire, ses espaces, ses engagements et l’association ACCMO qui la fait vivre.",
  alternates: { canonical: ROUTES.mosquee },
};

export default function MosqueePage() {
  return (
    <main id="contenu">
      <EditorialHeader
        crumb="La mosquée"
        kicker="Découvrir"
        title={
          <>
            Une maison ouverte
            <br />
            au cœur de Creil.
          </>
        }
        intro="La Grande Mosquée de Creil — Essalam est gérée par l’ACCMO. On y prie, on y apprend, on s’y entraide : trois usages qui se croisent tous les jours de l’année."
        aside={
          <p className="arabic text-[19px] leading-relaxed text-night-700" lang="ar">
            السلام عليكم ورحمة الله
          </p>
        }
      />

      {/* Diptyque photographique */}
      <section className="section-tight" aria-label="La mosquée en images">
        <div className="shell grid gap-3 md:grid-cols-[3fr_2fr]">
          <div className="group" data-reveal>
            <div className="frame frame-shift aspect-[16/10]">
              <Image
                src={PHOTOS.salle.src}
                alt={PHOTOS.salle.alt}
                fill
                priority
                quality={80}
                sizes="(max-width: 767px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <p className="mt-2.5 text-[12.5px] text-night-600">
              La salle de prière, orientée vers le mihrab.
            </p>
          </div>
          <div className="group" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
            <div className="frame frame-shift aspect-[16/10] md:aspect-auto md:h-[calc(100%-30px)]">
              <Image
                src={PHOTOS.interieur.src}
                alt={PHOTOS.interieur.alt}
                fill
                quality={78}
                sizes="(max-width: 767px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <p className="mt-2.5 text-[12.5px] text-night-600">
              Les espaces intérieurs, sous la lumière naturelle.
            </p>
          </div>
        </div>
      </section>

      {/* Chapitres */}
      <section id="histoire" className="section bg-sand-100" aria-labelledby="h-chapitres">
        <div className="shell">
          <SectionHead
            num="01"
            kicker="Histoire & mission"
            title={<span id="h-chapitres">Cinq chapitres pour comprendre</span>}
            intro="Rien d’inventé ici : uniquement ce que l’association assume publiquement de son action."
          />
          <HeritageChapters />
        </div>
      </section>

      {/* Espaces & équipements */}
      <section className="section" aria-labelledby="h-espaces">
        <div className="shell">
          <SectionHead
            num="02"
            kicker="Les espaces"
            title={<span id="h-espaces">Ce que la mosquée met à disposition</span>}
            intro="Équipements déclarés par l’association sur sa fiche officielle de mosquée."
          />
          <ul className="mt-10 grid gap-px border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-4">
            {FACILITIES.map((f) => (
              <li key={f.label} className="bg-white p-6" data-reveal>
                <p className="text-[16px] font-bold tracking-tight text-night-900">
                  {f.label}
                </p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-night-600">
                  {f.note}
                </p>
              </li>
            ))}
          </ul>
          <Link href={ROUTES.visite} className="link-arrow mt-8">
            Parcourir la mosquée en visite 360°
            <Icon.arrow width={16} height={16} className="arw" />
          </Link>
        </div>
      </section>

      {/* Engagements */}
      <section id="actions" className="on-dark section bg-night-900" aria-labelledby="h-engagements">
        <div className="shell">
          <SectionHead
            num="03"
            kicker="Solidarité & services"
            invert
            title={<span id="h-engagements">Quatre engagements, toute l’année</span>}
          />
          <CommunityActions />
        </div>
      </section>

      {/* Venir */}
      <section className="section" aria-labelledby="h-venir">
        <div className="shell">
          <SectionHead
            num="04"
            kicker="Venir"
            title={
              <span id="h-venir">
                {SITE.address.street}, {SITE.address.city}
              </span>
            }
          />
          <LocationSection />
        </div>
      </section>
    </main>
  );
}
