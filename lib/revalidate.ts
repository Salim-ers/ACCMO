import { revalidatePath } from "next/cache";

/**
 * Purge le cache de rendu des pages qui affichent les annonces, après une
 * modification depuis l'administration.
 *
 * La lecture des annonces est déjà exclue du cache de données ; cette purge
 * traite le second niveau, celui du HTML déjà rendu, pour que la
 * modification soit visible dès le rechargement suivant plutôt qu'au bout
 * du délai de régénération.
 */
export function revalidatePublicPages(): void {
  try {
    // « layout » : la page et tout ce qui est rendu sous cette route.
    revalidatePath("/", "layout");
  } catch (e) {
    // Une purge impossible ne doit jamais faire échouer un enregistrement
    // qui, lui, a réussi : la page se régénérera d'elle-même.
    console.error("Purge du cache impossible :", e);
  }
}
