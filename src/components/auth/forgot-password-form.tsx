"use client";

import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForgotPasswordFormProps extends React.ComponentProps<"div"> {
  // ✨ Reset adımına geçmek için username + securityAnswer'ı yukarı gönderiyoruz
  onPasswordResetAllowed: (p: {
    username: string;
    securityAnswer: string;
  }) => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({
  className,
  onPasswordResetAllowed,
  onBackToLogin,
  ...props
}: ForgotPasswordFormProps) {
  const [username, setUsername] = useState("");
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Kullanıcı adını gönder → güvenlik sorusunu DB'den getir
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const name = username.trim();
    if (!name) {
      setError("Kullanıcı adı gerekli");
      return;
    }

    try {
      const res = await fetch("/api/admin/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok && data.securityQuestion) {
        setSecurityQuestion(String(data.securityQuestion));
        setShowSecurityQuestion(true);
      } else {
        setError(data?.error || "Kullanıcı bulunamadı");
      }
    } catch {
      setError("Sunucuya bağlanılamadı. Tekrar deneyin.");
    }
  };

  // Cevabı al → reset adımına geç (doğrulama /api/admin/reset’te yapılacak)
  const handleSecurityAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    const name = username.trim();
    const answer = securityAnswer.trim();

    if (!answer) {
      setError("Cevap gerekli");
      setIsVerifying(false);
      return;
    }

    // Doğrulamayı reset endpoint'i yapacak; biz sadece bir sonraki adıma geçiyoruz
    onPasswordResetAllowed({ username: name, securityAnswer: answer });
    setIsVerifying(false);
  };

  const resetForm = () => {
    setUsername("");
    setShowSecurityQuestion(false);
    setSecurityQuestion("");
    setSecurityAnswer("");
    setError("");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid !p-10">
          {!showSecurityQuestion ? (
            <form onSubmit={handleUsernameSubmit} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Şifremi Unuttum</h1>
                  <p className="text-muted-foreground text-balance">
                    Kullanıcı adınızı girin, güvenlik sorunuzu cevaplayın
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="forgot-username">Kullanıcı Adı</Label>
                  <Input
                    id="forgot-username"
                    type="text"
                    autoComplete="username"
                    className="!p-1"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  {error && <p className="text-sm text-red-600">{error}</p>}
                </div>

                <Button type="submit" className="w-full">
                  Devam Et
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="text-primary hover:underline font-medium"
                  >
                    Giriş sayfasına dön
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSecurityAnswerSubmit} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Güvenlik Sorusu</h1>
                  <p className="text-muted-foreground text-balance">
                    Güvenlik sorunuzu cevaplayın
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-medium text-center">{securityQuestion}</p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="security-answer">Cevabınız</Label>
                  <Input
                    id="security-answer"
                    type="text"
                    className="!p-1"
                    placeholder="Güvenlik sorusunun cevabını girin"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    required
                  />
                  {error && <p className="text-sm text-red-600">{error}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isVerifying}>
                  {isVerifying ? "Devam ediliyor..." : "Devam Et"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-primary hover:underline font-medium !mr-6"
                  >
                    Geri
                  </button>
                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="text-primary hover:underline font-medium"
                  >
                    Giriş sayfasına dön
                  </button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
