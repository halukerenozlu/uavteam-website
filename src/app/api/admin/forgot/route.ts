import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    const name = (username ?? "").trim();

    if (!name) {
      return NextResponse.json(
        { ok: false, error: "Kullanıcı adı gerekli." },
        { status: 400 }
      );
    }

    // 1) Tam eşleşme (unique hızlıdır)
    let admin = await prisma.admin.findUnique({ where: { username: name } });

    // 2) Bulunmazsa, büyük/küçük harf duyarsız dene
    if (!admin) {
      admin = await prisma.admin.findFirst({
        where: { username: { equals: name, mode: "insensitive" } },
      });
    }

    if (!admin) {
      // Güvenlik açısından istersen burayı da 200 döndürüp genel mesaj verebilirsin.
      return NextResponse.json(
        { ok: false, error: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    // CEVABI ASLA DÖNME!
    return NextResponse.json(
      { ok: true, securityQuestion: admin.securityQuestion },
      { status: 200 }
    );
  } catch (e) {
    console.error("[FORGOT] 500", e);
    return NextResponse.json(
      { ok: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
