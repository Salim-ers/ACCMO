"use client";

import { useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { LINKS, DISCIPLINES } from "@/lib/site";
import { Icon } from "@/components/Icons";

const STATS = [
  { k: 5, suffix: "", v: "prières / jour" },
  { k: 30, suffix: "+", v: "ans au service" },
  { k: 360, suffix: "°", v: "visite immersive" },
];

export default function Hero() {
  const root = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero='arch']", { scaleY: 0.6, opacity: 0, transformOrigin: "bottom", duration: 1.1 })
        .from("[data-hero='bismillah']", { opacity: 0, y: 12, duration: 0.6 }, "-=0.6")
        .from("[data-hero='line']", { opacity: 0, y: 30, duration: 0.7, stagger: 0.12 }, "-=0.3")
        .from("[data-hero='cta']", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, "-=0.3")
        .from("[data-hero='stat']", { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 }, "-=0.2");

      // Léger flottement de l'arche
      gsap.to("[data-hero='arch']", {
        y: -10,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Compteurs animés des statistiques
      STATS.forEach((s, i) => {
        const el = root.current?.querySelector<HTMLElement>(`[data-count='${i}']`);
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: s.k,
          duration: 1.6,
          delay: 0.8,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + s.suffix;
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      id="accueil"
      ref={root}
      className="photo-bg relative overflow-hidden text-sand-50"
      style={{ "--photo": "url('/photos/mosquee-exterieur.png')" } as CSSProperties}
    >
      {/* Motif géométrique en filigrane (visible surtout sans photo) */}
      <div className="pattern-svg pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      {/* Orbes dorées / émeraude flottantes pour la profondeur */}
      <div className="pointer-events-none absolute -top-24 left-[15%] h-[420px] w-[420px] rounded-full bg-gold-500/25 blur-3xl animate-float-slow" aria-hidden />
      <div className="pointer-events-none absolute bottom-10 right-[12%] h-[320px] w-[320px] rounded-full bg-emerald-400/20 blur-3xl animate-float" aria-hidden />

      <div className="container-x relative flex min-h-[92vh] flex-col items-center justify-center pt-28 pb-28 text-center">
        {/* Arche / mihrab décoratif */}
        <svg
          data-hero="arch"
          viewBox="0 0 200 240"
          className="absolute top-24 h-[340px] w-auto opacity-30"
          aria-hidden
        >
          <path
            d="M20 240 V120 a80 80 0 0 1 160 0 V240"
            fill="none"
            stroke="url(#g)"
            strokeWidth="2"
          />
          <path d="M40 240 V120 a60 60 0 0 1 120 0 V240" fill="none" stroke="url(#g)" strokeWidth="1" opacity="0.6" />
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d4af56" />
              <stop offset="1" stopColor="#d4af56" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <p data-hero="bismillah" className="font-arabic text-2xl text-gold-400 mb-6 drop-shadow">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        <span
          data-hero="line"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-emerald-900/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300 backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
          </span>
          Apprendre · Comprendre · Pratiquer
        </span>

        <h1 className="relative font-heading font-extrabold uppercase leading-[0.92] tracking-tight [text-shadow:0_4px_30px_rgba(0,0,0,0.45)]">
          <span data-hero="line" className="block text-4xl text-sand-50 sm:text-6xl lg:text-7xl">
            Grande Mosquée
          </span>
          <span data-hero="line" className="title-shine block text-5xl sm:text-7xl lg:text-8xl">
            de Creil
          </span>
        </h1>

        <div data-hero="line" className="mt-5 flex items-center gap-3 text-gold-300">
          <span className="h-px w-10 bg-gold-400/70" aria-hidden />
          <span className="font-display text-lg italic tracking-wide">Essalam · ACCMO</span>
          <span className="h-px w-10 bg-gold-400/70" aria-hidden />
        </div>

        <p data-hero="line" className="mt-6 max-w-xl text-base sm:text-lg text-sand-100/90">
          Un lieu de prière, de savoir et de solidarité au cœur de Creil.
          Bienvenue dans votre maison spirituelle.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a data-hero="cta" href="#horaires" className="btn-gold">
            <Icon.clock width={18} height={18} /> Horaires de prière
          </a>
          <a data-hero="cta" href={LINKS.visiteVirtuelle} target="_blank" rel="noopener noreferrer" className="btn-ghost !text-sand-50 !ring-white/30 hover:!bg-white/10">
            <Icon.cube width={18} height={18} /> Visite virtuelle
          </a>
        </div>

        <dl className="mt-14 grid grid-cols-3 gap-6 sm:gap-12 text-center">
          {STATS.map((s, i) => (
            <div data-hero="stat" key={s.v}>
              <dt
                data-count={i}
                className="font-display text-3xl sm:text-4xl text-gold-400"
              >
                0{s.suffix}
              </dt>
              <dd className="text-xs sm:text-sm uppercase tracking-wider text-sand-100/75">{s.v}</dd>
            </div>
          ))}
        </dl>

        {/* Indicateur de défilement */}
        <a
          href="#horaires"
          aria-label="Faire défiler vers le contenu"
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-sand-100/70 animate-bob-down"
        >
          <Icon.arrow width={24} height={24} className="rotate-90" />
        </a>
      </div>

      {/* Bandeau défilant des disciplines (clin d'œil à l'affiche) */}
      <div className="relative border-t border-white/10 bg-emerald-900/60 py-4 backdrop-blur-sm">
        <div className="marquee-track gap-10 px-5" aria-hidden>
          {[...DISCIPLINES, ...DISCIPLINES].map((d, i) => (
            <span key={i} className="flex shrink-0 items-center gap-10 text-sm font-semibold uppercase tracking-widest text-sand-100/80">
              {d}
              <span className="text-gold-400">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
