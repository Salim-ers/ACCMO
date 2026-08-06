"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Announcement } from "@/lib/announcements";
import { CATEGORIES, CATEGORY_TAG, type Category } from "@/lib/categories";
import { recurringFor, ROUTES } from "@/lib/site";
import { formatDate, splitDate } from "@/lib/format";
import { Icon } from "@/components/Icons";

// Agenda culturel plutôt que grille d'actualités :
// à gauche le rendez-vous mis en avant, à droite la liste chronologique
// des autres entrées. Aucun carrousel, aucune rotation automatique.

type Row = {
  id: string;
  title: string;
  body: string;
  category: Category;
  href?: string;
  cta?: string;
  external: boolean;
  /** Date réelle (annonces) ou libellé de période (démarches récurrentes). */
  date?: string;
  when?: string;
};

function toRows(items: Announcement[], aidEnabled: boolean): Row[] {
  const announcements: Row[] = items.map((a) => ({
    id: a.id,
    title: a.title,
    body: a.body,
    category: a.category,
    href: a.link || undefined,
    cta: a.linkLabel || "En savoir plus",
    external: Boolean(a.link && /^https?:/i.test(a.link)),
    date: a.date,
  }));

  const recurring: Row[] = recurringFor(aidEnabled).map((e) => ({
    id: `recurring-${e.title}`,
    title: e.title,
    body: e.desc,
    category: e.category,
    href: e.href,
    cta: e.cta,
    external: true,
    when: e.when,
  }));

  return [...announcements, ...recurring];
}

export default function EventsAgenda({
  items,
  featuredId,
  limit,
  aidEnabled = false,
}: {
  items: Announcement[];
  /** Ajoute la demarche saisonniere de l Aid quand elle est activee. */
  aidEnabled?: boolean;
  /** Identifiant de l'entrée mise en avant (calculée côté serveur). */
  featuredId?: string;
  /** Nombre maximum de lignes dans la colonne de droite. */
  limit?: number;
}) {
  const [filter, setFilter] = useState<Category | "Tous">("Tous");

  const rows = useMemo(() => toRows(items, aidEnabled), [items, aidEnabled]);
  const lead = rows.find((r) => r.id === featuredId) ?? rows[0];
  const rest = rows.filter((r) => r.id !== lead?.id);

  // Les filtres n'apparaissent que si la liste est assez fournie et
  // couvre réellement plusieurs rubriques.
  const presentCategories = CATEGORIES.filter((c) => rest.some((r) => r.category === c));
  const showFilters = rest.length >= 5 && presentCategories.length >= 2;

  const visible = (filter === "Tous" ? rest : rest.filter((r) => r.category === filter)).slice(
    0,
    limit ?? rest.length
  );

  const featuredAnnouncement = items.find((a) => a.id === lead?.id);

  if (!lead) {
    return (
      <p className="mt-10 border border-[var(--rule)] bg-white p-8 text-center text-[15px] text-night-600">
        Aucune annonce publiée pour le moment. Les prochains rendez-vous de la mosquée
        apparaîtront ici.
      </p>
    );
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-12">
      {/* ================= À la une ================= */}
      <article className="flex flex-col border-t-2 border-night-900 pt-6" data-reveal>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`tag ${CATEGORY_TAG[lead.category]}`}>{lead.category}</span>
          <span className="text-[12.5px] font-semibold uppercase tracking-wide text-night-500">
            {lead.date ? formatDate(lead.date) : lead.when}
          </span>
        </div>

        <h3 className="title-md mt-4 text-night-900">{lead.title}</h3>

        {featuredAnnouncement?.image && (
          <div className="frame frame-shift group mt-5 aspect-[16/10]">
            {/* Image téléversée depuis l'espace d'administration. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featuredAnnouncement.image}
              alt={`Illustration : ${lead.title}`}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        <p className="mt-4 text-[15.5px] leading-relaxed text-night-600">{lead.body}</p>

        {lead.href && (
          <div className="mt-6">
            {lead.external ? (
              <a
                href={lead.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {lead.cta}
                <Icon.arrowUpRight width={16} height={16} className="arw" />
              </a>
            ) : (
              <Link href={lead.href} className="btn btn-primary">
                {lead.cta}
                <Icon.arrow width={16} height={16} className="arw" />
              </Link>
            )}
          </div>
        )}
      </article>

      {/* ================= Liste chronologique ================= */}
      <div className="flex flex-col">
        {showFilters && (
          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--rule)] pt-5"
            role="group"
            aria-label="Filtrer l'agenda par rubrique"
          >
            {(["Tous", ...presentCategories] as const).map((c) => {
              const active = filter === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  aria-pressed={active}
                  className={`border-b-2 pb-1 text-[13.5px] font-semibold transition-colors ${
                    active
                      ? "border-terra-500 text-night-900"
                      : "border-transparent text-night-500 hover:text-night-900"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}

        <ul className={showFilters ? "mt-2" : "border-t border-[var(--rule)]"}>
          {visible.map((r) => {
            const d = r.date ? splitDate(r.date) : null;
            const cells = (
              <>
                {/* Date à gauche */}
                <span className="flex w-14 shrink-0 flex-col items-center border-r border-[var(--rule)] pr-3 text-center sm:w-16">
                  {d ? (
                    <>
                      <span className="tabular text-[22px] font-extrabold leading-none text-night-900">
                        {d.day}
                      </span>
                      <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-night-500">
                        {d.month}
                      </span>
                    </>
                  ) : (
                    <Icon.clock width={20} height={20} className="text-night-400" />
                  )}
                </span>

                {/* Titre au centre */}
                <span className="min-w-0 flex-1">
                  <span className="block text-[16.5px] font-bold leading-snug text-night-900">
                    {r.title}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className={`tag ${CATEGORY_TAG[r.category]}`}>{r.category}</span>
                    <span className="text-[12.5px] text-night-500">
                      {r.when ?? (r.date ? formatDate(r.date) : "")}
                    </span>
                  </span>
                </span>

                {/* Action à droite */}
                <span className="hidden shrink-0 items-center gap-1.5 text-[13px] font-semibold text-night-700 sm:flex">
                  {r.href ? r.cta : "Détail"}
                  {r.external ? (
                    <Icon.arrowUpRight
                      width={15}
                      height={15}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  ) : (
                    <Icon.arrow
                      width={15}
                      height={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </span>
              </>
            );

            const rowClass =
              "group flex items-center gap-4 border-b border-[var(--rule)] py-4 transition-colors hover:bg-white";

            return (
              <li key={r.id} data-reveal>
                {r.href ? (
                  r.external ? (
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={rowClass}
                    >
                      {cells}
                    </a>
                  ) : (
                    <Link href={r.href} className={rowClass}>
                      {cells}
                    </Link>
                  )
                ) : (
                  <div className={rowClass}>{cells}</div>
                )}
              </li>
            );
          })}
        </ul>

        {visible.length === 0 && (
          <p className="border-b border-[var(--rule)] py-8 text-[15px] text-night-500">
            Aucune entrée dans cette rubrique pour le moment.
          </p>
        )}

        {limit !== undefined && rest.length > visible.length && filter === "Tous" && (
          <Link href={ROUTES.annonces} className="link-arrow mt-6 self-start">
            Voir toute la vie de la mosquée
            <Icon.arrow width={16} height={16} className="arw" />
          </Link>
        )}
      </div>
    </div>
  );
}
