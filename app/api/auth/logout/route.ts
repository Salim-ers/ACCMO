import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const c = clearSessionCookie();
  res.cookies.set(c.name, c.value, c.options);
  return res;
}
