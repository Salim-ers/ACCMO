import { storeMode } from "@/lib/store";

/**
 * Message d'échec d'enregistrement, formulé selon la cause la plus probable.
 * Partagé par toutes les routes de mutation pour rester cohérent.
 */
export function storageError(): string {
  const mode = storeMode();

  if (mode === "file" && process.env.VERCEL) {
    return "Aucun stockage persistant n'est configuré et le système de fichiers est en lecture seule sur Vercel. Reliez un Blob Store au projet (variable BLOB_READ_WRITE_TOKEN), puis redéployez.";
  }
  if (mode === "kv") {
    return "Enregistrement impossible : la base Redis liée au projet ne répond pas. Restaurez-la depuis la console Upstash, ou supprimez les variables KV_REST_API_URL et KV_REST_API_TOKEN dans Vercel pour basculer sur le Blob Store.";
  }
  if (mode === "blob") {
    return "Enregistrement impossible : le Blob Store ne répond pas. Vérifiez la variable BLOB_READ_WRITE_TOKEN dans les réglages Vercel.";
  }
  return "Impossible d'enregistrer. Réessayez.";
}
