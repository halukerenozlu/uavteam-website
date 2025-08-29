// src/app/vehicles/page.tsx

import VehiclesHero from "@/components/vehicles/VehiclesHero";
import VehiclesSection from "@/components/vehicles/VehiclesSection";

export default function VehiclesPage() {
  return (
    <>
      <VehiclesHero />
      <main className="bg-white pt-10 pb-16">
        <VehiclesSection />
      </main>
    </>
  );
}
