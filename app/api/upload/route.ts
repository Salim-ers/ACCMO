import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Upload d'une image vers Vercel Blob (espace admin uniquement).
export async function POST(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const token =
    process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Variable BLOB_READ_WRITE_TOKEN manquante sur Vercel. Storage → ton Blob → copie le token (vercel_blob_rw_…) → Settings → Environment Variables → ajoute BLOB_READ_WRITE_TOKEN → Redeploy. En attendant, colle une URL d'image.",
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

  const { put } = await import("@vercel/blob");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  try {
    const blob = await put(`annonces/${crypto.randomUUID()}.${ext}`, file, {
      access: "public",
      contentType: file.type,
      token,
    });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error("blob upload failed:", e);
    return NextResponse.json(
      { error: "Échec de l'envoi de l'image. Vérifie le token Blob, ou colle une URL d'image." },
      { status: 500 }
    );
  }
}
