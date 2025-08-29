// src/app/api/vehicles/route.ts  (GET + POST)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const data = await req.json();
  if (!data.title || !data.imageUrl) {
    return NextResponse.json(
      { error: "title & imageUrl gerekli" },
      { status: 400 }
    );
  }
  const row = await prisma.vehicle.create({ data });
  return NextResponse.json(row, { status: 201 });
}
