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
//   2. « blob » — Vercel Blob, si un store est relié au projet.
//   3. « file » — data/*.json, pour le développement local.
//
// La LECTURE ne lève jamais : un support injoignable renvoie la valeur
// de repli, le site reste debout. L'ÉCRITURE lève, pour que l'espace
// d'administration sache immédiatement qu'un enregistrement a échoué.
// =============================================================

export type StoreMode = "kv" | "blob" | "file";

const KV = resolveKvCredentials();

// Deux façons de s'authentifier auprès de Vercel Blob :
//
//   • un jeton d'écriture explicite (BLOB_READ_WRITE_TOKEN) — l'ancien modèle ;
//   • l'identité du déploiement (OIDC) : Vercel injecte VERCEL_OIDC_TOKEN à
//     l'exécution, et BLOB_STORE_ID désigne le store. C'est ce que crée
//     l'intégration actuelle, qui ne fournit plus de jeton à recopier.
//
// La librairie résout elle-même l'OIDC : il suffit de ne PAS lui passer de
// jeton. On ne renseigne donc `token` que lorsqu'on en possède réellement un.
const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN || null;
const BLOB_STORE_ID = process.env.BLOB_STORE_ID || null;

// La présence d'un store relié suffit à choisir ce support : c'est une
// donnée de configuration. Que l'OIDC soit effectivement activé relève,
// lui, du diagnostic — mieux vaut un message précis qu'un repli silencieux
// sur un support qui n'écrit rien.
const BLOB_AVAILABLE = !!BLOB_TOKEN || !!BLOB_STORE_ID;

/** Options d'authentification à passer à @vercel/blob. */
function blobAuth(): { token?: string } {
  return BLOB_TOKEN ? { token: BLOB_TOKEN } : {};
}

/**
 * Présence du jeton d'identité OIDC, résolue EXACTEMENT comme le fait
 * @vercel/oidc : sur Vercel il arrive en en-tête de requête
 * (`x-vercel-oidc-token`) et non dans l'environnement ; `process.env` n'est
 * que le repli du développement local.
 *
 * Cette fonction ne sert qu'au diagnostic : elle ne conditionne aucune
 * tentative d'écriture, pour ne pas bloquer une configuration valide sur la
 * foi d'un test maison.
 */
export function hasOidcToken(): boolean {
  try {
    const ctx = (
      globalThis as unknown as {
        [k: symbol]: { get?: () => { headers?: Record<string, string> } };
      }
    )[Symbol.for("@vercel/request-context")];
    const header = ctx?.get?.()?.headers?.["x-vercel-oidc-token"];
    return !!(header || process.env.VERCEL_OIDC_TOKEN);
  } catch {
    return !!process.env.VERCEL_OIDC_TOKEN;
  }
}

export function storeMode(): StoreMode {
  if (KV) return "kv";
  if (BLOB_AVAILABLE) return "blob";
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
 * Chemin du blob, dérivé de SESSION_SECRET par HMAC : il n'est donc pas
 * devinable depuis l'extérieur. Cette précaution ne coûte rien et couvre le
 * cas d'un store configuré en accès public, où l'URL du fichier serait sinon
 * atteignable — ce sont les brouillons non publiés qu'elle protège.
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

/**
 * Mode d'accès du store. Un store Vercel Blob est configuré en public OU en
 * privé, et rejette explicitement l'autre valeur. Plutôt que d'imposer un
 * réglage supplémentaire, on retient le mode dès que le service l'a signalé.
 */
let blobAccess: "public" | "private" =
  process.env.BLOB_ACCESS === "private" ? "private" : "public";

function isWrongAccessError(e: unknown): boolean {
  return e instanceof Error && /private store|public store/i.test(e.message);
}

/** Exécute une opération, en basculant de mode d'accès si le store le réclame. */
async function withAccess<R>(run: (access: "public" | "private") => Promise<R>): Promise<R> {
  try {
    return await run(blobAccess);
  } catch (e) {
    if (!isWrongAccessError(e)) throw e;
    blobAccess = blobAccess === "public" ? "private" : "public";
    return run(blobAccess);
  }
}

/**
 * Lecture AUTHENTIFIÉE du contenu, via `get`. Contrairement à un `fetch` sur
 * l'URL publique, cela fonctionne quel que soit le mode du store — public ou
 * privé — et ne dépend d'aucun cache CDN : la fraîcheur est garantie.
 */
async function blobRead<T>(key: string): Promise<T | null> {
  const { get } = await import("@vercel/blob");
  const res = await withAccess((access) =>
    get(blobPath(key), { access, ...blobAuth() })
  );
  if (!res || res.statusCode !== 200 || !res.stream) return null; // jamais écrit
  return JSON.parse(await new Response(res.stream).text()) as T;
}

async function blobWrite(key: string, value: unknown): Promise<void> {
  const { put } = await import("@vercel/blob");
  const body = JSON.stringify(value);
  await withAccess((access) =>
    put(blobPath(key), body, {
      access,
      contentType: "application/json",
      addRandomSuffix: false, // chemin stable, indépendant de la version installée
      allowOverwrite: true, // sans cela, la 2e écriture lèverait « blob already exists »
      cacheControlMaxAge: 60, // minimum accepté par Vercel Blob
      ...blobAuth(),
    })
  );
}

/** Mode d'accès retenu, pour le diagnostic de l'administration. */
export function blobAccessMode(): "public" | "private" {
  return blobAccess;
}

// ---------------------------------------------------------------
// API publique
// ---------------------------------------------------------------

/** Contenu du fichier livré avec le code, s'il existe. */
async function readLocalFile<T>(key: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(filePath(key), "utf-8")) as T;
  } catch {
    return null; // absent : ce n'est pas une anomalie
  }
}

/**
 * Lecture tolérante aux pannes : ne lève jamais.
 *
 * Tant que le support distant n'a rien reçu — ou s'il est injoignable — on
 * retombe sur le fichier `data/*.json` livré avec le code. Il sert ainsi de
 * GRAINE INITIALE : les annonces déjà présentes dans le dépôt restent
 * visibles et modifiables, et le premier enregistrement les recopie dans le
 * support distant, qui fait ensuite autorité.
 */
export async function readJson<T>(key: string, fallback: T): Promise<T> {
  const mode = storeMode();

  if (mode !== "file") {
    try {
      const remote = mode === "kv" ? await (await kvClient()).get<T>(key) : await blobRead<T>(key);
      if (remote !== null && remote !== undefined) return remote;
    } catch (e) {
      console.error(`Lecture impossible (${mode}, clé « ${key} ») :`, e);
    }
  }

  return (await readLocalFile<T>(key)) ?? fallback;
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
  /**
   * Variables de configuration réellement vues par le serveur (présence
   * seulement, jamais les valeurs) et version déployée. Sans cela, il est
   * impossible de distinguer « mal configuré » de « déploiement pas à jour ».
   */
  diagnostic: Record<string, string>;
};

function diagnostic(): Record<string, string> {
  const oui = (v: unknown) => (v ? "présente" : "absente");
  return {
    BLOB_STORE_ID: oui(BLOB_STORE_ID),
    "Jeton d'identité OIDC": oui(hasOidcToken()),
    BLOB_READ_WRITE_TOKEN: oui(BLOB_TOKEN),
    "Identifiants Redis": oui(KV),
    SESSION_SECRET: oui(process.env.SESSION_SECRET),
    "Accès du store": blobAccessMode(),
    "Version déployée": (process.env.VERCEL_GIT_COMMIT_SHA || "locale").slice(0, 7),
  };
}

export async function probeStore(key: string): Promise<StoreStatus> {
  const mode = storeMode();
  const serverless = !!process.env.VERCEL;

  if (mode === "kv") {
    const host = kvHost(KV!.url) ?? "inconnue";
    try {
      const c = await kvClient();
      await c.get(key);
      return { mode, ok: true, serverless, label: `Base Redis (${host})`, hint: null, diagnostic: diagnostic() };
    } catch {
      return {
        mode,
        ok: false,
        serverless,
        label: `Base Redis (${host})`,
        diagnostic: diagnostic(),
        hint: `La base « ${host} » ne répond pas. Sur le plan gratuit Upstash, une base inutilisée est archivée et son point d'accès retiré. Deux issues : la restaurer depuis la console Upstash, ou supprimer les variables KV_REST_API_URL et KV_REST_API_TOKEN dans Vercel — le stockage bascule alors automatiquement sur le Blob Store du projet.`,
      };
    }
  }

  if (mode === "blob") {
    const label = `Vercel Blob (${BLOB_TOKEN ? "jeton d’écriture" : "identité du déploiement"})`;
    if (!process.env.SESSION_SECRET) {
      return {
        mode,
        ok: false,
        serverless,
        label,
        diagnostic: diagnostic(),
        hint: "La variable SESSION_SECRET est absente : elle sert à rendre le nom du fichier de données indevinable. Définissez-la dans Vercel, puis redéployez.",
      };
    }
    // Aucun test maison ici : on tente réellement l'opération et on rapporte
    // ce que la librairie répond. C'est elle qui sait résoudre ses
    // identifiants — un pré-test approximatif bloquerait des configurations
    // parfaitement valides.
    try {
      await blobRead(key);
      return { mode, ok: true, serverless, label, hint: null, diagnostic: diagnostic() };
    } catch (e) {
      return {
        mode,
        ok: false,
        serverless,
        label,
        diagnostic: diagnostic(),
        hint: `Le Blob Store ne répond pas (${
          e instanceof Error ? e.message : "cause inconnue"
        }). Vérifiez que le store est bien relié au projet, puis redéployez.`,
      };
    }
  }

  return {
    mode,
    ok: !serverless,
    serverless,
    label: "Fichier local (data/)",
    diagnostic: diagnostic(),
    hint: serverless
      ? "Aucun stockage persistant n'est configuré. Reliez un Blob Store au projet (Storage → votre Blob → Connect Project), puis redéployez. Le tableau ci-dessous indique ce que le serveur voit réellement."
      : null,
  };
}
