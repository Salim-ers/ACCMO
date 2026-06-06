"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { LINKS } from "@/lib/site";
import { Icon } from "@/components/Icons";

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
    },
    { scope: root }
  );

  return (
    <section
      id="accueil"
      ref={root}
      className="pattern-geo relative overflow-hidden text-sand-50"
    >
      {/* dégradé d'ambiance */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-transparent to-emerald-900/80" aria-hidden />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gold-500/20 blur-3xl" aria-hidden />

      <div className="container-x relative flex min-h-[88vh] flex-col items-center justify-center pt-28 pb-20 text-center">
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

        <p data-hero="bismillah" className="font-arabic text-2xl text-gold-400 mb-6">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        <h1 className="relative font-display text-4xl sm:text-6xl font-semibold leading-tight">
          <span data-hero="line" className="block">Grande Mosquée</span>
          <span data-hero="line" className="block text-gold-400">de Creil — Essalam</span>
        </h1>

        <p data-hero="line" className="mt-6 max-w-xl text-base sm:text-lg text-sand-100/85">
          Un lieu de prière, de savoir et de solidarité au cœur de Creil.
          Bienvenue dans votre maison spirituelle.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a data-hero="cta" href="#horaires" className="btn-gold">
            <Icon.clock width={18} height={18} /> Horaires de prière
          </a>
          <a data-hero="cta" href={LINKS.visiteVirtuelle} target="_blank" rel="noopener noreferrer" className="btn-ghost !text-sand-50 !ring-white/30">
            <Icon.cube width={18} height={18} /> Visite virtuelle
          </a>
        </div>

        <dl className="mt-14 grid grid-cols-3 gap-6 sm:gap-12 text-center">
          {[
            { k: "5", v: "prières / jour" },
            { k: "+30", v: "ans au service" },
            { k: "360°", v: "visite immersive" },
          ].map((s) => (
            <div data-hero="stat" key={s.v}>
              <dt className="font-display text-3xl sm:text-4xl text-gold-400">{s.k}</dt>
              <dd className="text-xs sm:text-sm uppercase tracking-wider text-sand-100/70">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
