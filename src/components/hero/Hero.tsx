// src/components/hero/Hero.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface HeroProps {
  imageSrc: string; // public klasöründeki resim yolu, örn "/hero.jpg"
  videoSrc: string; // public klasöründeki video yolu, örn "/hero.mp4"
  title: string;
  subtitle: string;
}

export default function Hero({
  imageSrc,
  videoSrc,
  title,
  subtitle,
}: HeroProps) {
  const [showImage, setShowImage] = useState(true);
  const timerRef = useRef<number | null>(null);

  // 1) İlk 3 saniye resmi göster, sonra videoya geç
  useEffect(() => {
    if (showImage) {
      timerRef.current = window.setTimeout(() => {
        setShowImage(false);
      }, 3000);
    }
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [showImage]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Arka plan: image veya video */}
      {showImage ? (
        <Image
          src={imageSrc}
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
      ) : (
        <video
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          onEnded={() => setShowImage(true)}
        />
      )}

      {/* İçerik overlay */}
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-white">
          {title}
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl text-white">{subtitle}</p>
      </div>
    </section>
  );
}
