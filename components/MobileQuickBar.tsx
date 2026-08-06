"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/site";
import { Icon, type IconName } from "@/components/Icons";

// Barre d'accès rapide, mobile uniquement : les quatre destinations
// réellement recherchées sur téléphone. Zones tactiles de 56 px,
// libellés visibles (jamais d'icône seule).

const ITEMS: { label: string; href: string; icon: IconName }[] = [
  { label: "Accueil", href: ROUTES.home, icon: "home" },
  { label: "Prières", href: ROUTES.horaires, icon: "clock" },
  { label: "Annonces", href: ROUTES.annonces, icon: "list" },
  { label: "Soutenir", href: ROUTES.don, icon: "hand" },
];

export default function MobileQuickBar() {
  const pathname = usePathname();

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
          const Ico = Icon[item.icon];
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-[58px] flex-col items-center justify-center gap-1 border-t-2 transition-colors ${
                  active
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
