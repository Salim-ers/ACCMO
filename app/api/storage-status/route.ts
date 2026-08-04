import { NextResponse } from "next/server";
import { checkStore } from "@/lib/announcements";
import { isAuthenticated } from "@/lib/auth";

// État du stockage des annonces — réservé à l'espace d'administration :
// l'hôte de la base et les indications de configuration n'ont pas à être
// exposés publiquement.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  return NextResponse.json(await checkStore(), {
    headers: { "Cache-Control": "no-store" },
  });
}
