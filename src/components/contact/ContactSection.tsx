"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
});

export default function ContactSection() {
  const address = `Kirazpınar, DPÜ Evliya Çelebi Yerleşkesi, Kütahya Tavşanlı Yolu 10. km
43000 Kütahya Merkez/Kütahya`;

  const lat = 39.48111268702931;
  const lng = 29.899136814730053;

  return (
    <section
      id="contact"
      className="bg-club-white text-club-black py-16 min-h-[calc(100vh-80px)]"
    >
      {/* İçerik */}
      <section>
        <div className="h-[20px]" />
        <div className="container mx-auto px-8">
          <div className="grid gap-72 md:grid-cols-2 items-start">
            {/* Sol taraf */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">E-posta</h2>
                <Link
                  href="mailto:info@kuasar-uav.com"
                  className="inline-flex items-center gap-2 text-lg hover:text-club-red transition-colors"
                >
                  <Mail size={20} />
                  info@kuasar-uav.com
                </Link>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">Telefon</h2>
                <Link
                  href="tel:+902744434343"
                  className="text-lg hover:text-club-red transition-colors"
                >
                  +90 (274) 443 43 43
                </Link>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">Adres</h2>
                <p className="leading-relaxed whitespace-pre-line">{address}</p>
              </div>
            </div>

            {/* Sağ taraf: Leaflet Map */}
            <div className="w-full h-[350px] rounded-lg overflow-hidden border border-club-black/10 content-end">
              <LeafletMap
                lat={lat}
                lng={lng}
                popup={address.replace(/\n/g, "<br/>")}
              />
            </div>
          </div>

          {/* Haritalarda aç linki */}
          <div className="mt-4 text-sm text-right">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Haritalarda Aç
            </a>
          </div>
        </div>
        <div className="h-[20px]" />
      </section>
    </section>
  );
}
