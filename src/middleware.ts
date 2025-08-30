// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "session";
const noStoreHeaders: Record<string, string> = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET not set");
  return new TextEncoder().encode(secret);
}

async function hasValidToken(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicAdminPaths = [
    "/admin",
    "/admin/forgot",
    "/admin/reset",
    "/admin/register",
    "/api/admin/login",
  ];

  if (
    publicAdminPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(noStoreHeaders)) res.headers.set(k, v);
    return res;
  }

  if (pathname.startsWith("/admin")) {
    const ok = await hasValidToken(req);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.searchParams.set("next", pathname + (req.nextUrl.search || ""));
      return NextResponse.redirect(url);
    }
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(noStoreHeaders)) res.headers.set(k, v);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/vehicles/:path*"],
};
