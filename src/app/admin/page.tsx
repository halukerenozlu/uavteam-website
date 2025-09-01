// src/app/admin/page.tsx
"use client";
import type React from "react";
import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RegistrationForm } from "@/components/auth/registration-form";
import { AccountSetupForm } from "@/components/auth/account-setup-form";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { PasswordResetForm } from "@/components/auth/password-reset-form";
import LoginHistoryGuard from "./_components/LoginHistoryGuard";
import Image from "next/image";

type AuthView =
  | "login"
  | "register"
  | "accountSetup"
  | "forgotPassword"
  | "passwordReset";

// 🔑 Forgot -> Reset arasında taşıyacağımız veri
type ResetPayload = {
  username: string;
  securityAnswer: string;
};

export default function LoginPage() {
  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [resetPayload, setResetPayload] = useState<ResetPayload | null>(null);

  const handleShowRegister = () => setCurrentView("register");
  const handleShowLogin = () => setCurrentView("login");
  const handleShowForgotPassword = () => setCurrentView("forgotPassword");
  const handleCodeVerified = () => setCurrentView("accountSetup");
  const handleAccountCreated = () => setCurrentView("login");

  // ✅ Forgot formundan gerçek username+securityAnswer gelecek
  const handlePasswordResetAllowed = (p: ResetPayload) => {
    setResetPayload(p);
    setCurrentView("passwordReset");
  };

  const handlePasswordReset = () => {
    // reset sonrası login'e dön
    setCurrentView("login");
    setResetPayload(null);
  };

  const renderCurrentForm = () => {
    switch (currentView) {
      case "register":
        return (
          <RegistrationForm
            onCodeVerified={handleCodeVerified}
            onBackToLogin={handleShowLogin}
          />
        );
      case "accountSetup":
        return (
          <AccountSetupForm
            onAccountCreated={handleAccountCreated}
            onBackToLogin={handleShowLogin}
          />
        );
      case "forgotPassword":
        return (
          <ForgotPasswordForm
            onPasswordResetAllowed={handlePasswordResetAllowed} // ← p parametresi alacak
            onBackToLogin={handleShowLogin}
          />
        );
      case "passwordReset":
        // Guard: sayfayı yenilerse payload yoksa forgot'a yönlendir
        if (!resetPayload) {
          return (
            <div className="p-6">
              <p className="mb-4">Önce güvenlik sorusunu cevaplayın.</p>
              <button className="underline" onClick={handleShowForgotPassword}>
                Şifremi Unuttum
              </button>
            </div>
          );
        }
        return (
          <PasswordResetForm
            onPasswordReset={handlePasswordReset}
            onBackToLogin={handleShowLogin}
            username={resetPayload.username}
            securityAnswer={resetPayload.securityAnswer}
          />
        );
      default:
        return (
          <LoginForm
            onShowRegister={handleShowRegister}
            onShowForgotPassword={handleShowForgotPassword}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex">
      <LoginHistoryGuard />
      {/* Sol: Authentication Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8 max-[570px]:p-6">
        <div className="max-w-md w-full !px-4 !sm:px-0">
          {renderCurrentForm()}
        </div>
      </div>

      {/* Sağ: Görsel (820px altı tamamen gizlenir) */}
      <div className="flex-1 bg-gradient-to-br from-red-600 to-gray-950 flex items-center justify-center max-[820px]:hidden">
        <div className="text-center text-white p-8">
          <div className="w-64 h-64 rounded-lg flex items-center justify-center mb-6">
            <Image
              src="/kuasarlogo.jpg"
              alt="Kuasar"
              width={256}
              height={256}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
