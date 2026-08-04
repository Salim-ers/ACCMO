import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// =============================================================
// Stockage des annonces.
//   • En PRODUCTION (Vercel) : Vercel KV (persistant) dès que les
//     variables KV_REST_API_URL / KV_REST_API_TOKEN sont présentes.
//   • En LOCAL (sans KV) : fichier JSON data/announcements.json.
//   L'interface (admin + API) est identique dans les deux cas.
// =============================================================

import { DEFAULT_CATEGORY, isCategory, type Category } from "@/lib/categories";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string; // AAAA-MM-JJ
  category: Category;
  image?: string; // URL d'une photo (optionnel)
  link?: string; // lien externe (optionnel)
  linkLabel?: string; // texte du bouton de lien (optionnel)
  featured: boolean;
  published: boolean;
  createdAt: string; // ISO
};

const DATA_FILE = path.join(process.cwd(), "data", "announcements.json");
const KV_KEY = "annonces:list";

// Accepte un store « Vercel KV » OU « Upstash Redis » (noms de variables différents).
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const useKV = !!(KV_URL && KV_TOKEN);

/** Indique si un stockage persistant (KV) est configuré. */
export function hasPersistentStore(): boolean {
  return useKV;
}

// --- Diagnostic du stockage -------------------------------------------------

export type StoreStatus = {
  /** `kv` : store distant configuré · `file` : fichier JSON local. */
  mode: "kv" | "file";
  /** Vrai si une lecture vient d'aboutir. */
  ok: boolean;
  /** Vrai quand le site tourne sur Vercel (le fichier local n'y persiste pas). */
  serverless: boolean;
  /** Hôte du store, pour identifier une URL obsolète d'un coup d'œil. */
  host: string | null;
  /** Message court expliquant quoi faire, si quelque chose cloche. */
  hint: string | null;
};

/**
 * Vérifie que le stockage répond vraiment, au lieu de se contenter de
 * constater que les variables d'environnement existent. Utilisé par
 * l'espace d'administration pour prévenir AVANT une tentative
 * d'enregistrement plutôt qu'après son échec.
 */
export async function checkStore(): Promise<StoreStatus> {
  const serverless = !!process.env.VERCEL;
  let host: string | null = null;
  try {
    host = KV_URL ? new URL(KV_URL).host : null;
  } catch {
    host = KV_URL ?? null;
  }

  if (useKV) {
    try {
      const c = await kvClient();
      await c.get(KV_KEY);
      return { mode: "kv", ok: true, serverless, host, hint: null };
    } catch {
      return {
        mode: "kv",
        ok: false,
        serverless,
        host,
        hint: `La base « ${host ?? "inconnue"} » ne répond pas : elle a probablement été supprimée. Dans Vercel : Storage → créez un store KV / Upstash et reliez-le au projet, puis redéployez. Les annonces existantes ne sont pas récupérables si la base a été détruite.`,
      };
    }
  }

  // Pas de store distant : fichier local. Correct en développement,
  // inopérant sur Vercel où le système de fichiers est en lecture seule.
  try {
    await fs.readFile(DATA_FILE, "utf-8");
  } catch {
    // Un fichier absent n'est pas une anomalie : il est créé au premier ajout.
  }
  return {
    mode: "file",
    ok: !serverless,
    serverless,
    host: null,
    hint: serverless
      ? "Aucun store persistant n'est configuré et le système de fichiers est en lecture seule sur Vercel : les annonces ne pourront pas être enregistrées. Créez un store KV / Upstash dans Storage, puis redéployez."
      : null,
  };
}

async function kvClient() {
  const { createClient } = await import("@vercel/kv");
  return createClient({ url: KV_URL as string, token: KV_TOKEN as string });
}

/** Les annonces créées avant l'ajout des rubriques n'en ont pas : on comble. */
function withDefaults(items: unknown): Announcement[] {
  if (!Array.isArray(items)) return [];
  return items.map((a: Announcement) => ({
    ...a,
    category: isCategory(a?.category) ? a.category : DEFAULT_CATEGORY,
  }));
}

/**
 * Lecture des annonces — ne lève jamais.
 *
 * Les annonces sont rendues côté serveur (bon pour le référencement et la
 * performance) : un store injoignable ne doit donc pas faire échouer un
 * rendu, ni le build. Dans ce cas on renvoie une liste vide et l'agenda
 * affiche son état « aucune annonce », le reste du site restant intact.
 * L'écriture, elle, continue de lever : l'administrateur doit savoir
 * immédiatement que son enregistrement n'est pas passé.
 */
async function readAll(): Promise<Announcement[]> {
  if (useKV) {
    try {
      const c = await kvClient();
      return withDefaults(await c.get<Announcement[]>(KV_KEY));
    } catch (e) {
      console.error("Lecture des annonces impossible (store KV injoignable) :", e);
      return [];
    }
  }
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return withDefaults(JSON.parse(raw));
  } catch {
    return [];
  }
}

async function writeAll(items: Announcement[]): Promise<void> {
  if (useKV) {
    const c = await kvClient();
    await c.set(KV_KEY, items);
    return;
  }
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
}

function sortByDateDesc(items: Announcement[]): Announcement[] {
  return [...items].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.date.localeCompare(a.date);
  });
}

/** Public : uniquement les annonces publiées. */
export async function getPublished(): Promise<Announcement[]> {
  const items = await readAll();
  return sortByDateDesc(items.filter((a) => a.published));
}

/** Admin : toutes les annonces. */
export async function getAll(): Promise<Announcement[]> {
  return sortByDateDesc(await readAll());
}

// --- Validation / nettoyage des entrées ---
export type AnnouncementInput = {
  title?: unknown;
  body?: unknown;
  date?: unknown;
  category?: unknown;
  image?: unknown;
  link?: unknown;
  linkLabel?: unknown;
  featured?: unknown;
  published?: unknown;
};

/** Autorise une URL http(s), un chemin local (/...), mailto: ou tel:. */
function cleanUrl(value: unknown): string {
  const s = String(value ?? "").trim().slice(0, 600);
  if (!s) return "";
  if (/^(https?:\/\/|\/|mailto:|tel:)/i.test(s)) return s;
  return ""; // valeur invalide -> ignorée
}

function sanitize(input: AnnouncementInput) {
  const title = String(input.title ?? "").trim().slice(0, 160);
  const body = String(input.body ?? "").trim().slice(0, 2000);
  const date = String(input.date ?? "").trim();
  const category: Category = isCategory(input.category)
    ? input.category
    : DEFAULT_CATEGORY;
  const image = cleanUrl(input.image);
  const link = cleanUrl(input.link);
  const linkLabel = String(input.linkLabel ?? "").trim().slice(0, 60);
  const featured = Boolean(input.featured);
  const published = input.published === undefined ? true : Boolean(input.published);

  const errors: string[] = [];
  if (title.length < 2) errors.push("Le titre est requis.");
  if (body.length < 2) errors.push("Le contenu est requis.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push("Date invalide (AAAA-MM-JJ).");

  return {
    value: { title, body, date, category, image, link, linkLabel, featured, published },
    errors,
  };
}

export async function create(input: AnnouncementInput) {
  const { value, errors } = sanitize(input);
  if (errors.length) return { ok: false as const, errors };
  const items = await readAll();
  const item: Announcement = {
    id: crypto.randomUUID(),
    ...value,
    createdAt: new Date().toISOString(),
  };
  items.push(item);
  await writeAll(items);
  return { ok: true as const, item };
}

export async function update(id: string, input: AnnouncementInput) {
  const { value, errors } = sanitize(input);
  if (errors.length) return { ok: false as const, errors };
  const items = await readAll();
  const idx = items.findIndex((a) => a.id === id);
  if (idx === -1) return { ok: false as const, errors: ["Annonce introuvable."] };
  items[idx] = { ...items[idx], ...value };
  await writeAll(items);
  return { ok: true as const, item: items[idx] };
}

export async function remove(id: string) {
  const items = await readAll();
  const next = items.filter((a) => a.id !== id);
  if (next.length === items.length)
    return { ok: false as const, errors: ["Annonce introuvable."] };
  await writeAll(next);
  return { ok: true as const };
}
