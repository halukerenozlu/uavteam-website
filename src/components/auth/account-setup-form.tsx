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
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
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

    // Simulate API call
    setTimeout(() => {
      // Mock account creation
      console.log("Account created:", formData);
      onAccountCreated();
      setIsCreating(false);
    }, 1500);
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
                <p className="text-muted-foreground text-balance">
                  Admin hesabınızı oluşturmak için gerekli bilgileri girin
                </p>
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
                  placeholder="En az 6 karakter"
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

              {/* <div className="grid gap-3">
                <Label htmlFor="confirm-password">Şifre Tekrar</Label>
                <Input
                  id="confirm-password"
                  type="password"
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
              </div> */}

              <div className="grid gap-3">
                <Label htmlFor="security-question">Güvenlik Sorusu</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("securityQuestion", value)
                  }
                >
                  <SelectTrigger className="!p-1">
                    <SelectValue placeholder="Güvenlik sorusu seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {securityQuestions.map((question, index) => (
                      <SelectItem key={index} value={question}>
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
