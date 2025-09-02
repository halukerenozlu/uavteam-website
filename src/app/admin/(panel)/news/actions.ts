"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// // --- Supabase'i sonra ekleyeceğiz ---
// // import { supabaseAdmin } from "@/lib/supabaseAdmin";
// // import { randomUUID } from "crypto";
// // const BUCKET = process.env.SUPABASE_BUCKET_NEWS || "news-images";

// ---- Utils ----
function dedupeLinksByType<T extends { type: string }>(links: T[]): T[] {
  const map = new Map<string, T>();
  for (const l of links) map.set(l.type, l); // son görüleni tut
  return Array.from(map.values());
}

// // (İLERİDE) Storage upload (PC'den yükleme)
// // export async function uploadNewsImage(file: File) {
// //   if (!file || file.size === 0) {
// //     throw new Error("Dosya bulunamadı veya boş.");
// //   }
// //   const ext = file.name.split(".").pop() || "bin";
// //   const key = `news/${randomUUID()}.${ext}`;
// //   const buffer = Buffer.from(await file.arrayBuffer());

// //   const { error: upErr } = await supabaseAdmin
// //     .storage.from(BUCKET)
// //     .upload(key, buffer, {
// //       contentType: file.type || "application/octet-stream",
// //       upsert: false,
// //     });

// //   if (upErr) {
// //     console.error(upErr);
// //     throw new Error("Yükleme başarısız: " + upErr.message);
// //   }

// //   const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(key);
// //   return { url: pub.publicUrl, path: key };
// // }

// ---- CRUD ----
export async function getNewsCards() {
  return prisma.homeCard.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { links: true },
  });
}

export async function createNewsCard(input: {
  title: string;
  content: string;
  imageUrl: string;
  order?: number;
  isActive?: boolean;
  links?: Array<{
    type: "WEB" | "INSTAGRAM" | "YOUTUBE" | "X" | "LINKEDIN" | "NEWS";
    url: string;
  }>;
}) {
  const links = input.links ? dedupeLinksByType(input.links) : [];

  await prisma.homeCard.create({
    data: {
      title: input.title,
      content: input.content,
      imageUrl: input.imageUrl,
      order: input.order ?? 0,
      isActive: input.isActive ?? true,
      links: links.length
        ? { create: links.map((l) => ({ type: l.type, url: l.url })) }
        : undefined,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/news");
}

export async function updateNewsCard(
  id: string,
  patch: {
    title?: string;
    content?: string;
    imageUrl?: string;
    order?: number;
    isActive?: boolean;
    links?: Array<{
      id?: string;
      type: "WEB" | "INSTAGRAM" | "YOUTUBE" | "X" | "LINKEDIN" | "NEWS";
      url: string;
    }>;
  }
) {
  await prisma.$transaction(async (tx) => {
    if (patch.links) {
      const links = dedupeLinksByType(patch.links);

      // mevcut linkleri çek
      const existing = await tx.homeCardLink.findMany({
        where: { cardId: id },
      });

      // formda kalan id'ler
      const keepIds = new Set(
        links.map((l) => l.id).filter(Boolean) as string[]
      );

      // formda olmayanları sil
      const toDelete = existing
        .filter((e) => !keepIds.has(e.id))
        .map((e) => e.id);
      if (toDelete.length) {
        await tx.homeCardLink.deleteMany({ where: { id: { in: toDelete } } });
      }

      // upsert: id varsa update, yoksa unique (cardId,type) temizleyip create
      for (const l of links) {
        if (l.id) {
          await tx.homeCardLink.update({
            where: { id: l.id },
            data: { type: l.type, url: l.url },
          });
        } else {
          await tx.homeCardLink.deleteMany({
            where: { cardId: id, type: l.type },
          });
          await tx.homeCardLink.create({
            data: { cardId: id, type: l.type, url: l.url },
          });
        }
      }
    }

    await tx.homeCard.update({
      where: { id },
      data: {
        title: patch.title,
        content: patch.content,
        imageUrl: patch.imageUrl,
        order: patch.order,
        isActive: patch.isActive,
      },
    });
  });

  revalidatePath("/");
  revalidatePath("/admin/news");
}

export async function deleteNewsCard(id: string) {
  await prisma.homeCard.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/news");
}
