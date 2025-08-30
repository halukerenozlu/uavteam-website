import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { code } = await req.json().catch(() => ({}));

  if (!code) {
    return NextResponse.json(
      { ok: false, error: "code_required" },
      { status: 400 }
    );
  }

  // 0) İlk admin var mı? Varsa kurulum kapalı.
  const adminCount = await prisma.admin.count();
  const allowReinit = process.env.ADMIN_ALLOW_REINIT === "true";
  if (adminCount > 0 && !allowReinit) {
    return NextResponse.json(
      { ok: false, error: "already_initialized" },
      { status: 403 }
    );
  }

  // 1) Env’den beklenen kodu al
  const expected = process.env.ADMIN_SETUP_CODE;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "code_not_configured" },
      { status: 500 }
    );
  }

  // 2) (opsiyonel) süre kontrolü
  const exp = process.env.ADMIN_SETUP_CODE_EXPIRES_AT;
  if (exp && new Date(exp) <= new Date()) {
    return NextResponse.json(
      { ok: false, error: "code_expired" },
      { status: 400 }
    );
  }

  // 3) Karşılaştır
  if (code !== expected) {
    // Tek tip hata mesajı (bilgi sızdırmamak için)
    return NextResponse.json(
      { ok: false, error: "invalid_code" },
      { status: 401 }
    );
  }

  // Başarılı
  return NextResponse.json({ ok: true }, { status: 200 });
}
