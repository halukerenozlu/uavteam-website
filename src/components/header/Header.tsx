// src/components/header/Header.tsx
"use client";

import { useEffect, useState } from "react";
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

// shadcn/ui
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
] as const;

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
  const pathname = usePathname();

  // DB'den gelen sosyal URL’ler (varsayılan: static rightLinks)
  const [socialUrls, setSocialUrls] = useState<{
    Instagram?: string;
    LinkedIn?: string;
    YouTube?: string;
  }>(() => ({
    Instagram: rightLinks.find((r) => r.label === "Instagram")?.href,
    LinkedIn: rightLinks.find((r) => r.label === "LinkedIn")?.href,
    YouTube: rightLinks.find((r) => r.label === "YouTube")?.href,
  }));

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

  // Sosyal linkleri API'den çek (server action KULLANMADAN)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch("/api/social-links", { cache: "no-store" });
        if (!mounted || !resp.ok) return;
        const data = (await resp.json()) as {
          Instagram?: string;
          LinkedIn?: string;
          YouTube?: string;
        };
        setSocialUrls((prev) => ({
          Instagram: data.Instagram || prev.Instagram,
          LinkedIn: data.LinkedIn || prev.LinkedIn,
          YouTube: data.YouTube || prev.YouTube,
        }));
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [pathname]);

  // yardımcı: sosyal link override
  const resolveHref = (label: RightLink["label"], fallback: string) => {
    if (label === "Instagram") return socialUrls.Instagram ?? fallback;
    if (label === "LinkedIn") return socialUrls.LinkedIn ?? fallback;
    if (label === "YouTube") return socialUrls.YouTube ?? fallback;
    return fallback;
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full bg-black h-[10vh] text-white transition-transform duration-500 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-4 h-full px-2">
        <div className="grid grid-cols-3 items-center h-full">
          {/* SOL (Desktop nav) */}
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

          {/* Mobil: Sol taraftaki sayfalar için DropdownMenu */}
          <div className="flex items-center min-[821px]:hidden !p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="px-3 py-1.5 h-auto rounded-md border border-white/30 bg-transparent text-white hover:bg-white/10 !p-2"
                >
                  Menu <FiChevronDown className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-44 bg-black text-white border border-white/20"
              >
                <DropdownMenuSeparator className="bg-white/10" />
                {leftLinks.map((link) => (
                  <DropdownMenuItem
                    key={link.href}
                    asChild
                    className="focus:bg-white/10 focus:text-white !p-2"
                  >
                    <Link href={link.href} className="w-full">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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

          {/* SAĞ (Desktop sosyal + admin) */}
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
              const href = resolveHref(link.label, link.href);
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

          {/* Mobil SAĞ: Contact dropdown + Admin */}
          <div className="flex items-center justify-end gap-2 min-[821px]:hidden !p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="px-3 py-1.5 h-auto rounded-md border border-white/30 bg-transparent text-white hover:bg-white/10 !p-2"
                >
                  Contact <FiChevronDown className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-56 bg-black text-white border border-white/20 !p-2"
              >
                <DropdownMenuSeparator className="bg-white/10" />
                {rightLinks.map((link) => {
                  const href = resolveHref(link.label, link.href);
                  // dış link ise <a>, değilse <Link>
                  return link.external ? (
                    <DropdownMenuItem
                      key={link.label}
                      asChild
                      className="focus:bg-white/10 focus:text-white !p-2"
                    >
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        {link.icon ?? null}
                        <span>{link.label}</span>
                      </a>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      key={link.label}
                      asChild
                      className="focus:bg-white/10 focus:text-white"
                    >
                      <Link href={href} className="flex items-center gap-2">
                        {link.icon ?? null}
                        <span>{link.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

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
