"use client";

import { LINKS } from "@/lib/site";
import FadeIn from "@/components/FadeIn";
import AnimatedHeading from "@/components/AnimatedHeading";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

export default function Hero() {
  return (
    <section id="accueil" className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Vidéo de fond plein écran — aucun voile ni dégradé par-dessus */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Contenu (poussé en bas du viewport) */}
      <div className="relative z-10 flex h-full flex-col px-6 md:px-12 lg:px-16">
        <div className="flex flex-1 flex-col justify-end pb-12 lg:pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:items-end">
            {/* Colonne gauche — contenu principal */}
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

            {/* Colonne droite — tag */}
            <FadeIn
              delay={1400}
              duration={1000}
              className="mt-8 flex items-end justify-start lg:mt-0 lg:justify-end"
            >
              <div className="liquid-glass rounded-xl border border-white/20 px-6 py-3">
                <span className="text-lg font-light md:text-xl lg:text-2xl">
                  Prière · Savoir · Solidarité.
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
