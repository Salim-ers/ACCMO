import { NextResponse } from "next/server";
import { getAll, getPublished, create } from "@/lib/announcements";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  const result = await create(body as Record<string, unknown>);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }
  return NextResponse.json(result.item, { status: 201 });
}
