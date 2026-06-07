"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { NAV, LINKS } from "@/lib/site";
import { Icon } from "@/components/Icons";

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-6 pt-6 md:px-12 lg:px-16">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-8 focus:top-8 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Aller au contenu
      </a>

      <div className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2 text-white">
        {/* Logo + nom */}
        <a href="#accueil" className="flex items-center gap-3" aria-label="Accueil — Mosquée de Creil">
          <Image
            src="https://accmo.org/wp-content/uploads/2023/04/cropped-cropped-logo-creil-150x150-1.webp"
            alt="Logo de la Grande Mosquée de Creil"
            width={36}
            height={36}
            className="rounded-full ring-1 ring-white/20"
            priority
          />
          <span className="text-xl font-semibold tracking-tight sm:text-2xl">Mosquée de Creil</span>
        </a>

        {/* Liens (desktop) */}
        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="text-sm text-white transition-colors hover:text-gray-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action + menu mobile */}
        <div className="flex items-center gap-2">
          <a
            href={LINKS.don}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100 sm:inline-flex"
          >
            Faire un don
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden"
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
        className={`fixed inset-0 z-40 flex flex-col bg-black/95 px-8 pt-28 pb-10 text-white backdrop-blur-md transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Navigation mobile" className="flex flex-col gap-1">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-4 text-2xl font-light"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={LINKS.don}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="mt-auto rounded-lg bg-white px-6 py-3 text-center font-medium text-black"
        >
          Faire un don
        </a>
      </div>
    </header>
  );
}
