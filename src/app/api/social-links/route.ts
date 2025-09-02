import { NextResponse } from "next/server";
import { getSocialLinks } from "@/app/admin/(panel)/control-center/actions";

export const dynamic = "force-dynamic"; // her istekte DB'den çeksin
// alternatif: export const revalidate = 60; // 60sn cache

export async function GET() {
  const res = await getSocialLinks(); // { ok, data: [{label, url, order}] }
  if (!res.ok) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
  // { Instagram: "...", LinkedIn: "...", YouTube: "..." } objesine çevir
  const obj = Object.fromEntries(res.data.map((x) => [x.label, x.url]));
  return NextResponse.json(obj, { status: 200 });
}
