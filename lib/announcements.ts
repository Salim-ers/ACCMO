import crypto from "crypto";

// =============================================================
// Annonces de la mosquée.
//
// Le support de stockage (Vercel KV, Vercel Blob ou fichier local) est
// choisi par lib/store.ts : ce module ne s'occupe que des règles métier
// — validation, tri, rubriques.
//
// Les fonctions de mutation renvoient la LISTE COMPLÈTE à jour, afin que
// l'espace d'administration l'affiche directement sans relecture. C'est
// ce qui permet d'utiliser un support à cohérence différée comme le Blob
// sans que l'administrateur voie jamais un état périmé.
// =============================================================

import { unstable_noStore as noStore } from "next/cache";
import { DEFAULT_CATEGORY, isCategory, type Category } from "@/lib/categories";
import { probeStore, readJson, storeMode, writeJson, type StoreStatus } from "@/lib/store";

export type { StoreStatus };

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

const KEY = "annonces:list";

/** Indique si un stockage persistant est configuré (autre que le fichier local). */
export function hasPersistentStore(): boolean {
  return storeMode() !== "file";
}

/** État réel du stockage, pour le bandeau de l'espace d'administration. */
export function checkStore(): Promise<StoreStatus> {
  return probeStore(KEY);
}

/** Les annonces créées avant l'ajout des rubriques n'en ont pas : on comble. */
function withDefaults(items: unknown): Announcement[] {
  if (!Array.isArray(items)) return [];
  return items.map((a: Announcement) => ({
    ...a,
    category: isCategory(a?.category) ? a.category : DEFAULT_CATEGORY,
  }));
}

async function readAll(): Promise<Announcement[]> {
  return withDefaults(await readJson<Announcement[]>(KEY, []));
}

async function writeAll(items: Announcement[]): Promise<void> {
  await writeJson(KEY, items);
}

function sortByDateDesc(items: Announcement[]): Announcement[] {
  return [...items].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.date.localeCompare(a.date);
  });
}

/**
 * Les annonces sont la seule donnée du site qui change à la demande de
 * l'administrateur : elle ne doit jamais être servie depuis un cache.
 *
 * Sans cela, la lecture du support distant passe par un `fetch` que Next
 * met en cache lors du rendu des pages, et une modification enregistrée
 * dans l'administration n'apparaît pas sur le site public. Les horaires de
 * prière, eux, gardent leur cache d'une heure : ils ne dépendent de personne.
 */
export async function getPublished(): Promise<Announcement[]> {
  noStore();
  const items = await readAll();
  return sortByDateDesc(items.filter((a) => a.published));
}

/** Admin : toutes les annonces. */
export async function getAll(): Promise<Announcement[]> {
  noStore();
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
  return { ok: true as const, item, items: sortByDateDesc(items) };
}

export async function update(id: string, input: AnnouncementInput) {
  const { value, errors } = sanitize(input);
  if (errors.length) return { ok: false as const, errors };
  const items = await readAll();
  const idx = items.findIndex((a) => a.id === id);
  if (idx === -1) return { ok: false as const, errors: ["Annonce introuvable."] };
  items[idx] = { ...items[idx], ...value };
  await writeAll(items);
  return { ok: true as const, item: items[idx], items: sortByDateDesc(items) };
}

export async function remove(id: string) {
  const items = await readAll();
  const next = items.filter((a) => a.id !== id);
  if (next.length === items.length)
    return { ok: false as const, errors: ["Annonce introuvable."] };
  await writeAll(next);
  return { ok: true as const, items: sortByDateDesc(next) };
}
