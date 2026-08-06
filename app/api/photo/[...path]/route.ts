import { NextResponse } from "next/server";
import { getUpload } from "@/lib/store";

// Relais des photos d'annonces déposées sur un Blob Store en accès privé.
//
// Le fichier y est illisible depuis l'extérieur : cette route le lit de façon
// authentifiée et le renvoie au visiteur. L'URL obtenue est publique et
// permanente, là où un lien signé finirait par expirer et casserait les
// annonces déjà enregistrées.

export const runtime = "nodejs";

/** Préfixe autorisé — voir le contrôle ci-dessous. */
const ALLOWED_PREFIX = "annonces/";

export async function GET(
  _req: Request,
  { params }: { params: { path: string[] } }
) {
  const pathname = (params.path || []).join("/");

  // Cette route lit le Blob avec les droits du serveur. Sans ce contrôle,
  // elle relaierait N'IMPORTE QUEL objet du store — à commencer par le
  // fichier des annonces, brouillons compris. Seules les photos déposées
  // depuis l'administration sont servies.
  if (!pathname.startsWith(ALLOWED_PREFIX) || pathname.includes("..")) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  try {
    const file = await getUpload(pathname);
    if (!file) {
      return NextResponse.json({ error: "Introuvable." }, { status: 404 });
    }
    return new Response(file.stream, {
      headers: {
        "Content-Type": file.contentType,
        // Le nom du fichier porte un identifiant unique et n'est jamais
        // réutilisé : le contenu peut être mis en cache sans réserve.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    console.error("relais de photo impossible:", e);
    return NextResponse.json({ error: "Image indisponible." }, { status: 502 });
  }
}
