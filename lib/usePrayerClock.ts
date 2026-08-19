"use client";

import { useEffect, useRef, useState } from "react";
import {
  currentPrayerAt,
  nextPrayerAt,
  nowSecondsInParis,
  todayISOInParis,
  type NextPrayer,
  type PrayerDay,
  type PrayerKey,
} from "@/lib/prayer";

// Horloge partagée par la barre d'information et la frise des prières.
// - part des horaires rendus côté serveur (aucun saut visuel au montage) ;
// - se cale sur l'heure de Paris quel que soit le fuseau du visiteur ;
// - bat à la seconde (le décompte affiche heures, minutes et secondes) ;
// - recharge les horaires via /api/prayer-times au changement de jour.

export type PrayerClock = {
  day: PrayerDay | null;
  /** `false` tant que le premier tic client n'a pas eu lieu (rendu serveur). */
  live: boolean;
  nowSeconds: number;
  next: NextPrayer | null;
  current: PrayerKey | null;
};

export function usePrayerClock(initial: PrayerDay | null): PrayerClock {
  const [day, setDay] = useState<PrayerDay | null>(initial);
  // On démarre sur l'heure du rendu serveur (transmise dans les props) :
  // le HTML initial affiche déjà la bonne prochaine prière, sans écart
  // d'hydratation, et le premier tic client prend le relais.
  const [nowSeconds, setNow] = useState<number>(initial?.serverSeconds ?? 0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      setNow(nowSecondsInParis());
      setLive(true);
    };

    tick();
    let id = window.setInterval(tick, 1_000);

    // Le décompte est à la seconde : on arrête le battement quand l'onglet
    // passe en arrière-plan (rien à afficher, et la batterie du téléphone
    // n'a pas à payer une horloge invisible), et on se resynchronise au
    // retour plutôt que de reprendre sur une valeur périmée.
    const onVisibilite = () => {
      window.clearInterval(id);
      if (document.visibilityState !== "visible") return;
      tick();
      id = window.setInterval(tick, 1_000);
    };
    document.addEventListener("visibilitychange", onVisibilite);

    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibilite);
    };
  }, []);

  // Changement de journée : on va chercher le calendrier du nouveau jour.
  // Une seule tentative à la fois, et au plus une toutes les cinq minutes,
  // pour qu'une source indisponible ne déclenche pas de rafales de requêtes.
  const lastAttempt = useRef(0);
  useEffect(() => {
    if (!day || !live) return;
    if (day.dateISO === todayISOInParis()) return;

    const now = Date.now();
    if (now - lastAttempt.current < 5 * 60_000) return;
    lastAttempt.current = now;

    let cancelled = false;
    fetch("/api/prayer-times")
      .then((r) => (r.ok ? r.json() : null))
      .then((fresh: PrayerDay | null) => {
        if (!cancelled && fresh?.prayers?.length) setDay(fresh);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [day, live, nowSeconds]);

  return {
    day,
    live,
    nowSeconds,
    next: day ? nextPrayerAt(day, nowSeconds) : null,
    current: day ? currentPrayerAt(day, nowSeconds) : null,
  };
}
