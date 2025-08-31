// src/components/header/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { openAdminTab } from "@/lib/openAdminTab";
import { usePathname } from "next/navigation";
import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaUserCircle,
} from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

// DB'den sosyal linkleri al
import { getSocialLinks } from "@/app/admin/(panel)/control-center/actions";

// ---- Tip tanımı ----
type RightLink = {
  label: "Contact" | "Instagram" | "LinkedIn" | "YouTube";
  href: string;
  external?: boolean;
  icon?: React.ReactNode;
};

const leftLinks = [
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Join Us", href: "/team#join" },
];

const rightLinks: RightLink[] = [
  { label: "Contact", href: "/contact" },
  {
    label: "Instagram",
    href: "https://instagram.com/kuasarinsis",
    external: true,
    icon: <FaInstagram size={20} />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/yourclub",
    external: true,
    icon: <FaLinkedin size={20} />,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/watch?v=OCv-QB3KOWw",
    external: true,
    icon: <FaYoutube size={20} />,
  },
];

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const pathname = usePathname();

  // DB'den gelen sosyal URL’ler
  const [socialUrls, setSocialUrls] = useState<{
    Instagram?: string;
    LinkedIn?: string;
    YouTube?: string;
  }>({
    Instagram: rightLinks.find((r) => r.label === "Instagram")?.href,
    LinkedIn: rightLinks.find((r) => r.label === "LinkedIn")?.href,
    YouTube: rightLinks.find((r) => r.label === "YouTube")?.href,
  });

  // Sayfa değişince menüleri kapat
  useEffect(() => {
    setMenuOpen(false);
    setContactOpen(false);
  }, [pathname]);

  // Scroll gizle/göster
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < lastScrollY) setShowHeader(true);
      else if (y > 100) setShowHeader(false);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Sosyal linkleri çek
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getSocialLinks();
        if (!mounted || !res.ok) return;
        const map = Object.fromEntries(res.data.map((x) => [x.label, x.url]));
        setSocialUrls((prev) => ({
          Instagram: map.Instagram || prev.Instagram,
          LinkedIn: map.LinkedIn || prev.LinkedIn,
          YouTube: map.YouTube || prev.YouTube,
        }));
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full bg-black h-[10vh] text-white transition-transform duration-500 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-4 h-full px-2">
        <div className="grid grid-cols-3 items-center h-full">
          {/* SOL */}
          <div className="hidden min-[821px]:flex items-center gap-8 px-6 !p-2">
            {leftLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-gray-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobil Menu */}
          <div className="flex items-center min-[821px]:hidden !p-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen((v) => !v);
                  setContactOpen(false);
                }}
                className="px-3 py-1.5 rounded-md border border-white/30 inline-flex items-center gap-1 hover:bg-white/10 transition-colors !p-2"
              >
                Menu <FiChevronDown />
              </button>
              {menuOpen && (
                <div className="absolute left-[3px] mt-2 w-40 rounded-md border bg-black shadow-lg !p-2 z-50 origin-top-left">
                  {leftLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-3 py-2 rounded hover:bg-white/10 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ORTA (Logo) */}
          <div className="flex justify-center">
            <Link href="/" className="hidden min-[821px]:block">
              <Image
                src="/kuasarlogo.jpg"
                alt="Kuasar Logo"
                width={48}
                height={48}
                priority
              />
            </Link>
            <Link href="/" className="min-[821px]:hidden">
              <Image
                src="/kuasarlogo.jpg"
                alt="Kuasar Logo"
                width={40}
                height={40}
                priority
              />
            </Link>
          </div>

          {/* SAĞ */}
          <div className="hidden min-[821px]:flex items-center justify-end gap-4 px-6 !p-2">
            <Link
              href="/admin"
              aria-label="Admin panel"
              title="Admin"
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={(e) => openAdminTab(e)}
            >
              <FaUserCircle size={20} />
            </Link>

            {rightLinks.map((link) => {
              const hrefOverride =
                link.label === "Instagram"
                  ? socialUrls.Instagram
                  : link.label === "LinkedIn"
                  ? socialUrls.LinkedIn
                  : link.label === "YouTube"
                  ? socialUrls.YouTube
                  : undefined;

              const href = hrefOverride ?? link.href;

              return link.external ? (
                <a
                  key={link.label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                >
                  {link.icon ?? null}
                  {link.icon ? (
                    <span className="sr-only">{link.label}</span>
                  ) : (
                    link.label
                  )}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={href}
                  className="hover:text-gray-300 transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobil sağ (Contact + Admin) */}
          <div className="flex items-center justify-end gap-2 min-[821px]:hidden !p-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setContactOpen((v) => !v);
                  setMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-md border border-white/30 inline-flex items-center gap-1 hover:bg-white/10 transition-colors !p-2"
              >
                Contact <FiChevronDown />
              </button>
              {contactOpen && (
                <div className="absolute right-[3px] mt-2 w-48 rounded-md border bg-black shadow-lg !p-2 z-50 origin-top-right">
                  {rightLinks.map((link) => {
                    const hrefOverride =
                      link.label === "Instagram"
                        ? socialUrls.Instagram
                        : link.label === "LinkedIn"
                        ? socialUrls.LinkedIn
                        : link.label === "YouTube"
                        ? socialUrls.YouTube
                        : undefined;

                    const href = hrefOverride ?? link.href;

                    return link.external ? (
                      <a
                        key={link.label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition-colors"
                        onClick={() => setContactOpen(false)}
                      >
                        {link.icon ?? null}
                        <span>{link.label}</span>
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        href={href}
                        className="block px-3 py-2 rounded hover:bg-white/10 transition-colors"
                        onClick={() => setContactOpen(false)}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Admin panel"
              title="Admin"
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <FaUserCircle size={20} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
