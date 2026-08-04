import { NextResponse } from "next/server";
import { getAll, getPublished, create, hasPersistentStore } from "@/lib/announcements";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Message d'erreur clair selon la cause probable. */
function storageError() {
  if (process.env.VERCEL && !hasPersistentStore()) {
    return "Stockage non configuré. Sur Vercel : Storage → Create → KV (puis redéployez).";
  }
  if (hasPersistentStore()) {
    // Les variables sont bien là : le store lui-même ne répond pas
    // (base supprimée, jeton révoqué, URL obsolète).
    return "Enregistrement impossible : la base de données liée au projet ne répond pas. Vérifiez le store KV / Upstash dans les réglages Vercel.";
  }
  return "Impossible d'enregistrer. Réessayez.";
}

// GET : public -> annonces publiées ; admin connecté -> toutes.
export async function GET() {
  if (isAuthenticated()) {
    return NextResponse.json(await getAll());
  }
  return NextResponse.json(await getPublished());
}

// POST : création (admin uniquement).
export async function POST(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  try {
    const result = await create(body as Record<string, unknown>);
    if (!result.ok) {
      return NextResponse.json({ errors: result.errors }, { status: 422 });
    }
    return NextResponse.json(result.item, { status: 201 });
  } catch (e) {
    console.error("create announcement failed:", e);
    return NextResponse.json({ error: storageError() }, { status: 500 });
  }
}
