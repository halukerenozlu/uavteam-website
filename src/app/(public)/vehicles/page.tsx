// src/app/vehicles/page.tsx
import VehiclesHero from "@/components/vehicles/VehiclesHero";
import VehiclesSection from "@/components/vehicles/VehiclesSection";
import { prisma } from "@/lib/prisma";

export const revalidate = 0; // anında güncelle
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function VehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      title: true,
      description: true,
      imageUrl: true,
      videoUrl: true,
    },
  });

  return (
    <>
      <VehiclesHero />
      <main className="bg-white pt-10 pb-16">
        <VehiclesSection vehicles={vehicles} />
      </main>
    </>
  );
}
