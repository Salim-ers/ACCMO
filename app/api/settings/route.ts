import { NextResponse } from "next/server";
import { getSettings, setSettings } from "@/lib/settings";
import { isAuthenticated } from "@/lib/auth";
import { storageError } from "@/lib/storage-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET : public (lecture des réglages, ex. service Aïd activé ?).
export async function GET() {
  return NextResponse.json(await getSettings());
}

// PUT : admin uniquement (modifier les réglages).
export async function PUT(req: Request) {
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
    const next = await setSettings(body as Record<string, unknown>);
    return NextResponse.json(next);
  } catch (e) {
    console.error("update settings failed:", e);
    return NextResponse.json(
      { error: storageError() },
      { status: 500 }
    );
  }
}
