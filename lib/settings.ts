import { unstable_noStore as noStore } from "next/cache";
import { readJson, writeJson } from "@/lib/store";

// =============================================================
// Réglages globaux du site (ex. activer le service Aïd 1×/an).
// Même support de stockage que les annonces — voir lib/store.ts.
// =============================================================

export type Settings = {
  aidEnabled: boolean;
};

const DEFAULTS: Settings = { aidEnabled: false };

const KEY = "site:settings";

/**
 * Les réglages changent à la demande de l'administrateur : comme les
 * annonces, ils ne doivent jamais être servis depuis un cache.
 *
 * Sans cela, la lecture du support distant passe par un `fetch` que Next met
 * en cache lors du rendu des pages : cocher « Aïd » dans l'administration
 * n'avait aucun effet visible sur le site public, la page continuant de lire
 * l'ancienne valeur. Les horaires de prière, eux, gardent leur cache d'une
 * heure : ils ne dépendent de personne.
 */
export async function getSettings(): Promise<Settings> {
  noStore();
  const data = await readJson<Partial<Settings>>(KEY, {});
  return { ...DEFAULTS, ...data };
}

export async function setSettings(input: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = { ...current, aidEnabled: Boolean(input.aidEnabled) };
  await writeJson(KEY, next);
  return next;
}
