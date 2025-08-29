// src/app/api/vehicles/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// (Opsiyonel ama Prisma için güvenli)
export const runtime = "nodejs";

type Ctx = { params: Record<string, string | string[]> };

function getId(params: Ctx["params"]) {
  const v = params.id;
  return Array.isArray(v) ? v[0] : v;
}

export async function PATCH(req: Request, { params }: Ctx) {
  const id = getId(params);
  const patch = await req.json();
  const row = await prisma.vehicle.update({
    where: { id },
    data: patch,
  });
  return NextResponse.json(row, { status: 200 });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const id = getId(params);
  await prisma.vehicle.delete({ where: { id } });
  // 204 döndürmek REST açısından temizdir; istersen 200+body de olur.
  return new NextResponse(null, { status: 204 });
}
