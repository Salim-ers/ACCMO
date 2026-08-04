import type { MetadataRoute } from "next";
import { ROUTES, SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: ROUTES.home, priority: 1, freq: "daily" },
    { path: ROUTES.horaires, priority: 0.9, freq: "daily" },
    { path: ROUTES.annonces, priority: 0.8, freq: "weekly" },
    { path: ROUTES.mosquee, priority: 0.8, freq: "monthly" },
    { path: ROUTES.ecole, priority: 0.8, freq: "monthly" },
    { path: ROUTES.don, priority: 0.7, freq: "monthly" },
    { path: ROUTES.contact, priority: 0.7, freq: "monthly" },
    { path: ROUTES.visite, priority: 0.6, freq: "yearly" },
    { path: ROUTES.mentions, priority: 0.2, freq: "yearly" },
    { path: ROUTES.confidentialite, priority: 0.2, freq: "yearly" },
  ];

  return pages.map((p) => ({
    url: new URL(p.path, SITE.url).toString(),
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
