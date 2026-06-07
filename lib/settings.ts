import { promises as fs } from "fs";
import path from "path";

// =============================================================
// Réglages globaux du site (ex. activer le service Aïd 1×/an).
// Même logique de stockage que les annonces : Vercel KV en prod,
// fichier JSON local en dev.
// =============================================================

export type Settings = {
  aidEnabled: boolean;
};

const DEFAULTS: Settings = { aidEnabled: false };

const DATA_FILE = path.join(process.cwd(), "data", "settings.json");
const KV_KEY = "site:settings";

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const useKV = !!(KV_URL && KV_TOKEN);

async function kvClient() {
  const { createClient } = await import("@vercel/kv");
  return createClient({ url: KV_URL as string, token: KV_TOKEN as string });
}

export async function getSettings(): Promise<Settings> {
  try {
    if (useKV) {
      const c = await kvClient();
      const data = await c.get<Partial<Settings>>(KV_KEY);
      return { ...DEFAULTS, ...(data || {}) };
    }
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export async function setSettings(input: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = { ...current, aidEnabled: Boolean(input.aidEnabled) };
  if (useKV) {
    const c = await kvClient();
    await c.set(KV_KEY, next);
  } else {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(next, null, 2), "utf-8");
  }
  return next;
}
