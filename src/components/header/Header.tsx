"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// 🔽 EKLENDİ: kişi/avatara uygun ikon
import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaUserCircle,
} from "react-icons/fa";

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY) {
        setShowHeader(true);
      } else if (currentScrollY > 100) {
        setShowHeader(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 z-50 w-full bg-black h-[10vh] text-white py-4 px-2 mx-4 transition-transform duration-500 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Sol menü */}
      <nav className="absolute left-4 top-0 h-full flex items-center gap-8 px-6 text-white">
        <Link
          href="/about"
          className="text-white hover:text-gray-300 transition-colors"
        >
          About
        </Link>
        <Link
          href="/team"
          className="text-white hover:text-gray-300 transition-colors"
        >
          Team
        </Link>
        <Link
          href="/vehicles"
          className="text-white hover:text-gray-300 transition-colors"
        >
          Vehicles
        </Link>
        <Link
          href="/team#join"
          className="text-white hover:text-gray-300 transition-colors"
        >
          Join Us
        </Link>
      </nav>

      {/* Logo: viewport sınırlarının tam ortasında */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Link href="/">
          <Image
            src="/kuasarlogo.jpg"
            alt="Kuasar Logo"
            width={48}
            height={48}
            priority
          />
        </Link>
      </div>

      {/* Sağ menü */}
      <nav className="absolute right-4 top-0 h-full flex items-center gap-4 px-6 text-white">
        {/* 🔽 EKLENDİ: Contact’ın SOLUNA avatar/kişi simgesi */}
        <Link
          href="/admin"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Admin panel"
          title="Admin"
          className="p-2 rounded-full text-white hover:bg-gray-800 transition-colors"
        >
          <FaUserCircle size={20} />
        </Link>

        <Link
          href="/contact"
          className="text-white hover:text-gray-300 transition-colors"
        >
          Contact
        </Link>
        <Link
          href="https://instagram.com/kuasarinsis"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full text-white hover:bg-gray-800 transition-colors"
        >
          <FaInstagram size={20} />
        </Link>
        <Link
          href="https://linkedin.com/yourclub"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full text-white hover:bg-gray-800 transition-colors"
        >
          <FaLinkedin size={20} />
        </Link>
        <Link
          href="https://youtube.com/watch?v=OCv-QB3KOWw"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full text-white hover:bg-gray-800 transition-colors"
        >
          <FaYoutube size={20} />
        </Link>
      </nav>
    </header>
  );
}
