// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        {/* Analytics'i kökte bırakırsan admin/public hepsi ölçümlenir.
           Sadece public'i ölçmek istersen Analytics'i (public)/layout.tsx'e taşı. */}
        <Analytics />
      </body>
    </html>
  );
}
