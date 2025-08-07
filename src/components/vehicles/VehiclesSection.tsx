"use client";

import Image from "next/image";

const vehicles = [
  {
    name: "Kamikaze Drone",
    description:
      "Yüksek hızda hedefe yönelen, tek yönlü görevler için tasarlanmış otonom drone.",
    image: "/nokta.png",
  },
  {
    name: "Gözcü Drone",
    description:
      "Uzun menzilli gözetleme ve görüntü işleme görevlerinde optimize edilmiş keşif drone'u.",
    image: "/nokta.png",
  },
  {
    name: "Claymore Drone",
    description:
      "Yakın menzilli savunma ve güvenlik operasyonları için geliştirilmiş drone.",
    image: "/nokta.png",
  },
];

export default function VehiclesSection() {
  return (
    <div className="flex flex-col gap-12 px-6 max-w-6xl mx-auto">
      {vehicles.map((vehicle, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
        >
          {/* Sol: Görsel */}
          <div className="relative w-full md:w-1/3 h-[220px]">
            <Image
              src={vehicle.image}
              alt={vehicle.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Sağ: Başlık + Açıklama */}
          <div className="flex flex-col justify-center p-6 w-full md:w-2/3 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">{vehicle.name}</h2>
            <p className="text-gray-700 text-sm">{vehicle.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
