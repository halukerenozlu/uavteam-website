// src/components/vehicles/VehiclesSection.tsx
"use client";
import Image from "next/image";

const vehicles = [
  {
    name: "VTOL UAV",
    description: "lorem ipsum sit dolor amet, consectetur adipiscing elit.",
    image: "/drone.jpg",
    videoLink: "https://youtube.com/watch?v=OCv-QB3KOWw",
  },
  {
    name: "EXPRESS UAV",
    description: "lorem ipsum sit dolor amet, consectetur adipiscing elit.",
    image: "/drone.jpg",
    videoLink: "https://youtube.com/watch?v=OCv-QB3KOWw",
  },
  {
    name: "CLAYMORE DRONE",
    description: "lorem ipsum sit dolor amet, consectetur adipiscing elit.",
    image: "/drone.jpg",
    videoLink: "https://youtube.com/watch?v=OCv-QB3KOWw",
  },
  {
    name: "KAMIKAZE DRONE",
    description: "lorem ipsum sit dolor amet, consectetur adipiscing elit.",
    image: "/drone.jpg",
    videoLink: "https://youtube.com/watch?v=OCv-QB3KOWw",
  },
];

export default function VehiclesSection() {
  return (
    <div className="grid place-items-center gap-10 py-10">
      <div className="h-[25px]" />
      {vehicles.map((v, i) => (
        <article
          key={i}
          className="w-[75vw] mx-auto flex flex-col md:flex-row bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          {/* Sol: Görsel */}
          <div className="relative w-full md:w-1/3 h-[220px]">
            <Image
              src={v.image}
              alt={v.name}
              fill
              className="object-cover"
              sizes="(min-width:768px) 33vw, 75vw"
            />
          </div>

          {/* Sağ: Başlık + Açıklama */}
          <div className="flex flex-col items-center justify-center w-full md:w-2/3 p-6 md:text-center">
            <h2 className="text-2xl font-bold text-black mb-2">{v.name}</h2>
            <div className="h-[5px]" />
            <div className="w-32 h-1 bg-red-500 mb-6 mx-auto"></div>
            <div className="h-[20px]" />
            <p className="text-gray-700 text-sm">{v.description}</p>
            <div className="h-[30px]" />
            <a
              href={v.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-4"
            >
              Watch Video
            </a>
          </div>
        </article>
      ))}
      <div className="h-[25px]" />
    </div>
  );
}
