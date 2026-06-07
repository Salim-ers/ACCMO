"use client";

import Image from "next/image";
import { LINKS } from "@/lib/site";
import FadeIn from "@/components/FadeIn";
import AnimatedHeading from "@/components/AnimatedHeading";

export default function Hero() {
  return (
    <section id="accueil" className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Photo de la mosquée en fond plein écran */}
      <Image
        src="/photos/mosquee-facade.jpg"
        alt="Façade et minaret de la Grande Mosquée de Creil"
        fill
        priority
        quality={95}
        sizes="100vw"
        className="object-cover object-[center_40%] [filter:contrast(1.06)_saturate(1.1)_brightness(1.02)]"
      />
      {/* Grain fin pour masquer le flou de l'agrandissement */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "160px 160px",
        }}
      />
      {/* Dégradé bas pour la lisibilité du texte blanc */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" aria-hidden />

      {/* Contenu (poussé en bas du viewport) */}
      <div className="relative z-10 flex h-full flex-col px-6 md:px-12 lg:px-16">
        <div className="flex flex-1 flex-col justify-end pb-12 lg:pb-16">
          <div>
            {/* Contenu principal */}
            <div>
              <AnimatedHeading
                text={"Grande Mosquée de Creil\nPrière, savoir & solidarité."}
                className="mb-4 text-4xl font-normal md:text-5xl lg:text-6xl xl:text-7xl"
                style={{ letterSpacing: "-0.04em" }}
              />

              <FadeIn delay={800} duration={1000}>
                <p className="mb-5 max-w-xl text-base text-gray-300 md:text-lg">
                  Un lieu de prière, de savoir et de solidarité au cœur de Creil.
                  Bienvenue dans votre maison spirituelle.
                </p>
              </FadeIn>

              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={LINKS.don}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-gray-100"
                  >
                    Faire un don
                  </a>
                  <a
                    href={LINKS.visiteVirtuelle}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black"
                  >
                    Visite virtuelle
                  </a>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
