import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { username, securityAnswer, newPassword } = await req.json();
    const name = (username ?? "").trim();

    if (!name || !securityAnswer || !newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz form verisi." },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    let admin = await prisma.admin.findUnique({ where: { username: name } });
    if (!admin) {
      admin = await prisma.admin.findFirst({
        where: { username: { equals: name, mode: "insensitive" } },
      });
    }
    if (!admin) {
      // Güvenlik için genelleştirilebilir:
      // return NextResponse.json({ ok: true }, { status: 200 });
      return NextResponse.json(
        { ok: false, error: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    // Güvenlik cevabını doğrula
    const answerOk = await bcrypt.compare(
      securityAnswer,
      admin.securityAnswerHash
    );
    if (!answerOk) {
      // yine güvenlik için genelleştirilebilir
      return NextResponse.json(
        { ok: false, error: "Güvenlik cevabı hatalı." },
        { status: 401 }
      );
    }

    // Yeni şifreyi hashle ve güncelle
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("[RESET] 500", e);
    return NextResponse.json(
      { ok: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
