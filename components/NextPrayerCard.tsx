"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/site";
import { formatDelay, type PrayerDay } from "@/lib/prayer";
import { usePrayerClock } from "@/lib/usePrayerClock";
import { toFrenchTime } from "@/lib/format";
import { Icon } from "@/components/Icons";

// Petit encart superposé à la photographie du hero : l'information la plus
// demandée du site, lisible avant tout défilement.

export default function NextPrayerCard({ prayerDay }: { prayerDay: PrayerDay | null }) {
  const { day, next } = usePrayerClock(prayerDay);

  if (!day) {
    return (
      <Link
        href={ROUTES.horaires}
        className="block bg-night-900 p-5 text-sand-50 shadow-panel"
      >
        <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-night-300">
          Horaires
        </span>
        <span className="mt-2 block text-[17px] font-bold leading-tight">
          Consulter les heures de prière
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={ROUTES.horaires}
      className="group block bg-night-900 p-5 text-sand-50 shadow-panel transition-colors hover:bg-night-800"
    >
      <span className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 bg-terra-500 animate-beacon" aria-hidden />
        <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-night-300">
          Prochaine prière
        </span>
      </span>

      {next ? (
        <>
          <span className="mt-3 flex items-baseline gap-2.5">
            <span className="tabular text-[38px] font-extrabold leading-none tracking-tightest">
              {toFrenchTime(next.entry.time)}
            </span>
            <span className="text-[16px] font-bold text-terra-300">{next.entry.label}</span>
          </span>
          <span className="tabular mt-1.5 block text-[13px] text-night-200">
            {next.remaining <= 0 ? "C’est l’heure" : `dans ${formatDelay(next.remaining)}`}
            {next.tomorrow && " — demain"}
          </span>
        </>
      ) : (
        <span className="mt-3 block text-[15px] text-night-200">Horaires du jour</span>
      )}

      <span className="mt-4 flex items-center gap-1.5 border-t border-[var(--rule-invert)] pt-3 text-[12.5px] font-semibold text-night-200">
        Voir les six horaires du jour
        <Icon.arrow width={15} height={15} className="transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
