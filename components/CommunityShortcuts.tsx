import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { PHOTOS, SHORTCUTS, type Shortcut } from "@/lib/site";
import { Icon, type IconName } from "@/components/Icons";

// Panneau d'orientation — les démarches les plus demandées, présentées
// comme une signalétique architecturale : blocs de formats différents
// tenus par une même grille, jamais huit cartes blanches identiques.

type Variant = "major" | "photo" | "plain" | "accent" | "line" | "sand";

const LAYOUT: Record<string, { variant: Variant; span: string; photo?: keyof typeof PHOTOS }> = {
  inscrire: { variant: "major", span: "md:col-span-6" },
  ecole: { variant: "photo", span: "md:col-span-3", photo: "interieur" },
  annonces: { variant: "plain", span: "md:col-span-3" },
  janaza: { variant: "sand", span: "md:col-span-4" },
  visite: { variant: "photo", span: "md:col-span-4", photo: "salle" },
  don: { variant: "accent", span: "md:col-span-4" },
  contact: { variant: "line", span: "md:col-span-7" },
  itineraire: { variant: "line", span: "md:col-span-5" },
};

function Shell({
  item,
  className,
  children,
}: {
  item: Shortcut;
  className: string;
  children: ReactNode;
}) {
  const shared = `group relative flex flex-col ${className}`;
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={shared}
        data-reveal
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={item.href} className={shared} data-reveal>
      {children}
    </Link>
  );
}

export default function CommunityShortcuts() {
  return (
    <div className="mt-10 grid gap-3 md:grid-cols-12">
      {SHORTCUTS.map((item) => {
        const cfg = LAYOUT[item.key];
        const Ico = Icon[item.icon as IconName] ?? Icon.arrow;

        // ---- Bloc majeur : la démarche la plus demandée de l'année ----
        if (cfg.variant === "major") {
          return (
            <Shell
              key={item.key}
              item={item}
              className={`${cfg.span} min-h-[190px] justify-between bg-night-900 p-7 text-sand-50 transition-colors hover:bg-night-800`}
            >
              <span className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-terra-300">
                <Ico width={17} height={17} />
                Démarche prioritaire
              </span>
              <span className="mt-8">
                <span className="block text-[27px] font-extrabold leading-tight tracking-tightest sm:text-[32px]">
                  {item.label}
                </span>
                <span className="mt-2 block max-w-md text-[14.5px] leading-relaxed text-night-200">
                  {item.desc}
                </span>
              </span>
              <span className="mt-6 flex items-center gap-2 text-[13.5px] font-semibold text-sand-50">
                Ouvrir le formulaire
                <Icon.arrowUpRight
                  width={16}
                  height={16}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </span>
            </Shell>
          );
        }

        // ---- Bloc photographique ----
        if (cfg.variant === "photo") {
          const photo = PHOTOS[cfg.photo ?? "salle"];
          return (
            <Shell
              key={item.key}
              item={item}
              className={`${cfg.span} min-h-[190px] justify-end overflow-hidden p-6 text-sand-50`}
            >
              <span className="absolute inset-0" aria-hidden>
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  quality={72}
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-night-950/90 via-night-950/45 to-night-950/10" />
              </span>
              <span className="relative">
                <Ico width={18} height={18} className="text-terra-300" />
                <span className="mt-3 block text-[19px] font-extrabold leading-tight tracking-tight">
                  {item.label}
                </span>
                <span className="mt-1.5 flex items-center gap-1.5 text-[13px] text-night-100">
                  {item.desc}
                </span>
              </span>
            </Shell>
          );
        }

        // ---- Bloc accent terre cuite ----
        if (cfg.variant === "accent") {
          return (
            <Shell
              key={item.key}
              item={item}
              className={`${cfg.span} min-h-[190px] justify-between bg-terra-600 p-6 text-white transition-colors hover:bg-terra-700`}
            >
              <Ico width={20} height={20} className="text-white" />
              <span className="mt-6">
                <span className="block text-[22px] font-extrabold leading-tight tracking-tight">
                  {item.label}
                </span>
                <span className="mt-1.5 block text-[13.5px] leading-relaxed text-white">
                  {item.desc}
                </span>
              </span>
              <span className="mt-5 flex items-center gap-2 text-[13px] font-semibold">
                Y aller
                <Icon.arrow
                  width={16}
                  height={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Shell>
          );
        }

        // ---- Bloc sable ----
        if (cfg.variant === "sand") {
          return (
            <Shell
              key={item.key}
              item={item}
              className={`${cfg.span} min-h-[190px] justify-between bg-sand-200 p-6 text-night-900 transition-colors hover:bg-sand-300`}
            >
              <Ico width={20} height={20} className="text-terra-600" />
              <span className="mt-6">
                <span className="block text-[22px] font-extrabold leading-tight tracking-tight">
                  {item.label}
                </span>
                <span className="mt-1.5 block text-[13.5px] leading-relaxed text-night-600">
                  {item.desc}
                </span>
              </span>
              <span className="mt-5 flex items-center gap-2 text-[13px] font-semibold text-night-800">
                En savoir plus
                <Icon.arrow
                  width={16}
                  height={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Shell>
          );
        }

        // ---- Ligne typographique (action minimaliste) ----
        if (cfg.variant === "line") {
          return (
            <Shell
              key={item.key}
              item={item}
              className={`${cfg.span} min-h-[92px] flex-row items-center justify-between gap-4 border border-[var(--rule)] bg-white px-6 py-5 transition-colors hover:border-night-900`}
            >
              <span className="flex min-w-0 items-center gap-4">
                <Ico width={19} height={19} className="shrink-0 text-terra-600" />
                <span className="min-w-0">
                  <span className="block text-[18px] font-bold leading-tight tracking-tight text-night-900">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] text-night-600">
                    {item.desc}
                  </span>
                </span>
              </span>
              {item.external ? (
                <Icon.arrowUpRight
                  width={18}
                  height={18}
                  className="shrink-0 text-night-500 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-terra-600"
                />
              ) : (
                <Icon.arrow
                  width={18}
                  height={18}
                  className="shrink-0 text-night-500 transition-transform group-hover:translate-x-1 group-hover:text-terra-600"
                />
              )}
            </Shell>
          );
        }

        // ---- Bloc simple ----
        return (
          <Shell
            key={item.key}
            item={item}
            className={`${cfg.span} min-h-[190px] justify-between border border-[var(--rule)] bg-white p-6 transition-colors hover:border-night-900`}
          >
            <Ico width={20} height={20} className="text-terra-600" />
            <span className="mt-6">
              <span className="block text-[20px] font-extrabold leading-tight tracking-tight text-night-900">
                {item.label}
              </span>
              <span className="mt-1.5 block text-[13.5px] leading-relaxed text-night-600">
                {item.desc}
              </span>
            </span>
            <span className="mt-5 flex items-center gap-2 text-[13px] font-semibold text-night-800">
              Consulter
              <Icon.arrow
                width={16}
                height={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </Shell>
        );
      })}
    </div>
  );
}
