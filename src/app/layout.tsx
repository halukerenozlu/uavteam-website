// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Henüz oluşturmadıysanız, bu iki dosyayı components/header ve components/footer klasöründe oluşturacağız
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kuasar UAV Team",
  description: "İnsansız hava araçları kulübü tanıtım sitesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Header sabit olarak her sayfada görünecek */}
        <Header />

        {/* Ana içerik akışı */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
