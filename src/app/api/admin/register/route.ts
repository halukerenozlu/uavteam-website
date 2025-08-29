export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const BodySchema = z.object({
  username: z.string().min(5),
  password: z.string().min(8),
  securityQuestion: z.string().min(5),
  securityAnswer: z.string().min(1),
});

export async function POST(req: Request) {
  // 🔒 Sadece ilk admin'e izin verir
  const count = await prisma.admin.count();
  if (count > 0) {
    return NextResponse.json(
      { ok: false, error: "Kayıt kapalı" },
      { status: 403 }
    );
  }

  try {
    const json = await req.json();
    const { username, password, securityQuestion, securityAnswer } =
      BodySchema.parse(json);

    // kullanıcı var mı?
    const existing = await prisma.admin.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "Bu kullanıcı zaten var." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const securityAnswerHash = await bcrypt.hash(securityAnswer, 12);

    await prisma.admin.create({
      data: {
        username,
        passwordHash,
        securityQuestion,
        securityAnswerHash,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz form verisi." },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
