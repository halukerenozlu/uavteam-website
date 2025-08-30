// src/app/api/uploads/by-url/route.ts
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { extname } from "path";
import crypto from "crypto";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url gerekli" }, { status: 400 });
    }

    // HEAD ile tip/boyut kontrolü (her sunucu desteklemeyebilir)
    let contentType = "";
    let contentLength = 0;
    try {
      const head = await fetch(url, { method: "HEAD" });
      if (head.ok) {
        contentType = head.headers.get("content-type") || "";
        contentLength = Number(head.headers.get("content-length") || 0);
      }
    } catch {}

    // GET ile indir
    const res = await fetch(url);
    if (!res.ok)
      return NextResponse.json({ error: "İndirilemedi" }, { status: 400 });

    const ct = res.headers.get("content-type") || contentType;
    if (!ALLOWED.has(ct)) {
      return NextResponse.json(
        { error: "Sadece JPG/PNG/WebP/AVIF" },
        { status: 400 }
      );
    }

    const len = Number(res.headers.get("content-length") || contentLength || 0);
    if (len && len > MAX_SIZE) {
      return NextResponse.json({ error: "Maks 5MB" }, { status: 400 });
    }

    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_SIZE) {
      return NextResponse.json({ error: "Maks 5MB" }, { status: 400 });
    }

    const buffer = Buffer.from(arrayBuffer);

    // dosya adı + uzantı
    const extFromHeader =
      ct === "image/jpeg"
        ? ".jpg"
        : ct === "image/png"
        ? ".png"
        : ct === "image/webp"
        ? ".webp"
        : ct === "image/avif"
        ? ".avif"
        : "";
    const ext = extname(new URL(url).pathname) || extFromHeader || ".jpg";
    const filename = crypto.randomUUID() + ext;

    const dir = process.cwd() + "/public/uploads";
    await mkdir(dir, { recursive: true });
    await writeFile(`${dir}/${filename}`, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return NextResponse.json({ error: "URL import hatası" }, { status: 500 });
  }
}
