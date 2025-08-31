"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

/* -------------------- Tipler & ortaklar -------------------- */

type SponsorRow = {
  id: string;
  imageUrl: string;
  title: string | null;
  order: number;
};

type Ok<T> = { ok: true; data: T };
type Fail = { ok: false; error: string };

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "unknown error";
}

function isUrl(s?: string | null) {
  if (!s) return false;
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

/* -------------------- Auth yardımcıları -------------------- */

const COOKIE_NAME = "session";

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET not set");
  return new TextEncoder().encode(secret);
}

async function getCurrentAdminId(): Promise<string | null> {
  const jar = await cookies(); // <-- async
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const p = payload as Record<string, unknown>;
    const id =
      typeof p.id === "string"
        ? p.id
        : typeof p.sub === "string"
        ? p.sub
        : null;
    return id ?? null;
  } catch {
    return null;
  }
}

/* -------------------- APPLY LINKS -------------------- */

export async function getApplyLinks() {
  const row = await prisma.applyLinks.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, mechanical: null, avionic: null, software: null },
  });
  return {
    mechanical: row.mechanical ?? "",
    avionic: row.avionic ?? "",
    software: row.software ?? "",
  };
}

export async function saveApplyLinks(opts: {
  mechanical?: string;
  avionic?: string;
  software?: string;
}) {
  const m = opts.mechanical?.trim();
  const a = opts.avionic?.trim();
  const s = opts.software?.trim();

  if (m && !isUrl(m))
    return { ok: false as const, error: "Mechanical için geçersiz URL" };
  if (a && !isUrl(a))
    return { ok: false as const, error: "Avionic için geçersiz URL" };
  if (s && !isUrl(s))
    return { ok: false as const, error: "Software için geçersiz URL" };

  await prisma.applyLinks.upsert({
    where: { id: 1 },
    update: { mechanical: m || null, avionic: a || null, software: s || null },
    create: {
      id: 1,
      mechanical: m || null,
      avionic: a || null,
      software: s || null,
    },
  });

  revalidatePath("/admin/control-center");
  // revalidatePath("/team");
  return { ok: true as const };
}

/* -------------------- SOSYAL LİNKLER -------------------- */

export type SocialLabel = "Instagram" | "YouTube" | "LinkedIn";
type SocialItem = { label: SocialLabel; url: string; order?: number };

/** DB’den (yoksa boş) 3 linki sırayla döner */
export async function getSocialLinks(): Promise<{
  ok: true;
  data: SocialItem[];
}> {
  const allowed: SocialLabel[] = ["Instagram", "YouTube", "LinkedIn"];

  const rows = await prisma.socialLink.findMany({
    where: { label: { in: allowed } },
    select: { label: true, url: true, order: true },
    orderBy: { order: "asc" },
  });

  const map = new Map<SocialLabel, { url: string; order: number | null }>();
  for (const r of rows) {
    map.set(r.label as SocialLabel, { url: r.url, order: r.order });
  }

  const data: SocialItem[] = allowed.map((label, i) => ({
    label,
    url: map.get(label)?.url ?? "",
    order: map.get(label)?.order ?? i,
  }));

  return { ok: true as const, data };
}

/** 3 linki birden günceller (label sabit; sadece url ve order) */
export async function updateSocial(payload: SocialItem[]) {
  const allowed: SocialLabel[] = ["Instagram", "YouTube", "LinkedIn"];

  for (const item of payload) {
    if (!allowed.includes(item.label)) {
      return { ok: false as const, error: `Geçersiz label: ${item.label}` };
    }
    const u = item.url?.trim();
    if (u && !isUrl(u)) {
      return { ok: false as const, error: `${item.label} için geçersiz URL` };
    }
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    for (let i = 0; i < payload.length; i++) {
      const { label, url } = payload[i];
      await tx.socialLink.upsert({
        where: { label }, // label unique olmalı
        create: { label, url: url?.trim() ?? "", order: i },
        update: { url: url?.trim() ?? "", order: i },
      });
    }
  });

  revalidatePath("/admin/control-center");
  return { ok: true as const };
}

/* -------------------- SPONSORLAR -------------------- */

export async function getSponsors(): Promise<SponsorRow[]> {
  const rows = await prisma.sponsor.findMany({
    where: { isActive: true },
    select: { id: true, imageUrl: true, title: true, order: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return rows;
}

function assertValidUrl(url: string) {
  const u = url.trim();
  new URL(u); // Geçersizse Error fırlatır
}

export async function addSponsor(
  imageUrl: string,
  title?: string
): Promise<Ok<SponsorRow> | Fail> {
  try {
    assertValidUrl(imageUrl);

    const count = await prisma.sponsor.count();
    const inserted = await prisma.sponsor.create({
      data: {
        imageUrl: imageUrl.trim(),
        title: title ?? null,
        order: count,
        isActive: true,
      },
      select: { id: true, imageUrl: true, title: true, order: true },
    });

    revalidatePath("/admin/control-center");
    revalidatePath("/"); // anasayfa

    return { ok: true, data: inserted };
  } catch (e: unknown) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function removeSponsor(id: string): Promise<Ok<null> | Fail> {
  try {
    await prisma.sponsor.delete({ where: { id } });

    revalidatePath("/admin/control-center");
    revalidatePath("/"); // anasayfa

    return { ok: true, data: null };
  } catch (e: unknown) {
    return { ok: false, error: errorMessage(e) };
  }
}

/* -------------------- HESABI SİL -------------------- */

export async function deleteMyAccount(): Promise<Ok<null> | Fail> {
  try {
    const adminId = await getCurrentAdminId();
    if (!adminId) {
      return { ok: false, error: "Oturum bulunamadı" };
    }

    // Güvenlik: sistemdeki admin sayısı 1 ise silme
    const total = await prisma.admin.count();
    if (total <= 1) {
      return { ok: false, error: "Son admin silinemez" };
    }

    await prisma.admin.delete({ where: { id: adminId } });

    // Oturumu düşür: session cookie’yi temizle (async cookies)
    const jar = await cookies();
    jar.delete(COOKIE_NAME);

    revalidatePath("/admin");
    return { ok: true, data: null };
  } catch (e: unknown) {
    return { ok: false, error: errorMessage(e) };
  }
}
