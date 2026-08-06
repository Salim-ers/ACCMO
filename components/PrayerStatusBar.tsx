"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LINKS, ROUTES } from "@/lib/site";
import { formatCountdown } from "@/lib/prayer";
import type { PrayerClock } from "@/lib/usePrayerClock";
import { toFrenchTime } from "@/lib/format";

// Barre d'information communautaire — filet de 34 px en haut du site.
// Ton informatif, jamais alarmiste : fond bleu nuit, texte brumeux,
// un point terre cuite pour la seule information temps réel.
//
// Gauche  : prochaine prière + décompte (toujours visible, même mobile).
// Droite  : information secondaire qui alterne lentement (desktop).

type Secondary = { text: string; href: string; external?: boolean };

export default function PrayerStatusBar({ clock }: { clock: PrayerClock }) {
  const { day, next } = clock;

  const secondary: Secondary[] = [];
  if (day?.jumua) {
    secondary.push({
      text: `Jumu‘a — vendredi à ${toFrenchTime(day.jumua)}`,
      href: `${ROUTES.horaires}#jumua`,
    });
  }
  secondary.push({
    text: "Inscriptions aux cours 2026 / 2027 ouvertes",
    href: LINKS.inscriptionCours,
    external: true,
  });
  if (day?.hijri) {
    secondary.push({ text: day.hijri, href: ROUTES.horaires });
  }

  const [i, setI] = useState(0);
  useEffect(() => {
    if (secondary.length < 2) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % secondary.length), 7000);
    return () => window.clearInterval(id);
  }, [secondary.length]);

  const item = secondary[i % secondary.length];

  return (
    <div className="on-dark bg-night-900 text-night-100">
      <div className="shell flex h-[var(--statusbar-h)] items-center justify-between gap-4 text-[12px] sm:text-[12.5px]">
        {/* Information principale : la prochaine prière. */}
        <p className="flex min-w-0 items-center gap-2 truncate">
          {next ? (
            <>
              <span
                className="h-1.5 w-1.5 shrink-0 bg-terra-500 animate-beacon"
                aria-hidden
              />
              <span className="truncate">
                <span className="hidden sm:inline">Prochaine prière : </span>
                <span className="sm:hidden">Prochaine : </span>
                <strong className="font-semibold text-white">
                  {next.entry.label} à {toFrenchTime(next.entry.time)}
                </strong>
                <span className="tabular text-night-200">
                  {" · "}
                  {formatCountdown(next.remaining)}
                </span>
              </span>
            </>
          ) : (
            <span className="truncate text-night-200">
              Grande Mosquée de Creil — horaires de prière
            </span>
          )}
        </p>

        {/* Information secondaire, alternée lentement. */}
        {item &&
          (item.external ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-[var(--statusbar-h)] shrink-0 items-center text-night-200 underline-offset-4 transition-colors hover:text-white hover:underline md:flex"
            >
              {item.text}
            </a>
          ) : (
            <Link
              href={item.href}
              className="hidden h-[var(--statusbar-h)] shrink-0 items-center text-night-200 underline-offset-4 transition-colors hover:text-white hover:underline md:flex"
            >
              {item.text}
            </Link>
          ))}
      </div>
    </div>
  );
}
