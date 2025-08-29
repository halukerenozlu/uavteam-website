// src/app/admin/_components/LogoutButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onLogout() {
    setLoading(true);
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });
    router.replace("/admin");
    router.refresh(); // state temizliği
    // Güçlü garanti istersen (opsiyonel):
    // setTimeout(() => location.replace("/admin"), 0);
  }

  return (
    <Button
      onClick={onLogout}
      disabled={loading}
      className="rounded-md border px-3 py-1.5 text-sm  disabled:opacity-60 my-2 !p-3"
    >
      {loading ? "Çıkış yapılıyor" : "Çıkış Yap"}
    </Button>
  );
}
