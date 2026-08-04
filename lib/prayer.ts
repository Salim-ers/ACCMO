// =============================================================
// Horaires de prière — source Mawaqit (fiche officielle Essalam Creil).
//
// La page Mawaqit expose un objet `confData` qui contient le calendrier
// annuel de la mosquée, les délais d'iqama et l'heure de la Jumu'a.
// On le lit côté serveur (mise en cache 1 h) pour alimenter un composant
// maison, plutôt que d'incruster une iframe illisible sur mobile.
//
// Si la source est indisponible, on ne fabrique JAMAIS d'horaire :
// la fonction renvoie `null` et l'interface renvoie vers Mawaqit.
// =============================================================

import { LINKS } from "@/lib/site";

export const TIMEZONE = "Europe/Paris";

export type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export type PrayerEntry = {
  key: PrayerKey;
  label: string;
  arabic: string;
  /** Heure d'adhan « HH:MM ». */
  time: string;
  /** Heure d'iqama « HH:MM » si la mosquée la publie. */
  iqama: string | null;
  /** Chourouq n'est pas une prière : il jalonne la journée. */
  isPrayer: boolean;
  minutes: number;
};

export type PrayerDay = {
  dateISO: string;
  gregorian: string;
  hijri: string | null;
  jumua: string | null;
  prayers: PrayerEntry[];
  /** Fajr du lendemain — sert au décompte après la ‘Icha. */
  tomorrowFajr: { time: string; minutes: number } | null;
  /**
   * Heure de Paris au moment du rendu serveur, en minutes depuis minuit.
   * Elle sert d'état initial à l'horloge du client : le HTML envoyé affiche
   * déjà la bonne prochaine prière, et l'hydratation ne provoque aucun écart
   * puisque la valeur vient des props. Le client la remplace dès son premier tic.
   */
  serverMinutes: number;
  fetchedAt: string;
};

export const PRAYER_META: Record<PrayerKey, { label: string; arabic: string; isPrayer: boolean }> = {
  fajr: { label: "Fajr", arabic: "الفجر", isPrayer: true },
  sunrise: { label: "Chourouq", arabic: "الشروق", isPrayer: false },
  dhuhr: { label: "Dhohr", arabic: "الظهر", isPrayer: true },
  asr: { label: "‘Asr", arabic: "العصر", isPrayer: true },
  maghrib: { label: "Maghrib", arabic: "المغرب", isPrayer: true },
  isha: { label: "‘Icha", arabic: "العشاء", isPrayer: true },
};

/** Ordre chronologique de la journée. */
const ORDER: PrayerKey[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

/** Les délais d'iqama Mawaqit ne concernent que les 5 prières obligatoires. */
const IQAMA_ORDER: PrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

const HIJRI_MONTHS = [
  "Mouharram",
  "Safar",
  "Rabi‘ al-Awwal",
  "Rabi‘ ath-Thani",
  "Joumada al-Oula",
  "Joumada ath-Thania",
  "Rajab",
  "Cha‘ban",
  "Ramadan",
  "Chawwal",
  "Dhou al-Qi‘da",
  "Dhou al-Hijja",
];

// ---------------------------------------------------------------
// Utilitaires de temps
// ---------------------------------------------------------------

export function toMinutes(hhmm: string): number {
  const m = /^(\d{1,2}):(\d{2})/.exec(hhmm.trim());
  if (!m) return -1;
  return Number(m[1]) * 60 + Number(m[2]);
}

export function fromMinutes(total: number): string {
  const t = ((total % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

/** Décale une heure « HH:MM » d'un offset Mawaqit (« +10 » ou « 13:45 »). */
function applyIqama(time: string, offset: string | undefined): string | null {
  if (!offset) return null;
  const raw = String(offset).trim();
  if (!raw || raw === "+0" || raw === "0") return null;
  if (/^\d{1,2}:\d{2}$/.test(raw)) return raw;
  const delta = Number.parseInt(raw, 10);
  if (!Number.isFinite(delta) || delta === 0) return null;
  return fromMinutes(toMinutes(time) + delta);
}

/** Parties date/heure d'un instant, exprimées à Paris. */
function parisParts(date = new Date()) {
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const p = Object.fromEntries(fmt.formatToParts(date).map((x) => [x.type, x.value]));
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    hour: Number(p.hour === "24" ? "0" : p.hour),
    minute: Number(p.minute),
  };
}

/** Minutes écoulées depuis minuit, heure de Paris. */
export function nowMinutesInParis(date = new Date()): number {
  const p = parisParts(date);
  return p.hour * 60 + p.minute;
}

/** Date du jour à Paris, au format AAAA-MM-JJ. */
export function todayISOInParis(date = new Date()): string {
  const p = parisParts(date);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

function formatGregorian(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(Date.UTC(y, m - 1, d));
}

function formatHijri(iso: string, adjustment = 0): string | null {
  try {
    const [y, m, d] = iso.split("-").map(Number);
    const base = new Date(Date.UTC(y, m - 1, d));
    base.setUTCDate(base.getUTCDate() + adjustment);
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).formatToParts(base);
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
    const day = Number(get("day"));
    const month = Number(get("month"));
    const year = Number(get("year").replace(/\D/g, ""));
    if (!day || !month || !year) return null;
    return `${day} ${HIJRI_MONTHS[month - 1]} ${year}`;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------
// Lecture de la source Mawaqit
// ---------------------------------------------------------------

type MawaqitConf = {
  calendar?: Record<string, string[]>[];
  iqamaCalendar?: Record<string, string[]>[];
  jumua?: string | null;
  jumuaAsDuhr?: boolean;
  hijriAdjustment?: number;
};

async function fetchConfData(): Promise<MawaqitConf | null> {
  try {
    const res = await fetch(LINKS.mawaqit, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SiteEssalam/1.0; +https://accmo.org)",
        "Accept-Language": "fr",
      },
      // Une heure de cache : les horaires du jour ne bougent pas.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/var\s+confData\s*=\s*(\{[\s\S]*?\});/);
    if (!match) return null;
    return JSON.parse(match[1]) as MawaqitConf;
  } catch {
    return null;
  }
}

function dayFromCalendar(
  calendar: Record<string, string[]>[] | undefined,
  month: number,
  day: number
): string[] | null {
  const entry = calendar?.[month - 1]?.[String(day)];
  return Array.isArray(entry) && entry.length >= 6 ? entry : null;
}

/**
 * Horaires du jour de la Grande Mosquée de Creil.
 * Renvoie `null` si la source Mawaqit est injoignable ou illisible.
 */
export async function getPrayerDay(): Promise<PrayerDay | null> {
  const conf = await fetchConfData();
  if (!conf?.calendar) return null;

  const p = parisParts();
  const iso = todayISOInParis();
  const today = dayFromCalendar(conf.calendar, p.month, p.day);
  if (!today) return null;

  const iqamaOffsets = conf.iqamaCalendar?.[p.month - 1]?.[String(p.day)] ?? [];
  const iqamaByKey = new Map<PrayerKey, string>();
  IQAMA_ORDER.forEach((key, i) => {
    if (iqamaOffsets[i]) iqamaByKey.set(key, iqamaOffsets[i]);
  });

  const prayers: PrayerEntry[] = ORDER.map((key, i) => {
    const time = today[i];
    const meta = PRAYER_META[key];
    return {
      key,
      label: meta.label,
      arabic: meta.arabic,
      time,
      iqama: meta.isPrayer ? applyIqama(time, iqamaByKey.get(key)) : null,
      isPrayer: meta.isPrayer,
      minutes: toMinutes(time),
    };
  }).filter((entry) => entry.minutes >= 0);

  if (prayers.length < 6) return null;

  // Fajr du lendemain (bascule de mois/année gérée par l'objet Date).
  const next = new Date(Date.UTC(p.year, p.month - 1, p.day));
  next.setUTCDate(next.getUTCDate() + 1);
  const nextDay = dayFromCalendar(
    conf.calendar,
    next.getUTCMonth() + 1,
    next.getUTCDate()
  );
  const tomorrowFajr = nextDay
    ? { time: nextDay[0], minutes: toMinutes(nextDay[0]) }
    : null;

  const jumua = conf.jumuaAsDuhr ? prayers[2].time : conf.jumua || null;

  return {
    dateISO: iso,
    gregorian: formatGregorian(iso),
    hijri: formatHijri(iso, conf.hijriAdjustment ?? 0),
    jumua,
    prayers,
    tomorrowFajr,
    serverMinutes: p.hour * 60 + p.minute,
    fetchedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------
// Calculs partagés serveur / client (fonctions pures)
// ---------------------------------------------------------------

export type NextPrayer = {
  entry: PrayerEntry;
  /** Minutes restantes avant l'adhan. */
  remaining: number;
  /** Vrai lorsqu'il s'agit du Fajr du lendemain. */
  tomorrow: boolean;
};

/** Prochaine prière (Chourouq exclu) à partir de l'heure de Paris. */
export function nextPrayerAt(day: PrayerDay, nowMin: number): NextPrayer | null {
  const list = day.prayers.filter((p) => p.isPrayer);
  const upcoming = list.find((p) => p.minutes > nowMin);
  if (upcoming) {
    return { entry: upcoming, remaining: upcoming.minutes - nowMin, tomorrow: false };
  }
  const fajr = day.tomorrowFajr;
  if (!fajr) return null;
  return {
    entry: { ...list[0], time: fajr.time, minutes: fajr.minutes, iqama: null },
    remaining: 1440 - nowMin + fajr.minutes,
    tomorrow: true,
  };
}

/** Prière en cours (celle dont l'heure vient de passer), pour l'état « en cours ». */
export function currentPrayerAt(day: PrayerDay, nowMin: number): PrayerKey | null {
  const passed = day.prayers.filter((p) => p.isPrayer && p.minutes <= nowMin);
  return passed.length ? passed[passed.length - 1].key : null;
}

/** « dans 47 minutes », « dans 2 h 05 ». */
export function formatCountdown(minutes: number): string {
  if (minutes <= 0) return "maintenant";
  if (minutes < 60) return `dans ${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `dans ${h} h` : `dans ${h} h ${String(m).padStart(2, "0")}`;
}

/** Format court sans le mot « dans » (barres compactes). */
export function formatDelay(minutes: number): string {
  if (minutes <= 0) return "maintenant";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}
