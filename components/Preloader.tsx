"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.style.overflow = "hidden";

    let p = 0;
    const id = window.setInterval(() => {
      p = Math.min(100, p + Math.random() * 13 + 5);
      setPct(Math.floor(p));
      if (p >= 100) window.clearInterval(id);
    }, 120);

    const min = window.setTimeout(() => setDone(true), reduce ? 300 : 2300);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(min);
    };
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-emerald-950 text-sand-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          {/* Mosaïque zellige en fond */}
          <Image
            src="/photos/mosaique-zellige.png"
            alt=""
            fill
            aria-hidden
            className="object-cover opacity-30"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,23,16,0.45)_0%,rgba(8,23,16,0.92)_70%)]" aria-hidden />
          {/* halo doré */}
          <div className="pointer-events-none absolute h-[520px] w-[520px] rounded-full bg-gold-500/15 blur-3xl" aria-hidden />

          {/* Logo qui s'allume de bas en haut au fil du chargement */}
          <div className="relative z-10 mb-8 grid h-40 w-40 place-items-center rounded-full bg-sand-50 p-5 shadow-[0_0_50px_rgba(212,175,86,0.35)] ring-1 ring-gold-400/40">
            <div className="relative h-full w-full">
              {/* base atténuée (logo sur disque clair pour lisibilité du « ESSALAM ») */}
              <Image
                src="https://accmo.org/wp-content/uploads/2023/04/cropped-cropped-logo-creil-150x150-1.webp"
                alt="Logo Grande Mosquée de Creil"
                fill
                priority
                className="object-contain opacity-25"
              />
              {/* version pleine, révélée du bas vers le haut */}
              <div
                className="absolute inset-0 transition-[clip-path] duration-200 ease-out"
                style={{ clipPath: `inset(${100 - pct}% 0 0 0)` }}
              >
                <Image
                  src="https://accmo.org/wp-content/uploads/2023/04/cropped-cropped-logo-creil-150x150-1.webp"
                  alt=""
                  fill
                  aria-hidden
                  className="object-contain"
                />
              </div>
              {/* ligne lumineuse au niveau du remplissage */}
              <div
                className="pointer-events-none absolute inset-x-0 h-px bg-gold-500 shadow-[0_0_12px_2px_rgba(198,154,60,0.8)] transition-all duration-200"
                style={{ top: `${100 - pct}%`, opacity: pct > 2 && pct < 99 ? 1 : 0 }}
              />
            </div>
          </div>

          <motion.p
            className="relative z-10 font-arabic text-xl text-gold-400"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </motion.p>

          <motion.h1
            className="relative z-10 mt-3 text-center font-lux text-2xl font-medium uppercase tracking-[0.3em] sm:text-4xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            Grande Mosquée de Creil
          </motion.h1>

          {/* Barre de progression */}
          <div className="relative z-10 mt-10 h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-300"
              animate={{ width: `${pct}%` }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            />
          </div>
          <p className="relative z-10 mt-3 font-mega text-xs tracking-widest text-sand-100/60">{pct}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
