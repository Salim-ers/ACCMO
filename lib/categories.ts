// Rubriques de l'agenda — module sans dépendance, partagé par le stockage
// des annonces (serveur) et par les filtres de l'interface (client).

export const CATEGORIES = [
  "Informations pratiques",
  "Enseignement",
  "Événements",
  "Solidarité",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const DEFAULT_CATEGORY: Category = "Informations pratiques";

/** Couleur d'étiquette par rubrique (classes Tailwind). */
export const CATEGORY_TAG: Record<Category, string> = {
  "Informations pratiques": "bg-night-100 text-night-700",
  Enseignement: "bg-night-900 text-sand-100",
  "Événements": "bg-terra-600 text-white",
  "Solidarité": "bg-sand-300 text-night-800",
};

export function isCategory(value: unknown): value is Category {
  return (CATEGORIES as readonly string[]).includes(String(value));
}
