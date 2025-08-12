// src/app/team/page.tsx

import TeamHero from "@/components/team/TeamHero";
import TeamSection from "@/components/team/TeamSection";

export default function TeamPage() {
  return (
    <>
      <TeamHero />
      <main className="bg-white pt-10 pb-16">
        <TeamSection />
      </main>
    </>
  );
}
