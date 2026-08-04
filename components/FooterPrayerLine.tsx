"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/site";
import { formatDelay, type PrayerDay } from "@/lib/prayer";
import { usePrayerClock } from "@/lib/usePrayerClock";
import { toFrenchTime } from "@/lib/format";
import { Icon } from "@/components/Icons";

// Rappel de la prochaine prière en bas de page : l'information reste
// atteignable sans remonter en haut du site.

export default function FooterPrayerLine({ prayerDay }: { prayerDay: PrayerDay | null }) {
  const { day, next } = usePrayerClock(prayerDay);
  if (!day) return null;

  return (
    <Link
      href={ROUTES.horaires}
      className="group flex shrink-0 items-center gap-5 border border-[var(--rule-invert)] px-5 py-4 transition-colors hover:border-sand-50"
    >
      <span>
        <span className="block text-[10.5px] font-bold uppercase tracking-[0.16em] text-night-300">
          {next ? "Prochaine prière" : "Horaires du jour"}
        </span>
        {next ? (
          <span className="mt-1.5 flex items-baseline gap-2">
            <span className="tabular text-[26px] font-extrabold leading-none tracking-tightest text-sand-50">
              {toFrenchTime(next.entry.time)}
            </span>
            <span className="text-[14px] font-bold text-terra-400">{next.entry.label}</span>
            <span className="tabular text-[12.5px] text-night-300">
              {next.remaining > 0 ? `dans ${formatDelay(next.remaining)}` : "maintenant"}
            </span>
          </span>
        ) : (
          <span className="mt-1.5 block text-[15px] text-night-200">
            Consulter la frise des prières
          </span>
        )}
      </span>
      <Icon.arrow
        width={18}
        height={18}
        className="text-night-300 transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}
