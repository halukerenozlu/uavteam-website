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

// 1) Dönen satırların tipini netleştir
type VehicleRow = {
  imageUrl: string | null; // şemanız non-null ise string yapın
  title: string | null;
};

// 2) UI’da kullanacağımız image tipini netleştir
type UiImage = {
  src: string;
  alt: string;
};

export default async function FeaturedVehicleCarousel({
  take = 5,
}: {
  take?: number;
}) {
  // 3) rows'u açıkça tipleyin
  const rows: VehicleRow[] = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    take,
    select: { imageUrl: true, title: true },
  });

  // 4) images'i açık tip ile üretin — artık img ve i otomatik tiplenecek
  const images: UiImage[] = rows
    .filter(
      (
        r
      ): r is Required<Pick<VehicleRow, "imageUrl">> & {
        title: string | null;
      } => !!r.imageUrl
    )
    .map((r) => ({
      src: r.imageUrl!, // filter ile null'ı eledik
      alt: r.title ?? "Vehicle",
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
