// =============================================================
// Résolution des identifiants du store Redis (Vercel KV / Upstash).
//
// Vercel propose d'appliquer un « custom prefix » aux variables créées
// par l'intégration : selon les cas on peut donc recevoir
//   KV_REST_API_URL, UPSTASH_REDIS_REST_URL,
//   STORAGE_KV_REST_API_URL, ANNONCES_UPSTASH_REDIS_REST_URL, …
//
// Plutôt que d'imposer un nommage exact — et de laisser un site muet
// devant une base pourtant saine — on accepte n'importe quel préfixe,
// à condition que l'URL et le jeton portent le même.
//
// Les noms standards restent prioritaires : si les deux existent, c'est
// la configuration explicite qui gagne.
// =============================================================

export type KvCredentials = { url: string; token: string; prefix: string };

/** Suffixes reconnus, par ordre de préférence, appariés URL ↔ jeton. */
const PAIRS: { url: string; token: string }[] = [
  { url: "KV_REST_API_URL", token: "KV_REST_API_TOKEN" },
  { url: "UPSTASH_REDIS_REST_URL", token: "UPSTASH_REDIS_REST_TOKEN" },
];

function clean(value: string | undefined): string | null {
  const v = (value ?? "").trim();
  return v.length ? v : null;
}

/**
 * Identifiants du store, ou `null` si aucun couple complet n'est présent.
 * Un jeton en lecture seule (`..._READ_ONLY_TOKEN`) n'est jamais retenu :
 * l'espace d'administration doit pouvoir écrire.
 */
export function resolveKvCredentials(
  env: NodeJS.ProcessEnv = process.env
): KvCredentials | null {
  // 1) Noms standards, sans préfixe.
  for (const pair of PAIRS) {
    const url = clean(env[pair.url]);
    const token = clean(env[pair.token]);
    if (url && token) return { url, token, prefix: "" };
  }

  // 2) Mêmes suffixes, précédés d'un préfixe quelconque appliqué par Vercel.
  for (const pair of PAIRS) {
    for (const key of Object.keys(env)) {
      if (key === pair.url || !key.endsWith(`_${pair.url}`)) continue;
      const prefix = key.slice(0, -pair.url.length); // « STORAGE_ »
      const url = clean(env[key]);
      const token = clean(env[`${prefix}${pair.token}`]);
      if (url && token) return { url, token, prefix };
    }
  }

  return null;
}

/** Hôte du store, pour les messages de diagnostic. */
export function kvHost(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
