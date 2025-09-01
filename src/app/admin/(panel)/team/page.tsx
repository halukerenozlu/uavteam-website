// src/app/admin/(panel)/team/page.tsx
import { getMembers } from "@/app/admin/(panel)/team/actions";
import TeamMembersList from "@/app/admin/_components/team/TeamMembersList";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function TeamPage() {
  const items = await getMembers();
  return (
    <main className="min-h-svh !pt-20 !m-6">
      <TeamMembersList items={items} />
    </main>
  );
}
