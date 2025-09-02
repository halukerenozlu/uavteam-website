// src/app/(public)/_sections/HomeNews.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_CARD_IMAGE } from "@/constants/images";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  FaGlobe,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
  FaRegNewspaper,
} from "react-icons/fa";
import type { HomeCard, HomeCardLink } from "@prisma/client";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Prisma tipleriyle birleşik tip
type CardWithLinks = HomeCard & { links: HomeCardLink[] };

const iconByType = {
  WEB: FaGlobe,
  INSTAGRAM: FaInstagram,
  YOUTUBE: FaYoutube,
  X: FaTwitter, // X için Twitter ikonu
  LINKEDIN: FaLinkedin,
  NEWS: FaRegNewspaper,
} as const;

type LinkForView = { id: string; type: keyof typeof iconByType; url: string };

function CardView({
  title,
  content,
  imageUrl,
  links,
}: {
  title: string;
  content: string;
  imageUrl: string;
  links: LinkForView[];
}) {
  return (
    <Card className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md h-full flex flex-col !p-1">
      {/* Üst görsel (dikey kart hissi) */}
      <div className="relative w-full h-48 sm:h-56">
        <Image
          src={imageUrl || DEFAULT_CARD_IMAGE}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          unoptimized
          priority={false}
        />
      </div>
      {/* Alt içerik */}
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-semibold line-clamp-1 text-center">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-3 text-center">
          {content}
        </p>

        {links.length > 0 && (
          <div className="!mt-3 !mb-3 flex flex-wrap gap-2 justify-center items-center">
            {links.map((l: LinkForView) => {
              const Icon = iconByType[l.type] ?? FaGlobe;
              return (
                <Link
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-black underline-offset-4 hover:underline"
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{l.type}</span>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function HomeNews({ take = 8 }: { take?: number }) {
  const cards: CardWithLinks[] = await prisma.homeCard.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { links: true },
    take,
  });

  if (cards.length === 0) return null;

  const needsCarousel = cards.length > 3;

  // 3 ve altı: grid
  if (!needsCarousel) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.slice(0, 3).map((c: CardWithLinks) => (
          <CardView
            key={c.id}
            title={c.title}
            content={c.content}
            imageUrl={c.imageUrl}
            links={c.links.map((l: HomeCardLink) => ({
              id: l.id,
              type: l.type as keyof typeof iconByType,
              url: l.url,
            }))}
          />
        ))}
      </div>
    );
  }

  // 4+ kart: yatay carousel, oklar altta
  return (
    <div className="w-full">
      <Carousel className="w-full">
        <CarouselContent>
          {cards.map((c: CardWithLinks) => (
            <CarouselItem
              key={c.id}
              className="basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div className="!p-1 h-full">
                <CardView
                  title={c.title}
                  content={c.content}
                  imageUrl={c.imageUrl}
                  links={c.links.map((l: HomeCardLink) => ({
                    id: l.id,
                    type: l.type as keyof typeof iconByType,
                    url: l.url,
                  }))}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-4 flex items-center justify-center gap-1 !pt-3">
          <CarouselPrevious className="relative translate-y-1 opacity-60 hover:opacity-100" />
          <CarouselNext className="relative translate-y-1 opacity-60 hover:opacity-100" />
        </div>
      </Carousel>
    </div>
  );
}
