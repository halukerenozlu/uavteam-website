"use client";

import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccountSetupFormProps extends React.ComponentProps<"div"> {
  onAccountCreated: () => void;
  onBackToLogin: () => void;
}

export function AccountSetupForm({
  className,
  onAccountCreated,
  onBackToLogin,
  ...props
}: AccountSetupFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);

  const [serverError, setServerError] = useState("");

  const securityQuestions = [
    "İlk evcil hayvanınızın adı neydi?",
    "Doğduğunuz şehir neresidir?",
    "En sevdiğiniz öğretmeninizin soyadı neydi?",
    "İlk arabanızın markası neydi?",
    "Annenizin kızlık soyadı nedir?",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Kullanıcı adı gereklidir";
    } else if (formData.username.length < 5) {
      newErrors.username = "Kullanıcı adı en az 5 karakter olmalıdır";
    }

    if (!formData.password) {
      newErrors.password = "Şifre gereklidir";
    } else if (formData.password.length < 8) {
      newErrors.password = "Şifre en az 8 karakter olmalıdır";
    }

    if (!formData.securityQuestion) {
      newErrors.securityQuestion = "Güvenlik sorusu seçiniz";
    }

    if (!formData.securityAnswer.trim()) {
      newErrors.securityAnswer = "Güvenlik cevabı gereklidir";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsCreating(true);
    setServerError("");

    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
          securityQuestion: formData.securityQuestion,
          securityAnswer: formData.securityAnswer,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        setServerError(data?.error || "Kayıt başarısız.");
        return;
      }

      onAccountCreated(); // burada yönlendirme yapıyorsun (ör. /admin/dashboard)
    } catch {
      setServerError("Ağ/Sunucu hatası.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid !p-5">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  Hesap Bilgilerini Tamamla
                </h1>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="setup-username">Kullanıcı Adı</Label>
                <Input
                  id="setup-username"
                  type="text"
                  className="!p-1"
                  placeholder="En az 5 karakter"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  required
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="setup-password">Şifre Oluştur</Label>
                <Input
                  id="setup-password"
                  type="password"
                  className="!p-1"
                  placeholder="En az 8 karakter"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirm-password">Şifre Tekrar</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  className="!p-1"
                  placeholder="Şifrenizi tekrar girin"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="security-question">Güvenlik Sorusu</Label>
                <Select
                  value={formData.securityQuestion}
                  onValueChange={(value) =>
                    handleInputChange("securityQuestion", value)
                  }
                >
                  {/* Trigger tam genişlik */}
                  <SelectTrigger className="w-full !p-1">
                    <SelectValue placeholder="Güvenlik sorusu seçin" />
                  </SelectTrigger>

                  {/* Popper pozisyonu: yerleşim daha stabil olur */}
                  <SelectContent position="popper" sideOffset={4} align="start">
                    {securityQuestions.map((question, index) => (
                      <SelectItem className="!p-1" key={index} value={question}>
                        {question}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.securityQuestion && (
                  <p className="text-sm text-red-600">
                    {errors.securityQuestion}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="security-answer">
                  Güvenlik Sorusunun Cevabı
                </Label>
                <Input
                  id="security-answer"
                  type="text"
                  className="!p-1"
                  value={formData.securityAnswer}
                  onChange={(e) =>
                    handleInputChange("securityAnswer", e.target.value)
                  }
                  required
                />
                {errors.securityAnswer && (
                  <p className="text-sm text-red-600">
                    {errors.securityAnswer}
                  </p>
                )}
              </div>

              {/* Hata mesajı (API'den gelen) */}
              {serverError && (
                <p className="text-sm text-red-600" role="alert">
                  {serverError}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? "Hesap Oluşturuluyor..." : "Hesabı Oluştur"}
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
