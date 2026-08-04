"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { LINKS, PHOTOS } from "@/lib/site";
import { Icon } from "@/components/Icons";

// Invitation immersive — section bleu nuit, aperçu panoramique qui suit
// légèrement la souris, et chargement de l'expérience 360° uniquement
// sur action de l'utilisateur (aucune iframe lourde au chargement).

export default function VirtualTourSection() {
  const [active, setActive] = useState(false);
  const [shift, setShift] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Déplacement horizontal très contenu : ±14 px, jamais de parallaxe brutale.
    setShift(((e.clientX - rect.left) / rect.width - 0.5) * 28);
  }

  return (
    <div className="mt-10" data-reveal>
      <div
        ref={frameRef}
        onMouseMove={onMove}
        onMouseLeave={() => setShift(0)}
        className="relative aspect-[16/10] w-full overflow-hidden bg-night-950 sm:aspect-[16/9]"
      >
        {active ? (
          <iframe
            src={LINKS.visiteVirtuelle}
            title="Visite virtuelle 360° de la Grande Mosquée de Creil"
            className="absolute inset-0 h-full w-full"
            allowFullScreen
          />
        ) : (
          <>
            <Image
              src={PHOTOS.salle.src}
              alt={PHOTOS.salle.alt}
              fill
              quality={76}
              loading="lazy"
              sizes="100vw"
              className="object-cover opacity-60 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(${shift}px) scale(1.06)` }}
            />
            <div
              className="mesh-invert mesh-faint absolute inset-0 bg-night-950/45"
              aria-hidden
            />

            <div className="on-dark absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-sand-50">
              <span className="flex items-center gap-2.5 text-[10.5px] font-bold uppercase tracking-[0.2em] text-terra-300">
                <span className="h-px w-7 bg-terra-500" aria-hidden />
                Expérience 360°
                <span className="h-px w-7 bg-terra-500" aria-hidden />
              </span>
              <p className="title-lg mt-5 max-w-2xl">
                Entrez dans Essalam
                <br />
                avant même de franchir ses portes.
              </p>
              <button
                type="button"
                onClick={() => setActive(true)}
                className="btn btn-outline-invert mt-8"
              >
                <Icon.cube width={18} height={18} />
                Lancer la visite
              </button>
              <p className="mt-4 max-w-md text-[13px] text-night-200">
                L’expérience ne se charge qu’à votre demande, pour préserver votre
                connexion.
              </p>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[13px] text-night-200">
          Panorama de la salle de prière et des espaces d’accueil.
        </p>
        <a
          href={LINKS.visiteVirtuelle}
          target="_blank"
          rel="noopener noreferrer"
          className="link-arrow"
        >
          Ouvrir la visite dans un nouvel onglet
          <Icon.arrowUpRight width={16} height={16} className="arw" />
        </a>
      </div>
    </div>
  );
}
