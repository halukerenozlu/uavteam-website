// src/app/admin/(panel)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../_components/Sidebar";
import Topbar from "../_components/Topbar";

export default function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // 🔒 Oturumu mount'ta ve geri/visible olduğunda doğrula
  useEffect(() => {
    const verify = async () => {
      const res = await fetch("/api/admin/me", {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) router.replace("/admin");
    };

    // İlk yüklemede kontrol
    verify();

    // BFCache dönüşlerinde tetikle
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) verify();
    };
    window.addEventListener("pageshow", onPageShow);

    // Sekme görünür olduğunda tetikle
    const onVis = () => {
      if (document.visibilityState === "visible") verify();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [router]);

  // Esc ile mobil menü kapat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-svh">
      {/* Üstte sabit Topbar */}
      <Topbar onMenuClick={() => setOpen((o) => !o)} isMenuOpen={open} />

      {/* Topbar yüksekliği kadar üst boşluk */}
      <div className="pt-14 grid md:grid-cols-[260px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block sticky top-14 h-[calc(100vh-56px)] border-r bg-background">
          <Sidebar />
        </aside>

        {/* İçerik */}
        <main className="p-4">{children}</main>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          open ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`fixed top-14 left-0 h-[calc(100vh-56px)] w-72 bg-background border-r shadow-lg transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}`}
          role="dialog"
          aria-modal="true"
          aria-label="Menü"
        >
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
