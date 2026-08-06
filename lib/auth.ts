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

function verify(token: string | undefined): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const value = token.slice(0, dot);
  const expected = sign(value);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;
  // value = "exp:<timestamp>"
  const exp = Number(value.split(":")[1] || 0);
  return Date.now() < exp;
}

/** Vérifie le mot de passe (comparaison à temps constant). */
export function checkPassword(pwd: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "change-moi-en-production";
  const a = Buffer.from(pwd);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createSessionCookie() {
  const value = `exp:${Date.now() + MAX_AGE * 1000}`;
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
export function isAuthenticated(): boolean {
  const token = cookies().get(COOKIE)?.value;
  return verify(token);
}
