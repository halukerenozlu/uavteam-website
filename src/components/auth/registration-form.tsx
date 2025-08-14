"use client";

import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegistrationFormProps extends React.ComponentProps<"div"> {
  onCodeVerified: () => void;
  onBackToLogin: () => void;
}

export function RegistrationForm({
  className,
  onCodeVerified,
  onBackToLogin,
  ...props
}: RegistrationFormProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (code === "ADMIN2025") {
        // Mock verification code
        onCodeVerified();
      } else {
        setError("Geçersiz kod. Lütfen tekrar deneyin.");
      }
      setIsVerifying(false);
    }, 1000);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid !p-10">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Hesap Oluştur</h1>
                <p className="text-muted-foreground text-balance">
                  Admin hesabı oluşturmak için tek seferlik kodu girin
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="verification-code">Doğrulama Kodu</Label>
                <Input
                  id="verification-code"
                  type="text"
                  className="!p-1"
                  placeholder="Tek seferlik kodu girin"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying ? "Doğrulanıyor..." : "Kodu Doğrula"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Zaten hesabınız var mı?{" "}
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-primary hover:underline font-medium"
                >
                  Giriş yap
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
