"use client";

import type React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps extends React.ComponentProps<"div"> {
  onShowRegister?: () => void;
  onShowForgotPassword?: () => void;
  onLoginSubmit?: (v: { username: string; password: string }) => void;
}

export function LoginForm({
  className,
  onShowRegister,
  onShowForgotPassword,
  onLoginSubmit,
  ...props
}: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      onLoginSubmit?.({ username, password });

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // cookie için şart
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data?.message || "Giriş başarısız");
        return;
      }

      router.replace(next); // middleware geçilecek ve dashboard’a girilecek
    } catch {
      setErr("Ağ hatası");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid !p-10">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Yönetici Paneli</h1>
                <p className="text-muted-foreground text-balance">
                  Yönetici hesabınızla giriş yapın
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  className="!p-1"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Şifre</Label>
                  <button
                    type="button"
                    onClick={onShowForgotPassword}
                    className="text-sm text-muted-foreground hover:text-primary underline"
                  >
                    Şifremi unuttum
                  </button>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="!p-1"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>

              {err && <p className="text-sm text-red-600 text-center">{err}</p>}

              <div className="text-center text-sm text-muted-foreground">
                Hesabınız yok mu?{" "}
                <button
                  type="button"
                  onClick={onShowRegister}
                  className="text-primary hover:underline font-medium"
                >
                  Hesap oluştur
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
