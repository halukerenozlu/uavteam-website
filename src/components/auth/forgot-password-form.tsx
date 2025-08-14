"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForgotPasswordFormProps extends React.ComponentProps<"div"> {
  onPasswordResetAllowed: () => void;
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
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [isBlocked, setIsBlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Mock user data - in real app this would come from database
  const mockUserData = {
    username: "admin",
    securityQuestion: "İlk evcil hayvanınızın adı neydi?",
    securityAnswer: "karabaş",
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBlocked && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            setAttemptsLeft(3);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBlocked, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username.toLowerCase() === mockUserData.username.toLowerCase()) {
      setSecurityQuestion(mockUserData.securityQuestion);
      setShowSecurityQuestion(true);
    } else {
      setError("Kullanıcı bulunamadı");
    }
  };

  const handleSecurityAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    setTimeout(() => {
      if (
        securityAnswer.toLowerCase().trim() ===
        mockUserData.securityAnswer.toLowerCase()
      ) {
        // Correct answer - allow password reset
        onPasswordResetAllowed();
      } else {
        // Wrong answer
        const newAttemptsLeft = attemptsLeft - 1;
        setAttemptsLeft(newAttemptsLeft);

        if (newAttemptsLeft === 0) {
          // Block user for 30 minutes (1800 seconds)
          setIsBlocked(true);
          setTimeLeft(1800);
          setShowSecurityQuestion(false);
          setError(
            "3 yanlış deneme yaptınız. 30 dakika sonra tekrar deneyebilirsiniz."
          );
        } else {
          setError(`Yanlış cevap. ${newAttemptsLeft} hakkınız kaldı.`);
        }
        setSecurityAnswer("");
      }
      setIsVerifying(false);
    }, 1000);
  };

  const resetForm = () => {
    setUsername("");
    setShowSecurityQuestion(false);
    setSecurityQuestion("");
    setSecurityAnswer("");
    setError("");
  };

  if (isBlocked) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid !p-10">
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-red-600">
                    Hesap Geçici Olarak Kilitlendi
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    3 yanlış deneme yaptığınız için hesabınız geçici olarak
                    kilitlendi.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Kalan süre sonunda tekrar deneyebilirsiniz
                  </p>
                </div>

                <Button
                  onClick={onBackToLogin}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  Giriş Sayfasına Dön
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                    placeholder="Güvenlik sorusunun cevabını girin"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    required
                  />
                  {error && <p className="text-sm text-red-600">{error}</p>}
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Kalan hakkınız:{" "}
                  <span className="font-bold text-primary">{attemptsLeft}</span>
                </div>

                <Button type="submit" className="w-full" disabled={isVerifying}>
                  {isVerifying ? "Doğrulanıyor..." : "Cevabı Doğrula"}
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
