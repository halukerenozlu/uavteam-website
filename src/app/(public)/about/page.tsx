// src/app/about/page.tsx

import AboutHero from "@/components/about/AboutHero";
import AboutSection from "@/components/about/AboutSection";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <main className="bg-white pt-10 pb-16">
        <AboutSection />
      </main>
    </>
  );
}
