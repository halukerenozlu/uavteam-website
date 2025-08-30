// src/app/(public)/_sections/FeaturedVehicleCarousel.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function FeaturedVehicleCarousel({
  take = 5,
}: {
  take?: number;
}) {
  const rows = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    take,
    select: { imageUrl: true, title: true },
  });

  const images = rows.map((r) => ({
    src: r.imageUrl,
    alt: r.title || "Vehicle",
  }));

  return (
    <div className="w-full flex justify-center">
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {images.length > 0
            ? images.map((img, i) => (
                <CarouselItem key={i}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-2">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          width={300}
                          height={300}
                          className="rounded-lg object-cover w-full h-full"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            : Array.from({ length: 3 }).map((_, i) => (
                <CarouselItem key={i}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-2">
                        <Image
                          src="/nokta.png"
                          alt="placeholder"
                          width={300}
                          height={300}
                          className="rounded-lg object-cover w-full h-full"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
