import { NextResponse } from "next/server";
import {
  checkPassword,
  clearSessionCookie,
  isAuthenticated,
  setPassword,
  validatePassword,
} from "@/lib/auth";
import { storageError } from "@/lib/storage-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Changement du mot de passe de l'administration.
//
// Trois garde-fous : il faut une session valide, connaître le mot de passe
// actuel, et le nouveau doit satisfaire des règles minimales. En cas de
// succès la session est fermée : le changement se fait souvent parce que
// l'ancien mot de passe a circulé, il ne doit donc rester aucune session
// ouverte derrière — la reconnexion prouve que le nouveau est bien retenu.
export async function PUT(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let current = "";
  let next = "";
  try {
    const body = await req.json();
    current = String(body?.current ?? "");
    next = String(body?.next ?? "");
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!(await checkPassword(current))) {
    return NextResponse.json(
      { errors: ["Le mot de passe actuel est incorrect."] },
      { status: 403 }
    );
  }

  const errors = validatePassword(next);
  if (next === current) errors.push("Le nouveau mot de passe doit être différent de l'actuel.");
  if (errors.length) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  try {
    await setPassword(next);
  } catch (e) {
    console.error("changement de mot de passe impossible:", e);
    return NextResponse.json({ error: storageError(e) }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  const c = clearSessionCookie();
  res.cookies.set(c.name, c.value, c.options);
  return res;
}
