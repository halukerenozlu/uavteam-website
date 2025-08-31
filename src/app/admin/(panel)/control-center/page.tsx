// src/app/admin/(panel)/control-center/page.tsx
import type { Metadata } from "next";
import { ControlCenterCards } from "@/app/admin/_components/control-center/ControlCenterCards";

export const metadata: Metadata = {
  title: "Control Center",
  description: "Kuasar Admin Control Center",
};

export default function ControlCenterPage() {
  return (
    <main className="min-h-svh !pt-20 !m-6">
      <div className="p-6">
        <div className="mt-6">
          <ControlCenterCards />
        </div>
      </div>
    </main>
  );
}
