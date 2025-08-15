"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaUserCircle,
} from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

const leftLinks = [
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Join Us", href: "/team#join" },
];

const rightLinks: Array<{
  label: string;
  href: string;
  external?: boolean;
  icon?: React.ReactNode;
}> = [
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
  // Scroll ile gizle/göster
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Mobil dropdown state'leri
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const pathname = usePathname();

  // Sayfa değişince dropdown'ları kapat
  useEffect(() => {
    setMenuOpen(false);
    setContactOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY) setShowHeader(true);
      else if (currentScrollY > 100) setShowHeader(false);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 z-50 w-full bg-black h-[10vh] text-white transition-transform duration-500 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* İç düzen: 3 sütunlu grid -> Sol | Orta (Logo) | Sağ */}
      <div className="mx-4 h-full px-2">
        <div className="grid grid-cols-3 items-center h-full">
          {/* SOL HÜCRE */}
          {/* Desktop sol linkler */}
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

          {/* Mobil: Menu dropdown (sola) */}
          <div className="flex items-center min-[821px]:hidden !p-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen((v) => !v);
                  setContactOpen(false);
                }}
                className="px-3 py-1.5 rounded-md border border-white/30 inline-flex items-center gap-1 hover:bg-white/10 transition-colors !p-2"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu-dropdown"
              >
                Menu <FiChevronDown />
              </button>

              {menuOpen && (
                <div
                  id="mobile-menu-dropdown"
                  className="absolute left-[3px] mt-2 w-40 rounded-md border bg-black shadow-lg !p-2 z-50 origin-top-left "
                >
                  {leftLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-3 py-2 rounded hover:bg-white/10 transition-colors"
                      onClick={() => setMenuOpen(false)} // Tıkla → kapat
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ORTA HÜCRE — Logo her zaman grid'in tam ortasında */}
          <div className="flex justify-center">
            {/* Desktop logo */}
            <Link href="/" className="hidden min-[821px]:block">
              <Image
                src="/kuasarlogo.jpg"
                alt="Kuasar Logo"
                width={48}
                height={48}
                priority
              />
            </Link>
            {/* Mobil logo */}
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

          {/* SAĞ HÜCRE */}
          {/* Desktop sağ menü */}
          <div className="hidden min-[821px]:flex items-center justify-end gap-4 px-6 !p-2">
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
            {rightLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                >
                  {link.icon ?? null}
                  {/* Ikonlu sosyal linklerde görünmez metin */}
                  {link.icon ? (
                    <span className="sr-only">{link.label}</span>
                  ) : (
                    link.label
                  )}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-gray-300 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Mobil: Contact dropdown + Admin (sağa hizalı) */}
          <div className="flex items-center justify-end gap-2 min-[821px]:hidden !p-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setContactOpen((v) => !v);
                  setMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-md border border-white/30 inline-flex items-center gap-1 hover:bg-white/10 transition-colors !p-2"
                aria-haspopup="menu"
                aria-expanded={contactOpen}
                aria-controls="mobile-contact-dropdown"
              >
                Contact <FiChevronDown />
              </button>

              {contactOpen && (
                <div
                  id="mobile-contact-dropdown"
                  className="absolute right-[3px] mt-2 w-48 rounded-md border bg-black shadow-lg !p-2 z-50 origin-top-right"
                >
                  {rightLinks.map((link) =>
                    link.external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition-colors"
                        onClick={() => setContactOpen(false)} // Tıkla → kapat
                      >
                        {link.icon ?? null}
                        <span>{link.label}</span>
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-3 py-2 rounded hover:bg-white/10 transition-colors"
                        onClick={() => setContactOpen(false)} // Tıkla → kapat
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Admin (her zaman görünür) */}
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
