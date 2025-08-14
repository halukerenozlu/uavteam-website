"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps extends React.ComponentProps<"div"> {
  onShowRegister?: () => void; // ✅ opsiyonel
  onShowForgotPassword?: () => void; // ✅ opsiyonel
  onLoginSubmit?: (v: { username: string; password: string }) => void; // ✅ opsiyonel
}

export function LoginForm({
  className,
  onShowRegister,
  onShowForgotPassword,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid !p-10">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Yönetici Paneli</h1>
                <p className="text-muted-foreground text-balance">
                  Yönetici hesabınızla giriş yapın
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input id="username" type="text" required />
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
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Giriş Yap
              </Button>
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
