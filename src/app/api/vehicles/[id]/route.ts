// src/app/api/vehicles/[id]/route.ts  (PATCH + DELETE)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const patch = await req.json();
  const row = await prisma.vehicle.update({
    where: { id: params.id },
    data: patch,
  });
  return NextResponse.json(row);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.vehicle.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
