"use client";

import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordResetFormProps extends React.ComponentProps<"div"> {
  username: string; // ← eklendi (Forgot’tan gelir)
  securityAnswer: string; // ← eklendi (Forgot’tan gelir)
  onPasswordReset: () => void;
  onBackToLogin: () => void;
}

export function PasswordResetForm({
  className,
  username,
  securityAnswer,
  onPasswordReset,
  onBackToLogin,
  ...props
}: PasswordResetFormProps) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isResetting, setIsResetting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [serverError, setServerError] = useState(""); // ← eklendi

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "Yeni şifre gereklidir";
    } else if (formData.newPassword.length < 8) {
      // 8 önerilir
      newErrors.newPassword = "Şifre en az 8 karakter olmalıdır";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Şifre tekrarı gereklidir";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsResetting(true);
    setServerError("");

    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          securityAnswer: securityAnswer.trim(),
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setShowSuccess(true);
        // 3 sn sonra login'e dön
        setTimeout(() => {
          onPasswordReset();
        }, 3000);
      } else {
        setServerError(data?.error || "İşlem başarısız.");
      }
    } catch {
      setServerError("Sunucuya bağlanılamadı. Tekrar deneyin.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (showSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid !p-10">
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-green-600">
                    Şifre Başarıyla Değiştirildi
                  </h1>
                </div>
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
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Yeni Şifre Oluştur</h1>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="new-password">Yeni Şifre</Label>
                <Input
                  id="new-password"
                  type="password"
                  className="!p-1"
                  autoComplete="new-password"
                  placeholder="En az 8 karakter"
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange("newPassword", e.target.value)
                  }
                  required
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirm-new-password">Yeni Şifre Tekrar</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  className="!p-1"
                  autoComplete="new-password"
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

              {/* Sunucu hatası */}
              {serverError && (
                <p className="text-sm text-red-600">{serverError}</p>
              )}

              <Button type="submit" className="w-full" disabled={isResetting}>
                {isResetting ? "Şifre Güncelleniyor..." : "Şifreyi Güncelle"}
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
        </CardContent>
      </Card>
    </div>
  );
}
