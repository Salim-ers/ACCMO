"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DIRECTIONS_LINK, FULL_ADDRESS, LOGO, NAV, ROUTES, SITE } from "@/lib/site";
import { formatCountdown, type PrayerDay } from "@/lib/prayer";
import { usePrayerClock } from "@/lib/usePrayerClock";
import { toFrenchTime } from "@/lib/format";
import PrayerStatusBar from "@/components/PrayerStatusBar";
import { Icon } from "@/components/Icons";

// En-tête à trois zones : identité / navigation / actions.
// Horizontal, net, architectural sur desktop ; menu plein écran
// typographique sur mobile (jamais de tiroir latéral étroit).

export default function SiteHeader({ prayerDay }: { prayerDay: PrayerDay | null }) {
  const clock = usePrayerClock(prayerDay);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Fermeture à chaque changement de page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Verrouillage du défilement + Échap + piège au clavier maîtrisé.
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const isActive = (href: string) =>
    href === ROUTES.home ? pathname === href : pathname.startsWith(href);

  const next = clock.next;

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-night-900 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-sand-100"
      >
        Aller au contenu principal
      </a>

      <div className="sticky top-0 z-50">
        <PrayerStatusBar clock={clock} />

        <header className="border-b border-[var(--rule)] bg-[var(--color-surface)]">
          <div className="shell flex h-[var(--header-h)] items-center gap-6">
            {/* ---- Zone 1 : identité ---- */}
            <Link
              href={ROUTES.home}
              className="group flex shrink-0 items-center gap-3"
              aria-label={`${SITE.shortName} — ${SITE.tagline}, accueil`}
            >
              <Image
                src={LOGO}
                alt=""
                width={38}
                height={38}
                priority
                className="h-[34px] w-[34px] object-contain md:h-[38px] md:w-[38px]"
              />
              <span className="flex flex-col leading-none">
                <span className="text-[19px] font-extrabold tracking-tightest text-night-900 md:text-[21px]">
                  ESSALAM
                </span>
                <span className="mt-[3px] text-[11px] font-semibold uppercase tracking-[0.1em] text-night-600">
                  {SITE.tagline}
                </span>
              </span>
            </Link>

            {/* ---- Zone 2 : navigation ---- */}
            <nav
              aria-label="Navigation principale"
              className="mx-auto hidden lg:block"
            >
              <ul className="flex items-center gap-7">
                {NAV.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`relative block py-2 text-[14.5px] font-medium transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-terra-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                          active
                            ? "text-night-900 after:scale-x-100"
                            : "text-night-600 hover:text-night-900"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* ---- Zone 3 : deux actions différenciées ---- */}
            <div className="ml-auto flex items-center gap-2.5 lg:ml-0">
              <Link
                href={ROUTES.visite}
                className="btn btn-outline hidden !min-h-[42px] !px-4 !text-[13.5px] md:inline-flex"
              >
                Visite 360°
              </Link>
              <Link
                href={ROUTES.don}
                className="btn btn-primary hidden !min-h-[42px] !px-5 !text-[13.5px] sm:inline-flex"
              >
                Soutenir
                <Icon.arrow width={16} height={16} className="arw" />
              </Link>

              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="menu-principal"
                className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-night-900 lg:hidden"
              >
                <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
                {open ? <Icon.close width={22} height={22} /> : <Icon.menu width={22} height={22} />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* ---- Menu plein écran (mobile / tablette) ----
          L'ouverture se joue sur la CLASSE, pas sur l'attribut `hidden` :
          une classe utilitaire `flex` l'emporte sur `[hidden]` à égalité de
          spécificité. Le panneau restait donc affiché, plein écran, et
          recouvrait tout le site sous 1024 px ; seul `lg:hidden` le masquait
          sur grand écran, ce qui rendait le défaut invisible en test de
          bureau. */}
      <div
        id="menu-principal"
        ref={panelRef}
        className={`on-dark fixed inset-0 z-[60] flex-col overflow-y-auto bg-night-900 text-sand-50 lg:hidden ${
          open ? "flex" : "hidden"
        }`}
      >
        <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-[var(--rule-invert)] px-[var(--gutter)]">
          <span className="text-[19px] font-extrabold tracking-tightest">ESSALAM</span>
          <button
            type="button"
            onClick={close}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-sand-50"
          >
            <span className="sr-only">Fermer le menu</span>
            <Icon.close width={22} height={22} />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-[var(--gutter)] pb-10 pt-6">
          <p className="arabic text-[19px] text-terra-300">السلام عليكم ورحمة الله</p>

          {/* Prochaine prière, accessible sans défiler. */}
          {next && (
            <Link
              href={ROUTES.horaires}
              className="mt-5 flex items-center justify-between border-y border-[var(--rule-invert)] py-4"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-night-300">
                Prochaine prière
              </span>
              <span className="text-right">
                <span className="block text-[20px] font-extrabold tracking-tight">
                  {next.entry.label} · {toFrenchTime(next.entry.time)}
                </span>
                <span className="tabular block text-[12.5px] text-terra-300">
                  {formatCountdown(next.remaining)}
                </span>
              </span>
            </Link>
          )}

          <nav aria-label="Navigation principale (mobile)" className="mt-7">
            <ul>
              {NAV.map((item, i) => (
                <li key={item.href} className="border-b border-[var(--rule-invert)]">
                  <Link
                    href={item.href}
                    className="flex items-baseline gap-4 py-4"
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    <span className="tabular w-6 shrink-0 text-[11px] font-bold text-terra-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[28px] font-extrabold leading-tight tracking-tightest">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-night-300">
                        {item.desc}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 grid gap-2.5">
            <Link href={ROUTES.don} className="btn btn-accent w-full">
              Soutenir la mosquée
              <Icon.arrow width={17} height={17} className="arw" />
            </Link>
            <Link href={ROUTES.visite} className="btn btn-outline-invert w-full">
              Visite virtuelle 360°
            </Link>
          </div>

          <a
            href={DIRECTIONS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-start gap-3 border-t border-[var(--rule-invert)] pt-5 text-[14px] text-night-200"
          >
            <Icon.pin width={18} height={18} className="mt-0.5 shrink-0 text-terra-400" />
            <span>
              {FULL_ADDRESS}
              <span className="mt-1 block text-[12.5px] text-night-300">
                Ouvrir l&apos;itinéraire
              </span>
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
