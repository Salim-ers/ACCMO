"use client";

import Link from "next/link";
import { LINKS, ROUTES } from "@/lib/site";
import { formatCountdown, type PrayerDay, type PrayerEntry } from "@/lib/prayer";
import { usePrayerClock } from "@/lib/usePrayerClock";
import { toFrenchTime } from "@/lib/format";
import { Icon } from "@/components/Icons";

// Frise chronologique des prières — composant propriétaire alimenté par
// le calendrier officiel Mawaqit de la mosquée (lu côté serveur).
//
// Desktop : une ligne de temps horizontale, du Fajr à la ‘Icha.
// Mobile  : la même donnée en liste verticale compacte, sans iframe.
// Aucune heure n'est fabriquée : si la source est absente, on renvoie
// explicitement vers Mawaqit.

type Status = "passed" | "next" | "upcoming";

function statusOf(
  entry: PrayerEntry,
  nowMin: number,
  nextKey: string | null
): Status {
  if (entry.key === nextKey) return "next";
  return entry.minutes <= nowMin ? "passed" : "upcoming";
}

export default function PrayerTimeline({
  prayerDay,
  compact = false,
}: {
  prayerDay: PrayerDay | null;
  /** Version resserrée (pages intérieures) : sans le grand encart latéral. */
  compact?: boolean;
}) {
  const { day, next, nowMinutes } = usePrayerClock(prayerDay);

  if (!day) {
    return (
      <div className="mt-10 border border-[var(--rule)] bg-white p-8 text-center">
        <p className="text-[16px] font-semibold text-night-900">
          Les horaires du jour ne sont pas disponibles pour le moment.
        </p>
        <p className="mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed text-night-600">
          Pour éviter toute erreur, aucun horaire approximatif n&apos;est affiché ici.
          Consultez la fiche officielle de la mosquée sur Mawaqit.
        </p>
        <a
          href={LINKS.mawaqit}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-6"
        >
          Voir les horaires sur Mawaqit
          <Icon.arrowUpRight width={16} height={16} />
        </a>
      </div>
    );
  }

  const nextKey = next && !next.tomorrow ? next.entry.key : null;

  return (
    <div className="mt-10">
      <div className={compact ? "" : "grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-10"}>
        {/* ============ La frise ============ */}
        <div>
          {/* -- Desktop : ligne de temps horizontale -- */}
          <ol
            className="hidden border border-[var(--rule)] bg-white md:grid md:grid-cols-6"
            aria-label="Horaires des prières du jour"
          >
            {day.prayers.map((p, i) => {
              const status = statusOf(p, nowMinutes, nextKey);
              const passed = status === "passed";
              const isNext = status === "next";
              return (
                <li
                  key={p.key}
                  className={`relative flex flex-col px-3 pb-5 pt-5 text-center ${
                    i > 0 ? "border-l border-[var(--rule)]" : ""
                  } ${isNext ? "bg-night-900 text-sand-50" : ""}`}
                  aria-current={isNext ? "step" : undefined}
                >
                  {/* Nom + arabe : hauteur constante pour aligner le rail. */}
                  <span
                    className={`text-[11.5px] font-bold uppercase tracking-[0.13em] ${
                      isNext
                        ? "text-terra-300"
                        : p.isPrayer
                          ? "text-night-800"
                          : "text-night-500"
                    }`}
                  >
                    {p.label}
                  </span>
                  <span
                    className={`arabic mt-1 text-[13px] leading-none ${
                      isNext ? "text-night-200" : "text-night-500"
                    }`}
                    lang="ar"
                  >
                    {p.arabic}
                  </span>

                  {/* Rail + marqueur */}
                  <div
                    className={`relative my-4 h-px ${
                      isNext
                        ? "bg-[var(--rule-invert)]"
                        : passed
                          ? "bg-night-300"
                          : "bg-[var(--rule)]"
                    }`}
                    aria-hidden
                  >
                    <span
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
                        p.isPrayer
                          ? `h-2.5 w-2.5 rotate-45 ${
                              isNext
                                ? "bg-terra-500 animate-beacon"
                                : passed
                                  ? "bg-night-600"
                                  : "border border-night-300 bg-white"
                            }`
                          : `h-1.5 w-1.5 rounded-full ${
                              isNext ? "bg-night-200" : "bg-night-300"
                            }`
                      }`}
                    />
                  </div>

                  {/* Heure */}
                  <span
                    className={`tabular font-extrabold tracking-tight ${
                      isNext
                        ? "text-[30px] leading-none text-white"
                        : p.isPrayer
                          ? "text-[24px] leading-none text-night-900"
                          : "text-[20px] leading-none text-night-500"
                    }`}
                  >
                    {toFrenchTime(p.time)}
                  </span>

                  {/* Iqama / décompte / mention */}
                  <span className="mt-2 block min-h-[16px] text-[11.5px] leading-tight">
                    {isNext && next ? (
                      <span className="tabular font-semibold text-terra-300">
                        {formatCountdown(next.remaining)}
                      </span>
                    ) : p.iqama ? (
                      <span className="tabular text-night-500">
                        Iqama {toFrenchTime(p.iqama)}
                      </span>
                    ) : !p.isPrayer ? (
                      <span className="text-night-500">Lever du soleil</span>
                    ) : null}
                  </span>

                  <span className="sr-only">
                    {status === "passed"
                      ? "Prière passée"
                      : status === "next"
                        ? "Prochaine prière"
                        : "À venir"}
                  </span>
                </li>
              );
            })}
          </ol>

          {/* -- Mobile : liste verticale compacte -- */}
          <ol
            className="border border-[var(--rule)] bg-white md:hidden"
            aria-label="Horaires des prières du jour"
          >
            {day.prayers.map((p, i) => {
              const status = statusOf(p, nowMinutes, nextKey);
              const passed = status === "passed";
              const isNext = status === "next";
              return (
                <li
                  key={p.key}
                  className={`flex items-center gap-3 px-4 py-3.5 ${
                    i > 0 ? "border-t border-[var(--rule)]" : ""
                  } ${isNext ? "bg-night-900 text-sand-50" : passed ? "opacity-60" : ""}`}
                  aria-current={isNext ? "step" : undefined}
                >
                  <span
                    className={`shrink-0 ${
                      p.isPrayer
                        ? `h-2 w-2 rotate-45 ${
                            isNext ? "bg-terra-500 animate-beacon" : passed ? "bg-night-500" : "border border-night-300"
                          }`
                        : "h-1.5 w-1.5 rounded-full bg-night-300"
                    }`}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[15px] font-bold ${
                        isNext ? "text-white" : p.isPrayer ? "text-night-900" : "text-night-500"
                      }`}
                    >
                      {p.label}
                      {!p.isPrayer && (
                        <span className="ml-2 text-[11px] font-medium text-night-500">
                          lever du soleil
                        </span>
                      )}
                    </span>
                    {isNext && next ? (
                      <span className="tabular block text-[12px] font-semibold text-terra-300">
                        {formatCountdown(next.remaining)}
                      </span>
                    ) : p.iqama ? (
                      <span className="tabular block text-[12px] text-night-500">
                        Iqama {toFrenchTime(p.iqama)}
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={`tabular shrink-0 font-extrabold tracking-tight ${
                      isNext ? "text-[26px] text-white" : p.isPrayer ? "text-[21px] text-night-900" : "text-[18px] text-night-500"
                    }`}
                  >
                    {toFrenchTime(p.time)}
                  </span>
                </li>
              );
            })}
          </ol>

          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-night-500">
            <span>
              Source : calendrier officiel de la mosquée sur Mawaqit
              {day.hijri ? ` · ${day.hijri}` : ""}
            </span>
            <a
              href={LINKS.mawaqit}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[26px] items-center font-semibold text-night-700 underline underline-offset-4 hover:text-terra-600"
            >
              Consulter tous les horaires sur Mawaqit
            </a>
          </p>
        </div>

        {/* ============ Encart : Jumu‘a & dates ============ */}
        {!compact && (
          <aside className="flex flex-col" id="jumua">
            <div className="border border-terra-600 bg-terra-600 p-6 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                Prière du vendredi
              </p>
              <p className="mt-3 text-[15px] font-semibold">Jumu‘a</p>
              {day.jumua ? (
                <p className="tabular mt-1 text-[42px] font-extrabold leading-none tracking-tightest">
                  {toFrenchTime(day.jumua)}
                </p>
              ) : (
                <p className="mt-2 text-[14px] leading-relaxed text-white">
                  Horaire à confirmer sur place ou sur Mawaqit.
                </p>
              )}
              <p className="mt-3 text-[13px] leading-relaxed text-white">
                Venez en avance : la salle se remplit rapidement.
              </p>
            </div>

            <dl className="mt-4 border border-[var(--rule)] bg-white">
              <div className="flex items-baseline justify-between gap-3 px-5 py-3.5">
                <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-night-500">
                  Aujourd&apos;hui
                </dt>
                <dd className="text-right text-[14px] font-semibold capitalize text-night-900">
                  {day.gregorian}
                </dd>
              </div>
              {day.hijri && (
                <div className="flex items-baseline justify-between gap-3 border-t border-[var(--rule)] px-5 py-3.5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-night-500">
                    Hégire
                  </dt>
                  <dd className="text-right text-[14px] font-semibold text-night-900">
                    {day.hijri}
                  </dd>
                </div>
              )}
            </dl>

            <Link href={ROUTES.horaires} className="link-arrow mt-4 self-start">
              Toutes les informations sur les prières
              <Icon.arrow width={16} height={16} className="arw" />
            </Link>
          </aside>
        )}
      </div>
    </div>
  );
}
