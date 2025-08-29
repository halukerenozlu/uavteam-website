// src/app/api/admin/login/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "session";
const EXP_HOURS = 12;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET not set");
  return new TextEncoder().encode(secret);
}

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json(
        { ok: false, message: "Eksik bilgi" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
      select: { id: true, username: true, passwordHash: true },
    });
    if (!admin) {
      return NextResponse.json(
        { ok: false, message: "Geçersiz bilgiler" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { ok: false, message: "Geçersiz bilgiler" },
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      sub: admin.id,
      username: admin.username,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${EXP_HOURS}h`)
      .sign(getSecret());

    // ✅ Cookie'yi NextResponse üzerinden set et
    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * EXP_HOURS,
    });
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Login error" },
      { status: 400 }
    );
  }
}
