// src/components/sponsor/SponsorsCarousel.tsx
import Image from "next/image";
import { getSponsors } from "@/app/admin/(panel)/control-center/actions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default async function SponsorsCarousel() {
  const sponsors = await getSponsors(); // DB’den sponsor listesi [{id,imageUrl,...}]

  if (!sponsors || sponsors.length === 0) {
    return (
      <p className="text-center text-gray-500">Henüz sponsor eklenmedi.</p>
    );
  }

  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {sponsors.map((s) => (
          <CarouselItem key={s.id} className="md:basis-1/2 lg:basis-1/2">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-2">
                  <Image
                    src={s.imageUrl}
                    alt={s.title ?? "Sponsor"}
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
  );
}
