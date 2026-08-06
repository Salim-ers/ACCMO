import { NextResponse } from "next/server";
import { update, remove } from "@/lib/announcements";
import { storageError } from "@/lib/storage-error";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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
    const result = await update(params.id, body as Record<string, unknown>);
    if (!result.ok) {
      return NextResponse.json({ errors: result.errors }, { status: 422 });
    }
    return NextResponse.json({ item: result.item, items: result.items });
  } catch (e) {
    console.error("update announcement failed:", e);
    return NextResponse.json({ error: storageError(e) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const result = await remove(params.id);
    if (!result.ok) {
      return NextResponse.json({ errors: result.errors }, { status: 404 });
    }
    return NextResponse.json({ ok: true, items: result.items });
  } catch (e) {
    console.error("delete announcement failed:", e);
    return NextResponse.json({ error: storageError(e) }, { status: 500 });
  }
}
