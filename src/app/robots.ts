export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/"], // tüm yolları engelle
      },
    ],
    sitemap: null, // sitemap kapalı
  };
}
