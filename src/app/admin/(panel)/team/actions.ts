"use server"; // ✅ MODÜL SEVİYESİNDE

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MemberSchema, type MemberInput } from "@/lib/validation/teamMember";

// ❗️Bu dosyadan SADECE async fonksiyonlar export edilecek (obje/type export etmiyoruz)

export async function getMembers() {
  return prisma.teamMember.findMany({
    orderBy: [
      { isPresident: "desc" },
      { isCaptain: "desc" },
      { order: "asc" },
      { createdAt: "desc" },
    ],
  });
}

export async function createMember(input: MemberInput) {
  const data = MemberSchema.parse(input);

  if (data.isPresident) {
    await prisma.teamMember.updateMany({ data: { isPresident: false } });
  }

  const created = await prisma.teamMember.create({ data });
  revalidatePath("/admin/team");
  revalidatePath("/team");
  return created;
}

export async function updateMember(input: MemberInput) {
  const data = MemberSchema.parse(input);
  if (!data.id) throw new Error("Üye id eksik");

  if (data.isPresident) {
    await prisma.teamMember.updateMany({
      where: { NOT: { id: data.id } },
      data: { isPresident: false },
    });
  }

  const { id, ...rest } = data;
  const updated = await prisma.teamMember.update({ where: { id }, data: rest });
  revalidatePath("/admin/team");
  revalidatePath("/team");
  return updated;
}

export async function deleteMember(id: string) {
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/admin/team");
  revalidatePath("/team");
  return { ok: true };
}
