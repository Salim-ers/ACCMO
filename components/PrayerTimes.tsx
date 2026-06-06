"use client";

import { useEffect, useState } from "react";
import { PRAYER_LABELS } from "@/lib/site";
import { Icon } from "@/components/Icons";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

type Times = Record<string, string>;

const ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

// Repli statique si l'API est indisponible (valeurs indicatives).
const FALLBACK: Times = {
  Fajr: "05:30",
  Sunrise: "07:05",
  Dhuhr: "13:30",
  Asr: "17:15",
  Maghrib: "20:45",
  Isha: "22:15",
};

export default function PrayerTimes() {
  const [times, setTimes] = useState<Times>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState("");

  useEffect(() => {
    const d = new Date();
    setToday(
      d.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
    const ac = new AbortController();
    // Méthode 12 = UOIF (France). city/country pour Creil.
    fetch(
      "https://api.aladhan.com/v1/timingsByCity?city=Creil&country=France&method=12",
      { signal: ac.signal }
    )
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => {
        const t = json?.data?.timings;
        if (t) {
          const clean: Times = {};
          ORDER.forEach((k) => (clean[k] = String(t[k]).slice(0, 5)));
          setTimes(clean);
        }
      })
      .catch(() => setTimes(FALLBACK))
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  // Détermine la prochaine prière pour la mettre en avant.
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const upcoming = ORDER.filter((k) => k !== "Sunrise").find((k) => {
    const [h, m] = (times[k] || "00:00").split(":").map(Number);
    return h * 60 + m >= nowMin;
  });

  return (
    <section id="horaires" className="container-x py-20 sm:py-28">
      <SectionHeading
        eyebrow="Horaires"
        title="Heures de prière du jour"
        intro={today ? `Mosquée de Creil · ${today}` : "Mosquée de Creil"}
      />

      <Reveal stagger={0.07} selector="[data-prayer]" className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {ORDER.map((key) => {
          const highlight = key === upcoming;
          return (
            <div
              key={key}
              data-prayer
              className={`flex flex-col items-center gap-1 rounded-2xl p-5 text-center transition ${
                highlight
                  ? "bg-emerald-700 text-sand-50 shadow-lift"
                  : "card text-emerald-900"
              }`}
            >
              <Icon.clock
                width={20}
                height={20}
                className={highlight ? "text-gold-400" : "text-emerald-500"}
              />
              <span className="mt-1 text-xs uppercase tracking-wider opacity-80">
                {PRAYER_LABELS[key]}
              </span>
              <span className="font-display text-2xl font-semibold">
                {loading ? "—" : times[key]}
              </span>
              {highlight && (
                <span className="text-[10px] uppercase tracking-widest text-gold-400">
                  Prochaine
                </span>
              )}
            </div>
          );
        })}
      </Reveal>

      <p className="mt-6 text-center text-sm text-emerald-800/60">
        Horaires calculés automatiquement (méthode UOIF). La Jumu&apos;a a lieu le
        vendredi — confirmez l&apos;heure exacte sur place.
      </p>
    </section>
  );
}
