import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { PHOTOS, ROUTES } from "@/lib/site";
import { Icon } from "@/components/Icons";

// Quatre types d'en-têtes pour les pages intérieures, afin qu'aucune page
// ne donne l'impression d'être le même gabarit avec un titre différent :
//
//   editorial   — grand titre + chapô sur deux colonnes (pages de fond)
//   functional  — titre compact + information utile à droite (outils)
//   compact     — filet + titre sur une ligne (pages légales)
//   photo       — bandeau photographique bas, cadrage architectural
//
// Un fil d'Ariane discret rappelle toujours le chemin depuis l'accueil.

type Common = {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
};

function Breadcrumb({ label, invert = false }: { label: string; invert?: boolean }) {
  return (
    <nav aria-label="Fil d’Ariane">
      <ol
        className={`flex items-center gap-2 text-[12px] ${
          invert ? "text-night-300" : "text-night-500"
        }`}
      >
        <li>
          <Link href={ROUTES.home} className="underline-offset-4 hover:underline">
            Accueil
          </Link>
        </li>
        <li aria-hidden>
          <Icon.chevron width={12} height={12} />
        </li>
        <li aria-current="page" className={invert ? "text-sand-50" : "text-night-800"}>
          {label}
        </li>
      </ol>
    </nav>
  );
}

/** En-tête éditorial — pages de fond (La mosquée, École). */
export function EditorialHeader({
  kicker,
  title,
  intro,
  aside,
  crumb,
}: Common & { aside?: ReactNode; crumb: string }) {
  return (
    <header className="border-b border-[var(--rule)] bg-[var(--color-surface)]">
      <div className="shell py-10 sm:py-14">
        <Breadcrumb label={crumb} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[58fr_42fr] lg:items-end lg:gap-14">
          <div>
            <p className="flex items-center gap-3 text-[11.5px] font-bold uppercase tracking-[0.15em] text-night-600">
              <span className="h-px w-8 bg-terra-500" aria-hidden />
              {kicker}
            </p>
            <h1 className="title-xl mt-5 text-night-900">{title}</h1>
          </div>
          <div>
            {intro && (
              <p className="text-[16.5px] leading-relaxed text-night-600">{intro}</p>
            )}
            {aside && <div className="mt-6">{aside}</div>}
          </div>
        </div>
      </div>
    </header>
  );
}

/** En-tête fonctionnel — pages outils (Horaires, Contact, Soutenir). */
export function FunctionalHeader({
  kicker,
  title,
  intro,
  meta,
  crumb,
}: Common & { meta?: ReactNode; crumb: string }) {
  return (
    <header className="on-dark border-b border-[var(--rule-invert)] bg-night-900 text-sand-50">
      <div className="shell py-9 sm:py-12">
        <Breadcrumb label={crumb} invert />
        <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-2xl">
            <p className="text-[11.5px] font-bold uppercase tracking-[0.15em] text-terra-400">
              {kicker}
            </p>
            <h1 className="title-lg mt-3 text-sand-50">{title}</h1>
            {intro && (
              <p className="mt-4 text-[16px] leading-relaxed text-night-200">{intro}</p>
            )}
          </div>
          {meta && <div className="shrink-0">{meta}</div>}
        </div>
      </div>
    </header>
  );
}

/** En-tête compact — pages légales et pages secondaires courtes. */
export function CompactHeader({ kicker, title, intro, crumb }: Common & { crumb: string }) {
  return (
    <header className="border-b border-[var(--rule)] bg-sand-100">
      <div className="shell py-8 sm:py-10">
        <Breadcrumb label={crumb} />
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-night-500">
          {kicker}
        </p>
        <h1 className="title-md mt-2 text-night-900">{title}</h1>
        {intro && (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-night-600">{intro}</p>
        )}
      </div>
    </header>
  );
}

/** En-tête photographique — usage ponctuel (Visite virtuelle, Annonces). */
export function PhotoHeader({
  kicker,
  title,
  intro,
  crumb,
  photo = "facade",
}: Common & { crumb: string; photo?: keyof typeof PHOTOS }) {
  const p = PHOTOS[photo];
  return (
    <header className="on-dark relative overflow-hidden bg-night-950 text-sand-50">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={p.src}
          alt=""
          fill
          priority
          quality={74}
          sizes="100vw"
          className="object-cover object-[center_40%] opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-night-950 via-night-950/80 to-night-950/25" />
      </div>
      <div className="shell relative py-14 sm:py-20">
        <Breadcrumb label={crumb} invert />
        <p className="mt-8 text-[11.5px] font-bold uppercase tracking-[0.15em] text-terra-300">
          {kicker}
        </p>
        <h1 className="title-xl mt-4 max-w-3xl text-sand-50">{title}</h1>
        {intro && (
          <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-night-100">
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}
