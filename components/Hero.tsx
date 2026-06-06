"use client";

import { useRef } from "react";
import Image from "next/image";
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

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });
      tl.from("[data-hero='bismillah']", { opacity: 0, y: 12, duration: 0.6 })
        .from("[data-hero='line']", { opacity: 0, y: 34, duration: 0.7, stagger: 0.12 }, "-=0.3")
        .from("[data-hero='cta']", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, "-=0.3")
        .from("[data-hero='stat']", { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 }, "-=0.2");

      STATS.forEach((s, i) => {
        const el = root.current?.querySelector<HTMLElement>(`[data-count='${i}']`);
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: s.k,
          duration: 1.6,
          delay: 1,
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
      className="relative min-h-screen overflow-hidden bg-emerald-950 text-sand-50"
    >
      {/* Photo de la mosquée (minaret) en fond */}
      <Image
        src="/photos/mosquee-exterieur.png"
        alt="Façade et minaret de la Grande Mosquée de Creil"
        fill
        priority
        sizes="100vw"
        className="animate-kenburns object-cover object-[75%_center]"
      />

      {/* Voiles pour la lisibilité du texte */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/70 to-emerald-950/20" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-emerald-950 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute -top-32 right-0 h-[520px] w-[520px] rounded-full bg-gold-500/15 blur-3xl animate-float-slow" aria-hidden />

      <div className="container-x relative flex min-h-screen flex-col justify-center pt-28 pb-28">
        <span
          data-hero="bismillah"
          className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold-400/40 bg-emerald-900/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300 backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
          </span>
          Apprendre · Comprendre · Pratiquer
        </span>

        <h1 className="font-mega font-bold leading-[0.98] tracking-tight [text-shadow:0_6px_40px_rgba(0,0,0,0.6)]">
          <span data-hero="line" className="block text-4xl text-sand-50 sm:text-6xl lg:text-7xl">
            Grande
          </span>
          <span data-hero="line" className="title-shine block text-4xl sm:text-6xl lg:text-7xl">
            Mosquée
          </span>
          <span data-hero="line" className="mt-3 block font-heading text-2xl font-semibold tracking-normal text-emerald-100/90 sm:text-3xl">
            de Creil — Essalam
          </span>
        </h1>

        <p data-hero="line" className="mt-6 max-w-md text-base text-sand-100/85 sm:text-lg">
          Un lieu de prière, de savoir et de solidarité au cœur de Creil.
          Bienvenue dans votre maison spirituelle.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a data-hero="cta" href="#horaires" className="btn-gold">
            <Icon.clock width={18} height={18} /> Horaires de prière
          </a>
          <a
            data-hero="cta"
            href={LINKS.visiteVirtuelle}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost !text-sand-50 !ring-white/30 hover:!bg-white/10"
          >
            <Icon.cube width={18} height={18} /> Visite virtuelle
          </a>
        </div>

        <dl className="mt-14 grid w-fit grid-cols-3 gap-6 sm:gap-12">
          {STATS.map((s, i) => (
            <div data-hero="stat" key={s.v}>
              <dt data-count={i} className="font-mega text-2xl font-bold text-gold-400 sm:text-4xl">
                0{s.suffix}
              </dt>
              <dd className="mt-1 text-xs uppercase tracking-wider text-sand-100/70 sm:text-sm">{s.v}</dd>
            </div>
          ))}
        </dl>

        <a
          href="#apropos"
          aria-label="Faire défiler vers le contenu"
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-sand-100/70 animate-bob-down"
        >
          <Icon.arrow width={24} height={24} className="rotate-90" />
        </a>
      </div>

      {/* Bandeau défilant des disciplines */}
      <div className="relative border-t border-white/10 bg-emerald-950/70 py-4 backdrop-blur-sm">
        <div className="marquee-track gap-10 px-5" aria-hidden>
          {[...DISCIPLINES, ...DISCIPLINES].map((d, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-10 text-sm font-semibold uppercase tracking-widest text-sand-100/80"
            >
              {d}
              <span className="text-gold-400">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
