"use client";

import { useState, type CSSProperties } from "react";
import { LINKS } from "@/lib/site";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { Icon } from "@/components/Icons";

export default function VirtualTour() {
  const [active, setActive] = useState(false);

  return (
    <section id="visite-virtuelle" className="container-x py-20 sm:py-28">
      <SectionHeading
        eyebrow="Immersion"
        title="Visite virtuelle 360°"
        intro="Découvrez l'intérieur de la mosquée comme si vous y étiez, depuis chez vous."
      />

      <Reveal y={36} className="mt-10">
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-lift ring-1 ring-emerald-900/10">
          {active ? (
            <iframe
              src={LINKS.visiteVirtuelle}
              title="Visite virtuelle 360° de la Grande Mosquée de Creil"
              className="h-full w-full"
              loading="lazy"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setActive(true)}
              className="photo-bg group flex h-full w-full flex-col items-center justify-center gap-4 text-sand-50"
              style={{ "--photo": "url('/photos/mosquee-salle.jpg')" } as CSSProperties}
              aria-label="Lancer la visite virtuelle 360°"
            >
              <span className="pattern-svg pointer-events-none absolute inset-0 opacity-40" aria-hidden />
              <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold-500 text-emerald-900 shadow-lift transition group-hover:scale-110">
                <Icon.cube width={34} height={34} />
              </span>
              <span className="relative font-display text-2xl font-semibold">
                Lancer la visite immersive
              </span>
              <span className="relative text-sm text-sand-100/80">
                Cliquez pour charger l&apos;expérience 360°
              </span>
            </button>
          )}
        </div>
      </Reveal>

      <div className="mt-6 flex justify-center">
        <a href={LINKS.visiteVirtuelle} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          Ouvrir en plein écran <Icon.arrow width={16} height={16} />
        </a>
      </div>
    </section>
  );
}
