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
          {/* halo doré */}
          <div className="pointer-events-none absolute h-[520px] w-[520px] rounded-full bg-gold-500/15 blur-3xl" aria-hidden />
          <div className="pattern-svg pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />

          {/* Logo + anneaux qui tournent */}
          <div className="relative mb-8 grid place-items-center">
            <motion.span
              className="absolute h-32 w-32 rounded-full border border-gold-400/40 border-t-gold-400"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
            />
            <motion.span
              className="absolute h-44 w-44 rounded-full border border-emerald-400/20 border-b-emerald-300/60"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="https://accmo.org/wp-content/uploads/2023/04/cropped-cropped-logo-creil-150x150-1.webp"
                alt="Logo Grande Mosquée de Creil"
                width={84}
                height={84}
                className="rounded-full ring-1 ring-gold-400/30"
                priority
              />
            </motion.div>
          </div>

          <motion.p
            className="font-arabic text-xl text-gold-400"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </motion.p>

          <motion.h1
            className="mt-3 text-center font-mega text-lg font-bold uppercase tracking-[0.2em] sm:text-2xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            Grande Mosquée de Creil
          </motion.h1>

          {/* Barre de progression */}
          <div className="mt-10 h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-300"
              animate={{ width: `${pct}%` }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            />
          </div>
          <p className="mt-3 font-mega text-xs tracking-widest text-sand-100/60">{pct}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
