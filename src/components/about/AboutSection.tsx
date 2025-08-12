"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 bg-white text-black py-16">
      <div className="h-[40px]" />

      {/* DIŞ KAP: tam sayfa ve ortalama */}
      <div className="w-full flex justify-center">
        {/* İÇ KAP: genişliği belirli + ortalı */}
        <div className="w-[75vw] max-w-[1200px] px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Sol: Sticky görsel */}
            <div className="relative h-[340px] md:h-[520px] overflow-hidden shadow-md md:sticky md:top-24 rounded-xl">
              <Image
                src="/anka-3.png"
                alt="About Kuasar UAV"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Sağ: İçerik */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-4xl font-bold">About</h2>
                <div className="h-[10px]" />
                <div className="mt-3 w-140 h-1 bg-red-500 mx-auto" />
                <div className="h-[40px]" />
              </div>

              <p className="text-lg leading-relaxed text-gray-800">
                Kuasar UAV Team; otonom uçuş, görev planlama ve gerçek zamanlı
                görüntü işleme alanlarında çalışan, yenilikçi bir öğrenci
                topluluğu. Yarışma ve saha görevlerinde güvenilir,
                ölçeklenebilir ve modüler İHA sistemleri geliştiriyoruz.
              </p>
              <div className="h-[40px]" />
              {/* 3’lü değer kartları */}
              <div className="grid sm:grid-cols-3 justify-center gap-4 pt-2 px-6">
                <div className="rounded-lg border p-4 shadow-sm hover:shadow-md transition">
                  <div className="text-sm font-semibold text-red-600 text-center">
                    Misyon
                  </div>
                  <div className="mt-1 text-sm text-gray-700 text-center">
                    Sahada karşılığı olan otonom çözümler.
                  </div>
                </div>
                <div className="rounded-lg border p-4 shadow-sm hover:shadow-md transition">
                  <div className="text-sm font-semibold text-red-600 text-center">
                    Vizyon
                  </div>
                  <div className="mt-1 text-sm text-gray-700 text-center">
                    Öğrenciden mühendise giden üretim kültürü.
                  </div>
                </div>
                <div className="rounded-lg border p-4 shadow-sm hover:shadow-md transition">
                  <div className="text-sm font-semibold text-red-600 text-center">
                    Değerler
                  </div>
                  <div className="mt-1 text-sm text-gray-700 text-center">
                    Güvenilirlik · Ölçeklenebilirlik · Takım ruhu
                  </div>
                </div>
              </div>
              <div className="h-[30px]" />
              {/* İstatistik şeridi */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <StatBox value="3" label="Vehicles" />
                <StatBox value="5+" label="Competitions" />
                <StatBox value="20+" label="Members" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[40px]" />
    </section>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border p-4 text-center shadow-sm">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}
