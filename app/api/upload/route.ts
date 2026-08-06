import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAuthenticated } from "@/lib/auth";
import { putUpload } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Envoi d'une photo d'annonce vers Vercel Blob (espace admin uniquement).
//
// Le store peut être configuré en accès public ou privé : lib/store.ts s'y
// adapte et renvoie, dans le second cas, une URL relayée par le site
// (/api/photo/…) pour que l'image reste affichable par les visiteurs.
export async function POST(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  // Seule la présence d'un store relié est vérifiée : le jeton d'identité
  // OIDC n'arrive pas dans l'environnement mais en en-tête de requête, et le
  // tester ici reviendrait à refuser une configuration valide.
  const hasStore = !!(
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.VERCEL_BLOB_READ_WRITE_TOKEN ||
    process.env.BLOB_STORE_ID
  );
  if (!hasStore) {
    return NextResponse.json(
      {
        error:
          "Aucun Blob Store n'est relié à ce projet. Dans Vercel : Storage → votre Blob → Connect Project, puis redéployez. En attendant, vous pouvez coller une URL d'image.",
      },
      { status: 501 }
    );
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Le fichier doit être une image." }, { status: 415 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image trop lourde (max 5 Mo)." }, { status: 413 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  try {
    const { url } = await putUpload(
      `annonces/${crypto.randomUUID()}.${ext}`,
      file,
      file.type
    );
    return NextResponse.json({ url });
  } catch (e) {
    console.error("blob upload failed:", e);
    return NextResponse.json(
      {
        error: `Échec de l'envoi de l'image. ${
          e instanceof Error ? e.message : ""
        } Vous pouvez aussi coller l'URL d'une image.`.trim(),
      },
      { status: 500 }
    );
  }
}
