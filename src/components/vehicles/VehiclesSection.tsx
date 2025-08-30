// src/components/vehicles/VehiclesSection.tsx
"use client";
import Image from "next/image";

export type VehicleCard = {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string | null;
};

export default function VehiclesSection({
  vehicles = [],
}: {
  vehicles?: VehicleCard[];
}) {
  return (
    <div className="grid place-items-center gap-10 py-10">
      <div className="h-[25px]" />
      {vehicles.map((v, i) => (
        <article
          key={i}
          className="w-[75vw] mx-auto flex flex-col md:flex-row bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <div className="relative w-full md:w-1/3 h-[220px]">
            <Image
              src={v.imageUrl}
              alt={v.title}
              fill
              className="object-cover"
              sizes="(min-width:768px) 33vw, 75vw"
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full md:w-2/3 p-6 md:text-center">
            <h2 className="text-2xl font-bold text-black mb-2 !mt-1">
              {v.title}
            </h2>
            <div className="h-[5px]" />
            <div className="w-32 h-1 bg-red-500 mb-6 mx-auto" />
            <div className="h-[20px]" />
            <p className="text-gray-700 text-sm !p-6 ">{v.description}</p>
            <div className="h-[30px]" />
            {v.videoUrl && (
              <a
                href={v.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-4 !mb-2"
              >
                Watch Video
              </a>
            )}
          </div>
        </article>
      ))}
      <div className="h-[25px]" />
    </div>
  );
}
