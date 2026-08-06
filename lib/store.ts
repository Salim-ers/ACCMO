import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { kvHost, resolveKvCredentials } from "@/lib/kv-env";

// =============================================================
// Stockage des données éditoriales (annonces, réglages).
//
// Trois implémentations, choisies par la CONFIGURATION et non par
// l'état du réseau — un incident passager ne doit jamais déplacer
// silencieusement les données d'un support à l'autre :
//
//   1. « kv »   — Vercel KV / Upstash, si des identifiants existent.
//   2. « blob » — Vercel Blob, si BLOB_READ_WRITE_TOKEN existe.
//   3. « file » — data/*.json, pour le développement local.
//
// La LECTURE ne lève jamais : un support injoignable renvoie la valeur
// de repli, le site reste debout. L'ÉCRITURE lève, pour que l'espace
// d'administration sache immédiatement qu'un enregistrement a échoué.
// =============================================================

export type StoreMode = "kv" | "blob" | "file";

const KV = resolveKvCredentials();

const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN || null;

export function storeMode(): StoreMode {
  if (KV) return "kv";
  if (BLOB_TOKEN) return "blob";
  return "file";
}

// ---------------------------------------------------------------
// Chemins
// ---------------------------------------------------------------

/**
 * Fichier local correspondant à une clé. Les deux clés historiques gardent
 * leur nom d'origine : le fichier de développement déjà présent dans le
 * dépôt reste lisible, et `data/settings.json` reste couvert par .gitignore.
 */
const LEGACY_FILES: Record<string, string> = {
  "annonces:list": "announcements.json",
  "site:settings": "settings.json",
};

function filePath(key: string): string {
  const name = LEGACY_FILES[key] ?? `${key.replace(/[:/]/g, "-")}.json`;
  return path.join(process.cwd(), "data", name);
}

/**
 * Chemin du blob. Vercel Blob ne propose que des objets publics : le nom du
 * fichier est donc dérivé de SESSION_SECRET par HMAC, de sorte qu'il ne soit
 * pas devinable depuis l'extérieur. Les annonces publiées sont de toute façon
 * publiques ; ce sont les brouillons que cela protège.
 */
function blobPath(key: string): string {
  const secret = process.env.SESSION_SECRET || "";
  const digest = crypto.createHmac("sha256", secret).update(`store:${key}`).digest("hex");
  return `donnees/${digest.slice(0, 32)}.json`;
}

// ---------------------------------------------------------------
// Implémentations
// ---------------------------------------------------------------

async function kvClient() {
  const { createClient } = await import("@vercel/kv");
  return createClient({ url: KV!.url, token: KV!.token });
}

async function blobRead<T>(key: string): Promise<T | null> {
  const { list } = await import("@vercel/blob");
  const pathname = blobPath(key);
  const { blobs } = await list({ prefix: pathname, limit: 1, token: BLOB_TOKEN! });
  const found = blobs.find((b) => b.pathname === pathname);
  if (!found) return null; // jamais écrit : ce n'est pas une erreur

  // Le contenu est servi par un CDN. L'écriture pose déjà `cacheControlMaxAge: 0`,
  // et on ajoute un paramètre jetable pour ne pas retomber sur une copie gardée
  // en cache par un intermédiaire.
  const res = await fetch(`${found.url}?v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Lecture du blob impossible (HTTP ${res.status})`);
  return (await res.json()) as T;
}

async function blobWrite(key: string, value: unknown): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(blobPath(key), JSON.stringify(value), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false, // chemin stable : on écrase la version précédente
    cacheControlMaxAge: 0, // pas de mise en cache navigateur
    token: BLOB_TOKEN!,
  });
}

// ---------------------------------------------------------------
// API publique
// ---------------------------------------------------------------

/** Lecture tolérante aux pannes : renvoie `fallback` plutôt que de lever. */
export async function readJson<T>(key: string, fallback: T): Promise<T> {
  const mode = storeMode();
  try {
    if (mode === "kv") {
      const c = await kvClient();
      const data = await c.get<T>(key);
      return data ?? fallback;
    }
    if (mode === "blob") {
      const data = await blobRead<T>(key);
      return data ?? fallback;
    }
    const raw = await fs.readFile(filePath(key), "utf-8");
    return JSON.parse(raw) as T;
  } catch (e) {
    // Un fichier local absent est normal au premier lancement : on ne bruite pas.
    if (mode !== "file") {
      console.error(`Lecture impossible (${mode}, clé « ${key} ») :`, e);
    }
    return fallback;
  }
}

/** Écriture : lève en cas d'échec, pour que l'appelant puisse le signaler. */
export async function writeJson(key: string, value: unknown): Promise<void> {
  const mode = storeMode();
  if (mode === "kv") {
    const c = await kvClient();
    await c.set(key, value);
    return;
  }
  if (mode === "blob") {
    await blobWrite(key, value);
    return;
  }
  const file = filePath(key);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf-8");
}

// ---------------------------------------------------------------
// Diagnostic
// ---------------------------------------------------------------

export type StoreStatus = {
  mode: StoreMode;
  /** Vrai si une lecture vient réellement d'aboutir. */
  ok: boolean;
  /** Vrai quand le site tourne sur Vercel (le fichier local n'y persiste pas). */
  serverless: boolean;
  /** Support lisible par un humain, affiché dans l'administration. */
  label: string;
  /** Message expliquant quoi faire, si quelque chose cloche. */
  hint: string | null;
};

export async function probeStore(key: string): Promise<StoreStatus> {
  const mode = storeMode();
  const serverless = !!process.env.VERCEL;

  if (mode === "kv") {
    const host = kvHost(KV!.url) ?? "inconnue";
    try {
      const c = await kvClient();
      await c.get(key);
      return { mode, ok: true, serverless, label: `Base Redis (${host})`, hint: null };
    } catch {
      return {
        mode,
        ok: false,
        serverless,
        label: `Base Redis (${host})`,
        hint: `La base « ${host} » ne répond pas. Sur le plan gratuit Upstash, une base inutilisée est archivée et son point d'accès retiré. Deux issues : la restaurer depuis la console Upstash, ou supprimer les variables KV_REST_API_URL et KV_REST_API_TOKEN dans Vercel — le stockage bascule alors automatiquement sur le Blob Store du projet.`,
      };
    }
  }

  if (mode === "blob") {
    if (!process.env.SESSION_SECRET) {
      return {
        mode,
        ok: false,
        serverless,
        label: "Vercel Blob",
        hint: "La variable SESSION_SECRET est absente : elle sert à rendre le nom du fichier de données indevinable. Définissez-la dans Vercel, puis redéployez.",
      };
    }
    try {
      await blobRead(key);
      return { mode, ok: true, serverless, label: "Vercel Blob", hint: null };
    } catch (e) {
      return {
        mode,
        ok: false,
        serverless,
        label: "Vercel Blob",
        hint: `Le Blob Store ne répond pas (${
          e instanceof Error ? e.message : "cause inconnue"
        }). Vérifiez que la variable BLOB_READ_WRITE_TOKEN est bien définie dans Vercel et que le store est relié au projet.`,
      };
    }
  }

  return {
    mode,
    ok: !serverless,
    serverless,
    label: "Fichier local (data/)",
    hint: serverless
      ? "Aucun stockage persistant n'est configuré et le système de fichiers est en lecture seule sur Vercel : les annonces ne pourront pas être enregistrées. Reliez un Blob Store au projet (variable BLOB_READ_WRITE_TOKEN), puis redéployez."
      : null,
  };
}
