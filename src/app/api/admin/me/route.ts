// src/app/api/admin/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const runtime = "nodejs";

const COOKIE_NAME = "session";

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET not set");
  return new TextEncoder().encode(s);
}

export async function GET() {
  // ← async
  const store = await cookies(); // ← await
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return NextResponse.json({
      ok: true,
      user: {
        id: String(payload.sub),
        username: String(payload.username),
        role: String(payload.role ?? "admin"),
      },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
