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

export async function getSettings(): Promise<Settings> {
  const data = await readJson<Partial<Settings>>(KEY, {});
  return { ...DEFAULTS, ...data };
}

export async function setSettings(input: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = { ...current, aidEnabled: Boolean(input.aidEnabled) };
  await writeJson(KEY, next);
  return next;
}
