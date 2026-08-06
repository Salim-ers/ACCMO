import { storeMode } from "@/lib/store";

/**
 * Message d'échec d'enregistrement.
 *
 * La cause probable oriente, mais c'est le message RÉEL renvoyé par le
 * support qui permet de diagnostiquer : on le joint systématiquement plutôt
 * que de le remplacer par un verdict maison, qui a déjà envoyé chercher des
 * réglages parfaitement corrects.
 */
export function storageError(cause?: unknown): string {
  const mode = storeMode();
  const detail =
    cause instanceof Error && cause.message ? ` Détail : ${cause.message}` : "";

  if (mode === "file" && process.env.VERCEL) {
    return `Aucun stockage persistant n'est configuré et le système de fichiers est en lecture seule sur Vercel. Reliez un Blob Store au projet, puis redéployez.${detail}`;
  }
  if (mode === "kv") {
    return `Enregistrement impossible : la base Redis liée au projet ne répond pas. Restaurez-la depuis la console Upstash, ou supprimez les variables KV_REST_API_URL et KV_REST_API_TOKEN pour basculer sur le Blob Store.${detail}`;
  }
  if (mode === "blob") {
    return `Enregistrement impossible sur le Blob Store.${detail}`;
  }
  return `Impossible d'enregistrer. Réessayez.${detail}`;
}
