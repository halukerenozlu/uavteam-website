// src/app/admin/_components/Topbar.tsx
"use client";

import LogoutButton from "./LogoutButton";

export default function Topbar({
  onMenuClick,
  isMenuOpen,
  user,
}: {
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
  user?: { username?: string } | null;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b bg-background/80 backdrop-blur flex items-center justify-between !px-4">
      <div className="flex items-center gap-3">
        {/* Hamburger (mobil) */}
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden rounded-md border !px-2 !py-1.5 text-md hover:bg-muted"
          aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={!!isMenuOpen}
          aria-controls="admin-mobile-drawer"
        >
          {isMenuOpen ? (
            // X ikon
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6l-12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            // Hamburger
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 font-medium text-red-500">
        YÖNETİM PANELİ
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden sm:inline text-sm text-muted-foreground">
          Merhaba, {user?.username ?? "admin"} 👋
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}
