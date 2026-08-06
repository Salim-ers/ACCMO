import crypto from "crypto";
import { cookies } from "next/headers";

// =============================================================
// Authentification simple et sûre pour l'espace admin.
//  - Mot de passe unique défini dans la variable ADMIN_PASSWORD.
//  - Session = cookie httpOnly signé par HMAC (SESSION_SECRET).
//  Pas de dépendance externe, pas de base d'utilisateurs.
// =============================================================

const COOKIE = "accmo_session";

/**
 * Durée de validité maximale signée dans le jeton — plafond absolu côté
 * serveur. Le cookie, lui, est un cookie de SESSION : il disparaît à la
 * fermeture du navigateur (voir `createSessionCookie`).
 */
const MAX_AGE = 60 * 60 * 4; // 4 heures

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    // Filet de sécurité en dev ; en prod, définissez SESSION_SECRET.
    return "dev-secret-please-change-in-production-0000000000";
  }
  return s;
}

function sign(value: string): string {
  const h = crypto.createHmac("sha256", secret()).update(value).digest("hex");
  return `${value}.${h}`;
}

/**
 * Empreinte courte du mot de passe en vigueur, glissée dans le jeton de
 * session. Changer le mot de passe change l'empreinte, ce qui invalide
 * immédiatement TOUTES les sessions ouvertes — y compris un cookie qui
 * aurait été copié ailleurs. Sans cela, effacer le cookie ne protégerait
 * que le navigateur qui accepte de l'effacer.
 *
 * C'est un HMAC : l'empreinte ne permet pas de remonter au mot de passe.
 */
async function credentialFingerprint(): Promise<string> {
  const cred = await storedCredential();
  const material = cred ? `stored:${cred.hash}` : `env:${process.env.ADMIN_PASSWORD ?? ""}`;
  return crypto.createHmac("sha256", secret()).update(material).digest("hex").slice(0, 12);
}

async function verify(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const value = token.slice(0, dot);
  const expected = sign(value);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  // value = "exp:<timestamp>|fp:<empreinte>"
  const parts = Object.fromEntries(
    value.split("|").map((seg) => {
      const i = seg.indexOf(":");
      return [seg.slice(0, i), seg.slice(i + 1)];
    })
  );
  if (Date.now() >= Number(parts.exp || 0)) return false;
  return parts.fp === (await credentialFingerprint());
}

// =============================================================
// Mot de passe
//
// Deux sources, dans cet ordre :
//   1. un mot de passe défini depuis /admin, stocké HACHÉ (scrypt + sel) ;
//   2. à défaut, la variable d'environnement ADMIN_PASSWORD.
//
// Le mot de passe n'est jamais conservé en clair. Le sel est tiré au hasard
// à chaque changement, et la comparaison se fait à temps constant.
// =============================================================

const CREDENTIAL_KEY = "admin:credential";
const SCRYPT_KEYLEN = 64;

/** Longueur minimale exigée lors d'un changement depuis l'administration. */
export const MIN_PASSWORD_LENGTH = 10;

type Credential = { algo: "scrypt"; salt: string; hash: string; updatedAt: string };

function scrypt(pwd: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(pwd.normalize("NFKC"), salt, SCRYPT_KEYLEN, (err, key) =>
      err ? reject(err) : resolve(key)
    );
  });
}

export async function hashPassword(pwd: string): Promise<Credential> {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(pwd, salt);
  return {
    algo: "scrypt",
    salt: salt.toString("hex"),
    hash: hash.toString("hex"),
    updatedAt: new Date().toISOString(),
  };
}

async function matchesCredential(pwd: string, cred: Credential): Promise<boolean> {
  try {
    const expected = Buffer.from(cred.hash, "hex");
    const actual = await scrypt(pwd, Buffer.from(cred.salt, "hex"));
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

/** Comparaison à temps constant avec la variable d'environnement. */
function matchesEnv(pwd: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "change-moi-en-production";
  const a = Buffer.from(pwd.normalize("NFKC"));
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Mot de passe enregistré depuis l'administration, s'il existe.
 *
 * `ADMIN_PASSWORD_RESET=1` le neutralise : c'est la porte de secours en cas
 * d'oubli. On repasse alors par ADMIN_PASSWORD, le temps d'en définir un
 * nouveau depuis l'interface — puis il faut retirer la variable.
 */
async function storedCredential(): Promise<Credential | null> {
  if (process.env.ADMIN_PASSWORD_RESET === "1") return null;
  const { readJson } = await import("@/lib/store");
  const c = await readJson<Credential | null>(CREDENTIAL_KEY, null);
  return c && c.algo === "scrypt" && c.salt && c.hash ? c : null;
}

/** Indique si un mot de passe propre à l'association a déjà été défini. */
export async function hasCustomPassword(): Promise<boolean> {
  return (await storedCredential()) !== null;
}

/** Vérifie le mot de passe : enregistré s'il existe, sinon variable d'environnement. */
export async function checkPassword(pwd: string): Promise<boolean> {
  const cred = await storedCredential();
  if (cred) return matchesCredential(pwd, cred);
  return matchesEnv(pwd);
}

/** Enregistre un nouveau mot de passe. Lève si le stockage est indisponible. */
export async function setPassword(pwd: string): Promise<void> {
  const { writeJson } = await import("@/lib/store");
  await writeJson(CREDENTIAL_KEY, await hashPassword(pwd));
}

/** Refuse les mots de passe manifestement faibles. */
export function validatePassword(pwd: string): string[] {
  const errors: string[] = [];
  if (pwd.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Le mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caractères.`);
  }
  if (/^\s|\s$/.test(pwd)) {
    errors.push("Le mot de passe ne doit ni commencer ni finir par un espace.");
  }
  if (/^(change-moi|motdepasse|password|123456|admin)/i.test(pwd)) {
    errors.push("Ce mot de passe est trop courant. Choisissez-en un autre.");
  }
  return errors;
}

export async function createSessionCookie() {
  const value = `exp:${Date.now() + MAX_AGE * 1000}|fp:${await credentialFingerprint()}`;
  return {
    name: COOKIE,
    value: sign(value),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      // Ni `maxAge` ni `expires` : c'est ce qui en fait un cookie de
      // SESSION. Le navigateur l'efface à sa fermeture, la connexion à
      // l'administration ne survit donc pas à la fin de la journée de
      // travail. La date signée dans le jeton reste le plafond serveur.
    },
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE,
    value: "",
    options: { httpOnly: true, path: "/", maxAge: 0 },
  };
}

/** À utiliser côté serveur (Server Components / Route Handlers). */
export async function isAuthenticated(): Promise<boolean> {
  return verify(cookies().get(COOKIE)?.value);
}
