// src/app/team/page.tsx

import TeamHero from "@/components/team/TeamHero";
import TeamSection from "@/components/team/TeamSection";
import { getApplyLinks } from "@/app/admin/(panel)/control-center/actions";

export default async function TeamPage() {
  const links = await getApplyLinks();

  return (
    <>
      <TeamHero />
      <main className="bg-white pt-10 pb-16">
        <TeamSection
          forms={{
            mechanical: links.mechanical || "https://forms.gle/xxx-mech",
            avionic: links.avionic || "https://forms.gle/xxx-av",
            software: links.software || "https://forms.gle/xxx-sw",
          }}
        />
      </main>
    </>
  );
}
