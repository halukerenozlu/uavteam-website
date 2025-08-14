# 📋 Kuasar UAV Team – SEO Açılış Kontrol Listesi

Bu liste, siteyi test modundan çıkarıp herkese açarken yapılacak adımları içerir.

---

## 1️⃣ Arama Motoru Engellerini Kaldır

- `app/robots.ts` → `disallow: ["/"]` kuralını kaldır.

  ```ts
  export default function robots() {
    return {
      rules: [{ userAgent: "*", allow: ["/"] }],
      sitemap: "https://kuasaruavteam.com/sitemap.xml",
    };
  }
  ```

- next.config.ts → X-Robots-Tag ekleyen headers() fonksiyonunu sil veya sadece /admin yollarına uygula.

# layout.tsx veya \_document.tsx içine:

```export const metadata = {
title: "Kuasar UAV Team",
description: "Kuasar UAV Team Official Website – Innovative UAV Solutions",
keywords: ["Kuasar", "UAV", "drone", "team", "aerospace"],
authors: [{ name: "Kuasar UAV Team" }],
openGraph: {
title: "Kuasar UAV Team",
description: "Innovative UAV Solutions and Drone Technologies",
url: "https://kuasaruavteam.com",
siteName: "Kuasar UAV Team",
images: [
{
url: "https://kuasaruavteam.com/og-image.jpg",
width: 1200,
height: 630,
},
],
locale: "en_US",
type: "website",
},
};
```

- app/sitemap.ts oluştur:

```export default function sitemap() {
  return [
    { url: "https://kuasaruavteam.com", lastModified: new Date() },
    { url: "https://kuasaruavteam.com/vehicles", lastModified: new Date() },
  ];
}
```

# Görsellerin SEO’su

- Tüm Image component’lerine alt ekle.

```<Image src="/tea.jpg" alt="Kuasar UAV Team Members" width={500} height={500} />````

# Başlık Hiyerarşisi

- Sayfalarda h1 → h2 → h3 sıralaması kullan.

- Her sayfada yalnızca 1 tane h1 olsun.

# 6️⃣ URL Yapısı

- Gerekirse SEO uyumlu yollar kullan (/uav-vehicles gibi).

- Mevcut link yapısını bozmayacak şekilde düzenle.

# 7️⃣ Performans ve Mobil Uyumluluk

- Google Lighthouse testi: https://pagespeed.web.dev/

- Next.js Image Optimization kullanarak görsel boyutlarını küçült.

# 8️⃣ Schema.org Yapılandırılmış Veri

- layout.tsx içine JSON-LD ekle:

```
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Kuasar UAV Team",
      url: "https://kuasaruavteam.com",
      logo: "https://kuasaruavteam.com/logo.png",
    }),
  }}
/>
```

## ✅ Bu adımlar tamamlandığında site arama motorları için tamamen optimize edilmiş olur.

- SEO etkisi 2–4 hafta içinde görülmeye başlanır.
