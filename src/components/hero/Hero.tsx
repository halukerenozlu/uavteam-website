"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HiVolumeUp, HiVolumeOff, HiPlay, HiPause } from "react-icons/hi";

interface HeroProps {
  imageSrc: string;
  videoSrc: string;
  title: string;
  subtitle: string;
}

const HIDE_DELAY_MS = 3500; // 3.5 sn hareketsizlikte kontrolleri gizle

export default function Hero({
  imageSrc,
  videoSrc,
  title,
  subtitle,
}: HeroProps) {
  const [showImage, setShowImage] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // 🔇 başlangıçta ses kapalı
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const imageTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // 1) İlk 3 saniye resmi göster, sonra videoya geç
  useEffect(() => {
    if (showImage) {
      imageTimerRef.current = window.setTimeout(() => {
        setShowImage(false);
      }, 3000);
    }
    return () => {
      if (imageTimerRef.current !== null)
        window.clearTimeout(imageTimerRef.current);
    };
  }, [showImage]);

  // 2) Video görünür olunca autoplay'i güvenceye al (muted olduğu için sorun yok)
  useEffect(() => {
    if (!showImage && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay engellenirse kullanıcı etkileşimi beklenecek
      });
    }
  }, [showImage]);

  // 3) 3.5 sn hareketsizlikte kontrolleri gizle; hareket olunca göster
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || showImage) return;

    const resetHideTimer = () => {
      setShowControls(true);
      if (hideTimerRef.current !== null)
        window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(
        () => setShowControls(false),
        HIDE_DELAY_MS
      );
    };

    // Başlangıçta zamanlayıcıyı başlat
    resetHideTimer();

    // Pointer + touch + klavye etkileşimleri
    const onPointerMove = () => resetHideTimer();
    const onTouchStart = () => resetHideTimer();
    const onKeyDown = () => resetHideTimer();

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("keydown", onKeyDown);
      if (hideTimerRef.current !== null)
        window.clearTimeout(hideTimerRef.current);
    };
  }, [showImage]);

  // 4) Kontroller
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
    // Oynatma tutarlılığı
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPaused(false);
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPaused(false))
        .catch(() => setIsPaused(true));
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
    >
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
          ref={videoRef}
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          onEnded={() => setShowImage(true)}
        />
      )}

      {/* Sağ alt köşe kontrol butonları — otomatik gizlenir */}
      {!showImage && (
        <div
          className={[
            "absolute bottom-4 right-4 flex gap-3 z-10 transition-opacity duration-300",
            showControls
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          {/* Ses butonu */}
          <button onClick={toggleMute}>
            {isMuted ? (
              <HiVolumeOff className="text-white w-8 h-8" />
            ) : (
              <HiVolumeUp className="text-white w-8 h-8" />
            )}
            {/* Tooltip */}
            <span className="pointer-events-none absolute bottom-full mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
              {isMuted ? "Sesi Aç" : "Sesi Kapat"}
            </span>
          </button>

          {/* Oynat/Durdur butonu */}
          <button onClick={togglePlayPause}>
            {isPaused ? (
              <HiPlay className="text-white w-8 h-8" />
            ) : (
              <HiPause className="text-white w-8 h-8" />
            )}
            {/* Tooltip */}
            <span className="pointer-events-none absolute bottom-full mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
              {isPaused ? "Oynat" : "Durdur"}
            </span>
          </button>
        </div>
      )}

      {/* İçerik overlay */}
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-white">
          {title}
        </h1>
        <div className="h-[20px]" />
        <p className="max-w-2xl text-lg sm:text-xl text-white">{subtitle}</p>
      </div>
    </section>
  );
}
