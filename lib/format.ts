// Formats d'affichage partagés (aucune dépendance, aucun état).

/** « 22:58 » → « 22h58 » — écriture française des heures. */
export function toFrenchTime(hhmm: string): string {
  const m = /^(\d{1,2}):(\d{2})/.exec(hhmm.trim());
  if (!m) return hhmm;
  return `${m[1].padStart(2, "0")}h${m[2]}`;
}

/** « 2026-03-01 » → « 1 mars 2026 ». */
export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return iso;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
}

/** « 2026-03-01 » → { day: "01", month: "MARS" } pour les agendas. */
export function splitDate(iso: string): { day: string; month: string; year: string } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const d = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return {
    day: m[3],
    month: new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" })
      .format(d)
      .replace(".", "")
      .toUpperCase(),
    year: m[1],
  };
}

/** Vrai si la date est aujourd'hui ou à venir (comparaison en jours). */
export function isUpcoming(iso: string, todayISO: string): boolean {
  return iso >= todayISO;
}
