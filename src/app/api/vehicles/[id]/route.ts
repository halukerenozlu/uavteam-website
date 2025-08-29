// src/app/api/vehicles/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(req: Request, ctx: any) {
  const { id } = (ctx as { params: { id: string } }).params;

  const patch = await req.json();
  const row = await prisma.vehicle.update({
    where: { id },
    data: patch,
  });
  return NextResponse.json(row, { status: 200 });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(_req: Request, ctx: any) {
  const { id } = (ctx as { params: { id: string } }).params;

  await prisma.vehicle.delete({ where: { id } });
  return new Response(null, { status: 204 }); // 204: No Content
}
