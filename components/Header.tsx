"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { NAV, LINKS } from "@/lib/site";
import { Icon } from "@/components/Icons";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Construit la timeline d'ouverture du menu mobile.
  useGSAP(
    () => {
      if (!panelRef.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const links = panelRef.current.querySelectorAll("[data-mobile-link]");
      tl.current = gsap
        .timeline({ paused: true })
        .set(panelRef.current, { display: "flex" })
        .fromTo(
          panelRef.current,
          { opacity: 0 },
          { opacity: 1, duration: reduce ? 0 : 0.25, ease: "power2.out" }
        )
        .fromTo(
          links,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: reduce ? 0 : 0.4,
            stagger: reduce ? 0 : 0.06,
            ease: "power3.out",
          },
          "-=0.1"
        );
    },
    { scope: panelRef }
  );

  useEffect(() => {
    if (!tl.current) return;
    if (open) tl.current.play();
    else tl.current.reverse();
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Fermeture clavier (Échap)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-sand-50/90 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
      style={{ height: "var(--header-h)" }}
    >
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-sand-50"
      >
        Aller au contenu
      </a>

      <div className="container-x flex h-full items-center justify-between gap-4">
        <a href="#accueil" className="flex items-center gap-3" aria-label="Accueil — ACCMO">
          <Image
            src="https://accmo.org/wp-content/uploads/2023/04/cropped-cropped-logo-creil-150x150-1.webp"
            alt="Logo de la Grande Mosquée de Creil"
            width={44}
            height={44}
            className="rounded-full ring-1 ring-white/20"
            priority
          />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className={`font-display text-base font-semibold transition-colors ${scrolled ? "text-emerald-800" : "text-sand-50"}`}>
              Mosquée de Creil
            </span>
            <span className={`text-[11px] uppercase tracking-widest transition-colors ${scrolled ? "text-emerald-600/80" : "text-gold-300"}`}>
              Essalam · ACCMO
            </span>
          </span>
        </a>

        {/* Nav desktop */}
        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                    scrolled
                      ? "text-emerald-800/90 hover:bg-emerald-50 hover:text-emerald-900"
                      : "text-sand-50/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={LINKS.don} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex btn-gold !px-5 !py-2.5">
            Faire un don
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 transition ${
              scrolled ? "ring-emerald-900/15 text-emerald-800" : "ring-white/30 text-sand-50"
            }`}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <Icon.close /> : <Icon.menu />}
          </button>
        </div>
      </div>

      {/* Panneau mobile */}
      <div
        id="menu-mobile"
        ref={panelRef}
        className="pattern-geo fixed inset-0 top-0 z-40 hidden flex-col px-6 pt-28 pb-10 text-sand-50 lg:hidden"
        style={{ display: "none" }}
      >
        <nav aria-label="Navigation mobile" className="flex flex-col gap-1">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-mobile-link
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-4 font-display text-2xl"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3" data-mobile-link>
          <a href={LINKS.don} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
            Faire un don
          </a>
          <a href={LINKS.visiteVirtuelle} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full !text-sand-50 !ring-white/30">
            Visite virtuelle
          </a>
        </div>
      </div>
    </header>
  );
}
