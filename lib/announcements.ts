import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// =============================================================
// Stockage des annonces dans un fichier JSON local.
//   ✓ Fonctionne en local et sur tout hébergement Node persistant
//     (VPS, Render, Railway, Dokku, Docker, OVH...).
//   ⚠ NE convient PAS au système de fichiers en lecture seule de
//     Vercel/Netlify serverless. Voir README > "Mise en production"
//     pour basculer vers Supabase/Vercel KV (l'interface ne change pas).
// =============================================================

export type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string; // AAAA-MM-JJ
  featured: boolean;
  published: boolean;
  createdAt: string; // ISO
};

const DATA_FILE = path.join(process.cwd(), "data", "announcements.json");

async function readAll(): Promise<Announcement[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeAll(items: Announcement[]): Promise<void> {
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
  featured?: unknown;
  published?: unknown;
};

function sanitize(input: AnnouncementInput) {
  const title = String(input.title ?? "").trim().slice(0, 160);
  const body = String(input.body ?? "").trim().slice(0, 2000);
  const date = String(input.date ?? "").trim();
  const featured = Boolean(input.featured);
  const published = input.published === undefined ? true : Boolean(input.published);

  const errors: string[] = [];
  if (title.length < 2) errors.push("Le titre est requis.");
  if (body.length < 2) errors.push("Le contenu est requis.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push("Date invalide (AAAA-MM-JJ).");

  return { value: { title, body, date, featured, published }, errors };
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
