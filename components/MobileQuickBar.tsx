"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/site";
import { Icon, type IconName } from "@/components/Icons";

// Barre d'accès rapide, mobile uniquement : les quatre destinations
// réellement recherchées sur téléphone. Zones tactiles de 56 px,
// libellés visibles (jamais d'icône seule).
//
// Réactivité au doigt : sur téléphone, entre l'appui et l'affichage de la
// nouvelle page il s'écoule toujours un instant. Sans repère visuel, cet
// instant est vécu comme un blocage — on appuie, rien ne bouge. On marque
// donc la destination choisie DÈS l'appui (`pending`), sans attendre la
// réponse : le doigt obtient une réponse immédiate, et l'état bascule
// naturellement sur la page réelle quand elle arrive.

const ITEMS: { label: string; href: string; icon: IconName }[] = [
  { label: "Accueil", href: ROUTES.home, icon: "home" },
  { label: "Prières", href: ROUTES.horaires, icon: "clock" },
  { label: "Annonces", href: ROUTES.annonces, icon: "list" },
  { label: "Soutenir", href: ROUTES.don, icon: "hand" },
];

export default function MobileQuickBar() {
  const pathname = usePathname();
  const [pending, setPending] = useState<string | null>(null);

  // La navigation est terminée : l'état réel reprend la main.
  useEffect(() => {
    setPending(null);
  }, [pathname]);

  // L'espace d'administration garde son propre cadre.
  if (pathname.startsWith(ROUTES.admin)) return null;

  return (
    <nav
      aria-label="Accès rapide"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--rule)] bg-[var(--color-surface)] sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const active =
            item.href === ROUTES.home
              ? pathname === item.href
              : pathname.startsWith(item.href);
          // Tant qu'une navigation est en cours, c'est la destination
          // demandée qui est mise en avant, pas la page encore affichée.
          const marque = pending ? pending === item.href : active;
          const Ico = Icon[item.icon];
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setPending(item.href)}
                className={`flex h-[58px] touch-manipulation flex-col items-center justify-center gap-1 border-t-2 transition-colors duration-150 active:bg-sand-200 ${
                  marque
                    ? "border-terra-500 text-night-900"
                    : "border-transparent text-night-500"
                }`}
              >
                <Ico width={19} height={19} />
                <span className="text-[11px] font-bold tracking-wide">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
